import type { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError, ErrorCode, createRedisClient, RedisCache, createLogger } from '@nexusflow/shared-utils';
import type { TaskStatus, TaskPriority } from '@nexusflow/shared-types';

const prisma = new PrismaClient();
const redis = createRedisClient();
const cache = new RedisCache(redis, 120);
const logger = createLogger('task-controller');

export class TaskController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc', search } = req.query;
      const projectId = req.query.projectId as string;
      const status = req.query.status as TaskStatus;
      const priority = req.query.priority as TaskPriority;
      const assigneeId = req.query.assigneeId as string;
      const sprintId = req.query.sprintId as string;

      const where: Record<string, unknown> = {};
      if (projectId) where.projectId = projectId;
      if (status) where.status = status;
      if (priority) where.priority = priority;
      if (assigneeId) where.assigneeId = assigneeId;
      if (sprintId) where.sprintId = sprintId;
      if (search) {
        where.OR = [
          { title: { contains: search as string, mode: 'insensitive' } },
          { identifier: { contains: search as string, mode: 'insensitive' } },
        ];
      }

      const skip = (Number(page) - 1) * Number(limit);

      const [tasks, total] = await Promise.all([
        prisma.task.findMany({
          where,
          skip,
          take: Number(limit),
          orderBy: { [sortBy as string]: sortOrder },
          include: {
            _count: { select: { comments: true, subtasks: true } },
          },
        }),
        prisma.task.count({ where }),
      ]);

      res.json({
        success: true,
        data: tasks,
        meta: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.headers['x-user-id'] as string;
      const { projectId, ...taskData } = req.body;

      // Generate unique identifier (e.g., "NF-42")
      const counter = await prisma.counter.upsert({
        where: { projectId },
        update: { value: { increment: 1 } },
        create: { projectId, value: 1 },
      });

      const identifier = `${counter.prefix}-${counter.value}`;

      const task = await prisma.task.create({
        data: {
          ...taskData,
          projectId,
          identifier,
          reporterId: userId,
        },
      });

      // Log activity
      await prisma.activity.create({
        data: {
          action: 'created',
          taskId: task.id,
          userId,
        },
      });

      // Publish event for real-time updates
      await redis.publish('task:created', JSON.stringify(task));

      // Invalidate project cache
      await cache.invalidatePattern(`projects:*`);

      logger.info('Task created', { taskId: task.id, identifier });

      res.status(201).json({ success: true, data: task });
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const task = await prisma.task.findUnique({
        where: { id: req.params.id },
        include: {
          comments: {
            orderBy: { createdAt: 'desc' },
            take: 50,
          },
          activities: {
            orderBy: { createdAt: 'desc' },
            take: 20,
          },
          subtasks: true,
        },
      });

      if (!task) {
        throw new AppError(ErrorCode.NOT_FOUND, 'Task not found');
      }

      res.json({ success: true, data: task });
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.headers['x-user-id'] as string;
      const { id } = req.params;

      const existing = await prisma.task.findUnique({ where: { id } });
      if (!existing) {
        throw new AppError(ErrorCode.NOT_FOUND, 'Task not found');
      }

      // Track status changes
      const completedAt =
        req.body.status === 'DONE' && existing.status !== 'DONE'
          ? new Date()
          : req.body.status !== 'DONE' && existing.status === 'DONE'
            ? null
            : undefined;

      const task = await prisma.task.update({
        where: { id },
        data: {
          ...req.body,
          ...(completedAt !== undefined ? { completedAt } : {}),
        },
      });

      // Log activity for significant changes
      const changes: string[] = [];
      if (req.body.status && req.body.status !== existing.status) {
        changes.push('status_changed');
      }
      if (req.body.assigneeId && req.body.assigneeId !== existing.assigneeId) {
        changes.push('assigned');
      }
      if (req.body.priority && req.body.priority !== existing.priority) {
        changes.push('priority_changed');
      }

      for (const action of changes) {
        await prisma.activity.create({
          data: {
            action,
            taskId: id,
            userId,
            metadata: {
              from: existing[action === 'status_changed' ? 'status' : action === 'assigned' ? 'assigneeId' : 'priority'],
              to: req.body[action === 'status_changed' ? 'status' : action === 'assigned' ? 'assigneeId' : 'priority'],
            },
          },
        });
      }

      // Publish real-time update
      await redis.publish('task:updated', JSON.stringify(task));

      res.json({ success: true, data: task });
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await prisma.task.delete({ where: { id: req.params.id } });
      await redis.publish('task:deleted', JSON.stringify({ id: req.params.id }));
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  async addComment(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.headers['x-user-id'] as string;
      const { id } = req.params;
      const { content } = req.body;

      const comment = await prisma.comment.create({
        data: {
          content,
          taskId: id,
          authorId: userId,
        },
      });

      await prisma.activity.create({
        data: {
          action: 'commented',
          taskId: id,
          userId,
        },
      });

      res.status(201).json({ success: true, data: comment });
    } catch (err) {
      next(err);
    }
  }

  async move(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status, position, sprintId } = req.body;
      const userId = req.headers['x-user-id'] as string;

      const task = await prisma.task.update({
        where: { id },
        data: {
          ...(status ? { status } : {}),
          ...(position !== undefined ? { position } : {}),
          ...(sprintId !== undefined ? { sprintId } : {}),
        },
      });

      await redis.publish('task:moved', JSON.stringify({
        taskId: id,
        status: task.status,
        position: task.position,
        userId,
      }));

      res.json({ success: true, data: task });
    } catch (err) {
      next(err);
    }
  }
}
