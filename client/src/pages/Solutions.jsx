import React from 'react';
import {
  Home, Building, Factory, Warehouse, Store, Radio,
  ShieldCheck, Sun, CheckCircle2, ChevronRight, MessageSquare, PhoneCall
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
      subtitle: 'Multi-gate entry monitoring, lobby coverage, and long-range outdoor perimeter protection.',
      icon: ShieldCheck,
      features: [
        '8MM long-range focal lens for vehicle entry tracking',
        'Over 250M extended distance PoE transmission',
        'Heavy-duty CAT6 copper cabling for multi-story risers',
        'Surge-protected multi-port switching infrastructure'
      ]
    },
    {
      title: 'Industrial & Factory CCTV',
      subtitle: 'Heavy-duty monitoring for assembly lines, perimeter walls, high-voltage transformers and loading docks.',
      icon: Factory,
      features: [
        'Explosion-proof and high-temperature rated enclosures',
        'PTZ speed domes with 360° continuous pan/tilt rotation',
        'Industrial surge-protected SMPS power units',
        'Long-range optical sensors for expansive factory yards'
      ]
    },
    {
      title: 'Warehouse & Logistics Security',
      subtitle: 'Asset protection, loading dock monitoring, and forklift transit aisle tracking.',
      icon: Warehouse,
      features: [
        'High frame rate recording for fast-moving forklifts',
        'Corridor mode lenses for narrow high-rack aisles',
        'PoE switches with built-in surge isolation',
        'NVR storage expansion for multi-month retention'
      ]
    },
    {
      title: 'Retail Shop & Showroom Security',
      subtitle: 'POS cash counter surveillance, loss prevention, and customer footfall clarity.',
      icon: Store,
      features: [
        'Dedicated high-resolution lens focused over cash registers',
        '360° panoramic fisheye ceiling cameras to eliminate blind spots',
        'Discreet mini dome cameras blend into shop decor',
        'Mobile app monitoring for store owners on Android/iOS'
      ]
    },
    {
      title: 'Solar 4G Off-Grid Security',
      subtitle: 'Completely wire-free continuous surveillance for construction sites, farmland, and remote assets.',
      icon: Radio,
      features: [
        'High-efficiency monocrystalline solar panels with lithium battery',
        '4G SIM card network connectivity with instant cloud alerts',
        'Humanoid PIR motion detection triggers instant wake-up',
        'IP66 all-weather rated against severe monsoon storms'
      ]
    }
  ];

  return (
    <div className="bg-[#F7F8F8] space-y-12 pb-20">
      <PageHeader
        title="Surveillance Solutions"
        subtitle="Custom-architected CCTV systems and power distribution for every residential, commercial, and industrial environment."
        breadcrumbs={[{ label: 'Solutions' }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {solutionList.map((sol, idx) => {
            const Icon = sol.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-[#E6E6E6] rounded-2xl p-6 shadow-card hover:border-[#009B72] hover:shadow-card-hover transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#E8F8F3] text-[#009B72] flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-[#151515] mb-2">{sol.title}</h3>
                  <p className="text-xs sm:text-sm text-[#666666] leading-relaxed mb-4">{sol.subtitle}</p>

                  <div className="space-y-2 pt-2 border-t border-[#F1F3F5]">
                    {sol.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-xs text-[#404040]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#009B72] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-[#F1F3F5]">
                  <button
                    onClick={() => onOpenEnquire && onOpenEnquire()}
                    className="w-full py-2 bg-[#009B72] hover:bg-[#007A5A] text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Inquire this Solution</span>
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
