import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Tag, Search, Filter, Percent, Clock, MapPin, Store, Check, Copy } from 'lucide-react';
import PublicLayout from '../../src/panels/public-website/PublicLayout';
import { useLanguage } from '../../src/shared/contexts/LanguageContext';

export default function OffersPage() {
  const { t } = useLanguage();
  const [copiedCode, setCopiedCode] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const offers = [
    {
      id: 1,
      title: 'Flat 20% Off on Full Wedding Photography Packages',
      business_name: 'Adilabad Media Works',
      code: 'ADB-MEDIA20',
      discount: '20% OFF',
      valid_till: 'Valid till 30 Nov 2026',
      category: 'Weddings & Photography',
      location: 'Cinema Road, Adilabad',
      terms: 'Applicable on bookings of 2 days or more. Advance booking required.',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800'
    },
    {
      id: 2,
      title: 'Zero Processing Fee on LED TVs & Home Appliances',
      business_name: 'Shree Balaji Electronics & Appliances',
      code: 'BALAJI-FESTIVE',
      discount: '0% EMI',
      valid_till: 'Valid till 15 Dec 2026',
      category: 'Electronics',
      location: 'Opp. Geeta Theatre, Cinema Road',
      terms: 'Available through Bajaj Finserv & HDFC Bank credit on select models.',
      image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800'
    },
    {
      id: 3,
      title: 'Special Family Biryani Feast — 10% Extra Portion',
      business_name: 'Hotel Mehfil & Family Restaurant',
      code: 'MEHFIL-FAMILY',
      discount: '10% EXTRA',
      valid_till: 'Valid daily 12PM - 11PM',
      category: 'Food & Dining',
      location: 'Shivaji Chowk, Adilabad',
      terms: 'Valid on dine-in and takeaway family packs. Show coupon code at counter.',
      image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800'
    },
    {
      id: 4,
      title: 'Free Cultivator Attachment on 3+ Days Tractor Rental',
      business_name: 'Telangana Agri Hub',
      code: 'AGRI-HARVEST',
      discount: 'FREE TOOL',
      valid_till: 'Valid till harvest season',
      category: 'Agriculture',
      location: 'Utnoor Road, Adilabad Rural',
      terms: 'Applicable on John Deere 5050D and Swaraj 744 bookings.',
      image: 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=800'
    }
  ];

  const handleCopy = (code) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard?.writeText(code);
    }
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const filteredOffers = offers.filter((o) => {
    if (selectedCategory !== 'all' && !o.category.toLowerCase().includes(selectedCategory.toLowerCase())) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        o.title.toLowerCase().includes(q) ||
        o.business_name.toLowerCase().includes(q) ||
        o.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <PublicLayout>
      <Head>
        <title>Exclusive Local Offers & Coupons in Adilabad — Adilabad App</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero */}
        <div className="bg-gradient-to-r from-amber-600 via-brand-600 to-indigo-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl">
            <span className="bg-white/20 backdrop-blur-md text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-3">
              Hyperlocal Savings
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Local Deals, Offers & Coupons
            </h1>
            <p className="mt-3 text-brand-100 text-sm sm:text-base leading-relaxed">
              Discover authentic festival discounts, showroom promotions, and seasonal savings directly from verified businesses across Adilabad.
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
              placeholder="Search by shop name, discount, or area..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            {['all', 'Electronics', 'Weddings', 'Food', 'Agriculture'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-brand-600 text-white shadow'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'all' ? 'All Offers' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredOffers.map((offer) => (
            <div
              key={offer.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col sm:flex-row hover:shadow-md transition"
            >
              <div className="sm:w-48 h-48 sm:h-auto bg-slate-100 relative shrink-0">
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-rose-600 text-white font-black text-xs px-2.5 py-1 rounded-lg shadow">
                  {offer.discount}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-1">
                    <Store className="w-3.5 h-3.5 text-brand-500" />
                    <span className="font-bold text-slate-700">{offer.business_name}</span>
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                    {offer.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {offer.terms}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{offer.location}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 bg-slate-50 border border-dashed border-slate-300 px-3 py-1.5 rounded-xl font-mono text-xs font-bold text-slate-800">
                    <span>{offer.code}</span>
                  </div>

                  <button
                    onClick={() => handleCopy(offer.code)}
                    className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow transition flex items-center gap-1.5"
                  >
                    {copiedCode === offer.code ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}
