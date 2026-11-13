import React from 'react';
import Head from 'next/head';
import { History, CheckCircle2 } from 'lucide-react';
import StaffLayout from '../../src/panels/staff-panel/StaffLayout';

export default function StaffActionHistoryPage() {
  const auditLogs = [
    {
      id: 1,
      action: 'APPROVED_AD',
      details: 'Approved ad: Prime Commercial Shop for Rent - Cinema Road',
      timestamp: 'Today, 10:30 AM'
    },
    {
      id: 2,
      action: 'VERIFIED_STORE',
      details: 'Verified municipal license for Hotel Mehfil',
      timestamp: 'Yesterday, 4:15 PM'
    }
  ];

  return (
    <StaffLayout title="My Action History">
      <Head>
        <title>Action History — Adilabad Staff Panel</title>
      </Head>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Moderation Audit Trail</h2>
          <p className="text-xs text-slate-500 mt-0.5">Immutable activity record for your staff account.</p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden divide-y divide-slate-100 text-xs">
          {(Array.isArray(auditLogs) ? auditLogs : []).map((log) => (
            <div key={log.id} className="p-4 sm:p-5 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">{log.details}</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">{log.timestamp}</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800">
                {log.action}
              </span>
            </div>
          ))}
        </div>
      </div>
    </StaffLayout>
  );
}
