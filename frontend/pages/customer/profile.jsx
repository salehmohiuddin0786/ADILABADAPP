import React, { useState } from 'react';
import Head from 'next/head';
import { User, Phone, Mail, MapPin, Save } from 'lucide-react';
import CustomerLayout from '../../src/panels/customer-panel/CustomerLayout';
import { useAuth } from '../../src/context/AuthContext';
import { useToast } from '../../src/context/ToastContext';

export default function CustomerProfilePage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [name, setName] = useState(user?.name || 'Local Resident');
  const [phone, setPhone] = useState(user?.phone || '+91 98480 12345');
  const [locality, setLocality] = useState('Cinema Road, Adilabad');

  const handleSave = (e) => {
    e.preventDefault();
    addToast('Profile information updated successfully!', 'success');
  };

  return (
    <CustomerLayout title="My Resident Profile">
      <Head>
        <title>My Profile — Customer Hub</title>
      </Head>

      <div className="max-w-2xl bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Personal Information</h2>
          <p className="text-xs text-slate-500 mt-0.5">Used for rental handovers and merchant contact.</p>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Adilabad Locality / Colony</label>
            <input
              type="text"
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </form>
      </div>
    </CustomerLayout>
  );
}
