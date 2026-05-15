import { PrismaClient } from '@prisma/client';
import {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
  AppError,
  ErrorCode,
  createRedisClient,
  createLogger,
} from '@nexusflow/shared-utils';
import type { UserRole } from '@nexusflow/shared-types';

const prisma = new PrismaClient();
const redis = createRedisClient();
const logger = createLogger('auth-service');

interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

interface LoginInput {
  email: string;
  password: string;
  userAgent?: string;
  ipAddress?: string;
}

export class AuthService {
  private jwtSecret = process.env.JWT_SECRET || 'dev-secret';
  private jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret';
  private jwtExpiry = process.env.JWT_EXPIRY || '15m';
  private jwtRefreshExpiry = process.env.JWT_REFRESH_EXPIRY || '7d';

  async register(input: RegisterInput) {
    // Check if user exists
    const existing = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existing) {
      throw new AppError(ErrorCode.ALREADY_EXISTS, 'Email already registered');
    }

    // Hash password
    const passwordHash = await hashPassword(input.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: input.email,
        passwordHash,
        name: input.name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    // Generate tokens
    const tokens = this.generateTokenPair(user.id, user.email, user.role as unknown as UserRole);

    // Create session
    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken: tokens.refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    logger.info('New user registered', { userId: user.id });

    return { user, tokens };
  }

  async login(input: LoginInput) {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user) {
      throw new AppError(ErrorCode.INVALID_CREDENTIALS, 'Invalid email or password');
    }

    if (user.status !== 'ACTIVE') {
      throw new AppError(ErrorCode.FORBIDDEN, 'Account is not active');
    }

    // Verify password
    const isValid = await comparePassword(input.password, user.passwordHash);
    if (!isValid) {
      throw new AppError(ErrorCode.INVALID_CREDENTIALS, 'Invalid email or password');
    }

    // Generate tokens
    const tokens = this.generateTokenPair(user.id, user.email, user.role as unknown as UserRole);

    // Create session
    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken: tokens.refreshToken,
        userAgent: input.userAgent,
        ipAddress: input.ipAddress,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      },
      tokens,
    };
  }

  async refreshTokens(refreshToken: string) {
    // Find session
    const session = await prisma.session.findUnique({
      where: { refreshToken },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      throw new AppError(ErrorCode.UNAUTHORIZED, 'Invalid or expired refresh token');
    }

    // Generate new tokens
    const tokens = this.generateTokenPair(
      session.user.id,
      session.user.email,
      session.user.role as unknown as UserRole
    );

    // Rotate refresh token
    await prisma.session.update({
      where: { id: session.id },
      data: {
        refreshToken: tokens.refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return tokens;
  }

  async logout(accessToken: string, refreshToken?: string) {
    // Blacklist access token in Redis
    try {
      const payload = verifyToken(accessToken, this.jwtSecret);
      const ttl = payload.exp - Math.floor(Date.now() / 1000);
      if (ttl > 0) {
        await redis.setex(`bl:${accessToken}`, ttl, '1');
      }
    } catch {
      // Token may already be expired, that's fine
    }

    // Delete session
    if (refreshToken) {
      await prisma.session.deleteMany({
        where: { refreshToken },
      });
    }
  }

  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new AppError(ErrorCode.NOT_FOUND, 'User not found');
    }

    return user;
  }

  private generateTokenPair(userId: string, email: string, role: UserRole) {
    const accessToken = generateToken(
      { userId, email, role },
      this.jwtSecret,
      this.jwtExpiry
    );

    const refreshToken = generateToken(
      { userId, email, role },
      this.jwtRefreshSecret,
      this.jwtRefreshExpiry
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: 900, // 15 minutes in seconds
    };
  }
}
