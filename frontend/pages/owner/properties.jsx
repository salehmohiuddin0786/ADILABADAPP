import React, { useState } from 'react';
import Head from 'next/head';
import { Building, Plus, MapPin, CheckCircle2 } from 'lucide-react';
import OwnerLayout from '../../src/panels/owner-panel/OwnerLayout';
import { useToast } from '../../src/context/ToastContext';

export default function OwnerPropertiesPage() {
  const { addToast } = useToast();
  const [properties] = useState([
    {
      id: 1,
      title: 'Commercial Yard with Shaded Equipment Storage',
      locality: 'Shivaji Chowk, Adilabad',
      size: '2,400 sq.ft',
      rent: '₹22,000 / month',
      status: 'AVAILABLE'
    },
    {
      id: 2,
      title: 'Ground Floor Retail Storefront on Main Road',
      locality: 'Cinema Road, Adilabad',
      size: '450 sq.ft',
      rent: '₹14,000 / month',
      status: 'OCCUPIED'
    }
  ]);

  return (
    <OwnerLayout title="Commercial Property Listings">
      <Head>
        <title>Properties — Adilabad Owner Portal</title>
      </Head>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Commercial Real Estate in Adilabad</h2>
            <p className="text-xs text-slate-500 mt-0.5">List shops, storage godowns, offices, and commercial lands.</p>
          </div>
          <button
            onClick={() => addToast('Commercial property listing form ready.', 'info')}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Property Listing
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(Array.isArray(properties) ? properties : []).map((p) => (
            <div key={p.id} className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    p.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {p.status}
                </span>
                <span className="font-bold text-emerald-700 text-xs">{p.rent}</span>
              </div>
              <h3 className="font-bold text-slate-900 text-base">{p.title}</h3>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-brand-600" />
                <span>{p.locality} • Size: {p.size}</span>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400">Zero Brokerage Listing</span>
                <button
                  onClick={() => addToast('Property details updated.', 'success')}
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
