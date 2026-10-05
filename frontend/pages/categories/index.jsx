import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Tag, ArrowRight } from 'lucide-react';
import MainLayout from '../../src/components/layout/MainLayout';
import { getCategoryIcon } from '../../src/utils/iconMap';
import { apiFetch } from '../../src/utils/api';

export default function CategoriesPage({ categories = [] }) {
  return (
    <>
      <Head>
        <title>All Categories in Adilabad — Adilabad App</title>
        <meta
          name="description"
          content="Explore local advertisements and businesses across all categories in Adilabad, Telangana."
        />
      </Head>

      {/* HERO BANNER SECTION */}
      <section className="bg-slate-900 text-white pt-10 pb-12 sm:pt-14 sm:pb-16 relative overflow-hidden haikei-blob-card border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold border border-brand-400/30 mb-3">
            <Tag className="w-3.5 h-3.5 text-brand-400" />
            <span>Local Market Categories</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-2">
            Explore All Categories
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Browse verified advertisements, commercial hubs, showrooms, and local services in Adilabad categorized for quick discovery.
          </p>
        </div>
      </section>

      <div className="bg-slate-50 py-10 sm:py-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">


          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link key={cat.id} href={`/categories/${cat.slug}`}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-brand-300 transition-all duration-300 h-full flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-brand-50 group-hover:bg-brand-600 text-brand-600 group-hover:text-white flex items-center justify-center transition-colors shadow-sm duration-300 mb-5">
                      {getCategoryIcon(cat.icon, 'w-7 h-7')}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-600 transition mb-2">
                      {cat.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-3">
                      {cat.description || `Browse advertisements, shops, and deals in ${cat.name}.`}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">
                      {cat.advertisements_count || 0} Advertisements
                    </span>
                    <span className="text-brand-600 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      Explore &rarr;
                    </span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

CategoriesPage.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};

export async function getServerSideProps() {
  try {
    const res = await apiFetch('/categories');
    return {
      props: {
        categories: res.data || []
      }
    };
  } catch (error) {
    return { props: { categories: [] } };
  }
}
