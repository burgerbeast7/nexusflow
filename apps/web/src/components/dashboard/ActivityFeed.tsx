'use client';

import { motion } from 'framer-motion';
import { Clock, CheckCircle2, GitPullRequest, UserPlus, MessageCircle } from 'lucide-react';
import clsx from 'clsx';

const activities = [
  { icon: CheckCircle2, color: 'text-accent-emerald', bg: 'bg-accent-emerald/10', text: 'NF-142 completed', user: 'Jordan K.', time: '2 min ago' },
  { icon: GitPullRequest, color: 'text-accent-violet', bg: 'bg-accent-violet/10', text: 'PR #89 merged', user: 'Sarah C.', time: '15 min ago' },
  { icon: UserPlus, color: 'text-brand-400', bg: 'bg-brand-500/10', text: 'NF-145 assigned', user: 'Alex R.', time: '1 hour ago' },
  { icon: MessageCircle, color: 'text-accent-cyan', bg: 'bg-accent-cyan/10', text: 'Comment on NF-140', user: 'Maya P.', time: '2 hours ago' },
  { icon: CheckCircle2, color: 'text-accent-emerald', bg: 'bg-accent-emerald/10', text: 'Sprint 13 completed', user: 'System', time: '1 day ago' },
];

export function ActivityFeed() {
  return (
    <div className="glass-card p-6 rounded-2xl h-full">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-surface-800/50 flex items-center justify-center">
            <Clock className="w-5 h-5 text-surface-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Activity</h3>
            <p className="text-xs text-surface-500">Recent changes</p>
          </div>
        </div>
      </div>

      <div className="space-y-1">
        {activities.map((activity, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.08 }}
            className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-surface-800/30 transition-colors cursor-pointer group"
          >
            <div className={clsx('w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0', activity.bg)}>
              <activity.icon className={clsx('w-3.5 h-3.5', activity.color)} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-surface-300 group-hover:text-surface-200 transition-colors">
                <span className="font-medium">{activity.text}</span>
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-2xs text-surface-500">{activity.user}</span>
                <span className="text-2xs text-surface-600">·</span>
                <span className="text-2xs text-surface-600">{activity.time}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
