'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, FolderKanban, CheckSquare, BarChart3,
  Settings, Users, Zap, ChevronLeft, Sparkles, Plus, Search
} from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', active: true },
  { icon: FolderKanban, label: 'Projects', href: '/dashboard/projects' },
  { icon: CheckSquare, label: 'Tasks', href: '/dashboard/tasks' },
  { icon: BarChart3, label: 'Analytics', href: '/dashboard/analytics' },
  { icon: Users, label: 'Team', href: '/dashboard/team' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="h-screen border-r border-surface-800/50 bg-surface-950 flex flex-col"
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-surface-800/50">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-violet flex items-center justify-center flex-shrink-0">
          <Zap className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="ml-3 text-lg font-bold text-white">
            NexusFlow
          </motion.span>
        )}
        <button onClick={() => setCollapsed(!collapsed)}
          className="ml-auto p-1.5 rounded-lg hover:bg-surface-800/50 text-surface-500 hover:text-surface-300 transition-colors">
          <ChevronLeft className={clsx('w-4 h-4 transition-transform', collapsed && 'rotate-180')} />
        </button>
      </div>

      {/* Search / AI Command */}
      {!collapsed && (
        <div className="px-4 py-3">
          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-surface-500 bg-surface-900/50 border border-surface-800/50 rounded-xl hover:border-brand-500/30 hover:text-surface-300 transition-all">
            <Search className="w-4 h-4" />
            <span>Search or command...</span>
            <kbd className="ml-auto text-2xs bg-surface-800 px-1.5 py-0.5 rounded">⌘K</kbd>
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        {navItems.map((item) => (
          <a key={item.label} href={item.href}
            className={clsx(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
              item.active
                ? 'bg-brand-600/10 text-brand-400 border border-brand-500/10'
                : 'text-surface-400 hover:text-surface-200 hover:bg-surface-800/50'
            )}>
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </a>
        ))}
      </nav>

      {/* AI Assistant */}
      {!collapsed && (
        <div className="px-4 pb-4">
          <div className="glass-card p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-brand-400" />
              <span className="text-xs font-medium text-surface-300">AI Assistant</span>
            </div>
            <p className="text-xs text-surface-500 mb-3">Ask anything about your projects</p>
            <button className="w-full btn-primary text-xs py-2">
              <Plus className="w-3.5 h-3.5 mr-1" /> New Command
            </button>
          </div>
        </div>
      )}

      {/* User */}
      <div className="px-3 py-3 border-t border-surface-800/50">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-surface-800/50 transition-colors cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-accent-violet flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
            KS
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-medium text-surface-200 truncate">Kunal S.</p>
              <p className="text-xs text-surface-500 truncate">Admin</p>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
