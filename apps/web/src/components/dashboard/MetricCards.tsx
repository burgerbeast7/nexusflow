'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, CheckCircle2, Zap, Target, Users } from 'lucide-react';
import clsx from 'clsx';

const metrics = [
  {
    label: 'Total Tasks',
    value: '247',
    change: '+12',
    trend: 'up' as const,
    icon: CheckCircle2,
    color: 'text-brand-400',
    bgColor: 'bg-brand-500/10',
    iconColor: 'text-brand-400',
  },
  {
    label: 'Sprint Velocity',
    value: '42 pts',
    change: '+8.5%',
    trend: 'up' as const,
    icon: Zap,
    color: 'text-accent-emerald',
    bgColor: 'bg-accent-emerald/10',
    iconColor: 'text-accent-emerald',
  },
  {
    label: 'Sprint Progress',
    value: '68%',
    change: 'On Track',
    trend: 'up' as const,
    icon: Target,
    color: 'text-accent-cyan',
    bgColor: 'bg-accent-cyan/10',
    iconColor: 'text-accent-cyan',
  },
  {
    label: 'Team Active',
    value: '12/15',
    change: '80%',
    trend: 'up' as const,
    icon: Users,
    color: 'text-accent-violet',
    bgColor: 'bg-accent-violet/10',
    iconColor: 'text-accent-violet',
  },
];

export function MetricCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, i) => (
        <motion.div
          key={metric.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.4 }}
          className="glass-card p-5 rounded-2xl group hover:border-surface-700/50 transition-all duration-300"
        >
          <div className="flex items-start justify-between mb-3">
            <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center', metric.bgColor)}>
              <metric.icon className={clsx('w-5 h-5', metric.iconColor)} />
            </div>
            <div className={clsx(
              'flex items-center gap-1 text-xs font-medium',
              metric.trend === 'up' ? 'text-accent-emerald' : 'text-accent-rose'
            )}>
              {metric.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {metric.change}
            </div>
          </div>
          <p className="text-xs text-surface-500 mb-1">{metric.label}</p>
          <p className={clsx('text-2xl font-bold', metric.color)}>{metric.value}</p>
        </motion.div>
      ))}
    </div>
  );
}
