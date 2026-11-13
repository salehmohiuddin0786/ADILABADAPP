import React from 'react';
import Head from 'next/head';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import StaffLayout from '../../src/panels/staff-panel/StaffLayout';

export default function StaffDisputesPage() {
  return (
    <StaffLayout title="Disputes & Damage Mediation">
      <Head>
        <title>Disputes — Adilabad Staff Panel</title>
      </Head>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Rental Claims & Deposit Disputes</h2>
          <p className="text-xs text-slate-500 mt-0.5">Mediate equipment return condition and deposit refund delays.</p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm text-center">
          <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-2" />
          <h3 className="font-bold text-slate-900 text-base">0 Unresolved Mediation Tickets</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            All recent handovers and deposit settlements in Adilabad have been closed satisfactorily.
          </p>
        </div>
      </div>
    </StaffLayout>
  );
}
