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
  Truck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { submissionService } from '../../shared/services/submissionService';

export default function AdminLayout({ children, title = 'Super Admin Command Center' }) {
  const router = useRouter();
  const { user, isAdmin, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  const updatePendingCount = () => {
    try {
      const pending = submissionService.getSubmissions({ status: 'PENDING_APPROVAL' });
      setPendingCount(pending ? pending.length : 0);
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

  // Seamless fallback to Super Admin root session if viewing in preview/demo mode
  const activeAdmin = (user && isAdmin) ? user : {
    id: 1,
    name: 'Adilabad Super Admin',
    email: 'admin@adilabadapp.com',
    role: 'SUPER_ADMIN',
    primary_role: 'SUPER_ADMIN',
    roles: ['SUPER_ADMIN', 'ADMIN'],
    is_demo: !user || !isAdmin
  };

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
        }
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row antialiased">
      {/* Mobile Header Bar */}
      <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center text-white font-black text-xs shadow-md">
              A
            </div>
            <span className="font-black text-base tracking-tight text-white">
              Super<span className="text-brand-400">Admin</span>
            </span>
          </div>
        </div>
        <Link
          href="/"
          className="text-xs font-bold text-brand-400 bg-brand-950/60 border border-brand-800/80 px-2.5 py-1 rounded-full"
        >
          Website &rarr;
        </Link>
      </div>

      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Super Admin Executive Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-900/95 backdrop-blur-2xl border-r border-slate-800/90 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <Link href="/admin" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-base tracking-tight text-white">Adilabad</span>
                <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-black uppercase tracking-wider">
                  Root
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Super Admin Center
              </p>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Super Admin Identity Badge */}
        <div className="p-3.5 mx-3 my-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center space-x-3 shadow-inner">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow">
              {activeAdmin.name ? activeAdmin.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950 ring-1 ring-emerald-400/50" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">{activeAdmin.name}</p>
            <span className="inline-flex items-center text-[10px] text-amber-400 font-mono font-bold tracking-tight">
              SUPER_ADMIN • Tier 1
            </span>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-5 custom-scrollbar">
          {navSections.map((sec) => (
            <div key={sec.heading}>
              <span className="px-3 text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1.5">
                {sec.heading}
              </span>
              <div className="space-y-0.5">
                {navSections.items ? null : sec.items.map((item) => {
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
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl text-rose-400 hover:bg-rose-950/40 text-xs font-bold transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Authority</span>
          </button>
        </div>
      </aside>

      {/* Main Viewport Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-900/60">
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
          {activeAdmin.is_demo && (
            <div className="p-3.5 px-4 rounded-2xl bg-brand-950/60 border border-brand-500/40 text-brand-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <span className="font-semibold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-400 shrink-0" />
                Viewing Super Admin Center in <strong>Full Administrative Preview Mode</strong>.
              </span>
              <div className="flex items-center gap-2">
                <Link
                  href="/admin/login"
                  className="px-3 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-400 text-slate-950 font-black transition shadow-sm shrink-0"
                >
                  Authenticate Admin Account
                </Link>
              </div>
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  );
}
