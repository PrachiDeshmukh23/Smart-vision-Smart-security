import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package, FolderTree, MessageSquare, Users, Percent,
  Download, Mail, Eye, ChevronRight, CheckCircle2, Clock, ShieldCheck
} from 'lucide-react';
import api from '../../api/axios';
import StatCard from '../../components/admin/StatCard';
import Loader from '../../components/ui/Loader';
import Badge from '../../components/ui/Badge';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const res = await api.get('/dashboard/metrics');
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMetrics();
  }, []);

  if (loading) return <Loader text="Loading dashboard metrics..." />;

  const m = data?.metrics || {};

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-[#071322] border border-blue-500/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Management Console</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">GS Vision Overview</h2>
          <p className="text-xs text-slate-300">Live summary of products, active promotions, and customer enquiries.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-xl text-xs shadow-md"
          >
            + Add Product
          </Link>
          <Link
            to="/admin/offers"
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs border border-slate-700"
          >
            + New Offer
          </Link>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Total Products" value={m.total_products || 0} icon={Package} color="cyan" subtitle="In active catalogue" />
        <StatCard title="New Enquiries" value={m.new_enquiries || 0} icon={MessageSquare} color="amber" subtitle="Pending sales follow-up" />
        <StatCard title="Dealer Applications" value={m.pending_dealers || 0} icon={Users} color="emerald" subtitle="Awaiting approval" />
        <StatCard title="Active Offers" value={m.active_offers || 0} icon={Percent} color="blue" subtitle="Running promotional banners" />
      </div>

      {/* Secondary Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard title="Total Categories" value={m.total_categories || 0} icon={FolderTree} color="purple" />
        <StatCard title="Brochure Downloads" value={m.total_downloads || 0} icon={Download} color="cyan" />
        <StatCard title="Unread Messages" value={m.unread_messages || 0} icon={Mail} color="rose" />
      </div>

      {/* Recent Enquiries & Dealer Applications Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Enquiries */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <span>Recent Product Enquiries</span>
            </h3>
            <Link to="/admin/enquiries" className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1">
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {data?.recent_enquiries && data.recent_enquiries.length > 0 ? (
            <div className="divide-y divide-slate-800/60">
              {data.recent_enquiries.map((enq) => (
                <div key={enq.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-white">{enq.name}</h4>
                    <p className="text-slate-400">{enq.mobile} • {enq.city || 'N/A'}</p>
                    {enq.product_name && <p className="text-cyan-400 mt-0.5">{enq.product_name}</p>}
                  </div>
                  <Badge variant={enq.status === 'New' ? 'orange' : 'neutral'}>
                    {enq.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center py-6">No enquiries received yet.</p>
          )}
        </div>

        {/* Recent Dealer Applications */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400" />
              <span>Recent Dealer Applications</span>
            </h3>
            <Link to="/admin/dealers" className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1">
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {data?.recent_dealers && data.recent_dealers.length > 0 ? (
            <div className="divide-y divide-slate-800/60">
              {data.recent_dealers.map((dealer) => (
                <div key={dealer.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-white">{dealer.business_name}</h4>
                    <p className="text-slate-400">{dealer.name} • {dealer.city}, {dealer.state}</p>
                    <p className="text-slate-500">{dealer.mobile}</p>
                  </div>
                  <Badge variant={dealer.status === 'Pending' ? 'amber' : 'success'}>
                    {dealer.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center py-6">No dealer applications yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
