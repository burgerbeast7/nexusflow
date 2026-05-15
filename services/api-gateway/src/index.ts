// ═══════════════════════════════════════════════════
// NexusFlow — API Gateway
// The single entry point for all client requests.
// Handles routing, auth verification, rate limiting,
// and proxying to downstream microservices.
// ═══════════════════════════════════════════════════

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';
import { createLogger, createRedisClient, rateLimiter } from '@nexusflow/shared-utils';
import { authMiddleware } from './middleware/auth.middleware';
import { errorHandler } from './middleware/error.middleware';
import { metricsMiddleware, metricsEndpoint } from './middleware/metrics.middleware';
import { healthRouter } from './routes/health';

dotenv.config();

const app = express();
const logger = createLogger('api-gateway');
const redis = createRedisClient(process.env.REDIS_URL);
const PORT = process.env.API_GATEWAY_PORT || 3000;

// ── Global Middleware ───────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3100',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
}));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(morgan('combined', {
  stream: { write: (msg: string) => logger.info(msg.trim()) },
}));
app.use(metricsMiddleware);

// ── Rate Limiting ───────────────────────────────
app.use('/api', rateLimiter(redis, {
  windowMs: 60 * 1000,
  maxRequests: 100,
  keyPrefix: 'rl:api',
}));

// ── Health & Metrics ────────────────────────────
app.use('/health', healthRouter);
app.get('/metrics', metricsEndpoint);

// ── Service Routes ──────────────────────────────
// Routes that don't need auth
const publicPaths = ['/api/auth/login', '/api/auth/register', '/api/auth/refresh'];

// Auth Service (public routes)
app.use('/api/auth', createProxyMiddleware({
  target: `http://localhost:${process.env.AUTH_SERVICE_PORT || 3001}`,
  changeOrigin: true,
  pathRewrite: { '^/api/auth': '/api/auth' },
  on: {
    proxyReq: (_proxyReq, req) => {
      logger.debug(`Proxying ${req.method} ${req.url} → auth-service`);
    },
    error: (err, _req, res) => {
      logger.error('Auth service proxy error', { error: (err as Error).message });
      (res as express.Response).status(503).json({
        success: false,
        error: { code: 'SERVICE_UNAVAILABLE', message: 'Auth service is unavailable' },
      });
    },
  },
}));

// Protected routes — require JWT
app.use('/api', (req, res, next) => {
  if (publicPaths.includes(req.path)) return next();
  authMiddleware(redis)(req, res, next);
});

// User Service
app.use('/api/users', createProxyMiddleware({
  target: `http://localhost:${process.env.USER_SERVICE_PORT || 3002}`,
  changeOrigin: true,
  pathRewrite: { '^/api/users': '/api/users' },
  on: {
    error: (err, _req, res) => {
      logger.error('User service proxy error', { error: (err as Error).message });
      (res as express.Response).status(503).json({
        success: false,
        error: { code: 'SERVICE_UNAVAILABLE', message: 'User service is unavailable' },
      });
    },
  },
}));

// Workflow Service (Projects, Tasks, Sprints)
app.use('/api/projects', createProxyMiddleware({
  target: `http://localhost:${process.env.WORKFLOW_SERVICE_PORT || 3003}`,
  changeOrigin: true,
  pathRewrite: { '^/api/projects': '/api/projects' },
}));

app.use('/api/tasks', createProxyMiddleware({
  target: `http://localhost:${process.env.WORKFLOW_SERVICE_PORT || 3003}`,
  changeOrigin: true,
  pathRewrite: { '^/api/tasks': '/api/tasks' },
}));

app.use('/api/sprints', createProxyMiddleware({
  target: `http://localhost:${process.env.WORKFLOW_SERVICE_PORT || 3003}`,
  changeOrigin: true,
  pathRewrite: { '^/api/sprints': '/api/sprints' },
}));

// AI Service
app.use('/api/ai', createProxyMiddleware({
  target: `http://localhost:${process.env.AI_SERVICE_PORT || 3004}`,
  changeOrigin: true,
  pathRewrite: { '^/api/ai': '/api/ai' },
}));

// Analytics Service
app.use('/api/analytics', createProxyMiddleware({
  target: `http://localhost:${process.env.ANALYTICS_SERVICE_PORT || 3006}`,
  changeOrigin: true,
  pathRewrite: { '^/api/analytics': '/api/analytics' },
}));

// ── Error Handling ──────────────────────────────
app.use(errorHandler);

// ── 404 Handler ─────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: 'Route not found' },
  });
});

// ── Start Server ────────────────────────────────
app.listen(PORT, () => {
  logger.info(`🚀 API Gateway running on port ${PORT}`);
  logger.info(`📊 Metrics available at /metrics`);
  logger.info(`❤️  Health check at /health`);
});

export default app;
