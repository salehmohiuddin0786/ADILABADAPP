import React, { useState } from 'react';
import Head from 'next/head';
import { Wrench, Phone, MessageCircle, MapPin, Star, ShieldCheck } from 'lucide-react';
import PublicLayout from '../../src/panels/public-website/PublicLayout';

export default function ServicesPage() {
  const [services] = useState([
    {
      id: 1,
      title: 'Expert Home Electrical Repairs & Inverter Wiring',
      provider: 'Suresh Electricals & Power Solutions',
      category: 'Electrician',
      location: 'Cinema Road, Adilabad',
      experience: '12 Years Experience',
      rating: 4.9,
      reviews: 48,
      phone: '9848022334',
      badge: 'Verified Electrician'
    },
    {
      id: 2,
      title: 'Complete Plumbing, Water Tank Cleaning & Pipeline Fitting',
      provider: 'Adilabad Flow Plumbing Services',
      category: 'Plumber',
      location: 'Subhash Nagar, Adilabad',
      experience: '8 Years Experience',
      rating: 4.8,
      reviews: 32,
      phone: '9440192834',
      badge: 'Verified Plumber'
    },
    {
      id: 3,
      title: 'Split & Window AC Servicing, Gas Refill & Installation',
      provider: 'Cool Breeze AC & Refrigeration Works',
      category: 'AC Technician',
      location: 'Collectorate Road, Adilabad',
      experience: '10 Years Experience',
      rating: 4.9,
      reviews: 64,
      phone: '9876543210',
      badge: 'Verified Technician'
    }
  ]);

  return (
    <PublicLayout>
      <Head>
        <title>Local Service Providers & Technicians in Adilabad</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="bg-gradient-to-r from-emerald-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
          <span className="bg-amber-400 text-slate-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-3">
            Trusted Experts
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Local Services & Technicians in Adilabad
          </h1>
          <p className="mt-2 text-emerald-100 text-sm max-w-xl">
            Book verified plumbers, electricians, AC mechanics, carpenters, and painters with direct local phone & WhatsApp contact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((s) => (
            <div key={s.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center">
                    <ShieldCheck className="w-3 h-3 mr-1" /> {s.badge}
                  </span>
                  <div className="flex items-center text-amber-500 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-500 mr-1" />
                    <span>{s.rating} ({s.reviews})</span>
                  </div>
                </div>

                <h3 className="font-bold text-slate-900 text-base">{s.title}</h3>
                <p className="text-xs font-semibold text-emerald-800">{s.provider}</p>
                
                <div className="flex items-center text-xs text-slate-500 space-x-2 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  <span>{s.location}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <a
                  href={`tel:${s.phone}`}
                  className="bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center space-x-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Expert</span>
                </a>
                <a
                  href={`https://wa.me/91${s.phone}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-3 py-2 rounded-xl flex items-center space-x-1"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}
