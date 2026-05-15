import type { Request, Response, NextFunction } from 'express';
import type Redis from 'ioredis';
import { AppError, ErrorCode } from './errors';

interface RateLimitOptions {
  windowMs: number;
  maxRequests: number;
  keyPrefix?: string;
}

export function rateLimiter(redis: Redis, options: RateLimitOptions) {
  const { windowMs, maxRequests, keyPrefix = 'rl' } = options;
  const windowSec = Math.ceil(windowMs / 1000);

  return async (req: Request, _res: Response, next: NextFunction) => {
    const identifier = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    const key = `${keyPrefix}:${identifier}`;

    try {
      const current = await redis.incr(key);

      if (current === 1) {
        await redis.expire(key, windowSec);
      }

      if (current > maxRequests) {
        throw new AppError(
          ErrorCode.RATE_LIMITED,
          `Too many requests. Limit: ${maxRequests} per ${windowSec}s`
        );
      }

      next();
    } catch (err) {
      if (err instanceof AppError) throw err;
      // If Redis is down, allow the request (fail open)
      next();
    }
  };
}
