import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, Video, Cpu, Radio, Zap, Network, HardDrive, Wrench,
  Award, Clock, CheckCircle2, ChevronRight, PhoneCall, Sparkles,
  ArrowRight, Download, Users, Building, Warehouse, Store, Home as HomeIcon,
  Factory, ShieldCheck, Tag
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
          setFeaturedProducts(prods.filter((p) => p.featured).slice(0, 6));
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
    { title: 'Home CCTV Security', desc: 'Crystal clear full-color night vision cameras and smart audio detection for families.', icon: HomeIcon, link: '/solutions' },
    { title: 'Office Security', desc: 'Discreet 3MP dome and panoramic cameras for workspaces and server rooms.', icon: Building, link: '/solutions' },
    { title: 'Industrial CCTV', desc: 'Heavy-duty weatherproof PTZ and multi-port SMPS for factories and manufacturing plants.', icon: Factory, link: '/solutions' },
    { title: 'Warehouse & Logistics', desc: 'Long-range optical bullet cameras with 250m extended PoE networking.', icon: Warehouse, link: '/solutions' },
    { title: 'Shop & Retail Security', desc: '360° Fisheye surveillance to eliminate blind spots and monitor cash counters.', icon: Store, link: '/solutions' },
    { title: 'Solar 4G Remote Sites', desc: 'Wire-free solar powered surveillance for construction, farms, and outdoor perimeters.', icon: Radio, link: '/solutions' },
  ];

  const whyChoose = [
    { title: 'Quality Hardware', desc: '100% pure copper coils in SMPS and premium optical glass lenses.', icon: Award },
    { title: 'Smart Vision Fidelity', desc: 'Ultra-low-light true color night vision with embedded sensitive mics.', icon: Video },
    { title: 'Enterprise Reliability', desc: 'Tested against thermal load, power spikes, and severe outdoor weather.', icon: ShieldCheck },
    { title: 'Dealer First Ecosystem', desc: 'Lucrative margins, promotional combo bonuses, and rapid warranty turnaround.', icon: Users },
    { title: 'Universal Compatibility', desc: 'All cameras natively support TVI, AHD, CVI, and CVBS DVR systems.', icon: Zap },
    { title: '24/7 Dedicated Support', desc: 'Direct access to experienced technical engineers and system design experts.', icon: Clock },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* 1. Hero Slider */}
      <BannerSlider banners={banners} onEnquire={() => onOpenEnquire()} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        {/* 2. Product Categories Grid */}
        <section>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Product Portfolio</span>
              </div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                Explore Product Categories
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Engineered for optical precision, robust power delivery, and seamless transmission.
              </p>
            </div>
            <Link
              to="/products"
              className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <span>View Full Catalogue</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'Bullet Cameras', slug: 'bullet-cameras', count: '3MP / 5MP', img: '/assets/categories/bullet.jpg', icon: Video },
              { name: 'Dome Cameras', slug: 'dome-cameras', count: 'Indoor & Vandal', img: '/assets/categories/dome.jpg', icon: Shield },
              { name: 'Fisheye Panoramic', slug: 'fisheye-cameras', count: '360° Vision', img: '/assets/categories/fisheye.jpg', icon: Cpu },
              { name: 'Solar 4G PTZ', slug: 'solar-ptz-cameras', count: 'Wire-Free', img: '/assets/categories/solar.jpg', icon: Radio },
              { name: 'Power Supplies', slug: 'power-supplies', count: '4 / 8 / 16 Port', img: '/assets/categories/smps.jpg', icon: Zap },
              { name: 'PoE & Network', slug: 'poe-switches', count: 'Switches & CAT6', img: '/assets/categories/poe.jpg', icon: Network },
            ].map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={idx}
                  to={`/products?category=${cat.slug}`}
                  className="group relative bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-4 flex flex-col items-center text-center transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 hover:-translate-y-1"
                >
                  <div className="w-14 h-14 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:border-cyan-500/40 transition-all mb-3 shadow-inner">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-[11px] text-slate-400 mt-1">{cat.count}</span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 3. Featured Products */}
        <section>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Signature Hardware</span>
              </div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                Featured Surveillance Equipment
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Top-rated cameras and networking hardware selected for peak performance.
              </p>
            </div>
            <Link
              to="/products?featured=true"
              className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <span>See All Featured</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <Loader text="Loading featured products..." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(featuredProducts.length > 0 ? featuredProducts : latestProducts.slice(0, 6)).map((prod) => (
                <ProductCard key={prod.id} product={prod} onEnquire={(p) => onOpenEnquire(p)} />
              ))}
            </div>
          )}
        </section>

        {/* 4. Active Offers Banner */}
        {offers.length > 0 && (
          <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-950 via-slate-900 to-slate-950 border border-amber-500/30 p-8 sm:p-12 shadow-2xl">
            <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold uppercase tracking-wider">
                  <Tag className="w-3.5 h-3.5 text-amber-400" />
                  <span>Special Dealer Promotion</span>
                </div>
                <h3 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                  {offers[0].title}
                </h3>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                  {offers[0].description}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
                <Link
                  to={offers[0].cta_link || '/offers'}
                  className="px-6 py-3.5 rounded-xl font-bold text-center text-white bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 shadow-xl shadow-orange-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <span>{offers[0].cta_text || 'Claim Offer'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => onOpenEnquire()}
                  className="px-6 py-3.5 rounded-xl font-bold text-center text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-colors"
                >
                  Request Offer Details
                </button>
              </div>
            </div>
          </section>
        )}

        {/* 5. About GS Vision Short Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>About GS Vision</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Pioneering CCTV Hardware with <span className="gradient-text">Precision & Unshakable Trust</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {settings?.about_full ||
                'GS Vision stands at the forefront of the electronic surveillance industry, delivering state-of-the-art HD security cameras, intelligent PoE networking solutions, and high-performance power units engineered for demanding operational resilience.'}
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <h4 className="text-2xl font-black text-cyan-400">100%</h4>
                <p className="text-xs text-slate-400 mt-1">Tested for High Voltage Spikes & Optical Fidelity</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <h4 className="text-2xl font-black text-blue-400">24/7</h4>
                <p className="text-xs text-slate-400 mt-1">Full Color Night Vision in Zero-Lux Environments</p>
              </div>
            </div>
            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors"
              >
                <span>Read Full Company Story</span>
                <ChevronRight className="w-4 h-4 text-cyan-400" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 p-8 shadow-2xl">
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white border-b border-slate-800 pb-4">
                  Why Security Professionals Choose GS Vision
                </h3>
                <div className="space-y-4">
                  {[
                    'Full HD Color Vision with high-sensitivity audio mics in-built',
                    'Universal DVR Support across TVI, AHD, CVI, and analog signals',
                    'Surge-Protected SMPS power supplies with individual channel fuses',
                    'Long-distance PoE switches with 250M extended transmission mode',
                    'Dedicated dealer support, attractive margins, and warranty assistance'
                  ].map((pt, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-sm text-slate-300 font-medium leading-normal">{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Why Choose GS Vision Grid */}
        <section>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-3">
              <span>The GS Vision Advantage</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Why Partner with GS Vision?
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              We engineer surveillance hardware that installers and business owners can deploy with total confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChoose.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 p-6 rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 7. CCTV Solutions Grid */}
        <section>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Network className="w-3.5 h-3.5" />
                <span>Tailored Architectures</span>
              </div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                CCTV Solutions for Every Environment
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                From residential societies to industrial infrastructure and off-grid remote land.
              </p>
            </div>
            <Link
              to="/solutions"
              className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <span>Explore All Solutions</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {solutions.map((sol, idx) => {
              const Icon = sol.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 text-cyan-400 flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{sol.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{sol.desc}</p>
                  </div>
                  <div className="pt-6 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <button
                      onClick={() => onOpenEnquire()}
                      className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                    >
                      <span>Inquire for Solution</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 8. Latest Products Showcase */}
        <section>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>New Releases</span>
              </div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                Latest Products & Accessories
              </h2>
            </div>
            <Link
              to="/products"
              className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <span>View All ({latestProducts.length}+)</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestProducts.slice(0, 8).map((prod) => (
              <ProductCard key={prod.id} product={prod} onEnquire={(p) => onOpenEnquire(p)} />
            ))}
          </div>
        </section>

        {/* 9. Become a Dealer CTA */}
        <section className="relative rounded-3xl bg-gradient-to-r from-blue-900 via-slate-900 to-[#071322] border border-blue-500/30 p-8 sm:p-12 overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Users className="w-3.5 h-3.5" />
              <span>Authorized Channel Partner Network</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Grow Your Business as an Authorized <span className="gradient-text">GS Vision Dealer</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Join thousands of CCTV installers, system integrators, and security distributors across the region. Enjoy wholesale trade margins, promotional giveaways, direct manufacturer warranty, and marketing collateral.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/dealer"
                className="px-7 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 shadow-xl shadow-orange-500/25 transition-all flex items-center gap-2"
              >
                <span>Apply for Dealership</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/downloads"
                className="px-6 py-3.5 rounded-xl font-semibold text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4 text-cyan-400" />
                <span>Download Brochure</span>
              </Link>
            </div>
          </div>
        </section>

        {/* 10. Testimonials */}
        {testimonials.length > 0 && (
          <section>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
                <span>Client Feedback</span>
              </div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                Trusted by Integrators & Enterprises
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <div key={t.id} className="bg-slate-900/70 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
                  <p className="text-sm text-slate-300 italic leading-relaxed">
                    "{t.comment}"
                  </p>
                  <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-sm">
                      {t.client_name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{t.client_name}</h4>
                      <p className="text-xs text-slate-400">{t.company}</p>
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
