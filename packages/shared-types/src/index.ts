// ═══════════════════════════════════════════════════
// NexusFlow — Shared Type Definitions
// ═══════════════════════════════════════════════════

// ── User Types ──────────────────────────────────

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  DEVELOPER = 'DEVELOPER',
  VIEWER = 'VIEWER',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING = 'PENDING',
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  teamId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile extends User {
  bio?: string;
  timezone?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: NotificationPreferences;
  language: string;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  inApp: boolean;
  digest: 'realtime' | 'hourly' | 'daily' | 'weekly';
}

// ── Auth Types ──────────────────────────────────

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}

// ── Project Types ───────────────────────────────

export enum ProjectStatus {
  PLANNING = 'PLANNING',
  ACTIVE = 'ACTIVE',
  ON_HOLD = 'ON_HOLD',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED',
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  ownerId: string;
  teamId: string;
  color: string;
  icon: string;
  startDate?: Date;
  targetDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ── Task Types ──────────────────────────────────

export enum TaskStatus {
  BACKLOG = 'BACKLOG',
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  IN_REVIEW = 'IN_REVIEW',
  DONE = 'DONE',
  CANCELLED = 'CANCELLED',
}

export enum TaskPriority {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
  NONE = 'NONE',
}

export enum TaskType {
  FEATURE = 'FEATURE',
  BUG = 'BUG',
  IMPROVEMENT = 'IMPROVEMENT',
  CHORE = 'CHORE',
  SPIKE = 'SPIKE',
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  type: TaskType;
  projectId: string;
  sprintId?: string;
  assigneeId?: string;
  reporterId: string;
  labels: string[];
  storyPoints?: number;
  dueDate?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ── Sprint Types ────────────────────────────────

export enum SprintStatus {
  PLANNING = 'PLANNING',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
}

export interface Sprint {
  id: string;
  name: string;
  projectId: string;
  status: SprintStatus;
  goal?: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ── Team Types ──────────────────────────────────

export interface Team {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  members: TeamMember[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMember {
  userId: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
  joinedAt: Date;
}

// ── Notification Types ──────────────────────────

export enum NotificationType {
  TASK_ASSIGNED = 'TASK_ASSIGNED',
  TASK_UPDATED = 'TASK_UPDATED',
  TASK_COMPLETED = 'TASK_COMPLETED',
  COMMENT_ADDED = 'COMMENT_ADDED',
  MENTION = 'MENTION',
  SPRINT_STARTED = 'SPRINT_STARTED',
  SPRINT_COMPLETED = 'SPRINT_COMPLETED',
  AI_SUGGESTION = 'AI_SUGGESTION',
  SYSTEM = 'SYSTEM',
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  userId: string;
  metadata?: Record<string, unknown>;
  read: boolean;
  createdAt: Date;
}

// ── Analytics Types ─────────────────────────────

export interface VelocityMetric {
  sprintId: string;
  sprintName: string;
  planned: number;
  completed: number;
  date: Date;
}

export interface BurndownPoint {
  date: Date;
  remaining: number;
  ideal: number;
}

export interface ProjectHealth {
  score: number; // 0-100
  velocity: number;
  burndownDeviation: number;
  blockedTasks: number;
  overdueTasks: number;
  prediction: {
    completionDate: Date;
    confidence: number;
  };
}

// ── AI Types ────────────────────────────────────

export interface AICommand {
  input: string;
  context?: {
    projectId?: string;
    sprintId?: string;
  };
}

export interface AIResponse {
  action: string;
  data: Record<string, unknown>;
  explanation: string;
  confidence: number;
}

export interface AISuggestion {
  id: string;
  type: 'task_assignment' | 'sprint_planning' | 'priority_change' | 'workflow';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  data: Record<string, unknown>;
  createdAt: Date;
}

// ── WebSocket Events ────────────────────────────

export enum WSEvent {
  // Connection
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  
  // Presence
  USER_ONLINE = 'user:online',
  USER_OFFLINE = 'user:offline',
  USER_TYPING = 'user:typing',
  CURSOR_MOVE = 'cursor:move',
  
  // Tasks
  TASK_CREATED = 'task:created',
  TASK_UPDATED = 'task:updated',
  TASK_DELETED = 'task:deleted',
  TASK_MOVED = 'task:moved',
  
  // Notifications
  NOTIFICATION = 'notification',
  
  // AI
  AI_SUGGESTION = 'ai:suggestion',
  AI_PROCESSING = 'ai:processing',
}

// ── API Response Types ──────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: PaginationMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}
