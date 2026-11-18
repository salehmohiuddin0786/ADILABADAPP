import React, { useState } from 'react';
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
  User
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../shared/contexts/LanguageContext';

export default function OwnerLayout({ children, title = 'Owner Control Center' }) {
  const router = useRouter();
  const { user, isOwner, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Fallback demo merchant profile if not explicitly signed in
  const activeMerchant = (user && isOwner) ? user : {
    id: 3,
    name: 'Adilabad Media Works (Owner)',
    email: 'owner@adilabadapp.com',
    phone: '+91 98480 22334',
    role: 'owner',
    primary_role: 'BUSINESS_OWNER',
    is_demo: !user || !isOwner
  };

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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded-lg text-slate-300 hover:bg-slate-800"
          >
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <span className="font-bold text-white text-base">Owner Panel</span>
        </div>
        <Link href="/" className="text-xs font-semibold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800">
          Public Website →
        </Link>
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
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Business Entity Summary */}
        <div className="p-4 mx-3 my-2 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 font-black flex items-center justify-center text-sm border border-amber-500/30">
            {activeMerchant.name ? activeMerchant.name.charAt(0).toUpperCase() : 'B'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">{activeMerchant.name}</p>
            <span className="inline-flex items-center text-[10px] text-emerald-400 font-semibold">
              <ShieldCheck className="w-3 h-3 mr-1" /> {activeMerchant.is_demo ? 'Demo Preview Mode' : 'Approved Vendor'}
            </span>
          </div>
        </div>

        {/* Nav Links */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
          {OWNER_NAV.map((group) => (
            <div key={group.section}>
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
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
                          ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                          : item.highlight
                          ? 'text-amber-400 hover:bg-slate-900 font-bold'
                          : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : item.highlight ? 'text-amber-400' : 'text-slate-400'}`} />
                      <span className="flex-1">{item.name}</span>
                      {item.badge && (
                        <span className="bg-amber-400/20 text-amber-300 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                          {item.badge}
                        </span>
                      )}
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-slate-950" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Link */}
        <div className="p-4 border-t border-slate-900 space-y-2">
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

      {/* Main Content Viewport */}
      <main className="flex-1 flex flex-col min-w-0 pb-20 md:pb-0">
        <header className="bg-white border-b border-slate-200 px-6 py-4 hidden md:flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-slate-900">{title}</h1>
            <p className="text-xs text-slate-500">Adilabad Super App Commercial Operations</p>
          </div>
          <div className="flex items-center space-x-3">
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
          {activeMerchant.is_demo && (
            <div className="p-3.5 px-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <span className="font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                You are viewing the Owner & Merchant Portal in <strong>Preview Demo Mode</strong>.
              </span>
              <div className="flex items-center gap-2">
                <Link
                  href="/owner/login"
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold transition shadow-sm shrink-0"
                >
                  Sign In with Store Credentials
                </Link>
              </div>
            </div>
          )}
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation for Business Owner */}
      <nav
        aria-label="Owner Mobile Navigation"
        className="fixed bottom-0 inset-x-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 text-slate-300 md:hidden px-3 py-2 shadow-2xl"
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
            href="/owner/enquiries"
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-bold transition ${
              router.pathname === '/owner/enquiries' ? 'text-amber-400 font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-5 h-5 mb-0.5" />
            <span>Enquiries</span>
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
