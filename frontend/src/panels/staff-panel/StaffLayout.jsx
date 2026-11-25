import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import {
  Inbox,
  ShieldCheck,
  LifeBuoy,
  AlertTriangle,
  History,
  User,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ShieldAlert,
  CheckCircle2,
  Shield
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import PageTransition from '../../components/common/PageTransition';

export default function StaffLayout({ children, title = 'Staff Operations Hub' }) {
  const router = useRouter();
  const { user, isStaff, loading, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Authentication & Authorization Guard
  useEffect(() => {
    if (!loading && (!user || !isStaff)) {
      router.replace(`/login?redirect=${encodeURIComponent(router.asPath)}`);
    }
  }, [user, isStaff, loading, router]);

  const STAFF_NAV = [
    { name: 'Staff Dashboard', href: '/staff/dashboard', icon: Inbox },
    { name: 'Staff Profile', href: '/staff/profile', icon: User },
    { name: 'My Assigned Tasks', href: '/staff/tasks', icon: Inbox, badge: '3 Tasks' },
    { name: 'Assigned Moderation Queue', href: '/staff/moderation', icon: ShieldCheck, badge: '4 Pending' },
    { name: 'KYC & Verification Tasks', href: '/staff/verifications', icon: ShieldCheck },
    { name: 'Disputes & Damage Claims', href: '/staff/disputes', icon: AlertTriangle, badge: '1 Open' },
    { name: 'Customer Support Tickets', href: '/staff/support', icon: LifeBuoy },
    { name: 'My Action History', href: '/staff/history', icon: History }
  ];

  if (loading || !user || !isStaff) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto text-blue-400 animate-pulse">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">Verifying Staff Credentials</h2>
          <p className="text-sm text-slate-400">
            Validating operational credentials and task permissions for Adilabad App Staff Hub...
          </p>
          <div className="w-48 h-1.5 bg-slate-800 rounded-full mx-auto overflow-hidden">
            <div className="w-1/2 h-full bg-blue-500 rounded-full animate-indeterminate" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row antialiased">
      {/* Mobile Bar with Safe Notification Clearance */}
      <div className="md:hidden bg-slate-900 text-white px-4 py-3 safe-top-header flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded-lg text-slate-300 hover:bg-slate-800"
            aria-label="Toggle navigation menu"
          >
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <span className="font-bold text-white text-base">Staff Panel</span>
        </div>
        <div className="flex items-center space-x-2">
          <Link
            href="/staff/profile"
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            title="Staff Profile"
          >
            <User className="w-5 h-5" />
          </Link>
          <button
            onClick={() => logout('/login')}
            className="p-1.5 rounded-lg bg-rose-950/60 text-rose-400 hover:text-rose-300 border border-rose-900/50"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Staff Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm">
              S
            </div>
            <div>
              <span className="font-black text-base tracking-tight text-white">
                Staff<span className="text-blue-400">Workspace</span>
              </span>
              <p className="text-[10px] text-slate-400 font-medium">Assigned Tasks Only</p>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Assigned Staff Identity -> Links to Profile */}
        <Link
          href="/staff/profile"
          onClick={() => setIsSidebarOpen(false)}
          className="p-4 mx-3 my-2 rounded-2xl bg-slate-800/80 border border-slate-700 hover:border-blue-500/50 flex items-center space-x-3 transition group"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-xs overflow-hidden group-hover:border group-hover:border-blue-400 transition">
            {user.avatar_url ? (
              <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              user.name ? user.name.charAt(0).toUpperCase() : 'S'
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate group-hover:text-blue-300 transition">{user.name}</p>
            <p className="text-[10px] text-blue-300 truncate">Role: {user.role?.toUpperCase()} • Profile</p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition" />
        </Link>

        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1 custom-scrollbar">
          {STAFF_NAV.map((item) => {
            const Icon = item.icon;
            const isActive = router.pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold shadow'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="flex-1">{item.name}</span>
                {item.badge && (
                  <span className="bg-blue-500/20 text-blue-300 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                    {item.badge}
                  </span>
                )}
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/70" />}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            href="/"
            className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl border border-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-800 transition-colors"
          >
            <span>Exit to Public Website</span>
          </Link>
          <button
            onClick={() => logout('/login')}
            className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl text-rose-400 hover:bg-rose-950/30 text-xs font-bold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50 pb-20 md:pb-0">
        <header className="bg-white border-b border-slate-200 px-6 py-4 hidden md:flex items-center justify-between sticky top-0 z-30">
          <div>
            <h1 className="text-lg font-bold text-slate-900">{title}</h1>
            <p className="text-xs text-slate-500">Moderation and Dispute Resolution Workspace</p>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              href="/staff/profile"
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5"
            >
              <User className="w-4 h-4 text-blue-600" />
              <span>Staff Profile</span>
            </Link>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto space-y-4">
          <PageTransition pageKey={router.asPath}>
            {children}
          </PageTransition>
        </div>
      </main>

      {/* Mobile Bottom Navigation for Staff Workspace */}
      <nav
        aria-label="Staff Mobile Navigation"
        className="fixed bottom-0 inset-x-0 z-40 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 text-slate-300 md:hidden px-3 pt-2 pb-safe shadow-2xl"
        style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom, 0.5rem))' }}
      >
        <div className="flex items-center justify-around max-w-md mx-auto">
          <Link
            href="/staff/dashboard"
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[10px] font-bold transition ${
              router.pathname === '/staff/dashboard' ? 'text-blue-400 font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Inbox className="w-5 h-5 mb-0.5" />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/staff/tasks"
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[10px] font-bold transition ${
              router.pathname === '/staff/tasks' ? 'text-blue-400 font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-5 h-5 mb-0.5" />
            <span>Tasks</span>
          </Link>

          <Link
            href="/staff/profile"
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[10px] font-bold transition ${
              router.pathname === '/staff/profile' ? 'text-blue-400 font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-5 h-5 mb-0.5" />
            <span>Profile</span>
          </Link>

          <button
            onClick={() => setIsSidebarOpen(true)}
            className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[10px] font-bold text-slate-400 hover:text-white transition"
          >
            <Menu className="w-5 h-5 mb-0.5" />
            <span>Menu</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
