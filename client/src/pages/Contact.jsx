import React, { useState } from 'react';
import {
  MapPin, Phone, Mail, Clock, Send, CheckCircle2,
  MessageCircle, MessageSquare, ShieldCheck, Loader2
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
    const msg = 'Hello GS Vision Sales Team, I would like to inquire regarding CCTV hardware and dealership support.';
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="space-y-16 pb-20">
      <PageHeader
        title="Contact GS Vision"
        subtitle="Get in touch for camera specifications, bulk quotations, or authorized dealership inquiries."
        breadcrumbs={[{ label: 'Contact Us' }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Contact Information Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl">
              <div>
                <h3 className="text-xl font-bold text-white">Get in Touch</h3>
                <p className="text-xs text-slate-400 mt-1">Our technical sales engineers are ready to assist you.</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase">Corporate Facility & Address</h4>
                    <p className="text-sm text-slate-200 mt-0.5 leading-relaxed">
                      {settings?.address || 'Plot No. 45, Industrial Area, Electronic City, Phase II, New Delhi - 110020, India'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase">Phone & Sales Hotline</h4>
                    <a href={`tel:${settings?.phone}`} className="text-sm text-white font-semibold hover:text-cyan-400 block">
                      {settings?.phone || '+91 98765 43210'}
                    </a>
                    {settings?.secondary_phone && (
                      <a href={`tel:${settings?.secondary_phone}`} className="text-xs text-slate-400 hover:text-cyan-400 block">
                        Alt: {settings.secondary_phone}
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase">Email Enquiries</h4>
                    <a href={`mailto:${settings?.email}`} className="text-sm text-slate-200 hover:text-cyan-400 block">
                      {settings?.email || 'sales@gsvision.com'}
                    </a>
                    {settings?.support_email && (
                      <a href={`mailto:${settings?.support_email}`} className="text-xs text-slate-400 hover:text-cyan-400 block">
                        Support: {settings.support_email}
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase">Operational Hours</h4>
                    <p className="text-sm text-slate-200 mt-0.5">
                      {settings?.business_hours || 'Monday - Saturday: 9:30 AM - 7:00 PM'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <button
                  onClick={handleWhatsApp}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/20"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Connect on WhatsApp Sales Desk</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right: Interactive Message Form */}
          <div className="lg:col-span-7">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
              {success ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Message Sent Successfully</h3>
                  <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
                    Thank you for contacting <strong>GS Vision</strong>. Our surveillance specialist will respond to your query shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSuccess(false);
                      setFormData({ name: '', mobile: '', email: '', subject: '', message: '' });
                    }}
                    className="mt-4 px-6 py-2.5 bg-cyan-600 text-white rounded-xl text-xs font-bold"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <div className="border-b border-slate-800 pb-4">
                    <h3 className="text-2xl font-bold text-white">Send Us a Direct Message</h3>
                    <p className="text-xs text-slate-400 mt-1">We respond to all technical and commercial inquiries within 24 hours.</p>
                  </div>

                  {error && (
                    <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Vikas Gupta"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile Phone</label>
                        <input
                          type="tel"
                          placeholder="e.g. 9876543210"
                          value={formData.mobile}
                          onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address *</label>
                        <input
                          type="email"
                          required
                          placeholder="e.g. vikas@company.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Subject</label>
                        <input
                          type="text"
                          placeholder="e.g. Bulk Quote / Technical Support"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Your Message *</label>
                      <textarea
                        rows="4"
                        required
                        placeholder="Write your requirement or questions here..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      <span>Send Message</span>
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Embedded Google Map */}
        {settings?.map_embed_url && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden p-2 shadow-2xl">
            <iframe
              src={settings.map_embed_url}
              width="100%"
              height="380"
              style={{ border: 0, borderRadius: '1.25rem' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="GS Vision Location Map"
            />
          </div>
        )}
      </div>
    </div>
  );
}
