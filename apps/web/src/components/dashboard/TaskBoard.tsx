'use client';

import { motion } from 'framer-motion';
import clsx from 'clsx';

const columns = [
  {
    name: 'To Do',
    color: 'bg-surface-500',
    tasks: [
      { id: 'NF-145', title: 'Add OAuth support for GitHub', priority: 'HIGH', type: 'FEATURE', assignee: 'SC', points: 8 },
      { id: 'NF-147', title: 'Implement rate limiting middleware', priority: 'MEDIUM', type: 'CHORE', assignee: 'AR', points: 5 },
    ],
  },
  {
    name: 'In Progress',
    color: 'bg-brand-500',
    tasks: [
      { id: 'NF-142', title: 'Fix auth redirect loop on mobile', priority: 'CRITICAL', type: 'BUG', assignee: 'JK', points: 3 },
      { id: 'NF-143', title: 'Design analytics dashboard widgets', priority: 'HIGH', type: 'FEATURE', assignee: 'MP', points: 8 },
      { id: 'NF-146', title: 'WebSocket reconnection handler', priority: 'MEDIUM', type: 'IMPROVEMENT', assignee: 'SC', points: 5 },
    ],
  },
  {
    name: 'In Review',
    color: 'bg-accent-amber',
    tasks: [
      { id: 'NF-140', title: 'User profile settings page', priority: 'MEDIUM', type: 'FEATURE', assignee: 'AR', points: 5 },
    ],
  },
  {
    name: 'Done',
    color: 'bg-accent-emerald',
    tasks: [
      { id: 'NF-138', title: 'JWT token refresh mechanism', priority: 'HIGH', type: 'FEATURE', assignee: 'JK', points: 5 },
      { id: 'NF-139', title: 'Add Prisma migrations', priority: 'LOW', type: 'CHORE', assignee: 'SC', points: 2 },
    ],
  },
];

const priorityColors: Record<string, string> = {
  CRITICAL: 'bg-accent-rose/10 text-accent-rose',
  HIGH: 'bg-accent-amber/10 text-accent-amber',
  MEDIUM: 'bg-brand-500/10 text-brand-400',
  LOW: 'bg-surface-700/50 text-surface-400',
};

const typeIcons: Record<string, string> = {
  FEATURE: '✨', BUG: '🐛', IMPROVEMENT: '⚡', CHORE: '🔧', SPIKE: '🔍',
};

export function TaskBoard() {
  return (
    <div className="glass-card p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-white">Sprint Board</h3>
        <span className="text-xs text-surface-500">Sprint 14 · 6 days left</span>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {columns.map((col) => (
          <div key={col.name} className="min-w-0">
            <div className="flex items-center gap-2 mb-3">
              <div className={clsx('w-2 h-2 rounded-full', col.color)} />
              <span className="text-xs font-medium text-surface-400">{col.name}</span>
              <span className="text-2xs text-surface-600 bg-surface-800/50 px-1.5 py-0.5 rounded-full">
                {col.tasks.length}
              </span>
            </div>
            <div className="space-y-2">
              {col.tasks.map((task, i) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                  className="p-3 rounded-xl bg-surface-900/50 border border-surface-800/30 hover:border-surface-700/50
                    cursor-pointer transition-all duration-200 hover:shadow-glass group"
                >
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-xs">{typeIcons[task.type]}</span>
                    <span className="text-2xs font-mono text-surface-500">{task.id}</span>
                  </div>
                  <p className="text-xs font-medium text-surface-200 mb-2 leading-relaxed line-clamp-2">
                    {task.title}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className={clsx('badge text-2xs', priorityColors[task.priority])}>
                      {task.priority}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-2xs text-surface-600">{task.points}p</span>
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-brand-500 to-accent-violet flex items-center justify-center text-[9px] font-bold text-white">
                        {task.assignee}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
