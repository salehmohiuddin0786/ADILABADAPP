import React, { useState } from 'react';
import Head from 'next/head';
import { ShoppingBag, Plus, Tag, CheckCircle2 } from 'lucide-react';
import OwnerLayout from '../../src/panels/owner-panel/OwnerLayout';
import { useToast } from '../../src/context/ToastContext';

export default function OwnerBuySellPage() {
  const { addToast } = useToast();
  const [items] = useState([
    {
      id: 1,
      title: 'Studio Lighting Softbox Kit (Used 4 months)',
      price: '₹4,500',
      category: 'Electronics / Production',
      status: 'AVAILABLE',
      date: '2026-11-10'
    },
    {
      id: 2,
      title: 'Commercial Heavy Metal Display Racks (Set of 4)',
      price: '₹12,000',
      category: 'Store Fixtures',
      status: 'AVAILABLE',
      date: '2026-11-05'
    }
  ]);

  return (
    <OwnerLayout title="Buy & Sell Marketplace Listings">
      <Head>
        <title>Buy & Sell Listings — Adilabad Owner Portal</title>
      </Head>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Pre-Owned & Commercial Stock</h2>
            <p className="text-xs text-slate-500 mt-0.5">List second-hand items and refurbished commercial equipment.</p>
          </div>
          <button
            onClick={() => addToast('Listing form opened for second-hand stock.', 'info')}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Post Second-Hand Listing
          </button>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold">
                <tr>
                  <th className="py-4 px-6">Item Title</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Price</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4">Listed Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(Array.isArray(items) ? items : []).map((it) => (
                  <tr key={it.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 px-6 font-bold text-slate-900">{it.title}</td>
                    <td className="py-4 px-4 text-slate-500">{it.category}</td>
                    <td className="py-4 px-4 font-bold text-emerald-700">{it.price}</td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {it.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-500">{it.date}</td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => addToast('Listing status toggled.', 'success')}
                        className="text-brand-600 font-bold hover:underline"
                      >
                        Edit Listing
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </OwnerLayout>
  );
}
