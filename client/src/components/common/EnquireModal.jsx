import React, { useState, useEffect } from 'react';
import { X, Send, ShieldCheck, CheckCircle2, Loader2 } from 'lucide-react';
import api from '../../api/axios';

export default function EnquireModal({ isOpen, onClose, defaultProduct = null }) {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    company: '',
    city: '',
    product_id: '',
    quantity: '',
    message: '',
  });
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (defaultProduct) {
      setFormData((prev) => ({
        ...prev,
        product_id: defaultProduct.id || '',
        message: `I would like to inquire about the ${defaultProduct.name} (${defaultProduct.model_number || ''}).`,
      }));
    }
  }, [defaultProduct]);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await api.get('/products?limit=100');
        if (res.data.success) {
          setProductsList(res.data.products);
        }
      } catch (err) {}
    }
    if (isOpen) {
      loadProducts();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/enquiries', formData);
      if (res.data.success) {
        setSuccess(true);
      } else {
        setError(res.data.message || 'Failed to submit enquiry');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-[#E6E6E6] rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8C8C8C] hover:text-[#151515] p-1.5 rounded-lg hover:bg-[#F7F8F8] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-[#E8F8F3] text-[#009B72] rounded-full flex items-center justify-center mx-auto border border-[#009B72]/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-[#151515]">Enquiry Received!</h3>
            <p className="text-xs sm:text-sm text-[#666666] max-w-sm mx-auto">
              Thank you for contacting <strong>GS Vision</strong>. Our surveillance specialist will contact you with wholesale pricing and specifications shortly.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2.5 bg-[#009B72] hover:bg-[#007A5A] text-white rounded-xl text-xs font-bold transition-colors shadow-md"
            >
              Close
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="p-2 rounded-lg bg-[#E8F8F3] text-[#009B72] border border-[#009B72]/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-[#151515]">Product Enquiry &amp; Quote</h3>
            </div>
            <p className="text-xs text-[#666666] mb-5">
              Fill out the form below and our GS Vision team will assist you with trade pricing and technical support.
            </p>

            {error && (
              <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#404040] mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#F7F8F8] border border-[#E6E6E6] rounded-lg px-3 py-2 text-xs text-[#151515] focus:outline-none focus:border-[#009B72] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#404040] mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="w-full bg-[#F7F8F8] border border-[#E6E6E6] rounded-lg px-3 py-2 text-xs text-[#151515] focus:outline-none focus:border-[#009B72] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#404040] mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. rahul@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#F7F8F8] border border-[#E6E6E6] rounded-lg px-3 py-2 text-xs text-[#151515] focus:outline-none focus:border-[#009B72] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#404040] mb-1">City / Region</label>
                  <input
                    type="text"
                    placeholder="e.g. Delhi, Ahmedabad"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-[#F7F8F8] border border-[#E6E6E6] rounded-lg px-3 py-2 text-xs text-[#151515] focus:outline-none focus:border-[#009B72] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#404040] mb-1">Company / Business</label>
                  <input
                    type="text"
                    placeholder="e.g. Apex Security Systems"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full bg-[#F7F8F8] border border-[#E6E6E6] rounded-lg px-3 py-2 text-xs text-[#151515] focus:outline-none focus:border-[#009B72] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#404040] mb-1">Estimated Quantity</label>
                  <input
                    type="text"
                    placeholder="e.g. 5 Units / 50 Kits (No MOQ)"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full bg-[#F7F8F8] border border-[#E6E6E6] rounded-lg px-3 py-2 text-xs text-[#151515] focus:outline-none focus:border-[#009B72] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#404040] mb-1">Product of Interest</label>
                <select
                  value={formData.product_id}
                  onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
                  className="w-full bg-[#F7F8F8] border border-[#E6E6E6] rounded-lg px-3 py-2 text-xs text-[#151515] focus:outline-none focus:border-[#009B72] focus:bg-white"
                >
                  <option value="">-- General / Multiple Accessories --</option>
                  {productsList.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.model_number})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#404040] mb-1">Message / Requirements</label>
                <textarea
                  rows="3"
                  placeholder="Share required quantities, accessories, or delivery questions..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-[#F7F8F8] border border-[#E6E6E6] rounded-lg p-2.5 text-xs text-[#151515] focus:outline-none focus:border-[#009B72] focus:bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-[#009B72] hover:bg-[#007A5A] transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>Submit Product Enquiry</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
