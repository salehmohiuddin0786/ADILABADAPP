import React, { useState } from 'react';
import Head from 'next/head';
import { User, Mail, Phone, MapPin, Building, ShieldCheck, CheckCircle2, Save } from 'lucide-react';
import OwnerLayout from '../../src/panels/owner-panel/OwnerLayout';
import { useAuth } from '../../src/context/AuthContext';
import { useToast } from '../../src/context/ToastContext';

export default function OwnerProfilePage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [profile, setProfile] = useState({
    name: user?.name || 'Syed Usama',
    businessName: 'Adilabad Media Works & Camera Rentals',
    email: user?.email || 'owner@adilabadapp.com',
    phone: user?.phone || '+91 98480 22334',
    address: 'Opp. Geeta Theatre, Cinema Road, Adilabad, Telangana 504001',
    gstin: '36AABCU9603R1ZM',
    category: 'Commercial Partner (Tier-1)',
    bio: 'Authorized multi-equipment rental provider, commercial wedding photography, and drone media solutions serving Adilabad and surrounding mandals.'
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      showToast('Owner commercial profile updated successfully!', 'success');
    }, 600);
  };

  return (
    <OwnerLayout title="Owner Profile & Business Identity">
      <Head>
        <title>Owner Profile — Adilabad App</title>
      </Head>

      <div className="max-w-3xl space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Commercial Account Profile</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Your verified identity displayed across your business listings, rental handovers, and lead notifications.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
            <div className="w-16 h-16 rounded-2xl bg-amber-500 text-slate-950 font-black text-2xl flex items-center justify-center shadow-md">
              {profile.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-base">{profile.name}</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  KYC Verified
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{profile.businessName}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Legal Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Business / Firm Name</label>
              <input
                type="text"
                value={profile.businessName}
                onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Contact Phone</label>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Business Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none"
                required
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block font-bold text-slate-700 mb-1">Official Address</label>
            <input
              type="text"
              value={profile.address}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none"
              required
            />
          </div>

          <div className="text-xs">
            <label className="block font-bold text-slate-700 mb-1">About Your Commercial Services</label>
            <textarea
              rows={3}
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-md transition flex items-center gap-1.5 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Update Commercial Profile'}</span>
            </button>
          </div>
        </form>
      </div>
    </OwnerLayout>
  );
}
