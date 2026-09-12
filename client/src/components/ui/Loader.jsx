import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loader({ text = 'Loading...', className = 'py-16' }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 text-slate-400 ${className}`}>
      <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
      <p className="text-sm font-medium tracking-wide">{text}</p>
    </div>
  );
}
