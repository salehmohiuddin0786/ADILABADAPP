import React, { useState } from 'react';
import Head from 'next/head';
import { Tractor, Plus, Sprout, CheckCircle2 } from 'lucide-react';
import OwnerLayout from '../../src/panels/owner-panel/OwnerLayout';
import { useToast } from '../../src/context/ToastContext';

export default function OwnerAgriculturePage() {
  const { addToast } = useToast();
  const [agriListings] = useState([
    {
      id: 1,
      title: 'Tractor with Multicrop Thresher & Rotavator Hire',
      equipment: 'John Deere 5050D + Shaktiman Rotavator',
      rate: '₹900 / hour',
      status: 'AVAILABLE',
      location: 'Mavala & Jainath Mandals'
    },
    {
      id: 2,
      title: 'Certified Cotton (Kapas) Seed & Organic Fertilizer Supplies',
      equipment: 'Wholesale Depot',
      rate: 'Market Price / Bag',
      status: 'IN_STOCK',
      location: 'Market Yard, Adilabad'
    }
  ]);

  return (
    <OwnerLayout title="Agricultural Resources & Equipment">
      <Head>
        <title>Agriculture — Adilabad Owner Portal</title>
      </Head>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Farm Machinery & Agricultural Services</h2>
            <p className="text-xs text-slate-500 mt-0.5">List harvesters, tractor implements, borewell drilling, and crop tools.</p>
          </div>
          <button
            onClick={() => addToast('Agricultural listing form ready.', 'info')}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Agri Listing
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(Array.isArray(agriListings) ? agriListings : []).map((ag) => (
            <div key={ag.id} className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {ag.status}
                </span>
                <span className="text-xs font-bold text-emerald-700">{ag.rate}</span>
              </div>
              <h3 className="font-bold text-slate-900 text-base">{ag.title}</h3>
              <p className="text-xs text-slate-600 font-medium">Kit: {ag.equipment}</p>
              <p className="text-xs text-slate-400">Coverage: {ag.location}</p>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Farmers can call directly</span>
                <button
                  onClick={() => addToast('Agri item updated.', 'success')}
                  className="text-brand-600 font-bold hover:underline"
                >
                  Manage Listing
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </OwnerLayout>
  );
}
