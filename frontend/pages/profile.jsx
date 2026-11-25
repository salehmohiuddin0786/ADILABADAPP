import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  User,
  Phone,
  Mail,
  Bookmark,
  Bell,
  Shield,
  ShieldCheck,
  Store,
  Briefcase,
  LogOut,
  CheckCircle2,
  Save,
  KeyRound,
  Camera,
  Eye,
  EyeOff,
  MapPin,
  Clock
} from 'lucide-react';
import MainLayout from '../src/components/layout/MainLayout';
import { useAuth } from '../src/context/AuthContext';
import { useToast } from '../src/context/ToastContext';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoggedIn, isAdmin, isOwner, isStaff, logout, updateProfile, changePassword, uploadAvatar, refreshUser, loading } = useAuth();
  const { addToast } = useToast();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    bio: ''
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  const [updating, setUpdating] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.replace('/login');
    }
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        bio: user.bio || ''
      });
    }
  }, [user, isLoggedIn, loading, router]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      addToast('Name is required.', 'error');
      return;
    }
    setUpdating(true);
    const res = await updateProfile(formData);
    setUpdating(false);
    if (res.success) {
      await refreshUser();
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwordData.current_password || !passwordData.new_password) {
      addToast('Please enter both current and new passwords.', 'error');
      return;
    }
    if (passwordData.new_password.length < 6) {
      addToast('New password must be at least 6 characters.', 'error');
      return;
    }
    if (passwordData.new_password !== passwordData.confirm_password) {
      addToast('New password and confirm password do not match.', 'error');
      return;
    }

    setSavingPassword(true);
    const res = await changePassword(passwordData.current_password, passwordData.new_password);
    setSavingPassword(false);
    if (res.success) {
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast('Please select a valid image file (PNG, JPG, WEBP).', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      addToast('Image size must be less than 5MB.', 'error');
      return;
    }

    setUploadingAvatar(true);
    const res = await uploadAvatar(file);
    setUploadingAvatar(false);
    if (res.success) {
      await refreshUser();
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

      <div className="bg-slate-50 py-8 sm:py-12 min-h-screen antialiased">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
              Account Overview
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              User Profile & Security
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* Sidebar Summary Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col items-center text-center space-y-4">
              <div className="relative group">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-500 text-white flex items-center justify-center text-3xl font-black shadow-md overflow-hidden">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user.name?.charAt(0).toUpperCase() || 'U'
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-brand-400 border border-slate-700 shadow-md transition disabled:opacity-50"
                  title="Upload Profile Photo"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>

              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">{user.name}</h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">{user.email}</p>
                <div className="mt-2 flex flex-wrap justify-center gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 text-[10px] font-bold uppercase tracking-wider border border-brand-200">
                    Role: {user.role?.toUpperCase()}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider border border-emerald-200">
                    Active
                  </span>
                </div>
              </div>

              {/* Navigation Panels Links */}
              <div className="w-full pt-4 border-t border-slate-100 space-y-2 text-left text-xs">
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 text-white font-bold hover:bg-slate-900 transition"
                  >
                    <Shield className="w-4 h-4 text-brand-400" />
                    <span>Open Super Admin Center</span>
                  </Link>
                )}

                {isOwner && (
                  <Link
                    href="/owner/dashboard"
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/10 text-amber-900 font-bold hover:bg-amber-500/20 transition border border-amber-500/30"
                  >
                    <Store className="w-4 h-4 text-amber-600" />
                    <span>Open Business Owner Portal</span>
                  </Link>
                )}

                {isStaff && (
                  <Link
                    href="/staff/dashboard"
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-50 text-blue-800 font-bold hover:bg-blue-100 transition border border-blue-200"
                  >
                    <Briefcase className="w-4 h-4 text-blue-600" />
                    <span>Open Staff Operations Hub</span>
                  </Link>
                )}

                <Link
                  href="/customer/dashboard"
                  className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 font-semibold"
                >
                  <User className="w-4 h-4 text-slate-500" />
                  <span>Customer Dashboard</span>
                </Link>

                <Link
                  href="/favorites"
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 font-semibold"
                >
                  <span className="flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-brand-600" />
                    Saved Favorites
                  </span>
                  <span className="font-bold text-brand-600">{user.favorites_count || 0}</span>
                </Link>

                <button
                  onClick={() => logout('/login')}
                  className="w-full flex items-center gap-2 p-2.5 rounded-xl text-rose-600 hover:bg-rose-50 transition font-bold text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out Securely
                </button>
              </div>
            </div>

            {/* Profile Forms Section */}
            <div className="md:col-span-2 space-y-6">
              {/* Profile Details Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="font-bold text-slate-900 text-base">Account Information</h2>
                  <p className="text-xs text-slate-500">Update your personal contact details</p>
                </div>

                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Email Address (Permanent)
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        disabled
                        value={user.email}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 text-slate-500 cursor-not-allowed outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98480 12345"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Adilabad Address / Locality
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Cinema Road, Shivaji Chowk, etc."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={updating}
                    className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition flex items-center gap-2 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{updating ? 'Saving...' : 'Save Profile Changes'}</span>
                  </button>
                </form>
              </div>

              {/* Password Change Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="font-bold text-slate-900 text-base">Change Password</h2>
                  <p className="text-xs text-slate-500">Ensure your account uses a strong unique password</p>
                </div>

                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Current Password
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type={showCurrentPass ? 'text' : 'password'}
                        value={passwordData.current_password}
                        onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                        required
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPass(!showCurrentPass)}
                        className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                      >
                        {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      New Password (min 6 characters)
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type={showNewPass ? 'text' : 'password'}
                        value={passwordData.new_password}
                        onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                        required
                        minLength={6}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPass(!showNewPass)}
                        className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                      >
                        {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="password"
                        value={passwordData.confirm_password}
                        onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                        required
                        minLength={6}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={savingPassword}
                    className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition flex items-center gap-2 disabled:opacity-50"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>{savingPassword ? 'Updating...' : 'Update Password'}</span>
                  </button>
                </form>
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
