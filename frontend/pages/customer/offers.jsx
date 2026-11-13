import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Tag, Store, Clock, MapPin, Copy, Check, Trash2, ArrowRight } from 'lucide-react';
import CustomerLayout from '../../src/panels/customer-panel/CustomerLayout';
import { useToast } from '../../src/context/ToastContext';

export default function CustomerSavedOffersPage() {
  const { showToast } = useToast();
  const [copiedCode, setCopiedCode] = useState(null);

  const [savedOffers, setSavedOffers] = useState([
    {
      id: 1,
      title: 'Flat 20% Off on Full Wedding Photography Packages',
      business_name: 'Adilabad Media Works',
      code: 'ADB-MEDIA20',
      discount: '20% OFF',
      valid_till: 'Valid till 30 Nov 2026',
      location: 'Cinema Road, Adilabad',
      terms: 'Applicable on bookings of 2 days or more. Advance booking required.',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800'
    },
    {
      id: 2,
      title: 'Zero Processing Fee on LED TVs & Home Appliances',
      business_name: 'Shree Balaji Electronics & Appliances',
      code: 'BALAJI-FESTIVE',
      discount: '0% EMI',
      valid_till: 'Valid till 15 Dec 2026',
      location: 'Opp. Geeta Theatre, Cinema Road',
      terms: 'Available through Bajaj Finserv & HDFC Bank credit on select models.',
      image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800'
    }
  ]);

  const handleCopy = (code) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard?.writeText(code);
    }
    setCopiedCode(code);
    showToast(`Coupon code ${code} copied to clipboard!`, 'success');
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const handleRemove = (id, title) => {
    setSavedOffers((prev) => prev.filter((o) => o.id !== id));
    showToast(`Removed "${title}" from saved offers.`, 'info');
  };

  return (
    <CustomerLayout title="My Saved Offers & Coupons">
      <Head>
        <title>Saved Offers & Coupons — Adilabad Customer Portal</title>
      </Head>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Saved Coupons & Promo Codes</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Show these coupon codes at checkout or billing in Adilabad shops to redeem your discounts.
            </p>
          </div>
          <Link
            href="/offers"
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5"
          >
            <Tag className="w-4 h-4" />
            <span>Discover More Deals</span>
          </Link>
        </div>

        {savedOffers.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center flex flex-col items-center gap-3">
            <Tag className="w-12 h-12 text-slate-300" />
            <h3 className="text-base font-bold text-slate-800">No Saved Offers Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm">
              Explore local showroom festival promotions and save coupons to redeem in-store.
            </p>
            <Link
              href="/offers"
              className="mt-2 px-4 py-2 rounded-xl bg-brand-600 text-white font-bold text-xs"
            >
              Browse Adilabad Deals &rarr;
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savedOffers.map((offer) => (
              <div
                key={offer.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col sm:flex-row hover:shadow-md transition"
              >
                <div className="sm:w-44 h-40 sm:h-auto bg-slate-100 relative shrink-0">
                  <img src={offer.image} alt={offer.title} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 bg-rose-600 text-white font-black text-xs px-2 py-0.5 rounded-lg shadow">
                    {offer.discount}
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[11px] font-bold text-brand-600 block">{offer.business_name}</span>
                    <h4 className="font-bold text-slate-900 text-sm leading-snug line-clamp-1">{offer.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{offer.terms}</p>
                    <span className="text-[10px] text-slate-400 mt-1.5 block">{offer.location}</span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-black bg-slate-100 px-2 py-1 rounded-lg text-slate-800">
                      {offer.code}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleCopy(offer.code)}
                        className="p-1.5 rounded-lg bg-brand-50 text-brand-600 hover:bg-brand-100 text-xs font-bold transition flex items-center gap-1"
                        title="Copy code"
                      >
                        {copiedCode === offer.code ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>Copy</span>
                      </button>
                      <button
                        onClick={() => handleRemove(offer.id, offer.title)}
                        className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
