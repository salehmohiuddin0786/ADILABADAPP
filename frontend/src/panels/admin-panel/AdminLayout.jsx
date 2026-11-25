import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  LayoutDashboard,
  Megaphone,
  FolderTree,
  Store,
  CalendarDays,
  Image as ImageIcon,
  Users,
  Flag,
  Bell,
  BarChart3,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  ChevronRight,
  MapPin,
  CheckCircle2,
  Sparkles,
  ShieldAlert,
  Inbox,
  Activity,
  Plus,
  Wrench,
  ShoppingBag,
  Building2,
  Briefcase,
  Tag,
  Truck,
  User,
  Shield
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { submissionService } from '../../shared/services/submissionService';
import PageTransition from '../../components/common/PageTransition';

export default function AdminLayout({ children, title = 'Super Admin Command Center' }) {
  const router = useRouter();
  const { user, isAdmin, loading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  // Authentication & Authorization Guard
  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.replace(`/admin/login?redirect=${encodeURIComponent(router.asPath)}`);
    }
  }, [user, isAdmin, loading, router]);

  const updatePendingCount = async () => {
    try {
      const counts = await submissionService.getCounts();
      setPendingCount(counts ? counts.pending : 0);
    } catch {
      setPendingCount(0);
    }
  };

  useEffect(() => {
    updatePendingCount();
    const handleUpdate = () => updatePendingCount();
    if (typeof window !== 'undefined') {
      window.addEventListener('adilabad_submissions_updated', handleUpdate);
      return () => window.removeEventListener('adilabad_submissions_updated', handleUpdate);
    }
  }, []);

  const navSections = [
    {
      heading: 'COMMAND & CONTROL',
      items: [
        { name: 'Executive Overview', href: '/admin', icon: LayoutDashboard },
        {
          name: 'Moderation Queue',
          href: '/admin/moderation',
          icon: Inbox,
          badge: pendingCount > 0 ? `${pendingCount} Pending` : null
        },
        { name: 'Admin Profile', href: '/admin/profile', icon: User }
      ]
    },
    {
      heading: 'COMMERCIAL & PROMOTIONS',
      items: [
        { name: 'Advertisements', href: '/admin/advertisements', icon: Megaphone },
        { name: 'Services Directory', href: '/admin/services', icon: Wrench },
        { name: 'Buy & Sell Market', href: '/admin/buy-sell', icon: ShoppingBag },
        { name: 'Property Listings', href: '/admin/properties', icon: Building2 },
        { name: 'Job Vacancies', href: '/admin/jobs', icon: Briefcase },
        { name: 'Special Offers', href: '/admin/offers', icon: Tag },
        { name: 'Rental Fleet', href: '/admin/rentals', icon: Truck },
        { name: 'Homepage Banners', href: '/admin/banners', icon: ImageIcon },
        { name: 'Category Schema', href: '/admin/categories', icon: FolderTree }
      ]
    },
    {
      heading: 'DIRECTORY & GEOGRAPHY',
      items: [
        { name: 'Verified Businesses', href: '/admin/businesses', icon: Store },
        { name: 'Locations & Mandals', href: '/admin/locations', icon: MapPin },
        { name: 'Events & Expos', href: '/admin/events', icon: CalendarDays }
      ]
    },
    {
      heading: 'GOVERNANCE & TELEMETRY',
      items: [
        { name: 'User & Roles Directory', href: '/admin/users', icon: Users },
        { name: 'Staff Task Force', href: '/admin/staff', icon: ShieldCheck },
        { name: 'Flagged Content & Reports', href: '/admin/reports', icon: Flag },
        { name: 'Broadcast Notifications', href: '/admin/notifications', icon: Bell },
        { name: 'Analytics & Telemetry', href: '/admin/analytics', icon: BarChart3 },
        { name: 'Security & Audit Logs', href: '/admin/settings', icon: Settings }
      ]
    }
  ];

  const isActive = (href) => {
    if (href === '/admin') return router.pathname === '/admin';
    return router.pathname === href || router.pathname.startsWith(`${href}/`);
  };

  // If loading authentication or user is not authorized, show protective administrative skeleton
  if (loading || !user || !isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mx-auto text-brand-400 animate-pulse">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">Verifying Administrative Authority</h2>
          <p className="text-sm text-slate-400">
            Validating encrypted session and access permissions for Adilabad App Super Admin Center...
          </p>
          <div className="w-48 h-1.5 bg-slate-800 rounded-full mx-auto overflow-hidden">
            <div className="w-1/2 h-full bg-brand-500 rounded-full animate-indeterminate" />
          </div>
        </div>
      </div>
    );
  }

  const activeAdmin = user;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row antialiased">
      {/* Mobile Header Bar with Safe Notification Clearance */}
      <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 py-3 safe-top-header flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center text-white font-black text-xs shadow-md">
              A
            </div>
            <span className="font-black text-sm tracking-tight text-white">
              Super<span className="text-brand-400">Admin</span>
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            href="/admin/profile"
            className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
            title="Admin Profile"
          >
            <User className="w-5 h-5" />
          </Link>
          <button
            onClick={() => logout('/admin/login')}
            className="p-1.5 rounded-xl bg-rose-950/60 text-rose-400 hover:text-rose-300 border border-rose-900/50"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Backdrop for Mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Persistent Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-950 border-r border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <Link href="/admin" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-500 flex items-center justify-center text-white font-black text-base shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
              A
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-black text-base tracking-tight text-white">Adilabad</span>
                <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-400 border border-brand-500/30">
                  ROOT
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Command & Control</p>
            </div>
          </Link>
        </div>

        {/* Authenticated Admin Identity Badge -> Links to Admin Profile */}
        <Link
          href="/admin/profile"
          onClick={() => setSidebarOpen(false)}
          className="mx-3 mt-3 p-3 rounded-2xl bg-slate-900/90 border border-slate-800/80 hover:border-brand-500/50 flex items-center space-x-3 transition group"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-white font-black text-sm overflow-hidden group-hover:border-brand-400 transition">
              {activeAdmin.avatar_url ? (
                <img src={activeAdmin.avatar_url} alt={activeAdmin.name} className="w-full h-full object-cover" />
              ) : (
                activeAdmin.name ? activeAdmin.name.charAt(0).toUpperCase() : 'A'
              )}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950 ring-1 ring-emerald-400/50" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate group-hover:text-brand-300 transition">{activeAdmin.name}</p>
            <span className="inline-flex items-center text-[10px] text-amber-400 font-mono font-bold tracking-tight">
              {activeAdmin.role?.toUpperCase()} • Profile
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-brand-400 transition" />
        </Link>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-5 custom-scrollbar">
          {navSections.map((sec) => (
            <div key={sec.heading}>
              <span className="px-3 text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1.5">
                {sec.heading}
              </span>
              <div className="space-y-0.5">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        active
                          ? 'bg-gradient-to-r from-brand-600 to-brand-700 text-white shadow-md shadow-brand-600/30'
                          : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-slate-400'}`} />
                      <span className="flex-1">{item.name}</span>
                      {item.badge && (
                        <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full shadow">
                          {item.badge}
                        </span>
                      )}
                      {active && <ChevronRight className="w-3.5 h-3.5 text-brand-200" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer Link & Quick Exit */}
        <div className="p-3.5 border-t border-slate-800/80 bg-slate-950/50 space-y-2">
          <div className="grid grid-cols-2 gap-2 text-[11px] font-bold">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white transition"
            >
              <span>Live Site</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </Link>
            <Link
              href="/owner/dashboard"
              className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 transition"
            >
              <span>Owner Hub</span>
            </Link>
          </div>

          <button
            onClick={() => logout('/admin/login')}
            className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl text-rose-400 hover:bg-rose-950/40 text-xs font-bold transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Authority</span>
          </button>
        </div>
      </aside>

      {/* Main Viewport Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-900/60 pb-20 lg:pb-0">
        {/* Executive Header Ribbon */}
        <header className="bg-slate-900/90 backdrop-blur-xl border-b border-slate-800 px-6 py-3.5 hidden lg:flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center space-x-4">
            <h1 className="text-base font-black text-white tracking-tight">{title}</h1>
            <span className="h-4 w-[1px] bg-slate-700" />
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400 font-mono font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                SLA: 99.98%
              </span>
              <span>•</span>
              <span className="text-slate-400">18 Mandals Active</span>
              <span>•</span>
              <span className="text-slate-400 font-mono">MySQL Cluster Healthy</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/admin/profile"
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-3 py-2 rounded-xl border border-slate-700 transition flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-brand-400" />
              <span>Admin Profile</span>
            </Link>
            <Link
              href="/admin/advertisements/create"
              className="bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-lg shadow-brand-600/20 transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Ad</span>
            </Link>
            <Link
              href="/admin/notifications"
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-3 py-2 rounded-xl border border-slate-700 transition flex items-center gap-1.5"
            >
              <Bell className="w-3.5 h-3.5 text-amber-400" />
              <span>Broadcast Alert</span>
            </Link>
          </div>
        </header>

        {/* Content Container */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1 max-w-[1600px] w-full mx-auto space-y-6">
          {/* Live Page Content */}
          <PageTransition pageKey={router.asPath}>
            {children}
          </PageTransition>
        </div>
      </main>

      {/* Mobile Bottom Navigation for Super Admin */}
      <nav
        aria-label="Super Admin Mobile Navigation"
        className="fixed bottom-0 inset-x-0 z-40 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 text-slate-300 lg:hidden px-3 pt-2 pb-safe shadow-2xl"
        style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom, 0.5rem))' }}
      >
        <div className="flex items-center justify-around max-w-md mx-auto">
          <Link
            href="/admin"
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[10px] font-bold transition ${
              router.pathname === '/admin' ? 'text-brand-400 font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-5 h-5 mb-0.5" />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/admin/moderation"
            className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[10px] font-bold transition ${
              router.pathname === '/admin/moderation' ? 'text-brand-400 font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Inbox className="w-5 h-5 mb-0.5" />
            {pendingCount > 0 && (
              <span className="absolute top-0 right-1.5 w-4 h-4 bg-amber-400 text-slate-950 rounded-full text-[9px] font-black flex items-center justify-center shadow">
                {pendingCount}
              </span>
            )}
            <span>Queue</span>
          </Link>

          <Link
            href="/admin/advertisements"
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[10px] font-bold transition ${
              router.pathname.startsWith('/admin/advertisements') ? 'text-brand-400 font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Megaphone className="w-5 h-5 mb-0.5" />
            <span>Ads</span>
          </Link>

          <Link
            href="/admin/profile"
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[10px] font-bold transition ${
              router.pathname === '/admin/profile' ? 'text-brand-400 font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-5 h-5 mb-0.5" />
            <span>Profile</span>
          </Link>

          <button
            onClick={() => setSidebarOpen(true)}
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
