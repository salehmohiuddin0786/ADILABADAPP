import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Building, Plus, MapPin, Phone, MessageCircle, ExternalLink } from 'lucide-react';
import CustomerLayout from '../../src/panels/customer-panel/CustomerLayout';
import { submissionService } from '../../src/shared/services/submissionService';
import CreateListingModal from '../../src/panels/owner-panel/CreateListingModal';

export default function CustomerPropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const DEFAULT_PROPERTIES = [
    {
      id: 'PROP-1',
      title: 'Commercial Yard with Shaded Equipment Storage',
      category: 'Storage & Yard',
      pricing: '₹22,000 / month',
      location: 'Shivaji Chowk, Adilabad',
      owner_phone: '+91 98480 22334',
      status: 'PUBLISHED',
      description: '2,400 sq.ft gated commercial yard suitable for vehicle parking, goods storage, or equipment depot.'
    },
    {
      id: 'PROP-2',
      title: 'Ground Floor Retail Storefront on Main Road',
      category: 'Retail Storefront',
      pricing: '₹14,000 / month',
      location: 'Cinema Road, Adilabad',
      owner_phone: '+91 94401 92834',
      status: 'PUBLISHED',
      description: '450 sq.ft prime commercial showroom space opposite Geeta Theatre with 3-phase commercial meter.'
    }
  ];

  const loadProperties = async () => {
    setLoading(true);
    try {
      const res = await submissionService.getSubmissions({ module: 'properties' });
      const userProps = Array.isArray(res.data) ? res.data : [];

      const mergedMap = new Map();
      DEFAULT_PROPERTIES.forEach((p) => mergedMap.set(p.title, p));
      userProps.forEach((p) => mergedMap.set(p.title, p));

      setProperties(Array.from(mergedMap.values()));
    } catch (e) {
      console.error(e);
      setProperties(DEFAULT_PROPERTIES);
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
    <CustomerLayout title="My Property Enquiries & Listings">
      <Head>
        <title>Properties — Customer Hub</title>
      </Head>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Rental & Real Estate Inquiries</h2>
            <p className="text-xs text-slate-500 mt-0.5">Direct connections with verified house, shop, and plot owners in Adilabad.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/properties"
              className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
            >
              Public Directory →
            </Link>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" /> Post Property Ad
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {properties.map((p) => (
            <div key={p.id} className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {p.status}
                </span>
                <span className="font-bold text-emerald-700 text-xs">{p.pricing}</span>
              </div>
              <h3 className="font-bold text-slate-900 text-base">{p.title}</h3>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{p.location}</span>
              </p>
              {p.description && <p className="text-xs text-slate-500 line-clamp-2">{p.description}</p>}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono text-[10px]">ID: {p.id}</span>
                <a
                  href={`tel:${p.owner_phone}`}
                  className="bg-emerald-800 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center space-x-1.5 shadow"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Owner</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CreateListingModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        module="properties"
        moduleLabel="Property Listing"
        defaultCategory="Commercial Shop"
        categoryOptions={['Commercial Shop', 'Storage Godown', 'Residential Flat', 'Independent House', 'Open Plot']}
        pricingLabel="Monthly Rent / Sale Price"
        pricingPlaceholder="e.g. ₹15,000 / month"
        onSuccess={loadProperties}
      />
    </CustomerLayout>
  );
}
