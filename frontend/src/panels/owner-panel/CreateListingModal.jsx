import React, { useState } from 'react';
import { X, Plus, Sparkles, UploadCloud } from 'lucide-react';
import { submissionService } from '../../shared/services/submissionService';
import { useToast } from '../../context/ToastContext';

export default function CreateListingModal({
  isOpen,
  onClose,
  module = 'buy-sell',
  moduleLabel = 'Listing',
  defaultCategory = 'General',
  categoryOptions = ['General'],
  pricingLabel = 'Price / Fees',
  pricingPlaceholder = 'e.g. ₹5,000 or Contact for Price',
  onSuccess
}) {
  const { addToast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: defaultCategory,
    pricing: '',
    location: 'Adilabad Town',
    phone: '+91 98480 22334',
    description: '',
    image_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800'
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.pricing) {
      addToast('Please provide a title and pricing details.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await submissionService.createSubmission({
        module,
        title: formData.title,
        category: formData.category,
        pricing: formData.pricing,
        location: formData.location,
        owner_phone: formData.phone,
        description: formData.description,
        image_url: formData.image_url
      });

      if (res.success) {
        addToast(res.message, 'success');
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (err) {
      addToast(err.message || 'Failed to submit', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-600 font-bold block">
              {moduleLabel} Submission
            </span>
            <h3 className="text-lg font-black text-slate-900">Add New {moduleLabel}</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Headline / Listing Title *</label>
            <input
              type="text"
              required
              placeholder={`Enter title for this ${moduleLabel.toLowerCase()}...`}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-800 outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-800 outline-none"
              >
                {categoryOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">{pricingLabel} *</label>
              <input
                type="text"
                required
                placeholder={pricingPlaceholder}
                value={formData.pricing}
                onChange={(e) => setFormData({ ...formData, pricing: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-800 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
            <label className="font-bold text-slate-700 block mb-1">Photo / Media URL</label>
            <input
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-800 outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Description & Details</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe condition, specifications, warranty, or requirements..."
              className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-800 outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 font-bold text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>{submitting ? 'Submitting...' : 'Submit for Admin Approval'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
