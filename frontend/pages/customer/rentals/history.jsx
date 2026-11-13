import React from 'react';
import Head from 'next/head';
import { History, CheckCircle2 } from 'lucide-react';
import CustomerLayout from '../../../src/panels/customer-panel/CustomerLayout';

export default function CustomerRentalHistoryPage() {
  const history = [
    {
      id: 1,
      booking_code: 'ADL-RENT-55410',
      item: 'JBL VRX Sound System Kit',
      dates: '01 Nov — 03 Nov 2026',
      total_paid: '₹13,000',
      deposit_status: 'REFUNDED FULLY',
      status: 'RETURN_COMPLETED'
    }
  ];

  return (
    <CustomerLayout title="Completed Rental History">
      <Head>
        <title>Rental History — Customer Hub</title>
      </Head>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Past Bookings & Security Refunds</h2>
          <p className="text-xs text-slate-500 mt-0.5">Records of completed equipment returns and deposit settlements.</p>
        </div>

        <div className="space-y-4">
          {(Array.isArray(history) ? history : []).map((h) => (
            <div key={h.id} className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex items-center justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {h.booking_code}
                </span>
                <h3 className="font-bold text-slate-900 text-base mt-1">{h.item}</h3>
                <p className="text-xs text-slate-500">Duration: {h.dates} • Total: {h.total_paid}</p>
              </div>
              <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> {h.deposit_status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </CustomerLayout>
  );
}
