import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import ConfirmModal from '../../components/common/ConfirmModal';
import { Mail, Phone, MapPin, Building, Eye, Trash2, CheckCircle2, Clock } from 'lucide-react';

const DealersAdmin = () => {
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDealer, setSelectedDealer] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [notes, setNotes] = useState('');
  const [toast, setToast] = useState(null);

  const fetchDealers = async () => {
    try {
      setLoading(true);
      const url = statusFilter === 'all' ? '/dealers' : `/dealers?status=${statusFilter}`;
      const res = await api.get(url);
      if (res.data.success) {
        setDealers(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDealers();
  }, [statusFilter]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      setStatusUpdating(true);
      await api.patch(`/dealers/${id}/status`, { status: newStatus, notes });
      setToast({ type: 'success', text: 'Application updated successfully' });
      if (selectedDealer && selectedDealer.id === id) {
        setSelectedDealer({ ...selectedDealer, status: newStatus, notes });
      }
      fetchDealers();
    } catch (err) {
      setToast({ type: 'error', text: err.response?.data?.message || 'Update failed' });
    } finally {
      setStatusUpdating(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/dealers/${deleteId}`);
      setToast({ type: 'success', text: 'Application deleted successfully' });
      if (selectedDealer && selectedDealer.id === deleteId) {
        setSelectedDealer(null);
      }
      fetchDealers();
    } catch (err) {
      setToast({ type: 'error', text: err.response?.data?.message || 'Delete failed' });
    } finally {
      setDeleteId(null);
      setTimeout(() => setToast(null), 3000);
    }
  };

  const openDetailModal = (dealer) => {
    setSelectedDealer(dealer);
    setNotes(dealer.notes || '');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/20">Approved</span>;
      case 'rejected':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">Rejected</span>;
      case 'under_review':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">Under Review</span>;
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
          <h1 className="text-2xl font-bold text-white">Dealer Applications</h1>
          <p className="text-slate-400 text-sm">Review prospective distributor and dealership requests</p>
        </div>
        <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 p-1 rounded-lg">
          {['all', 'pending', 'under_review', 'approved', 'rejected'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition ${statusFilter === st ? 'bg-primary text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : dealers.length === 0 ? (
        <EmptyState title="No Dealer Applications" message="No applications matching the selected filter." />
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950/60 text-slate-400 uppercase text-xs border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Company / Applicant</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Experience</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {dealers.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{d.company_name}</div>
                      <div className="text-xs text-slate-400">{d.applicant_name} ({d.designation || 'Proprietor'})</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-slate-300 font-medium">{d.city}, {d.state}</div>
                      {d.gst_number && <div className="text-[11px] text-slate-500">GST: {d.gst_number}</div>}
                    </td>
                    <td className="px-6 py-4 space-y-1">
                      <div className="flex items-center space-x-1.5 text-xs text-slate-300">
                        <Phone className="w-3.5 h-3.5 text-slate-500" />
                        <a href={`tel:${d.phone}`} className="hover:text-primary">{d.phone}</a>
                      </div>
                      <div className="flex items-center space-x-1.5 text-xs text-slate-400">
                        <Mail className="w-3.5 h-3.5 text-slate-500" />
                        <a href={`mailto:${d.email}`} className="hover:text-primary truncate max-w-[150px]">{d.email}</a>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {d.years_in_business ? `${d.years_in_business} Years` : 'N/A'}
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(d.status)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => openDetailModal(d)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-primary rounded-lg transition"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(d.id)}
                          className="p-1.5 bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition"
                          title="Delete Application"
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
      {selectedDealer && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold text-white">{selectedDealer.company_name}</h2>
                <p className="text-xs text-slate-400">Application #{selectedDealer.id} &bull; {new Date(selectedDealer.created_at).toLocaleString()}</p>
              </div>
              {getStatusBadge(selectedDealer.status)}
            </div>

            <div className="space-y-4 text-sm bg-slate-800/40 p-4 rounded-xl border border-slate-800 mb-5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-xs text-slate-500 block">Applicant Name</span>
                  <span className="font-semibold text-white">{selectedDealer.applicant_name}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Designation</span>
                  <span className="font-semibold text-white">{selectedDealer.designation || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Phone</span>
                  <a href={`tel:${selectedDealer.phone}`} className="text-primary hover:underline">{selectedDealer.phone}</a>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Email</span>
                  <a href={`mailto:${selectedDealer.email}`} className="text-primary hover:underline">{selectedDealer.email}</a>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Location</span>
                  <span className="text-white">{selectedDealer.city}, {selectedDealer.state}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Pincode</span>
                  <span className="text-white">{selectedDealer.pincode || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">GST Number</span>
                  <span className="text-white font-mono text-xs">{selectedDealer.gst_number || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Years in Business</span>
                  <span className="text-white">{selectedDealer.years_in_business || 'N/A'}</span>
                </div>
              </div>

              {selectedDealer.business_address && (
                <div className="pt-2 border-t border-slate-700/50">
                  <span className="text-xs text-slate-500 block mb-1">Business Address</span>
                  <p className="text-slate-300 text-xs">{selectedDealer.business_address}</p>
                </div>
              )}

              {selectedDealer.annual_turnover && (
                <div>
                  <span className="text-xs text-slate-500 block">Annual Turnover</span>
                  <span className="text-white">{selectedDealer.annual_turnover}</span>
                </div>
              )}

              {selectedDealer.existing_brands && (
                <div>
                  <span className="text-xs text-slate-500 block">Existing Brands Handled</span>
                  <span className="text-slate-300 text-xs">{selectedDealer.existing_brands}</span>
                </div>
              )}

              {selectedDealer.message && (
                <div className="pt-2 border-t border-slate-700/50">
                  <span className="text-xs text-slate-500 block mb-1">Additional Information</span>
                  <p className="text-slate-300 text-xs bg-slate-900/60 p-3 rounded-lg whitespace-pre-wrap">{selectedDealer.message}</p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Internal Notes</label>
                <textarea
                  rows="2"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Verification notes or follow-up feedback..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Update Status</label>
                <div className="grid grid-cols-4 gap-2">
                  {['pending', 'under_review', 'approved', 'rejected'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      disabled={statusUpdating}
                      onClick={() => handleUpdateStatus(selectedDealer.id, st)}
                      className={`py-2 text-[11px] font-semibold rounded-lg capitalize transition border ${
                        selectedDealer.status === st
                          ? 'bg-primary text-slate-950 border-primary'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-5 border-t border-slate-800 mt-5">
              <button
                onClick={() => setSelectedDealer(null)}
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
        title="Delete Dealer Application"
        message="Are you sure you want to delete this dealer application?"
      />
    </div>
  );
};

export default DealersAdmin;
