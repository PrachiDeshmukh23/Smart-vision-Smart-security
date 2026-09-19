import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, MessageSquare, Sparkles, PhoneCall, CheckCircle } from 'lucide-react';
import Badge from './Badge';
import { useSettings } from '../../context/SettingsContext';

export default function ProductCard({ product, onEnquire }) {
  const { settings } = useSettings();

  const handleWhatsApp = (e) => {
    e.stopPropagation();
    const phone = (settings?.whatsapp_number || '919876543210').replace(/[^0-9]/g, '');
    const msg = `Hello GS Vision, I am interested in the "${product.name}" (Model: ${product.model_number || 'N/A'}). Please share pricing & stock details.`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="group bg-white border border-[#E6E6E6] hover:border-[#009B72] rounded-xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 relative">
      
      {/* Top Badges */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
        <span className="bg-[#FF5A2C] text-white text-[9px] font-black px-2 py-0.5 rounded shadow-sm uppercase tracking-wider">
          NO MOQ
        </span>
        {product.is_new ? (
          <span className="bg-[#009B72] text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" /> NEW
          </span>
        ) : null}
      </div>

      {product.model_number && (
        <div className="absolute top-2.5 right-2.5 z-10">
          <span className="bg-white/95 backdrop-blur-sm text-[10px] font-mono font-bold text-[#404040] px-2 py-0.5 rounded border border-[#E6E6E6] shadow-xs">
            {product.model_number}
          </span>
        </div>
      )}

      {/* Image Showcase */}
      <Link 
        to={`/products/${product.slug}`} 
        className="relative h-48 sm:h-52 bg-[#FAFAFA] overflow-hidden flex items-center justify-center p-5 border-b border-[#F1F3F5] group-hover:bg-white transition-colors"
      >
        <img
          src={product.main_image || '/assets/products/placeholder.jpg'}
          alt={product.name}
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-sm"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-2.5">
          <span className="text-[11px] bg-white/90 text-[#009B72] font-bold px-2.5 py-1 rounded shadow flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" /> View Specs
          </span>
        </div>
      </Link>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {product.category_name && (
            <p className="text-[10px] font-bold text-[#009B72] uppercase tracking-wider mb-1">
              {product.category_name}
            </p>
          )}

          <Link to={`/products/${product.slug}`}>
            <h3 className="text-sm font-bold text-[#151515] group-hover:text-[#009B72] transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Specs Chips */}
          {product.specifications && product.specifications.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-1">
              {product.specifications.slice(0, 2).map((s, idx) => (
                <span
                  key={idx}
                  className="text-[10px] bg-[#F1F3F5] text-[#404040] px-2 py-0.5 rounded border border-[#E6E6E6]"
                >
                  <strong className="text-[#151515]">{s.specification_name}:</strong> {s.specification_value}
                </span>
              ))}
            </div>
          )}

          {product.short_description && (
            <p className="text-[11px] text-[#666666] line-clamp-2 mt-2 leading-relaxed">
              {product.short_description}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-3.5 mt-3 border-t border-[#F1F3F5] flex items-center gap-2">
          <Link
            to={`/products/${product.slug}`}
            className="flex-1 py-1.5 px-2 text-center text-xs font-semibold text-[#404040] hover:text-[#151515] bg-[#F7F8F8] hover:bg-[#F1F3F5] rounded-lg transition-colors border border-[#E6E6E6]"
          >
            Details
          </Link>

          <button
            onClick={() => onEnquire && onEnquire(product)}
            className="flex-1 py-1.5 px-2 text-center text-xs font-bold text-white bg-[#009B72] hover:bg-[#007A5A] rounded-lg transition-all shadow-sm flex items-center justify-center gap-1"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Enquire</span>
          </button>

          <button
            onClick={handleWhatsApp}
            className="p-1.5 rounded-lg bg-[#E8F8F3] hover:bg-[#009B72] text-[#009B72] hover:text-white border border-[#009B72]/30 transition-all"
            title="Order / Enquire on WhatsApp"
          >
            <PhoneCall className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
