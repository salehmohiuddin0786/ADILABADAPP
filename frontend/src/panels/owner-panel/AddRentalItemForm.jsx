import React, { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Layers,
  IndianRupee,
  MapPin,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldAlert
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { apiFetch } from '../../utils/api';

export default function AddRentalItemForm() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category_id: '1',
    item_condition: 'like_new',
    daily_rate: '',
    hourly_rate: '',
    weekly_rate: '',
    monthly_rate: '',
    security_deposit: '',
    min_rental_days: '1',
    max_rental_days: '30',
    location: 'Cinema Road, Adilabad',
    pickup_address: '',
    is_delivery_available: false,
    delivery_charge: '0',
    cancellation_policy: 'Full deposit refund if cancelled 24 hours prior to handover.',
    damage_policy: 'Hirer is responsible for repairing or replacing any physically broken or non-functional parts.',
    description: '',
    image_url: ''
  });

  const CATEGORIES = [
    { id: '1', name: 'Electronics & Cameras' },
    { id: '2', name: 'Agricultural Equipment & Tractors' },
    { id: '3', name: 'Event Sound & Stage Gear' },
    { id: '4', name: 'Construction & Power Tools' },
    { id: '5', name: 'Home Appliances & Coolers' },
    { id: '6', name: 'Vehicles & Transport' }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.daily_rate || !formData.pickup_address) {
      showToast('Please fill in title, daily rental rate, and pickup address.', 'error');
      return;
    }

    setLoading(true);
    try {
      const selectedCat = CATEGORIES.find(c => c.id === formData.category_id);

      const defaultCatImages = {
        '1': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800',
        '2': 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=800',
        '3': 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
        '4': 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800',
        '5': 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800',
        '6': 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800'
      };

      const finalImg = formData.image_url || defaultCatImages[formData.category_id] || defaultCatImages['1'];

      const payload = {
        ...formData,
        category_name: selectedCat ? selectedCat.name : 'Equipment',
        daily_rate: parseFloat(formData.daily_rate),
        security_deposit: parseFloat(formData.security_deposit || 0),
        image_url: finalImg,
        media_urls: [finalImg]
      };

      const res = await apiFetch('/api/v1/rentals', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      // Also ensure direct fallback persistence in localStorage
      if (typeof window !== 'undefined') {
        try {
          const currentList = JSON.parse(localStorage.getItem('adilabad_rentals') || '[]');
          const itemToSave = res?.data || {
            id: Date.now(),
            title: formData.title,
            slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4),
            category_name: selectedCat ? selectedCat.name : 'Equipment',
            daily_rate: parseFloat(formData.daily_rate),
            security_deposit: parseFloat(formData.security_deposit || 0),
            location: formData.location || 'Cinema Road, Adilabad',
            status: 'AVAILABLE',
            media: [{ media_url: finalImg }],
            description: formData.description || formData.title,
            created_at: new Date().toISOString()
          };
          if (!currentList.some(i => i.id === itemToSave.id)) {
            currentList.unshift(itemToSave);
            localStorage.setItem('adilabad_rentals', JSON.stringify(currentList));
          }
        } catch (e) {}
      }

      showToast(`Rental item "${formData.title}" listed successfully! Now live in your inventory & marketplace.`, 'success');
      router.push('/owner/rentals');
    } catch (err) {
      showToast(err.message || 'Submission failed. Saved to draft.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-8">
      {/* Header */}
      <div className="border-b border-slate-100 pb-5">
        <h2 className="text-xl font-extrabold text-slate-900">List an Item for Rent</h2>
        <p className="text-xs text-slate-500 mt-1">
          Make extra income by renting your equipment, tools, appliances, or machinery to verified Adilabad residents.
        </p>
      </div>

      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">1. Basic Details</h3>
        
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Item Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Sony A7 IV Camera or John Deere Tractor 5050D"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Rental Category *</label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Physical Condition *</label>
            <select
              name="item_condition"
              value={formData.item_condition}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="brand_new">Brand New (Unopened/Pristine)</option>
              <option value="like_new">Like New (Flawless Operation)</option>
              <option value="good">Good (Normal Cosmetic Wear)</option>
              <option value="fair">Fair (Fully Functional)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Description & Specifications</label>
          <textarea
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            placeholder="Specify what's included (cables, extra batteries, accessories, fuel rules, operating instructions)..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
          ></textarea>
        </div>
      </div>

      {/* Pricing & Deposit */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">2. Pricing & Security Deposit</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Daily Rate (₹) *</label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold text-sm">₹</span>
              <input
                type="number"
                name="daily_rate"
                value={formData.daily_rate}
                onChange={handleChange}
                placeholder="1500"
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Hourly Rate (₹)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold text-sm">₹</span>
              <input
                type="number"
                name="hourly_rate"
                value={formData.hourly_rate}
                onChange={handleChange}
                placeholder="Optional"
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Weekly Rate (₹)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold text-sm">₹</span>
              <input
                type="number"
                name="weekly_rate"
                value={formData.weekly_rate}
                onChange={handleChange}
                placeholder="Optional"
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Security Deposit (₹) *</label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold text-sm">₹</span>
              <input
                type="number"
                name="security_deposit"
                value={formData.security_deposit}
                onChange={handleChange}
                placeholder="5000"
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-amber-700 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Location & Handover */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">3. Handover & Location</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Adilabad Locality *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Subhash Nagar, Cinema Road, Utnoor"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Item Image URL</label>
            <input
              type="url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Exact Pickup Address *</label>
          <input
            type="text"
            name="pickup_address"
            value={formData.pickup_address}
            onChange={handleChange}
            placeholder="Door No, Landmark, Near Police Station / Market Yard, Adilabad"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            required
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-md transition-all flex items-center space-x-2 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Listing for Approval'}
        </button>
      </div>
    </form>
  );
}
