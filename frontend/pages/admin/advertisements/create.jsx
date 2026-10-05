import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Megaphone,
  ArrowLeft,
  Upload,
  Plus,
  Trash2,
  Sparkles,
  CheckCircle,
  Eye,
  MapPin,
  Image as ImageIcon
} from 'lucide-react';
import AdminLayout from '../../../src/components/layout/AdminLayout';
import { apiFetch } from '../../../src/utils/api';
import { useToast } from '../../../src/context/ToastContext';

export default function CreateAdvertisementPage() {
  const router = useRouter();
  const { addToast } = useToast();

  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [locationId, setLocationId] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [priceType, setPriceType] = useState('fixed');
  const [priceDisplay, setPriceDisplay] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [whatsapp, setWhatsapp] = useState('+91 ');
  const [website, setWebsite] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [startDate, setStartDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [status, setStatus] = useState('published');

  // Images state (URLs or uploads)
  const [images, setImages] = useState([
    'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1000&q=80'
  ]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [uploadingFiles, setUploadingFiles] = useState(false);

  useEffect(() => {
    Promise.all([apiFetch('/categories'), apiFetch('/locations')])
      .then(([cats, locs]) => {
        if (cats.success && cats.data) setCategories(cats.data);
        if (locs.success && locs.data) setLocations(locs.data);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleAddImageUrl = () => {
    if (newImageUrl.trim()) {
      setImages((prev) => [...prev, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingFiles(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    try {
      const res = await apiFetch('/admin/upload', {
        method: 'POST',
        body: formData
      });

      if (res.success && res.urls) {
        // Build full URLs for preview
        const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
        const fullUrls = res.urls.map((u) => `${apiBase}${u}`);
        setImages((prev) => [...prev, ...fullUrls]);
        addToast(`${res.urls.length} image(s) uploaded successfully!`, 'success');
      }
    } catch (err) {
      addToast(err.message || 'File upload failed', 'error');
    } finally {
      setUploadingFiles(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !businessName || !categoryId || !description || !phone || !address) {
      addToast('Please complete all required fields (*)', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        business_name: businessName.trim(),
        category_id: parseInt(categoryId, 10),
        location_id: locationId ? parseInt(locationId, 10) : null,
        description: description.trim(),
        price: price ? parseFloat(price) : null,
        price_type: priceType,
        price_display: priceDisplay || (price ? `₹${price}` : null),
        phone: phone.trim(),
        whatsapp: whatsapp ? whatsapp.trim() : null,
        website: website ? website.trim() : null,
        address: address.trim(),
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        video_url: videoUrl ? videoUrl.trim() : null,
        start_date: startDate || null,
        expiry_date: expiryDate || null,
        is_featured: isFeatured ? 1 : 0,
        status,
        images
      };

      const res = await apiFetch('/advertisements/admin/create', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (res.success) {
        addToast('Advertisement created and published successfully!', 'success');
        router.push('/admin/advertisements');
      }
    } catch (err) {
      addToast(err.message || 'Failed to create advertisement', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout title="Create Advertisement">
      <Head>
        <title>Create Advertisement — Adilabad App Admin</title>
      </Head>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header toolbar */}
        <div className="flex items-center justify-between">
          <Link
            href="/admin/advertisements"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Advertisements</span>
          </Link>

          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center gap-1.5"
          >
            <Eye className="w-4 h-4" />
            <span>{previewMode ? 'Back to Editor' : 'Preview Live Card'}</span>
          </button>
        </div>

        {/* Live Preview Card */}
        {previewMode ? (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-lg max-w-sm mx-auto">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 text-center">
              Preview Representation
            </h4>
            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <img
                src={images[0] || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80'}
                alt="Preview"
                className="w-full aspect-[16/10] object-cover"
              />
              <div className="p-4 space-y-2">
                {priceDisplay && <p className="text-lg font-black text-brand-600">{priceDisplay}</p>}
                <h3 className="font-bold text-slate-900 text-base">{title || 'Untitled Advertisement'}</h3>
                <p className="text-xs text-slate-500 font-semibold">{businessName || 'Business Name'}</p>
                <p className="text-xs text-slate-400">{address || 'Adilabad, Telangana'}</p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 1. Basic Info */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">
                1. Advertisement & Business Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Advertisement Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Shree Balaji Mega Festival Electronics Sale"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Business / Person Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g., Shree Balaji Electronics"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    required
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Full Description *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide complete specifications, features, warranty, pricing terms..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>
            </div>

            {/* 2. Pricing & Contact */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">
                2. Pricing & Direct Contact Lines
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Numeric Price (Optional)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="25000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Price Type
                  </label>
                  <select
                    value={priceType}
                    onChange={(e) => setPriceType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="fixed">Fixed Price</option>
                    <option value="negotiable">Negotiable</option>
                    <option value="starting_at">Starting At</option>
                    <option value="contact_for_price">Contact for Price</option>
                    <option value="free">Free</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Display Label
                  </label>
                  <input
                    type="text"
                    value={priceDisplay}
                    onChange={(e) => setPriceDisplay(e.target.value)}
                    placeholder="e.g. ₹24,990 onwards"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phone Number (for 1-click calls) *
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 94401 23456"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="text"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+91 94401 23456"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Website URL
                  </label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>
            </div>

            {/* 3. Location & Address */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">
                3. Adilabad Location & Physical Address
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Locality in Adilabad
                  </label>
                  <select
                    value={locationId}
                    onChange={(e) => setLocationId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="">Select Locality</option>
                    {locations.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Physical Address in Adilabad *
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Cinema Road, Opposite Geeta Theatre, Adilabad"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>
            </div>

            {/* 4. Images Upload & Management */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">
                4. Images & Media (First image will be Primary)
              </h3>

              {/* Upload input & URL input */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border-2 border-dashed border-slate-300 hover:border-brand-500 bg-slate-50 flex flex-col items-center justify-center text-center cursor-pointer relative">
                  <Upload className="w-6 h-6 text-brand-600 mb-1" />
                  <span className="text-xs font-bold text-slate-800">
                    {uploadingFiles ? 'Uploading images...' : 'Upload Image Files (Max 5MB)'}
                  </span>
                  <span className="text-[10px] text-slate-400">JPEG, PNG, WEBP</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>

                <div className="flex flex-col justify-center space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Or Add Image via Web URL:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="https://example.com/photo.jpg"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs shrink-0"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Images preview list */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {images.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-[16/10] rounded-xl overflow-hidden border border-slate-200 group bg-slate-100"
                  >
                    <img src={url} alt="Uploaded" className="w-full h-full object-cover" />
                    {idx === 0 && (
                      <span className="absolute top-1 left-1 px-2 py-0.5 rounded bg-brand-600 text-white text-[9px] font-bold">
                        Primary
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition shadow"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Publishing Controls */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">
                5. Publishing Status & Promotion
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Publication Status *
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="published">Published (Visible Publicly)</option>
                    <option value="draft">Draft (Hidden)</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>

                <div className="sm:col-span-2 flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="w-5 h-5 rounded text-amber-500 focus:ring-amber-500 border-slate-300"
                    />
                    <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500 fill-current" />
                      Mark as Featured Advertisement (Top Homepage Placement)
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Toolbar */}
            <div className="flex items-center justify-end gap-3 pt-4">
              <Link
                href="/admin/advertisements"
                className="px-5 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-lg shadow-brand-600/30 transition disabled:opacity-50"
              >
                {submitting ? 'Publishing Advertisement...' : 'Create & Publish Advertisement'}
              </button>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
}
