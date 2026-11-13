import React, { useState } from 'react';
import Head from 'next/head';
import { Utensils, Plus, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import OwnerLayout from '../../src/panels/owner-panel/OwnerLayout';
import { useToast } from '../../src/context/ToastContext';

export default function OwnerRestaurantsPage() {
  const { addToast } = useToast();
  const [restaurants] = useState([
    {
      id: 1,
      name: 'Hotel Mehfil & Family Restaurant',
      cuisine: 'Hyderabadi Dum Biryani, Mughlai & Tandoor',
      locality: 'Cinema Road, Adilabad',
      timings: '11:00 AM — 11:30 PM',
      status: 'VERIFIED'
    }
  ]);

  return (
    <OwnerLayout title="Restaurant Profiles & Food Menus">
      <Head>
        <title>Restaurants — Adilabad Owner Portal</title>
      </Head>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Dining & Cloud Kitchen Outlets</h2>
            <p className="text-xs text-slate-500 mt-0.5">Manage food menus, direct order phone numbers, and dining tables.</p>
          </div>
          <button
            onClick={() => addToast('Add new food outlet profile.', 'info')}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Restaurant Profile
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(Array.isArray(restaurants) ? restaurants : []).map((r) => (
            <div key={r.id} className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {r.status}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-brand-600" /> {r.timings}
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-base">{r.name}</h3>
              <p className="text-xs font-medium text-slate-600">{r.cuisine}</p>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-brand-600" />
                <span>{r.locality}</span>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-emerald-700 font-bold">1-Tap Direct Orders</span>
                <button
                  onClick={() => addToast('Editing digital food menu.', 'info')}
                  className="text-brand-600 font-bold hover:underline"
                >
                  Manage Menu
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </OwnerLayout>
  );
}
