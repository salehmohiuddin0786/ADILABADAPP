import React, { useState } from 'react';
import Head from 'next/head';
import { ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';
import StaffLayout from '../../src/panels/staff-panel/StaffLayout';
import { useToast } from '../../src/context/ToastContext';

export default function StaffVerificationsPage() {
  const { addToast } = useToast();
  const [kycs, setKycs] = useState([
    {
      id: 201,
      business: 'Adilabad Media Works',
      docType: 'Municipal Shop Act Certificate',
      docNumber: 'ADL-SHOP-2024-8891',
      status: 'UNDER_REVIEW'
    }
  ]);

  const verifyDoc = (id, result) => {
    setKycs((prev) => (Array.isArray(prev) ? prev : []).filter((k) => k.id !== id));
    addToast(`KYC submission ${result} successfully!`, 'success');
  };

  return (
    <StaffLayout title="KYC & Merchant Verifications">
      <Head>
        <title>KYC Verifications — Adilabad Staff Panel</title>
      </Head>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Merchant Document Verification</h2>
          <p className="text-xs text-slate-500 mt-0.5">Validate government proofs and municipal registrations.</p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold">
                <tr>
                  <th className="py-4 px-6">ID</th>
                  <th className="py-4 px-4">Merchant Name</th>
                  <th className="py-4 px-4">Document Type</th>
                  <th className="py-4 px-4">Certificate Number</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(Array.isArray(kycs) ? kycs : []).map((k) => (
                  <tr key={k.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 px-6 font-mono font-bold text-slate-500">#{k.id}</td>
                    <td className="py-4 px-4 font-bold text-slate-900">{k.business}</td>
                    <td className="py-4 px-4 text-slate-600">{k.docType}</td>
                    <td className="py-4 px-4 font-mono">{k.docNumber}</td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => verifyDoc(k.id, 'APPROVED')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-xs"
                      >
                        Grant Green Badge
                      </button>
                      <button
                        onClick={() => verifyDoc(k.id, 'REJECTED')}
                        className="px-3 py-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-xs"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </StaffLayout>
  );
}
