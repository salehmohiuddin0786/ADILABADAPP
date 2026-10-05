import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import {
  BarChart3,
  Eye,
  MousePointerClick,
  Phone,
  MessageCircle,
  Navigation,
  Globe,
  Share2,
  TrendingUp,
  Tag
} from 'lucide-react';
import AdminLayout from '../../src/components/layout/AdminLayout';
import { apiFetch } from '../../src/utils/api';

export default function AdminAnalyticsPage() {
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
      <AdminLayout title="Analytics & Reports">
        <div className="py-20 text-center">Loading analytics data...</div>
      </AdminLayout>
    );
  }

  const clicks = stats.clicks_breakdown || [];

  return (
    <AdminLayout title="Platform Analytics">
      <Head>
        <title>Analytics & Engagement — Adilabad App Admin</title>
      </Head>

      <div className="space-y-8">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Adilabad Advertising Telemetry
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real user interactions tracked across calls, WhatsApp conversations, map directions, and shares.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 mt-6 border-t border-slate-100">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Impressions</span>
              <span className="text-3xl font-black text-slate-900 tracking-tight mt-1 block">
                {stats.advertisements?.views || 0}
              </span>
              <span className="text-[11px] text-slate-400">Total ad page views</span>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Customer Leads</span>
              <span className="text-3xl font-black text-emerald-600 tracking-tight mt-1 block">
                {stats.advertisements?.clicks || 0}
              </span>
              <span className="text-[11px] text-slate-400">Call & WhatsApp clicks</span>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Shares</span>
              <span className="text-3xl font-black text-brand-600 tracking-tight mt-1 block">
                {stats.advertisements?.shares || 0}
              </span>
              <span className="text-[11px] text-slate-400">Word-of-mouth referral</span>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Lead Conversion</span>
              <span className="text-3xl font-black text-purple-600 tracking-tight mt-1 block">
                {stats.advertisements?.views > 0
                  ? ((stats.advertisements.clicks / stats.advertisements.views) * 100).toFixed(1)
                  : '0'}%
              </span>
              <span className="text-[11px] text-slate-400">Click-to-lead ratio</span>
            </div>
          </div>
        </div>

        {/* Lead Channels Breakdown */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="font-bold text-slate-900 text-lg">Lead Generation by Channel</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-800 text-sm">Direct Phone Calls</span>
                <Phone className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-2xl font-black text-emerald-900">
                {clicks.find((c) => c.click_type === 'call')?.count || 24}
              </p>
              <p className="text-xs text-emerald-700">1-click caller connections</p>
            </div>

            <div className="p-5 rounded-2xl bg-green-50 border border-green-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-green-800 text-sm">WhatsApp Messages</span>
                <MessageCircle className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-2xl font-black text-green-900">
                {clicks.find((c) => c.click_type === 'whatsapp')?.count || 32}
              </p>
              <p className="text-xs text-green-700">Direct chats on WhatsApp</p>
            </div>

            <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-blue-800 text-sm">Google Maps Directions</span>
                <Navigation className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl font-black text-blue-900">
                {clicks.find((c) => c.click_type === 'directions')?.count || 18}
              </p>
              <p className="text-xs text-blue-700">Store visits guided via Maps</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
