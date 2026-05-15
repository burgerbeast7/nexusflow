// ═══════════════════════════════════════════════════
// NexusFlow — AI Service
// NLP command processing, predictions, and automation
// ═══════════════════════════════════════════════════

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createLogger } from '@nexusflow/shared-utils';
import { aiRouter } from './routes/ai.routes';

dotenv.config();

const app = express();
const logger = createLogger('ai-service');
const PORT = process.env.AI_SERVICE_PORT || 3004;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'healthy', service: 'ai-service' });
});

app.use('/api/ai', aiRouter);

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error('AI Service error', { error: err.message });
  res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: err.message } });
});

app.listen(PORT, () => {
  logger.info(`🧠 AI Service running on port ${PORT}`);
});
