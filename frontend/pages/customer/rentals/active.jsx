import React from 'react';
import Head from 'next/head';
import { Layers, Clock, Phone, AlertCircle } from 'lucide-react';
import CustomerLayout from '../../../src/panels/customer-panel/CustomerLayout';

export default function CustomerActiveRentalsPage() {
  const activeItems = [
    {
      id: 1,
      booking_code: 'ADL-RENT-77182',
      item: 'John Deere 5050D Tractor with Cultivator',
      owner: 'Adilabad Heavy Agri & Equipment Yard',
      phone: '9440192834',
      due: '2026-11-16',
      deposit: '₹8,000 held',
      status: 'POSSESSION_ACTIVE'
    }
  ];

  return (
    <CustomerLayout title="Active Possessions">
      <Head>
        <title>Active Rentals — Customer Hub</title>
      </Head>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Equipment In Your Possession</h2>
          <p className="text-xs text-slate-500 mt-0.5">Keep track of return deadlines and owner yard locations.</p>
        </div>

        <div className="space-y-4">
          {(Array.isArray(activeItems) ? activeItems : []).map((it) => (
            <div key={it.id} className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {it.booking_code}
                </span>
                <h3 className="font-bold text-slate-900 text-base mt-1">{it.item}</h3>
                <p className="text-xs text-slate-500">
                  Rented from: <strong>{it.owner}</strong>
                </p>
                <p className="text-xs font-bold text-amber-700 mt-1">Return Due Date: {it.due} ({it.deposit})</p>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={`tel:${it.phone}`}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" /> Owner Contact
                </a>
                <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                  {it.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </CustomerLayout>
  );
}
