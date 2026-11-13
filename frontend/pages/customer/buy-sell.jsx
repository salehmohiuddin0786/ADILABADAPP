import React from 'react';
import Head from 'next/head';
import { ShoppingBag } from 'lucide-react';
import CustomerLayout from '../../src/panels/customer-panel/CustomerLayout';

export default function CustomerBuySellPage() {
  return (
    <CustomerLayout title="My Buy & Sell Ads">
      <Head>
        <title>Buy & Sell — Customer Hub</title>
      </Head>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Your Classified Listings</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage used smartphones, bikes, furniture, and appliances you listed.</p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm text-center">
          <ShoppingBag className="w-10 h-10 text-emerald-700 mx-auto mb-2" />
          <h3 className="font-bold text-slate-900 text-base">Community Second-Hand Classifieds</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Sell unused household items directly to neighbors in Adilabad with 0% commission.
          </p>
        </div>
      </div>
    </CustomerLayout>
  );
}
