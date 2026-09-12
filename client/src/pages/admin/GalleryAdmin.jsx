import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import ConfirmModal from '../../components/common/ConfirmModal';
import { Plus, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';

const GalleryAdmin = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Installations',
    description: '',
    display_order: 0,
    is_active: 1
  });
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const res = await api.get('/gallery/admin/all');
      if (res.data.success) {
        setItems(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      category: 'Installations',
      description: '',
      display_order: 0,
      is_active: 1
    });
    setImageFile(null);
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      category: item.category || 'Installations',
      description: item.description || '',
      display_order: item.display_order || 0,
      is_active: item.is_active ? 1 : 0
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
      data.append('category', formData.category);
      data.append('description', formData.description);
      data.append('display_order', formData.display_order);
      data.append('is_active', formData.is_active);
      if (imageFile) {
        data.append('image', imageFile);
      }

      if (editingItem) {
        await api.put(`/gallery/${editingItem.id}`, data);
        setToast({ type: 'success', text: 'Gallery item updated successfully' });
      } else {
        if (!imageFile) {
          setToast({ type: 'error', text: 'Please select an image to upload' });
          setSubmitting(false);
          return;
        }
        await api.post('/gallery', data);
        setToast({ type: 'success', text: 'Gallery image added successfully' });
      }
      setShowModal(false);
      fetchGallery();
    } catch (err) {
      setToast({ type: 'error', text: err.response?.data?.message || 'Action failed' });
    } finally {
      setSubmitting(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/gallery/${deleteId}`);
      setToast({ type: 'success', text: 'Gallery item deleted' });
      fetchGallery();
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
          <h1 className="text-2xl font-bold text-white">Photo Gallery</h1>
          <p className="text-slate-400 text-sm">Manage project showcases, CCTV installations, and corporate events</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center space-x-2 bg-primary hover:bg-primary-dark text-slate-950 font-semibold px-4 py-2.5 rounded-lg transition"
        >
          <Plus className="w-5 h-5" />
          <span>Add Photo</span>
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : items.length === 0 ? (
        <EmptyState title="No Photos Found" message="Add your first gallery project showcase image." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((it) => (
            <div key={it.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition flex flex-col justify-between">
              <div className="h-44 bg-slate-950 overflow-hidden relative">
                <img src={it.image_url} alt={it.title} className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur-sm text-primary text-[10px] font-bold px-2 py-0.5 rounded">
                  {it.category}
                </span>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-white text-sm font-semibold mb-1 truncate">{it.title || 'Untitled'}</h4>
                  {it.description && <p className="text-xs text-slate-400 line-clamp-2 mb-2">{it.description}</p>}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${it.is_active ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                    {it.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => openEditModal(it)}
                      className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteId(it.id)}
                      className="p-1.5 text-slate-400 hover:text-red-400 rounded hover:bg-slate-800 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-white mb-4">
              {editingItem ? 'Edit Photo' : 'Upload Gallery Photo'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Title / Caption</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Warehouse 32-Cam Smart Deployment"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
                  >
                    <option value="Installations">Installations</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Residential">Residential</option>
                    <option value="Events">Events / Expo</option>
                    <option value="Control Rooms">Control Rooms</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Description</label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Image {editingItem ? '(Optional replacement)' : '*'}</label>
                <input
                  type="file"
                  accept="image/*"
                  required={!editingItem}
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
                  {submitting ? 'Uploading...' : editingItem ? 'Save Changes' : 'Upload Photo'}
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
        title="Delete Photo"
        message="Are you sure you want to delete this gallery photo?"
      />
    </div>
  );
};

export default GalleryAdmin;
