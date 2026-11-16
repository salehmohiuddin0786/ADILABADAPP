import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Tractor, Plus, Sprout, CheckCircle2, MapPin } from 'lucide-react';
import OwnerLayout from '../../src/panels/owner-panel/OwnerLayout';
import { useToast } from '../../src/context/ToastContext';
import { submissionService } from '../../src/shared/services/submissionService';
import CreateListingModal from '../../src/panels/owner-panel/CreateListingModal';

export default function OwnerAgriculturePage() {
  const { addToast } = useToast();
  const [agriListings, setAgriListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const loadAgri = async () => {
    setLoading(true);
    try {
      const res = await submissionService.getSubmissions({ module: 'agriculture' });
      setAgriListings(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAgri();
    const handleSync = () => loadAgri();
    if (typeof window !== 'undefined') {
      window.addEventListener('adilabad_submissions_updated', handleSync);
      return () => window.removeEventListener('adilabad_submissions_updated', handleSync);
    }
  }, []);

  return (
    <OwnerLayout title="Agricultural Resources & Equipment">
      <Head>
        <title>Agriculture — Adilabad Owner Portal</title>
      </Head>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Farm Machinery & Agricultural Services</h2>
            <p className="text-xs text-slate-500 mt-0.5">List harvesters, tractor implements, borewell drilling, and crop tools.</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Agri Listing
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(Array.isArray(agriListings) ? agriListings : []).map((ag) => (
            <div key={ag.id} className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    ag.status === 'PUBLISHED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : ag.status === 'CHANGES_REQUESTED'
                      ? 'bg-orange-100 text-orange-800'
                      : ag.status === 'REJECTED'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {ag.status}
                </span>
                <span className="text-xs font-bold text-emerald-700">{ag.pricing}</span>
              </div>
              <h3 className="font-bold text-slate-900 text-base">{ag.title}</h3>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> Location: {ag.location}
              </p>
              {ag.review_notes && (
                <p className="text-[10px] text-amber-800 bg-amber-50 border border-amber-200 p-1.5 rounded-lg">
                  {ag.review_notes}
                </p>
              )}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono text-[10px]">ID: {ag.id}</span>
                <span className="text-emerald-700 font-bold">
                  {ag.status === 'PUBLISHED' ? 'Live on Portal' : 'Under Review'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CreateListingModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        module="agriculture"
        moduleLabel="Agricultural Resource"
        defaultCategory="Tractor Implements & Tillage"
        categoryOptions={['Tractor Implements & Tillage', 'Harvesters & Threshers', 'Seeds & Fertilizers', 'Sprayers & Drones', 'Borewell & Irrigation']}
        pricingPlaceholder="e.g. ₹900 / hour or Market Price"
        onSuccess={loadAgri}
      />
    </OwnerLayout>
  );
}
