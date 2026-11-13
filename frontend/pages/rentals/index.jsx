import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Layers,
  Search,
  Filter,
  MapPin,
  Calendar,
  Phone,
  MessageCircle,
  ShieldCheck,
  Tag,
  ArrowRight
} from 'lucide-react';
import PublicLayout from '../../src/panels/public-website/PublicLayout';
import { apiFetch } from '../../src/utils/api';
import { useLanguage } from '../../src/shared/contexts/LanguageContext';

export default function RentalsPage() {
  const { t } = useLanguage();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const CATEGORIES = [
    { id: 'all', name: 'All Rental Gear' },
    { id: 'Electronics', name: 'Electronics & Cameras' },
    { id: 'Agricultural Equipment', name: 'Agricultural Equipment' },
    { id: 'Event Equipment', name: 'Sound & Event Sets' },
    { id: 'Tools & Machinery', name: 'Tools & Construction' },
    { id: 'Home Appliances', name: 'Appliances & Coolers' }
  ];

  useEffect(() => {
    async function loadRentals() {
      try {
        setLoading(true);
        const data = await apiFetch('/api/v1/rentals');
        setItems(data.data || []);
      } catch (err) {
        console.error('Failed to load rentals:', err);
      } finally {
        setLoading(false);
      }
    }
    loadRentals();
  }, []);

  const filteredItems = items.filter((item) => {
    const matchCat = categoryFilter === 'all' || item.category_name?.toLowerCase().includes(categoryFilter.toLowerCase());
    const matchSearch = !searchQuery || item.title?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <PublicLayout>
      <Head>
        <title>Rent Your Items in Adilabad — Equipment, Cameras, Tractors & Tools</title>
        <meta name="description" content="Rent electronics, agriculture equipment, event sound systems, and tools directly in Adilabad, Telangana." />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl">
            <span className="bg-amber-400 text-slate-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-3">
              Hyperlocal Rental Sharing
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Rent Items & Equipment in Adilabad
            </h1>
            <p className="mt-3 text-emerald-100 text-sm sm:text-base leading-relaxed">
              Why buy when you can rent? High-value cameras, tractors, line arrays, generators, and party supplies available near you with verified local handovers.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/owner/rentals/create"
                className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs shadow transition-all"
              >
                + List Your Item for Rent
              </Link>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cameras, tractors, sound gear..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto w-full pb-2 md:pb-0 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  categoryFilter === cat.id
                    ? 'bg-emerald-800 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow group"
            >
              {/* Image Preview */}
              <div className="relative h-48 bg-slate-100 overflow-hidden">
                <img
                  src={item.media?.[0]?.media_url || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800'}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-lg">
                  {item.category_name}
                </span>
                <span className="absolute bottom-3 right-3 bg-emerald-800 text-white text-xs font-black px-3 py-1 rounded-xl shadow-md">
                  ₹{item.daily_rate}/day
                </span>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-emerald-800 transition-colors">
                    {item.title}
                  </h3>
                  <div className="flex items-center text-xs text-slate-500 space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>{item.location}</span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 pt-1">
                    {item.description || 'Verified condition with local handover in Adilabad.'}
                  </p>
                </div>

                {/* Footer Details & Booking CTA */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Deposit</span>
                    <span className="text-xs font-extrabold text-slate-700">₹{item.security_deposit || 0}</span>
                  </div>

                  <Link
                    href={`/rentals/${item.slug}`}
                    className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-sm transition-all flex items-center space-x-1"
                  >
                    <span>Book Rental</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && !loading && (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
            <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">No rental items found</h3>
            <p className="text-xs text-slate-500 mt-1">Try switching categories or clear your search terms.</p>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
