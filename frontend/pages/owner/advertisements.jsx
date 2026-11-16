import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Tag, Eye, MousePointerClick, Plus, Sparkles, ExternalLink, X, MapPin } from 'lucide-react';
import OwnerLayout from '../../src/panels/owner-panel/OwnerLayout';
import { useToast } from '../../src/context/ToastContext';
import { submissionService } from '../../src/shared/services/submissionService';

export default function OwnerAdvertisementsPage() {
  const { addToast } = useToast();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Electronics',
    pricing: '₹1,500/day',
    location: 'Cinema Road, Adilabad',
    phone: '+91 98480 22334',
    description: '',
    image_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800'
  });

  const loadAds = async () => {
    setLoading(true);
    try {
      const res = await submissionService.getSubmissions({ module: 'advertisements' });
      setAds(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAds();
    const handleSync = () => loadAds();
    if (typeof window !== 'undefined') {
      window.addEventListener('adilabad_submissions_updated', handleSync);
      return () => window.removeEventListener('adilabad_submissions_updated', handleSync);
    }
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.pricing) {
      addToast('Please provide advertisement title and pricing details.', 'error');
      return;
    }

    const res = await submissionService.createSubmission({
      module: 'advertisements',
      title: formData.title,
      category: formData.category,
      pricing: formData.pricing,
      location: formData.location,
      owner_phone: formData.phone,
      description: formData.description,
      image_url: formData.image_url
    });

    if (res.success) {
      addToast(`Advertisement "${formData.title}" submitted for Super Admin approval!`, 'success');
      setShowCreateModal(false);
      setFormData({
        title: '',
        category: 'Electronics',
        pricing: '₹1,500/day',
        location: 'Cinema Road, Adilabad',
        phone: '+91 98480 22334',
        description: '',
        image_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800'
      });
      loadAds();
    }
  };

  return (
    <OwnerLayout title="My Advertisements & Classifieds">
      <Head>
        <title>Manage Advertisements — Adilabad Owner Portal</title>
      </Head>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Commercial Advertisements</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live advertisements visible to Adilabad shoppers, renters, and local businesses.
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Create Advertisement
          </button>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold">
                <tr>
                  <th className="py-4 px-6">Advertisement Title</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Price / Terms</th>
                  <th className="py-4 px-4">Location</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(Array.isArray(ads) ? ads : []).map((ad) => (
                  <tr key={ad.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={ad.image_url || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=100'}
                          alt={ad.title}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                        />
                        <div>
                          <span className="font-bold text-slate-900">{ad.title}</span>
                          {ad.review_notes && (
                            <p className="text-[10px] text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded mt-0.5">
                              Note: {ad.review_notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-500">{ad.category}</td>
                    <td className="py-4 px-4 font-bold text-emerald-700">{ad.pricing}</td>
                    <td className="py-4 px-4 text-slate-500">{ad.location}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          ad.status === 'PUBLISHED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ad.status === 'CHANGES_REQUESTED'
                            ? 'bg-orange-100 text-orange-800'
                            : ad.status === 'REJECTED'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {ad.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {ad.status === 'PUBLISHED' ? (
                        <Link
                          href={`/advertisements/${ad.slug || ad.id}`}
                          target="_blank"
                          className="text-brand-600 hover:text-brand-700 font-bold inline-flex items-center gap-1"
                        >
                          View Ad <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      ) : (
                        <span className="text-slate-400 font-mono text-[10px]">Awaiting Super Admin</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Advertisement Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-900">Create New Advertisement Proposal</h3>
              <button onClick={() => setShowCreateModal(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Ad Headline / Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Enfield Classic 350 - Stealth Black in Adilabad"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-800 outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-800 outline-none"
                  >
                    <option value="Electronics">Electronics & Appliances</option>
                    <option value="Vehicles">Vehicles & Bikes</option>
                    <option value="Properties">Real Estate & Shops</option>
                    <option value="Jewellery & Retail">Jewellery & Retail</option>
                    <option value="Agriculture">Agriculture & Tractors</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Price / Terms *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ₹1,500/day or ₹1,20,000"
                    value={formData.pricing}
                    onChange={(e) => setFormData({ ...formData, pricing: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-800 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Location / Mandal</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-800 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Banner Image URL</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description & Promotion Details</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter specifications, contact timings, and special discounts..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-800 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow"
                >
                  Submit for Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </OwnerLayout>
  );
}
