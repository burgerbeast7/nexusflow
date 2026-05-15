'use client';

import { Bell, Search, Command, Plus } from 'lucide-react';

export function TopBar() {
  return (
    <header className="h-14 border-b border-surface-800/50 bg-surface-950/80 backdrop-blur-xl flex items-center justify-between px-6">
      {/* Left: Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-surface-500">Projects</span>
        <span className="text-surface-700">/</span>
        <span className="text-surface-200 font-medium">Dashboard</span>
      </div>

      {/* Center: Search */}
      <div className="hidden md:flex items-center gap-2 max-w-md flex-1 mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
          <input
            type="text"
            placeholder="Search tasks, projects, team..."
            className="w-full pl-10 pr-20 py-2 text-sm bg-surface-900/50 border border-surface-800/50 rounded-xl
              text-surface-300 placeholder-surface-500 focus:outline-none focus:ring-1 focus:ring-brand-500/30
              focus:border-brand-500/50 transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <kbd className="text-2xs bg-surface-800 text-surface-500 px-1.5 py-0.5 rounded border border-surface-700/50">
              <Command className="w-3 h-3 inline" />
            </kbd>
            <kbd className="text-2xs bg-surface-800 text-surface-500 px-1.5 py-0.5 rounded border border-surface-700/50">K</kbd>
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <button className="btn-primary text-xs py-1.5 px-3">
          <Plus className="w-3.5 h-3.5 mr-1" /> New Task
        </button>
        <button className="relative p-2 rounded-xl hover:bg-surface-800/50 text-surface-400 hover:text-surface-200 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-rose rounded-full" />
        </button>
      </div>
    </header>
  );
}
