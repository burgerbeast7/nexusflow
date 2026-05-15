import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '@nexusflow/shared-utils';

export const authRouter = Router();
const controller = new AuthController();

// POST /api/auth/register — Create new account
authRouter.post('/register', validate('register'), controller.register);

// POST /api/auth/login — Authenticate user
authRouter.post('/login', validate('login'), controller.login);

// POST /api/auth/refresh — Refresh access token
authRouter.post('/refresh', controller.refresh);

// POST /api/auth/logout — Revoke tokens
authRouter.post('/logout', controller.logout);

// GET /api/auth/me — Get current user (requires auth header from gateway)
authRouter.get('/me', controller.me);
