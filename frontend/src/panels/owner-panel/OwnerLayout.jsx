import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  ShieldCheck,
  Store,
  Tag,
  Layers,
  PlusCircle,
  Inbox,
  Calendar,
  Clock,
  RotateCcw,
  ShoppingBag,
  Wrench,
  Briefcase,
  Building,
  Utensils,
  GraduationCap,
  Tractor,
  PartyPopper,
  Sparkles,
  Percent,
  MessageSquare,
  Star,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  AlertTriangle,
  User,
  Shield
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../shared/contexts/LanguageContext';
import PageTransition from '../../components/common/PageTransition';

export default function OwnerLayout({ children, title = 'Owner Control Center' }) {
  const router = useRouter();
  const { user, isOwner, loading, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Authentication & Authorization Guard
  useEffect(() => {
    if (!loading && (!user || !isOwner)) {
      router.replace(`/owner/login?redirect=${encodeURIComponent(router.asPath)}`);
    }
  }, [user, isOwner, loading, router]);

  const OWNER_NAV = [
    {
      section: 'Command Center',
      items: [
        { name: 'Owner Dashboard', href: '/owner/dashboard', icon: LayoutDashboard },
        { name: 'My Profile', href: '/owner/profile', icon: User },
        { name: 'Verification & KYC', href: '/owner/verification', icon: ShieldCheck, badge: 'Verified' },
        { name: 'Business Profiles', href: '/owner/businesses', icon: Store },
        { name: 'Advertisements', href: '/owner/advertisements', icon: Tag }
      ]
    },
    {
      section: 'Rentals & Inventory',
      items: [
        { name: 'My Rental Items', href: '/owner/rentals', icon: Layers },
        { name: 'Add Rental Item', href: '/owner/rentals/create', icon: PlusCircle, highlight: true },
        { name: 'Rental Requests', href: '/owner/rental-requests', icon: Inbox, badge: '2 New' },
        { name: 'Booking Calendar', href: '/owner/booking-calendar', icon: Calendar },
        { name: 'Active Rentals', href: '/owner/rentals/active', icon: Clock },
        { name: 'Return Management', href: '/owner/rentals/returns', icon: RotateCcw }
      ]
    },
    {
      section: 'Multi-Niche Listings',
      items: [
        { name: 'Buy & Sell Listings', href: '/owner/buy-sell', icon: ShoppingBag },
        { name: 'Service Listings', href: '/owner/services', icon: Wrench },
        { name: 'Job Postings', href: '/owner/jobs', icon: Briefcase },
        { name: 'Property Listings', href: '/owner/properties', icon: Building },
        { name: 'Restaurant Profiles', href: '/owner/restaurants', icon: Utensils },
        { name: 'Education Listings', href: '/owner/education', icon: GraduationCap },
        { name: 'Agricultural Listings', href: '/owner/agriculture', icon: Tractor },
        { name: 'Wedding Services', href: '/owner/weddings', icon: PartyPopper },
        { name: 'My Events', href: '/owner/events', icon: Sparkles },
        { name: 'My Offers & Coupons', href: '/owner/offers', icon: Percent }
      ]
    },
    {
      section: 'Interactions & Intelligence',
      items: [
        { name: 'Customer Enquiries', href: '/owner/enquiries', icon: MessageSquare },
        { name: 'Customer Reviews', href: '/owner/reviews', icon: Star },
        { name: 'Listing Analytics', href: '/owner/analytics', icon: BarChart3 },
        { name: 'Notifications', href: '/owner/notifications', icon: Bell },
        { name: 'Settings', href: '/owner/settings', icon: Settings }
      ]
    }
  ];

  const isActive = (href) => {
    if (href === '/owner/dashboard') return router.pathname === '/owner/dashboard';
    return router.pathname === href || router.pathname.startsWith(`${href}/`);
  };

  if (loading || !user || !isOwner) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-400 animate-pulse">
            <Store className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">Verifying Owner Credentials</h2>
          <p className="text-sm text-slate-400">
            Validating merchant session and permissions for Adilabad App Business Owner Center...
          </p>
          <div className="w-48 h-1.5 bg-slate-800 rounded-full mx-auto overflow-hidden">
            <div className="w-1/2 h-full bg-amber-500 rounded-full animate-indeterminate" />
          </div>
        </div>
      </div>
    );
  }

  const activeMerchant = user;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row antialiased">
      {/* Mobile Top Bar with Safe Notification Clearance */}
      <div className="md:hidden bg-slate-900 text-white px-4 py-3 safe-top-header flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded-lg text-slate-300 hover:bg-slate-800"
            aria-label="Toggle navigation menu"
          >
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <span className="font-bold text-white text-base">Owner Panel</span>
        </div>
        <div className="flex items-center space-x-2">
          <Link
            href="/owner/profile"
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            title="My Profile"
          >
            <User className="w-5 h-5" />
          </Link>
          <button
            onClick={() => logout('/owner/login')}
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

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-950 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-900 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-slate-950 font-black text-sm shadow-md">
              O
            </div>
            <div>
              <span className="font-black text-base tracking-tight text-white">
                Owner<span className="text-amber-400">Portal</span>
              </span>
              <p className="text-[10px] text-slate-500 font-medium">Business & Rental Manager</p>
            </div>
          </Link>
        </div>

        {/* Authenticated Owner Profile Badge -> Links to Owner Profile */}
        <Link
          href="/owner/profile"
          onClick={() => setIsSidebarOpen(false)}
          className="mx-3 mt-3 p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 flex items-center space-x-3 transition group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden group-hover:border group-hover:border-amber-400 transition">
            {activeMerchant.avatar_url ? (
              <img src={activeMerchant.avatar_url} alt={activeMerchant.name} className="w-full h-full object-cover" />
            ) : (
              activeMerchant.name ? activeMerchant.name.charAt(0).toUpperCase() : 'O'
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate group-hover:text-amber-300 transition">{activeMerchant.name}</p>
            <p className="text-[10px] text-slate-400 truncate">{activeMerchant.email}</p>
            <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300">
              OWNER • Profile
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 transition" />
        </Link>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 custom-scrollbar">
          {OWNER_NAV.map((group) => (
            <div key={group.section}>
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                {group.section}
              </span>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                        active
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                          : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-slate-950' : 'text-slate-400'}`} />
                      <span className="flex-1 truncate">{item.name}</span>
                      {item.badge && (
                        <span className="px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-slate-900 space-y-2">
          <Link
            href="/"
            className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition"
          >
            <span>Switch to Public Website</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={() => logout('/owner/login')}
            className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl text-rose-400 hover:bg-rose-950/30 text-xs font-semibold transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Account</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 pb-20 md:pb-0">
        <header className="bg-white border-b border-slate-200 px-6 py-4 hidden md:flex items-center justify-between sticky top-0 z-30">
          <div>
            <h1 className="text-lg font-black text-slate-900 tracking-tight">{title}</h1>
            <p className="text-xs text-slate-500">Adilabad District Hyperlocal Merchant Ecosystem</p>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              href="/owner/profile"
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5"
            >
              <User className="w-4 h-4 text-amber-600" />
              <span>My Profile</span>
            </Link>
            <Link
              href="/owner/rentals/create"
              className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-sm transition-all flex items-center space-x-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add New Rental Item</span>
            </Link>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto space-y-6">
          <PageTransition pageKey={router.asPath}>
            {children}
          </PageTransition>
        </div>
      </main>

      {/* Mobile Bottom Navigation for Business Owner */}
      <nav
        aria-label="Owner Mobile Navigation"
        className="fixed bottom-0 inset-x-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 text-slate-300 md:hidden px-3 pt-2 pb-safe shadow-2xl"
        style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom, 0.5rem))' }}
      >
        <div className="flex items-center justify-around max-w-md mx-auto">
          <Link
            href="/owner/dashboard"
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-bold transition ${
              router.pathname === '/owner/dashboard' ? 'text-amber-400 font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-5 h-5 mb-0.5" />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/owner/rentals"
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-bold transition ${
              router.pathname === '/owner/rentals' ? 'text-amber-400 font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-5 h-5 mb-0.5" />
            <span>Rentals</span>
          </Link>

          <Link
            href="/owner/rentals/create"
            className="flex flex-col items-center justify-center -mt-4"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/25">
              <PlusCircle className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black text-amber-400 mt-1">Add Item</span>
          </Link>

          <Link
            href="/owner/profile"
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-bold transition ${
              router.pathname === '/owner/profile' ? 'text-amber-400 font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-5 h-5 mb-0.5" />
            <span>Profile</span>
          </Link>

          <button
            onClick={() => setIsSidebarOpen(true)}
            className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-bold text-slate-400 hover:text-white transition"
          >
            <Menu className="w-5 h-5 mb-0.5" />
            <span>Menu</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
