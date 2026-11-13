import React, { useState } from 'react';
import Head from 'next/head';
import { Wrench, Plus, CheckCircle2 } from 'lucide-react';
import OwnerLayout from '../../src/panels/owner-panel/OwnerLayout';
import { useToast } from '../../src/context/ToastContext';

export default function OwnerServicesPage() {
  const { addToast } = useToast();
  const [services] = useState([
    {
      id: 1,
      title: 'Professional 4K Drone Videography & Event Coverage',
      pricing: '₹5,000 / day',
      area: 'Adilabad District & Nirmal',
      status: 'ACTIVE'
    },
    {
      id: 2,
      title: 'Sound & Acoustics Stage Rigging by Certified Technicians',
      pricing: '₹3,500 / event',
      area: 'Adilabad Town & Mandals',
      status: 'ACTIVE'
    }
  ]);

  return (
    <OwnerLayout title="Professional Service Listings">
      <Head>
        <title>Services — Adilabad Owner Portal</title>
      </Head>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Commercial Services Offered</h2>
            <p className="text-xs text-slate-500 mt-0.5">List professional technician, operator, or maintenance services.</p>
          </div>
          <button
            onClick={() => addToast('New service listing modal ready.', 'info')}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Service Listing
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(Array.isArray(services) ? services : []).map((s) => (
            <div key={s.id} className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {s.status}
                </span>
                <span className="font-bold text-emerald-700 text-xs">{s.pricing}</span>
              </div>
              <h3 className="font-bold text-slate-900 text-base">{s.title}</h3>
              <p className="text-xs text-slate-500">Service Coverage: <strong>{s.area}</strong></p>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400">Direct Phone Connections Active</span>
                <button
                  onClick={() => addToast('Service details updated.', 'success')}
                  className="text-brand-600 font-bold hover:underline"
                >
                  Manage Service
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </OwnerLayout>
  );
}
