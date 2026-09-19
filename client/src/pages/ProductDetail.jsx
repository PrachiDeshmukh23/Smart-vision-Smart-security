import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShieldCheck, Check, MessageSquare, PhoneCall, Download,
  Share2, ArrowLeft, Layers, Info, Award, HelpCircle, Sparkles, Truck, PackageCheck
} from 'lucide-react';
import api from '../api/axios';
import PageHeader from '../components/common/PageHeader';
import ProductCard from '../components/ui/ProductCard';
import Badge from '../components/ui/Badge';
import Loader from '../components/ui/Loader';
import EmptyState from '../components/ui/EmptyState';
import { useSettings } from '../context/SettingsContext';

export default function ProductDetail({ onOpenEnquire }) {
  const { slug } = useParams();
  const { settings } = useSettings();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      setError(false);
      try {
        const res = await api.get(`/products/slug/${slug}`);
        if (res.data.success && res.data.product) {
          setProduct(res.data.product);
          setSelectedImage(res.data.product.main_image);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (loading) return <div className="py-20 bg-[#F7F8F8] min-h-screen flex justify-center"><Loader text="Loading product specifications..." /></div>;
  if (error || !product) {
    return (
      <div className="py-20 max-w-4xl mx-auto px-4">
        <EmptyState
          title="Product Not Found"
          message="The requested CCTV model or accessory could not be found."
          action={
            <Link to="/products" className="px-6 py-2.5 bg-[#009B72] text-white rounded-lg text-xs font-bold">
              Return to Catalogue
            </Link>
          }
        />
      </div>
    );
  }

  const handleWhatsApp = () => {
    const phone = (settings?.whatsapp_number || '919876543210').replace(/[^0-9]/g, '');
    const msg = `Hello GS Vision,\nI am interested in "${product.name}" (Model: ${product.model_number || 'N/A'}).\nPlease share wholesale pricing and courier availability.`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const galleryList = [
    { id: 'main', image: product.main_image },
    ...(product.images || [])
  ].filter((item, idx, self) => item.image && self.findIndex(t => t.image === item.image) === idx);

  return (
    <div className="bg-[#F7F8F8] space-y-12 pb-20">
      <PageHeader
        title={product.name}
        subtitle={`Model Number: ${product.model_number || 'N/A'}`}
        breadcrumbs={[
          { label: 'Products', path: '/products' },
          { label: product.category_name || 'Catalogue', path: `/products?category=${product.category_slug || ''}` },
          { label: product.model_number || product.name }
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Showcase Section */}
        <div className="bg-white border border-[#E6E6E6] rounded-2xl p-6 sm:p-8 shadow-card">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left: Product Images */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-[#FAFAFA] border border-[#E6E6E6] rounded-xl p-8 flex items-center justify-center min-h-[340px] sm:min-h-[400px] relative">
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  <span className="bg-[#FF5A2C] text-white text-[10px] font-black px-2.5 py-0.5 rounded shadow-xs uppercase tracking-wider">
                    NO MOQ NEEDED
                  </span>
                  {product.is_new && (
                    <span className="bg-[#009B72] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> NEW
                    </span>
                  )}
                </div>

                <img
                  src={selectedImage || product.main_image || '/assets/products/placeholder.jpg'}
                  alt={product.name}
                  className="max-h-[320px] max-w-full object-contain drop-shadow-md transition-all duration-300"
                />
              </div>

              {/* Thumbnails */}
              {galleryList.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {galleryList.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(item.image)}
                      className={`w-16 h-16 rounded-lg p-2 bg-[#FAFAFA] border-2 transition-all shrink-0 flex items-center justify-center ${
                        selectedImage === item.image ? 'border-[#009B72] bg-white shadow-xs' : 'border-[#E6E6E6] hover:border-gray-400'
                      }`}
                    >
                      <img src={item.image} alt="" className="max-h-full max-w-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Info & Actions */}
            <div className="lg:col-span-6 space-y-5">
              <div>
                {product.category_name && (
                  <p className="text-xs font-black text-[#009B72] uppercase tracking-wider mb-1">
                    {product.category_name}
                  </p>
                )}
                <h1 className="text-2xl sm:text-3xl font-black text-[#151515] leading-snug">
                  {product.name}
                </h1>
                <div className="mt-2 flex items-center gap-3">
                  <span className="text-xs font-mono font-bold bg-[#F1F3F5] text-[#404040] px-2.5 py-1 rounded border border-[#E6E6E6]">
                    SKU: {product.model_number || 'N/A'}
                  </span>
                  <span className="text-xs text-[#009B72] font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> In Stock &amp; Ready to Ship
                  </span>
                </div>
              </div>

              {product.short_description && (
                <p className="text-sm text-[#666666] leading-relaxed">
                  {product.short_description}
                </p>
              )}

              {/* CCTV PRO Value Badges */}
              <div className="grid grid-cols-2 gap-3 py-3 border-y border-[#F1F3F5]">
                <div className="flex items-center gap-2 text-xs text-[#151515]">
                  <PackageCheck className="w-4 h-4 text-[#009B72] shrink-0" />
                  <span><strong>No MOQ:</strong> Order 1 or 100+</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#151515]">
                  <Truck className="w-4 h-4 text-[#009B72] shrink-0" />
                  <span><strong>Courier:</strong> Pan-India Dispatch</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#151515]">
                  <ShieldCheck className="w-4 h-4 text-[#009B72] shrink-0" />
                  <span><strong>Warranty:</strong> Manufacturer Covered</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#151515]">
                  <Award className="w-4 h-4 text-[#009B72] shrink-0" />
                  <span><strong>Quality:</strong> 100% Tested Hardware</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => onOpenEnquire && onOpenEnquire(product)}
                  className="flex-1 py-3 px-5 text-center text-xs sm:text-sm font-bold text-white bg-[#009B72] hover:bg-[#007A5A] rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Request Official Quotation</span>
                </button>

                <button
                  onClick={handleWhatsApp}
                  className="py-3 px-5 text-center text-xs sm:text-sm font-bold text-[#009B72] bg-[#E8F8F3] hover:bg-[#009B72] hover:text-white border border-[#009B72]/30 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Order on WhatsApp</span>
                </button>
              </div>

              {product.datasheet_url && (
                <div className="pt-2">
                  <a
                    href={product.datasheet_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#009B72] hover:underline"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Technical Datasheet (PDF)</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Technical Specifications Section */}
        {product.specifications && product.specifications.length > 0 && (
          <div className="bg-white border border-[#E6E6E6] rounded-2xl p-6 sm:p-8 shadow-card space-y-6">
            <h2 className="text-xl font-black text-[#151515] tracking-tight pb-3 border-b border-[#F1F3F5] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#009B72]" />
              <span>Technical Specifications</span>
            </h2>

            <div className="overflow-hidden border border-[#E6E6E6] rounded-xl">
              <table className="w-full text-left text-xs sm:text-sm">
                <tbody>
                  {product.specifications.map((s, idx) => (
                    <tr
                      key={idx}
                      className={idx % 2 === 0 ? 'bg-[#F7F8F8]' : 'bg-white'}
                    >
                      <td className="py-3 px-4 font-bold text-[#151515] w-1/3 border-r border-[#E6E6E6]">
                        {s.specification_name}
                      </td>
                      <td className="py-3 px-4 text-[#404040]">
                        {s.specification_value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Full Description & Features */}
        {product.description && (
          <div className="bg-white border border-[#E6E6E6] rounded-2xl p-6 sm:p-8 shadow-card space-y-4">
            <h2 className="text-xl font-black text-[#151515] tracking-tight pb-3 border-b border-[#F1F3F5] flex items-center gap-2">
              <Info className="w-5 h-5 text-[#009B72]" />
              <span>Product Overview</span>
            </h2>
            <div className="text-xs sm:text-sm text-[#404040] leading-relaxed whitespace-pre-line">
              {product.description}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
