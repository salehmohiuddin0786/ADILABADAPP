import React, { useState } from 'react';
import Head from 'next/head';
import { Settings, Save, Bell, Shield, Phone, Mail } from 'lucide-react';
import OwnerLayout from '../../src/panels/owner-panel/OwnerLayout';
import { useToast } from '../../src/context/ToastContext';

export default function OwnerSettingsPage() {
  const { addToast } = useToast();
  const [storePhone, setStorePhone] = useState('+91 98480 22334');
  const [storeEmail, setStoreEmail] = useState('owner@adilabadapp.com');
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [autoDeclineExpired, setAutoDeclineExpired] = useState(true);

  const handleSave = (e) => {
    e.preventDefault();
    addToast('Merchant settings saved successfully!', 'success');
  };

  return (
    <OwnerLayout title="Merchant & Store Settings">
      <Head>
        <title>Settings — Adilabad Owner Portal</title>
      </Head>

      <div className="space-y-6 max-w-4xl">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Control Center Preferences</h2>
          <p className="text-xs text-slate-500 mt-0.5">Configure booking notifications, phone numbers, and operational preferences.</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Contact & Communication</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Public Merchant Phone</label>
                <input
                  type="text"
                  value={storePhone}
                  onChange={(e) => setStorePhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Notification Email</label>
                <input
                  type="email"
                  value={storeEmail}
                  onChange={(e) => setStoreEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Automation & Rental Policies</h3>

            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={whatsappAlerts}
                  onChange={(e) => setWhatsappAlerts(e.target.checked)}
                  className="w-4 h-4 text-amber-500 rounded border-slate-300 focus:ring-amber-400"
                />
                <span className="text-xs font-semibold text-slate-700">
                  Send instant WhatsApp alerts when a new rental proposal is submitted
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoDeclineExpired}
                  onChange={(e) => setAutoDeclineExpired(e.target.checked)}
                  className="w-4 h-4 text-amber-500 rounded border-slate-300 focus:ring-amber-400"
                />
                <span className="text-xs font-semibold text-slate-700">
                  Auto-release item reservation if customer does not confirm within 24 hours of start date
                </span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Preferences
          </button>
        </form>
      </div>
    </OwnerLayout>
  );
}
