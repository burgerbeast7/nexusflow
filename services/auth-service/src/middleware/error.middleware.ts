import type { Request, Response, NextFunction } from 'express';
import { handleError, AppError } from '@nexusflow/shared-utils';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const { statusCode, body } = handleError(err instanceof AppError ? err : err);
  res.status(statusCode).json(body);
}
