import React from 'react';
import Head from 'next/head';
import { Building } from 'lucide-react';
import CustomerLayout from '../../src/panels/customer-panel/CustomerLayout';

export default function CustomerPropertiesPage() {
  return (
    <CustomerLayout title="My Property Enquiries">
      <Head>
        <title>Property Enquiries — Customer Hub</title>
      </Head>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Rental & Real Estate Inquiries</h2>
          <p className="text-xs text-slate-500 mt-0.5">Direct connections with verified house, shop, and plot owners.</p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm text-center">
          <Building className="w-10 h-10 text-emerald-700 mx-auto mb-2" />
          <h3 className="font-bold text-slate-900 text-base">Direct Landlord Contact Active</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Browse commercial shops, plots, and family homes with 0% brokerage.
          </p>
        </div>
      </div>
    </CustomerLayout>
  );
}
