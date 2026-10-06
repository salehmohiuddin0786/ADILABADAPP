import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Tag, MapPin, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import MainLayout from '../../src/components/layout/MainLayout';
import AdvertisementCard from '../../src/components/cards/AdvertisementCard';
import EmptyState from '../../src/components/common/EmptyState';
import { getCategoryIcon } from '../../src/utils/iconMap';
import { apiFetch } from '../../src/utils/api';
import { MOCK_CATEGORIES, MOCK_LOCATIONS, filterMockAdvertisements } from '../../src/data/mockData';

export default function CategoryDetailPage({ category, adsData, locations = [] }) {
  const router = useRouter();

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800">Category Not Found</h2>
          <Link href="/categories" className="inline-block mt-4 text-brand-600 font-bold">
            Back to All Categories
          </Link>
        </div>
      </div>
    );
  }

  const ads = adsData?.data || [];
  const pagination = adsData?.pagination || { total: 0 };

  return (
    <>
      <Head>
        <title>{category.name} in Adilabad — Adilabad App</title>
        <meta name="description" content={`Discover ${category.name} advertisements, shops, and deals in Adilabad, Telangana.`} />
      </Head>

      <div className="bg-slate-50 py-8 sm:py-12 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
            <Link href="/" className="hover:text-brand-600">Home</Link>
            <span>/</span>
            <Link href="/categories" className="hover:text-brand-600">Categories</Link>
            <span>/</span>
            <span className="text-slate-800 font-semibold">{category.name}</span>
          </nav>

          {/* Category Banner Card */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-brand-950 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center gap-5 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-brand-500/20 text-brand-300 border border-brand-400/30 flex items-center justify-center shrink-0 shadow-lg backdrop-blur-md">
                {getCategoryIcon(category.icon, 'w-8 h-8')}
              </div>
              <div>
                <span className="text-xs font-bold text-brand-300 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Category Showcase
                </span>
                <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-1">
                  {category.name} in Adilabad
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                  {category.description || `Browse the best verified listings, deals, and local businesses for ${category.name} in Adilabad.`}
                </p>
              </div>
            </div>

            <div className="px-6 py-4 rounded-2xl bg-white/10 border border-white/15 text-center shrink-0 backdrop-blur-md relative z-10">
              <span className="text-3xl font-black text-white block">{pagination.total}</span>
              <span className="text-[11px] font-bold text-brand-300 uppercase tracking-wider">Active Deals</span>
            </div>
          </div>

          {/* Advertisements Grid */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                Available Advertisements ({pagination.total})
              </h2>
            </div>

            {ads.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {ads.map((ad) => (
                  <AdvertisementCard key={ad.id} ad={ad} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center">
                <EmptyState
                  title={`No advertisements found in ${category.name}`}
                  description="New advertisements are published regularly by our administrative team."
                  actionHref="/advertisements"
                  actionLabel="Browse All Advertisements"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

CategoryDetailPage.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};

export async function getServerSideProps({ params }) {
  try {
    const [catRes, adsRes, locRes] = await Promise.all([
      apiFetch(`/categories/detail/${params.slug}`),
      apiFetch(`/advertisements?category=${params.slug}&limit=20`),
      apiFetch('/locations')
    ]);

    return {
      props: {
        category: catRes.data || null,
        adsData: adsRes || { data: [], pagination: {} },
        locations: locRes.data || []
      }
    };
  } catch (error) {
    console.warn('CategoryDetailPage fallback to mock data:', error.message);
    const fallbackCategory = MOCK_CATEGORIES.find(c => c.slug === params.slug) || MOCK_CATEGORIES[0];
    const fallbackAds = filterMockAdvertisements({ category: params.slug, limit: 20 });
    return {
      props: {
        category: fallbackCategory,
        adsData: fallbackAds,
        locations: MOCK_LOCATIONS
      }
    };
  }
}
