import React from 'react';
import Head from 'next/head';
import OwnerLayout from '../../src/panels/owner-panel/OwnerLayout';
import OwnerDashboard from '../../src/panels/owner-panel/OwnerDashboard';

export default function OwnerIndexPage() {
  return (
    <OwnerLayout title="Commercial & Rental Dashboard">
      <Head>
        <title>Owner Portal — Adilabad App</title>
        <meta name="description" content="Manage rental inventory, business profiles, advertisements, and customer proposals in Adilabad." />
      </Head>
      <OwnerDashboard />
    </OwnerLayout>
  );
}
