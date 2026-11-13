import React, { useState } from 'react';
import Head from 'next/head';
import { Building, MapPin, IndianRupee, Phone, CheckCircle2 } from 'lucide-react';
import PublicLayout from '../../src/panels/public-website/PublicLayout';

export default function PropertiesPage() {
  const [properties] = useState([
    {
      id: 1,
      title: 'Spacious 2 BHK Independent House with Car Parking',
      type: 'Independent House',
      rent: 9500,
      deposit: 20000,
      bedrooms: 2,
      bathrooms: 2,
      area: '1,200 sqft',
      location: 'Subhash Nagar, Adilabad',
      phone: '9848022334',
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600'
    },
    {
      id: 2,
      title: 'Prime Commercial Ground Floor Shop on Main Road',
      type: 'Commercial Shop',
      rent: 22000,
      deposit: 60000,
      bedrooms: 0,
      bathrooms: 1,
      area: '450 sqft',
      location: 'Cinema Road, Adilabad',
      phone: '9440192834',
      image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=600'
    },
    {
      id: 3,
      title: '3 BHK Deluxe Flat in Gated Apartment Complex',
      type: 'Apartment',
      rent: 14000,
      deposit: 30100,
      bedrooms: 3,
      bathrooms: 3,
      area: '1,550 sqft',
      location: 'Near Collectorate, Adilabad',
      phone: '9876543210',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600'
    }
  ]);

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
                <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">
                  {p.type}
                </span>
                <span className="absolute bottom-3 right-3 bg-emerald-800 text-white text-xs font-black px-3 py-1 rounded-xl">
                  ₹{p.rent.toLocaleString()}/month
                </span>
              </div>
              <div className="p-6 space-y-3">
                <h3 className="font-extrabold text-slate-900 text-base">{p.title}</h3>
                <div className="flex items-center text-xs text-slate-500 space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  <span>{p.location}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span>Size: <strong>{p.area}</strong></span>
                  <span>Deposit: <strong>₹{p.deposit.toLocaleString()}</strong></span>
                </div>
                <div className="pt-3 border-t border-slate-100">
                  <a
                    href={`tel:${p.phone}`}
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
