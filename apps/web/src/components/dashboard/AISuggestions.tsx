'use client';

import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Lightbulb, AlertTriangle, UserPlus } from 'lucide-react';
import clsx from 'clsx';

const suggestions = [
  {
    type: 'assignment' as const,
    icon: UserPlus,
    title: 'Reassign NF-89',
    description: 'Sarah has 40% less load than Jordan this sprint. Consider reassigning NF-89.',
    impact: 'high' as const,
  },
  {
    type: 'prediction' as const,
    icon: AlertTriangle,
    title: 'Sprint 14 Risk',
    description: 'Based on current velocity, Sprint 14 may slip by 2 days. Consider descoping.',
    impact: 'medium' as const,
  },
  {
    type: 'optimization' as const,
    icon: Lightbulb,
    title: 'Split NF-120',
    description: 'Task NF-120 (13pts) is large. Splitting into subtasks may improve throughput.',
    impact: 'low' as const,
  },
];

const impactColors = {
  high: 'bg-accent-rose/10 text-accent-rose border-accent-rose/20',
  medium: 'bg-accent-amber/10 text-accent-amber border-accent-amber/20',
  low: 'bg-accent-emerald/10 text-accent-emerald border-accent-emerald/20',
};

export function AISuggestions() {
  return (
    <div className="glass-card p-6 rounded-2xl h-full">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-500/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-brand-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">AI Insights</h3>
            <p className="text-xs text-surface-500">3 suggestions</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {suggestions.map((suggestion, i) => (
          <motion.div
            key={suggestion.title}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="group p-3.5 rounded-xl bg-surface-900/50 border border-surface-800/30 hover:border-brand-500/20 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center flex-shrink-0">
                <suggestion.icon className="w-4 h-4 text-brand-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-surface-200">{suggestion.title}</span>
                  <span className={clsx('badge text-2xs border', impactColors[suggestion.impact])}>
                    {suggestion.impact}
                  </span>
                </div>
                <p className="text-xs text-surface-500 leading-relaxed">{suggestion.description}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-surface-600 group-hover:text-brand-400 transition-colors flex-shrink-0 mt-1" />
            </div>
          </motion.div>
        ))}
      </div>

      <button className="w-full mt-4 py-2 text-xs text-brand-400 hover:text-brand-300 font-medium transition-colors">
        View all suggestions →
      </button>
    </div>
  );
}
