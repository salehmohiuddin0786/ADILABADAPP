import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import {
  Store,
  Lock,
  Mail,
  User,
  Phone,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Building,
  Layers,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../src/context/AuthContext';
import { useToast } from '../../src/context/ToastContext';

export default function OwnerLoginPage() {
  const router = useRouter();
  const { login, register, user, isOwner, isLoggedIn } = useAuth();
  const { addToast } = useToast();

  const [tab, setTab] = useState(router.query.tab === 'register' ? 'register' : 'login');

  // Sign In state
  const [email, setEmail] = useState('owner@adilabadapp.com');
  const [password, setPassword] = useState('Owner@123456');

  // Registration state
  const [regName, setRegName] = useState('');
  const [regBusiness, setRegBusiness] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (router.query.tab === 'register') {
      setTab('register');
    }
  }, [router.query.tab]);

  useEffect(() => {
    if (isLoggedIn && isOwner) {
      router.replace(router.query.redirect || '/owner/dashboard');
    }
  }, [isLoggedIn, isOwner, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await login(email, password);
    setSubmitting(false);

    if (res.success) {
      addToast('Welcome to Adilabad Owner Control Center!', 'success');
      router.push(router.query.redirect || '/owner/dashboard');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await register(
      regBusiness ? `${regBusiness} (${regName})` : regName,
      regEmail,
      regPhone,
      regPassword,
      'owner'
    );
    setSubmitting(false);

    if (res.success) {
      addToast('Business Owner account created! Welcome to your Control Center.', 'success');
      router.push('/owner/dashboard');
    }
  };

  return (
    <>
      <Head>
        <title>Owner & Merchant Portal Login — Adilabad App</title>
        <meta
          name="description"
          content="Login or register as an Adilabad business owner, rental operator, or service provider."
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/40 text-white flex flex-col justify-center items-center p-4 relative">
        {/* Navigation back */}
        <div className="w-full max-w-md flex items-center justify-between mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Public Website</span>
          </Link>
          <Link
            href="/admin/login"
            className="text-xs font-semibold text-amber-400/80 hover:text-amber-300 transition"
          >
            Admin Portal &rarr;
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/90 backdrop-blur-xl border border-amber-500/20 rounded-3xl p-6 sm:p-10 max-w-md w-full shadow-2xl relative overflow-hidden"
        >
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Store className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              Adilabad <span className="text-amber-400">Owner Portal</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-semibold">
              Businesses • Rentals • Inventory • Classifieds
            </p>
          </div>

          {/* Quick Demo Pill */}
          <div className="mb-6 p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/30 flex items-center justify-between text-xs">
            <div className="space-y-0.5">
              <span className="font-bold text-amber-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Demo Merchant Credentials
              </span>
              <p className="text-slate-400 font-mono text-[11px]">owner@adilabadapp.com / Owner@123456</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEmail('owner@adilabadapp.com');
                setPassword('Owner@123456');
                setTab('login');
              }}
              className="px-2.5 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition"
            >
              Fill Demo
            </button>
          </div>

          {/* Tab Selector */}
          <div className="flex rounded-xl bg-slate-950/60 p-1 mb-6 border border-slate-800">
            <button
              type="button"
              onClick={() => setTab('login')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition ${
                tab === 'login'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Owner Sign In
            </button>
            <button
              type="button"
              onClick={() => setTab('register')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition ${
                tab === 'register'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Register New Owner
            </button>
          </div>

          {/* SIGN IN FORM */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Owner Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="owner@adilabadapp.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              >
                {submitting ? 'Verifying Credentials...' : 'Sign In to Owner Center'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* REGISTER AS OWNER FORM */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Full Name / Contact Person *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Ramesh Reddy"
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Business / Store / Rental Name *
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={regBusiness}
                    onChange={(e) => setRegBusiness(e.target.value)}
                    placeholder="e.g. Adilabad Media Works"
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="business@adilabadapp.com"
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Phone (WhatsApp preferred) *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+91 98480 22334"
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Password (min 6 characters) *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              >
                {submitting ? 'Creating Account...' : 'Register as Business Owner'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Footer Info */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
            <p className="text-xs text-slate-400">
              Looking for regular resident browsing?{' '}
              <Link href="/login" className="text-amber-400 hover:underline font-semibold">
                Customer Sign In
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
}
