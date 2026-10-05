import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  SlidersHorizontal,
  MapPin,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Tag,
  X
} from 'lucide-react';
import MainLayout from '../../src/components/layout/MainLayout';
import AdvertisementCard from '../../src/components/cards/AdvertisementCard';
import EmptyState from '../../src/components/common/EmptyState';
import { apiFetch } from '../../src/utils/api';

export default function AdvertisementsPage({ initialData, categories, locations, initialQuery }) {
  const router = useRouter();
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  // Filter States
  const [search, setSearch] = useState(initialQuery.search || '');
  const [selectedCategory, setSelectedCategory] = useState(initialQuery.category || '');
  const [selectedLocation, setSelectedLocation] = useState(initialQuery.location || '');
  const [featuredOnly, setFeaturedOnly] = useState(initialQuery.featured === 'true');
  const [sort, setSort] = useState(initialQuery.sort || 'latest');
  const [page, setPage] = useState(parseInt(initialQuery.page || '1', 10));

  // Sync and fetch on filters change
  const applyFilters = async (newPage = 1) => {
    setLoading(true);
    setPage(newPage);

    const queryParams = new URLSearchParams();
    if (search.trim()) queryParams.set('search', search.trim());
    if (selectedCategory) queryParams.set('category', selectedCategory);
    if (selectedLocation) queryParams.set('location', selectedLocation);
    if (featuredOnly) queryParams.set('featured', 'true');
    if (sort) queryParams.set('sort', sort);
    if (newPage > 1) queryParams.set('page', newPage.toString());

    router.push(`/advertisements?${queryParams.toString()}`, undefined, { shallow: true });

    try {
      const res = await apiFetch(`/advertisements?${queryParams.toString()}`);
      if (res.success) {
        setData(res);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSelectedLocation('');
    setFeaturedOnly(false);
    setSort('latest');
    router.push('/advertisements', undefined, { shallow: true });
    setLoading(true);
    apiFetch('/advertisements')
      .then((res) => setData(res))
      .finally(() => setLoading(false));
  };

  const ads = data?.data || [];
  const pagination = data?.pagination || { page: 1, totalPages: 1, total: 0 };

  return (
    <>
      <Head>
        <title>All Advertisements in Adilabad — Adilabad App</title>
        <meta
          name="description"
          content="Browse verified local advertisements, commercial offers, properties, vehicles, and jobs in Adilabad, Telangana."
        />
      </Head>

      {/* HERO BANNER SECTION */}
      <section className="bg-slate-900 text-white pt-10 pb-12 sm:pt-14 sm:pb-16 relative overflow-hidden haikei-hero-bg border-b border-slate-800">
        {/* Ambient Glow Orbs */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/15 border border-brand-400/30 text-brand-300 text-xs font-bold backdrop-blur-md mb-3.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>Adilabad Verified Marketplace</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Browse Local Advertisements
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-xl leading-relaxed">
              Explore {pagination.total} published local deals, properties, showroom offers, vehicles, and services across Adilabad.
            </p>
          </div>

          {/* Quick Category Chips Scroll Bar with NO scrollbar */}
          <div className="mt-8 pt-5 border-t border-white/10 flex items-center gap-2 overflow-x-auto no-scrollbar scrollbar-none py-1">
            <button
              onClick={() => {
                setSelectedCategory('');
                applyFilters(1);
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
                    applyFilters(1);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30 ring-2 ring-brand-400'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white border border-white/10'
                  }`}
                >
                  <Tag className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-brand-300'}`} />
                  <span>{c.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="bg-slate-50 py-8 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Filter Bar Controls */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm mb-8 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* Search input */}
              <div className="md:col-span-5 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && applyFilters(1)}
                  placeholder="Search by keywords, title, shop..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50/50"
                />
              </div>

              {/* Category selector */}
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

              {/* Location selector */}
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

              {/* Sort selector */}
              <div className="md:col-span-2">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                >
                  <option value="latest">Latest First</option>
                  <option value="featured">Featured First</option>
                  <option value="popular">Most Viewed</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Bottom filter options strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={featuredOnly}
                  onChange={(e) => setFeaturedOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300"
                />
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-current" />
                  Show Featured Only
                </span>
              </label>

              <div className="flex items-center gap-2">
                {(search || selectedCategory || selectedLocation || featuredOnly || sort !== 'latest') && (
                  <button
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-rose-600 bg-rose-50 hover:bg-rose-100 font-bold transition"
                  >
                    <X className="w-3.5 h-3.5" />
                    Reset
                  </button>
                )}
                <button
                  onClick={() => applyFilters(1)}
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold transition shadow-sm hover:scale-[1.02] active:scale-[0.98]"
                >
                  {loading ? 'Filtering...' : 'Apply Filters'}
                </button>
              </div>
            </div>
          </div>


          {/* Advertisements Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-12">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 border border-slate-200 animate-pulse space-y-4">
                  <div className="aspect-[16/10] bg-slate-200 rounded-xl" />
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : ads.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {ads.map((ad) => (
                <AdvertisementCard key={ad.id} ad={ad} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center">
              <EmptyState
                title="No advertisements match your criteria"
                description="Try selecting a different locality, clearing search keywords, or resetting filters."
                onAction={handleResetFilters}
                actionLabel="View All Advertisements"
              />
            </div>
          )}

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-12">
              <button
                disabled={pagination.page <= 1}
                onClick={() => applyFilters(pagination.page - 1)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition disabled:opacity-40 flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <span className="text-sm font-bold text-slate-700 px-3">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => applyFilters(pagination.page + 1)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition disabled:opacity-40 flex items-center gap-1"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

AdvertisementsPage.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};

export async function getServerSideProps({ query }) {
  try {
    const params = new URLSearchParams();
    if (query.search) params.set('search', query.search);
    if (query.category) params.set('category', query.category);
    if (query.location) params.set('location', query.location);
    if (query.featured) params.set('featured', query.featured);
    if (query.sort) params.set('sort', query.sort);
    if (query.page) params.set('page', query.page);

    const [adRes, catRes, locRes] = await Promise.all([
      apiFetch(`/advertisements?${params.toString()}`),
      apiFetch('/categories'),
      apiFetch('/locations')
    ]);

    return {
      props: {
        initialData: adRes || { data: [], pagination: {} },
        categories: catRes.data || [],
        locations: locRes.data || [],
        initialQuery: query
      }
    };
  } catch (error) {
    console.error('AdvertisementsPage getServerSideProps error:', error.message);
    return {
      props: {
        initialData: { data: [], pagination: {} },
        categories: [],
        locations: [],
        initialQuery: {}
      }
    };
  }
}
