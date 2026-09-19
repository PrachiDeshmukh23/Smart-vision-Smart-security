import React from 'react';
import { ShieldCheck, Target, Eye, Award, CheckCircle2, Cpu, Zap, Users, PhoneCall, ArrowRight, PackageCheck, Truck } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import { useSettings } from '../context/SettingsContext';
import { Link } from 'react-router-dom';

export default function About({ onOpenEnquire }) {
  const { settings } = useSettings();
  const cleanWhatsApp = (settings?.whatsapp_number || '919876543210').replace(/[^0-9]/g, '');

  return (
    <div className="bg-[#F7F8F8] space-y-12 pb-20">
      <PageHeader
        title="About GS Vision"
        subtitle="Engineering intelligent surveillance hardware, power supplies, and 200+ CCTV accessories for uncompromising clarity and reliability."
        breadcrumbs={[{ label: 'About Us' }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Story Section */}
        <section className="bg-white border border-[#E6E6E6] rounded-2xl p-6 sm:p-10 shadow-card">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F8F3] border border-[#009B72]/30 text-[#009B72] text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Company Profile</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-[#151515] tracking-tight leading-tight">
                Smart Vision.. <span className="text-[#009B72]">Smart Security</span>
              </h2>
              <p className="text-[#404040] text-sm sm:text-base leading-relaxed">
                {settings?.about_full ||
                  'GS Vision stands at the forefront of the electronic security and surveillance industry. We supply premier CCTV cameras, high-definition IP systems, PoE networking switches, switching mode power supplies (SMPS), DVR/NVR racks, junction boxes, and copper cables with NO Minimum Order Quantity (No MOQ).'}
              </p>
              <p className="text-[#666666] text-xs sm:text-sm leading-relaxed">
                Every system built with GS Vision hardware is designed for round-the-clock reliability under harsh environmental conditions, zero video latency, and crystal-clear night vision optical performance.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={() => onOpenEnquire && onOpenEnquire()}
                  className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#009B72] hover:bg-[#007A5A] transition-all shadow-md"
                >
                  Request Trade Quote
                </button>
                <Link
                  to="/dealer"
                  className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-[#151515] bg-[#F7F8F8] hover:bg-[#E6E6E6] border border-[#E6E6E6] transition-colors"
                >
                  Become a Dealer
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-[#F7F8F8] border border-[#E6E6E6] text-center">
                <div className="text-3xl font-black text-[#009B72]">200+</div>
                <div className="text-xs font-bold text-[#151515] mt-1">CCTV Accessories</div>
                <div className="text-[10px] text-[#666666]">Ready for Dispatch</div>
              </div>
              <div className="p-5 rounded-xl bg-[#F7F8F8] border border-[#E6E6E6] text-center">
                <div className="text-3xl font-black text-[#FF5A2C]">NO MOQ</div>
                <div className="text-xs font-bold text-[#151515] mt-1">Order Flexibility</div>
                <div className="text-[10px] text-[#666666]">1pc to Bulk Lots</div>
              </div>
              <div className="p-5 rounded-xl bg-[#F7F8F8] border border-[#E6E6E6] text-center">
                <div className="text-3xl font-black text-[#009B72]">100%</div>
                <div className="text-xs font-bold text-[#151515] mt-1">Genuine Hardware</div>
                <div className="text-[10px] text-[#666666]">Tested Quality</div>
              </div>
              <div className="p-5 rounded-xl bg-[#F7F8F8] border border-[#E6E6E6] text-center">
                <div className="text-3xl font-black text-[#009B72]">Pan-India</div>
                <div className="text-xs font-bold text-[#151515] mt-1">Courier Logistics</div>
                <div className="text-[10px] text-[#666666]">Fast Turnaround</div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-[#E6E6E6] rounded-2xl p-6 sm:p-8 shadow-card space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#E8F8F3] text-[#009B72] flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-[#151515]">Our Mission</h3>
            <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
              To empower system integrators, businesses, and residential communities with ultra-dependable surveillance hardware, crystal clear vision, and hassle-free wholesale access with zero minimum order quantity hurdles.
            </p>
          </div>

          <div className="bg-white border border-[#E6E6E6] rounded-2xl p-6 sm:p-8 shadow-card space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#E8F8F3] text-[#009B72] flex items-center justify-center">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-[#151515]">Our Vision</h3>
            <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
              To be India's most trusted electronic surveillance partner, renowned for technological excellence, transparent trade pricing, and nationwide dealer satisfaction.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
