import type { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { createLogger } from '@nexusflow/shared-utils';

const logger = createLogger('auth-controller');
const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, name } = req.body;
      const result = await authService.register({ email, password, name });
      
      logger.info('User registered', { userId: result.user.id, email });
      
      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await authService.login({
        email,
        password,
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip,
      });

      logger.info('User logged in', { userId: result.user.id, email });

      res.json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      const tokens = await authService.refreshTokens(refreshToken);

      res.json({
        success: true,
        data: tokens,
      });
    } catch (err) {
      next(err);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.substring(7);
      const { refreshToken } = req.body;

      if (token) {
        await authService.logout(token, refreshToken);
      }

      res.json({
        success: true,
        data: { message: 'Logged out successfully' },
      });
    } catch (err) {
      next(err);
    }
  }

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.headers['x-user-id'] as string;
      const user = await authService.getUserById(userId);

      res.json({
        success: true,
        data: user,
      });
    } catch (err) {
      next(err);
    }
  }
}
