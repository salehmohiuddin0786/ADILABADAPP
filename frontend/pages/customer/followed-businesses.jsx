import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Store, MapPin, Phone, ExternalLink } from 'lucide-react';
import CustomerLayout from '../../src/panels/customer-panel/CustomerLayout';

export default function CustomerFollowedBusinessesPage() {
  const stores = [
    {
      id: 1,
      name: 'Adilabad Media Works',
      category: 'Electronics & Cameras',
      locality: 'Cinema Road, Adilabad',
      phone: '+91 98480 22334',
      slug: 'adilabad-media-works'
    },
    {
      id: 2,
      name: 'Adilabad Heavy Agri & Equipment Yard',
      category: 'Agriculture & Farm Hire',
      locality: 'Shivaji Chowk, Adilabad',
      phone: '+91 94401 92834',
      slug: 'adilabad-heavy-agri-equipment'
    }
  ];

  return (
    <CustomerLayout title="Followed Local Businesses">
      <Head>
        <title>Followed Stores — Customer Hub</title>
      </Head>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Merchants You Follow</h2>
          <p className="text-xs text-slate-500 mt-0.5">Receive immediate notification when these stores drop new offers or products.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(Array.isArray(stores) ? stores : []).map((s) => (
            <div key={s.id} className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{s.name}</h3>
                  <span className="text-[11px] text-slate-400">{s.category}</span>
                </div>
              </div>
              <div className="space-y-1 text-xs text-slate-500">
                <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-brand-600" /> {s.locality}</p>
                <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-emerald-600" /> {s.phone}</p>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-emerald-700 font-bold">Following</span>
                <Link href={`/businesses/${s.slug}`} className="text-brand-600 font-bold hover:underline flex items-center gap-1">
                  View Profile <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </CustomerLayout>
  );
}
