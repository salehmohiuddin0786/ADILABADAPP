import React, { useState, useEffect } from 'react';
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
import PageTransition from '../../components/common/PageTransition';

export default function CustomerLayout({ children, title = 'Customer Dashboard' }) {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const { t, currentLanguage, changeLanguage, supportedLanguages } = useLanguage();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Authentication Guard
  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?redirect=${encodeURIComponent(router.asPath)}`);
    }
  }, [user, loading, router]);

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
      { name: 'Saved Offers', href: '/customer/offers', icon: ShoppingBag },
      { name: 'My Reviews', href: '/customer/reviews', icon: Star }
    ]},
    { section: 'Preferences & Security', items: [
      { name: 'Language Settings', href: '/customer/language', icon: Globe },
      { name: 'Help & Support', href: '/customer/support', icon: HelpCircle },
      { name: 'Account Security', href: '/customer/security', icon: Shield }
    ]}
  ];

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-700 animate-pulse">
            <User className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Loading Account Details</h2>
          <p className="text-sm text-slate-500">
            Validating secure session for Adilabad App Customer Portal...
          </p>
          <div className="w-48 h-1.5 bg-slate-200 rounded-full mx-auto overflow-hidden">
            <div className="w-1/2 h-full bg-emerald-600 rounded-full animate-indeterminate" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row antialiased">
      {/* Mobile Header with Safe Notification Clearance */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 safe-top-header flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100"
            aria-label="Toggle navigation menu"
          >
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <span className="font-bold text-slate-900 text-base">Customer Hub</span>
        </div>
        <div className="flex items-center space-x-2">
          <Link
            href="/customer/profile"
            className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:text-slate-900"
            title="My Profile"
          >
            <User className="w-5 h-5" />
          </Link>
          <button
            onClick={() => logout('/login')}
            className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200"
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
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
        />
      )}

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

        {/* User Card -> Links to Customer Profile */}
        <Link
          href="/customer/profile"
          onClick={() => setIsSidebarOpen(false)}
          className="p-4 mx-3 my-2 rounded-2xl bg-gradient-to-br from-emerald-50 to-slate-50 border border-emerald-100 hover:border-emerald-300 flex items-center space-x-3 transition group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white font-bold flex items-center justify-center text-sm shadow overflow-hidden group-hover:scale-105 transition">
            {user.avatar_url ? (
              <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              user.name ? user.name.charAt(0).toUpperCase() : 'U'
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-900 truncate group-hover:text-emerald-700 transition">{user.name}</p>
            <p className="text-[11px] text-slate-500 truncate">{user.phone || user.email}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition" />
        </Link>

        {/* Scrollable Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4 custom-scrollbar">
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
            onClick={() => logout('/login')}
            className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 flex flex-col min-w-0 pb-20 md:pb-0">
        <header className="bg-white border-b border-slate-200 px-6 py-4 hidden md:flex items-center justify-between sticky top-0 z-30">
          <h1 className="text-lg font-bold text-slate-900">{title}</h1>
          <div className="flex items-center space-x-4">
            <Link
              href="/customer/profile"
              className="text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              <span>My Profile</span>
            </Link>
            <Link
              href="/"
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-xl transition-colors"
            >
              ← Back to Discovery
            </Link>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto">
          <PageTransition pageKey={router.asPath}>
            {children}
          </PageTransition>
        </div>
      </main>

      {/* Mobile Bottom Navigation for Customer Portal */}
      <nav
        aria-label="Customer Mobile Navigation"
        className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200 text-slate-700 md:hidden px-3 pt-2 pb-safe shadow-2xl"
        style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom, 0.5rem))' }}
      >
        <div className="flex items-center justify-around max-w-md mx-auto">
          <Link
            href="/customer/dashboard"
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[10px] font-bold transition ${
              router.pathname === '/customer/dashboard' ? 'text-emerald-700 font-black' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span>Home</span>
          </Link>

          <Link
            href="/customer/rentals/requests"
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[10px] font-bold transition ${
              router.pathname.startsWith('/customer/rentals') ? 'text-emerald-700 font-black' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Layers className="w-5 h-5 mb-0.5" />
            <span>Rentals</span>
          </Link>

          <Link
            href="/customer/favorites"
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[10px] font-bold transition ${
              router.pathname === '/customer/favorites' ? 'text-emerald-700 font-black' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Heart className="w-5 h-5 mb-0.5" />
            <span>Saved</span>
          </Link>

          <Link
            href="/customer/profile"
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[10px] font-bold transition ${
              router.pathname === '/customer/profile' ? 'text-emerald-700 font-black' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <User className="w-5 h-5 mb-0.5" />
            <span>Profile</span>
          </Link>

          <button
            onClick={() => setIsSidebarOpen(true)}
            className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[10px] font-bold text-slate-500 hover:text-slate-900 transition"
          >
            <Menu className="w-5 h-5 mb-0.5" />
            <span>Menu</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
