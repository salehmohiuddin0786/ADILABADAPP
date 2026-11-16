import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Store, MapPin, Phone, Clock, Plus, ExternalLink, CheckCircle2, X } from 'lucide-react';
import OwnerLayout from '../../src/panels/owner-panel/OwnerLayout';
import { useToast } from '../../src/context/ToastContext';
import { submissionService } from '../../src/shared/services/submissionService';

export default function OwnerBusinessesPage() {
  const { addToast } = useToast();
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Electronics & Retail',
    locality: 'Cinema Road, Adilabad',
    phone: '+91 98480 22334',
    trade_license: 'ADB-MUNC-TL-8841',
    description: '',
    image_url: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800'
  });

  const loadBusinesses = async () => {
    setLoading(true);
    try {
      const res = await submissionService.getSubmissions({ module: 'businesses' });
      setBusinesses(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBusinesses();
    const handleSync = () => loadBusinesses();
    if (typeof window !== 'undefined') {
      window.addEventListener('adilabad_submissions_updated', handleSync);
      return () => window.removeEventListener('adilabad_submissions_updated', handleSync);
    }
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.locality) {
      addToast('Please provide business name and address locality.', 'error');
      return;
    }

    const res = await submissionService.createSubmission({
      module: 'businesses',
      title: formData.name,
      category: formData.category,
      pricing: 'Storefront Directory Listing',
      location: formData.locality,
      owner_phone: formData.phone,
      description: formData.description,
      image_url: formData.image_url,
      specs: { trade_license: formData.trade_license }
    });

    if (res.success) {
      addToast(`Business Profile "${formData.name}" submitted for Super Admin verification & publishing!`, 'success');
      setShowRegisterModal(false);
      setFormData({
        name: '',
        category: 'Electronics & Retail',
        locality: 'Cinema Road, Adilabad',
        phone: '+91 98480 22334',
        trade_license: 'ADB-MUNC-TL-8841',
        description: '',
        image_url: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800'
      });
      loadBusinesses();
    }
  };

  return (
    <OwnerLayout title="My Business Profiles">
      <Head>
        <title>Business Profiles — Adilabad Owner Portal</title>
      </Head>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Registered Commercial Stores</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage physical storefronts, address coordinates, and telephone leads in Adilabad.
            </p>
          </div>
          <button
            onClick={() => setShowRegisterModal(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Register New Business
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(Array.isArray(businesses) ? businesses : []).map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm space-y-4 hover:border-slate-300 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={b.image_url || 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=100'}
                    alt={b.title}
                    className="w-12 h-12 rounded-2xl object-cover bg-amber-50 border border-amber-200"
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{b.title}</h3>
                    <span className="text-xs font-semibold text-slate-500">{b.category}</span>
                  </div>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    b.status === 'PUBLISHED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : b.status === 'CHANGES_REQUESTED'
                      ? 'bg-orange-100 text-orange-800'
                      : b.status === 'REJECTED'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {b.status}
                </span>
              </div>

              <div className="text-xs text-slate-600 space-y-1.5 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{b.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{b.owner_phone}</span>
                </div>
                {b.description && (
                  <p className="text-[11px] text-slate-500 pt-1 line-clamp-2">{b.description}</p>
                )}
                {b.review_notes && (
                  <p className="text-[10px] text-amber-800 bg-amber-50 border border-amber-200 p-2 rounded-xl mt-2">
                    <strong>Admin Verification Note:</strong> {b.review_notes}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <span className="text-[10px] font-mono text-slate-400">ID: {b.id}</span>
                {b.status === 'PUBLISHED' ? (
                  <Link
                    href={`/businesses/${b.slug || b.id}`}
                    target="_blank"
                    className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                  >
                    View Storefront <ExternalLink className="w-3 h-3" />
                  </Link>
                ) : (
                  <span className="text-xs font-bold text-amber-600">Pending Super Admin Verification</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Register Business Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-900">Register New Commercial Business</h3>
              <button onClick={() => setShowRegisterModal(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegister} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Business / Storefront Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shree Balaji Electronics & Appliances"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-800 outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Commercial Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-800 outline-none"
                  >
                    <option value="Electronics & Retail">Electronics & Appliances</option>
                    <option value="Agriculture & Farm Supplies">Agriculture & Farm Supplies</option>
                    <option value="Automotive & Garage">Automotive & Garages</option>
                    <option value="Medical & Healthcare">Pharmacy & Healthcare</option>
                    <option value="Clothing & Textiles">Clothing & Boutiques</option>
                    <option value="Restaurants & Food">Dining & Sweets</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Municipal Trade License / GST</label>
                  <input
                    type="text"
                    placeholder="e.g. ADB-MUNC-TL-8841"
                    value={formData.trade_license}
                    onChange={(e) => setFormData({ ...formData, trade_license: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-800 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Locality / Address *</label>
                  <input
                    type="text"
                    required
                    value={formData.locality}
                    onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Store Helpline / WhatsApp</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-800 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Storefront Photo URL</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">About the Business & Services</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your authorized brands, repair services, delivery options..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-800 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow"
                >
                  Register Storefront
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </OwnerLayout>
  );
}
