import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Layers,
  ShieldCheck,
  MapPin,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  DollarSign,
  ExternalLink,
  RefreshCw,
  Check,
  Trash2,
  Eye,
  Phone,
  MessageSquare,
  X,
  LayoutGrid,
  List,
  User,
  Sparkles,
  PlusCircle
} from 'lucide-react';
import AdminLayout from '../../src/components/layout/AdminLayout';
import { apiFetch } from '../../src/utils/api';
import { submissionService } from '../../src/shared/services/submissionService';
import { useToast } from '../../src/context/ToastContext';
import { handleImageError, getCategoryFallbackImage } from '../../src/utils/imageFallback';

export default function AdminRentalsManagementPage() {
  const { addToast } = useToast();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [inspectingRental, setInspectingRental] = useState(null);

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

  const categories = Array.from(new Set(rentals.map((r) => r.category_name).filter(Boolean)));

  const filtered = rentals.filter((r) => {
    if (statusFilter === 'published' && !(r.status === 'AVAILABLE' || r.status === 'PUBLISHED')) return false;
    if (statusFilter === 'pending' && r.status !== 'PENDING_APPROVAL') return false;
    if (statusFilter === 'escrow' && !(r.security_deposit && r.security_deposit > 0)) return false;

    if (categoryFilter !== 'all' && r.category_name !== categoryFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.title?.toLowerCase().includes(q) ||
        r.owner_name?.toLowerCase().includes(q) ||
        r.location?.toLowerCase().includes(q) ||
        r.category_name?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalCount = rentals.length;
  const availableCount = rentals.filter((r) => r.status === 'AVAILABLE' || r.status === 'PUBLISHED').length;
  const pendingCount = rentals.filter((r) => r.status === 'PENDING_APPROVAL').length;
  const escrowCount = rentals.filter((r) => (r.security_deposit || 0) > 0).length;

  return (
    <AdminLayout title="District Rental Equipment Management">
      <Head>
        <title>Rental Management — Super Admin Adilabad App</title>
      </Head>

      <div className="space-y-6">
        {/* Executive Action Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-xl">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-6 h-6 text-brand-400" />
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Rental Catalog & Fleet ({totalCount})
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              District-wide supervision over tools, farm tractors, cinema cameras, sound systems, and escrow settlements.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadRentals}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              title="Refresh Fleet"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-brand-400' : ''}`} />
            </button>
            <Link
              href="/rentals"
              target="_blank"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold shadow-md shadow-brand-600/20 transition shrink-0"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Public Fleet</span>
            </Link>
          </div>
        </div>

        {/* Status Metrics Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button
            onClick={() => setStatusFilter('all')}
            className={`p-4 rounded-2xl border text-left transition ${
              statusFilter === 'all'
                ? 'bg-slate-800/90 border-brand-500 text-white'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <span className="text-[10px] uppercase font-mono block">Total Fleet</span>
            <span className="text-xl font-black text-white mt-1 block">{totalCount}</span>
          </button>
          <button
            onClick={() => setStatusFilter('published')}
            className={`p-4 rounded-2xl border text-left transition ${
              statusFilter === 'published'
                ? 'bg-slate-800/90 border-emerald-500 text-white'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <span className="text-[10px] uppercase font-mono block">Available Live</span>
            <span className="text-xl font-black text-emerald-400 mt-1 block">{availableCount}</span>
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`p-4 rounded-2xl border text-left transition ${
              statusFilter === 'pending'
                ? 'bg-slate-800/90 border-amber-500 text-white'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <span className="text-[10px] uppercase font-mono block">Pending Review</span>
            <span className="text-xl font-black text-amber-400 mt-1 block">{pendingCount}</span>
          </button>
          <button
            onClick={() => setStatusFilter('escrow')}
            className={`p-4 rounded-2xl border text-left transition ${
              statusFilter === 'escrow'
                ? 'bg-slate-800/90 border-purple-500 text-white'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <span className="text-[10px] uppercase font-mono block">Escrow Protected</span>
            <span className="text-xl font-black text-purple-300 mt-1 block">{escrowCount} Items</span>
          </button>
        </div>

        {/* Filters bar with View Switcher */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 w-full md:w-auto flex-1">
            <div className="sm:col-span-5 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search equipment, owner, or mandal..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="sm:col-span-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="all">All Statuses</option>
                <option value="published">Available / Published</option>
                <option value="pending">Pending Approval</option>
                <option value="escrow">With Security Deposit</option>
              </select>
            </div>

            <div className="sm:col-span-4">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="all">All Equipment Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* View Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-slate-950/80 border border-slate-800 shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                viewMode === 'grid'
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Grid Cards Layout"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grid</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                viewMode === 'table'
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Table Rows Layout"
            >
              <List className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>
        </div>

        {/* Content Display: Grid Mode vs Table Mode */}
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-xs">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-brand-400" />
            Loading rental fleet...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-slate-400 text-xs bg-slate-900/50 border border-slate-800 rounded-3xl">
            <Layers className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            No rental items found matching the selected filter.
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900/90 rounded-3xl overflow-hidden border border-slate-800/90 hover:border-brand-500/50 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="relative aspect-[16/9] bg-slate-950 overflow-hidden">
                  <img
                    src={item.media?.[0]?.media_url || item.image_url || getCategoryFallbackImage('rentals', item.title)}
                    alt={item.title}
                    onError={(e) => handleImageError(e, 'rentals', item.title)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full bg-slate-900/90 backdrop-blur-md text-white text-[11px] font-bold border border-slate-700/60 font-mono">
                      {item.category_name}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${
                        item.status === 'AVAILABLE' || item.status === 'PUBLISHED'
                          ? 'bg-emerald-950/90 text-emerald-300 border-emerald-700'
                          : item.status === 'PENDING_APPROVAL'
                          ? 'bg-amber-950/90 text-amber-300 border-amber-700'
                          : 'bg-rose-950/90 text-rose-300 border-rose-700'
                      }`}
                    >
                      {item.status || 'AVAILABLE'}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 px-3 py-1 rounded-xl bg-slate-900/95 backdrop-blur-md text-emerald-400 text-xs font-black border border-slate-700 shadow-md">
                    ₹{item.daily_rate}/day
                  </div>
                </div>

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="font-bold text-white text-sm line-clamp-1 group-hover:text-brand-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {item.description || `Professional rental equipment available in ${item.location}. Instant booking with secure deposit.`}
                    </p>

                    <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </div>
                      {item.security_deposit > 0 && (
                        <span className="font-mono text-amber-300 text-[11px] shrink-0 font-bold">
                          Deposit: ₹{item.security_deposit}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 text-[11px] text-slate-400 border-t border-slate-800/60">
                      <div className="flex items-center gap-2 truncate">
                        <User className="w-3 h-3 text-slate-500 shrink-0" />
                        <span className="truncate text-white font-medium">{item.owner_name}</span>
                      </div>
                      <span className="font-mono text-slate-400 shrink-0">{item.owner_phone || 'Direct Merchant'}</span>
                    </div>
                  </div>

                  <div className="pt-3 flex items-center justify-between border-t border-slate-800/80 gap-2">
                    <button
                      onClick={() => setInspectingRental(item)}
                      className="px-3 py-1.5 rounded-xl bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 border border-brand-500/30 text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>

                    <div className="flex items-center gap-1.5">
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Table View */
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
                            src={item.media?.[0]?.media_url || item.image_url || getCategoryFallbackImage('rentals', item.title)}
                            alt={item.title}
                            onError={(e) => handleImageError(e, 'rentals', item.title)}
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
                          <button
                            onClick={() => setInspectingRental(item)}
                            className="p-1.5 rounded-lg text-slate-300 hover:text-brand-300 hover:bg-slate-800 transition"
                            title="Inspect Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
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
        )}

        {/* Modal: Full Rental Fleet Inspection */}
        {inspectingRental && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
              {/* Header */}
              <div className="p-6 border-b border-slate-800 flex items-start justify-between bg-slate-950/70">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-brand-950 text-brand-400 border border-brand-800 text-[10px] font-mono font-bold">
                      RENT #{inspectingRental.id}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                        inspectingRental.status === 'AVAILABLE' || inspectingRental.status === 'PUBLISHED'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                          : inspectingRental.status === 'PENDING_APPROVAL'
                          ? 'bg-amber-950 text-amber-300 border-amber-800'
                          : 'bg-rose-950 text-rose-300 border-rose-800'
                      }`}
                    >
                      {inspectingRental.status || 'AVAILABLE'}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-white">{inspectingRental.title}</h3>
                </div>
                <button
                  onClick={() => setInspectingRental(null)}
                  className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1">
                {/* Image */}
                <div className="relative aspect-[16/8] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                  <img
                    src={inspectingRental.media?.[0]?.media_url || inspectingRental.image_url || getCategoryFallbackImage('rentals', inspectingRental.title)}
                    alt={inspectingRental.title}
                    onError={(e) => handleImageError(e, 'rentals', inspectingRental.title)}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 left-3 px-3 py-1 rounded-xl bg-slate-900/90 backdrop-blur-md text-white text-xs font-bold border border-slate-700">
                    Category: {inspectingRental.category_name || 'Fleet Equipment'}
                  </div>
                </div>

                {/* KPI Metrics Matrix */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">Daily Rental</span>
                    <span className="text-sm font-black text-brand-400 mt-1 block">₹{inspectingRental.daily_rate}/day</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">Security Deposit</span>
                    <span className="text-xs font-bold text-amber-300 mt-1 block">₹{inspectingRental.security_deposit || 0}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">Condition</span>
                    <span className="text-xs font-bold text-emerald-400 mt-1 block capitalize">
                      {inspectingRental.item_condition || inspectingRental.specs?.condition || 'Like New'}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">Location</span>
                    <span className="text-xs font-bold text-white mt-1 block truncate">
                      {inspectingRental.location || 'Adilabad Town'}
                    </span>
                  </div>
                </div>

                {/* Merchant / Owner Profile */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-brand-950 text-brand-400 border border-brand-800 flex items-center justify-center font-black text-sm">
                      {inspectingRental.owner_name?.charAt(0) || 'R'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-white text-sm">{inspectingRental.owner_name}</p>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
                          Verified Fleet Owner
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">{inspectingRental.owner_phone || '+91 98480 22334'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${inspectingRental.owner_phone || '+91 98480 22334'}`}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5 text-brand-400" />
                      <span>Call</span>
                    </a>
                    <a
                      href={`https://wa.me/${(inspectingRental.owner_phone || '9848022334').replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Equipment Specifications & Escrow Terms</h4>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80 whitespace-pre-line">
                    {inspectingRental.description || 'Professional rental equipment maintained and inspected before dispatch.'}
                  </p>
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="p-5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3">
                <button
                  onClick={() => {
                    handleDelete(inspectingRental);
                    setInspectingRental(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800 text-xs font-bold transition"
                >
                  Delete Rental
                </button>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/rentals/${inspectingRental.slug || inspectingRental.id}`}
                    target="_blank"
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View Live Listing</span>
                  </Link>

                  {inspectingRental.status === 'PENDING_APPROVAL' && (
                    <button
                      onClick={() => {
                        handleApprove(inspectingRental);
                        setInspectingRental(null);
                      }}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve & Publish</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
