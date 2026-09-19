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
    { id: 2, title: '360° Fisheye Panoramic Camera Angle', category: 'Products', image: '/assets/products/bullet-fisheye.jpg' },
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
    <div className="bg-[#F7F8F8] space-y-12 pb-20">
      <PageHeader
        title="Hardware &amp; Installation Gallery"
        subtitle="Explore project deployments, camera field views, and product showcases across India."
        breadcrumbs={[{ label: 'Gallery' }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#E6E6E6]">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-[#009B72] text-white shadow-sm'
                  : 'bg-white text-[#404040] hover:bg-[#E6E6E6] border border-[#E6E6E6]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="py-20 flex justify-center"><Loader text="Loading gallery photos..." /></div>
        ) : items.length === 0 ? (
          <EmptyState
            title="No Photos Found"
            description="There are currently no photos in this gallery section."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {items.map((item, idx) => (
              <div
                key={item.id || idx}
                onClick={() => openLightbox(idx)}
                className="group relative bg-white border border-[#E6E6E6] rounded-2xl overflow-hidden shadow-card hover:border-[#009B72] hover:shadow-card-hover transition-all cursor-pointer aspect-4/3 flex items-center justify-center p-4"
              >
                <img
                  src={item.image_url || item.image || '/assets/products/placeholder.jpg'}
                  alt={item.title}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/assets/products/placeholder.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#4EEDB8]">
                    {item.category}
                  </span>
                  <h4 className="text-sm font-bold text-white line-clamp-1">{item.title}</h4>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {lightboxOpen && items.length > 0 && (
        <Lightbox
          images={items.map((i) => i.image_url || i.image)}
          currentIndex={currentIndex}
          onClose={() => setLightboxOpen(false)}
          onNavigate={(newIdx) => setCurrentIndex(newIdx)}
        />
      )}
    </div>
  );
}
