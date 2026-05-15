'use client';

const team = [
  { initials: 'SC', name: 'Sarah', status: 'online' },
  { initials: 'AR', name: 'Alex', status: 'online' },
  { initials: 'JK', name: 'Jordan', status: 'online' },
  { initials: 'MP', name: 'Maya', status: 'away' },
];

const colors = [
  'from-brand-500 to-accent-violet',
  'from-accent-cyan to-blue-500',
  'from-accent-emerald to-teal-500',
  'from-accent-amber to-orange-500',
];

const statusDot: Record<string, string> = {
  online: 'status-online',
  away: 'status-away',
  offline: 'status-offline',
};

export function TeamPresence() {
  return (
    <div className="flex items-center">
      <div className="flex -space-x-2">
        {team.map((member, i) => (
          <div key={member.initials} className="relative group" title={member.name}>
            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${colors[i]} flex items-center justify-center 
              text-[10px] font-bold text-white border-2 border-surface-950 transition-transform hover:scale-110 hover:z-10`}>
              {member.initials}
            </div>
            <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-surface-950 status-dot ${statusDot[member.status]}`} />
          </div>
        ))}
      </div>
      <span className="ml-3 text-xs text-surface-500">{team.filter(t => t.status === 'online').length} online</span>
    </div>
  );
}
