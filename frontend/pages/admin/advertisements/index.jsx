import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Megaphone,
  PlusCircle,
  Search,
  Filter,
  Edit,
  Trash2,
  Sparkles,
  Eye,
  CheckCircle,
  XCircle,
  Archive,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Phone,
  MessageSquare,
  MapPin,
  X,
  Tag,
  LayoutGrid,
  List,
  RefreshCw
} from 'lucide-react';
import AdminLayout from '../../../src/components/layout/AdminLayout';
import { apiFetch } from '../../../src/utils/api';
import { useToast } from '../../../src/context/ToastContext';
import { handleImageError, getCategoryFallbackImage } from '../../../src/utils/imageFallback';

export default function AdminAdvertisementsPage() {
  const { addToast } = useToast();
  const [ads, setAds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, total: 0 });
  const [inspectingAd, setInspectingAd] = useState(null);

  const fetchAds = async (p = 1) => {
    setLoading(true);
    setPage(p);
    const query = new URLSearchParams();
    if (search.trim()) query.set('search', search.trim());
    if (statusFilter) query.set('status', statusFilter);
    if (categoryFilter) query.set('category', categoryFilter);
    query.set('page', p.toString());
    query.set('limit', '15');

    try {
      const res = await apiFetch(`/advertisements/admin/list?${query.toString()}`);
      if (res && res.success && Array.isArray(res.data)) {
        setAds(res.data);
        if (res.pagination) setPagination(res.pagination);
      } else if (res && Array.isArray(res)) {
        setAds(res);
      } else {
        setAds([]);
      }
    } catch (err) {
      addToast(err.message, 'error');
      setAds([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    apiFetch('/categories')
      .then((res) => {
        if (res && res.success && Array.isArray(res.data)) {
          setCategories(res.data);
        } else if (res && Array.isArray(res)) {
          setCategories(res);
        }
      })
      .catch(() => {});
    fetchAds(1);
  }, [statusFilter, categoryFilter]);

  const handleToggleStatus = async (id, newStatus) => {
    try {
      const res = await apiFetch(`/advertisements/admin/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });
      if (res.success) {
        addToast(res.message, 'success');
        fetchAds(page);
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleToggleFeatured = async (id, currentFeatured) => {
    try {
      const res = await apiFetch(`/advertisements/admin/${id}/feature`, {
        method: 'PATCH',
        body: JSON.stringify({ is_featured: currentFeatured ? 0 : 1 })
      });
      if (res.success) {
        addToast(res.message, 'success');
        fetchAds(page);
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Are you sure you want to permanently delete advertisement "${title}"?`)) {
      return;
    }
    try {
      const res = await apiFetch(`/advertisements/admin/delete/${id}`, {
        method: 'DELETE'
      });
      if (res.success) {
        addToast(res.message, 'success');
        fetchAds(page);
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <AdminLayout title="Advertisement Management">
      <Head>
        <title>Manage Advertisements — Adilabad App Admin</title>
      </Head>

      <div className="space-y-6">
        {/* Action Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-xl">
          <div>
            <div className="flex items-center gap-2">
              <Megaphone className="w-6 h-6 text-brand-400" />
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Advertisements ({pagination.total})
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Only approved & published advertisements are visible on the public website.
            </p>
          </div>

          <Link
            href="/admin/advertisements/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold shadow-md shadow-brand-600/20 transition shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Advertisement</span>
          </Link>
        </div>

        {/* Status Metrics Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button
            onClick={() => { setStatusFilter(''); fetchAds(1); }}
            className={`p-4 rounded-2xl border text-left transition ${
              statusFilter === ''
                ? 'bg-slate-800/90 border-brand-500 text-white'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <span className="text-[10px] uppercase font-mono block">All Advertisements</span>
            <span className="text-xl font-black text-white mt-1 block">{pagination.total}</span>
          </button>
          <button
            onClick={() => { setStatusFilter('published'); fetchAds(1); }}
            className={`p-4 rounded-2xl border text-left transition ${
              statusFilter === 'published'
                ? 'bg-slate-800/90 border-emerald-500 text-white'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <span className="text-[10px] uppercase font-mono block">Published Live</span>
            <span className="text-xl font-black text-emerald-400 mt-1 block">
              {(Array.isArray(ads) ? ads : []).filter((a) => a.status === 'published').length || 'Active'}
            </span>
          </button>
          <button
            onClick={() => { setStatusFilter('draft'); fetchAds(1); }}
            className={`p-4 rounded-2xl border text-left transition ${
              statusFilter === 'draft'
                ? 'bg-slate-800/90 border-amber-500 text-white'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <span className="text-[10px] uppercase font-mono block">Draft / Review</span>
            <span className="text-xl font-black text-amber-400 mt-1 block">
              {(Array.isArray(ads) ? ads : []).filter((a) => a.status === 'draft').length || 0}
            </span>
          </button>
          <button
            onClick={() => {}}
            className="p-4 rounded-2xl border text-left bg-slate-900/60 border-slate-800 text-slate-400"
          >
            <span className="text-[10px] uppercase font-mono block">Featured Spotlight</span>
            <span className="text-xl font-black text-amber-300 mt-1 block">
              {(Array.isArray(ads) ? ads : []).filter((a) => a.is_featured === 1).length || 0} Ads
            </span>
          </button>
        </div>

        {/* Filters bar with View Switcher */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 w-full md:w-auto flex-1">
            <div className="sm:col-span-5 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchAds(1)}
                placeholder="Search title, business, phone..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="sm:col-span-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="">All Statuses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
                <option value="expired">Expired</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="sm:col-span-4 flex items-center gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="">All Categories</option>
                {(Array.isArray(categories) ? categories : []).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <button
                onClick={() => fetchAds(1)}
                className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition shadow-sm"
              >
                Filter
              </button>
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

        {/* Content View: Grid Cards vs Data Table */}
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-xs">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-brand-400" />
            Loading advertisements...
          </div>
        ) : (Array.isArray(ads) ? ads : []).length === 0 ? (
          <div className="py-20 text-center text-slate-400 text-xs bg-slate-900/50 border border-slate-800 rounded-3xl">
            <Megaphone className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            No advertisements found matching the filters.
          </div>
        ) : viewMode === 'grid' ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {(Array.isArray(ads) ? ads : []).map((ad) => (
                <div
                  key={ad.id}
                  className="bg-slate-900/90 rounded-3xl overflow-hidden border border-slate-800/90 hover:border-brand-500/50 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="relative aspect-[16/9] bg-slate-950 overflow-hidden">
                    <img
                      src={ad.primary_image || getCategoryFallbackImage(ad.category_name, ad.title)}
                      alt={ad.title}
                      onError={(e) => handleImageError(e, ad.category_name, ad.title)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full bg-slate-900/90 backdrop-blur-md text-white text-[11px] font-bold border border-slate-700/60 font-mono">
                        {ad.category_name}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      {ad.is_featured === 1 && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-950/90 text-amber-300 border border-amber-700 text-[10px] font-bold">
                          ★ Featured
                        </span>
                      )}
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${
                          ad.status === 'published'
                            ? 'bg-emerald-950/90 text-emerald-300 border-emerald-700'
                            : ad.status === 'draft'
                            ? 'bg-slate-900/90 text-slate-300 border-slate-700'
                            : 'bg-rose-950/90 text-rose-300 border-rose-700'
                        }`}
                      >
                        {ad.status}
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3 px-3 py-1 rounded-xl bg-slate-900/95 backdrop-blur-md text-brand-400 text-xs font-black border border-slate-700 shadow-md">
                      {ad.price_display || '—'}
                    </div>
                  </div>

                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <Link
                        href={`/advertisements/${ad.slug}`}
                        target="_blank"
                        className="font-bold text-white text-sm line-clamp-1 group-hover:text-brand-300 transition-colors block"
                      >
                        {ad.title}
                      </Link>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {ad.description || `${ad.title} located at ${ad.business_name}, ${ad.location_name || 'Adilabad'}`}
                      </p>

                      <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate">{ad.location_name || 'Adilabad'}</span>
                      </div>

                      <div className="flex items-center justify-between pt-2 text-[11px] text-slate-400 border-t border-slate-800/60">
                        <span className="truncate text-white font-medium">{ad.business_name}</span>
                        <span className="font-mono text-slate-400 shrink-0">{ad.views || 0} views • {ad.leads_count || 0} leads</span>
                      </div>
                    </div>

                    <div className="pt-3 flex items-center justify-between border-t border-slate-800/80 gap-2">
                      <button
                        onClick={() => setInspectingAd(ad)}
                        className="px-3 py-1.5 rounded-xl bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 border border-brand-500/30 text-xs font-bold transition flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleToggleFeatured(ad.id, ad.is_featured)}
                          title="Toggle Featured"
                          className={`p-1.5 rounded-lg border transition ${
                            ad.is_featured === 1
                              ? 'bg-amber-950/60 text-amber-300 border-amber-800/60'
                              : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                          }`}
                        >
                          <Sparkles className="w-3.5 h-3.5 fill-current" />
                        </button>
                        <Link
                          href={`/admin/advertisements/${ad.id}/edit`}
                          className="p-1.5 rounded-lg text-slate-300 hover:text-brand-300 hover:bg-slate-800 transition"
                          title="Edit Advertisement"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(ad.id, ad.title)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition"
                          title="Delete Advertisement"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination for Grid */}
            {pagination.totalPages > 1 && (
              <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  Page {page} of {pagination.totalPages} ({pagination.total} ads)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => fetchAds(page - 1)}
                    className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-200 disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <button
                    disabled={page >= pagination.totalPages}
                    onClick={() => fetchAds(page + 1)}
                    className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-200 disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Data Table */
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-left text-sm text-slate-300">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6">Advertisement</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Price</th>
                  <th className="py-4 px-4">Featured</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4">Views / Leads</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      Loading advertisements...
                    </td>
                  </tr>
                ) : (Array.isArray(ads) ? ads : []).length > 0 ? (
                  (Array.isArray(ads) ? ads : []).map((ad) => (
                    <tr key={ad.id} className="hover:bg-slate-800/60 transition">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={ad.primary_image || getCategoryFallbackImage(ad.category_name, ad.title)}
                            alt={ad.title}
                            onError={(e) => handleImageError(e, ad.category_name, ad.title)}
                            className="w-12 h-12 rounded-xl object-cover shrink-0 bg-slate-800 border border-slate-700/80"
                          />
                          <div className="min-w-0 max-w-xs">
                            <Link
                              href={`/advertisements/${ad.slug}`}
                              target="_blank"
                              className="font-bold text-white hover:text-brand-400 transition truncate block"
                            >
                              {ad.title}
                            </Link>
                            <p className="text-xs text-slate-400 truncate">
                              {ad.business_name} • {ad.location_name || 'Adilabad'}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-xs font-semibold text-slate-300">
                        {ad.category_name}
                      </td>

                      <td className="py-4 px-4 text-xs font-bold text-brand-400">
                        {ad.price_display || '—'}
                      </td>

                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleToggleFeatured(ad.id, ad.is_featured)}
                          className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 border ${
                            ad.is_featured === 1
                              ? 'bg-amber-950/60 text-amber-300 border-amber-800/60'
                              : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                          }`}
                          title="Toggle Featured"
                        >
                          <Sparkles className="w-3.5 h-3.5 fill-current" />
                          <span>{ad.is_featured === 1 ? 'Yes' : 'No'}</span>
                        </button>
                      </td>

                      <td className="py-4 px-4">
                        <select
                          value={ad.status}
                          onChange={(e) => handleToggleStatus(ad.id, e.target.value)}
                          className={`text-xs font-bold px-2.5 py-1 rounded-full border cursor-pointer ${
                            ad.status === 'published'
                              ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60'
                              : ad.status === 'draft'
                              ? 'bg-slate-800 text-slate-300 border-slate-700'
                              : ad.status === 'expired'
                              ? 'bg-rose-950/60 text-rose-300 border-rose-800/60'
                              : 'bg-amber-950/60 text-amber-300 border-amber-800/60'
                          }`}
                        >
                          <option value="published" className="bg-slate-900 text-white">Published</option>
                          <option value="draft" className="bg-slate-900 text-white">Draft</option>
                          <option value="scheduled" className="bg-slate-900 text-white">Scheduled</option>
                          <option value="expired" className="bg-slate-900 text-white">Expired</option>
                          <option value="archived" className="bg-slate-900 text-white">Archived</option>
                        </select>
                      </td>

                      <td className="py-4 px-4 text-xs text-slate-400">
                        <span className="font-bold text-white">{ad.views_count}</span> views •{' '}
                        <span className="font-bold text-emerald-400">{ad.clicks_count}</span> clicks
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setInspectingAd(ad)}
                            className="p-2 rounded-lg text-slate-300 hover:text-brand-300 hover:bg-slate-800 transition"
                            title="Inspect Complete Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <Link
                            href={`/admin/advertisements/${ad.id}/edit`}
                            className="p-2 rounded-lg text-slate-300 hover:text-brand-300 hover:bg-slate-800 transition"
                            title="Edit Advertisement"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(ad.id, ad.title)}
                            className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition"
                            title="Delete Advertisement"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      No advertisements found matching the filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">
                Page {page} of {pagination.totalPages} ({pagination.total} ads)
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => fetchAds(page - 1)}
                  className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-200 disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  disabled={page >= pagination.totalPages}
                  onClick={() => fetchAds(page + 1)}
                  className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-200 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
        )}

        {/* Modal: Full Advertisement Inspection */}
        {inspectingAd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
              {/* Header */}
              <div className="p-6 border-b border-slate-800 flex items-start justify-between bg-slate-950/70">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-brand-950 text-brand-400 border border-brand-800 text-[10px] font-mono font-bold">
                      AD #{inspectingAd.id}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                        inspectingAd.status === 'published'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                          : inspectingAd.status === 'draft'
                          ? 'bg-slate-800 text-slate-300 border-slate-700'
                          : 'bg-rose-950 text-rose-300 border-rose-800'
                      }`}
                    >
                      {inspectingAd.status}
                    </span>
                    {inspectingAd.is_featured === 1 && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-bold">
                        ★ Featured Ad
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-black text-white">{inspectingAd.title}</h3>
                </div>
                <button
                  onClick={() => setInspectingAd(null)}
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
                    src={inspectingAd.primary_image || inspectingAd.images?.[0]?.image_url || getCategoryFallbackImage(inspectingAd.category_name, inspectingAd.title)}
                    alt={inspectingAd.title}
                    onError={(e) => handleImageError(e, inspectingAd.category_name, inspectingAd.title)}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 left-3 px-3 py-1 rounded-xl bg-slate-900/90 backdrop-blur-md text-white text-xs font-bold border border-slate-700">
                    Category: {inspectingAd.category_name || 'Classified Ad'}
                  </div>
                </div>

                {/* KPI Metrics Matrix */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">Listed Price</span>
                    <span className="text-sm font-black text-brand-400 mt-1 block">
                      {inspectingAd.price ? `₹${Number(inspectingAd.price).toLocaleString('en-IN')}` : 'Contact for Price'}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">Location</span>
                    <span className="text-xs font-bold text-white mt-1 block truncate">
                      {inspectingAd.location_name || 'Adilabad Town'}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">Total Views</span>
                    <span className="text-xs font-bold text-emerald-400 mt-1 block">{inspectingAd.views_count || 0} Views</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">Lead Inquiries</span>
                    <span className="text-xs font-bold text-amber-400 mt-1 block">{inspectingAd.clicks_count || 0} Inquiries</span>
                  </div>
                </div>

                {/* Business / Seller Profile */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-brand-950 text-brand-400 border border-brand-800 flex items-center justify-center font-black text-sm">
                      {inspectingAd.business_name?.charAt(0) || inspectingAd.user_name?.charAt(0) || 'A'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-white text-sm">{inspectingAd.business_name || inspectingAd.user_name || 'Advertiser'}</p>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
                          Verified
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">{inspectingAd.user_phone || inspectingAd.phone || 'Phone on file'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {(inspectingAd.user_phone || inspectingAd.phone) && (
                      <>
                        <a
                          href={`tel:${inspectingAd.user_phone || inspectingAd.phone}`}
                          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center gap-1.5"
                        >
                          <Phone className="w-3.5 h-3.5 text-brand-400" />
                          <span>Call</span>
                        </a>
                        <a
                          href={`https://wa.me/${(inspectingAd.user_phone || inspectingAd.phone || '').replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      </>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Advertisement Copy & Details</h4>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80 whitespace-pre-line">
                    {inspectingAd.description || 'No detailed ad description provided.'}
                  </p>
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="p-5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3">
                <button
                  onClick={() => {
                    handleDelete(inspectingAd.id, inspectingAd.title);
                    setInspectingAd(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800 text-xs font-bold transition"
                >
                  Delete Ad
                </button>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/advertisements/${inspectingAd.slug || inspectingAd.id}`}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View Public Page</span>
                  </Link>

                  <Link
                    href={`/admin/advertisements/${inspectingAd.id}/edit`}
                    className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition shadow flex items-center gap-1.5"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit Ad</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
