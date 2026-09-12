import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import ConfirmModal from '../../components/common/ConfirmModal';
import { Plus, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';

const BannersAdmin = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    button_text: '',
    button_link: '',
    display_order: 0,
    is_active: 1
  });
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await api.get('/banners/admin/all');
      if (res.data.success) {
        setBanners(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const openCreateModal = () => {
    setEditingBanner(null);
    setFormData({
      title: '',
      subtitle: '',
      button_text: '',
      button_link: '',
      display_order: 0,
      is_active: 1
    });
    setImageFile(null);
    setShowModal(true);
  };

  const openEditModal = (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      button_text: banner.button_text || '',
      button_link: banner.button_link || '',
      display_order: banner.display_order || 0,
      is_active: banner.is_active ? 1 : 0
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
      data.append('subtitle', formData.subtitle);
      data.append('button_text', formData.button_text);
      data.append('button_link', formData.button_link);
      data.append('display_order', formData.display_order);
      data.append('is_active', formData.is_active);
      if (imageFile) {
        data.append('image', imageFile);
      }

      if (editingBanner) {
        await api.put(`/banners/${editingBanner.id}`, data);
        setToast({ type: 'success', text: 'Banner updated successfully' });
      } else {
        if (!imageFile) {
          setToast({ type: 'error', text: 'Image file is required for new banners' });
          setSubmitting(false);
          return;
        }
        await api.post('/banners', data);
        setToast({ type: 'success', text: 'Banner created successfully' });
      }
      setShowModal(false);
      fetchBanners();
    } catch (err) {
      setToast({ type: 'error', text: err.response?.data?.message || 'Action failed' });
    } finally {
      setSubmitting(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/banners/${deleteId}`);
      setToast({ type: 'success', text: 'Banner deleted successfully' });
      fetchBanners();
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
          <h1 className="text-2xl font-bold text-white">Homepage Banners</h1>
          <p className="text-slate-400 text-sm">Manage hero slider slides and banners</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center space-x-2 bg-primary hover:bg-primary-dark text-slate-950 font-semibold px-4 py-2.5 rounded-lg transition"
        >
          <Plus className="w-5 h-5" />
          <span>Add Banner</span>
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : banners.length === 0 ? (
        <EmptyState title="No Banners Found" message="Add your first homepage slider banner." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map((b) => (
            <div key={b.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition flex flex-col justify-between">
              <div className="relative h-48 bg-slate-950">
                <img src={b.image_url} alt={b.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${b.is_active ? 'bg-green-500/80 text-white' : 'bg-red-500/80 text-white'}`}>
                    {b.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 bg-black/60 px-2 py-1 rounded text-xs text-slate-300">
                  Order: {b.display_order}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{b.title || 'Untitled Banner'}</h3>
                  {b.subtitle && <p className="text-slate-400 text-sm mb-3">{b.subtitle}</p>}
                  {b.button_text && (
                    <div className="text-xs text-primary mb-2">
                      Button: <span className="text-white font-medium">{b.button_text}</span> &rarr; {b.button_link}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-800 mt-4">
                  <button
                    onClick={() => openEditModal(b)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteId(b.id)}
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
              {editingBanner ? 'Edit Banner' : 'Add New Banner'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Banner Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Next-Gen AI Surveillance"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Subtitle / Caption</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="e.g. High-definition 4K cameras with smart color night vision"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Button Text</label>
                  <input
                    type="text"
                    value={formData.button_text}
                    onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                    placeholder="Explore Products"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Button Link</label>
                  <input
                    type="text"
                    value={formData.button_link}
                    onChange={(e) => setFormData({ ...formData, button_link: e.target.value })}
                    placeholder="/products"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
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
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Banner Image {editingBanner ? '(Optional to replace)' : '*'}</label>
                <input
                  type="file"
                  accept="image/*"
                  required={!editingBanner}
                  onChange={(e) => setImageFile(e.target.files[0])}
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
                  {submitting ? 'Saving...' : editingBanner ? 'Save Changes' : 'Create Banner'}
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
        title="Delete Banner"
        message="Are you sure you want to delete this homepage banner?"
      />
    </div>
  );
};

export default BannersAdmin;
