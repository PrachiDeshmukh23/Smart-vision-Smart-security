import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import ConfirmModal from '../../components/common/ConfirmModal';
import { Plus, Edit2, Trash2, FileText, Download, HardDrive } from 'lucide-react';

const DownloadsAdmin = () => {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDownload, setEditingDownload] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Datasheet',
    file_type: 'PDF',
    description: '',
    is_active: 1
  });
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const fetchDownloads = async () => {
    try {
      setLoading(true);
      const res = await api.get('/downloads/admin/all');
      if (res.data.success) {
        setDownloads(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDownloads();
  }, []);

  const openCreateModal = () => {
    setEditingDownload(null);
    setFormData({
      title: '',
      category: 'Datasheet',
      file_type: 'PDF',
      description: '',
      is_active: 1
    });
    setFile(null);
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingDownload(item);
    setFormData({
      title: item.title,
      category: item.category || 'Datasheet',
      file_type: item.file_type || 'PDF',
      description: item.description || '',
      is_active: item.is_active ? 1 : 0
    });
    setFile(null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('category', formData.category);
      data.append('file_type', formData.file_type);
      data.append('description', formData.description);
      data.append('is_active', formData.is_active);
      if (file) {
        data.append('file', file);
      }

      if (editingDownload) {
        await api.put(`/downloads/${editingDownload.id}`, data);
        setToast({ type: 'success', text: 'Document updated successfully' });
      } else {
        if (!file) {
          setToast({ type: 'error', text: 'Please select a file to upload' });
          setSubmitting(false);
          return;
        }
        await api.post('/downloads', data);
        setToast({ type: 'success', text: 'Document uploaded successfully' });
      }
      setShowModal(false);
      fetchDownloads();
    } catch (err) {
      setToast({ type: 'error', text: err.response?.data?.message || 'Action failed' });
    } finally {
      setSubmitting(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/downloads/${deleteId}`);
      setToast({ type: 'success', text: 'Document deleted successfully' });
      fetchDownloads();
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
          <h1 className="text-2xl font-bold text-white">Downloads Center</h1>
          <p className="text-slate-400 text-sm">Upload catalogs, datasheets, firmwares, and user manuals</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center space-x-2 bg-primary hover:bg-primary-dark text-slate-950 font-semibold px-4 py-2.5 rounded-lg transition"
        >
          <Plus className="w-5 h-5" />
          <span>Upload Document</span>
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : downloads.length === 0 ? (
        <EmptyState title="No Files Uploaded" message="Upload PDFs, manuals, and brochures for your visitors." />
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950/60 text-slate-400 uppercase text-xs border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Title & Description</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Format / Size</th>
                  <th className="px-6 py-4">Downloads</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {downloads.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-primary shrink-0" />
                        <span>{d.title}</span>
                      </div>
                      {d.description && <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{d.description}</p>}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded text-xs">
                        {d.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      <span className="font-semibold text-white">{d.file_type || 'PDF'}</span> &bull; {d.file_size || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <span className="text-primary font-bold">{d.download_count || 0}</span> times
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${d.is_active ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                        {d.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <a
                          href={d.file_url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-primary rounded-lg transition"
                          title="Download / View"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => openEditModal(d)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(d.id)}
                          className="p-1.5 bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-white mb-4">
              {editingDownload ? 'Edit Document' : 'Upload New Document'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. GS Vision 2025 CCTV Product Catalogue"
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
                    <option value="Brochure">Brochure</option>
                    <option value="Datasheet">Datasheet</option>
                    <option value="User Manual">User Manual</option>
                    <option value="Software">Software / Tool</option>
                    <option value="Firmware">Firmware</option>
                    <option value="Certificate">Certificate</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">File Type Label</label>
                  <input
                    type="text"
                    value={formData.file_type}
                    onChange={(e) => setFormData({ ...formData, file_type: e.target.value })}
                    placeholder="PDF, ZIP, EXE..."
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
                  placeholder="Short summary of what is inside this document..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">File {editingDownload ? '(Optional replacement)' : '*'}</label>
                <input
                  type="file"
                  required={!editingDownload}
                  onChange={(e) => setFile(e.target.files[0])}
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
                  {submitting ? 'Uploading...' : editingDownload ? 'Save Changes' : 'Upload File'}
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
        title="Delete Document"
        message="Are you sure you want to delete this downloadable file?"
      />
    </div>
  );
};

export default DownloadsAdmin;
