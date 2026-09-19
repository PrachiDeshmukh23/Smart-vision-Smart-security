import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ShieldCheck, ArrowRight, MessageSquare, PhoneCall, Sparkles } from 'lucide-react';

export default function BannerSlider({ banners = [], onEnquire }) {
  const [current, setCurrent] = useState(0);

  const slides = banners.length > 0 ? banners : [
    {
      id: 1,
      title: 'Smart Vision.. Smart Security Systems',
      subtitle: 'Complete CCTV surveillance range, HD cameras, SMPS power supplies, and 200+ accessories with NO Minimum Order Quantity (No MOQ).',
      cta_text: 'Explore Catalogue',
      cta_url: '/products',
      desktop_image: '/assets/banners/hero-1.jpg'
    },
    {
      id: 2,
      title: 'Live Wholesale CCTV Price List',
      subtitle: 'Transparent dealer & installer pricing with express pan-India dispatch and token advance COD support.',
      cta_text: 'View Price List',
      cta_url: '/price-list',
      desktop_image: '/assets/categories/cctv.png'
    },
    {
      id: 3,
      title: 'Solar Powered 4G PTZ Security Cameras',
      subtitle: 'Continuous 360° outdoor surveillance without WiFi or AC power grid dependency.',
      cta_text: 'View Solar Cameras',
      cta_url: '/products?category=solar-ptz-cameras',
      desktop_image: '/assets/categories/solar.jpg'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const prevSlide = () => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);

  const slide = slides[current];

  return (
    <div className="relative w-full h-[460px] sm:h-[500px] lg:h-[540px] bg-[#0F201B] overflow-hidden select-none border-b border-[#E6E6E6]">
      {/* Background Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0F201B] via-[#0F201B]/90 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0F201B]/80 via-transparent to-transparent z-10" />

      {/* Decorative Glow */}
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-[#009B72]/20 rounded-full blur-[100px] pointer-events-none z-10" />

      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 transform scale-105 opacity-35 mix-blend-luminosity"
        style={{
          backgroundImage: `url(${slide?.desktop_image || '/assets/banners/hero-1.jpg'})`,
        }}
      />

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-2xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#009B72]/20 border border-[#009B72]/40 text-[#4EEDB8] text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <ShieldCheck className="w-4 h-4" />
            <span>GS VISION SECURITY</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
            {slide?.title}
          </h1>

          <p className="text-sm sm:text-base text-gray-200 font-normal leading-relaxed max-w-xl">
            {slide?.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to={slide?.cta_url || '/products'}
              className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#009B72] hover:bg-[#007A5A] shadow-lg shadow-[#009B72]/30 transition-all flex items-center gap-2"
            >
              <span>{slide?.cta_text || 'Explore Products'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => onEnquire && onEnquire()}
              className="px-5 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition-all flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-[#4EEDB8]" />
              <span>Enquire Now</span>
            </button>
          </div>
        </div>
      </div>

      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/40 hover:bg-[#009B72] text-white border border-white/10 backdrop-blur-sm transition-all"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/40 hover:bg-[#009B72] text-white border border-white/10 backdrop-blur-sm transition-all"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {slides.length > 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-2 rounded-full transition-all ${
                current === idx ? 'w-8 bg-[#009B72]' : 'w-2 bg-white/40 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
