import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Store, MapPin, Phone, Clock, Plus, ExternalLink, CheckCircle2 } from 'lucide-react';
import OwnerLayout from '../../src/panels/owner-panel/OwnerLayout';
import { useToast } from '../../src/context/ToastContext';

export default function OwnerBusinessesPage() {
  const { addToast } = useToast();
  const [businesses] = useState([
    {
      id: 1,
      name: 'Adilabad Media Works & Camera Rentals',
      category: 'Electronics & Production',
      locality: 'Cinema Road, Adilabad',
      phone: '+91 98480 22334',
      whatsapp: '+91 98480 22334',
      status: 'VERIFIED',
      rating: 4.8,
      reviewsCount: 38,
      slug: 'adilabad-media-works'
    },
    {
      id: 2,
      name: 'Adilabad Heavy Agri & Equipment Yard',
      category: 'Agriculture & Construction',
      locality: 'Shivaji Chowk, Adilabad',
      phone: '+91 94401 92834',
      whatsapp: '+91 94401 92834',
      status: 'VERIFIED',
      rating: 4.9,
      reviewsCount: 24,
      slug: 'adilabad-heavy-agri-equipment'
    }
  ]);

  return (
    <OwnerLayout title="My Business Profiles">
      <Head>
        <title>Business Profiles — Adilabad Owner Portal</title>
      </Head>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Registered Commercial Stores</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage physical storefronts, address coordinates, and telephone leads in Adilabad.
            </p>
          </div>
          <button
            onClick={() => addToast('Store creation form opened. You can add up to 3 business profiles.', 'info')}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Register New Business
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(Array.isArray(businesses) ? businesses : []).map((b) => (
            <div key={b.id} className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/60 text-amber-600 flex items-center justify-center font-bold text-lg">
                    <Store className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{b.name}</h3>
                    <span className="text-xs text-slate-400 font-medium">{b.category}</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> {b.status}
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
                  <span>{b.locality}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{b.phone}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                <span className="text-slate-500 font-medium">
                  Rating: <strong className="text-slate-900">{b.rating} ★</strong> ({b.reviewsCount} reviews)
                </span>
                <Link
                  href={`/businesses/${b.slug}`}
                  target="_blank"
                  className="text-brand-600 hover:text-brand-700 font-bold flex items-center gap-1"
                >
                  View Public Page <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </OwnerLayout>
  );
}
