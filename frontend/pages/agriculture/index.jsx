import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Sprout, MapPin, Phone, Truck, Search, ShoppingBag, ShieldCheck } from 'lucide-react';
import PublicLayout from '../../src/panels/public-website/PublicLayout';

export default function AgricultureMarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const agriListings = [
    {
      id: 1,
      title: 'Certified BT Cotton Seeds & Bio-Fertilizers',
      vendor: 'Kisan Seva Kendra & Agri Inputs',
      category: 'Seeds & Fertilizers',
      location: 'Market Yard Road, Adilabad',
      price: '₹850 / packet',
      phone: '+91 94401 88990',
      description: 'Government certified drought-tolerant BT cotton seeds, organic neem cake, and bio-nutrients for Telangana black soils.',
      image: 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=800'
    },
    {
      id: 2,
      title: 'Solar Agricultural Water Pump Set (5HP & 7.5HP)',
      vendor: 'Telangana Solar Energy Hub',
      category: 'Solar & Irrigation',
      location: 'Utnoor Road, Adilabad',
      price: '₹1,45,000 (Subsidy Available)',
      phone: '+91 98480 11223',
      description: 'MNRE approved solar submersible pump with 5-year warranty and free installation across Adilabad district.',
      image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800'
    },
    {
      id: 3,
      title: 'Multi-Crop Harvester & Thresher on Daily Rent',
      vendor: 'Adilabad Agro Machine Cooperative',
      category: 'Farm Machinery',
      location: 'Bela Road, Adilabad',
      price: '₹2,200 / hour',
      phone: '+91 94401 77665',
      description: 'High-speed soybean, wheat, and chana crop harvester with operator and diesel inclusive package.',
      image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=800'
    }
  ];

  const filtered = agriListings.filter((item) => {
    if (selectedCategory !== 'all' && !item.category.toLowerCase().includes(selectedCategory.toLowerCase())) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.vendor.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <PublicLayout>
      <Head>
        <title>Agriculture Marketplace Adilabad — Seeds, Machinery, Cotton & Solar Pumps</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl">
            <span className="bg-emerald-500 text-slate-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-3">
              Kisan Agri Desk
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Adilabad Agriculture & Farming Marketplace
            </h1>
            <p className="mt-3 text-emerald-100 text-sm sm:text-base leading-relaxed">
              Empowering Adilabad farmers with direct access to certified cotton seeds, organic fertilizers, solar pump subsidies, tractors, and harvest machinery.
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
              placeholder="Search cotton seeds, tractors, solar pumps, drip..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            {['all', 'Seeds', 'Solar', 'Machinery'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-emerald-700 text-white shadow'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'all' ? 'All Products' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition"
            >
              <div className="h-48 bg-slate-100 relative">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-lg">
                  {item.category}
                </span>
                <span className="absolute bottom-3 right-3 bg-emerald-800 text-white font-black text-xs px-3 py-1 rounded-xl shadow">
                  {item.price}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base leading-snug">{item.title}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="font-bold text-slate-700">{item.vendor}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" />
                    <span>{item.location}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2">{item.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <a
                    href={`tel:${item.phone}`}
                    className="text-xs font-bold text-slate-700 hover:text-emerald-700 flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{item.phone}</span>
                  </a>
                  <Link
                    href={`/contact?subject=Agri Enquiry: ${encodeURIComponent(item.title)}`}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm transition"
                  >
                    Contact Seller
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
