import React, { useState } from 'react';
import Head from 'next/head';
import { Star, MessageSquare, CheckCircle2 } from 'lucide-react';
import OwnerLayout from '../../src/panels/owner-panel/OwnerLayout';

export default function OwnerReviewsPage() {
  const [reviews] = useState([
    {
      id: 1,
      customer: 'Rahul Sharma',
      rating: 5,
      date: '10 Nov 2026',
      service: 'Sony Alpha A7 IV Rental',
      comment: 'Top quality gear! Batteries were fully charged, master prime lenses were spotless. Easy handover process on Cinema Road.'
    },
    {
      id: 2,
      customer: 'Suresh Patel',
      rating: 5,
      date: '02 Nov 2026',
      service: 'John Deere Tractor Hire',
      comment: 'Tractor was delivered right on time to our agricultural land near Jainath. Great condition and smooth cultivator operation.'
    }
  ]);

  return (
    <OwnerLayout title="Customer Ratings & Feedback">
      <Head>
        <title>Reviews — Adilabad Owner Portal</title>
      </Head>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Verified Customer Reviews</h2>
            <p className="text-xs text-slate-500 mt-0.5">Reputation score built across completed rentals and verified store visits.</p>
          </div>
          <div className="bg-amber-50 border border-amber-200/80 px-4 py-2 rounded-2xl flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            <span className="text-base font-black text-amber-950">4.9 / 5.0</span>
            <span className="text-xs text-amber-800 font-semibold">(62 total reviews)</span>
          </div>
        </div>

        <div className="space-y-4">
          {(Array.isArray(reviews) ? reviews : []).map((rev) => (
            <div key={rev.id} className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{rev.customer}</h4>
                  <span className="text-xs text-slate-400">Rental: {rev.service} • {rev.date}</span>
                </div>
                <div className="flex items-center gap-0.5 text-amber-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed italic bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                "{rev.comment}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </OwnerLayout>
  );
}
