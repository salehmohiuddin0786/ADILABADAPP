import React from 'react';
import Head from 'next/head';
import { User, ShieldCheck } from 'lucide-react';
import StaffLayout from '../../src/panels/staff-panel/StaffLayout';
import { useAuth } from '../../src/context/AuthContext';

export default function StaffProfilePage() {
  const { user } = useAuth();

  return (
    <StaffLayout title="Staff Operator Profile">
      <Head>
        <title>Staff Profile — Adilabad Staff Panel</title>
      </Head>

      <div className="max-w-2xl bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-xl">
            <User className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">{user?.name || 'Adilabad Staff Moderator'}</h3>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Assigned Mandals: Adilabad Urban & Rural
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
          <p>Email: <strong className="text-slate-900">{user?.email || 'staff@adilabadapp.com'}</strong></p>
          <p>Access Authority: <strong className="text-slate-900">Content Moderation & Merchant Verification</strong></p>
        </div>
      </div>
    </StaffLayout>
  );
}
