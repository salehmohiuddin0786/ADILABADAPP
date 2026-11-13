import React, { useState } from 'react';
import Head from 'next/head';
import { Shield, Lock, Save } from 'lucide-react';
import CustomerLayout from '../../src/panels/customer-panel/CustomerLayout';
import { useToast } from '../../src/context/ToastContext';

export default function CustomerSecurityPage() {
  const { addToast } = useToast();
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');

  const handleUpdate = (e) => {
    e.preventDefault();
    addToast('Account password updated securely!', 'success');
    setCurrentPass('');
    setNewPass('');
  };

  return (
    <CustomerLayout title="Account Security">
      <Head>
        <title>Security — Customer Hub</title>
      </Head>

      <div className="space-y-6 max-w-xl">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Password & Session Security</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage your secret password and active device sessions.</p>
        </div>

        <form onSubmit={handleUpdate} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Current Password</label>
            <input
              type="password"
              required
              value={currentPass}
              onChange={(e) => setCurrentPass(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">New Password (min 6 characters)</label>
            <input
              type="password"
              required
              minLength={6}
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
          >
            <Lock className="w-4 h-4" /> Change Password
          </button>
        </form>
      </div>
    </CustomerLayout>
  );
}
