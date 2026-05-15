import { Router } from 'express';
import { validate } from '@nexusflow/shared-utils';
import type { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError, ErrorCode } from '@nexusflow/shared-utils';

export const sprintRouter = Router();
const prisma = new PrismaClient();

// GET /api/sprints?projectId=xxx
sprintRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { projectId } = req.query;
    
    const sprints = await prisma.sprint.findMany({
      where: projectId ? { projectId: projectId as string } : {},
      include: {
        _count: { select: { tasks: true } },
        tasks: {
          select: { status: true, storyPoints: true },
        },
      },
      orderBy: { startDate: 'desc' },
    });

    // Calculate sprint metrics
    const sprintsWithMetrics = sprints.map((sprint) => {
      const totalPoints = sprint.tasks.reduce((sum, t) => sum + (t.storyPoints || 0), 0);
      const completedPoints = sprint.tasks
        .filter((t) => t.status === 'DONE')
        .reduce((sum, t) => sum + (t.storyPoints || 0), 0);

      return {
        ...sprint,
        tasks: undefined,
        metrics: {
          totalTasks: sprint._count.tasks,
          totalPoints,
          completedPoints,
          progress: totalPoints > 0 ? Math.round((completedPoints / totalPoints) * 100) : 0,
        },
      };
    });

    res.json({ success: true, data: sprintsWithMetrics });
  } catch (err) {
    next(err);
  }
});

// POST /api/sprints
sprintRouter.post('/', validate('createSprint'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Ensure no other active sprint in this project
    const activeSprint = await prisma.sprint.findFirst({
      where: { projectId: req.body.projectId, status: 'ACTIVE' },
    });

    if (activeSprint) {
      throw new AppError(ErrorCode.CONFLICT, 'Project already has an active sprint');
    }

    const sprint = await prisma.sprint.create({
      data: req.body,
    });

    res.status(201).json({ success: true, data: sprint });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/sprints/:id/start
sprintRouter.patch('/:id/start', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sprint = await prisma.sprint.update({
      where: { id: req.params.id },
      data: { status: 'ACTIVE' },
    });

    res.json({ success: true, data: sprint });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/sprints/:id/complete
sprintRouter.patch('/:id/complete', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sprint = await prisma.sprint.update({
      where: { id: req.params.id },
      data: { status: 'COMPLETED' },
    });

    // Move incomplete tasks back to backlog
    await prisma.task.updateMany({
      where: {
        sprintId: sprint.id,
        status: { notIn: ['DONE', 'CANCELLED'] },
      },
      data: { sprintId: null },
    });

    res.json({ success: true, data: sprint });
  } catch (err) {
    next(err);
  }
});
