import React, { useState } from 'react';
import {
  MapPin, Phone, Mail, Clock, Send, CheckCircle2,
  MessageCircle, MessageSquare, ShieldCheck, Loader2, PhoneCall
} from 'lucide-react';
import api from '../api/axios';
import PageHeader from '../components/common/PageHeader';
import { useSettings } from '../context/SettingsContext';
import confetti from 'canvas-confetti';

export default function Contact() {
  const { settings } = useSettings();
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setError('Name, email, and message are required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.post('/contact', formData);
      if (res.data.success) {
        setSuccess(true);
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = () => {
    const phone = (settings?.whatsapp_number || '919876543210').replace(/[^0-9]/g, '');
    const msg = 'Hello GS Vision Sales Team, I would like to inquire regarding CCTV hardware and wholesale pricing.';
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const phoneDisplay = settings?.phone || '+91 98765 43210';

  return (
    <div className="bg-[#F7F8F8] space-y-12 pb-20">
      <PageHeader
        title="Contact GS Vision"
        subtitle="Get in touch for wholesale camera pricing, 200+ accessories availability, or authorized dealership inquiries."
        breadcrumbs={[{ label: 'Contact Us' }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Info Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-[#E6E6E6] rounded-2xl p-6 shadow-card space-y-6">
              <h2 className="text-xl font-black text-[#151515] pb-3 border-b border-[#F1F3F5]">
                Direct Contacts
              </h2>

              <div className="space-y-4 text-xs sm:text-sm text-[#404040]">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#E8F8F3] text-[#009B72] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#151515]">Office Address</h4>
                    <p className="text-[#666666] leading-relaxed mt-0.5">{settings?.address || 'Industrial Area, Electronic City, Phase II, New Delhi'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#E8F8F3] text-[#009B72] flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#151515]">Phone Number</h4>
                    <a href={`tel:${phoneDisplay}`} className="text-[#009B72] font-semibold hover:underline block mt-0.5">
                      {phoneDisplay}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#E8F8F3] text-[#009B72] flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#151515]">Email Address</h4>
                    <a href={`mailto:${settings?.email || 'sales@gsvision.com'}`} className="text-[#009B72] hover:underline block mt-0.5">
                      {settings?.email || 'sales@gsvision.com'}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#E8F8F3] text-[#009B72] flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#151515]">Business Hours</h4>
                    <p className="text-[#666666] mt-0.5">{settings?.business_hours || 'Mon - Sat: 9:30 AM - 7:00 PM'}</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleWhatsApp}
                  className="w-full py-3 bg-[#009B72] hover:bg-[#007A5A] text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Chat on WhatsApp Directly</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-[#E6E6E6] rounded-2xl p-6 sm:p-8 shadow-card">
              {success ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 bg-[#E8F8F3] text-[#009B72] rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#151515]">Message Sent Successfully!</h3>
                  <p className="text-xs sm:text-sm text-[#666666] max-w-md mx-auto">
                    Thank you for reaching out to <strong>GS Vision</strong>. A surveillance specialist will respond to your query shortly.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="px-6 py-2.5 bg-[#009B72] text-white rounded-lg text-xs font-bold"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h2 className="text-xl font-black text-[#151515] pb-2 border-b border-[#F1F3F5]">
                    Send us a Message
                  </h2>

                  {error && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#404040] mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Amit Patel"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-[#F7F8F8] border border-[#E6E6E6] rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-[#151515] focus:outline-none focus:border-[#009B72] focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#404040] mb-1">Phone / Mobile</label>
                      <input
                        type="tel"
                        placeholder="e.g. 9876543210"
                        value={formData.mobile}
                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                        className="w-full bg-[#F7F8F8] border border-[#E6E6E6] rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-[#151515] focus:outline-none focus:border-[#009B72] focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#404040] mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. amit@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-[#F7F8F8] border border-[#E6E6E6] rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-[#151515] focus:outline-none focus:border-[#009B72] focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#404040] mb-1">Subject</label>
                      <input
                        type="text"
                        placeholder="e.g. Wholesale Accessories Quote"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full bg-[#F7F8F8] border border-[#E6E6E6] rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-[#151515] focus:outline-none focus:border-[#009B72] focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#404040] mb-1">Message *</label>
                    <textarea
                      rows="4"
                      required
                      placeholder="Write your project requirements, questions, or camera quantities..."
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
                    <span>Submit Inquiry</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
