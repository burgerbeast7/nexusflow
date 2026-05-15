import { Router } from 'express';
import { validate } from '@nexusflow/shared-utils';
import type { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError, ErrorCode, RedisCache, createRedisClient } from '@nexusflow/shared-utils';

export const projectRouter = Router();
const prisma = new PrismaClient();
const cache = new RedisCache(createRedisClient(), 300);

// GET /api/projects
projectRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.headers['x-user-id'] as string;
    const cacheKey = `projects:${userId}`;
    
    // Check cache
    const cached = await cache.get(cacheKey);
    if (cached) {
      res.json({ success: true, data: cached });
      return;
    }

    const projects = await prisma.project.findMany({
      where: { ownerId: userId },
      include: {
        _count: { select: { tasks: true, sprints: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });

    await cache.set(cacheKey, projects);
    res.json({ success: true, data: projects });
  } catch (err) {
    next(err);
  }
});

// POST /api/projects
projectRouter.post('/', validate('createProject'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.headers['x-user-id'] as string;

    const project = await prisma.project.create({
      data: {
        ...req.body,
        ownerId: userId,
      },
    });

    // Create counter for task identifiers
    const prefix = project.name.substring(0, 3).toUpperCase();
    await prisma.counter.create({
      data: { projectId: project.id, prefix },
    });

    // Invalidate cache
    await cache.del(`projects:${userId}`);

    res.status(201).json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
});

// GET /api/projects/:id
projectRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: {
        tasks: {
          orderBy: { position: 'asc' },
          take: 50,
        },
        sprints: {
          orderBy: { startDate: 'desc' },
          take: 5,
        },
        _count: { select: { tasks: true, sprints: true } },
      },
    });

    if (!project) {
      throw new AppError(ErrorCode.NOT_FOUND, 'Project not found');
    }

    res.json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
});

// PUT /api/projects/:id
projectRouter.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.headers['x-user-id'] as string;

    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: req.body,
    });

    await cache.del(`projects:${userId}`);
    res.json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/projects/:id
projectRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.headers['x-user-id'] as string;

    await prisma.project.delete({
      where: { id: req.params.id },
    });

    await cache.del(`projects:${userId}`);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});
