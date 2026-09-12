import React, { useState } from 'react';
import {
  Users, CheckCircle2, Award, TrendingUp, ShieldCheck,
  Send, Sparkles, PhoneCall, Loader2
} from 'lucide-react';
import api from '../api/axios';
import PageHeader from '../components/common/PageHeader';
import confetti from 'canvas-confetti';

export default function Dealer() {
  const [formData, setFormData] = useState({
    name: '',
    business_name: '',
    mobile: '',
    email: '',
    gst_number: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    current_business: '',
    interested_products: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.business_name || !formData.mobile || !formData.city || !formData.state) {
      setError('Please fill in all mandatory fields marked with an asterisk (*).');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.post('/dealers', formData);
      if (res.data.success) {
        setSuccess(true);
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-16 pb-20">
      <PageHeader
        title="Become a GS Vision Dealer"
        subtitle="Partner with a leading manufacturer of CCTV cameras, power supplies, and networking hardware."
        breadcrumbs={[{ label: 'Dealers' }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Dealership Benefits Grid */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Users className="w-3.5 h-3.5" />
              <span>Channel Partnership Advantages</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Why Become a GS Vision Authorized Dealer?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Direct Wholesale Margins',
                desc: 'Unmatched trade pricing structures that maximize your installation and retail margins.',
                icon: TrendingUp
              },
              {
                title: 'Zero-Delay Warranty & RMA',
                desc: 'Hassle-free replacement guarantee on power supplies, cameras, and switches.',
                icon: ShieldCheck
              },
              {
                title: 'Marketing & Promotional Gifts',
                desc: 'Qualify for promotional combo schemes (e.g. Free Bicycles on 50 Combo sets) and display boards.',
                icon: Award
              },
              {
                title: 'Dedicated Account Manager',
                desc: 'Priority order fulfillment, system design consultation, and technical engineer access.',
                icon: Users
              }
            ].map((b, idx) => {
              const Icon = b.icon;
              return (
                <div key={idx} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{b.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{b.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Application Form Section */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="max-w-3xl mx-auto">
            {success ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-white">Application Received!</h3>
                <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
                  Thank you for applying for the <strong>GS Vision</strong> dealership. Our Channel Partner Director will review your details and contact you within 24 business hours.
                </p>
                <button
                  onClick={() => {
                    setSuccess(false);
                    setFormData({
                      name: '', business_name: '', mobile: '', email: '', gst_number: '',
                      address: '', city: '', state: '', pincode: '', current_business: '',
                      interested_products: '', message: ''
                    });
                  }}
                  className="mt-4 px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Submit Another Application
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="border-b border-slate-800 pb-4 text-center">
                  <h3 className="text-2xl font-bold text-white">Dealership Application Form</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Fill in your business details below. Fields marked with an asterisk (*) are required.
                  </p>
                </div>

                {error && (
                  <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Person Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Kumar"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Business / Firm Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Modern Security Solutions"
                        value={formData.business_name}
                        onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 9876543210"
                        value={formData.mobile}
                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                      <input
                        type="email"
                        placeholder="e.g. ramesh@modernsec.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">GST Number (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. 07AAAAA0000A1Z5"
                        value={formData.gst_number}
                        onChange={(e) => setFormData({ ...formData, gst_number: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Shop / Office Address</label>
                    <input
                      type="text"
                      placeholder="e.g. Shop 12, Electronic Market, Main Road"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">City *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Jaipur"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">State *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rajasthan"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Pincode</label>
                      <input
                        type="text"
                        placeholder="e.g. 302001"
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Current Business Line</label>
                      <input
                        type="text"
                        placeholder="e.g. CCTV Installer, IT Networking, Electrical"
                        value={formData.current_business}
                        onChange={(e) => setFormData({ ...formData, current_business: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Interested Products</label>
                      <input
                        type="text"
                        placeholder="e.g. HD Bullet/Dome, SMPS, PoE, Solar 4G"
                        value={formData.interested_products}
                        onChange={(e) => setFormData({ ...formData, interested_products: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Any Message / Remarks</label>
                    <textarea
                      rows="3"
                      placeholder="Share additional details regarding monthly expected volume or requirements..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 shadow-xl shadow-orange-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    <span>Submit Dealership Application</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
