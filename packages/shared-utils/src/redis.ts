import Redis from 'ioredis';
import { createLogger } from './logger';

const logger = createLogger('redis');

export function createRedisClient(url?: string): Redis {
  const client = new Redis(url || process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: 3,
    retryStrategy(times: number) {
      const delay = Math.min(times * 50, 2000);
      logger.warn(`Redis reconnecting... attempt ${times}, delay ${delay}ms`);
      return delay;
    },
    reconnectOnError(err: Error) {
      const targetErrors = ['READONLY', 'ECONNRESET', 'ETIMEDOUT'];
      return targetErrors.some((e) => err.message.includes(e));
    },
  });

  client.on('connect', () => logger.info('Redis connected'));
  client.on('error', (err) => logger.error('Redis error', { error: err.message }));
  client.on('close', () => logger.warn('Redis connection closed'));

  return client;
}

export class RedisCache {
  private client: Redis;
  private defaultTTL: number;

  constructor(client: Redis, defaultTTL = 300) {
    this.client = client;
    this.defaultTTL = defaultTTL;
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.client.get(`cache:${key}`);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch (err) {
      logger.error('Cache get error', { key, error: (err as Error).message });
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      await this.client.setex(`cache:${key}`, ttl || this.defaultTTL, serialized);
    } catch (err) {
      logger.error('Cache set error', { key, error: (err as Error).message });
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.client.del(`cache:${key}`);
    } catch (err) {
      logger.error('Cache del error', { key, error: (err as Error).message });
    }
  }

  async invalidatePattern(pattern: string): Promise<void> {
    try {
      const keys = await this.client.keys(`cache:${pattern}`);
      if (keys.length > 0) {
        await this.client.del(...keys);
      }
    } catch (err) {
      logger.error('Cache invalidate error', { pattern, error: (err as Error).message });
    }
  }
}
