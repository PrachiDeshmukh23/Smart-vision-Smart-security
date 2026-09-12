import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, MessageSquare, Sparkles, PhoneCall } from 'lucide-react';
import Badge from './Badge';
import { useSettings } from '../../context/SettingsContext';

export default function ProductCard({ product, onEnquire }) {
  const { settings } = useSettings();

  const handleWhatsApp = (e) => {
    e.stopPropagation();
    const phone = (settings?.whatsapp_number || '919876543210').replace(/[^0-9]/g, '');
    const msg = `Hello GS Vision, I am interested in the "${product.name}" (Model: ${product.model_number}). Please share details and pricing.`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="group bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-1 relative">
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {product.is_new ? (
          <Badge variant="orange" className="font-bold shadow-md">
            <Sparkles className="w-3 h-3" /> New
          </Badge>
        ) : null}
        {product.featured ? (
          <Badge variant="primary" className="font-semibold shadow-md">
            Featured
          </Badge>
        ) : null}
      </div>

      <div className="absolute top-3 right-3 z-10">
        <span className="bg-slate-950/80 backdrop-blur-md text-[11px] font-mono text-cyan-300 px-2.5 py-1 rounded-lg border border-slate-700/60 shadow-sm font-semibold">
          {product.model_number}
        </span>
      </div>

      <Link to={`/products/${product.slug}`} className="relative h-52 bg-slate-950/60 overflow-hidden flex items-center justify-center p-6 border-b border-slate-800/60">
        <img
          src={product.main_image || '/assets/products/placeholder.jpg'}
          alt={product.name}
          className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-lg"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-3">
          <span className="text-xs text-cyan-300 font-semibold flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" /> View Specifications
          </span>
        </div>
      </Link>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {product.category_name && (
            <p className="text-[11px] font-bold text-cyan-400/90 tracking-wider uppercase mb-1">
              {product.category_name}
            </p>
          )}

          <Link to={`/products/${product.slug}`}>
            <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>

          {product.specifications && product.specifications.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {product.specifications.slice(0, 3).map((s, idx) => (
                <span
                  key={idx}
                  className="text-[11px] bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700/50"
                >
                  <strong className="text-slate-400">{s.specification_name}:</strong> {s.specification_value}
                </span>
              ))}
            </div>
          )}

          {product.short_description && (
            <p className="text-xs text-slate-400 line-clamp-2 mt-2.5 leading-relaxed">
              {product.short_description}
            </p>
          )}
        </div>

        <div className="pt-5 mt-4 border-t border-slate-800/80 flex items-center gap-2">
          <Link
            to={`/products/${product.slug}`}
            className="flex-1 py-2 px-3 text-center text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors border border-slate-700"
          >
            Details
          </Link>

          <button
            onClick={() => onEnquire && onEnquire(product)}
            className="flex-1 py-2 px-3 text-center text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 rounded-xl transition-all shadow-md shadow-cyan-500/10 flex items-center justify-center gap-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Enquire</span>
          </button>

          <button
            onClick={handleWhatsApp}
            className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors"
            title="WhatsApp Enquiry"
          >
            <PhoneCall className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
