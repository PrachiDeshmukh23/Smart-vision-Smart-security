import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import ConfirmModal from '../../components/common/ConfirmModal';
import { Mail, Phone, Calendar, User, Eye, Trash2, CheckCircle2, Clock } from 'lucide-react';

const EnquiriesAdmin = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [notes, setNotes] = useState('');
  const [toast, setToast] = useState(null);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const url = statusFilter === 'all' ? '/enquiries' : `/enquiries?status=${statusFilter}`;
      const res = await api.get(url);
      if (res.data.success) {
        setEnquiries(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [statusFilter]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      setStatusUpdating(true);
      await api.patch(`/enquiries/${id}/status`, { status: newStatus, notes });
      setToast({ type: 'success', text: 'Enquiry updated successfully' });
      if (selectedEnquiry && selectedEnquiry.id === id) {
        setSelectedEnquiry({ ...selectedEnquiry, status: newStatus, notes });
      }
      fetchEnquiries();
    } catch (err) {
      setToast({ type: 'error', text: err.response?.data?.message || 'Update failed' });
    } finally {
      setStatusUpdating(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/enquiries/${deleteId}`);
      setToast({ type: 'success', text: 'Enquiry deleted successfully' });
      if (selectedEnquiry && selectedEnquiry.id === deleteId) {
        setSelectedEnquiry(null);
      }
      fetchEnquiries();
    } catch (err) {
      setToast({ type: 'error', text: err.response?.data?.message || 'Delete failed' });
    } finally {
      setDeleteId(null);
      setTimeout(() => setToast(null), 3000);
    }
  };

  const openDetailModal = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setNotes(enquiry.notes || '');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'contacted':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">Contacted</span>;
      case 'closed':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/20">Closed</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">Pending</span>;
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
          <h1 className="text-2xl font-bold text-white">Product Enquiries</h1>
          <p className="text-slate-400 text-sm">Lead generation and customer inquiries management</p>
        </div>
        <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 p-1 rounded-lg">
          {['all', 'pending', 'contacted', 'closed'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition ${statusFilter === st ? 'bg-primary text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : enquiries.length === 0 ? (
        <EmptyState title="No Enquiries Found" message="No customer leads matching the selected filter." />
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950/60 text-slate-400 uppercase text-xs border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Product / Details</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {enquiries.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{e.name}</div>
                      {e.company && <div className="text-xs text-slate-400">{e.company}</div>}
                    </td>
                    <td className="px-6 py-4 space-y-1">
                      <div className="flex items-center space-x-1.5 text-xs text-slate-300">
                        <Phone className="w-3.5 h-3.5 text-slate-500" />
                        <a href={`tel:${e.phone}`} className="hover:text-primary">{e.phone}</a>
                      </div>
                      <div className="flex items-center space-x-1.5 text-xs text-slate-400">
                        <Mail className="w-3.5 h-3.5 text-slate-500" />
                        <a href={`mailto:${e.email}`} className="hover:text-primary truncate max-w-[150px]">{e.email}</a>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {e.product_name ? (
                        <div className="text-primary font-medium text-xs">{e.product_name}</div>
                      ) : (
                        <span className="text-slate-500 text-xs italic">General Enquiry</span>
                      )}
                      {e.quantity && <div className="text-[11px] text-slate-400">Qty: {e.quantity}</div>}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400 whitespace-nowrap">
                      {new Date(e.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(e.status)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => openDetailModal(e)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-primary rounded-lg transition"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(e.id)}
                          className="p-1.5 bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition"
                          title="Delete Enquiry"
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

      {/* Detail Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold text-white">Enquiry #{selectedEnquiry.id}</h2>
                <p className="text-xs text-slate-400">Received on {new Date(selectedEnquiry.created_at).toLocaleString()}</p>
              </div>
              {getStatusBadge(selectedEnquiry.status)}
            </div>

            <div className="space-y-4 text-sm bg-slate-800/40 p-4 rounded-xl border border-slate-800 mb-5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-xs text-slate-500 block">Customer Name</span>
                  <span className="font-semibold text-white">{selectedEnquiry.name}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Company / Business</span>
                  <span className="font-semibold text-white">{selectedEnquiry.company || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Phone</span>
                  <a href={`tel:${selectedEnquiry.phone}`} className="text-primary hover:underline">{selectedEnquiry.phone}</a>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Email</span>
                  <a href={`mailto:${selectedEnquiry.email}`} className="text-primary hover:underline">{selectedEnquiry.email}</a>
                </div>
                {selectedEnquiry.city && (
                  <div>
                    <span className="text-xs text-slate-500 block">City</span>
                    <span className="text-white">{selectedEnquiry.city}</span>
                  </div>
                )}
                {selectedEnquiry.product_name && (
                  <div>
                    <span className="text-xs text-slate-500 block">Product Interested</span>
                    <span className="text-primary font-medium">{selectedEnquiry.product_name}</span>
                  </div>
                )}
                {selectedEnquiry.quantity && (
                  <div>
                    <span className="text-xs text-slate-500 block">Quantity</span>
                    <span className="text-white">{selectedEnquiry.quantity}</span>
                  </div>
                )}
              </div>

              {selectedEnquiry.message && (
                <div className="pt-3 border-t border-slate-700/50">
                  <span className="text-xs text-slate-500 block mb-1">Message / Requirement</span>
                  <p className="text-slate-300 text-xs bg-slate-900/60 p-3 rounded-lg whitespace-pre-wrap">{selectedEnquiry.message}</p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Admin Notes</label>
                <textarea
                  rows="2"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add internal notes on this lead..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Update Status</label>
                <div className="flex space-x-2">
                  {['pending', 'contacted', 'closed'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      disabled={statusUpdating}
                      onClick={() => handleUpdateStatus(selectedEnquiry.id, st)}
                      className={`flex-1 py-2 text-xs font-semibold rounded-lg capitalize transition border ${
                        selectedEnquiry.status === st
                          ? 'bg-primary text-slate-950 border-primary'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-5 border-t border-slate-800 mt-5">
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Enquiry"
        message="Are you sure you want to delete this customer enquiry?"
      />
    </div>
  );
};

export default EnquiriesAdmin;
