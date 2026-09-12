import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShieldCheck, Check, MessageSquare, PhoneCall, Download,
  Share2, ArrowLeft, Layers, Info, Award, HelpCircle
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

  if (loading) return <div className="py-20"><Loader text="Loading product specifications..." /></div>;
  if (error || !product) {
    return (
      <div className="py-20 max-w-4xl mx-auto px-4">
        <EmptyState
          title="Product Not Found"
          message="The requested surveillance model could not be found or is no longer listed in the active catalogue."
          action={
            <Link to="/products" className="px-6 py-2.5 bg-cyan-600 text-white rounded-xl text-xs font-bold">
              Return to Products Catalogue
            </Link>
          }
        />
      </div>
    );
  }

  const handleWhatsApp = () => {
    const phone = (settings?.whatsapp_number || '919876543210').replace(/[^0-9]/g, '');
    const msg = `Hello GS Vision,\nI am interested in the ${product.name} (Model: ${product.model_number}).\nPlease share full technical specifications and dealer quote.`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const galleryList = [
    { id: 'main', image: product.main_image },
    ...(product.images || [])
  ].filter((item, idx, self) => item.image && self.findIndex(t => t.image === item.image) === idx);

  return (
    <div className="space-y-16 pb-20">
      <PageHeader
        title={product.name}
        subtitle={`Model Number: ${product.model_number}`}
        breadcrumbs={[
          { label: 'Products', path: '/products' },
          { label: product.category_name || 'Catalogue', path: `/products?category=${product.category_slug || ''}` },
          { label: product.model_number }
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Main Product Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: Gallery & Image Previews */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex items-center justify-center min-h-[380px] sm:min-h-[440px] shadow-2xl relative overflow-hidden">
              <img
                src={selectedImage || product.main_image || '/assets/products/placeholder.jpg'}
                alt={product.name}
                className="max-h-[360px] max-w-full object-contain drop-shadow-2xl transition-all duration-300"
              />
            </div>

            {/* Thumbnail Row */}
            {galleryList.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {galleryList.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(item.image)}
                    className={`w-20 h-20 rounded-2xl bg-slate-900 border p-2 flex items-center justify-center shrink-0 transition-all ${
                      selectedImage === item.image
                        ? 'border-cyan-400 ring-2 ring-cyan-500/20 shadow-lg'
                        : 'border-slate-800 hover:border-slate-700 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={item.image} alt="Thumb" className="max-h-full max-w-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Specs & Actions */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {product.category_name && (
                  <Badge variant="primary" className="font-bold uppercase tracking-wider">
                    {product.category_name}
                  </Badge>
                )}
                <span className="text-xs font-mono bg-slate-800 text-cyan-300 px-2.5 py-0.5 rounded-md border border-slate-700 font-semibold">
                  {product.model_number}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
                {product.name}
              </h1>

              {product.short_description && (
                <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
                  {product.short_description}
                </p>
              )}
            </div>

            {/* Key Features Callout */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Key Hardware Highlights</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  'Full HD Colour Night Vision',
                  'In-Built Sensitive Microphone',
                  'Universal All-DVR Supported',
                  'Weatherproof High-Durability Housing'
                ].map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-medium text-slate-200">
                    <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="pt-2 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => onOpenEnquire && onOpenEnquire(product)}
                  className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 transition-all shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Enquire / Request Quote</span>
                </button>

                <button
                  onClick={handleWhatsApp}
                  className="w-full py-3.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>WhatsApp Inquiry</span>
                </button>
              </div>

              {product.brochure && (
                <a
                  href={product.brochure}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 rounded-xl font-semibold text-xs text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center gap-2 transition-colors"
                >
                  <Download className="w-4 h-4 text-cyan-400" />
                  <span>Download Product Datasheet / PDF Brochure</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Technical Specification Table */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              <span>Technical Specifications</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Detailed optical, electronic, and mechanical characteristics for {product.model_number}.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-950/40">
                  <th className="py-3 px-4 w-1/3">Specification Field</th>
                  <th className="py-3 px-4">Value / Parameter</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                <tr className="hover:bg-slate-800/30">
                  <td className="py-3 px-4 font-semibold text-slate-300">Model Number</td>
                  <td className="py-3 px-4 font-mono text-cyan-300 font-bold">{product.model_number}</td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-3 px-4 font-semibold text-slate-300">Category</td>
                  <td className="py-3 px-4 text-slate-200">{product.category_name || 'CCTV & Surveillance'}</td>
                </tr>
                {product.specifications && product.specifications.map((spec, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30">
                    <td className="py-3 px-4 font-semibold text-slate-300">{spec.specification_name}</td>
                    <td className="py-3 px-4 text-slate-200">{spec.specification_value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Full Long Description */}
        {product.description && (
          <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Info className="w-5 h-5 text-cyan-400" />
              <span>Product Overview & Details</span>
            </h3>
            <div className="text-sm sm:text-base text-slate-300 leading-relaxed whitespace-pre-line">
              {product.description}
            </div>
          </section>
        )}

        {/* Related Products */}
        {product.related_products && product.related_products.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-white">Related Products</h3>
              <Link to="/products" className="text-xs font-bold text-cyan-400 hover:text-cyan-300">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {product.related_products.map((rel) => (
                <ProductCard key={rel.id} product={rel} onEnquire={(p) => onOpenEnquire(p)} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
