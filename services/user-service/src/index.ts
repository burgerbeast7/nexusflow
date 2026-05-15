import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createLogger } from '@nexusflow/shared-utils';

dotenv.config();
const app = express();
const logger = createLogger('user-service');
const PORT = process.env.USER_SERVICE_PORT || 3002;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'healthy', service: 'user-service' });
});

// GET /api/users/profile
app.get('/api/users/profile', async (req, res) => {
  const userId = req.headers['x-user-id'];
  res.json({
    success: true,
    data: {
      id: userId,
      preferences: { theme: 'dark', language: 'en', notifications: { email: true, push: true, inApp: true, digest: 'realtime' } },
    },
  });
});

// GET /api/users/team
app.get('/api/users/team', async (_req, res) => {
  res.json({
    success: true,
    data: [
      { id: '1', name: 'Sarah Chen', email: 'sarah@nexusflow.dev', role: 'DEVELOPER', avatar: null, status: 'online' },
      { id: '2', name: 'Alex Rivera', email: 'alex@nexusflow.dev', role: 'MANAGER', avatar: null, status: 'online' },
      { id: '3', name: 'Jordan Kim', email: 'jordan@nexusflow.dev', role: 'DEVELOPER', avatar: null, status: 'away' },
      { id: '4', name: 'Maya Patel', email: 'maya@nexusflow.dev', role: 'DEVELOPER', avatar: null, status: 'offline' },
    ],
  });
});

app.listen(PORT, () => {
  logger.info(`👤 User Service running on port ${PORT}`);
});
