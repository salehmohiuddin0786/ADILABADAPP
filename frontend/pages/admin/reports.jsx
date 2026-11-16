import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Flag, ShieldCheck, Check, X, AlertTriangle } from 'lucide-react';
import AdminLayout from '../../src/components/layout/AdminLayout';
import { apiFetch } from '../../src/utils/api';
import { useToast } from '../../src/context/ToastContext';

export default function AdminReportsPage() {
  const { addToast } = useToast();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchReports = async () => {
    setLoading(true);
    try {
      const q = statusFilter ? `?status=${statusFilter}` : '';
      const res = await apiFetch(`/reports/admin/list${q}`);
      if (res && res.success && Array.isArray(res.data)) {
        setReports(res.data);
      } else if (res && Array.isArray(res)) {
        setReports(res);
      } else {
        setReports([]);
      }
    } catch (err) {
      addToast(err.message, 'error');
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [statusFilter]);

  const handleUpdate = async (id, newStatus, disableAd = false) => {
    try {
      const res = await apiFetch(`/reports/admin/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus, disable_ad: disableAd })
      });
      if (res.success) {
        addToast(res.message, 'success');
        fetchReports();
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <AdminLayout title="Advertisement Reports">
      <Head>
        <title>Manage Reports — Adilabad App Admin</title>
      </Head>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-xl">
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">
              Advertisement Reports ({reports.length})
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Review visitor reports for fake listings, incorrect contacts, spam, or scam complaints in Adilabad.
            </p>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">All Reports</option>
            <option value="pending">Pending</option>
            <option value="under_review">Under Review</option>
            <option value="resolved">Resolved</option>
            <option value="dismissed">Dismissed</option>
          </select>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6">Advertisement</th>
                  <th className="py-4 px-4">Reason</th>
                  <th className="py-4 px-4">Details</th>
                  <th className="py-4 px-4">Reporter</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-6 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {(Array.isArray(reports) ? reports : []).map((r) => (
                  <tr key={r.id} className="hover:bg-slate-800/60 transition">
                    <td className="py-4 px-6">
                      <p className="font-bold text-white text-sm">{r.advertisement_title || 'Ad ID: ' + r.advertisement_id}</p>
                      <p className="text-xs text-slate-400">{r.business_name}</p>
                    </td>

                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-950/60 text-rose-300 border border-rose-800/60">
                        {r.reason?.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-xs text-slate-300 max-w-xs truncate">
                      {r.description || 'No description provided'}
                    </td>

                    <td className="py-4 px-4 text-xs text-slate-400">
                      {r.reporter_name || 'Anonymous'} ({r.reporter_contact || 'No contact'})
                    </td>

                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                        r.status === 'pending'
                          ? 'bg-amber-950/60 text-amber-300 border-amber-800/60'
                          : r.status === 'resolved'
                          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}>
                        {r.status}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right space-x-2">
                      {r.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleUpdate(r.id, 'resolved', true)}
                            className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-xs hover:bg-rose-500 transition shadow"
                            title="Disable ad and mark resolved"
                          >
                            Disable Ad
                          </button>
                          <button
                            onClick={() => handleUpdate(r.id, 'dismissed', false)}
                            className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 transition"
                          >
                            Dismiss
                          </button>
                        </>
                      )}
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
