import React from 'react';
import {
  Home, Building, Factory, Warehouse, Store, Radio,
  ShieldCheck, Sun, CheckCircle2, ChevronRight, MessageSquare
} from 'lucide-react';
import PageHeader from '../components/common/PageHeader';

export default function Solutions({ onOpenEnquire }) {
  const solutionList = [
    {
      title: 'Home CCTV Security',
      subtitle: 'Comprehensive perimeter and doorstep monitoring with two-way audio and color night vision.',
      icon: Home,
      features: [
        'Full HD color vision in pitch-black night conditions',
        'In-built audio microphones for sound monitoring',
        'Weatherproof IP66 bullet cameras for gates and gardens',
        'Discreet dome cameras for indoor living spaces'
      ]
    },
    {
      title: 'Office CCTV Security',
      subtitle: 'High-definition coverage for corporate workspaces, reception desks, conference rooms and server racks.',
      icon: Building,
      features: [
        'Vandal-resistant dome cameras with zero distortion',
        'VLAN network isolation on smart PoE switches',
        'Centralized DVR and NVR management architecture',
        'High-density SMPS power backup support'
      ]
    },
    {
      title: 'Society & Apartment Security',
      subtitle: 'Multi-gate license plate recognition, lobby monitoring, and long-range outdoor perimeter protection.',
      icon: ShieldCheck,
      features: [
        '8MM long-range focal lens for vehicle entry tracking',
        'Over 250M extended distance PoE transmission',
        'Heavy-duty CAT6 copper cabling for multi-story risers',
        'Surge-protected multi-port switching infrastructure'
      ]
    },
    {
      title: 'Commercial & Corporate Security',
      subtitle: 'Multi-floor enterprise security integrating optical fiber media converters and gigabit backbones.',
      icon: Building,
      features: [
        'Fiber optic transmission up to 20KM distance',
        'PTZ digital zoom cameras for parking complexes',
        'Uninterrupted regulated 12V SMPS power lines',
        'Universal compatibility across all existing DVR systems'
      ]
    },
    {
      title: 'Industrial & Factory CCTV',
      subtitle: 'Ruggedized surveillance systems engineered to withstand dust, high ambient heat, and machinery vibrations.',
      icon: Factory,
      features: [
        'Industrial heat-resistant camera housings',
        'Short-circuit and high-voltage spike protection',
        'High-bandwidth uncompressed video streams',
        'Comprehensive 24/7 recording reliability'
      ]
    },
    {
      title: 'Warehouse & Logistics Security',
      subtitle: 'Panoramic coverage of loading bays, inventory aisles, and packaging dispatch stations.',
      icon: Warehouse,
      features: [
        '360-degree fisheye panoramic dome cameras',
        'High-ceiling mounting hardware and wide-angle lenses',
        'High-output PoE switches for long cable runs',
        'Motion-triggered alerts and audio verification'
      ]
    },
    {
      title: 'Shop & Retail Security',
      subtitle: 'Loss-prevention cameras tailored for cash counters, retail display aisles, and customer entrances.',
      icon: Store,
      features: [
        'Ultra-sharp 3MP clarity for receipt and currency inspection',
        'Compact form-factor dome aesthetics',
        'Plug-and-play installation with standard DVRs',
        'Built-in audio capture for customer service logging'
      ]
    },
    {
      title: 'Solar Powered 4G Security (Remote / Farm)',
      subtitle: 'Completely off-grid surveillance for construction zones, agriculture farms, and remote infrastructure.',
      icon: Sun,
      features: [
        'High-efficiency monocrystalline 20W solar panels',
        'Built-in lithium battery backup for cloudy days',
        '4G LTE SIM card slot - no Wi-Fi router needed',
        '360° pan-tilt-zoom mobile control via smartphone'
      ]
    }
  ];

  return (
    <div className="space-y-16 pb-20">
      <PageHeader
        title="CCTV & Surveillance Solutions"
        subtitle="End-to-end security architectures engineered for residences, commercial enterprises, and off-grid remote sites."
        breadcrumbs={[{ label: 'Solutions' }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {solutionList.map((sol, idx) => {
            const Icon = sol.icon;
            return (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 hover:border-cyan-500/40 rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 group"
              >
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {sol.title}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {sol.subtitle}
                  </p>

                  <div className="pt-2 space-y-2.5">
                    {sol.features.map((feat, fidx) => (
                      <div key={fidx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => onOpenEnquire && onOpenEnquire()}
                    className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 transition-all flex items-center gap-2 shadow-md"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Inquire for this Solution</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
