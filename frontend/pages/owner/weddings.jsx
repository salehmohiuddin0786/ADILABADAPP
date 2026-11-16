import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { PartyPopper, Plus, Calendar, Camera, MapPin } from 'lucide-react';
import OwnerLayout from '../../src/panels/owner-panel/OwnerLayout';
import { useToast } from '../../src/context/ToastContext';
import { submissionService } from '../../src/shared/services/submissionService';
import CreateListingModal from '../../src/panels/owner-panel/CreateListingModal';

export default function OwnerWeddingsPage() {
  const { addToast } = useToast();
  const [weddingServices, setWeddingServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const loadWeddings = async () => {
    setLoading(true);
    try {
      const res = await submissionService.getSubmissions({ module: 'weddings' });
      setWeddingServices(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeddings();
    const handleSync = () => loadWeddings();
    if (typeof window !== 'undefined') {
      window.addEventListener('adilabad_submissions_updated', handleSync);
      return () => window.removeEventListener('adilabad_submissions_updated', handleSync);
    }
  }, []);

  return (
    <OwnerLayout title="Wedding & Event Vendor Listings">
      <Head>
        <title>Weddings — Adilabad Owner Portal</title>
      </Head>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Marriage & Event Services</h2>
            <p className="text-xs text-slate-500 mt-0.5">List function halls, caterers, sound setups, and photo crews.</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Wedding Service
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(Array.isArray(weddingServices) ? weddingServices : []).map((w) => (
            <div key={w.id} className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    w.status === 'PUBLISHED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : w.status === 'CHANGES_REQUESTED'
                      ? 'bg-orange-100 text-orange-800'
                      : w.status === 'REJECTED'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {w.status}
                </span>
                <span className="text-xs font-bold text-emerald-700">{w.pricing}</span>
              </div>
              <h3 className="font-bold text-slate-900 text-base">{w.title}</h3>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> Location: {w.location}
              </p>
              {w.review_notes && (
                <p className="text-[10px] text-amber-800 bg-amber-50 border border-amber-200 p-1.5 rounded-lg">
                  {w.review_notes}
                </p>
              )}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono text-[10px]">ID: {w.id}</span>
                <span className="text-emerald-700 font-bold">
                  {w.status === 'PUBLISHED' ? 'Live on Portal' : 'Under Review'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CreateListingModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        module="weddings"
        moduleLabel="Wedding & Event Vendor"
        defaultCategory="Cinematic Photo & Drone"
        categoryOptions={['Cinematic Photo & Drone', 'Stage Decoration & Mandap', 'Function Halls & Lawns', 'Catering & Food Service', 'Band & Orchestra']}
        pricingPlaceholder="e.g. ₹35,000 / event"
        onSuccess={loadWeddings}
      />
    </OwnerLayout>
  );
}
