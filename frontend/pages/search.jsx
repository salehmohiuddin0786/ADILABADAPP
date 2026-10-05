import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Search, Tag, Store, Calendar, X, ArrowRight } from 'lucide-react';
import MainLayout from '../src/components/layout/MainLayout';
import AdvertisementCard from '../src/components/cards/AdvertisementCard';
import BusinessCard from '../src/components/cards/BusinessCard';
import EventCard from '../src/components/cards/EventCard';
import CategoryCard from '../src/components/cards/CategoryCard';
import EmptyState from '../src/components/common/EmptyState';
import { apiFetch } from '../src/utils/api';

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('adilabad_recent_searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (router.query.q) {
      setQuery(router.query.q);
      executeSearch(router.query.q);
    }
  }, [router.query.q]);

  const saveRecentSearch = (term) => {
    if (!term.trim()) return;
    const updated = [term.trim(), ...recentSearches.filter((s) => s !== term.trim())].slice(0, 6);
    setRecentSearches(updated);
    localStorage.setItem('adilabad_recent_searches', JSON.stringify(updated));
  };

  const executeSearch = async (searchTerm) => {
    if (!searchTerm || !searchTerm.trim()) return;
    setLoading(true);
    saveRecentSearch(searchTerm);

    try {
      const res = await apiFetch(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      if (res.success) {
        setResults(res);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search when user types
  useEffect(() => {
    const handler = setTimeout(() => {
      if (query.trim().length >= 2 && query !== router.query.q) {
        router.push(`/search?q=${encodeURIComponent(query.trim())}`, undefined, { shallow: true });
        executeSearch(query.trim());
      }
    }, 450);

    return () => clearTimeout(handler);
  }, [query]);

  const handleSuggestionClick = (term) => {
    setQuery(term);
    router.push(`/search?q=${encodeURIComponent(term)}`, undefined, { shallow: true });
    executeSearch(term);
  };

  const ads = results?.data?.advertisements || [];
  const businesses = results?.data?.businesses || [];
  const events = results?.data?.events || [];
  const categories = results?.data?.categories || [];
  const totalResults = results?.counts?.total || 0;

  return (
    <>
      <Head>
        <title>Search Advertisements & Businesses — Adilabad App</title>
        <meta
          name="description"
          content="Global search for advertisements, businesses, jobs, vehicles, properties and events in Adilabad, Telangana."
        />
      </Head>

      {/* HERO SEARCH BANNER */}
      <section className="bg-slate-900 text-white pt-10 pb-12 sm:pt-14 sm:pb-16 relative overflow-hidden haikei-blob-card border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold border border-brand-400/30 mb-3">
            <Search className="w-3.5 h-3.5 text-brand-400" />
            <span>Instant Global Search</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-2">
            Search Across Adilabad
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Find verified advertisements, local businesses, festival events, properties, and services in one tap.
          </p>

          {/* Search Input Box */}
          <div className="relative mt-6 max-w-2xl mx-auto">
            <div className="flex items-center bg-white rounded-2xl p-2 shadow-2xl border border-white/20 text-slate-900">
              <Search className="w-5 h-5 text-slate-400 ml-3.5 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search anything (e.g., Electronics, Thar, Doctors, Cinema Road)..."
                className="w-full px-3.5 py-3 text-slate-900 placeholder-slate-400 text-sm sm:text-base focus:outline-none bg-transparent"
                autoFocus
              />
              {query && (
                <button
                  onClick={() => {
                    setQuery('');
                    setResults(null);
                  }}
                  className="p-2 text-slate-400 hover:text-slate-600 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Recent Searches & Suggestions */}
          {recentSearches.length > 0 && !results && (
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-slate-400 font-semibold">Recent Searches:</span>
              {recentSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => handleSuggestionClick(term)}
                  className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-slate-200 transition"
                >
                  {term}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="bg-slate-50 py-10 sm:py-14 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">


          {/* Search Results Display */}
          {loading ? (
            <div className="py-16 text-center flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-semibold text-slate-500">Searching all local records in Adilabad...</p>
            </div>
          ) : results ? (
            <div>
              {/* Category Filter Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scrollbar-none pb-4 mb-8 border-b border-slate-200">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 ${
                    activeTab === 'all'
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'bg-white text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  All Results ({totalResults})
                </button>
                <button
                  onClick={() => setActiveTab('ads')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 ${
                    activeTab === 'ads'
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'bg-white text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Advertisements ({ads.length})
                </button>
                <button
                  onClick={() => setActiveTab('businesses')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 ${
                    activeTab === 'businesses'
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'bg-white text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Businesses ({businesses.length})
                </button>
                <button
                  onClick={() => setActiveTab('events')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 ${
                    activeTab === 'events'
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'bg-white text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Events ({events.length})
                </button>
              </div>

              {totalResults === 0 ? (
                <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center max-w-xl mx-auto">
                  <EmptyState
                    title={`No results found for "${query}"`}
                    description="Check spelling or try more general keywords like 'Electronics', 'Shop', or 'Adilabad'."
                  />
                </div>
              ) : (
                <div className="space-y-12">
                  {/* Advertisements */}
                  {(activeTab === 'all' || activeTab === 'ads') && ads.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="font-bold text-slate-900 text-lg">
                          Advertisements ({ads.length})
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {ads.map((ad) => (
                          <AdvertisementCard key={ad.id} ad={ad} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Businesses */}
                  {(activeTab === 'all' || activeTab === 'businesses') && businesses.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="font-bold text-slate-900 text-lg">
                          Businesses ({businesses.length})
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {businesses.map((biz) => (
                          <BusinessCard key={biz.id} business={biz} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Events */}
                  {(activeTab === 'all' || activeTab === 'events') && events.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="font-bold text-slate-900 text-lg">
                          Events ({events.length})
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {events.map((ev) => (
                          <EventCard key={ev.id} event={ev} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16 text-slate-400">
              <p className="text-sm">Type in the search box above to find advertisements, shops, and events.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

SearchPage.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};
