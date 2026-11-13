import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  LayoutDashboard,
  Users,
  ShieldCheck,
  Tag,
  Store,
  Calendar,
  Percent,
  Layers,
  ShoppingBag,
  Wrench,
  Briefcase,
  Sparkles,
  Utensils,
  MapPin,
  Building,
  GraduationCap,
  Tractor,
  PartyPopper,
  FileText,
  Bell,
  BarChart3,
  Sliders,
  LogOut,
  Menu,
  X,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout({ children, title = 'Administrative Control Panel' }) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const ADMIN_SECTIONS = [
    {
      title: 'DASHBOARD',
      items: [
        { name: 'Overview & Metrics', href: '/admin', icon: LayoutDashboard }
      ]
    },
    {
      title: 'USERS & VERIFICATIONS',
      items: [
        { name: 'User Management', href: '/admin/users', icon: Users },
        { name: 'Owner Verification', href: '/admin/reports', icon: ShieldCheck, badge: 'KYC' }
      ]
    },
    {
      title: 'COMMERCIAL & PROMOTIONS',
      items: [
        { name: 'Advertisements', href: '/admin/advertisements', icon: Tag },
        { name: 'Verified Businesses', href: '/admin/businesses', icon: Store },
        { name: 'Events & Expos', href: '/admin/events', icon: Calendar },
        { name: 'Offers & Coupons', href: '/admin/banners', icon: Percent }
      ]
    },
    {
      title: 'RENTAL & MARKETPLACE OPERATIONS',
      items: [
        { name: 'Rentals Moderation', href: '/admin/categories', icon: Layers, highlight: true },
        { name: 'Rental Disputes & Damage', href: '/admin/reports', icon: AlertTriangle }
      ]
    },
    {
      title: 'CONTENT & NOTIFICATIONS',
      items: [
        { name: 'Notifications Push', href: '/admin/notifications', icon: Bell },
        { name: 'Platform Analytics', href: '/admin/analytics', icon: BarChart3 },
        { name: 'System Settings', href: '/admin/settings', icon: Sliders }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <span className="font-extrabold text-white text-base">Super Admin</span>
        </div>
        <Link href="/" className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-800">
          Website →
        </Link>
      </div>

      {/* Admin Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-950 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-slate-950 font-black text-sm shadow">
              A
            </div>
            <div>
              <span className="font-black text-base tracking-tight text-white">
                Admin<span className="text-emerald-400">Portal</span>
              </span>
              <p className="text-[10px] text-slate-400 font-medium">Adilabad Super App</p>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security Notice Pill */}
        <div className="mx-3 my-2 px-3 py-2 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-[11px] text-emerald-300 flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Access control & roles governed strictly by backend config.</span>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
          {ADMIN_SECTIONS.map((sec) => (
            <div key={sec.title}>
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                {sec.title}
              </span>
              <div className="space-y-0.5">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = router.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-emerald-600 text-white font-black shadow-lg shadow-emerald-900/40'
                          : item.highlight
                          ? 'text-amber-400 hover:bg-slate-900 font-bold'
                          : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-amber-400' : 'text-slate-400'}`} />
                      <span className="flex-1">{item.name}</span>
                      {item.badge && (
                        <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                          {item.badge}
                        </span>
                      )}
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/70" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            href="/"
            className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl border border-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-900 transition-colors"
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

      {/* Main Administrative Stage */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-900">
        <header className="bg-slate-950 border-b border-slate-800 px-6 py-4 hidden md:flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-white">{title}</h1>
            <p className="text-xs text-slate-400">Strict Moderation & District Operations Hub</p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-xs text-slate-400">Logged in as: <strong className="text-emerald-400">{user?.name || 'Administrator'}</strong></span>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
