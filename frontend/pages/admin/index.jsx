import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Users,
  Megaphone,
  Store,
  Calendar,
  Eye,
  MousePointerClick,
  Sparkles,
  PlusCircle,
  TrendingUp,
  Phone,
  MessageCircle,
  Navigation,
  Share2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Tag
} from 'lucide-react';
import AdminLayout from '../../src/components/layout/AdminLayout';
import { apiFetch } from '../../src/utils/api';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/admin/analytics/overview')
      .then((res) => {
        if (res.success) setStats(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !stats) {
    return (
      <AdminLayout title="Dashboard Overview">
        <div className="py-20 text-center flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-500">Loading system metrics...</p>
        </div>
      </AdminLayout>
    );
  }

  const kpis = [
    {
      title: 'Total Advertisements',
      value: stats.advertisements?.total || 0,
      sub: `${stats.advertisements?.active || 0} Published Active`,
      icon: Megaphone,
      color: 'bg-brand-500 text-brand-600',
      href: '/admin/advertisements'
    },
    {
      title: 'Featured Ads',
      value: stats.advertisements?.featured || 0,
      sub: 'Highlighted in Adilabad',
      icon: Sparkles,
      color: 'bg-amber-500 text-amber-600',
      href: '/admin/advertisements?featured=true'
    },
    {
      title: 'Total Views',
      value: stats.advertisements?.views || 0,
      sub: 'Impressions across ads',
      icon: Eye,
      color: 'bg-sky-500 text-sky-600',
      href: '/admin/analytics'
    },
    {
      title: 'Direct Clicks & Leads',
      value: stats.advertisements?.clicks || 0,
      sub: 'Calls, WhatsApp & Maps',
      icon: MousePointerClick,
      color: 'bg-emerald-500 text-emerald-600',
      href: '/admin/analytics'
    },
    {
      title: 'Registered Users',
      value: stats.users?.total || 0,
      sub: `${stats.users?.active || 0} Active accounts`,
      icon: Users,
      color: 'bg-indigo-500 text-indigo-600',
      href: '/admin/users'
    },
    {
      title: 'Business Directory',
      value: stats.businesses?.total || 0,
      sub: `${stats.businesses?.active || 0} Active shops`,
      icon: Store,
      color: 'bg-purple-500 text-purple-600',
      href: '/admin/businesses'
    },
    {
      title: 'Local Events',
      value: stats.events?.total || 0,
      sub: 'Fairs & Tournaments',
      icon: Calendar,
      color: 'bg-rose-500 text-rose-600',
      href: '/admin/events'
    },
    {
      title: 'User Reports',
      value: stats.reports?.total || 0,
      sub: `${stats.reports?.pending || 0} Pending moderation`,
      icon: ShieldCheck,
      color: 'bg-amber-500 text-amber-600',
      href: '/admin/reports'
    }
  ];

  return (
    <AdminLayout title="Admin Dashboard">
      <Head>
        <title>Dashboard Overview — Adilabad App Admin</title>
      </Head>

      <div className="space-y-8">
        {/* Quick Actions Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Adilabad Platform Management
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Strict Admin Publishing Control & Local Lead Generation
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/admin/advertisements/create"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-600/20 transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Advertisement</span>
            </Link>
            <Link
              href="/admin/businesses/create"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition"
            >
              <Store className="w-4 h-4" />
              <span>Add Business</span>
            </Link>
            <Link
              href="/admin/events/create"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition"
            >
              <Calendar className="w-4 h-4" />
              <span>Create Event</span>
            </Link>
          </div>
        </div>

        {/* 8 Metric KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <Link key={kpi.title} href={kpi.href}>
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-brand-300 transition-all group">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-500 line-clamp-1">{kpi.title}</span>
                    <div className="w-8 h-8 rounded-xl bg-slate-50 text-slate-700 group-hover:bg-brand-50 group-hover:text-brand-600 flex items-center justify-center transition shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {kpi.value.toLocaleString()}
                  </p>
                  <p className="text-[11px] font-semibold text-slate-400 mt-1">{kpi.sub}</p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Two-Column Analytics & Top Listings */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Top performing advertisements */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Top Performing Advertisements</h3>
                <p className="text-xs text-slate-400">Ranked by combined views and customer leads</p>
              </div>
              <Link
                href="/admin/advertisements"
                className="text-xs font-bold text-brand-600 hover:text-brand-700"
              >
                Manage All &rarr;
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {stats.top_advertisements?.map((ad) => (
                <div key={ad.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={ad.primary_image || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=150&q=80'}
                      alt={ad.title}
                      className="w-12 h-12 rounded-xl object-cover shrink-0 bg-slate-100"
                    />
                    <div className="min-w-0">
                      <Link
                        href={`/admin/advertisements/${ad.id}/edit`}
                        className="font-bold text-slate-900 text-sm hover:text-brand-600 transition truncate block"
                      >
                        {ad.title}
                      </Link>
                      <p className="text-xs text-slate-400 truncate">{ad.business_name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 text-right text-xs">
                    <div>
                      <span className="font-bold text-slate-800 block">{ad.views_count}</span>
                      <span className="text-[10px] text-slate-400">Views</span>
                    </div>
                    <div>
                      <span className="font-bold text-emerald-600 block">{ad.clicks_count}</span>
                      <span className="text-[10px] text-slate-400">Clicks</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Leads Breakdown & Top Categories */}
          <div className="lg:col-span-5 space-y-8">
            {/* Top Categories */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-base">Popular Categories</h3>
              <div className="space-y-3">
                {stats.top_categories?.map((cat) => (
                  <div key={cat.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-brand-600" />
                      <span className="font-semibold text-slate-700">{cat.name}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 font-bold text-slate-700">
                      {cat.total_ads} ads
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Admin Activity Log */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-base">Admin Audit Trail</h3>
                <Link href="/admin/settings" className="text-xs font-bold text-brand-600">
                  Logs &rarr;
                </Link>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {stats.recent_activity?.slice(0, 4).map((log) => (
                  <div key={log.id} className="py-2.5 flex items-start justify-between gap-2">
                    <div>
                      <p className="font-bold text-slate-800">{log.action}</p>
                      <p className="text-[11px] text-slate-400">
                        {log.admin_name} • {log.entity}
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {log.created_at?.slice(11, 16)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
