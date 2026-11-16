import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ShoppingBag, Plus, Tag, MapPin, Phone, MessageCircle, ExternalLink, X, CheckCircle2 } from 'lucide-react';
import CustomerLayout from '../../src/panels/customer-panel/CustomerLayout';
import { submissionService } from '../../src/shared/services/submissionService';
import { useToast } from '../../src/context/ToastContext';
import CreateListingModal from '../../src/panels/owner-panel/CreateListingModal';

export default function CustomerBuySellPage() {
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
    <CustomerLayout title="My Buy & Sell Ads">
      <Head>
        <title>Buy & Sell — Customer Hub</title>
      </Head>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Your Classified Listings & Sell Items</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Sell used smartphones, bikes, furniture, equipment, or electronics directly in Adilabad.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/buy-sell"
              className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
            >
              Browse All Listings →
            </Link>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" /> Post Item to Sell
            </button>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="space-y-4">
          {loading ? (
            <div className="py-16 text-center flex flex-col items-center gap-2 bg-white rounded-3xl border border-slate-200">
              <div className="w-8 h-8 border-3 border-emerald-800 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-semibold text-slate-500">Loading your items...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 border border-slate-200/90 shadow-sm text-center space-y-3">
              <ShoppingBag className="w-12 h-12 text-emerald-800 mx-auto" />
              <h3 className="font-bold text-slate-900 text-base">No Items Listed for Sale Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Got a used phone, bicycle, camera, or furniture? Post it here for free and connect with genuine local buyers.
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-2 px-5 py-2.5 rounded-xl bg-emerald-800 text-white font-bold text-xs shadow"
              >
                + Post Your First Item
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {items.map((it) => (
                <div
                  key={it.id}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition"
                >
                  <div className="relative h-44 bg-slate-100">
                    <img
                      src={it.image_url || 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600'}
                      alt={it.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">
                      {it.category}
                    </span>
                    <span
                      className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-lg ${
                        it.status === 'PUBLISHED'
                          ? 'bg-emerald-600 text-white'
                          : it.status === 'CHANGES_REQUESTED'
                          ? 'bg-orange-600 text-white'
                          : it.status === 'REJECTED'
                          ? 'bg-rose-600 text-white'
                          : 'bg-amber-500 text-slate-950 font-black'
                      }`}
                    >
                      {it.status === 'PUBLISHED' ? 'LIVE' : it.status}
                    </span>
                    <span className="absolute bottom-3 right-3 bg-emerald-800 text-white text-xs font-black px-3 py-1 rounded-xl shadow">
                      {it.pricing}
                    </span>
                  </div>

                  <div className="p-5 space-y-2.5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{it.title}</h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{it.location}</span>
                      </p>
                      {it.description && (
                        <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{it.description}</p>
                      )}
                      {it.review_notes && (
                        <p className="text-[10px] text-amber-800 bg-amber-50 border border-amber-200 px-2 py-1 rounded-lg mt-2">
                          <strong>Admin Note:</strong> {it.review_notes}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-mono text-[10px]">ID: {it.id}</span>
                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${it.owner_phone}`}
                          className="p-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                          title="Call"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={`https://wa.me/91${it.owner_phone?.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                          title="WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <CreateListingModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        module="buy-sell"
        moduleLabel="Item to Sell"
        defaultCategory="Mobiles & Electronics"
        categoryOptions={['Mobiles & Electronics', 'Bikes & Vehicles', 'Home & Furniture', 'Tools & Machinery', 'Books & Sports', 'Fashion & Clothing']}
        pricingLabel="Selling Price"
        pricingPlaceholder="e.g. ₹12,000"
        onSuccess={loadItems}
      />
    </CustomerLayout>
  );
}
