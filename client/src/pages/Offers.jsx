import React, { useState, useEffect } from 'react';
import { Tag, Calendar, Sparkles, ArrowRight, ShieldCheck, MessageSquare, PhoneCall } from 'lucide-react';
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
    <div className="bg-[#F7F8F8] space-y-12 pb-20">
      <PageHeader
        title="Promotions &amp; Special Offers"
        subtitle="Exclusive installer discounts, wholesale accessories combo rewards, and seasonal CCTV hardware promotions."
        breadcrumbs={[{ label: 'Offers' }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {loading ? (
          <div className="py-20 flex justify-center"><Loader text="Loading active offers..." /></div>
        ) : offers.length === 0 ? (
          <EmptyState
            title="No Active Offers"
            description="Check back soon for upcoming installer combos and wholesale discount schemes."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className="bg-white border border-[#E6E6E6] rounded-2xl overflow-hidden shadow-card hover:border-[#009B72] hover:shadow-card-hover transition-all flex flex-col justify-between"
              >
                {offer.banner_image && (
                  <div className="h-44 bg-[#FAFAFA] overflow-hidden flex items-center justify-center p-4 border-b border-[#F1F3F5]">
                    <img
                      src={offer.banner_image}
                      alt={offer.title}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                )}

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="bg-[#FF5A2C] text-white text-[10px] font-black px-2 py-0.5 rounded uppercase">
                        LIMITED OFFER
                      </span>
                      {offer.discount_percentage && (
                        <span className="text-xs font-black text-[#009B72]">
                          Save {offer.discount_percentage}%
                        </span>
                      )}
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-[#151515] leading-snug">
                      {offer.title}
                    </h3>

                    {offer.description && (
                      <p className="text-xs sm:text-sm text-[#666666] mt-2 leading-relaxed">
                        {offer.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-[#F1F3F5] flex items-center gap-2">
                    <button
                      onClick={() => onOpenEnquire && onOpenEnquire()}
                      className="w-full py-2 bg-[#009B72] hover:bg-[#007A5A] text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Claim this Offer</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
