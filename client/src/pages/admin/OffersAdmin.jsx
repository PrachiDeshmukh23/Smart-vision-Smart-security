import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import ConfirmModal from '../../components/common/ConfirmModal';
import { Plus, Edit2, Trash2, Tag, Calendar } from 'lucide-react';

const OffersAdmin = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discount_percentage: '',
    coupon_code: '',
    valid_from: '',
    valid_until: '',
    is_active: 1
  });
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/offers/admin/all');
      if (res.data.success) {
        setOffers(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const openCreateModal = () => {
    setEditingOffer(null);
    setFormData({
      title: '',
      description: '',
      discount_percentage: '',
      coupon_code: '',
      valid_from: '',
      valid_until: '',
      is_active: 1
    });
    setImageFile(null);
    setShowModal(true);
  };

  const openEditModal = (offer) => {
    setEditingOffer(offer);
    setFormData({
      title: offer.title || '',
      description: offer.description || '',
      discount_percentage: offer.discount_percentage || '',
      coupon_code: offer.coupon_code || '',
      valid_from: offer.valid_from ? offer.valid_from.substring(0, 10) : '',
      valid_until: offer.valid_until ? offer.valid_until.substring(0, 10) : '',
      is_active: offer.is_active ? 1 : 0
    });
    setImageFile(null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('discount_percentage', formData.discount_percentage);
      data.append('coupon_code', formData.coupon_code);
      data.append('valid_from', formData.valid_from);
      data.append('valid_until', formData.valid_until);
      data.append('is_active', formData.is_active);
      if (imageFile) {
        data.append('image', imageFile);
      }

      if (editingOffer) {
        await api.put(`/offers/${editingOffer.id}`, data);
        setToast({ type: 'success', text: 'Offer updated successfully' });
      } else {
        await api.post('/offers', data);
        setToast({ type: 'success', text: 'Offer created successfully' });
      }
      setShowModal(false);
      fetchOffers();
    } catch (err) {
      setToast({ type: 'error', text: err.response?.data?.message || 'Action failed' });
    } finally {
      setSubmitting(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/offers/${deleteId}`);
      setToast({ type: 'success', text: 'Offer deleted successfully' });
      fetchOffers();
    } catch (err) {
      setToast({ type: 'error', text: err.response?.data?.message || 'Delete failed' });
    } finally {
      setDeleteId(null);
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className={`p-4 rounded-lg text-sm ${toast.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
          {toast.text}
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Promotions & Offers</h1>
          <p className="text-slate-400 text-sm">Manage deals, discount packages, and special promotions</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center space-x-2 bg-primary hover:bg-primary-dark text-slate-950 font-semibold px-4 py-2.5 rounded-lg transition"
        >
          <Plus className="w-5 h-5" />
          <span>Add Offer</span>
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : offers.length === 0 ? (
        <EmptyState title="No Offers Found" message="Create your first promotional offer." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <div key={offer.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition flex flex-col justify-between">
              {offer.image_url ? (
                <div className="h-44 bg-slate-950 overflow-hidden">
                  <img src={offer.image_url} alt={offer.title} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="h-32 bg-gradient-to-br from-primary/20 to-blue-900/20 flex items-center justify-center">
                  <Tag className="w-12 h-12 text-primary/40" />
                </div>
              )}

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    {offer.discount_percentage && (
                      <span className="bg-primary/20 text-primary border border-primary/30 px-2.5 py-0.5 rounded-full text-xs font-bold">
                        {offer.discount_percentage}% OFF
                      </span>
                    )}
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${offer.is_active ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                      {offer.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">{offer.title}</h3>
                  {offer.description && <p className="text-slate-400 text-xs mb-3 line-clamp-3">{offer.description}</p>}

                  {offer.coupon_code && (
                    <div className="bg-slate-800/80 border border-dashed border-slate-700 px-3 py-1.5 rounded-lg text-xs flex items-center justify-between mb-3">
                      <span className="text-slate-400">Coupon:</span>
                      <span className="text-primary font-mono font-bold">{offer.coupon_code}</span>
                    </div>
                  )}

                  {(offer.valid_from || offer.valid_until) && (
                    <div className="flex items-center space-x-1 text-[11px] text-slate-500">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Valid: {offer.valid_from ? new Date(offer.valid_from).toLocaleDateString() : 'Now'} - {offer.valid_until ? new Date(offer.valid_until).toLocaleDateString() : 'Forever'}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-800 mt-4">
                  <button
                    onClick={() => openEditModal(offer)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteId(offer.id)}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-4">
              {editingOffer ? 'Edit Offer' : 'Add New Offer'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Offer Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Festival 8-Channel CCTV Combo Discount"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Discount %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.discount_percentage}
                    onChange={(e) => setFormData({ ...formData, discount_percentage: e.target.value })}
                    placeholder="25"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Coupon Code</label>
                  <input
                    type="text"
                    value={formData.coupon_code}
                    onChange={(e) => setFormData({ ...formData, coupon_code: e.target.value.toUpperCase() })}
                    placeholder="GSSECURE25"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary uppercase"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Offer details and inclusions..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Valid From</label>
                  <input
                    type="date"
                    value={formData.valid_from}
                    onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Valid Until</label>
                  <input
                    type="date"
                    value={formData.valid_until}
                    onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Offer Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-primary hover:file:bg-slate-700"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Status</label>
                <select
                  value={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: parseInt(e.target.value) })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
                >
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm text-slate-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-primary hover:bg-primary-dark text-slate-950 font-semibold rounded-lg text-sm transition disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingOffer ? 'Save Changes' : 'Create Offer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Offer"
        message="Are you sure you want to delete this promotional offer?"
      />
    </div>
  );
};

export default OffersAdmin;
