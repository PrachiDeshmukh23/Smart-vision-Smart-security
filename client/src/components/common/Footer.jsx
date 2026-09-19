import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Phone, Mail, Clock, ChevronRight, PhoneCall, Truck } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export default function Footer({ onOpenEnquire }) {
  const { settings } = useSettings();
  const cleanWhatsApp = (settings?.whatsapp_number || '919876543210').replace(/[^0-9]/g, '');
  const phoneDisplay = settings?.phone || '+91 98765 43210';

  return (
    <footer className="bg-[#151515] text-gray-300 border-t-4 border-[#009B72] pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-10 border-b border-gray-800">
          
          {/* Company Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#009B72] flex items-center justify-center text-white shadow-md">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="text-2xl font-black text-white">GS</span>
                  <span className="text-2xl font-black text-[#009B72]">VISION</span>
                </div>
                <p className="text-[10px] tracking-wider text-gray-400 uppercase font-semibold mt-0.5">
                  Smart Vision.. Smart Security
                </p>
              </div>
            </Link>
            
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-md">
              {settings?.about_short || 'GS Vision is a premier security camera, CCTV surveillance hardware, and networking accessories company, providing high-reliability surveillance cameras, SMPS power supplies, racks, and accessories with NO MOQ.'}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onOpenEnquire && onOpenEnquire()}
                className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-[#009B72] hover:bg-[#007A5A] text-white transition-all flex items-center gap-1.5 shadow-sm"
              >
                <span>Request Quote</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <a
                href={`https://wa.me/${cleanWhatsApp}?text=Hello%20GS%20Vision,%20I%20have%20an%20enquiry`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-white/10 hover:bg-white/20 text-white border border-gray-700 transition-all flex items-center gap-1.5"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#009B72]" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div>
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider mb-4 border-l-2 border-[#009B72] pl-2">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
              <li><Link to="/" className="hover:text-[#009B72] transition-colors">Home</Link></li>
              <li><Link to="/products" className="hover:text-[#009B72] transition-colors">All Products</Link></li>
              <li><Link to="/price-list" className="hover:text-[#FF5A2C] text-[#FF5A2C] font-semibold transition-colors">Wholesale Price List</Link></li>
              <li><Link to="/solutions" className="hover:text-[#009B72] transition-colors">CCTV Solutions</Link></li>
              <li><Link to="/offers" className="hover:text-[#009B72] transition-colors">Special Offers</Link></li>
              <li><Link to="/dealer" className="hover:text-amber-300 transition-colors text-amber-400">Become a Dealer</Link></li>
              <li><Link to="/about" className="hover:text-[#009B72] transition-colors">About GS Vision</Link></li>
            </ul>
          </div>

          {/* Product Categories */}
          <div>
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider mb-4 border-l-2 border-[#009B72] pl-2">
              Key Categories
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
              <li><Link to="/products?category=bullet-cameras" className="hover:text-[#009B72]">HD Bullet Cameras</Link></li>
              <li><Link to="/products?category=dome-cameras" className="hover:text-[#009B72]">HD Dome Cameras</Link></li>
              <li><Link to="/products?category=solar-ptz-cameras" className="hover:text-[#009B72]">Solar 4G PTZ</Link></li>
              <li><Link to="/products?category=power-supplies" className="hover:text-[#009B72]">CCTV SMPS Power</Link></li>
              <li><Link to="/products?category=poe-switches" className="hover:text-[#009B72]">Smart PoE Switches</Link></li>
              <li><Link to="/products?category=junction-boxes" className="hover:text-[#009B72]">Junction Boxes &amp; Mounts</Link></li>
            </ul>
          </div>

          {/* Direct Contact Info */}
          <div>
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider mb-4 border-l-2 border-[#009B72] pl-2">
              Contact &amp; Support
            </h4>
            <div className="space-y-3 text-xs sm:text-sm text-gray-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#009B72] shrink-0 mt-0.5" />
                <span className="leading-relaxed">{settings?.address || 'Industrial Area, Electronic City, Phase II, New Delhi'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#009B72] shrink-0" />
                <a href={`tel:${phoneDisplay}`} className="hover:text-white transition-colors">
                  {phoneDisplay}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#009B72] shrink-0" />
                <a href={`mailto:${settings?.email || 'sales@gsvision.com'}`} className="hover:text-white transition-colors">
                  {settings?.email || 'sales@gsvision.com'}
                </a>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#009B72] shrink-0 mt-0.5" />
                <span>{settings?.business_hours || 'Mon - Sat: 9:30 AM - 7:00 PM'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} GS Vision. All Rights Reserved. Smart Vision.. Smart Security.</p>
          <div className="flex items-center gap-6">
            <Link to="/downloads" className="hover:text-gray-300 transition-colors">Downloads</Link>
            <Link to="/gallery" className="hover:text-gray-300 transition-colors">Gallery</Link>
            <Link to="/contact" className="hover:text-gray-300 transition-colors">Help &amp; Support</Link>
            <Link to="/admin/login" className="text-gray-600 hover:text-[#009B72] transition-colors">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
