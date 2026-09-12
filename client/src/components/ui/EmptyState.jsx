import React from 'react';
import { FolderSearch } from 'lucide-react';

export default function EmptyState({ title = 'No records found', message = 'There are no items matching your criteria.', icon: Icon = FolderSearch, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 bg-slate-900/40 rounded-2xl border border-slate-800 my-4">
      <div className="w-16 h-16 rounded-full bg-slate-800/80 flex items-center justify-center text-cyan-400 mb-4 shadow-inner">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
      <p className="text-sm text-slate-400 max-w-sm mb-6">{message}</p>
      {action && action}
    </div>
  );
}
