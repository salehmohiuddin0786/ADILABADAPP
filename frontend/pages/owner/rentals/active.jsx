import React, { useState } from 'react';
import Head from 'next/head';
import { Clock, Phone, AlertCircle, ShieldCheck } from 'lucide-react';
import OwnerLayout from '../../../src/panels/owner-panel/OwnerLayout';
import { useToast } from '../../../src/context/ToastContext';

export default function OwnerActiveRentalsPage() {
  const { addToast } = useToast();
  const [activeItems] = useState([
    {
      id: 1,
      booking_code: 'ADL-RENT-77182',
      item_title: 'John Deere 5050D Tractor with Cultivator',
      customer_name: 'Suresh Patel',
      customer_phone: '9440192834',
      handover_date: '2026-11-13',
      due_date: '2026-11-16',
      deposit_held: 8000,
      daily_rate: 3200,
      status: 'IN_USE'
    }
  ]);

  return (
    <OwnerLayout title="Active Ongoing Rentals">
      <Head>
        <title>Active Rentals — Adilabad Owner Portal</title>
      </Head>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Items Currently Dispatched</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time tracking of equipment currently with customers in Adilabad district.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold">
                <tr>
                  <th className="py-4 px-6">Booking Code</th>
                  <th className="py-4 px-4">Item Dispatched</th>
                  <th className="py-4 px-4">Renter Details</th>
                  <th className="py-4 px-4">Dispatched On</th>
                  <th className="py-4 px-4">Return Deadline</th>
                  <th className="py-4 px-4">Deposit Held</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(Array.isArray(activeItems) ? activeItems : []).map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 px-6 font-mono font-bold text-slate-600">{item.booking_code}</td>
                    <td className="py-4 px-4 font-bold text-slate-900">{item.item_title}</td>
                    <td className="py-4 px-4">
                      <span className="block font-medium">{item.customer_name}</span>
                      <a href={`tel:${item.customer_phone}`} className="text-emerald-700 font-bold hover:underline">
                        +91 {item.customer_phone}
                      </a>
                    </td>
                    <td className="py-4 px-4 text-slate-500">{item.handover_date}</td>
                    <td className="py-4 px-4 font-bold text-amber-700">{item.due_date}</td>
                    <td className="py-4 px-4 font-semibold text-slate-900">₹{item.deposit_held}</td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => addToast('Return reminder SMS triggered to renter!', 'success')}
                        className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold border border-amber-200"
                      >
                        Send Reminder
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
