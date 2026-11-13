import React, { useState } from 'react';
import Head from 'next/head';
import { CheckCircle2, Clock, AlertTriangle, ShieldCheck, FileText, ChevronRight, Check, X } from 'lucide-react';
import StaffLayout from '../../src/panels/staff-panel/StaffLayout';

export default function StaffTasksPage() {
  const [tasks, setTasks] = useState([
    {
      id: 'TSK-401',
      title: 'Verify Municipal Trade License for Shree Balaji Electronics',
      queue: 'Merchant KYC',
      priority: 'HIGH',
      due: 'Today 5:00 PM',
      status: 'IN_PROGRESS',
      notes: 'Checked trade license #ADB-MUNC-TL-4912 against municipality portal. Record valid.'
    },
    {
      id: 'TSK-402',
      title: 'Inspect Residential Plot Listing on Boath Road for Layout Approval',
      queue: 'Content Moderation',
      priority: 'NORMAL',
      due: 'Tomorrow 12:00 PM',
      status: 'ASSIGNED',
      notes: 'Citizen flagged for unverified layout permission. Needs DTCP document.'
    },
    {
      id: 'TSK-403',
      title: 'Review Rental Security Deposit Dispute #ADL-RENT-91024',
      queue: 'Rental Disputes',
      priority: 'HIGH',
      due: 'Today 6:00 PM',
      status: 'IN_PROGRESS',
      notes: 'Customer returned camera with reported scratches. Reviewing pre-dispatch video inspection.'
    }
  ]);

  const handleComplete = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'COMPLETED' } : t))
    );
  };

  return (
    <StaffLayout title="My Assigned Operational Tasks">
      <Head>
        <title>Assigned Tasks — Adilabad Staff Operations</title>
      </Head>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Assigned Operational Work Queue</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Tasks assigned by Super Admin for investigation, compliance validation, and recommendation.
          </p>
        </div>

        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`p-5 rounded-3xl border shadow-sm transition ${
                task.status === 'COMPLETED'
                  ? 'bg-emerald-50/60 border-emerald-200'
                  : 'bg-white border-slate-200 hover:shadow-md'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {task.id}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-50 text-brand-700">
                      {task.queue}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        task.priority === 'HIGH'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-sm">{task.title}</h3>
                  <p className="text-xs text-slate-600">{task.notes}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  {task.status === 'COMPLETED' ? (
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Completed
                    </span>
                  ) : (
                    <button
                      onClick={() => handleComplete(task.id)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Submit Recommendation</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </StaffLayout>
  );
}
