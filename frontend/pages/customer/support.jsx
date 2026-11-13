import React from 'react';
import Head from 'next/head';
import { HelpCircle, Phone, Mail, ShieldAlert } from 'lucide-react';
import CustomerLayout from '../../src/panels/customer-panel/CustomerLayout';

export default function CustomerSupportPage() {
  return (
    <CustomerLayout title="Help & Support Desk">
      <Head>
        <title>Help & Support — Customer Hub</title>
      </Head>

      <div className="space-y-6 max-w-2xl">
        <div>
          <h2 className="text-xl font-bold text-slate-900">District Resident Assistance</h2>
          <p className="text-xs text-slate-500 mt-0.5">Need help with a rental booking, merchant dispute, or technical question?</p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Adilabad App Operations Helpline</h3>
              <p className="text-xs text-slate-500">Available Monday — Saturday, 9:00 AM — 7:00 PM</p>
              <a href="tel:+919440112345" className="text-emerald-700 font-black text-sm block mt-0.5">
                +91 94401 12345
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Email Support</h3>
              <p className="text-xs text-slate-500">For complaints, scam reporting, and merchant verifications</p>
              <a href="mailto:support@adilabadapp.com" className="text-brand-600 font-bold text-xs block mt-0.5">
                support@adilabadapp.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}
