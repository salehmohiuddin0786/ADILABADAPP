import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { ShoppingBag, Plus, Tag, CheckCircle2 } from 'lucide-react';
import OwnerLayout from '../../src/panels/owner-panel/OwnerLayout';
import { useToast } from '../../src/context/ToastContext';
import { submissionService } from '../../src/shared/services/submissionService';
import CreateListingModal from '../../src/panels/owner-panel/CreateListingModal';

export default function OwnerBuySellPage() {
  const { addToast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const loadItems = async () => {
    setLoading(true);
    try {
      const res = await submissionService.getSubmissions({ module: 'buy-sell' });
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
    const handleSync = () => loadItems();
    if (typeof window !== 'undefined') {
      window.addEventListener('adilabad_submissions_updated', handleSync);
      return () => window.removeEventListener('adilabad_submissions_updated', handleSync);
    }
  }, []);

  return (
    <OwnerLayout title="Buy & Sell Marketplace Listings">
      <Head>
        <title>Buy & Sell Listings — Adilabad Owner Portal</title>
      </Head>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Pre-Owned & Commercial Stock</h2>
            <p className="text-xs text-slate-500 mt-0.5">List second-hand items and refurbished commercial equipment.</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Post Second-Hand Listing
          </button>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold">
                <tr>
                  <th className="py-4 px-6">Item Title</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Price</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4">Location</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(Array.isArray(items) ? items : []).map((it) => (
                  <tr key={it.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={it.image_url || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=100'}
                          alt={it.title}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                        />
                        <div>
                          <span className="font-bold text-slate-900">{it.title}</span>
                          {it.review_notes && (
                            <p className="text-[10px] text-amber-800 bg-amber-50 border border-amber-200 p-1 rounded mt-0.5">
                              {it.review_notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-500">{it.category}</td>
                    <td className="py-4 px-4 font-bold text-emerald-700">{it.pricing}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          it.status === 'PUBLISHED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : it.status === 'CHANGES_REQUESTED'
                            ? 'bg-orange-100 text-orange-800'
                            : it.status === 'REJECTED'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {it.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-500">{it.location}</td>
                    <td className="py-4 px-6 text-right">
                      <span className="text-slate-400 font-mono text-[10px]">ID: {it.id}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <CreateListingModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        module="buy-sell"
        moduleLabel="Buy & Sell Item"
        defaultCategory="Electronics / Production"
        categoryOptions={['Electronics / Production', 'Store Fixtures', 'Machinery', 'Furniture', 'Vehicles']}
        pricingPlaceholder="e.g. ₹4,500"
        onSuccess={loadItems}
      />
    </OwnerLayout>
  );
}
