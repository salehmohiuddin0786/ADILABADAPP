import React, { useState } from 'react';
import Head from 'next/head';
import { Inbox, CheckCircle2, XCircle } from 'lucide-react';
import StaffLayout from '../../src/panels/staff-panel/StaffLayout';
import { useToast } from '../../src/context/ToastContext';

export default function StaffModerationPage() {
  const { addToast } = useToast();
  const [tasks, setTasks] = useState([
    {
      id: 101,
      type: 'Advertisement',
      title: 'Commercial Cotton Harvester Machine for Hire',
      submitter: 'Kapas Agri Tech',
      date: 'Today, 11:30 AM',
      status: 'PENDING'
    },
    {
      id: 102,
      type: 'Rental Item',
      title: 'Yamaha 2000W Portable Silent Inverter Generator',
      submitter: 'Adilabad Audio Riggers',
      date: 'Today, 10:15 AM',
      status: 'PENDING'
    }
  ]);

  const handleAction = (id, action) => {
    setTasks((prev) => (Array.isArray(prev) ? prev : []).filter((t) => t.id !== id));
    addToast(`Task #${id} has been ${action}.`, 'success');
  };

  return (
    <StaffLayout title="Assigned Moderation Queue">
      <Head>
        <title>Moderation — Adilabad Staff Panel</title>
      </Head>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Pending Review Queue</h2>
          <p className="text-xs text-slate-500 mt-0.5">Audit new listings against district community standards.</p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold">
                <tr>
                  <th className="py-4 px-6">ID</th>
                  <th className="py-4 px-4">Type</th>
                  <th className="py-4 px-4">Title</th>
                  <th className="py-4 px-4">Submitted By</th>
                  <th className="py-4 px-4">Date</th>
                  <th className="py-4 px-6 text-right">Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(Array.isArray(tasks) ? tasks : []).map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 px-6 font-mono font-bold text-slate-500">#{t.id}</td>
                    <td className="py-4 px-4">
                      <span className="bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded text-[10px]">
                        {t.type}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-900">{t.title}</td>
                    <td className="py-4 px-4 text-slate-600">{t.submitter}</td>
                    <td className="py-4 px-4 text-slate-400">{t.date}</td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => handleAction(t.id, 'APPROVED')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-xs"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(t.id, 'REJECTED')}
                        className="px-3 py-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-xs"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </StaffLayout>
  );
}
