// ═══════════════════════════════════════════════════
// NexusFlow — Workflow Service
// Core business logic for projects, tasks, and sprints
// ═══════════════════════════════════════════════════

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createLogger } from '@nexusflow/shared-utils';
import { projectRouter } from './routes/project.routes';
import { taskRouter } from './routes/task.routes';
import { sprintRouter } from './routes/sprint.routes';
import { errorHandler } from './middleware/error.middleware';

dotenv.config();

const app = express();
const logger = createLogger('workflow-service');
const PORT = process.env.WORKFLOW_SERVICE_PORT || 3003;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'healthy', service: 'workflow-service' });
});

// Routes
app.use('/api/projects', projectRouter);
app.use('/api/tasks', taskRouter);
app.use('/api/sprints', sprintRouter);

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`📋 Workflow Service running on port ${PORT}`);
});

export default app;
