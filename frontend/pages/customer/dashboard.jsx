import React from 'react';
import Head from 'next/head';
import CustomerLayout from '../../src/panels/customer-panel/CustomerLayout';
import CustomerDashboard from '../../src/panels/customer-panel/CustomerDashboard';

export default function CustomerDashboardPage() {
  return (
    <CustomerLayout title="Customer Hub — Adilabad App">
      <Head>
        <title>My Account — Adilabad App</title>
      </Head>
      <CustomerDashboard />
    </CustomerLayout>
  );
}
