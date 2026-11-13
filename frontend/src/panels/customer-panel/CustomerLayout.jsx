import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  User,
  Heart,
  Clock,
  Store,
  MessageSquare,
  Layers,
  ShoppingBag,
  Wrench,
  Briefcase,
  Building,
  Calendar,
  Star,
  Bell,
  Globe,
  HelpCircle,
  Shield,
  LogOut,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../shared/contexts/LanguageContext';

export default function CustomerLayout({ children, title = 'Customer Dashboard' }) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { t, currentLanguage, changeLanguage, supportedLanguages } = useLanguage();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const CUSTOMER_NAV = [
    { section: 'Overview', items: [
      { name: 'Dashboard', href: '/customer/dashboard', icon: Home },
      { name: 'My Profile', href: '/customer/profile', icon: User },
      { name: 'Notifications', href: '/customer/notifications', icon: Bell }
    ]},
    { section: 'Rentals & Marketplace', items: [
      { name: 'My Rental Requests', href: '/customer/rentals/requests', icon: Layers, highlight: true },
      { name: 'Active Rentals', href: '/customer/rentals/active', icon: Layers },
      { name: 'Rental History', href: '/customer/rentals/history', icon: Clock },
      { name: 'My Buy & Sell Listings', href: '/customer/buy-sell', icon: ShoppingBag }
    ]},
    { section: 'Engagement & Requests', items: [
      { name: 'My Favourites', href: '/customer/favorites', icon: Heart },
      { name: 'Recently Viewed', href: '/customer/recently-viewed', icon: Clock },
      { name: 'Followed Businesses', href: '/customer/followed-businesses', icon: Store },
      { name: 'General Enquiries', href: '/customer/enquiries', icon: MessageSquare },
      { name: 'Service Requests', href: '/customer/services', icon: Wrench },
      { name: 'Job Applications', href: '/customer/jobs', icon: Briefcase },
      { name: 'Property Enquiries', href: '/customer/properties', icon: Building },
      { name: 'Event Enquiries', href: '/customer/events', icon: Calendar },
      { name: 'My Reviews', href: '/customer/reviews', icon: Star }
    ]},
    { section: 'Preferences & Security', items: [
      { name: 'Language Settings', href: '/customer/language', icon: Globe },
      { name: 'Help & Support', href: '/customer/support', icon: HelpCircle },
      { name: 'Account Security', href: '/customer/security', icon: Shield }
    ]}
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100"
          >
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <span className="font-bold text-slate-900 text-base">Customer Hub</span>
        </div>
        <Link href="/" className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
          Exit to Website →
        </Link>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-800 to-emerald-600 flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-emerald-900/20">
              A
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-slate-900">
                Customer<span className="text-emerald-700">Panel</span>
              </span>
              <p className="text-[10px] text-slate-500 font-medium">Adilabad Super App</p>
            </div>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="p-4 mx-3 my-2 rounded-2xl bg-gradient-to-br from-emerald-50 to-slate-50 border border-emerald-100 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white font-bold flex items-center justify-center text-sm shadow">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-900 truncate">{user?.name || 'Customer'}</p>
            <p className="text-[11px] text-slate-500 truncate">{user?.phone || user?.email || 'Adilabad Resident'}</p>
          </div>
        </div>

        {/* Scrollable Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
          {CUSTOMER_NAV.map((group) => (
            <div key={group.section}>
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                {group.section}
              </span>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = router.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-emerald-800 text-white shadow-sm'
                          : item.highlight
                          ? 'text-amber-700 hover:bg-amber-50 font-bold'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-amber-600' : 'text-slate-400'}`} />
                      <span className="flex-1">{item.name}</span>
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/70" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 space-y-2">
          <Link
            href="/"
            className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <span>Public Website</span>
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 px-6 py-4 hidden md:flex items-center justify-between">
          <h1 className="text-lg font-bold text-slate-900">{title}</h1>
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-xl transition-colors"
            >
              ← Back to Discovery
            </Link>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
