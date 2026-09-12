import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Phone, Mail, Clock, ChevronRight } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export default function Footer({ onOpenEnquire }) {
  const { settings } = useSettings();

  return (
    <footer className="bg-[#060D17] text-slate-300 border-t border-slate-800/80 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
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
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              {settings?.about_short || 'GS Vision is a premier security camera, CCTV surveillance, and networking infrastructure provider, engineered for uncompromising clarity, reliability, and enterprise peace of mind.'}
            </p>
            <div className="pt-2">
              <button
                onClick={() => onOpenEnquire && onOpenEnquire()}
                className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition-all flex items-center gap-1.5"
              >
                <span>Request Product Quote</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-cyan-400 pl-2">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link to="/" className="hover:text-cyan-400 transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-cyan-400 transition-colors">About GS Vision</Link></li>
              <li><Link to="/products" className="hover:text-cyan-400 transition-colors">All Products</Link></li>
              <li><Link to="/solutions" className="hover:text-cyan-400 transition-colors">CCTV Solutions</Link></li>
              <li><Link to="/offers" className="hover:text-cyan-400 transition-colors">Latest Offers</Link></li>
              <li><Link to="/dealer" className="hover:text-amber-300 transition-colors text-amber-400">Become a Dealer</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-blue-500 pl-2">
              Key Categories
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link to="/products?category=bullet-cameras" className="hover:text-cyan-400">HD Bullet Cameras</Link></li>
              <li><Link to="/products?category=dome-cameras" className="hover:text-cyan-400">HD Dome Cameras</Link></li>
              <li><Link to="/products?category=fisheye-cameras" className="hover:text-cyan-400">Fisheye Panoramic</Link></li>
              <li><Link to="/products?category=solar-ptz-cameras" className="hover:text-cyan-400">Solar Powered 4G</Link></li>
              <li><Link to="/products?category=power-supplies" className="hover:text-cyan-400">CCTV SMPS Power</Link></li>
              <li><Link to="/products?category=poe-switches" className="hover:text-cyan-400">Smart PoE Switches</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-cyan-400 pl-2">
              Contact Us
            </h4>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-1" />
                <span className="text-xs leading-relaxed">{settings?.address || 'Industrial Area, Electronic City, Phase II, New Delhi'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <a href={`tel:${settings?.phone}`} className="text-xs hover:text-white transition-colors">
                  {settings?.phone || '+91 98765 43210'}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <a href={`mailto:${settings?.email}`} className="text-xs hover:text-white transition-colors">
                  {settings?.email || 'sales@gsvision.com'}
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span className="text-xs">{settings?.business_hours || 'Mon - Sat: 9:30 AM - 7:00 PM'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} GS Vision. All Rights Reserved. Smart Vision.. Smart Security.</p>
          <div className="flex items-center gap-6">
            <Link to="/downloads" className="hover:text-slate-300 transition-colors">Downloads</Link>
            <Link to="/gallery" className="hover:text-slate-300 transition-colors">Gallery</Link>
            <Link to="/contact" className="hover:text-slate-300 transition-colors">Support</Link>
            <Link to="/admin/login" className="text-slate-600 hover:text-cyan-400 transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
