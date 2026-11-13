import React from 'react';
import Head from 'next/head';
import { Calendar } from 'lucide-react';
import CustomerLayout from '../../src/panels/customer-panel/CustomerLayout';

export default function CustomerEventsPage() {
  return (
    <CustomerLayout title="My Event Registrations">
      <Head>
        <title>Events — Customer Hub</title>
      </Head>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Registered Local Events</h2>
          <p className="text-xs text-slate-500 mt-0.5">Expos, exhibitions, cultural programs, and workshops in Adilabad.</p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm text-center">
          <Calendar className="w-10 h-10 text-emerald-700 mx-auto mb-2" />
          <h3 className="font-bold text-slate-900 text-base">District Events Calendar</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Stay tuned for festival gatherings, business expos, and college fests.
          </p>
        </div>
      </div>
    </CustomerLayout>
  );
}
