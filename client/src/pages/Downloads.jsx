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

  const handleDownload = async (id, fileUrl) => {
    try {
      await api.post(`/downloads/${id}/track`);
    } catch (err) {}
    window.open(fileUrl, '_blank');
  };

  return (
    <div className="space-y-12 pb-20">
      <PageHeader
        title="Downloads & Documentation"
        subtitle="Official product catalogs, technical camera datasheets, SMPS wiring diagrams, and user manuals."
        breadcrumbs={[{ label: 'Downloads' }]}
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
          <Loader text="Loading technical documents..." />
        ) : downloads.length === 0 ? (
          <EmptyState
            title="No Documents Available"
            message="There are currently no files uploaded for this category."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {downloads.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                      <FileText className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
                      {item.category}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {item.title}
                  </h3>

                  {item.description && (
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="pt-6 mt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-medium">
                    {item.download_count || 0} Downloads
                  </span>

                  <button
                    onClick={() => handleDownload(item.id, item.pdf_file)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cyan-500/10 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
