import React from 'react';
import { ShieldCheck, Target, Eye, Award, CheckCircle2, Cpu, Zap, Users, PhoneCall, ArrowRight } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import { useSettings } from '../context/SettingsContext';
import { Link } from 'react-router-dom';

export default function About({ onOpenEnquire }) {
  const { settings } = useSettings();

  return (
    <div className="space-y-16 pb-20">
      <PageHeader
        title="About GS Vision"
        subtitle="Engineering intelligent surveillance hardware for uncompromising clarity and peace of mind."
        breadcrumbs={[{ label: 'About Us' }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Story Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Company Introduction</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Smart Vision.. <span className="gradient-text">Smart Security</span>
            </h2>
            <p className="text-slate-300 text-base leading-relaxed">
              {settings?.about_full ||
                'GS Vision stands at the forefront of the electronic security and surveillance industry. We design, manufacture, and supply premier CCTV cameras, high-definition IP systems, PoE networking switches, switching mode power supplies (SMPS), and high-bandwidth CAT6 copper cables.'}
            </p>
            <p className="text-slate-400 text-sm leading-relaxed">
              Every system built with GS Vision hardware is designed for round-the-clock reliability under harsh environmental conditions, zero video latency, and crystal-clear night vision optical performance.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <button
                onClick={() => onOpenEnquire && onOpenEnquire()}
                className="px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 transition-all shadow-lg shadow-cyan-500/20"
              >
                Connect with our Team
              </button>
              <Link
                to="/dealer"
                className="px-6 py-3 rounded-xl text-sm font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
              >
                Become a Dealer
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl relative">
              <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-black text-xl">
                  GS
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">GS Vision Core Values</h3>
                  <p className="text-xs text-slate-400">Security Without Compromise</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { title: 'Full HD Colour Vision', desc: 'True color rendering even in zero-lux ambient darkness.' },
                  { title: 'Universal Compatibility', desc: 'Plug-and-play operation with AHD, TVI, CVI, and CVBS DVRs.' },
                  { title: 'Surge & Heat Protection', desc: 'Over-voltage and short-circuit prevention in all power supplies.' },
                  { title: 'Channel Partner Success', desc: 'Fair dealer pricing, robust warranty, and prompt RMA support.' }
                ].map((val, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-white">{val.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{val.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-4 hover:border-cyan-500/30 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white">Our Vision</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              {settings?.vision_text ||
                'To empower homes, communities, and enterprises across the nation with ultra-clear, intelligent, and affordable surveillance solutions that safeguard lives, assets, and infrastructure with zero compromise.'}
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-4 hover:border-blue-500/30 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white">Our Mission</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              {settings?.mission_text ||
                'To manufacture and distribute cutting-edge CCTV cameras, smart PoE networking, and high-efficiency power supplies while fostering long-term, profitable relationships with security installers, dealers, and system integrators.'}
            </p>
          </div>
        </section>

        {/* Quality Commitment */}
        <section className="rounded-3xl bg-gradient-to-r from-[#071322] to-slate-900 border border-slate-800 p-8 sm:p-12 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            <span>Manufacturing & Quality Control</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Our Commitment to Quality
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-4xl">
            {settings?.quality_commitment ||
              'Every GS Vision camera, power supply, and network switch undergoes rigorous multi-stage quality testing for heat resistance, surge protection, and low-light optical fidelity before leaving our facilities. We use 100% pure copper in our CAT6 cables and high-grade capacitors in our SMPS units to guarantee prolonged operational life.'}
          </p>
        </section>
      </div>
    </div>
  );
}
