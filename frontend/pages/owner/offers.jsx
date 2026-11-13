import React, { useState } from 'react';
import Head from 'next/head';
import { Percent, Plus, Tag, Clock } from 'lucide-react';
import OwnerLayout from '../../src/panels/owner-panel/OwnerLayout';
import { useToast } from '../../src/context/ToastContext';

export default function OwnerOffersPage() {
  const { addToast } = useToast();
  const [coupons] = useState([
    {
      id: 1,
      code: 'ADILABAD-WINTER-20',
      discount: '20% OFF Daily Equipment Rentals',
      valid_till: '31 Dec 2026',
      claims: 42,
      status: 'ACTIVE'
    },
    {
      id: 2,
      code: 'KAPAS-FARMER-SPECIAL',
      discount: 'Flat ₹500 OFF on 3-day tractor booking',
      valid_till: '15 Jan 2027',
      claims: 68,
      status: 'ACTIVE'
    }
  ]);

  return (
    <OwnerLayout title="Promotional Offers & Coupons">
      <Head>
        <title>Offers & Coupons — Adilabad Owner Portal</title>
      </Head>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Discount Coupons & Customer Perks</h2>
            <p className="text-xs text-slate-500 mt-0.5">Publish discount codes to boost bookings and walk-in footfalls.</p>
          </div>
          <button
            onClick={() => addToast('Coupon generation wizard ready.', 'info')}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Create Coupon
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(Array.isArray(coupons) ? coupons : []).map((cp) => (
            <div key={cp.id} className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono font-black text-amber-900 bg-amber-100 border border-amber-300 px-3 py-1 rounded-xl text-xs">
                  {cp.code}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {cp.status}
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-base">{cp.discount}</h3>
              <p className="text-xs text-slate-500 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> Valid until: <strong>{cp.valid_till}</strong>
              </p>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-600">Redeemed by <strong>{cp.claims} customers</strong></span>
                <button
                  onClick={() => addToast('Coupon rules updated.', 'success')}
                  className="text-brand-600 font-bold hover:underline"
                >
                  Edit Coupon
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </OwnerLayout>
  );
}
