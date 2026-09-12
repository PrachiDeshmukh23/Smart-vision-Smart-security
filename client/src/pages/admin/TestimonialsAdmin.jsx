import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import ConfirmModal from '../../components/common/ConfirmModal';
import { Plus, Edit2, Trash2, Star } from 'lucide-react';

const TestimonialsAdmin = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState({
    client_name: '',
    company: '',
    designation: '',
    review: '',
    rating: 5,
    is_featured: 0,
    is_active: 1
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const res = await api.get('/testimonials/admin/all');
      if (res.data.success) {
        setTestimonials(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const openCreateModal = () => {
    setEditingTestimonial(null);
    setFormData({
      client_name: '',
      company: '',
      designation: '',
      review: '',
      rating: 5,
      is_featured: 0,
      is_active: 1
    });
    setAvatarFile(null);
    setShowModal(true);
  };

  const openEditModal = (t) => {
    setEditingTestimonial(t);
    setFormData({
      client_name: t.client_name,
      company: t.company || '',
      designation: t.designation || '',
      review: t.review || '',
      rating: t.rating || 5,
      is_featured: t.is_featured ? 1 : 0,
      is_active: t.is_active ? 1 : 0
    });
    setAvatarFile(null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('client_name', formData.client_name);
      data.append('company', formData.company);
      data.append('designation', formData.designation);
      data.append('review', formData.review);
      data.append('rating', formData.rating);
      data.append('is_featured', formData.is_featured);
      data.append('is_active', formData.is_active);
      if (avatarFile) {
        data.append('avatar', avatarFile);
      }

      if (editingTestimonial) {
        await api.put(`/testimonials/${editingTestimonial.id}`, data);
        setToast({ type: 'success', text: 'Testimonial updated successfully' });
      } else {
        await api.post('/testimonials', data);
        setToast({ type: 'success', text: 'Testimonial created successfully' });
      }
      setShowModal(false);
      fetchTestimonials();
    } catch (err) {
      setToast({ type: 'error', text: err.response?.data?.message || 'Action failed' });
    } finally {
      setSubmitting(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/testimonials/${deleteId}`);
      setToast({ type: 'success', text: 'Testimonial deleted successfully' });
      fetchTestimonials();
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
          <h1 className="text-2xl font-bold text-white">Client Testimonials</h1>
          <p className="text-slate-400 text-sm">Manage customer reviews, ratings, and feedback</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center space-x-2 bg-primary hover:bg-primary-dark text-slate-950 font-semibold px-4 py-2.5 rounded-lg transition"
        >
          <Plus className="w-5 h-5" />
          <span>Add Testimonial</span>
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : testimonials.length === 0 ? (
        <EmptyState title="No Testimonials" message="Add customer praise and feedback." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between hover:border-slate-700 transition">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < t.rating ? 'text-primary fill-primary' : 'text-slate-700'}`} />
                    ))}
                  </div>
                  <div className="flex items-center space-x-2">
                    {t.is_featured ? (
                      <span className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded">Featured</span>
                    ) : null}
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${t.is_active ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                      {t.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <p className="text-slate-300 text-xs italic mb-4 line-clamp-3">"{t.review}"</p>

                <div className="flex items-center space-x-3 pt-3 border-t border-slate-800/80">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-primary text-sm overflow-hidden shrink-0">
                    {t.avatar_url ? (
                      <img src={t.avatar_url} alt={t.client_name} className="w-full h-full object-cover" />
                    ) : (
                      t.client_name.charAt(0)
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-white text-sm font-semibold truncate">{t.client_name}</h4>
                    <p className="text-slate-400 text-xs truncate">
                      {t.designation ? `${t.designation}, ` : ''}{t.company || ''}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-800 mt-4">
                <button
                  onClick={() => openEditModal(t)}
                  className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteId(t.id)}
                  className="p-1.5 text-slate-400 hover:text-red-400 rounded hover:bg-slate-800 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
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
              {editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Client / Customer Name *</label>
                <input
                  type="text"
                  required
                  value={formData.client_name}
                  onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                  placeholder="e.g. Vikram Sharma"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Company / Organization</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Apex Industries"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Designation</label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    placeholder="e.g. Operations Head"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Review Feedback *</label>
                <textarea
                  rows="3"
                  required
                  value={formData.review}
                  onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                  placeholder="Their feedback and experience with GS Vision..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Rating (1-5)</label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
                  >
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>{r} Stars</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Featured</label>
                  <select
                    value={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: parseInt(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
                  >
                    <option value={0}>No</option>
                    <option value={1}>Yes</option>
                  </select>
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
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Avatar Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAvatarFile(e.target.files[0])}
                  className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-primary hover:file:bg-slate-700"
                />
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
                  {submitting ? 'Saving...' : editingTestimonial ? 'Save Changes' : 'Create Testimonial'}
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
        title="Delete Testimonial"
        message="Are you sure you want to delete this client testimonial?"
      />
    </div>
  );
};

export default TestimonialsAdmin;
