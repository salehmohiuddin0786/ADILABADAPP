import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Layers, ShieldCheck, MapPin, Search, Filter, CheckCircle2, Clock, DollarSign, ExternalLink, RefreshCw, Check, Trash2 } from 'lucide-react';
import AdminLayout from '../../src/components/layout/AdminLayout';
import { apiFetch } from '../../src/utils/api';
import { submissionService } from '../../src/shared/services/submissionService';
import { useToast } from '../../src/context/ToastContext';

export default function AdminRentalsManagementPage() {
  const { addToast } = useToast();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const loadRentals = async () => {
    setLoading(true);
    try {
      // 1. Fetch from unified submission service
      const subRes = await submissionService.getSubmissions({ module: 'rentals' });
      const subItems = Array.isArray(subRes?.data) ? subRes.data : [];

      // 2. Fetch from apiFetch (which queries mock / real backend)
      const res = await apiFetch('/api/v1/rentals');
      let items = Array.isArray(res?.data) ? res.data : [];

      if (typeof window !== 'undefined') {
        try {
          const stored = JSON.parse(localStorage.getItem('adilabad_rentals') || '[]');
          if (Array.isArray(stored) && stored.length > 0) {
            const existing = new Set(items.map((i) => i.id));
            const missing = stored.filter((s) => !existing.has(s.id));
            items = [...missing, ...items];
          }
        } catch (e) {}
      }

      // Merge and sync statuses
      const mergedMap = new Map();
      items.forEach((item) => mergedMap.set(item.title, item));
      subItems.forEach((sub) => {
        const existing = mergedMap.get(sub.title);
        if (existing) {
          mergedMap.set(sub.title, {
            ...existing,
            status: sub.status === 'PUBLISHED' ? (existing.status || 'AVAILABLE') : sub.status,
            submission_id: sub.id
          });
        } else {
          mergedMap.set(sub.title, {
            id: sub.id,
            submission_id: sub.id,
            title: sub.title,
            category_name: sub.category,
            daily_rate: sub.daily_rate || 1000,
            security_deposit: sub.security_deposit || 0,
            location: sub.location,
            status: sub.status,
            owner_name: sub.owner_name,
            media: [{ media_url: sub.image_url }]
          });
        }
      });

      setRentals(Array.from(mergedMap.values()));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRentals();
    const handleSync = () => loadRentals();
    if (typeof window !== 'undefined') {
      window.addEventListener('adilabad_submissions_updated', handleSync);
      return () => window.removeEventListener('adilabad_submissions_updated', handleSync);
    }
  }, []);

  const handleApprove = async (item) => {
    const subId = item.submission_id || item.id;
    await submissionService.approveAndPublish(subId);
    addToast(`"${item.title}" approved and published to the live marketplace fleet!`, 'success');
    loadRentals();
  };

  const handleDelete = async (item) => {
    if (!confirm(`Delete rental listing "${item.title}"?`)) return;
    const subId = item.submission_id || item.id;
    await submissionService.deleteSubmission(subId);
    addToast(`"${item.title}" removed.`, 'info');
    loadRentals();
  };

  const filtered = rentals.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.title?.toLowerCase().includes(q) ||
      r.owner_name?.toLowerCase().includes(q) ||
      r.location?.toLowerCase().includes(q)
    );
  });

  return (
    <AdminLayout title="District Rental Equipment Management">
      <Head>
        <title>Rental Management — Super Admin Adilabad App</title>
      </Head>

      <div className="space-y-6">
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-6 h-6 text-brand-400" />
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Rental Catalog & Booking Fleet
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              District-wide supervision over tools, tractors, cameras, sound systems, and escrow deposit settlements.
            </p>
          </div>

          <button
            onClick={loadRentals}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            title="Refresh Rentals"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-brand-400' : ''}`} />
          </button>
        </div>

        {/* Search */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search rental title, owner, or mandal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
            />
          </div>
          <span className="text-xs text-slate-400">Total Fleet: <strong className="text-white">{filtered.length}</strong> items</span>
        </div>

        {/* Table */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-mono font-bold text-[10px]">
                <tr>
                  <th className="py-3.5 px-6">Equipment</th>
                  <th className="py-3.5 px-4">Owner / Merchant</th>
                  <th className="py-3.5 px-4">Daily Rate</th>
                  <th className="py-3.5 px-4">Deposit</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/50 transition">
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.media?.[0]?.media_url || item.image_url || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=100'}
                          alt={item.title}
                          className="w-10 h-10 rounded-xl object-cover bg-slate-800 border border-slate-700 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-white text-xs">{item.title}</p>
                          <span className="text-[10px] text-slate-400 font-mono">{item.category_name}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-300">{item.owner_name}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">₹{item.daily_rate}/day</td>
                    <td className="py-3.5 px-4 font-mono text-amber-300">₹{item.security_deposit || 0}</td>
                    <td className="py-3.5 px-4 text-slate-400">{item.location}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                          item.status === 'AVAILABLE' || item.status === 'PUBLISHED'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : item.status === 'PENDING_APPROVAL'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {item.status || 'AVAILABLE'}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {item.status === 'PENDING_APPROVAL' && (
                          <button
                            onClick={() => handleApprove(item)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                        )}
                        <Link
                          href={`/rentals/${item.slug || item.id}`}
                          target="_blank"
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-brand-400 font-bold text-xs inline-flex items-center gap-1 border border-slate-700"
                        >
                          <span>Live</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                        <button
                          onClick={() => handleDelete(item)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
