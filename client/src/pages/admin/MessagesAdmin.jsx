import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import ConfirmModal from '../../components/common/ConfirmModal';
import { Mail, Phone, Calendar, Eye, Trash2, CheckCircle2, MessageSquare } from 'lucide-react';

const MessagesAdmin = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const url = statusFilter === 'all' ? '/contact' : `/contact?status=${statusFilter}`;
      const res = await api.get(url);
      if (res.data.success) {
        setMessages(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [statusFilter]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await api.patch(`/contact/${id}/status`, { status: newStatus });
      setToast({ type: 'success', text: 'Status updated' });
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage({ ...selectedMessage, status: newStatus });
      }
      fetchMessages();
    } catch (err) {
      setToast({ type: 'error', text: 'Failed to update status' });
    } finally {
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/contact/${deleteId}`);
      setToast({ type: 'success', text: 'Message deleted' });
      if (selectedMessage && selectedMessage.id === deleteId) {
        setSelectedMessage(null);
      }
      fetchMessages();
    } catch (err) {
      setToast({ type: 'error', text: 'Failed to delete' });
    } finally {
      setDeleteId(null);
      setTimeout(() => setToast(null), 3000);
    }
  };

  const openModal = (msg) => {
    setSelectedMessage(msg);
    if (msg.status === 'unread') {
      handleUpdateStatus(msg.id, 'read');
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
          <h1 className="text-2xl font-bold text-white">Contact Messages</h1>
          <p className="text-slate-400 text-sm">Messages submitted through the public Contact page</p>
        </div>
        <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 p-1 rounded-lg">
          {['all', 'unread', 'read', 'replied'].map((st) => (
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
      ) : messages.length === 0 ? (
        <EmptyState title="No Messages Found" message="No contact form submissions under this filter." />
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950/60 text-slate-400 uppercase text-xs border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Sender</th>
                  <th className="px-6 py-4">Subject & Message</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {messages.map((m) => (
                  <tr key={m.id} className={`hover:bg-slate-800/40 transition ${m.status === 'unread' ? 'bg-primary/5 font-medium' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{m.name}</div>
                      <div className="text-xs text-slate-400">{m.email}</div>
                      {m.phone && <div className="text-xs text-slate-500">{m.phone}</div>}
                    </td>
                    <td className="px-6 py-4 max-w-md">
                      <div className="text-white text-xs font-semibold">{m.subject || 'General Inquiry'}</div>
                      <p className="text-slate-400 text-xs line-clamp-1 mt-0.5">{m.message}</p>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400 whitespace-nowrap">
                      {new Date(m.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                        m.status === 'unread'
                          ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 font-bold'
                          : m.status === 'replied'
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {m.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => openModal(m)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-primary rounded-lg transition"
                          title="Read Message"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(m.id)}
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

      {/* Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold text-white">{selectedMessage.subject || 'Contact Inquiry'}</h2>
                <p className="text-xs text-slate-400">{new Date(selectedMessage.created_at).toLocaleString()}</p>
              </div>
            </div>

            <div className="space-y-4 text-sm bg-slate-800/40 p-4 rounded-xl border border-slate-800 mb-5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-xs text-slate-500 block">Sender Name</span>
                  <span className="font-semibold text-white">{selectedMessage.name}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Phone</span>
                  {selectedMessage.phone ? (
                    <a href={`tel:${selectedMessage.phone}`} className="text-primary hover:underline">{selectedMessage.phone}</a>
                  ) : 'N/A'}
                </div>
                <div className="col-span-2">
                  <span className="text-xs text-slate-500 block">Email Address</span>
                  <a href={`mailto:${selectedMessage.email}`} className="text-primary hover:underline">{selectedMessage.email}</a>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-700/50">
                <span className="text-xs text-slate-500 block mb-1">Message Body</span>
                <p className="text-slate-200 text-xs bg-slate-900/60 p-3.5 rounded-lg whitespace-pre-wrap leading-relaxed">
                  {selectedMessage.message}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex space-x-2">
                {['read', 'replied'].map((st) => (
                  <button
                    key={st}
                    onClick={() => handleUpdateStatus(selectedMessage.id, st)}
                    className={`px-3 py-1.5 text-xs rounded-lg font-semibold capitalize border transition ${
                      selectedMessage.status === st
                        ? 'bg-primary text-slate-950 border-primary'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    Mark as {st}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setSelectedMessage(null)}
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
        title="Delete Message"
        message="Are you sure you want to delete this message?"
      />
    </div>
  );
};

export default MessagesAdmin;
