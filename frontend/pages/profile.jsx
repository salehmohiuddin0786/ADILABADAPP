import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { User, Phone, Mail, Bookmark, Bell, Shield, LogOut, CheckCircle2 } from 'lucide-react';
import MainLayout from '../src/components/layout/MainLayout';
import { useAuth } from '../src/context/AuthContext';
import { useToast } from '../src/context/ToastContext';
import { apiFetch } from '../src/utils/api';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoggedIn, isAdmin, logout, refreshUser, loading } = useAuth();
  const { addToast } = useToast();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.replace('/login');
    }
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
    }
  }, [user, isLoggedIn, loading, router]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await apiFetch('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify({ name, phone })
      });
      if (res.success) {
        addToast('Profile updated successfully!', 'success');
        refreshUser();
      }
    } catch (error) {
      addToast(error.message || 'Failed to update profile', 'error');
    } finally {
      setUpdating(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>My Profile — Adilabad App</title>
      </Head>

      <div className="bg-slate-50 py-10 sm:py-16 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
              Account Overview
            </span>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
              User Profile
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Sidebar info */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center text-3xl font-black mb-4">
                {user.name?.charAt(0) || 'U'}
              </div>

              <h3 className="font-bold text-slate-900 text-lg">{user.name}</h3>
              <p className="text-xs text-slate-500">{user.email}</p>

              {isAdmin ? (
                <span className="mt-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                  System Administrator
                </span>
              ) : (
                <span className="mt-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                  Member
                </span>
              )}

              <div className="w-full pt-6 mt-6 border-t border-slate-100 space-y-2 text-left text-xs">
                <Link
                  href="/favorites"
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 font-medium"
                >
                  <span className="flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-brand-600" />
                    Saved Favorites
                  </span>
                  <span className="font-bold text-brand-600">{user.favorites_count || 0}</span>
                </Link>

                {isAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-brand-50 text-brand-700 font-bold"
                  >
                    <Shield className="w-4 h-4 text-brand-600" />
                    Open Admin Dashboard
                  </Link>
                )}

                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2 p-2.5 rounded-xl text-rose-600 hover:bg-rose-50 transition font-medium text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>

            {/* Profile update form */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
                <h3 className="font-bold text-slate-900 text-lg mb-4">Profile Settings</h3>

                <form onSubmit={handleUpdate} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Email Address (Permanent)
                    </label>
                    <input
                      type="email"
                      disabled
                      value={user.email}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 text-slate-500 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98480 12345"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={updating}
                    className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md transition disabled:opacity-50"
                  >
                    {updating ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              </div>

              {/* Informative Platform Rule Card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm text-xs text-slate-600 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-600" />
                  Account Permissions & Platform Rules
                </h4>
                <p className="leading-relaxed">
                  Adilabad App operates as a verified private local platform. In accordance with platform guidelines, <strong>all advertisements, business directory profiles, and events are curated and published exclusively by administrators</strong>.
                </p>
                <p className="leading-relaxed text-slate-500">
                  Members enjoy instant bookmarking, direct calling, WhatsApp messaging, and verified notifications.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

ProfilePage.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};
