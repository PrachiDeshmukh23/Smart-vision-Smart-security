import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileSpreadsheet, Download, Search, MessageSquare, Filter, 
  CheckCircle2, Shield, Phone, Sparkles, ExternalLink, Printer, ArrowUpDown
} from 'lucide-react';
import api from '../api/axios';
import PageHeader from '../components/common/PageHeader';
import Loader from '../components/ui/Loader';
import Badge from '../components/ui/Badge';
import { useSettings } from '../context/SettingsContext';

export default function PriceList({ onOpenEnquiry }) {
  const { settings } = useSettings();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortField, setSortField] = useState('category');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
          api.get('/products?limit=100'),
          api.get('/categories')
        ]);
        if (prodRes.data?.products) {
          setProducts(prodRes.data.products);
        }
        if (catRes.data?.data) {
          setCategories(catRes.data.data);
        }
      } catch (err) {
        console.error('Failed to load price list data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCat = selectedCategory === 'All' || p.category_name === selectedCategory || String(p.category_id) === selectedCategory;
        const matchesSearch = 
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          (p.model_number && p.model_number.toLowerCase().includes(search.toLowerCase())) ||
          (p.category_name && p.category_name.toLowerCase().includes(search.toLowerCase()));
        return matchesCat && matchesSearch;
      })
      .sort((a, b) => {
        let valA = a[sortField] || '';
        let valB = b[sortField] || '';
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();
        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [products, selectedCategory, search, sortField, sortOrder]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const generateWhatsAppOrderUrl = (item) => {
    const phone = settings?.whatsapp_number || '919876543210';
    const text = encodeURIComponent(
      `Hello GS Vision, I want to order/inquire wholesale price for:\n\n*Product:* ${item.name}\n*SKU/Model:* ${item.model_number || 'N/A'}\n*Price:* ?${item.price?.toLocaleString('en-IN') || 'TBD'} (Excl. GST)\n*Category:* ${item.category_name || 'Accessories'}\n\nPlease share dispatch details & payment info.`
    );
    return `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${text}`;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      <PageHeader
        title="Live Wholesale Price List"
        subtitle="Transparent pricing for 200+ CCTV accessories & cameras with NO Minimum Order Quantity (No MOQ). Direct dispatch across India."
      />

      {/* Notice Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-gradient-to-r from-amber-500/15 via-slate-900 to-cyan-500/15 border border-amber-500/30 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl backdrop-blur-md">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 font-bold">
              ?
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-white font-bold text-sm">Wholesale Pricing Policy:</span>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">All Prices Excl. GST</span>
                <span className="bg-cyan-400 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">NO MOQ REQUIRED</span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                COD is available with a token advance to confirm your order. Orders are processed with personal courier coordination via WhatsApp/Call.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
            <button
              onClick={handlePrint}
              className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold border border-slate-700 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <a
              href={`https://wa.me/${(settings?.whatsapp_number || '919876543210').replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello GS Vision, please send me the latest full PDF/Excel Wholesale Price List.')}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-500/20 transition"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Request Full PDF on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        {/* Filter & Search Toolbar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by product name, SKU or model..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-thin">
            <span className="text-xs text-slate-400 font-semibold whitespace-nowrap hidden sm:inline">Category:</span>
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === 'All'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              All Items ({products.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory === cat.name
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Price Table */}
        {loading ? (
          <Loader text="Loading live price list..." />
        ) : filteredProducts.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
            <FileSpreadsheet className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">No products match your search</h3>
            <p className="text-xs text-slate-400">Try adjusting your keyword filter or select another category.</p>
            <button
              onClick={() => { setSearch(''); setSelectedCategory('All'); }}
              className="px-4 py-2 bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="py-4 px-4 font-semibold">Image</th>
                    <th 
                      onClick={() => handleSort('name')}
                      className="py-4 px-4 font-semibold cursor-pointer hover:text-cyan-400 select-none"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Product & Description</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('model_number')}
                      className="py-4 px-4 font-semibold cursor-pointer hover:text-cyan-400 select-none"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>SKU / Model</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('category_name')}
                      className="py-4 px-4 font-semibold cursor-pointer hover:text-cyan-400 select-none"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Category</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('price')}
                      className="py-4 px-4 font-semibold cursor-pointer hover:text-cyan-400 select-none text-right"
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        <span>Wholesale Price</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th className="py-4 px-4 font-semibold text-center">MOQ</th>
                    <th className="py-4 px-4 font-semibold text-right">Quick Order</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {filteredProducts.map((p, idx) => (
                    <tr key={p.id || idx} className="hover:bg-slate-800/40 transition group">
                      <td className="py-3 px-4">
                        <div className="w-12 h-12 rounded-lg bg-slate-950 border border-slate-800 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                          <img
                            src={p.main_image || '/assets/products/placeholder.jpg'}
                            alt={p.name}
                            className="max-w-full max-h-full object-contain group-hover:scale-110 transition duration-300"
                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=150&q=80'; }}
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4 max-w-xs">
                        <a href={`/products/${p.slug}`} className="font-bold text-white hover:text-cyan-400 transition line-clamp-1">
                          {p.name}
                        </a>
                        {p.short_description && (
                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{p.short_description}</p>
                        )}
                        {p.featured ? (
                          <span className="inline-block mt-1 bg-cyan-500/15 text-cyan-400 text-[10px] font-bold px-1.5 py-0.2 rounded border border-cyan-500/20">
                            ? Featured
                          </span>
                        ) : null}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-cyan-300 whitespace-nowrap">
                        {p.model_number || 'GS-ACC-01'}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="bg-slate-800 text-slate-300 text-[11px] font-semibold px-2 py-0.5 rounded-md">
                          {p.category_name || 'Accessories'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="text-sm font-black text-amber-400 font-mono">
                          ?{p.price ? p.price.toLocaleString('en-IN') : 'Call'}
                        </div>
                        <span className="text-[10px] text-slate-500 block">+ GST</span>
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          1 Pc (No MOQ)
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={generateWhatsAppOrderUrl(p)}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold shadow transition"
                            title="Order directly on WhatsApp"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Order</span>
                          </a>
                          <button
                            onClick={() => onOpenEnquiry(p)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-semibold border border-slate-700 transition"
                            title="Request Quotation"
                          >
                            Quote
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer Summary */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
              <div>
                Showing <strong className="text-white">{filteredProducts.length}</strong> items in price catalog
              </div>
              <div className="flex items-center gap-3">
                <span className="text-emerald-400 font-semibold">? In Stock for Immediate Dispatch</span>
                <span>•</span>
                <span className="text-amber-400 font-semibold">All Prices Excl. GST</span>
              </div>
            </div>
          </div>
        )}

        {/* VisionX / Gujarat Direct Sourcing Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2">
            <span className="text-cyan-400 text-xs font-bold uppercase tracking-wider">Wholesale & Bulk Supply</span>
            <h3 className="text-xl sm:text-2xl font-black text-white">Need 200+ CCTV Accessories in Bulk?</h3>
            <p className="text-xs text-slate-300 max-w-2xl">
              We supply installers, dealers, security companies, and system integrators with direct wholesale pricing from Gujarat. No MOQ required, pan-India courier delivery, and technical assistance.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="tel:+919876543210"
              className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs border border-slate-700 transition flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-cyan-400" />
              <span>Call Sales Team</span>
            </a>
            <a
              href="/dealer"
              className="px-5 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-cyan-500/20 transition"
            >
              Apply as Dealer
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
