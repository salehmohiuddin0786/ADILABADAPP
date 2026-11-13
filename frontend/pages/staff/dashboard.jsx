import React, { useState } from 'react';
import Head from 'next/head';
import StaffLayout from '../../src/panels/staff-panel/StaffLayout';
import { ShieldAlert, CheckCircle, XCircle, Clock, AlertTriangle, Eye } from 'lucide-react';
import { useToast } from '../../src/context/ToastContext';

export default function StaffDashboardPage() {
  const { showToast } = useToast();
  const [queue, setQueue] = useState([
    {
      id: 1,
      type: 'RENTAL_LISTING',
      title: 'Sony Alpha A7 IV Mirrorless Camera',
      submitter: 'Adilabad Media Works',
      submitted_at: '2026-11-13 14:20',
      status: 'pending'
    },
    {
      id: 2,
      type: 'BUSINESS_KYC',
      title: 'Sri Balaji Electronics Showroom',
      submitter: 'M. Venkat Rao',
      submitted_at: '2026-11-13 15:45',
      status: 'pending'
    },
    {
      id: 3,
      type: 'RENTAL_DISPUTE',
      title: 'Booking #ADL-RENT-40912 — Minor Scratch Claim',
      submitter: 'Suresh Equipment Rentals',
      submitted_at: '2026-11-13 18:10',
      status: 'pending'
    }
  ]);

  const handleModeration = (id, decision) => {
    setQueue((prev) => prev.filter((item) => item.id !== id));
    showToast(`Task #${id} marked as ${decision}. Audit log created.`, 'success');
  };

  return (
    <StaffLayout title="Staff Workspace & Moderation Queue">
      <Head>
        <title>Staff Workspace — Adilabad App</title>
      </Head>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Assigned Tasks Queue</h2>
            <p className="text-xs text-slate-500 mt-1">Review pending items and resolve tickets according to district policy.</p>
          </div>
          <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1.5 rounded-full">
            {queue.length} Active Items
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold">
              <tr>
                <th className="px-6 py-3.5">Task ID</th>
                <th className="px-6 py-3.5">Type</th>
                <th className="px-6 py-3.5">Details</th>
                <th className="px-6 py-3.5">Submitted By</th>
                <th className="px-6 py-3.5 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {queue.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70">
                  <td className="px-6 py-4 font-mono font-bold text-slate-500">#{item.id}</td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded text-[10px]">
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900">{item.title}</td>
                  <td className="px-6 py-4 text-slate-500">{item.submitter}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => handleModeration(item.id, 'APPROVED')}
                      className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 px-3 py-1.5 rounded-lg font-bold"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleModeration(item.id, 'REJECTED')}
                      className="bg-rose-100 hover:bg-rose-200 text-rose-800 px-3 py-1.5 rounded-lg font-bold"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
              {queue.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-slate-400 font-medium">
                    Queue clear! No pending assigned tasks.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </StaffLayout>
  );
}
