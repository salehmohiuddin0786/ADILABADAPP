import React, { useState } from 'react';
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
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function StaffLayout({ children, title = 'Staff Operations Hub' }) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const STAFF_NAV = [
    { name: 'Staff Dashboard', href: '/staff/dashboard', icon: Inbox },
    { name: 'My Assigned Tasks', href: '/staff/tasks', icon: Inbox, badge: '3 Tasks' },
    { name: 'Assigned Moderation Queue', href: '/staff/moderation', icon: ShieldCheck, badge: '4 Pending' },
    { name: 'KYC & Verification Tasks', href: '/staff/verifications', icon: ShieldCheck },
    { name: 'Disputes & Damage Claims', href: '/staff/disputes', icon: AlertTriangle, badge: '1 Open' },
    { name: 'Customer Support Tickets', href: '/staff/support', icon: LifeBuoy },
    { name: 'My Action History', href: '/staff/history', icon: History },
    { name: 'Staff Profile', href: '/staff/profile', icon: User }
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Mobile Bar */}
      <div className="md:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded-lg text-slate-300 hover:bg-slate-800"
          >
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <span className="font-bold text-white text-base">Staff Panel</span>
        </div>
        <Link href="/" className="text-xs font-semibold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800">
          Website →
        </Link>
      </div>

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

        {/* Assigned Staff Identity */}
        <div className="p-4 mx-3 my-2 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-xs">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">{user?.name || 'Assigned Moderator'}</p>
            <p className="text-[10px] text-blue-300">Role: SUPPORT_STAFF</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
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
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl text-rose-400 hover:bg-rose-950/30 text-xs font-bold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50">
        <header className="bg-white border-b border-slate-200 px-6 py-4 hidden md:flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-slate-900">{title}</h1>
            <p className="text-xs text-slate-500">Moderation and Dispute Resolution Workspace</p>
          </div>
          <div className="text-xs text-slate-500">
            Adilabad District Support Desk
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
