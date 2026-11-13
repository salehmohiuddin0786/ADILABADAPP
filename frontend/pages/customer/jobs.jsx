import React from 'react';
import Head from 'next/head';
import { Briefcase } from 'lucide-react';
import CustomerLayout from '../../src/panels/customer-panel/CustomerLayout';

export default function CustomerJobsPage() {
  return (
    <CustomerLayout title="My Job Applications">
      <Head>
        <title>Job Applications — Customer Hub</title>
      </Head>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Submitted Job Applications</h2>
          <p className="text-xs text-slate-500 mt-0.5">Track interview calls and candidate reviews with Adilabad employers.</p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm text-center">
          <Briefcase className="w-10 h-10 text-emerald-700 mx-auto mb-2" />
          <h3 className="font-bold text-slate-900 text-base">No active applications currently pending</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Discover verified openings in accounting, sales, driving, and teaching across Adilabad.
          </p>
        </div>
      </div>
    </CustomerLayout>
  );
}
