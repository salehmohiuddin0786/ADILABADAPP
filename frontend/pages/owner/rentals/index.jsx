import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Layers,
  PlusCircle,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Trash2,
  RefreshCw,
  Search,
  Sparkles,
  MapPin,
  Eye
} from 'lucide-react';
import OwnerLayout from '../../../src/panels/owner-panel/OwnerLayout';
import { useToast } from '../../../src/context/ToastContext';
import { apiFetch } from '../../../src/utils/api';
import { submissionService } from '../../../src/shared/services/submissionService';

export default function OwnerRentalsListPage() {
  const { addToast } = useToast();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const loadRentals = async () => {
    setLoading(true);
    try {
      // 1. Fetch from unified submission service for latest approval statuses
      const subRes = await submissionService.getSubmissions({ module: 'rentals' });
      const subItems = Array.isArray(subRes?.data) ? subRes.data : [];

      // 2. Fetch from apiFetch (which queries mock / real backend)
      const res = await apiFetch('/api/v1/rentals');
      let items = Array.isArray(res?.data) ? res.data : [];

      // 3. Ensure local storage items are included if not present
      if (typeof window !== 'undefined') {
        try {
          const stored = JSON.parse(localStorage.getItem('adilabad_rentals') || '[]');
          if (Array.isArray(stored) && stored.length > 0) {
            const existingIds = new Set(items.map((i) => i.id));
            const missing = stored.filter((s) => !existingIds.has(s.id));
            items = [...missing, ...items];
          }
        } catch (e) {}
      }

      // 4. Merge submissions with rental fleet to reflect true statuses (e.g. PENDING_APPROVAL / PUBLISHED)
      const mergedMap = new Map();
      items.forEach((item) => mergedMap.set(item.title, item));
      subItems.forEach((sub) => {
        const existing = mergedMap.get(sub.title);
        if (existing) {
          mergedMap.set(sub.title, {
            ...existing,
            status: sub.status === 'PUBLISHED' ? (existing.status || 'AVAILABLE') : sub.status,
            review_notes: sub.review_notes,
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
            review_notes: sub.review_notes,
            is_user_uploaded: true,
            media: [{ media_url: sub.image_url }],
            description: sub.description
          });
        }
      });

      setRentals(Array.from(mergedMap.values()));
    } catch (err) {
      console.error('Failed to load rentals:', err);
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

  const toggleStatus = async (id) => {
    let nextStatus = 'AVAILABLE';
    setRentals((prev) =>
      (Array.isArray(prev) ? prev : []).map((r) => {
        if (r.id === id) {
          nextStatus = r.status === 'AVAILABLE' ? 'MAINTENANCE' : 'AVAILABLE';
          return { ...r, status: nextStatus };
        }
        return r;
      })
    );

    // Update in localStorage
    if (typeof window !== 'undefined') {
      try {
        const stored = JSON.parse(localStorage.getItem('adilabad_rentals') || '[]');
        const updated = stored.map((r) => (r.id === id ? { ...r, status: nextStatus } : r));
        localStorage.setItem('adilabad_rentals', JSON.stringify(updated));
      } catch (e) {}
    }

    // Call API
    try {
      await apiFetch(`/api/v1/rentals/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: nextStatus })
      });
    } catch (e) {}

    addToast(`Item availability status updated to ${nextStatus}!`, 'success');
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Are you sure you want to remove "${title}" from your rental inventory?`)) return;

    setRentals((prev) => prev.filter((r) => r.id !== id));

    // Remove from localStorage
    if (typeof window !== 'undefined') {
      try {
        const stored = JSON.parse(localStorage.getItem('adilabad_rentals') || '[]');
        const filtered = stored.filter((r) => r.id !== id);
        localStorage.setItem('adilabad_rentals', JSON.stringify(filtered));
      } catch (e) {}
    }

    // Call API
    try {
      await apiFetch(`/api/v1/rentals/${id}`, { method: 'DELETE' });
    } catch (e) {}

    addToast(`Rental item "${title}" removed from your inventory.`, 'info');
  };

  const filteredRentals = (Array.isArray(rentals) ? rentals : []).filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.title?.toLowerCase().includes(q) ||
      item.category_name?.toLowerCase().includes(q) ||
      item.location?.toLowerCase().includes(q)
    );
  });

  return (
    <OwnerLayout title="Rental Inventory Fleet">
      <Head>
        <title>My Rental Inventory — Adilabad Owner Portal</title>
      </Head>

      <div className="space-y-6">
        {/* Header & Quick Action */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-6 h-6 text-amber-500" />
              <h2 className="text-xl font-bold text-slate-900">Rental Equipment Fleet</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Items currently available for daily or weekly booking in Adilabad district.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadRentals}
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
              title="Refresh inventory"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-500' : ''}`} />
            </button>
            <Link
              href="/owner/rentals/create"
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm flex items-center gap-1.5 transition"
            >
              <PlusCircle className="w-4 h-4" /> Add Rental Item
            </Link>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-sm flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by equipment title, category, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>
          <div className="text-xs font-semibold text-slate-500">
            Showing <strong className="text-slate-900">{filteredRentals.length}</strong> items
          </div>
        </div>

        {/* Rentals Table / List */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-16 text-center flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-bold text-slate-500">Loading your rental equipment inventory...</p>
            </div>
          ) : filteredRentals.length === 0 ? (
            <div className="py-16 text-center flex flex-col items-center gap-3">
              <Layers className="w-12 h-12 text-slate-300" />
              <h3 className="text-base font-bold text-slate-800">No Rental Items Found</h3>
              <p className="text-xs text-slate-500 max-w-sm">
                You haven't listed any equipment for rent yet. Click the button below to add your first item!
              </p>
              <Link
                href="/owner/rentals/create"
                className="mt-2 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
              >
                + List Your First Rental Item
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold">
                  <tr>
                    <th className="py-4 px-6">Rental Item</th>
                    <th className="py-4 px-4">Category</th>
                    <th className="py-4 px-4">Daily Rate</th>
                    <th className="py-4 px-4">Security Deposit</th>
                    <th className="py-4 px-4">Location</th>
                    <th className="py-4 px-4">Availability</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRentals.map((item) => {
                    const itemImg = item.media?.[0]?.media_url || item.image_url || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=150';
                    const isNew = item.is_user_uploaded || (typeof item.id === 'number' && item.id > 1000);

                    return (
                      <tr key={item.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <img
                              src={itemImg}
                              alt={item.title}
                              className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 text-sm">{item.title}</span>
                                {isNew && (
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black tracking-tight border border-emerald-300">
                                    Your Upload
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                                {item.description || 'Verified local handover'}
                              </p>
                              {item.review_notes && (
                                <p className="text-[10px] text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md mt-1 inline-block">
                                  <strong>Super Admin Note:</strong> {item.review_notes}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4 font-semibold text-slate-600">
                          {item.category_name || item.category || 'General Equipment'}
                        </td>

                        <td className="py-4 px-4 font-black text-emerald-700 text-sm">
                          ₹{Number(item.daily_rate).toLocaleString('en-IN')}/day
                        </td>

                        <td className="py-4 px-4 text-slate-600 font-medium">
                          ₹{Number(item.security_deposit || 0).toLocaleString('en-IN')}
                        </td>

                        <td className="py-4 px-4 text-slate-500 font-medium">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate max-w-[120px]">{item.location || 'Adilabad'}</span>
                          </span>
                        </td>

                        <td className="py-4 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              item.status === 'AVAILABLE' || item.status === 'PUBLISHED'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : item.status === 'RENTED'
                                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                : item.status === 'CHANGES_REQUESTED'
                                ? 'bg-orange-100 text-orange-800 border border-orange-200'
                                : item.status === 'REJECTED'
                                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                : 'bg-amber-100 text-amber-800 border border-amber-200'
                            }`}
                          >
                            {item.status === 'AVAILABLE' ? 'PUBLISHED' : item.status || 'PUBLISHED'}
                          </span>
                        </td>

                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => toggleStatus(item.id)}
                              className="px-2.5 py-1 rounded-lg border border-slate-200 font-semibold text-slate-700 hover:bg-slate-100 transition"
                            >
                              Toggle
                            </button>
                            <Link
                              href={`/rentals/${item.slug || item.id}`}
                              target="_blank"
                              className="p-1.5 rounded-lg border border-slate-200 text-brand-600 hover:bg-brand-50 hover:border-brand-200 transition"
                              title="View on Public Rentals Marketplace"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                            <button
                              onClick={() => handleDelete(item.id, item.title)}
                              className="p-1.5 rounded-lg border border-slate-200 text-rose-500 hover:bg-rose-50 hover:border-rose-200 transition"
                              title="Delete Item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </OwnerLayout>
  );
}
