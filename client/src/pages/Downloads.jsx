import React, { useState, useEffect } from 'react';
import { Download, FileText, CheckCircle2, ShieldCheck, Eye } from 'lucide-react';
import api from '../api/axios';
import PageHeader from '../components/common/PageHeader';
import Loader from '../components/ui/Loader';
import EmptyState from '../components/ui/EmptyState';

export default function Downloads() {
  const [downloads, setDownloads] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const categories = [
    'All',
    'Product Catalog',
    'Technical Datasheet',
    'Installation Guide',
    'Company Profile',
    'User Manual'
  ];

  const loadDownloads = async (category) => {
    setLoading(true);
    try {
      const url = category && category !== 'All' ? `/downloads?category=${encodeURIComponent(category)}` : '/downloads';
      const res = await api.get(url);
      if (res.data.success) {
        setDownloads(res.data.downloads);
      }
    } catch (err) {
      console.error('Downloads error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDownloads(activeCategory);
  }, [activeCategory]);

  return (
    <div className="bg-[#F7F8F8] space-y-12 pb-20">
      <PageHeader
        title="Downloads &amp; Documentation"
        subtitle="Access official GS Vision camera brochures, technical datasheets, installation guides, and software manuals."
        breadcrumbs={[{ label: 'Downloads' }]}
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

        {/* Content */}
        {loading ? (
          <div className="py-20 flex justify-center"><Loader text="Loading documents..." /></div>
        ) : downloads.length === 0 ? (
          <EmptyState
            title="No Documents Found"
            description="There are currently no downloadable files listed under this category."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {downloads.map((doc) => (
              <div
                key={doc.id}
                className="bg-white border border-[#E6E6E6] rounded-xl p-5 shadow-card hover:border-[#009B72] hover:shadow-card-hover transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-[#E8F8F3] text-[#009B72] flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-[#8C8C8C] uppercase tracking-wider bg-[#F7F8F8] px-2 py-0.5 rounded border border-[#E6E6E6]">
                      {doc.category || 'PDF'}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#151515] line-clamp-2">
                    {doc.title}
                  </h3>

                  {doc.description && (
                    <p className="text-xs text-[#666666] mt-1.5 line-clamp-2 leading-relaxed">
                      {doc.description}
                    </p>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-[#F1F3F5] flex items-center justify-between">
                  <span className="text-[11px] text-[#8C8C8C]">
                    {doc.file_size || 'PDF Document'}
                  </span>

                  <a
                    href={doc.file_url || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#009B72] hover:bg-[#007A5A] text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
