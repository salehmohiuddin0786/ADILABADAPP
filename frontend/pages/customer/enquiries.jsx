import React from 'react';
import Head from 'next/head';
import { MessageSquare, Phone } from 'lucide-react';
import CustomerLayout from '../../src/panels/customer-panel/CustomerLayout';

export default function CustomerEnquiriesPage() {
  const enquiries = [
    {
      id: 1,
      merchant: 'Adilabad Media Works',
      subject: 'Sony Alpha Cinema Camera Rental Inquiry',
      message: 'Is the camera available for a 4-day wedding shoot starting next Friday in Utnoor?',
      date: '12 Nov 2026',
      status: 'REPLIED'
    }
  ];

  return (
    <CustomerLayout title="My Inbound Enquiries">
      <Head>
        <title>My Enquiries — Customer Hub</title>
      </Head>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Communication with Local Businesses</h2>
          <p className="text-xs text-slate-500 mt-0.5">Responses and conversation history with Adilabad merchants.</p>
        </div>

        <div className="space-y-4">
          {(Array.isArray(enquiries) ? enquiries : []).map((e) => (
            <div key={e.id} className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">To: {e.merchant}</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {e.status}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-700">{e.subject}</p>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
                "{e.message}"
              </div>
              <span className="text-[11px] text-slate-400 block pt-1">Sent on {e.date}</span>
            </div>
          ))}
        </div>
      </div>
    </CustomerLayout>
  );
}
