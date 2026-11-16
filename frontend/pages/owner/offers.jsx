import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Percent, Plus, Tag, Clock } from 'lucide-react';
import OwnerLayout from '../../src/panels/owner-panel/OwnerLayout';
import { useToast } from '../../src/context/ToastContext';
import { submissionService } from '../../src/shared/services/submissionService';
import CreateListingModal from '../../src/panels/owner-panel/CreateListingModal';

export default function OwnerOffersPage() {
  const { addToast } = useToast();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const loadOffers = async () => {
    setLoading(true);
    try {
      const res = await submissionService.getSubmissions({ module: 'offers' });
      setCoupons(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOffers();
    const handleSync = () => loadOffers();
    if (typeof window !== 'undefined') {
      window.addEventListener('adilabad_submissions_updated', handleSync);
      return () => window.removeEventListener('adilabad_submissions_updated', handleSync);
    }
  }, []);

  return (
    <OwnerLayout title="Promotional Offers & Coupons">
      <Head>
        <title>Offers & Coupons — Adilabad Owner Portal</title>
      </Head>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Discount Coupons & Customer Perks</h2>
            <p className="text-xs text-slate-500 mt-0.5">Publish discount codes to boost bookings and walk-in footfalls.</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Create Coupon / Offer
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(Array.isArray(coupons) ? coupons : []).map((cp) => (
            <div key={cp.id} className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono font-black text-amber-900 bg-amber-100 border border-amber-300 px-3 py-1 rounded-xl text-xs">
                  {cp.title}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    cp.status === 'PUBLISHED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : cp.status === 'CHANGES_REQUESTED'
                      ? 'bg-orange-100 text-orange-800'
                      : cp.status === 'REJECTED'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {cp.status}
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-base">{cp.pricing || cp.category}</h3>
              <p className="text-xs text-slate-500">{cp.description || 'Valid across Adilabad outlets.'}</p>
              {cp.review_notes && (
                <p className="text-[10px] text-amber-800 bg-amber-50 border border-amber-200 p-1.5 rounded-lg">
                  {cp.review_notes}
                </p>
              )}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono text-[10px]">ID: {cp.id}</span>
                <span className="text-emerald-700 font-bold">
                  {cp.status === 'PUBLISHED' ? 'Active on Public App' : 'Pending Super Admin Approval'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CreateListingModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        module="offers"
        moduleLabel="Discount Offer / Coupon"
        defaultCategory="Retail Discount"
        categoryOptions={['Retail Discount', 'Rental Equipment Offer', 'Dining Deal', 'Festival Special']}
        pricingLabel="Offer Details / Discount Value"
        pricingPlaceholder="e.g. 20% OFF or Flat ₹500 OFF"
        onSuccess={loadOffers}
      />
    </OwnerLayout>
  );
}
