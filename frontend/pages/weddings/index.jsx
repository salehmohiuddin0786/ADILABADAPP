import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Sparkles, MapPin, Phone, Star, Camera, Music, Utensils, Search, Calendar } from 'lucide-react';
import PublicLayout from '../../src/panels/public-website/PublicLayout';

export default function WeddingMarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const vendors = [
    {
      id: 1,
      name: 'Adilabad Media Works & Cinematic Films',
      category: 'Photography & 4K Video',
      location: 'Cinema Road, Adilabad',
      startingPrice: '₹35,000 / event',
      rating: 4.9,
      reviews: 38,
      phone: '+91 98480 22334',
      services: ['Candid Photography', 'Cinematic Drone Shoots', 'Live LED Wall Streaming'],
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800'
    },
    {
      id: 2,
      name: 'Shadi Mahal AC Function Hall & Convention',
      category: 'Marriage Hall & Banquet',
      location: 'Bhuktapur, Adilabad',
      startingPrice: '₹65,000 / day',
      rating: 4.8,
      reviews: 52,
      phone: '+91 94401 33221',
      services: ['Capacity 1500+ Guests', 'Central AC & Deluxe Green Rooms', 'Generators Backup'],
      image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800'
    },
    {
      id: 3,
      name: 'Royal Shahi Caterers & Dum Biryani Masters',
      category: 'Wedding Catering & Food',
      location: 'Shivaji Chowk, Adilabad',
      startingPrice: '₹420 / plate',
      rating: 4.9,
      reviews: 44,
      phone: '+91 94401 55667',
      services: ['Authentic Dum Biryani', 'Mughlai & Telangana Thali', 'Desserts & Live Counters'],
      image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800'
    }
  ];

  const filtered = vendors.filter((v) => {
    if (selectedCategory !== 'all' && !v.category.toLowerCase().includes(selectedCategory.toLowerCase())) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        v.name.toLowerCase().includes(q) ||
        v.location.toLowerCase().includes(q) ||
        v.services.some((s) => s.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <PublicLayout>
      <Head>
        <title>Weddings & Event Marketplace Adilabad — Halls, Photography, Catering & Decors</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="bg-gradient-to-r from-rose-900 via-pink-900 to-indigo-950 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl">
            <span className="bg-rose-500 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-3">
              Celebrations & Grand Events
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Adilabad Wedding & Event Services
            </h1>
            <p className="mt-3 text-rose-100 text-sm sm:text-base leading-relaxed">
              Find verified marriage function halls, cinematic wedding photographers, sound line arrays, stage flower decorators, and caterers all across Adilabad.
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search photography, banquet halls, catering..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-500 outline-none"
            />
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            {['all', 'Photography', 'Hall', 'Catering'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-rose-600 text-white shadow'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'all' ? 'All Services' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtered.map((vendor) => (
            <div
              key={vendor.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition"
            >
              <div className="h-48 bg-slate-100 relative">
                <img src={vendor.image} alt={vendor.name} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-lg">
                  {vendor.category}
                </span>
                <span className="absolute bottom-3 right-3 bg-rose-700 text-white font-black text-xs px-3 py-1 rounded-xl shadow">
                  From {vendor.startingPrice}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base leading-snug">{vendor.name}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>{vendor.location}</span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Services Included:
                    </span>
                    {vendor.services.map((s, i) => (
                      <span key={i} className="inline-block bg-rose-50 text-rose-800 text-[11px] font-semibold px-2 py-0.5 rounded-md mr-1 mb-1 border border-rose-100">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <a
                    href={`tel:${vendor.phone}`}
                    className="text-xs font-bold text-slate-700 hover:text-rose-600 flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{vendor.phone}</span>
                  </a>
                  <Link
                    href={`/contact?subject=Wedding Enquiry: ${encodeURIComponent(vendor.name)}`}
                    className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition"
                  >
                    Book Consultation
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}
