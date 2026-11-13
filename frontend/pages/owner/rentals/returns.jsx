import React, { useState } from 'react';
import Head from 'next/head';
import { RotateCcw, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import OwnerLayout from '../../../src/panels/owner-panel/OwnerLayout';
import { useToast } from '../../../src/context/ToastContext';

export default function OwnerReturnsManagementPage() {
  const { addToast } = useToast();
  const [returnItems, setReturnItems] = useState([
    {
      id: 1,
      booking_code: 'ADL-RENT-55410',
      item_title: 'JBL VRX Sound System Kit',
      customer_name: 'Anand Kumar',
      returned_on: '2026-11-12',
      deposit_refundable: 10000,
      condition_check: 'PASS (No Damage)',
      status: 'PENDING_REFUND'
    }
  ]);

  const handleReleaseDeposit = (id) => {
    setReturnItems((prev) =>
      (Array.isArray(prev) ? prev : []).map((r) => (r.id === id ? { ...r, status: 'REFUND_COMPLETED' } : r))
    );
    addToast('Security deposit refund logged and release receipt issued!', 'success');
  };

  return (
    <OwnerLayout title="Return Management & Deposit Clearance">
      <Head>
        <title>Return Management — Adilabad Owner Portal</title>
      </Head>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Equipment Return Inspections</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Verify condition, record inspection notes, and release customer security deposits.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold">
                <tr>
                  <th className="py-4 px-6">Booking Code</th>
                  <th className="py-4 px-4">Equipment Title</th>
                  <th className="py-4 px-4">Renter</th>
                  <th className="py-4 px-4">Returned On</th>
                  <th className="py-4 px-4">Inspection Result</th>
                  <th className="py-4 px-4">Deposit Due</th>
                  <th className="py-4 px-6 text-right">Settlement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(Array.isArray(returnItems) ? returnItems : []).map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 px-6 font-mono font-bold text-slate-600">{item.booking_code}</td>
                    <td className="py-4 px-4 font-bold text-slate-900">{item.item_title}</td>
                    <td className="py-4 px-4 font-medium">{item.customer_name}</td>
                    <td className="py-4 px-4 text-slate-500">{item.returned_on}</td>
                    <td className="py-4 px-4">
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {item.condition_check}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-900">₹{item.deposit_refundable}</td>
                    <td className="py-4 px-6 text-right">
                      {item.status === 'PENDING_REFUND' ? (
                        <button
                          onClick={() => handleReleaseDeposit(item.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm"
                        >
                          Release Deposit
                        </button>
                      ) : (
                        <span className="text-emerald-700 font-bold">Refund Settled</span>
                      )}
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
