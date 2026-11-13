import React from 'react';
import Head from 'next/head';
import OwnerLayout from '../../../src/panels/owner-panel/OwnerLayout';
import AddRentalItemForm from '../../../src/panels/owner-panel/AddRentalItemForm';

export default function CreateRentalPage() {
  return (
    <OwnerLayout title="List Equipment for Rent">
      <Head>
        <title>Add Rental Listing — Adilabad App</title>
      </Head>
      <AddRentalItemForm />
    </OwnerLayout>
  );
}
