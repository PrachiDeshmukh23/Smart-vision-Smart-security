import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileSpreadsheet, Download, Search, MessageSquare, Filter, 
  CheckCircle2, Shield, Phone, Sparkles, ExternalLink, Printer, ArrowUpDown,
  PhoneCall, PackageCheck, Truck, Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import PageHeader from '../components/common/PageHeader';
import Loader from '../components/ui/Loader';
import { useSettings } from '../context/SettingsContext';

export default function PriceList({ onOpenEnquire }) {
  const { settings } = useSettings();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
          api.get('/products?limit=100').catch(() => ({ data: { products: [] } })),
          api.get('/categories').catch(() => ({ data: { categories: [] } }))
        ]);
        if (prodRes.data?.products) {
          setProducts(prodRes.data.products);
        }
        if (catRes.data?.categories) {
          setCategories(catRes.data.categories);
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
        const matchesCat = selectedCategory === 'All' || p.category_name === selectedCategory || p.category_slug === selectedCategory;
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
    const phone = (settings?.whatsapp_number || '919876543210').replace(/[^0-9]/g, '');
    const priceText = item.price ? `₹${item.price.toLocaleString('en-IN')} (Excl. GST)` : 'Trade Inquiry';
    const text = encodeURIComponent(
      `Hello GS Vision, I want to order/inquire wholesale price for:\n\n*Product:* ${item.name}\n*SKU/Model:* ${item.model_number || 'N/A'}\n*Price:* ${priceText}\n*Category:* ${item.category_name || 'Accessories'}\n\nPlease share payment & dispatch details.`
    );
    return `https://wa.me/${phone}?text=${text}`;
  };

  const handlePrint = () => {
    window.print();
  };

  const cleanWhatsApp = (settings?.whatsapp_number || '919876543210').replace(/[^0-9]/g, '');

  return (
    <div className="min-h-screen bg-[#F7F8F8] text-[#151515] pb-20 space-y-8">
      <PageHeader
        title="Live Wholesale Price List"
        subtitle="Transparent wholesale rates for 200+ CCTV accessories, cameras & networking hardware with NO Minimum Order Quantity (No MOQ)."
        breadcrumbs={[{ label: 'Wholesale Price List' }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* CCTV PRO Wholesale Notice Banner */}
        <div className="bg-white border-2 border-[#009B72] rounded-2xl p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#E8F8F3] text-[#009B72] flex items-center justify-center shrink-0 font-bold">
              <PackageCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-[#FF5A2C] text-white text-[10px] font-black px-2 py-0.5 rounded uppercase">
                  TRADE TERMS
                </span>
                <span className="text-xs font-bold text-[#009B72]">Wholesale Rates &bull; No MOQ</span>
              </div>
              <p className="text-xs sm:text-sm text-[#404040] mt-1 leading-relaxed">
                All prices mentioned are <strong>excluding GST</strong>. Immediate dispatch via express courier with token advance COD.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
            <button
              onClick={handlePrint}
              className="flex-1 md:flex-initial px-4 py-2.5 bg-[#F7F8F8] hover:bg-[#E6E6E6] text-[#151515] text-xs font-bold rounded-lg border border-[#E6E6E6] transition-colors flex items-center justify-center gap-1.5"
            >
              <Printer className="w-4 h-4 text-[#666666]" />
              <span>Print / PDF</span>
            </button>
            <a
              href={`https://wa.me/${cleanWhatsApp}?text=Hello%20GS%20Vision,%20please%20send%20me%20your%20latest%20wholesale%20PDF%20price%20list`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 md:flex-initial px-4 py-2.5 bg-[#009B72] hover:bg-[#007A5A] text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5"
            >
              <PhoneCall className="w-4 h-4" />
              <span>WhatsApp PDF</span>
            </a>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white border border-[#E6E6E6] rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C8C8C]" />
            <input
              type="text"
              placeholder="Search product, SKU, model or accessory..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#F7F8F8] border border-[#E6E6E6] text-[#151515] placeholder-[#8C8C8C] text-xs sm:text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#009B72] focus:bg-white transition-all"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                selectedCategory === 'All'
                  ? 'bg-[#009B72] text-white'
                  : 'bg-[#F7F8F8] text-[#404040] hover:bg-[#E6E6E6]'
              }`}
            >
              All Items ({products.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  selectedCategory === cat.name
                    ? 'bg-[#009B72] text-white'
                    : 'bg-[#F7F8F8] text-[#404040] hover:bg-[#E6E6E6]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Price Matrix Table Container */}
        <div className="bg-white border border-[#E6E6E6] rounded-2xl shadow-card overflow-hidden">
          {loading ? (
            <div className="py-20 flex justify-center">
              <Loader text="Loading live price matrix..." />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-16 text-center text-[#666666] text-sm">
              No products found matching "{search}".
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#F7F8F8] text-[#151515] font-extrabold uppercase text-[11px] tracking-wider border-b border-[#E6E6E6]">
                  <tr>
                    <th className="py-3.5 px-4">Item &amp; Image</th>
                    <th className="py-3.5 px-4 cursor-pointer hover:text-[#009B72]" onClick={() => handleSort('model_number')}>
                      <div className="flex items-center gap-1">
                        <span>SKU / Model</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Wholesale Price (Excl. GST)</th>
                    <th className="py-3.5 px-4">Stock &amp; MOQ</th>
                    <th className="py-3.5 px-4 text-right">Direct Order</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F3F5]">
                  {filteredProducts.map((p, idx) => (
                    <tr key={p.id || idx} className="hover:bg-[#F9FBFA] transition-colors">
                      
                      {/* Product Thumbnail & Title */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-[#FAFAFA] border border-[#E6E6E6] p-1 flex items-center justify-center shrink-0">
                            <img
                              src={p.main_image || '/assets/products/placeholder.jpg'}
                              alt=""
                              className="max-h-full max-w-full object-contain"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/assets/products/placeholder.jpg';
                              }}
                            />
                          </div>
                          <div>
                            <Link to={`/products/${p.slug}`} className="font-bold text-[#151515] hover:text-[#009B72] transition-colors line-clamp-1">
                              {p.name}
                            </Link>
                            {p.short_description && (
                              <p className="text-[11px] text-[#8C8C8C] line-clamp-1">{p.short_description}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* SKU / Model */}
                      <td className="py-3.5 px-4 font-mono font-bold text-[#404040]">
                        <span className="bg-[#F1F3F5] px-2 py-0.5 rounded border border-[#E6E6E6] text-xs">
                          {p.model_number || 'GS-ACC-01'}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 text-[#666666]">
                        {p.category_name || 'Accessories'}
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 font-extrabold text-[#009B72]">
                        {p.price ? (
                          <div className="flex flex-col">
                            <span className="text-sm">₹{Number(p.price).toLocaleString('en-IN')}</span>
                            <span className="text-[10px] text-[#8C8C8C] font-normal">+ 18% GST Applicable</span>
                          </div>
                        ) : (
                          <span className="text-xs text-[#FF5A2C] font-bold">Inquire Trade Rate</span>
                        )}
                      </td>

                      {/* MOQ */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#009B72] bg-[#E8F8F3] px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3" /> NO MOQ
                        </span>
                      </td>

                      {/* WhatsApp 1-Click Order */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/products/${p.slug}`}
                            className="p-1.5 rounded-lg text-[#666666] hover:text-[#151515] hover:bg-[#F1F3F5] transition-colors"
                            title="View Specs"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <a
                            href={generateWhatsAppOrderUrl(p)}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 bg-[#009B72] hover:bg-[#007A5A] text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1"
                          >
                            <PhoneCall className="w-3.5 h-3.5" />
                            <span>Order</span>
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
