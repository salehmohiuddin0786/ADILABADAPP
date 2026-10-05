import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Store, PlusCircle, Search, Edit, Trash2, Star, MapPin } from 'lucide-react';
import AdminLayout from '../../../src/components/layout/AdminLayout';
import { apiFetch } from '../../../src/utils/api';
import { useToast } from '../../../src/context/ToastContext';

export default function AdminBusinessesPage() {
  const { addToast } = useToast();
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      const q = search ? `?search=${encodeURIComponent(search)}` : '';
      const res = await apiFetch(`/businesses/admin/list${q}`);
      if (res.success) setBusinesses(res.data);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

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
        <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Businesses ({businesses.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified local retail shops, clinics, restaurants, and commercial institutions.
            </p>
          </div>

          <Link
            href="/admin/businesses/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold shadow-md shadow-brand-600/20 transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Business</span>
          </Link>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchBusinesses()}
              placeholder="Search business name, phone..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <button
            onClick={fetchBusinesses}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
          >
            Search
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                <tr>
                  <th className="py-4 px-6">Business</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Locality</th>
                  <th className="py-4 px-4">Phone</th>
                  <th className="py-4 px-4">Rating</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {businesses.map((biz) => (
                  <tr key={biz.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 px-6 font-bold text-slate-900">
                      <Link href={`/businesses/${biz.slug}`} target="_blank" className="hover:text-brand-600">
                        {biz.name}
                      </Link>
                    </td>
                    <td className="py-4 px-4 text-xs font-semibold text-slate-600">{biz.category_name}</td>
                    <td className="py-4 px-4 text-xs text-slate-500">{biz.location_name || 'Adilabad'}</td>
                    <td className="py-4 px-4 text-xs font-mono text-slate-600">{biz.phone}</td>
                    <td className="py-4 px-4 text-xs font-bold text-amber-600 flex items-center gap-1 mt-3">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{biz.rating}</span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDelete(biz.id, biz.name)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
