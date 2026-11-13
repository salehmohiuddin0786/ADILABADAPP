import React from 'react';
import Head from 'next/head';
import { Wrench, CheckCircle2 } from 'lucide-react';
import CustomerLayout from '../../src/panels/customer-panel/CustomerLayout';

export default function CustomerServicesPage() {
  return (
    <CustomerLayout title="My Service Requests">
      <Head>
        <title>Services — Customer Hub</title>
      </Head>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Service Bookings & Technician Calls</h2>
          <p className="text-xs text-slate-500 mt-0.5">Electricians, drone pilots, sound operators, and home repair pros.</p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm text-center">
          <Wrench className="w-10 h-10 text-emerald-700 mx-auto mb-2" />
          <h3 className="font-bold text-slate-900 text-base">Direct On-Demand Services</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Book professional services with direct phone confirmation and zero brokerage.
          </p>
        </div>
      </div>
    </CustomerLayout>
  );
}
