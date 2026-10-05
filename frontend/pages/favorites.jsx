import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Bookmark, Megaphone, Store, Calendar, ArrowRight } from 'lucide-react';
import MainLayout from '../src/components/layout/MainLayout';
import AdvertisementCard from '../src/components/cards/AdvertisementCard';
import BusinessCard from '../src/components/cards/BusinessCard';
import EventCard from '../src/components/cards/EventCard';
import EmptyState from '../src/components/common/EmptyState';
import { useAuth } from '../src/context/AuthContext';
import { apiFetch } from '../src/utils/api';

export default function FavoritesPage() {
  const { user, isLoggedIn, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('advertisements');
  const [data, setData] = useState({ advertisements: [], businesses: [], events: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoggedIn) {
      setLoading(true);
      apiFetch('/favorites')
        .then((res) => {
          if (res.success && res.data) {
            setData(res.data);
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [isLoggedIn]);

  return (
    <>
      <Head>
        <title>Saved Favorites — Adilabad App</title>
        <meta name="description" content="View your saved advertisements, businesses, and events in Adilabad." />
      </Head>

      {/* HERO BANNER */}
      <section className="bg-slate-900 text-white pt-10 pb-12 sm:pt-12 sm:pb-14 relative overflow-hidden haikei-blob-card border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-400/30 mb-3">
              <Bookmark className="w-3.5 h-3.5 text-rose-400 fill-current" />
              <span>Personal Bookmarks</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              My Saved Favorites
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-xl">
              Quickly revisit saved advertisements, contact verified local businesses, and stay updated on favorite events in Adilabad.
            </p>
          </div>
        </div>
      </section>

      <div className="bg-slate-50 py-10 sm:py-14 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">


          {!authLoading && !isLoggedIn ? (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center max-w-lg mx-auto shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-4">
                <Bookmark className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Sign in to save favorites</h3>
              <p className="text-sm text-slate-500 mb-6">
                Keep track of advertisements, properties, vehicles, and businesses that interest you.
              </p>
              <Link
                href="/login?redirect=/favorites"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md transition"
              >
                <span>Sign In to Your Account</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div>
              {/* Tabs */}
              <div className="flex items-center gap-2 border-b border-slate-200 pb-4 mb-8 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('advertisements')}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 shrink-0 ${
                    activeTab === 'advertisements'
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'bg-white text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Megaphone className="w-4 h-4" />
                  <span>Advertisements ({data.advertisements?.length || 0})</span>
                </button>

                <button
                  onClick={() => setActiveTab('businesses')}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 shrink-0 ${
                    activeTab === 'businesses'
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'bg-white text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Store className="w-4 h-4" />
                  <span>Businesses ({data.businesses?.length || 0})</span>
                </button>

                <button
                  onClick={() => setActiveTab('events')}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 shrink-0 ${
                    activeTab === 'events'
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'bg-white text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Events ({data.events?.length || 0})</span>
                </button>
              </div>

              {/* Tab Contents */}
              {loading ? (
                <div className="py-16 text-center text-slate-400">Loading saved items...</div>
              ) : activeTab === 'advertisements' ? (
                data.advertisements?.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.advertisements.map((ad) => (
                      <AdvertisementCard key={ad.id} ad={ad} />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="No advertisements saved yet"
                    description="When you see an advertisement you like, click the bookmark icon to save it here."
                    actionHref="/advertisements"
                    actionLabel="Discover Advertisements"
                  />
                )
              ) : activeTab === 'businesses' ? (
                data.businesses?.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {data.businesses.map((biz) => (
                      <BusinessCard key={biz.id} business={biz} />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="No businesses saved yet"
                    description="Bookmark local stores and services from the Business Directory."
                    actionHref="/businesses"
                    actionLabel="Browse Business Directory"
                  />
                )
              ) : activeTab === 'events' ? (
                data.events?.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {data.events.map((ev) => (
                      <EventCard key={ev.id} event={ev} />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="No events saved yet"
                    description="Keep track of exhibitions and upcoming community festivals in Adilabad."
                    actionHref="/events"
                    actionLabel="View Upcoming Events"
                  />
                )
              ) : null}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

FavoritesPage.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};
