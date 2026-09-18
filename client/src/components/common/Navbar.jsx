import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, Menu, X, Phone, Mail, Search, MessageSquare, 
  FileSpreadsheet, Sparkles, Tag, Truck
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export default function Navbar({ onOpenEnquire }) {
  const { settings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Products', path: '/products' },
    { name: 'Price List', path: '/price-list', badge: 'Wholesale' },
    { name: 'Solutions', path: '/solutions' },
    { name: 'Offers', path: '/offers', badge: 'Hot' },
    { name: 'Dealers', path: '/dealer' },
    { name: 'Downloads', path: '/downloads' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact Us', path: '/contact' },
  ];

  return (
    <>
      {/* CCTVPRO-style Top Wholesale Announcement Notice */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-cyan-950 border-b border-cyan-500/20 text-[11px] text-slate-300 py-1.5 px-4 font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 truncate">
            <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded shrink-0">
              WHOLESALE NOTICE
            </span>
            <span className="truncate">
              All Prices Excl. GST • <strong>200+ CCTV Accessories with NO MOQ</strong> • COD Available with token advance • Courier & Payment on WhatsApp/Call
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 shrink-0 text-xs">
            <a 
              href={`https://wa.me/${(settings?.whatsapp_number || '919876543210').replace(/[^0-9]/g, '')}?text=Hello%20send%20me%20wholesale%20price%20list`} 
              target="_blank" 
              rel="noreferrer"
              className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Pan-India Dispatch</span>
            </a>
            <span className="text-slate-700">|</span>
            <Link to="/admin/login" className="text-slate-400 hover:text-cyan-400 transition-colors">
              Admin Login
            </Link>
          </div>
        </div>
      </div>

      {/* Main Brand Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled ? 'bg-[#0B192C]/95 backdrop-blur-md shadow-xl border-b border-slate-800/80 py-3' : 'bg-[#0B192C] border-b border-slate-800/50 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-2xl font-black text-white">GS</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">VISION</span>
              </div>
              <p className="text-[10px] tracking-wider text-cyan-300/80 uppercase font-medium -mt-1">
                Smart Vision.. Smart Security
              </p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 relative ${
                    isActive ? 'text-cyan-400 bg-cyan-500/10 font-bold' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`
                }
              >
                {link.name}
                {link.badge && (
                  <span className={`absolute -top-1 -right-1 text-[9px] text-slate-950 font-black px-1.5 py-0.2 rounded-full uppercase scale-90 ${
                    link.badge === 'Wholesale' ? 'bg-amber-400' : 'bg-orange-500 text-white animate-pulse'
                  }`}>
                    {link.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 border border-slate-700/60 transition-colors"
              title="Search Products"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              onClick={() => onOpenEnquire && onOpenEnquire()}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 transition-all shadow-lg shadow-cyan-500/20 active:scale-95 flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Enquire Now</span>
            </button>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="border-t border-slate-800 bg-[#07101E] px-4 py-3 animate-fadeIn">
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSearch} className="relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search cameras, connectors, SMPS, junction boxes, CAT6, racks, tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full bg-slate-900 border border-slate-700 text-white text-sm rounded-xl pl-12 pr-28 py-3 focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="submit"
                  className="absolute right-2 px-4 py-1.5 text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-black rounded-lg transition-colors"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        )}

        {isOpen && (
          <div className="lg:hidden border-t border-slate-800 bg-[#0B192C] px-4 pt-3 pb-6 space-y-1 animate-fadeIn">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive ? 'text-cyan-400 bg-cyan-500/10 font-bold' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`
                }
              >
                <span>{link.name}</span>
                {link.badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    link.badge === 'Wholesale' ? 'bg-amber-400 text-slate-950' : 'bg-orange-500 text-white'
                  }`}>
                    {link.badge}
                  </span>
                )}
              </NavLink>
            ))}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenEnquire && onOpenEnquire();
                }}
                className="w-full py-3 text-center rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 shadow-md flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Enquire Now</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
