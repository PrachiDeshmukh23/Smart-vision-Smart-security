import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ShieldCheck, ArrowRight, MessageSquare } from 'lucide-react';

export default function BannerSlider({ banners = [], onEnquire }) {
  const [current, setCurrent] = useState(0);

  const slides = banners.length > 0 ? banners : [
    {
      id: 1,
      title: 'Next-Gen CCTV & Smart Surveillance',
      subtitle: 'Smart Vision.. Smart Security | High-Definition Optical Clarity & 24/7 Color Night Vision',
      cta_text: 'Explore Products',
      cta_url: '/products',
      desktop_image: '/assets/banners/hero-1.jpg'
    },
    {
      id: 2,
      title: 'Solar Powered 4G Remote Security',
      subtitle: 'Continuous 360° Monitoring Anywhere Without WiFi Or Electrical Infrastructure',
      cta_text: 'View Solar Cameras',
      cta_url: '/products?category=solar-ptz-cameras',
      desktop_image: '/assets/categories/solar.jpg'
    },
    {
      id: 3,
      title: 'Industrial PoE Switches & Networking',
      subtitle: 'Zero Packet Loss Transmission For Expanding Commercial Surveillance Networks',
      cta_text: 'Become a Dealer',
      cta_url: '/dealer',
      desktop_image: '/assets/categories/poe.jpg'
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
    <div className="relative w-full h-[480px] sm:h-[540px] lg:h-[580px] bg-slate-950 overflow-hidden select-none border-b border-slate-800">
      <div className="absolute inset-0 bg-gradient-to-r from-[#07111F] via-[#0B192C]/90 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B192C] via-transparent to-transparent z-10" />

      <div className="absolute top-1/4 right-1/4 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none z-10" />

      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 transform scale-105 opacity-30 mix-blend-luminosity"
        style={{
          backgroundImage: `url(${slide?.desktop_image || '/assets/banners/hero-1.jpg'})`,
        }}
      />

      <div className="relative z-20 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <ShieldCheck className="w-4 h-4" />
            <span>GS Vision Professional Security</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
            {slide?.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            {slide?.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to={slide?.cta_url || '/products'}
              className="px-7 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-xl shadow-cyan-500/25 transition-all flex items-center gap-2 active:scale-95"
            >
              <span>{slide?.cta_text || 'Explore Products'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => onEnquire && onEnquire()}
              className="px-6 py-3.5 rounded-xl font-bold text-slate-200 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700 backdrop-blur-md transition-all flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <span>Contact Us</span>
            </button>
          </div>
        </div>
      </div>

      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 backdrop-blur-sm transition-all"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 backdrop-blur-sm transition-all"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-2 rounded-full transition-all ${
                current === idx ? 'w-8 bg-cyan-400' : 'w-2 bg-slate-600 hover:bg-slate-400'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
