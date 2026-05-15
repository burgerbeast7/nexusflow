import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { validate } from '@nexusflow/shared-utils';

export const taskRouter = Router();
const controller = new TaskController();

// GET /api/tasks — List tasks with filtering
taskRouter.get('/', validate('pagination', 'query'), controller.list);

// POST /api/tasks — Create a new task
taskRouter.post('/', validate('createTask'), controller.create);

// GET /api/tasks/:id — Get task by ID
taskRouter.get('/:id', controller.getById);

// PATCH /api/tasks/:id — Update a task
taskRouter.patch('/:id', validate('updateTask'), controller.update);

// DELETE /api/tasks/:id — Delete a task
taskRouter.delete('/:id', controller.delete);

// POST /api/tasks/:id/comments — Add comment to task
taskRouter.post('/:id/comments', controller.addComment);

// PATCH /api/tasks/:id/move — Move task (reorder)
taskRouter.patch('/:id/move', controller.move);
