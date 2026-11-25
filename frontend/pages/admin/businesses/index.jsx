import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Store, PlusCircle, Search, Edit, Trash2, Star, MapPin, UploadCloud, FileSpreadsheet } from 'lucide-react';
import AdminLayout from '../../../src/components/layout/AdminLayout';
import BusinessBulkImportModal from '../../../src/components/admin/BusinessBulkImportModal';
import { apiFetch } from '../../../src/utils/api';
import { useToast } from '../../../src/context/ToastContext';

export default function AdminBusinessesPage() {
  const { addToast } = useToast();
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [importModalOpen, setImportModalOpen] = useState(false);

  const fetchBusinesses = async (targetPage = page, targetLimit = limit) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(targetPage));
      params.set('limit', String(targetLimit));
      if (search.trim()) params.set('search', search.trim());
      const res = await apiFetch(`/businesses/admin/list?${params.toString()}`);
      if (res && res.success && Array.isArray(res.data)) {
        setBusinesses(res.data);
        if (res.pagination) {
          setPagination(res.pagination);
        } else {
          setPagination({ page: targetPage, limit: targetLimit, total: res.data.length, totalPages: 1 });
        }
      } else if (res && Array.isArray(res)) {
        setBusinesses(res);
        setPagination({ page: 1, limit: targetLimit, total: res.length, totalPages: 1 });
      } else {
        setBusinesses([]);
      }
    } catch (err) {
      addToast(err.message, 'error');
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses(page, limit);
    if (typeof window !== 'undefined') {
      try {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      } catch (e) {
        window.scrollTo(0, 0);
      }
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
      const mainEl = document.querySelector('main');
      if (mainEl && mainEl.scrollTop > 0) mainEl.scrollTop = 0;
    }
  }, [page, limit]);

  const handleDelete = async (id, name) => {
    if (!confirm(`Permanently delete business "${name}"?`)) return;
    try {
      const res = await apiFetch(`/businesses/admin/delete/${id}`, { method: 'DELETE' });
      if (res.success) {
        addToast(res.message, 'success');
        fetchBusinesses();
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <AdminLayout title="Business Directory Management">
      <Head>
        <title>Manage Businesses — Adilabad App Admin</title>
      </Head>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-xl">
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">
              Businesses ({pagination.total || businesses.length})
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified local retail shops, clinics, restaurants, and commercial institutions in Adilabad.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setImportModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-sm font-bold border border-slate-700 shadow-md transition shrink-0"
            >
              <UploadCloud className="w-4 h-4 text-brand-400" />
              <span>Import Businesses</span>
            </button>

            <Link
              href="/admin/businesses/create"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold shadow-md shadow-brand-600/20 transition shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Business</span>
            </Link>
          </div>
        </div>

        {/* Search */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-sm flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setPage(1);
                  fetchBusinesses(1, limit);
                }
              }}
              placeholder="Search business name, phone, locality, city..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <button
            onClick={() => {
              setPage(1);
              fetchBusinesses(1, limit);
            }}
            className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-sm transition"
          >
            Search
          </button>
        </div>

        {/* Table */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm text-slate-300">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6">Business</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Locality / Area</th>
                  <th className="py-4 px-4">City / District</th>
                  <th className="py-4 px-4">Phone</th>
                  <th className="py-4 px-4">Rating</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {(Array.isArray(businesses) ? businesses : []).map((biz) => (
                  <tr key={biz.id} className="hover:bg-slate-800/60 transition">
                    <td className="py-4 px-6 font-bold text-white">
                      <Link href={`/businesses/${biz.slug}`} target="_blank" className="hover:text-brand-400 transition">
                        {biz.name}
                      </Link>
                      {biz.subcategory && (
                        <p className="text-[11px] font-normal text-slate-400">{biz.subcategory}</p>
                      )}
                    </td>
                    <td className="py-4 px-4 text-xs font-semibold text-slate-300">{biz.category_name}</td>
                    <td className="py-4 px-4 text-xs text-slate-400">
                      {biz.locality || biz.location_name || 'Adilabad'}
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-400">
                      {biz.city || 'Adilabad'}, {biz.district || 'Adilabad'}
                    </td>
                    <td className="py-4 px-4 text-xs font-mono text-slate-300">
                      {biz.phone || '—'}
                      {biz.alternate_phone && (
                        <span className="block text-[11px] text-slate-500 font-mono">
                          Alt: {biz.alternate_phone}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-xs font-bold text-amber-400 flex items-center gap-1 mt-3">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{biz.rating}</span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDelete(biz.id, biz.name)}
                        className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {pagination.total > 0 && (
            <div className="px-6 py-4 bg-slate-950/60 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-3">
                <span>
                  Showing{' '}
                  <strong className="text-white">
                    {(page - 1) * limit + 1}–{Math.min(page * limit, pagination.total)}
                  </strong>{' '}
                  of <strong className="text-white">{pagination.total}</strong> businesses
                </span>
                <select
                  value={limit}
                  onChange={(e) => {
                    const nextLimit = Number(e.target.value);
                    setLimit(nextLimit);
                    setPage(1);
                  }}
                  className="bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-brand-500"
                >
                  <option value={20}>20 / page</option>
                  <option value={50}>50 / page</option>
                  <option value={100}>100 / page</option>
                </select>
              </div>

              {pagination.totalPages > 1 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    disabled={page <= 1 || loading}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold disabled:opacity-40 transition"
                  >
                    ← Prev
                  </button>

                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pNum) => (
                    <button
                      key={pNum}
                      disabled={loading}
                      onClick={() => setPage(pNum)}
                      className={`w-8 h-8 rounded-lg font-bold transition ${
                        page === pNum
                          ? 'bg-brand-600 text-white shadow-sm'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      {pNum}
                    </button>
                  ))}

                  <button
                    disabled={page >= pagination.totalPages || loading}
                    onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold disabled:opacity-40 transition"
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bulk Import Modal */}
        <BusinessBulkImportModal
          isOpen={importModalOpen}
          onClose={() => setImportModalOpen(false)}
          onImportSuccess={() => fetchBusinesses(1, limit)}
        />
      </div>
    </AdminLayout>
  );
}
