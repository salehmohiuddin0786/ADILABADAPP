import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Building, Plus, MapPin, CheckCircle2 } from 'lucide-react';
import OwnerLayout from '../../src/panels/owner-panel/OwnerLayout';
import { useToast } from '../../src/context/ToastContext';
import { submissionService } from '../../src/shared/services/submissionService';
import CreateListingModal from '../../src/panels/owner-panel/CreateListingModal';

export default function OwnerPropertiesPage() {
  const { addToast } = useToast();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const loadProperties = async () => {
    setLoading(true);
    try {
      const res = await submissionService.getSubmissions({ module: 'properties' });
      setProperties(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
    const handleSync = () => loadProperties();
    if (typeof window !== 'undefined') {
      window.addEventListener('adilabad_submissions_updated', handleSync);
      return () => window.removeEventListener('adilabad_submissions_updated', handleSync);
    }
  }, []);

  return (
    <OwnerLayout title="Commercial Property Listings">
      <Head>
        <title>Properties — Adilabad Owner Portal</title>
      </Head>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Commercial Real Estate in Adilabad</h2>
            <p className="text-xs text-slate-500 mt-0.5">List shops, storage godowns, offices, and commercial lands.</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Property Listing
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(Array.isArray(properties) ? properties : []).map((p) => (
            <div key={p.id} className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    p.status === 'PUBLISHED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : p.status === 'CHANGES_REQUESTED'
                      ? 'bg-orange-100 text-orange-800'
                      : p.status === 'REJECTED'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {p.status}
                </span>
                <span className="font-bold text-emerald-700 text-xs">{p.pricing}</span>
              </div>
              <h3 className="font-bold text-slate-900 text-base">{p.title}</h3>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Location: <strong>{p.location}</strong>
              </p>
              {p.review_notes && (
                <p className="text-[10px] text-amber-800 bg-amber-50 border border-amber-200 p-1.5 rounded-lg">
                  {p.review_notes}
                </p>
              )}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono text-[10px]">ID: {p.id}</span>
                <span className="text-emerald-700 font-bold">
                  {p.status === 'PUBLISHED' ? 'Live in Directory' : 'Pending Verification'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CreateListingModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        module="properties"
        moduleLabel="Commercial Property"
        defaultCategory="Retail Storefront"
        categoryOptions={['Retail Storefront', 'Storage Godown', 'Commercial Office', 'Plot & Open Land', 'Agricultural Farm Land']}
        pricingLabel="Rent / Sale Price"
        pricingPlaceholder="e.g. ₹15,000 / month or ₹45,00,000"
        onSuccess={loadProperties}
      />
    </OwnerLayout>
  );
}
