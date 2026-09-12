import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Eye, Sparkles } from 'lucide-react';
import api from '../api/axios';
import PageHeader from '../components/common/PageHeader';
import Lightbox from '../components/common/Lightbox';
import Loader from '../components/ui/Loader';
import EmptyState from '../components/ui/EmptyState';

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const categories = ['All', 'Products', 'Installations', 'Events', 'Posters'];

  const defaultGallery = [
    { id: 1, title: 'GS Vision 3MP HD Bullet Camera Lineup', category: 'Products', image: '/assets/products/bullet-1.jpg' },
    { id: 2, title: '360 Fisheye Panoramic Camera Angle', category: 'Products', image: '/assets/products/bullet-fisheye.jpg' },
    { id: 3, title: 'Smart 8+2 PoE Switch Server Rack Install', category: 'Installations', image: '/assets/products/poe-8.jpg' },
    { id: 4, title: 'Solar Powered 4G Farm Remote Camera', category: 'Installations', image: '/assets/categories/solar.jpg' },
    { id: 5, title: 'Outdoor Weatherproof CAT6 305M Roll', category: 'Products', image: '/assets/products/cat6.jpg' },
    { id: 6, title: 'GS Vision Security Expo 2026', category: 'Events', image: '/assets/banners/hero-1.jpg' }
  ];

  useEffect(() => {
    async function loadGallery() {
      setLoading(true);
      try {
        const url = activeCategory && activeCategory !== 'All' ? `/gallery?category=${encodeURIComponent(activeCategory)}` : '/gallery';
        const res = await api.get(url);
        if (res.data.success && res.data.gallery && res.data.gallery.length > 0) {
          setItems(res.data.gallery);
        } else {
          // Fallback to initial display items filtered by category
          setItems(activeCategory === 'All' ? defaultGallery : defaultGallery.filter(g => g.category === activeCategory));
        }
      } catch (err) {
        setItems(activeCategory === 'All' ? defaultGallery : defaultGallery.filter(g => g.category === activeCategory));
      } finally {
        setLoading(false);
      }
    }
    loadGallery();
  }, [activeCategory]);

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="space-y-12 pb-20">
      <PageHeader
        title="Photo & Installation Gallery"
        subtitle="Explore GS Vision equipment, client surveillance installations, and event highlights."
        breadcrumbs={[{ label: 'Gallery' }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <Loader text="Loading gallery photos..." />
        ) : items.length === 0 ? (
          <EmptyState
            title="No Images in Category"
            message="No photos have been uploaded for this category yet."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {items.map((item, idx) => (
              <div
                key={item.id || idx}
                onClick={() => openLightbox(idx)}
                className="group relative bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl overflow-hidden aspect-[4/3] cursor-pointer shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-1"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider mb-1">
                    {item.category}
                  </span>
                  <h4 className="text-sm font-bold text-white leading-snug">
                    {item.title}
                  </h4>
                  <div className="mt-2 flex items-center gap-1 text-xs text-cyan-300 font-semibold">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Click to Expand</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <Lightbox
        isOpen={lightboxOpen}
        images={items}
        currentIndex={currentIndex}
        onClose={() => setLightboxOpen(false)}
        onPrev={() => setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1))}
        onNext={() => setCurrentIndex((prev) => (prev + 1) % items.length)}
      />
    </div>
  );
}
