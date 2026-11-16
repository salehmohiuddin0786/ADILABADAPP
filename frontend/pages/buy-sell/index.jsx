import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ShoppingBag, Search, Tag, MapPin, Phone, MessageCircle, ArrowRight, Plus } from 'lucide-react';
import PublicLayout from '../../src/panels/public-website/PublicLayout';
import { submissionService } from '../../src/shared/services/submissionService';

export default function BuySellPage() {
  const DEFAULT_ITEMS = [
    {
      id: 1,
      title: 'OnePlus 11 5G (16GB RAM / 256GB Storage) — Like New',
      price: '₹34,000',
      condition: 'Like New',
      category: 'Mobiles & Tablets',
      location: 'Cinema Road, Adilabad',
      phone: '9848022334',
      image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600'
    },
    {
      id: 2,
      title: 'Solid Teak Wood 6-Seater Dining Table with Chairs',
      price: '₹18,500',
      condition: 'Used - Good',
      category: 'Home & Furniture',
      location: 'Collectorate Colony, Adilabad',
      phone: '9440192834',
      image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600'
    },
    {
      id: 3,
      title: 'Royal Enfield Classic 350 (2022 Model) — Single Owner',
      price: '₹1,65,000',
      condition: 'Excellent',
      category: 'Vehicles',
      location: 'Subhash Nagar, Adilabad',
      phone: '9876543210',
      image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600'
    }
  ];

  const [items, setItems] = useState(DEFAULT_ITEMS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const loadItems = async () => {
    try {
      const res = await submissionService.getSubmissions({ module: 'buy-sell' });
      const published = (Array.isArray(res?.data) ? res.data : []).filter(
        (s) => s.status === 'PUBLISHED' || s.status === 'AVAILABLE'
      );

      const formattedSubs = published.map((s) => ({
        id: s.id,
        title: s.title,
        price: s.pricing,
        condition: s.specs?.condition || 'Good',
        category: s.category || 'General',
        location: s.location || 'Adilabad',
        phone: s.owner_phone || '9848022334',
        image: s.image_url || 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600'
      }));

      const mergedMap = new Map();
      DEFAULT_ITEMS.forEach((it) => mergedMap.set(it.title, it));
      formattedSubs.forEach((it) => mergedMap.set(it.title, it));

      setItems(Array.from(mergedMap.values()));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadItems();
    const handleSync = () => loadItems();
    if (typeof window !== 'undefined') {
      window.addEventListener('adilabad_submissions_updated', handleSync);
      return () => window.removeEventListener('adilabad_submissions_updated', handleSync);
    }
  }, []);

  const filtered = items.filter((item) => {
    const matchCat = selectedCategory === 'all' || item.category?.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchSearch = !searchQuery || item.title?.toLowerCase().includes(searchQuery.toLowerCase()) || item.location?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <PublicLayout>
      <Head>
        <title>Buy & Sell Used Items in Adilabad — Local Classifieds</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="bg-gradient-to-r from-emerald-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="bg-amber-400 text-slate-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-3">
              Local Classifieds
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Buy & Sell Pre-Owned Goods in Adilabad
            </h1>
            <p className="mt-2 text-emerald-100 text-sm">
              Direct peer-to-peer buying and selling. Verified Adilabad listings for mobiles, electronics, bikes, and furniture with zero commission.
            </p>
          </div>
          <Link
            href="/customer/buy-sell"
            className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs shadow-lg transition flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" /> Post Your Item
          </Link>
        </div>

        {/* Filter & Search */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {['all', 'Mobiles', 'Home & Furniture', 'Vehicles'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  selectedCategory === cat ? 'bg-emerald-800 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'all' ? 'All Items' : cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search items or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div key={item.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition">
              <div className="h-48 bg-slate-100 overflow-hidden relative">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">
                  {item.category}
                </span>
                <span className="absolute bottom-3 right-3 bg-emerald-800 text-white text-xs font-black px-3 py-1 rounded-xl">
                  {item.price}
                </span>
              </div>
              <div className="p-5 space-y-3">
                <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{item.title}</h3>
                <div className="flex items-center text-xs text-slate-500 space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  <span>{item.location}</span>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <a
                    href={`tel:${item.phone}`}
                    className="bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center space-x-1.5 shadow"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Seller</span>
                  </a>
                  <a
                    href={`https://wa.me/91${item.phone?.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-3 py-2 rounded-xl flex items-center space-x-1"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}
