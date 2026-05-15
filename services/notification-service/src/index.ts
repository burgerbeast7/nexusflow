// ═══════════════════════════════════════════════════
// NexusFlow — Notification Service
// Real-time WebSocket + Email + Push notifications
// Subscribes to Redis events from other services
// ═══════════════════════════════════════════════════

import express from 'express';
import { createServer } from 'http';
import { Server as SocketIO } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { createLogger, createRedisClient } from '@nexusflow/shared-utils';
import { WSEvent } from '@nexusflow/shared-types';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const logger = createLogger('notification-service');
const PORT = process.env.NOTIFICATION_SERVICE_PORT || 3005;

// WebSocket server
const io = new SocketIO(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
  pingInterval: 25000,
  pingTimeout: 60000,
});

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    service: 'notification-service',
    connections: io.engine.clientsCount,
  });
});

// ── Track connected users ───────────────────────
const connectedUsers = new Map<string, Set<string>>(); // userId → Set<socketId>

io.on('connection', (socket) => {
  const userId = socket.handshake.auth.userId as string;
  logger.info('Client connected', { socketId: socket.id, userId });

  // Track user presence
  if (userId) {
    if (!connectedUsers.has(userId)) {
      connectedUsers.set(userId, new Set());
    }
    connectedUsers.get(userId)!.add(socket.id);

    // Broadcast presence
    io.emit(WSEvent.USER_ONLINE, { userId, timestamp: new Date() });

    // Join user's room for targeted notifications
    socket.join(`user:${userId}`);
  }

  // Handle cursor movement for real-time collaboration
  socket.on(WSEvent.CURSOR_MOVE, (data) => {
    socket.broadcast.emit(WSEvent.CURSOR_MOVE, { ...data, userId });
  });

  // Handle typing indicators
  socket.on(WSEvent.USER_TYPING, (data) => {
    socket.broadcast.emit(WSEvent.USER_TYPING, { ...data, userId });
  });

  socket.on('disconnect', () => {
    if (userId) {
      connectedUsers.get(userId)?.delete(socket.id);
      if (connectedUsers.get(userId)?.size === 0) {
        connectedUsers.delete(userId);
        io.emit(WSEvent.USER_OFFLINE, { userId, timestamp: new Date() });
      }
    }
    logger.info('Client disconnected', { socketId: socket.id });
  });
});

// ── Subscribe to Redis events from other services ──
const subscriber = createRedisClient();

const channels = ['task:created', 'task:updated', 'task:deleted', 'task:moved'];

channels.forEach((channel) => {
  subscriber.subscribe(channel, (err) => {
    if (err) logger.error(`Failed to subscribe to ${channel}`, { error: err.message });
    else logger.info(`Subscribed to ${channel}`);
  });
});

subscriber.on('message', (channel, message) => {
  try {
    const data = JSON.parse(message);
    const eventMap: Record<string, string> = {
      'task:created': WSEvent.TASK_CREATED,
      'task:updated': WSEvent.TASK_UPDATED,
      'task:deleted': WSEvent.TASK_DELETED,
      'task:moved': WSEvent.TASK_MOVED,
    };

    const event = eventMap[channel];
    if (event) {
      io.emit(event, data);
      logger.debug(`Broadcast ${event}`, { channel });

      // Send targeted notification for assignments
      if (channel === 'task:updated' && data.assigneeId) {
        io.to(`user:${data.assigneeId}`).emit(WSEvent.NOTIFICATION, {
          type: 'TASK_ASSIGNED',
          title: 'New task assigned',
          message: `You've been assigned: ${data.title}`,
          data,
        });
      }
    }
  } catch (err) {
    logger.error('Failed to process Redis message', { channel, error: (err as Error).message });
  }
});

httpServer.listen(PORT, () => {
  logger.info(`🔔 Notification Service running on port ${PORT}`);
  logger.info(`🔌 WebSocket server ready`);
});
