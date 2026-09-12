import React from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Lightbox({ isOpen, images = [], currentIndex = 0, onClose, onPrev, onNext }) {
  if (!isOpen || images.length === 0) return null;

  const current = images[currentIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 select-none animate-fadeIn">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all z-10"
      >
        <X className="w-6 h-6" />
      </button>

      {images.length > 1 && (
        <>
          <button
            onClick={onPrev}
            className="absolute left-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={onNext}
            className="absolute right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      <div className="max-w-5xl max-h-[85vh] flex flex-col items-center justify-center">
        <img
          src={current?.image || current?.url || current}
          alt={current?.title || 'Preview'}
          className="max-h-[75vh] max-w-full object-contain rounded-xl shadow-2xl border border-slate-800"
        />
        {current?.title && (
          <div className="mt-4 text-center">
            <h4 className="text-white font-semibold text-base">{current.title}</h4>
            {current.category && (
              <span className="text-xs text-cyan-400 font-medium uppercase tracking-wider">{current.category}</span>
            )}
          </div>
        )}
        <p className="text-xs text-slate-500 mt-2">
          {currentIndex + 1} of {images.length}
        </p>
      </div>
    </div>
  );
}
