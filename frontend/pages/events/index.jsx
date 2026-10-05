import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Search, Calendar, MapPin, X } from 'lucide-react';
import MainLayout from '../../src/components/layout/MainLayout';
import EventCard from '../../src/components/cards/EventCard';
import EmptyState from '../../src/components/common/EmptyState';
import { apiFetch } from '../../src/utils/api';

export default function EventsPage({ initialData, locations = [], initialQuery }) {
  const router = useRouter();
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(initialQuery.search || '');
  const [selectedLocation, setSelectedLocation] = useState(initialQuery.location || '');

  const applyFilters = async () => {
    setLoading(true);
    const queryParams = new URLSearchParams();
    if (search.trim()) queryParams.set('search', search.trim());
    if (selectedLocation) queryParams.set('location', selectedLocation);

    router.push(`/events?${queryParams.toString()}`, undefined, { shallow: true });

    try {
      const res = await apiFetch(`/events?${queryParams.toString()}`);
      if (res.success) {
        setData(res);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearch('');
    setSelectedLocation('');
    router.push('/events', undefined, { shallow: true });
    setLoading(true);
    apiFetch('/events')
      .then((res) => setData(res))
      .finally(() => setLoading(false));
  };

  const events = data?.data || [];
  const pagination = data?.pagination || { total: 0 };

  return (
    <>
      <Head>
        <title>Upcoming Events in Adilabad — Adilabad App</title>
        <meta
          name="description"
          content="Discover upcoming festivals, exhibitions, cricket tournaments, health camps, and cultural events in Adilabad, Telangana."
        />
      </Head>

      {/* HERO BANNER SECTION */}
      <section className="bg-slate-900 text-white pt-10 pb-12 sm:pt-12 sm:pb-14 relative overflow-hidden haikei-blob-card border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-400/30 mb-3">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
              <span>Adilabad City Calendar</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Upcoming Events & Fairs
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-xl">
              Discover {pagination.total} upcoming exhibitions, consumer melas, cultural festivals, health camps, and sports events in Adilabad.
            </p>
          </div>
        </div>
      </section>

      <div className="bg-slate-50 py-8 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Filter Bar */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm mb-8 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-7 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                  placeholder="Search events by name, organizer, venue..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50/50"
                />
              </div>

              <div className="md:col-span-3">
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                >
                  <option value="">All Localities</option>
                  {locations.map((l) => (
                    <option key={l.id} value={l.slug}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2 flex items-center gap-2">
                <button
                  onClick={applyFilters}
                  className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-sm transition hover:scale-[1.02] active:scale-[0.98]"
                >
                  Search
                </button>
                {(search || selectedLocation) && (
                  <button
                    onClick={handleReset}
                    className="p-2.5 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 transition"
                    title="Reset"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>


          {/* Events Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-12">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 border border-slate-200 animate-pulse space-y-4">
                  <div className="aspect-[16/10] bg-slate-200 rounded-xl" />
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : events.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((ev) => (
                <EventCard key={ev.id} event={ev} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center">
              <EmptyState
                title="No upcoming events match your search"
                description="Check back soon for new local tournaments, exhibitions, and cultural fairs."
                onAction={handleReset}
                actionLabel="View All Events"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

EventsPage.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};

export async function getServerSideProps({ query }) {
  try {
    const params = new URLSearchParams();
    if (query.search) params.set('search', query.search);
    if (query.location) params.set('location', query.location);

    const [evRes, locRes] = await Promise.all([
      apiFetch(`/events?${params.toString()}`),
      apiFetch('/locations')
    ]);

    return {
      props: {
        initialData: evRes || { data: [], pagination: {} },
        locations: locRes.data || [],
        initialQuery: query
      }
    };
  } catch (error) {
    return {
      props: {
        initialData: { data: [], pagination: {} },
        locations: [],
        initialQuery: {}
      }
    };
  }
}
