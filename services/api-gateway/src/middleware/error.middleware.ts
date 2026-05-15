import type { Request, Response, NextFunction } from 'express';
import { handleError, AppError, createLogger } from '@nexusflow/shared-utils';

const logger = createLogger('error-handler');

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    const { statusCode, body } = handleError(err);
    if (!err.isOperational) {
      logger.error('Non-operational error', { error: err.message, stack: err.stack });
    }
    res.status(statusCode).json(body);
    return;
  }

  logger.error('Unhandled error', { error: err.message, stack: err.stack });
  const { statusCode, body } = handleError(err);
  res.status(statusCode).json(body);
}
