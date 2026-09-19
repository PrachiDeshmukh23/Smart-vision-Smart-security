import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, Menu, X, Phone, Mail, Search, MessageSquare, 
  ChevronDown, ChevronRight, Sparkles, Truck, PhoneCall,
  Camera, Zap, Layers, Cpu, Box, Radio, Video, Server, Wrench, Clock
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export default function Navbar({ onOpenEnquire }) {
  const { settings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Click outside to close categories dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setCategoriesOpen(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setCategoriesOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsOpen(false);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Price List', path: '/price-list', badge: 'Wholesale' },
    { name: 'Solutions', path: '/solutions' },
    { name: 'Offers', path: '/offers', badge: 'Hot' },
    { name: 'Dealers', path: '/dealer' },
    { name: 'About Us', path: '/about' },
    { name: 'Downloads', path: '/downloads' },
    { name: 'Contact Us', path: '/contact' },
  ];

  const categories = [
    { name: 'HD Bullet Cameras', slug: 'bullet-cameras', count: '4K / 5MP / 2MP', icon: Camera },
    { name: 'HD Dome Cameras', slug: 'dome-cameras', count: 'Indoor & Outdoor', icon: Video },
    { name: 'Solar 4G PTZ Cameras', slug: 'solar-ptz-cameras', count: 'Off-Grid / SIM', icon: Radio },
    { name: 'CCTV Power Supplies (SMPS)', slug: 'power-supplies', count: '4/8/16 Channel', icon: Zap },
    { name: 'Smart PoE Switches', slug: 'poe-switches', count: '4/8/16/24 Ports', icon: Layers },
    { name: 'Junction Boxes & Mounts', slug: 'junction-boxes', count: 'Weatherproof 4x4', icon: Box },
    { name: 'BNC / DC Connectors & 3+1 Wire', slug: 'connectors-cables', count: 'Copper Pin Gold', icon: Cpu },
    { name: 'DVR / NVR Recorders & Racks', slug: 'recorders-racks', count: '2U / 4U / 6U', icon: Server },
  ];

  const cleanWhatsApp = (settings?.whatsapp_number || '919876543210').replace(/[^0-9]/g, '');
  const phoneDisplay = settings?.phone || '+91 98765 43210';

  return (
    <header className="w-full bg-white relative z-50">
      {/* 1. CCTV PRO Style Top Green Announcement Bar */}
      <div className="bg-[#009B72] text-white text-[11px] sm:text-xs py-2 px-4 font-medium shadow-inner">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 truncate">
            <span className="bg-[#FF5A2C] text-white text-[10px] font-extrabold px-2 py-0.5 rounded shadow-sm shrink-0 uppercase tracking-wider">
              WHOLESALE NOTICE
            </span>
            <span className="truncate">
              All Prices Mentioned are Excl. GST &bull; <strong>200+ CCTV Accessories with NO MOQ</strong> &bull; COD Available &bull; Direct WhatsApp Ordering
            </span>
          </div>
          <div className="hidden md:flex items-center gap-5 shrink-0 text-xs">
            <a 
              href={`https://wa.me/${cleanWhatsApp}?text=Hello%20GS%20Vision,%20I%20want%20to%20order%20CCTV%20accessories`} 
              target="_blank" 
              rel="noreferrer"
              className="text-white hover:text-amber-200 font-bold flex items-center gap-1.5 transition-colors"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Pan-India Courier Dispatch</span>
            </a>
            <span className="opacity-40">|</span>
            <Link to="/admin/login" className="text-white/90 hover:text-white transition-colors">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Secondary Info Strip */}
      <div className="hidden lg:block bg-white border-b border-[#E6E6E6] text-[#666666] text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#009B72]" />
              <span>Support: </span>
              <a href={`tel:${phoneDisplay}`} className="font-semibold text-[#151515] hover:text-[#009B72] transition-colors">
                {phoneDisplay}
              </a>
            </div>
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#009B72]" />
              <a href={`mailto:${settings?.email || 'sales@gsvision.com'}`} className="hover:text-[#009B72] transition-colors">
                {settings?.email || 'sales@gsvision.com'}
              </a>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 text-slate-500">
              <Clock className="w-3.5 h-3.5 text-[#009B72]" />
              <span>{settings?.business_hours || 'Mon - Sat: 9:30 AM - 7:00 PM'}</span>
            </div>
            <span className="text-[#009B72] font-semibold">
              ✓ Genuine Products &amp; Manufacturer Warranty
            </span>
          </div>
        </div>
      </div>

      {/* 3. Main Brand Header with Centered Search */}
      <div className="bg-white border-b border-[#E6E6E6] py-3.5 sm:py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 lg:gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#009B72] flex items-center justify-center text-white shadow-md group-hover:bg-[#007A5A] transition-colors">
              <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-2xl sm:text-[26px] font-black tracking-tight text-[#151515]">GS</span>
                <span className="text-2xl sm:text-[26px] font-black tracking-tight text-[#009B72]">VISION</span>
              </div>
              <p className="text-[10px] tracking-wide text-[#666666] uppercase font-semibold mt-0.5">
                Smart Vision.. Smart Security
              </p>
            </div>
          </Link>

          {/* Desktop Search Bar (450px - 600px) */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4">
            <form onSubmit={handleSearch} className="w-full relative flex items-center">
              <div className="relative w-full flex items-center">
                <input
                  type="text"
                  placeholder="Search cameras, connectors, SMPS, junction boxes, CAT6, racks, tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#F7F8F8] border border-[#E6E6E6] text-[#151515] placeholder-[#8C8C8C] text-sm rounded-l-lg pl-4 pr-10 py-2.5 focus:outline-none focus:border-[#009B72] focus:bg-white transition-all"
                />
                <Search className="w-4 h-4 text-[#8C8C8C] absolute right-3 pointer-events-none" />
              </div>
              <button
                type="submit"
                className="bg-[#009B72] hover:bg-[#007A5A] text-white text-sm font-bold px-6 py-2.5 rounded-r-lg transition-colors shrink-0 flex items-center gap-1.5 shadow-sm"
              >
                <span>Search</span>
              </button>
            </form>
          </div>

          {/* Quick Actions (Right) */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <button
              onClick={() => onOpenEnquire && onOpenEnquire()}
              className="px-4 py-2 rounded-lg text-xs font-bold text-[#009B72] bg-[#E8F8F3] hover:bg-[#009B72] hover:text-white border border-[#009B72]/30 transition-all flex items-center gap-1.5"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Enquire Now</span>
            </button>

            <a
              href={`https://wa.me/${cleanWhatsApp}?text=Hello%20GS%20Vision,%20I%20have%20an%20urgent%20inquiry`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#009B72] hover:bg-[#007A5A] transition-all shadow-sm flex items-center gap-1.5"
            >
              <PhoneCall className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
          </div>

          {/* Mobile Menu & Search Toggles */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-[#151515] hover:bg-[#F1F3F5] border border-[#E6E6E6]"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Form */}
        <div className="mt-3 md:hidden">
          <form onSubmit={handleSearch} className="flex items-center">
            <input
              type="text"
              placeholder="Search CCTV &amp; accessories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F7F8F8] border border-[#E6E6E6] text-[#151515] text-xs rounded-l-lg px-3 py-2 focus:outline-none focus:border-[#009B72]"
            />
            <button
              type="submit"
              className="bg-[#009B72] text-white px-4 py-2 text-xs font-bold rounded-r-lg"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* 4. CCTV PRO Separate Navigation Row with "ALL CATEGORIES" Button */}
      <div className={`hidden lg:block bg-white border-b border-[#E6E6E6] ${scrolled ? 'shadow-md sticky top-0' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Left: "ALL CATEGORIES" Button with Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setCategoriesOpen(!categoriesOpen)}
              className="bg-[#009B72] hover:bg-[#007A5A] text-white font-bold text-xs uppercase tracking-wider py-3.5 px-6 flex items-center gap-3 transition-colors rounded-none shadow-sm"
              aria-expanded={categoriesOpen}
            >
              <Menu className="w-4 h-4" />
              <span>ALL CATEGORIES</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${categoriesOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {categoriesOpen && (
              <div className="absolute top-full left-0 w-72 bg-white border border-[#E6E6E6] shadow-2xl py-2 z-50 rounded-b-xl animate-fadeIn">
                <div className="px-4 py-2 text-[11px] font-bold text-[#666666] uppercase tracking-wider bg-[#F7F8F8] border-b border-[#E6E6E6]">
                  Popular Categories
                </div>
                {categories.map((cat, idx) => {
                  const Icon = cat.icon;
                  return (
                    <Link
                      key={idx}
                      to={`/products?category=${cat.slug}`}
                      onClick={() => setCategoriesOpen(false)}
                      className="flex items-center justify-between px-4 py-2.5 hover:bg-[#E8F8F3] text-xs font-medium text-[#151515] hover:text-[#009B72] transition-colors border-b border-gray-50 last:border-0 group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-md bg-[#F1F3F5] group-hover:bg-white text-[#009B72] flex items-center justify-center transition-colors">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="block font-semibold">{cat.name}</span>
                          <span className="text-[10px] text-[#8C8C8C]">{cat.count}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-[#B3B3B3] group-hover:text-[#009B72] group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  );
                })}
                <div className="p-3 bg-[#F7F8F8] border-t border-[#E6E6E6]">
                  <Link
                    to="/products"
                    onClick={() => setCategoriesOpen(false)}
                    className="block text-center py-2 px-3 bg-[#009B72] hover:bg-[#007A5A] text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    View All Categories &rarr;
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Center: Main Navigation Links */}
          <nav className="flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `px-3.5 py-3 text-xs font-bold transition-all duration-150 relative flex items-center gap-1 ${
                    isActive 
                      ? 'text-[#009B72] border-b-2 border-[#009B72]' 
                      : 'text-[#151515] hover:text-[#009B72]'
                  }`
                }
              >
                <span>{link.name}</span>
                {link.badge && (
                  <span className={`text-[9px] font-black px-1.5 py-0.2 rounded uppercase ${
                    link.badge === 'Wholesale' 
                      ? 'bg-[#FF5A2C] text-white' 
                      : 'bg-amber-400 text-black'
                  }`}>
                    {link.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right: Direct Call / WhatsApp Notice */}
          <div className="flex items-center gap-2 text-xs font-bold text-[#151515]">
            <a 
              href={`tel:${phoneDisplay}`} 
              className="flex items-center gap-1.5 text-[#009B72] hover:text-[#007A5A] bg-[#E8F8F3] px-3 py-1.5 rounded-lg border border-[#009B72]/20 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call: {phoneDisplay}</span>
            </a>
          </div>
        </div>
      </div>

      {/* 5. Mobile Drawer Navigation */}
      {isOpen && (
        <div className="lg:hidden border-t border-[#E6E6E6] bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl animate-fadeIn">
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-[#666666] uppercase px-3 pt-1">
              Menu
            </div>
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    isActive ? 'text-[#009B72] bg-[#E8F8F3]' : 'text-[#151515] hover:bg-[#F7F8F8]'
                  }`
                }
              >
                <span>{link.name}</span>
                {link.badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    link.badge === 'Wholesale' ? 'bg-[#FF5A2C] text-white' : 'bg-amber-400 text-black'
                  }`}>
                    {link.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>

          {/* Mobile Categories list */}
          <div className="pt-2 border-t border-[#E6E6E6] space-y-1">
            <div className="text-[11px] font-bold text-[#666666] uppercase px-3">
              Browse Categories
            </div>
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              {categories.slice(0, 6).map((cat, idx) => (
                <Link
                  key={idx}
                  to={`/products?category=${cat.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="px-2.5 py-2 rounded-lg bg-[#F7F8F8] border border-[#E6E6E6] text-xs font-medium text-[#151515] hover:text-[#009B72] hover:border-[#009B72] truncate"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#E6E6E6] grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenEnquire && onOpenEnquire();
              }}
              className="py-2.5 text-center rounded-lg text-xs font-bold text-[#009B72] bg-[#E8F8F3] border border-[#009B72]/30 flex items-center justify-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Enquire</span>
            </button>
            <a
              href={`https://wa.me/${cleanWhatsApp}?text=Hello%20GS%20Vision,%20I%20am%20contacting%20from%20your%20website`}
              target="_blank"
              rel="noreferrer"
              className="py-2.5 text-center rounded-lg text-xs font-bold text-white bg-[#009B72] flex items-center justify-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
