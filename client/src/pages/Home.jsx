import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, Video, Cpu, Radio, Zap, Network, HardDrive, Wrench,
  Award, Clock, CheckCircle2, ChevronRight, PhoneCall, Sparkles,
  ArrowRight, Download, Users, Building, Warehouse, Store, Home as HomeIcon,
  Factory, ShieldCheck, Tag, Box, Truck, FileSpreadsheet, PackageCheck
} from 'lucide-react';
import api from '../api/axios';
import BannerSlider from '../components/ui/BannerSlider';
import ProductCard from '../components/ui/ProductCard';
import Loader from '../components/ui/Loader';
import { useSettings } from '../context/SettingsContext';

export default function Home({ onOpenEnquire }) {
  const { settings } = useSettings();
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);
  const [offers, setOffers] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [bannersRes, catsRes, productsRes, offersRes, testRes] = await Promise.all([
          api.get('/banners').catch(() => ({ data: { banners: [] } })),
          api.get('/categories').catch(() => ({ data: { categories: [] } })),
          api.get('/products?limit=12').catch(() => ({ data: { products: [] } })),
          api.get('/offers').catch(() => ({ data: { offers: [] } })),
          api.get('/testimonials').catch(() => ({ data: { testimonials: [] } })),
        ]);

        if (bannersRes.data.banners) setBanners(bannersRes.data.banners);
        if (catsRes.data.categories) setCategories(catsRes.data.categories);
        if (productsRes.data.products) {
          const prods = productsRes.data.products;
          setFeaturedProducts(prods.filter((p) => p.featured).slice(0, 8));
          setLatestProducts(prods.slice(0, 8));
        }
        if (offersRes.data.offers) setOffers(offersRes.data.offers);
        if (testRes.data.testimonials) setTestimonials(testRes.data.testimonials);
      } catch (err) {
        console.error('Home load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const solutions = [
    { title: 'Home CCTV Security', desc: 'Crystal clear full-color night vision cameras and smart audio detection for families.', icon: HomeIcon },
    { title: 'Office & Corporate Security', desc: 'Discreet 3MP dome and panoramic cameras for workspaces and server rooms.', icon: Building },
    { title: 'Industrial CCTV & Plants', desc: 'Heavy-duty weatherproof PTZ and multi-port SMPS for factories and manufacturing plants.', icon: Factory },
    { title: 'Warehouse & Logistics', desc: 'Long-range optical bullet cameras with 250m extended PoE networking.', icon: Warehouse },
    { title: 'Shop & Retail Security', desc: '360° Fisheye surveillance to eliminate blind spots and monitor cash counters.', icon: Store },
    { title: 'Solar 4G Remote Sites', desc: 'Wire-free solar powered surveillance for construction, farms, and outdoor perimeters.', icon: Radio },
  ];

  const whyChoose = [
    { title: 'Quality Hardware', desc: '100% pure copper coils in SMPS and premium optical glass lenses.', icon: Award },
    { title: 'Smart Vision Fidelity', desc: 'Ultra-low-light true color night vision with embedded sensitive audio.', icon: Video },
    { title: 'Enterprise Reliability', desc: 'Tested against thermal load, power spikes, and severe outdoor weather.', icon: ShieldCheck },
    { title: 'Dealer First Ecosystem', desc: 'Lucrative margins, promotional combo bonuses, and rapid warranty turnaround.', icon: Users },
    { title: 'Universal Compatibility', desc: 'All cameras natively support TVI, AHD, CVI, and CVBS DVR systems.', icon: Zap },
    { title: '24/7 Dedicated Support', desc: 'Direct access to experienced technical engineers and system design experts.', icon: Clock },
  ];

  const cleanWhatsApp = (settings?.whatsapp_number || '919876543210').replace(/[^0-9]/g, '');

  return (
    <div className="bg-[#F7F8F8] space-y-16 pb-20">
      
      {/* 1. Hero Banner Slider */}
      <BannerSlider banners={banners} onEnquire={() => onOpenEnquire()} />

      {/* 2. CCTV PRO Signature 4-Box Value Proposition Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-[#E6E6E6] rounded-xl p-4 shadow-sm flex items-center gap-3.5 hover:border-[#009B72] transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#E8F8F3] text-[#009B72] flex items-center justify-center shrink-0">
              <PackageCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#151515]">NO MOQ Needed</h4>
              <p className="text-[11px] text-[#666666] leading-tight mt-0.5">Order single items or bulk at transparent wholesale rates</p>
            </div>
          </div>

          <div className="bg-white border border-[#E6E6E6] rounded-xl p-4 shadow-sm flex items-center gap-3.5 hover:border-[#009B72] transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#E8F8F3] text-[#009B72] flex items-center justify-center shrink-0">
              <Box className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#151515]">200+ CCTV Accessories</h4>
              <p className="text-[11px] text-[#666666] leading-tight mt-0.5">SMPS, BNC, DC, Racks, Boxes, HDMI Extenders &amp; Tools</p>
            </div>
          </div>

          <div className="bg-white border border-[#E6E6E6] rounded-xl p-4 shadow-sm flex items-center gap-3.5 hover:border-[#009B72] transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#E8F8F3] text-[#009B72] flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#151515]">Fast Pan-India Dispatch</h4>
              <p className="text-[11px] text-[#666666] leading-tight mt-0.5">Express courier logistics &amp; token advance COD support</p>
            </div>
          </div>

          <div className="bg-white border border-[#E6E6E6] rounded-xl p-4 shadow-sm flex items-center gap-3.5 hover:border-[#009B72] transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#E8F8F3] text-[#009B72] flex items-center justify-center shrink-0">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#151515]">Direct WhatsApp Orders</h4>
              <p className="text-[11px] text-[#666666] leading-tight mt-0.5">Instant quotes, invoice dispatch &amp; tracking updates</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">

        {/* 3. CCTV PRO Style "Shop by Category" (Circular Design) */}
        <section className="bg-white border border-[#E6E6E6] rounded-2xl p-6 sm:p-8 shadow-card">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#F1F3F5]">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[#009B72] text-xs font-black uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>CATEGORIES CATALOGUE</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#151515] tracking-tight">
                Shop by CCTV &amp; Security Category
              </h2>
              <p className="text-[#666666] text-xs sm:text-sm mt-1">
                Browse our complete selection of cameras, recorders, power supplies, connectors, and mounting hardware.
              </p>
            </div>
            <Link
              to="/products"
              className="mt-3 md:mt-0 inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#009B72] hover:text-[#007A5A] transition-colors"
            >
              <span>View All Products</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Circular Category Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 sm:gap-8">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.slug}`}
                className="group flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#F7F8F8] group-hover:bg-white border-2 border-[#E6E6E6] group-hover:border-[#009B72] shadow-sm group-hover:shadow-md transition-all duration-300 flex items-center justify-center p-4 mb-3 group-hover:-translate-y-1">
                  <img
                    src={cat.image_url || '/assets/categories/cctv.png'}
                    alt={cat.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/assets/products/placeholder.jpg';
                    }}
                  />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-[#151515] group-hover:text-[#009B72] transition-colors line-clamp-2 px-1">
                  {cat.name}
                </h3>
                <span className="text-[10px] text-[#8C8C8C] mt-0.5 group-hover:text-[#009B72] transition-colors">
                  Explore &rarr;
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* 4. Wholesale Price List Banner Callout */}
        <section className="bg-gradient-to-r from-[#009B72] to-[#007A5A] rounded-2xl p-6 sm:p-8 text-white shadow-teal-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-extrabold uppercase tracking-wider">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>LIVE WHOLESALE PRICE LIST</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              Looking for Transparent CCTV Trade Pricing?
            </h3>
            <p className="text-white/90 text-xs sm:text-sm max-w-2xl">
              Access the complete live wholesale matrix with transparent GST breakdowns, bulk discount tiers, and 1-click WhatsApp order generation.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/price-list"
              className="px-6 py-3 bg-white hover:bg-[#F7F8F8] text-[#009B72] font-black text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Open Price List</span>
            </Link>
            <a
              href={`https://wa.me/${cleanWhatsApp}?text=Hello%20GS%20Vision,%20please%20send%20me%20your%20latest%20PDF%20price%20list`}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 bg-[#FF5A2C] hover:bg-[#FF7A45] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4" />
              <span>WhatsApp PDF</span>
            </a>
          </div>
        </section>

        {/* 5. Featured Security Products */}
        <section>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[#009B72] text-xs font-black uppercase tracking-wider mb-1">
                <Tag className="w-3.5 h-3.5" />
                <span>POPULAR HARDWARE</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#151515] tracking-tight">
                Featured Surveillance Cameras &amp; Systems
              </h2>
              <p className="text-[#666666] text-xs sm:text-sm mt-1">
                Top-rated bullet, dome, solar, and wireless cameras with enterprise warranty.
              </p>
            </div>
            <Link
              to="/products"
              className="mt-3 md:mt-0 inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#009B72] hover:text-[#007A5A] transition-colors"
            >
              <span>View All Products ({featuredProducts.length}+)</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} onEnquire={(p) => onOpenEnquire(p)} />
            ))}
          </div>
        </section>

        {/* 6. CCTV Solutions for Every Environment */}
        <section>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 text-[#009B72] text-xs font-black uppercase tracking-wider mb-1">
              <Network className="w-3.5 h-3.5" />
              <span>TAILORED ARCHITECTURES</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#151515] tracking-tight">
              CCTV Solutions for Every Environment
            </h2>
            <p className="text-[#666666] text-xs sm:text-sm mt-1">
              Engineered for seamless integration across homes, retail shops, factories, and remote assets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {solutions.map((sol, idx) => {
              const Icon = sol.icon;
              return (
                <div
                  key={idx}
                  className="bg-white border border-[#E6E6E6] rounded-xl p-6 shadow-sm hover:border-[#009B72] hover:shadow-card-hover transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#E8F8F3] text-[#009B72] flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-[#151515] mb-2">{sol.title}</h3>
                    <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">{sol.desc}</p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-[#F1F3F5] flex items-center justify-between">
                    <button
                      onClick={() => onOpenEnquire()}
                      className="text-xs font-bold text-[#009B72] hover:text-[#007A5A] flex items-center gap-1"
                    >
                      <span>Inquire Solution</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <Link
                      to="/solutions"
                      className="text-xs text-[#8C8C8C] hover:text-[#151515]"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 7. Why Choose GS Vision */}
        <section className="bg-white border border-[#E6E6E6] rounded-2xl p-6 sm:p-10 shadow-card">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 text-[#009B72] text-xs font-black uppercase tracking-wider mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>THE GS VISION ADVANTAGE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#151515] tracking-tight">
              Why Installers &amp; Integrators Choose Us
            </h2>
            <p className="text-[#666666] text-xs sm:text-sm mt-1">
              Uncompromising component quality, transparent trade pricing, and responsive post-sales assistance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChoose.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-[#F7F8F8] border border-[#E6E6E6] hover:bg-white hover:border-[#009B72] hover:shadow-sm transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#E8F8F3] text-[#009B72] flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-[#151515] mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#666666] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 8. Become a Dealer CTA */}
        <section className="rounded-2xl bg-gradient-to-r from-[#151515] via-[#262626] to-[#151515] text-white p-8 sm:p-12 shadow-xl border border-gray-800">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5A2C]/20 border border-[#FF5A2C]/40 text-[#FF5A2C] text-xs font-extrabold uppercase tracking-wider">
              <Users className="w-3.5 h-3.5" />
              <span>AUTHORIZED DEALER NETWORK</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Grow Your CCTV Business as an Authorized <span className="text-[#009B72]">GS Vision Dealer</span>
            </h2>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
              Join hundreds of CCTV installers, system integrators, and security distributors across India. Enjoy wholesale trade discounts, direct manufacturer warranty, priority courier dispatch, and marketing collateral.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/dealer"
                className="px-6 py-3 rounded-xl font-black text-xs sm:text-sm text-white bg-[#009B72] hover:bg-[#007A5A] shadow-md transition-all flex items-center gap-2"
              >
                <span>Apply for Dealership</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/downloads"
                className="px-5 py-3 rounded-xl font-bold text-xs sm:text-sm text-gray-200 hover:text-white bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4 text-[#009B72]" />
                <span>Download Catalogue</span>
              </Link>
            </div>
          </div>
        </section>

        {/* 9. Client Testimonials */}
        {testimonials.length > 0 && (
          <section>
            <div className="text-center max-w-2xl mx-auto mb-10">
              <div className="inline-flex items-center gap-1.5 text-[#009B72] text-xs font-black uppercase tracking-wider mb-1">
                <span>CLIENT REVIEWS</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#151515] tracking-tight">
                Trusted by Integrators &amp; Enterprises
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <div key={t.id} className="bg-white border border-[#E6E6E6] p-6 rounded-xl shadow-sm flex flex-col justify-between">
                  <p className="text-xs sm:text-sm text-[#404040] italic leading-relaxed">
                    "{t.comment}"
                  </p>
                  <div className="mt-5 pt-4 border-t border-[#F1F3F5] flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#E8F8F3] text-[#009B72] flex items-center justify-center font-bold text-sm">
                      {t.client_name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#151515]">{t.client_name}</h4>
                      <p className="text-[11px] text-[#8C8C8C]">{t.company}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
