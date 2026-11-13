import React from 'react';
import Head from 'next/head';
import { Star } from 'lucide-react';
import CustomerLayout from '../../src/panels/customer-panel/CustomerLayout';

export default function CustomerReviewsPage() {
  return (
    <CustomerLayout title="My Submitted Reviews">
      <Head>
        <title>My Reviews — Customer Hub</title>
      </Head>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Your Ratings & Testimonials</h2>
          <p className="text-xs text-slate-500 mt-0.5">Help fellow Adilabad residents find trustworthy local businesses.</p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm text-center">
          <Star className="w-10 h-10 text-amber-500 fill-amber-400 mx-auto mb-2" />
          <h3 className="font-bold text-slate-900 text-base">Verified Community Reviews</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Reviews you leave on store pages and rentals are displayed publicly to guide consumers.
          </p>
        </div>
      </div>
    </CustomerLayout>
  );
}
