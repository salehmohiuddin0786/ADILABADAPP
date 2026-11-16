import React from 'react';
import Head from 'next/head';
import CustomerLayout from '../../src/panels/customer-panel/CustomerLayout';
import CustomerDashboard from '../../src/panels/customer-panel/CustomerDashboard';

export default function CustomerIndexPage() {
  return (
    <CustomerLayout title="Customer Hub — Adilabad App">
      <Head>
        <title>Customer Portal — Adilabad App</title>
        <meta name="description" content="Manage bookings, favorite businesses, enquiries, and local rentals in Adilabad." />
      </Head>
      <CustomerDashboard />
    </CustomerLayout>
  );
}
