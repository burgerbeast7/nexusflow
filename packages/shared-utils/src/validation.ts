import { z } from 'zod';
import { TaskPriority, TaskStatus, TaskType, UserRole } from '@nexusflow/shared-types';
import type { Request, Response, NextFunction } from 'express';
import { AppError, ErrorCode } from './errors';

// ── Validation Schemas ──────────────────────────

export const schemas = {
  // Auth
  login: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  }),

  register: z.object({
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  }),

  // Projects
  createProject: z.object({
    name: z.string().min(1).max(100),
    description: z.string().max(1000).optional(),
    color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
    icon: z.string().max(50).optional(),
    startDate: z.string().datetime().optional(),
    targetDate: z.string().datetime().optional(),
  }),

  // Tasks
  createTask: z.object({
    title: z.string().min(1).max(200),
    description: z.string().max(5000).optional(),
    priority: z.nativeEnum(TaskPriority).optional(),
    type: z.nativeEnum(TaskType).optional(),
    projectId: z.string().uuid(),
    sprintId: z.string().uuid().optional(),
    assigneeId: z.string().uuid().optional(),
    labels: z.array(z.string()).max(10).optional(),
    storyPoints: z.number().int().min(0).max(100).optional(),
    dueDate: z.string().datetime().optional(),
  }),

  updateTask: z.object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().max(5000).optional(),
    status: z.nativeEnum(TaskStatus).optional(),
    priority: z.nativeEnum(TaskPriority).optional(),
    type: z.nativeEnum(TaskType).optional(),
    sprintId: z.string().uuid().nullable().optional(),
    assigneeId: z.string().uuid().nullable().optional(),
    labels: z.array(z.string()).max(10).optional(),
    storyPoints: z.number().int().min(0).max(100).optional(),
    dueDate: z.string().datetime().nullable().optional(),
  }),

  // Sprints
  createSprint: z.object({
    name: z.string().min(1).max(100),
    projectId: z.string().uuid(),
    goal: z.string().max(500).optional(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
  }),

  // Pagination
  pagination: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
    search: z.string().optional(),
  }),

  // AI Command
  aiCommand: z.object({
    input: z.string().min(1).max(1000),
    context: z
      .object({
        projectId: z.string().uuid().optional(),
        sprintId: z.string().uuid().optional(),
      })
      .optional(),
  }),

  // User update
  updateProfile: z.object({
    name: z.string().min(2).max(100).optional(),
    bio: z.string().max(500).optional(),
    timezone: z.string().optional(),
    preferences: z
      .object({
        theme: z.enum(['light', 'dark', 'system']).optional(),
        language: z.string().optional(),
        notifications: z
          .object({
            email: z.boolean().optional(),
            push: z.boolean().optional(),
            inApp: z.boolean().optional(),
            digest: z.enum(['realtime', 'hourly', 'daily', 'weekly']).optional(),
          })
          .optional(),
      })
      .optional(),
  }),

  // Invite user
  inviteUser: z.object({
    email: z.string().email(),
    role: z.nativeEnum(UserRole),
    teamId: z.string().uuid().optional(),
  }),
};

// ── Validation Middleware ────────────────────────

type SchemaKey = keyof typeof schemas;

export function validate(schemaName: SchemaKey, source: 'body' | 'query' | 'params' = 'body') {
  return (req: Request, _res: Response, next: NextFunction) => {
    const schema = schemas[schemaName];
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const details: Record<string, string[]> = {};
      result.error.errors.forEach((err) => {
        const field = err.path.join('.');
        if (!details[field]) details[field] = [];
        details[field].push(err.message);
      });

      throw new AppError(ErrorCode.VALIDATION_ERROR, 'Validation failed', details);
    }

    req[source] = result.data;
    next();
  };
}
