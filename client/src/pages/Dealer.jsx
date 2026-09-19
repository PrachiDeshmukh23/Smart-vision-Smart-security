import React, { useState } from 'react';
import {
  Users, CheckCircle2, Award, TrendingUp, ShieldCheck,
  Send, Sparkles, PhoneCall, Loader2, PackageCheck, Truck
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

  const dealerBenefits = [
    { title: 'Wholesale Trade Margins', desc: 'Direct wholesale rates on 200+ accessories with NO Minimum Order Quantity (No MOQ).', icon: TrendingUp },
    { title: 'Pan-India Express Dispatch', desc: 'Fast courier dispatch with tracking and token advance COD options.', icon: Truck },
    { title: 'Direct Manufacturer Warranty', desc: 'Hassle-free replacement and repair turnaround for your clients.', icon: ShieldCheck },
    { title: 'Marketing & Technical Support', desc: 'Datasheets, dealer brochures, demo units, and engineering advice.', icon: Award },
  ];

  return (
    <div className="bg-[#F7F8F8] space-y-12 pb-20">
      <PageHeader
        title="Become an Authorized GS Vision Dealer"
        subtitle="Join our nationwide network of CCTV installers, system integrators, and security distributors."
        breadcrumbs={[{ label: 'Dealer Application' }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {dealerBenefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div key={idx} className="bg-white border border-[#E6E6E6] rounded-xl p-5 shadow-sm hover:border-[#009B72] transition-colors">
                <div className="w-10 h-10 rounded-lg bg-[#E8F8F3] text-[#009B72] flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-[#151515] mb-1">{b.title}</h3>
                <p className="text-xs text-[#666666] leading-relaxed">{b.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Application Form */}
        <div className="bg-white border border-[#E6E6E6] rounded-2xl p-6 sm:p-10 shadow-card max-w-4xl mx-auto">
          {success ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-[#E8F8F3] text-[#009B72] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-[#151515]">Application Submitted Successfully!</h3>
              <p className="text-xs sm:text-sm text-[#666666] max-w-md mx-auto">
                Thank you for applying to become a <strong>GS Vision</strong> authorized dealer. Our channel manager will contact you with wholesale catalogues and pricing tiers.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="px-6 py-2.5 bg-[#009B72] text-white rounded-lg text-xs font-bold shadow-md"
              >
                Submit Another Application
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#151515] tracking-tight">
                  Dealer Registration Form
                </h2>
                <p className="text-xs text-[#666666] mt-1">
                  Please provide your business information to unlock wholesale dealer margins and technical support.
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#404040] mb-1">Contact Person Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#F7F8F8] border border-[#E6E6E6] rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-[#151515] focus:outline-none focus:border-[#009B72] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#404040] mb-1">Business / Firm Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vision Tech Security"
                    value={formData.business_name}
                    onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                    className="w-full bg-[#F7F8F8] border border-[#E6E6E6] rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-[#151515] focus:outline-none focus:border-[#009B72] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#404040] mb-1">Mobile / WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="w-full bg-[#F7F8F8] border border-[#E6E6E6] rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-[#151515] focus:outline-none focus:border-[#009B72] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#404040] mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. contact@visiontech.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#F7F8F8] border border-[#E6E6E6] rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-[#151515] focus:outline-none focus:border-[#009B72] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#404040] mb-1">City *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Surat"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-[#F7F8F8] border border-[#E6E6E6] rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-[#151515] focus:outline-none focus:border-[#009B72] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#404040] mb-1">State *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Gujarat"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full bg-[#F7F8F8] border border-[#E6E6E6] rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-[#151515] focus:outline-none focus:border-[#009B72] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#404040] mb-1">GST Number (Optional)</label>
                  <input
                    type="text"
                    placeholder="24AAAAA0000A1Z5"
                    value={formData.gst_number}
                    onChange={(e) => setFormData({ ...formData, gst_number: e.target.value })}
                    className="w-full bg-[#F7F8F8] border border-[#E6E6E6] rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-[#151515] focus:outline-none focus:border-[#009B72] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#404040] mb-1">Interested Product Categories</label>
                <input
                  type="text"
                  placeholder="e.g. SMPS Power Supplies, BNC Connectors, Racks, Solar Cameras..."
                  value={formData.interested_products}
                  onChange={(e) => setFormData({ ...formData, interested_products: e.target.value })}
                  className="w-full bg-[#F7F8F8] border border-[#E6E6E6] rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-[#151515] focus:outline-none focus:border-[#009B72] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#404040] mb-1">Additional Notes</label>
                <textarea
                  rows="3"
                  placeholder="Tell us about your monthly volume, region of operation..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-[#F7F8F8] border border-[#E6E6E6] rounded-lg p-3 text-xs sm:text-sm text-[#151515] focus:outline-none focus:border-[#009B72] focus:bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#009B72] hover:bg-[#007A5A] transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>Submit Dealer Application</span>
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
