import React from 'react';
import Head from 'next/head';
import OwnerLayout from '../../src/panels/owner-panel/OwnerLayout';
import OwnerDashboard from '../../src/panels/owner-panel/OwnerDashboard';

export default function OwnerDashboardPage() {
  return (
    <OwnerLayout title="Commercial & Rental Dashboard">
      <Head>
        <title>Owner Portal — Adilabad App</title>
      </Head>
      <OwnerDashboard />
    </OwnerLayout>
  );
}
