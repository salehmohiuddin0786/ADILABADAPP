import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Heart, ArrowRight } from 'lucide-react';
import CustomerLayout from '../../src/panels/customer-panel/CustomerLayout';
import { useAuth } from '../../src/context/AuthContext';

export default function CustomerFavoritesPage() {
  const { favorites } = useAuth();

  return (
    <CustomerLayout title="My Saved Favourites">
      <Head>
        <title>Favourites — Customer Hub</title>
      </Head>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Saved Advertisements & Stores</h2>
            <p className="text-xs text-slate-500 mt-0.5">Quick access to listings you saved while browsing Adilabad.</p>
          </div>
          <Link
            href="/favorites"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>Full Gallery View</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm text-center">
          <Heart className="w-10 h-10 text-rose-500 fill-rose-500 mx-auto mb-3" />
          <h3 className="font-bold text-slate-900 text-base">You have {favorites?.length || 0} saved listings</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Easily review verified telephone numbers, map directions, and pricing for your preferred local items.
          </p>
          <Link
            href="/advertisements"
            className="inline-block mt-4 px-5 py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-xs"
          >
            Explore More Listings
          </Link>
        </div>
      </div>
    </CustomerLayout>
  );
}
