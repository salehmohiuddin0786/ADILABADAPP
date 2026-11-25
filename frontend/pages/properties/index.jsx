import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Building, MapPin, IndianRupee, Phone, CheckCircle2 } from 'lucide-react';
import PublicLayout from '../../src/panels/public-website/PublicLayout';
import { apiFetch } from '../../src/utils/api';

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProperties() {
      try {
        const res = await apiFetch('/properties');
        if (res && res.success && Array.isArray(res.data)) {
          setProperties(res.data);
        }
      } catch (e) {
        console.warn('Properties fetch error:', e);
      } finally {
        setLoading(false);
      }
    }
    loadProperties();
  }, []);

  return (
    <PublicLayout>
      <Head>
        <title>Property Rentals in Adilabad — Houses, Flats & Commercial Shops</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="bg-gradient-to-r from-emerald-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
          <span className="bg-amber-400 text-slate-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-3">
            Real Estate & Rentals
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Houses, Flats & Shops for Rent in Adilabad
          </h1>
          <p className="mt-2 text-emerald-100 text-sm max-w-xl">
            Verified rental properties with direct owner contact and zero brokerage listings across Adilabad mandals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {properties.map((p) => (
            <div key={p.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between">
              <div className="h-48 bg-slate-100 overflow-hidden relative">
                <img src={p.image_url || p.image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600'} alt={p.title} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">
                  {p.property_type || p.type || 'Property'}
                </span>
                <span className="absolute bottom-3 right-3 bg-emerald-800 text-white text-xs font-black px-3 py-1 rounded-xl">
                  ₹{Number(p.monthly_rent || p.rent || 0).toLocaleString('en-IN')}/month
                </span>
              </div>
              <div className="p-6 space-y-3">
                <h3 className="font-extrabold text-slate-900 text-base">{p.title}</h3>
                <div className="flex items-center text-xs text-slate-500 space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  <span>{p.location}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span>Size: <strong>{p.carpet_area_sqft ? `${Number(p.carpet_area_sqft).toLocaleString('en-IN')} sqft` : (p.area || '1,200 sqft')}</strong></span>
                  <span>Deposit: <strong>₹{Number(p.deposit_amount || p.deposit || 0).toLocaleString('en-IN')}</strong></span>
                </div>
                <div className="pt-3 border-t border-slate-100">
                  <a
                    href={`tel:${p.contact_phone || p.phone}`}
                    className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs py-2 rounded-xl flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Contact Owner</span>
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
