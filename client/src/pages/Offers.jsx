import React, { useState, useEffect } from 'react';
import { Tag, Calendar, Sparkles, ArrowRight, ShieldCheck, MessageSquare } from 'lucide-react';
import api from '../api/axios';
import PageHeader from '../components/common/PageHeader';
import Loader from '../components/ui/Loader';
import EmptyState from '../components/ui/EmptyState';
import { Link } from 'react-router-dom';

export default function Offers({ onOpenEnquire }) {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOffers() {
      try {
        const res = await api.get('/offers');
        if (res.data.success) {
          setOffers(res.data.offers);
        }
      } catch (err) {
        console.error('Offers error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOffers();
  }, []);

  return (
    <div className="space-y-12 pb-20">
      <PageHeader
        title="Promotions & Special Offers"
        subtitle="Exclusive dealer discounts, bulk combo rewards, and seasonal hardware promotions."
        breadcrumbs={[{ label: 'Offers' }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {loading ? (
          <Loader text="Loading active offers..." />
        ) : offers.length === 0 ? (
          <EmptyState
            title="No Active Offers"
            message="There are currently no active promotional campaigns. Check back soon or contact our sales team for custom wholesale quotes."
            action={
              <button
                onClick={() => onOpenEnquire && onOpenEnquire()}
                className="px-6 py-2.5 bg-cyan-600 text-white rounded-xl text-xs font-bold"
              >
                Inquire for Dealer Pricing
              </button>
            }
          />
        ) : (
          <div className="space-y-8">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className="relative bg-gradient-to-r from-blue-950 via-slate-900 to-slate-950 border border-amber-500/40 rounded-3xl p-8 sm:p-12 overflow-hidden shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8"
              >
                <div className="space-y-4 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold uppercase tracking-wider">
                    <Tag className="w-3.5 h-3.5 text-amber-400" />
                    <span>Special Promotion</span>
                  </div>

                  <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                    {offer.title}
                  </h2>

                  <p className="text-slate-300 text-base leading-relaxed">
                    {offer.description}
                  </p>

                  {offer.end_date && (
                    <div className="flex items-center gap-2 text-xs font-medium text-amber-400 pt-1">
                      <Calendar className="w-4 h-4" />
                      <span>Valid until: {new Date(offer.end_date).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 w-full lg:w-auto">
                  <button
                    onClick={() => onOpenEnquire && onOpenEnquire()}
                    className="px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 shadow-xl shadow-orange-500/25 transition-all flex items-center justify-center gap-2 text-center"
                  >
                    <span>{offer.cta_text || 'Claim Offer Now'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <Link
                    to="/contact"
                    className="px-6 py-3.5 rounded-xl font-semibold text-xs text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors text-center"
                  >
                    Contact Sales Team
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
