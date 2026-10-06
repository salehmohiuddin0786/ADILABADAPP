import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Search, Store, MapPin, X } from 'lucide-react';
import MainLayout from '../../src/components/layout/MainLayout';
import BusinessCard from '../../src/components/cards/BusinessCard';
import EmptyState from '../../src/components/common/EmptyState';
import { apiFetch } from '../../src/utils/api';
import { MOCK_CATEGORIES, MOCK_LOCATIONS, filterMockBusinesses } from '../../src/data/mockData';

export default function BusinessesPage({ initialData, categories = [], locations = [], initialQuery }) {
  const router = useRouter();
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(initialQuery.search || '');
  const [selectedCategory, setSelectedCategory] = useState(initialQuery.category || '');
  const [selectedLocation, setSelectedLocation] = useState(initialQuery.location || '');

  const applyFilters = async () => {
    setLoading(true);
    const queryParams = new URLSearchParams();
    if (search.trim()) queryParams.set('search', search.trim());
    if (selectedCategory) queryParams.set('category', selectedCategory);
    if (selectedLocation) queryParams.set('location', selectedLocation);

    router.push(`/businesses?${queryParams.toString()}`, undefined, { shallow: true });

    try {
      const res = await apiFetch(`/businesses?${queryParams.toString()}`);
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
    setSelectedCategory('');
    setSelectedLocation('');
    router.push('/businesses', undefined, { shallow: true });
    setLoading(true);
    apiFetch('/businesses')
      .then((res) => setData(res))
      .finally(() => setLoading(false));
  };

  const businesses = data?.data || [];
  const pagination = data?.pagination || { total: 0 };

  return (
    <>
      <Head>
        <title>Local Business Directory — Adilabad App</title>
        <meta
          name="description"
          content="Find trusted businesses, verified showrooms, restaurants, doctors, and services in Adilabad, Telangana."
        />
      </Head>

      {/* HERO BANNER SECTION */}
      <section className="bg-slate-900 text-white pt-10 pb-12 sm:pt-14 sm:pb-16 relative overflow-hidden haikei-hero-bg border-b border-slate-800">
        {/* Ambient Glow Orbs */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-bold backdrop-blur-md mb-3.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>Verified Adilabad Commercial Directory</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Adilabad Business Directory
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-xl leading-relaxed">
              Browse {pagination.total} verified shops, commercial showrooms, clinics, restaurants, and local services in Adilabad.
            </p>
          </div>

          {/* Quick Category Chips Scroll Bar with NO scrollbar */}
          <div className="mt-8 pt-5 border-t border-white/10 flex items-center gap-2 overflow-x-auto no-scrollbar scrollbar-none py-1">
            <button
              onClick={() => {
                setSelectedCategory('');
                applyFilters();
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
                !selectedCategory
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30 ring-2 ring-brand-400'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white border border-white/10'
              }`}
            >
              <span>All Categories ({pagination.total})</span>
            </button>
            {categories.map((c) => {
              const isSelected = selectedCategory === c.slug;
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelectedCategory(c.slug);
                    applyFilters();
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30 ring-2 ring-brand-400'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white border border-white/10'
                  }`}
                >
                  <Store className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-emerald-400'}`} />
                  <span>{c.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="bg-slate-50 py-8 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Filter Bar */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm mb-8 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-5 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                  placeholder="Search businesses by name, service, brand..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50/50"
                />
              </div>

              <div className="md:col-span-3">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
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
                  {loading ? 'Searching...' : 'Search'}
                </button>
                {(search || selectedCategory || selectedLocation) && (
                  <button
                    onClick={handleReset}
                    className="p-2.5 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 transition"
                    title="Reset Filters"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Directory Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-12">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 border border-slate-200 animate-pulse space-y-4">
                  <div className="aspect-[16/9] bg-slate-200 rounded-xl" />
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : businesses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {businesses.map((biz) => (
                <BusinessCard key={biz.id} business={biz} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center">
              <EmptyState
                title="No businesses found"
                description="Try clearing search filters or selecting another category."
                onAction={handleReset}
                actionLabel="View All Businesses"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

BusinessesPage.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};

export async function getServerSideProps({ query }) {
  try {
    const params = new URLSearchParams();
    if (query.search) params.set('search', query.search);
    if (query.category) params.set('category', query.category);
    if (query.location) params.set('location', query.location);

    const [bizRes, catRes, locRes] = await Promise.all([
      apiFetch(`/businesses?${params.toString()}`),
      apiFetch('/categories'),
      apiFetch('/locations')
    ]);

    return {
      props: {
        initialData: bizRes || { data: [], pagination: {} },
        categories: catRes.data || [],
        locations: locRes.data || [],
        initialQuery: query
      }
    };
  } catch (error) {
    console.warn('BusinessesPage fallback to mock data:', error.message);
    const mockBiz = filterMockBusinesses({
      search: query.search,
      category: query.category,
      location: query.location
    });
    return {
      props: {
        initialData: mockBiz,
        categories: MOCK_CATEGORIES,
        locations: MOCK_LOCATIONS,
        initialQuery: query || {}
      }
    };
  }
}
