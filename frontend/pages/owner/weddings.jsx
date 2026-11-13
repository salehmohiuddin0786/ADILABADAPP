import React, { useState } from 'react';
import Head from 'next/head';
import { PartyPopper, Plus, Calendar, Camera } from 'lucide-react';
import OwnerLayout from '../../src/panels/owner-panel/OwnerLayout';
import { useToast } from '../../src/context/ToastContext';

export default function OwnerWeddingsPage() {
  const { addToast } = useToast();
  const [weddingServices] = useState([
    {
      id: 1,
      title: 'Grand Royal Wedding Cinematic Photography & Drone Package',
      team: 'Adilabad Media Works Lens Crew',
      pricing: '₹45,000 / event',
      status: 'AVAILABLE'
    },
    {
      id: 2,
      title: 'Luxury Stage LED Wall & Flower Mandap Decoration',
      team: 'Royal Stage Designers',
      pricing: '₹35,000 / event',
      status: 'AVAILABLE'
    }
  ]);

  return (
    <OwnerLayout title="Wedding & Event Vendor Listings">
      <Head>
        <title>Weddings — Adilabad Owner Portal</title>
      </Head>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Marriage & Event Services</h2>
            <p className="text-xs text-slate-500 mt-0.5">List function halls, caterers, sound setups, and photo crews.</p>
          </div>
          <button
            onClick={() => addToast('Wedding service listing form ready.', 'info')}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Wedding Service
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(Array.isArray(weddingServices) ? weddingServices : []).map((w) => (
            <div key={w.id} className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {w.status}
                </span>
                <span className="text-xs font-bold text-emerald-700">{w.pricing}</span>
              </div>
              <h3 className="font-bold text-slate-900 text-base">{w.title}</h3>
              <p className="text-xs text-slate-600">Crew / Vendor: {w.team}</p>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400">Wedding season calendar booking enabled</span>
                <button
                  onClick={() => addToast('Wedding package updated.', 'success')}
                  className="text-brand-600 font-bold hover:underline"
                >
                  Manage Package
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </OwnerLayout>
  );
}
