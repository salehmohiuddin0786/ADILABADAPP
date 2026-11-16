import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Utensils, Plus, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import OwnerLayout from '../../src/panels/owner-panel/OwnerLayout';
import { useToast } from '../../src/context/ToastContext';
import { submissionService } from '../../src/shared/services/submissionService';
import CreateListingModal from '../../src/panels/owner-panel/CreateListingModal';

export default function OwnerRestaurantsPage() {
  const { addToast } = useToast();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const loadRestaurants = async () => {
    setLoading(true);
    try {
      const res = await submissionService.getSubmissions({ module: 'restaurants' });
      setRestaurants(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRestaurants();
    const handleSync = () => loadRestaurants();
    if (typeof window !== 'undefined') {
      window.addEventListener('adilabad_submissions_updated', handleSync);
      return () => window.removeEventListener('adilabad_submissions_updated', handleSync);
    }
  }, []);

  return (
    <OwnerLayout title="Restaurant Profiles & Food Menus">
      <Head>
        <title>Restaurants — Adilabad Owner Portal</title>
      </Head>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Dining & Cloud Kitchen Outlets</h2>
            <p className="text-xs text-slate-500 mt-0.5">Manage food menus, direct order phone numbers, and dining tables.</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Restaurant Profile
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(Array.isArray(restaurants) ? restaurants : []).map((r) => (
            <div key={r.id} className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    r.status === 'PUBLISHED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : r.status === 'CHANGES_REQUESTED'
                      ? 'bg-orange-100 text-orange-800'
                      : r.status === 'REJECTED'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {r.status}
                </span>
                <span className="text-xs font-bold text-slate-400">{r.pricing || 'Dine-in & Takeaway'}</span>
              </div>
              <h3 className="font-bold text-slate-900 text-base">{r.title}</h3>
              <p className="text-xs font-medium text-slate-600">{r.category}</p>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-brand-600" />
                <span>{r.location}</span>
              </div>
              {r.review_notes && (
                <p className="text-[10px] text-amber-800 bg-amber-50 border border-amber-200 p-1.5 rounded-lg">
                  {r.review_notes}
                </p>
              )}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono text-[10px]">ID: {r.id}</span>
                <span className="text-emerald-700 font-bold">
                  {r.status === 'PUBLISHED' ? 'Live on Portal' : 'Under Review'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CreateListingModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        module="restaurants"
        moduleLabel="Restaurant / Food Outlet"
        defaultCategory="Biryani & Mughlai"
        categoryOptions={['Biryani & Mughlai', 'South Indian Tiffins', 'Family Restaurant & Dhaba', 'Bakery & Sweets', 'Fast Food & Cafes']}
        pricingLabel="Pricing / Avg Cost for 2"
        pricingPlaceholder="e.g. ₹350 for two"
        onSuccess={loadRestaurants}
      />
    </OwnerLayout>
  );
}
