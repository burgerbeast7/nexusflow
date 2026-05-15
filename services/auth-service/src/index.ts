// ═══════════════════════════════════════════════════
// NexusFlow — Auth Service
// Handles authentication, token management, and RBAC
// ═══════════════════════════════════════════════════

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createLogger } from '@nexusflow/shared-utils';
import { authRouter } from './routes/auth.routes';
import { errorHandler } from './middleware/error.middleware';

dotenv.config();

const app = express();
const logger = createLogger('auth-service');
const PORT = process.env.AUTH_SERVICE_PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'healthy', service: 'auth-service' });
});

// Routes
app.use('/api/auth', authRouter);

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`🔐 Auth Service running on port ${PORT}`);
});

export default app;
