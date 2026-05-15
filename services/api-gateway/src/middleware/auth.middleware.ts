import type { Request, Response, NextFunction } from 'express';
import type Redis from 'ioredis';
import { verifyToken, AppError, ErrorCode, createLogger } from '@nexusflow/shared-utils';

const logger = createLogger('auth-middleware');

export function authMiddleware(redis: Redis) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        throw new AppError(ErrorCode.UNAUTHORIZED, 'No token provided');
      }

      const token = authHeader.substring(7);

      // Check if token is blacklisted (logged out)
      const isBlacklisted = await redis.get(`bl:${token}`);
      if (isBlacklisted) {
        throw new AppError(ErrorCode.UNAUTHORIZED, 'Token has been revoked');
      }

      const payload = verifyToken(token, process.env.JWT_SECRET!);

      // Attach user info to request headers for downstream services
      req.headers['x-user-id'] = payload.userId;
      req.headers['x-user-email'] = payload.email;
      req.headers['x-user-role'] = payload.role;

      next();
    } catch (err) {
      if (err instanceof AppError) {
        next(err);
        return;
      }

      const error = err as Error;
      if (error.name === 'TokenExpiredError') {
        next(new AppError(ErrorCode.TOKEN_EXPIRED, 'Token has expired'));
        return;
      }

      logger.error('Auth middleware error', { error: error.message });
      next(new AppError(ErrorCode.UNAUTHORIZED, 'Invalid token'));
    }
  };
}
