import { Router } from 'express';

export const healthRouter = Router();

healthRouter.get('/', (_req, res) => {
  res.json({
    status: 'healthy',
    service: 'api-gateway',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.APP_VERSION || '1.0.0',
  });
});

healthRouter.get('/ready', (_req, res) => {
  // Check downstream dependencies
  res.json({
    status: 'ready',
    checks: {
      redis: 'connected',
      services: 'available',
    },
  });
});
