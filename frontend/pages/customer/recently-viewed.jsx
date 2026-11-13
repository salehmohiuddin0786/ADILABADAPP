import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Clock, ExternalLink } from 'lucide-react';
import CustomerLayout from '../../src/panels/customer-panel/CustomerLayout';

export default function CustomerRecentlyViewedPage() {
  const recentItems = [
    {
      id: 1,
      title: 'Sony Alpha Cinema Camera Daily Rentals',
      category: 'Electronics',
      slug: 'sony-alpha-cinema-camera-daily-rentals-with-master-lens-kit',
      viewed_at: 'Today, 2:15 PM'
    },
    {
      id: 2,
      title: 'Hotel Mehfil & Family Restaurant',
      category: 'Food & Dining',
      slug: 'hotel-mehfil',
      viewed_at: 'Yesterday'
    }
  ];

  return (
    <CustomerLayout title="Recently Viewed Listings">
      <Head>
        <title>Recently Viewed — Customer Hub</title>
      </Head>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Your Browsing History</h2>
          <p className="text-xs text-slate-500 mt-0.5">Quickly revisit items you checked out recently in Adilabad.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(Array.isArray(recentItems) ? recentItems : []).map((it) => (
            <div key={it.id} className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase">{it.category}</span>
              <h3 className="font-bold text-slate-900 text-sm">{it.title}</h3>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400">{it.viewed_at}</span>
                <Link href={`/advertisements/${it.slug}`} className="text-emerald-700 font-bold hover:underline flex items-center gap-1">
                  Revisit <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </CustomerLayout>
  );
}
