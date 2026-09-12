import React from 'react';

export default function StatCard({ title, value, icon: Icon, color = 'cyan', change, subtitle }) {
  const colorMap = {
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    blue: 'bg-blue-600/10 text-blue-400 border-blue-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-start justify-between shadow-lg">
      <div className="space-y-2">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
        <h3 className="text-3xl font-black text-white">{value}</h3>
        {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
      </div>
      <div className={`p-3 rounded-xl border ${colorMap[color] || colorMap.cyan}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
}
