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
      if (res.success) setReports(res.data);
    } catch (err) {
      addToast(err.message, 'error');
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
        <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Advertisement Reports ({reports.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review visitor reports for fake listings, incorrect contacts, spam, or scam complaints.
            </p>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white"
          >
            <option value="">All Reports</option>
            <option value="pending">Pending</option>
            <option value="under_review">Under Review</option>
            <option value="resolved">Resolved</option>
            <option value="dismissed">Dismissed</option>
          </select>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                <tr>
                  <th className="py-4 px-6">Advertisement</th>
                  <th className="py-4 px-4">Reason</th>
                  <th className="py-4 px-4">Details</th>
                  <th className="py-4 px-4">Reporter</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-6 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reports.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 px-6">
                      <p className="font-bold text-slate-900 text-sm">{r.advertisement_title || 'Ad ID: ' + r.advertisement_id}</p>
                      <p className="text-xs text-slate-400">{r.business_name}</p>
                    </td>

                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700">
                        {r.reason?.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-xs text-slate-600 max-w-xs truncate">
                      {r.description || 'No description provided'}
                    </td>

                    <td className="py-4 px-4 text-xs text-slate-500">
                      {r.reporter_name || 'Anonymous'} ({r.reporter_contact || 'No contact'})
                    </td>

                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        r.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : r.status === 'resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {r.status}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right space-x-2">
                      {r.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleUpdate(r.id, 'resolved', true)}
                            className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-xs hover:bg-rose-700"
                            title="Disable ad and mark resolved"
                          >
                            Disable Ad
                          </button>
                          <button
                            onClick={() => handleUpdate(r.id, 'dismissed', false)}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-100"
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
