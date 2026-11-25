import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Utensils, MapPin, Phone, Star, Clock } from 'lucide-react';
import PublicLayout from '../../src/panels/public-website/PublicLayout';
import { apiFetch } from '../../src/utils/api';

export default function FoodPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRestaurants() {
      try {
        const res = await apiFetch('/food');
        if (res && res.success && Array.isArray(res.data)) {
          setRestaurants(res.data);
        }
      } catch (e) {
        console.warn('Food fetch error:', e);
      } finally {
        setLoading(false);
      }
    }
    loadRestaurants();
  }, []);

  return (
    <PublicLayout>
      <Head>
        <title>Food & Restaurants in Adilabad — Menus, Mandi & Biryani</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="bg-gradient-to-r from-emerald-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
          <span className="bg-amber-400 text-slate-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-3">
            Adilabad Dining
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Restaurants, Cafes & Mandi in Adilabad
          </h1>
          <p className="mt-2 text-emerald-100 text-sm max-w-xl">
            Discover family restaurants, pure veg tiffin centers, Arabian mandi spots, bakeries, and ice cream parlors across Adilabad.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {restaurants.map((r) => (
            <div key={r.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between">
              <div className="h-48 bg-slate-100 overflow-hidden relative">
                <img src={r.image_url || r.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600'} alt={r.name} className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md text-amber-400 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center">
                  <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                  <span>{r.rating || '4.5'}</span>
                </div>
              </div>
              <div className="p-6 space-y-3">
                <h3 className="font-extrabold text-slate-900 text-base">{r.name}</h3>
                <p className="text-xs text-emerald-800 font-semibold">{r.cuisine_type || r.cuisine}</p>
                <div className="text-xs text-slate-500 space-y-1 pt-1">
                  <div className="flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" />
                    <span>{r.location || r.address}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{r.opening_time && r.closing_time ? `${r.opening_time.slice(0, 5)} - ${r.closing_time.slice(0, 5)}` : (r.timings || '10:00 AM - 10:00 PM')}</span>
                  </div>
                </div>
                <div className="pt-3 border-t border-slate-100">
                  <a
                    href={`tel:${r.phone}`}
                    className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs py-2 rounded-xl flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Contact Restaurant</span>
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
