import React, { useState } from 'react';
import Head from 'next/head';
import { Sparkles, Calendar, Bell, ShieldCheck, Share2, Tag } from 'lucide-react';
import PublicLayout from '../../src/panels/public-website/PublicLayout';

export default function LivePage() {
  const [posts] = useState([
    {
      id: 1,
      title: 'Keslapur Nagoba Jatara 2026 Scheduled Dates Announced by ITDA Utnoor',
      category: 'CULTURAL',
      date: '2026-11-13',
      is_official: true,
      content: 'The renowned annual tribal pilgrimage Keslapur Nagoba Jatara near Indervelly will commence with sacred rituals. Thousands of devotees from Telangana and Maharashtra are expected. Special TSRTC buses arranged from Adilabad bus depot.',
      badge: 'Official District Announcement'
    },
    {
      id: 2,
      title: 'Kuntala & Pochera Waterfalls Safe Viewing Timings Updated for Visitors',
      category: 'TOURISM',
      date: '2026-11-12',
      is_official: true,
      content: 'Forest department issues safety advisory: tourist viewing timings established from 9:00 AM to 5:30 PM. Lifeguards stationed at all major rock points. Visitors advised to follow marked pathways.',
      badge: 'Forest Advisory'
    },
    {
      id: 3,
      title: 'Adilabad Cotton Market Yard Weekly Inflow Reaches Record High',
      category: 'MARKET',
      date: '2026-11-11',
      is_official: false,
      content: 'Over 25,000 quintals of premium long-staple white gold traded this week at Adilabad Agriculture Market Yard with steady modal prices. Farmers commended on excellent ginning quality.',
      badge: 'Local Agriculture Update'
    }
  ]);

  return (
    <PublicLayout>
      <Head>
        <title>Adilabad Live — Local News, Traffic & District Announcements</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Real-time District Feed</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Adilabad Live & Community Updates
          </h1>
          <p className="mt-2 text-emerald-100 text-sm max-w-xl">
            Verified public notices, road updates, festival schedules, weather advisories, and cultural alerts across Adilabad district.
          </p>
        </div>

        <div className="space-y-6 max-w-3xl mx-auto">
          {posts.map((post) => (
            <article key={post.id} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold px-3 py-1 rounded-full flex items-center ${
                  post.is_official
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-800'
                }`}>
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                  {post.badge}
                </span>
                <span className="text-xs text-slate-400 flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1" />
                  {post.date}
                </span>
              </div>

              <h2 className="text-xl font-extrabold text-slate-900 leading-snug">
                {post.title}
              </h2>

              <p className="text-sm text-slate-600 leading-relaxed">
                {post.content}
              </p>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-emerald-800">Category: {post.category}</span>
                <button className="flex items-center space-x-1 text-slate-600 hover:text-emerald-800 font-bold">
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Update</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}
