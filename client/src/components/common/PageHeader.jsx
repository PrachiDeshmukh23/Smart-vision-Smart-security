import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export default function PageHeader({ title, subtitle, breadcrumbs = [] }) {
  return (
    <div className="relative bg-gradient-to-b from-[#081322] via-[#0B192C] to-[#0B192C] border-b border-slate-800/80 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <nav className="flex items-center gap-2 text-xs text-slate-400 mb-4">
          <Link to="/" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          {breadcrumbs.map((bc, idx) => (
            <React.Fragment key={idx}>
              <ChevronRight className="w-3 h-3 text-slate-600" />
              {bc.path ? (
                <Link to={bc.path} className="hover:text-cyan-400 transition-colors">
                  {bc.label}
                </Link>
              ) : (
                <span className="text-cyan-400 font-medium">{bc.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
