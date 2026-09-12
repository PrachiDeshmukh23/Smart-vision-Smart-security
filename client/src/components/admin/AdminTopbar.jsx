import React from 'react';
import { Menu, ShieldCheck, ExternalLink, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminTopbar({ onMenuToggle, title = 'Admin Dashboard' }) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-[#07101E]/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-white tracking-tight">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>System Online</span>
        </span>

        <div className="flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <span className="text-xs font-bold text-white block">{user?.name}</span>
            <span className="text-[10px] text-cyan-400 uppercase tracking-wider block font-mono font-semibold">{user?.role}</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs border border-cyan-500/30">
            {user?.name?.charAt(0) || 'A'}
          </div>
        </div>
      </div>
    </header>
  );
}
