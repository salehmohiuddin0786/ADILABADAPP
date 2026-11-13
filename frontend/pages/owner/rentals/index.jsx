import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Layers, PlusCircle, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';
import OwnerLayout from '../../../src/panels/owner-panel/OwnerLayout';
import { useToast } from '../../../src/context/ToastContext';

export default function OwnerRentalsListPage() {
  const { addToast } = useToast();
  const [rentals, setRentals] = useState([
    {
      id: 1,
      title: 'Sony Alpha A7 IV Mirrorless Camera Kit',
      category: 'Electronics & Cameras',
      daily_rate: 1500,
      security_deposit: 5000,
      condition: 'Excellent',
      status: 'AVAILABLE',
      slug: 'sony-alpha-a7-iv-mirrorless-camera'
    },
    {
      id: 2,
      title: 'John Deere 5050D Tractor with Cultivator',
      category: 'Agriculture & Tractors',
      daily_rate: 3200,
      security_deposit: 8000,
      condition: 'Heavy Duty / Good',
      status: 'RENTED',
      slug: 'john-deere-5050d-tractor'
    },
    {
      id: 3,
      title: 'JBL VRX Line Array 10kW Sound System for Weddings',
      category: 'Events & Audio',
      daily_rate: 6500,
      security_deposit: 10000,
      condition: 'Like New',
      status: 'AVAILABLE',
      slug: 'jbl-vrx-line-array-10kw-sound-system'
    }
  ]);

  const toggleStatus = (id) => {
    setRentals((prev) =>
      (Array.isArray(prev) ? prev : []).map((r) =>
        r.id === id ? { ...r, status: r.status === 'AVAILABLE' ? 'MAINTENANCE' : 'AVAILABLE' } : r
      )
    );
    addToast('Item availability status updated!', 'success');
  };

  return (
    <OwnerLayout title="Rental Inventory Fleet">
      <Head>
        <title>My Rental Inventory — Adilabad Owner Portal</title>
      </Head>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Rental Equipment Fleet</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Items currently available for daily or weekly booking in Adilabad district.
            </p>
          </div>
          <Link
            href="/owner/rentals/create"
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" /> Add Rental Item
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold">
                <tr>
                  <th className="py-4 px-6">Rental Item</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Daily Rate</th>
                  <th className="py-4 px-4">Security Deposit</th>
                  <th className="py-4 px-4">Condition</th>
                  <th className="py-4 px-4">Availability</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(Array.isArray(rentals) ? rentals : []).map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 px-6 font-bold text-slate-900">{item.title}</td>
                    <td className="py-4 px-4 text-slate-500">{item.category}</td>
                    <td className="py-4 px-4 font-bold text-emerald-700">₹{item.daily_rate}/day</td>
                    <td className="py-4 px-4 text-slate-600">₹{item.security_deposit}</td>
                    <td className="py-4 px-4">{item.condition}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          item.status === 'AVAILABLE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'RENTED'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => toggleStatus(item.id)}
                        className="px-2.5 py-1 rounded-lg border border-slate-300 font-semibold hover:bg-slate-50"
                      >
                        Toggle Status
                      </button>
                      <Link
                        href={`/rentals/${item.slug}`}
                        target="_blank"
                        className="text-brand-600 hover:text-brand-700 font-bold inline-flex items-center gap-1"
                      >
                        View <ExternalLink className="w-3 h-3" />
                      </Link>
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
