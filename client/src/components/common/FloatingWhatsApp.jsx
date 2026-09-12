import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export default function FloatingWhatsApp() {
  const { settings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const rawPhone = (settings?.whatsapp_number || '919876543210').replace(/[^0-9]/g, '');

  const handleSend = (e) => {
    e.preventDefault();
    const finalMsg = message.trim() || 'Hello GS Vision, I would like to inquire about your CCTV and surveillance products.';
    const url = `https://wa.me/${rawPhone}?text=${encodeURIComponent(finalMsg)}`;
    window.open(url, '_blank');
    setIsOpen(false);
    setMessage('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="mb-3 w-80 sm:w-88 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
                GS
              </div>
              <div>
                <h4 className="text-sm font-bold">GS Vision Sales Desk</h4>
                <p className="text-[11px] text-emerald-100">Direct WhatsApp Inquiry</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 bg-[#0A1120] text-xs text-slate-300 space-y-3">
            <div className="bg-slate-800 p-3 rounded-xl rounded-tl-none border border-slate-700 shadow-sm">
              <p>?? Hello! Welcome to <strong>GS Vision</strong>.</p>
              <p className="mt-1 text-slate-400">How can we assist you with surveillance cameras, PoE switches, or dealership queries today?</p>
            </div>

            <form onSubmit={handleSend} className="space-y-2 pt-2">
              <textarea
                rows="2"
                placeholder="Type your question or model requirement..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-emerald-600/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Chat on WhatsApp</span>
              </button>
            </form>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center shadow-xl shadow-emerald-500/30 hover:scale-110 active:scale-95 transition-all group"
        aria-label="Chat on WhatsApp"
        title="Chat on WhatsApp with GS Vision"
      >
        <MessageCircle className="w-7 h-7 fill-white text-emerald-500 group-hover:scale-105 transition-transform" />
      </button>
    </div>
  );
}
