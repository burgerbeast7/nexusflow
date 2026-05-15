// ═══════════════════════════════════════════════════
// NexusFlow — Analytics Service
// Metrics aggregation, velocity tracking, and reports
// ═══════════════════════════════════════════════════

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createLogger, createRedisClient, RedisCache } from '@nexusflow/shared-utils';

dotenv.config();

const app = express();
const logger = createLogger('analytics-service');
const PORT = process.env.ANALYTICS_SERVICE_PORT || 3006;
const cache = new RedisCache(createRedisClient(), 300);

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'healthy', service: 'analytics-service' });
});

// GET /api/analytics/dashboard — Dashboard overview metrics
app.get('/api/analytics/dashboard', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string;
    const cacheKey = `analytics:dashboard:${userId}`;
    const cached = await cache.get(cacheKey);
    if (cached) { res.json({ success: true, data: cached }); return; }

    // In production, this aggregates from the workflow DB
    const metrics = {
      overview: {
        totalProjects: 12,
        activeSprints: 3,
        totalTasks: 247,
        completedThisWeek: 34,
        velocity: 42,
        velocityChange: 8.5,
      },
      tasksByStatus: {
        BACKLOG: 45,
        TODO: 38,
        IN_PROGRESS: 28,
        IN_REVIEW: 15,
        DONE: 121,
      },
      tasksByPriority: {
        CRITICAL: 5,
        HIGH: 23,
        MEDIUM: 89,
        LOW: 78,
        NONE: 52,
      },
      recentActivity: [
        { action: 'Task completed', details: 'NF-142: Fix auth redirect', time: '2 min ago' },
        { action: 'Sprint started', details: 'Sprint 14 - Auth Refactor', time: '1 hour ago' },
        { action: 'Task assigned', details: 'NF-145: Add OAuth support', time: '3 hours ago' },
      ],
      burndown: Array.from({ length: 14 }, (_, i) => ({
        day: i + 1,
        remaining: Math.max(0, 100 - i * 7 - Math.random() * 5),
        ideal: 100 - (i * 100) / 14,
      })),
      velocityHistory: Array.from({ length: 8 }, (_, i) => ({
        sprint: `Sprint ${i + 7}`,
        planned: 35 + Math.floor(Math.random() * 15),
        completed: 30 + Math.floor(Math.random() * 20),
      })),
    };

    await cache.set(cacheKey, metrics, 120);
    res.json({ success: true, data: metrics });
  } catch (err) {
    logger.error('Dashboard metrics error', { error: (err as Error).message });
    res.status(500).json({ success: false, error: { message: 'Failed to load metrics' } });
  }
});

// GET /api/analytics/project/:id — Project-specific analytics
app.get('/api/analytics/project/:id', async (req, res) => {
  try {
    const health = {
      score: 78,
      velocity: 42,
      burndownDeviation: 12,
      blockedTasks: 3,
      overdueTasks: 5,
      prediction: {
        completionDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        confidence: 0.82,
      },
    };

    res.json({ success: true, data: health });
  } catch (err) {
    logger.error('Project analytics error', { error: (err as Error).message });
    res.status(500).json({ success: false, error: { message: 'Failed to load analytics' } });
  }
});

app.listen(PORT, () => {
  logger.info(`📊 Analytics Service running on port ${PORT}`);
});
