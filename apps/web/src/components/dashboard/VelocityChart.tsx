'use client';

import { BarChart3 } from 'lucide-react';

const data = [
  { sprint: 'S7', planned: 35, completed: 32 },
  { sprint: 'S8', planned: 40, completed: 38 },
  { sprint: 'S9', planned: 38, completed: 42 },
  { sprint: 'S10', planned: 45, completed: 40 },
  { sprint: 'S11', planned: 42, completed: 45 },
  { sprint: 'S12', planned: 48, completed: 44 },
  { sprint: 'S13', planned: 44, completed: 48 },
  { sprint: 'S14', planned: 50, completed: 42 },
];

const maxVal = Math.max(...data.map(d => Math.max(d.planned, d.completed)));

export function VelocityChart() {
  return (
    <div className="glass-card p-6 rounded-2xl h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-500/10 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-brand-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Velocity Trend</h3>
            <p className="text-xs text-surface-500">Last 8 sprints</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-brand-500/30" />
            <span className="text-surface-500">Planned</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-brand-500" />
            <span className="text-surface-500">Completed</span>
          </div>
        </div>
      </div>

      {/* Bar chart */}
      <div className="flex items-end gap-3 h-52">
        {data.map((d) => (
          <div key={d.sprint} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex gap-1 items-end h-44">
              {/* Planned bar */}
              <div className="flex-1 rounded-t-md bg-brand-500/15 transition-all duration-500"
                style={{ height: `${(d.planned / maxVal) * 100}%` }} />
              {/* Completed bar */}
              <div className="flex-1 rounded-t-md bg-gradient-to-t from-brand-600 to-brand-400 transition-all duration-500 hover:opacity-80"
                style={{ height: `${(d.completed / maxVal) * 100}%` }} />
            </div>
            <span className="text-2xs text-surface-500 font-medium">{d.sprint}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
