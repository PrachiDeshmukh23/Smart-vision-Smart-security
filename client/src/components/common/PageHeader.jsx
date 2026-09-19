import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export default function PageHeader({ title, subtitle, breadcrumbs = [] }) {
  return (
    <div className="relative bg-white border-b border-[#E6E6E6] py-8 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto relative z-10">
        <nav className="flex items-center gap-1.5 text-xs text-[#666666] mb-3">
          <Link to="/" className="hover:text-[#009B72] transition-colors flex items-center gap-1 font-medium">
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          {breadcrumbs.map((bc, idx) => (
            <React.Fragment key={idx}>
              <ChevronRight className="w-3 h-3 text-[#B3B3B3]" />
              {bc.path ? (
                <Link to={bc.path} className="hover:text-[#009B72] transition-colors font-medium">
                  {bc.label}
                </Link>
              ) : (
                <span className="text-[#009B72] font-semibold">{bc.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>

        <h1 className="text-2xl sm:text-3xl font-black text-[#151515] tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1.5 text-xs sm:text-sm text-[#666666] max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
