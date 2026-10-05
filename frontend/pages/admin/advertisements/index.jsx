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
  ChevronRight
} from 'lucide-react';
import AdminLayout from '../../../src/components/layout/AdminLayout';
import { apiFetch } from '../../../src/utils/api';
import { useToast } from '../../../src/context/ToastContext';

export default function AdminAdvertisementsPage() {
  const { addToast } = useToast();
  const [ads, setAds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, total: 0 });

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
      if (res.success) {
        setAds(res.data);
        setPagination(res.pagination);
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    apiFetch('/categories')
      .then((res) => {
        if (res.success) setCategories(res.data);
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Advertisements ({pagination.total})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Only published advertisements are visible on the public website.
            </p>
          </div>

          <Link
            href="/admin/advertisements/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold shadow-md shadow-brand-600/20 transition shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Advertisement</span>
          </Link>
        </div>

        {/* Filters bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchAds(1)}
              placeholder="Search title, business, phone..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="expired">Expired</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-1">
            <button
              onClick={() => fetchAds(1)}
              className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition"
            >
              Filter
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
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
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      Loading advertisements...
                    </td>
                  </tr>
                ) : ads.length > 0 ? (
                  ads.map((ad) => (
                    <tr key={ad.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={ad.primary_image || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=150&q=80'}
                            alt={ad.title}
                            className="w-12 h-12 rounded-xl object-cover shrink-0 bg-slate-100"
                          />
                          <div className="min-w-0 max-w-xs">
                            <Link
                              href={`/advertisements/${ad.slug}`}
                              target="_blank"
                              className="font-bold text-slate-900 hover:text-brand-600 transition truncate block"
                            >
                              {ad.title}
                            </Link>
                            <p className="text-xs text-slate-500 truncate">
                              {ad.business_name} • {ad.location_name || 'Adilabad'}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-xs font-semibold text-slate-600">
                        {ad.category_name}
                      </td>

                      <td className="py-4 px-4 text-xs font-bold text-slate-900">
                        {ad.price_display || '—'}
                      </td>

                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleToggleFeatured(ad.id, ad.is_featured)}
                          className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                            ad.is_featured === 1
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-400 hover:text-slate-700'
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
                          className={`text-xs font-bold px-2.5 py-1 rounded-full border-0 focus:ring-2 focus:ring-brand-500 cursor-pointer ${
                            ad.status === 'published'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ad.status === 'draft'
                              ? 'bg-slate-100 text-slate-700'
                              : ad.status === 'expired'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          <option value="published">Published</option>
                          <option value="draft">Draft</option>
                          <option value="scheduled">Scheduled</option>
                          <option value="expired">Expired</option>
                          <option value="archived">Archived</option>
                        </select>
                      </td>

                      <td className="py-4 px-4 text-xs text-slate-600">
                        <span className="font-bold text-slate-800">{ad.views_count}</span> views •{' '}
                        <span className="font-bold text-emerald-600">{ad.clicks_count}</span> clicks
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/advertisements/${ad.id}/edit`}
                            className="p-2 rounded-lg text-slate-600 hover:text-brand-600 hover:bg-brand-50 transition"
                            title="Edit Advertisement"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(ad.id, ad.title)}
                            className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
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
            <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                Page {page} of {pagination.totalPages} ({pagination.total} ads)
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => fetchAds(page - 1)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  disabled={page >= pagination.totalPages}
                  onClick={() => fetchAds(page + 1)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
