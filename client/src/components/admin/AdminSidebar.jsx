import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, FolderTree, Tag, Image, Percent,
  MessageSquare, Users, Download, Film, Quote, Mail, Settings,
  UserCheck, LogOut, ShieldCheck, ExternalLink, X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminSidebar({ mobileOpen, setMobileOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Categories', path: '/admin/categories', icon: FolderTree },
    { name: 'Brands', path: '/admin/brands', icon: Tag },
    { name: 'Hero Banners', path: '/admin/banners', icon: Image },
    { name: 'Offers & Promos', path: '/admin/offers', icon: Percent },
    { name: 'Enquiries', path: '/admin/enquiries', icon: MessageSquare },
    { name: 'Dealer Applications', path: '/admin/dealers', icon: Users },
    { name: 'Downloads / PDFs', path: '/admin/downloads', icon: Download },
    { name: 'Gallery', path: '/admin/gallery', icon: Film },
    { name: 'Testimonials', path: '/admin/testimonials', icon: Quote },
    { name: 'Contact Messages', path: '/admin/messages', icon: Mail },
    { name: 'Website Settings', path: '/admin/settings', icon: Settings },
    { name: 'Admin Users', path: '/admin/users', icon: UserCheck },
  ];

  return (
    <>
      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-[#07101E] border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo */}
          <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
            <Link to="/admin/dashboard" className="flex items-center gap-2">
              <img
                src="/assets/logo-white.png"
                alt="GS Vision Admin"
                className="h-10 w-auto object-contain"
              />
            </Link>
            <button onClick={() => setMobileOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav List */}
          <div className="p-3 overflow-y-auto max-h-[calc(100vh-140px)] space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-cyan-500/15 text-cyan-400 font-bold border border-cyan-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* User profile & Logout */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/50 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate">{user?.name || 'Administrator'}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email || 'admin@gsvision.com'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-[11px] font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>View Live Website</span>
            <ExternalLink className="w-3 h-3 text-cyan-400" />
          </a>
        </div>
      </aside>
    </>
  );
}
