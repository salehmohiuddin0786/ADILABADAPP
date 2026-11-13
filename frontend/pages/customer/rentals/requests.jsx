import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Layers, Calendar, Phone, CheckCircle2, Clock } from 'lucide-react';
import CustomerLayout from '../../../src/panels/customer-panel/CustomerLayout';

export default function CustomerRentalRequestsPage() {
  const requests = [
    {
      id: 1,
      booking_code: 'ADL-RENT-91024',
      item: 'Sony Alpha A7 IV Mirrorless Camera',
      owner: 'Adilabad Media Works',
      phone: '9848022334',
      dates: '2026-11-16 to 2026-11-19',
      total: '₹4,500 + ₹5,000 deposit',
      status: 'CONFIRMED'
    }
  ];

  return (
    <CustomerLayout title="My Rental Proposals">
      <Head>
        <title>Rental Requests — Customer Hub</title>
      </Head>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Submitted Booking Proposals</h2>
          <p className="text-xs text-slate-500 mt-0.5">Track merchant acceptance and offline handover details.</p>
        </div>

        <div className="space-y-4">
          {(Array.isArray(requests) ? requests : []).map((req) => (
            <div key={req.id} className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {req.booking_code}
                </span>
                <h3 className="font-bold text-slate-900 text-base mt-1">{req.item}</h3>
                <p className="text-xs text-slate-500">
                  Owner: <strong>{req.owner}</strong> • Dates: {req.dates}
                </p>
                <p className="text-xs font-bold text-emerald-700 mt-1">Due at Handover: {req.total}</p>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={`tel:${req.phone}`}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" /> Call Owner
                </a>
                <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  {req.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </CustomerLayout>
  );
}
