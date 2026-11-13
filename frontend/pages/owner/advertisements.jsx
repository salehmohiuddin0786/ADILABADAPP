import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Tag, Eye, MousePointerClick, Plus, Sparkles, ExternalLink } from 'lucide-react';
import OwnerLayout from '../../src/panels/owner-panel/OwnerLayout';
import { useToast } from '../../src/context/ToastContext';

export default function OwnerAdvertisementsPage() {
  const { addToast } = useToast();
  const [ads] = useState([
    {
      id: 1,
      title: 'Sony Alpha Cinema Camera Daily Rentals with Master Lens Kit',
      category: 'Electronics',
      price: '₹1,500/day',
      status: 'PUBLISHED',
      is_featured: true,
      views: 1240,
      clicks: 184,
      slug: 'sony-alpha-cinema-camera-daily-rentals-with-master-lens-kit'
    },
    {
      id: 2,
      title: 'John Deere 5050D Tractor with Cultivator & Trolley for Farm Hire',
      category: 'Agriculture',
      price: '₹3,200/day',
      status: 'PUBLISHED',
      is_featured: true,
      views: 980,
      clicks: 142,
      slug: 'john-deere-5050d-tractor-with-cultivator-trolley-for-farm-hire'
    }
  ]);

  return (
    <OwnerLayout title="My Advertisements & Classifieds">
      <Head>
        <title>Manage Advertisements — Adilabad Owner Portal</title>
      </Head>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Active Commercial Ads</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live advertisements visible to Adilabad shoppers, renters, and local businesses.
            </p>
          </div>
          <button
            onClick={() => addToast('Submit new advertisement proposal to admin for instant approval.', 'info')}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Create Advertisement
          </button>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold">
                <tr>
                  <th className="py-4 px-6">Advertisement Title</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Price</th>
                  <th className="py-4 px-4">Impressions</th>
                  <th className="py-4 px-4">Leads</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(Array.isArray(ads) ? ads : []).map((ad) => (
                  <tr key={ad.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {ad.is_featured && (
                          <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                        )}
                        <span className="font-bold text-slate-900">{ad.title}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-500">{ad.category}</td>
                    <td className="py-4 px-4 font-bold text-emerald-700">{ad.price}</td>
                    <td className="py-4 px-4">
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <Eye className="w-3.5 h-3.5 text-slate-400" /> {ad.views}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="flex items-center gap-1 font-semibold text-emerald-600">
                        <MousePointerClick className="w-3.5 h-3.5" /> {ad.clicks}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {ad.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        href={`/advertisements/${ad.slug}`}
                        target="_blank"
                        className="text-brand-600 hover:text-brand-700 font-bold inline-flex items-center gap-1"
                      >
                        View Ad <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </OwnerLayout>
  );
}
