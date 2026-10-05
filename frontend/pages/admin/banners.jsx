import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Image as ImageIcon, Plus, Edit, Trash2 } from 'lucide-react';
import AdminLayout from '../../src/components/layout/AdminLayout';
import { apiFetch } from '../../src/utils/api';
import { useToast } from '../../src/context/ToastContext';

export default function AdminBannersPage() {
  const { addToast } = useToast();
  const [banners, setBanners] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [ctaText, setCtaText] = useState('Explore Now');
  const [linkUrl, setLinkUrl] = useState('/advertisements');
  const [imageUrl, setImageUrl] = useState('');
  const [priority, setPriority] = useState(1);

  const fetchBanners = async () => {
    try {
      const res = await apiFetch('/banners/admin/list');
      if (res.success) setBanners(res.data);
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const openCreate = () => {
    setEditingBanner(null);
    setTitle('');
    setSubtitle('');
    setCtaText('Explore Now');
    setLinkUrl('/advertisements');
    setImageUrl('https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80');
    setPriority(banners.length + 1);
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingBanner) {
        const res = await apiFetch(`/banners/admin/update/${editingBanner.id}`, {
          method: 'PUT',
          body: JSON.stringify({ title, subtitle, cta_text: ctaText, link_url: linkUrl, image_url: imageUrl, priority })
        });
        if (res.success) {
          addToast('Banner updated!', 'success');
          setModalOpen(false);
          fetchBanners();
        }
      } else {
        const res = await apiFetch('/banners/admin/create', {
          method: 'POST',
          body: JSON.stringify({ title, subtitle, cta_text: ctaText, link_url: linkUrl, image_url: imageUrl, priority })
        });
        if (res.success) {
          addToast('Banner created!', 'success');
          setModalOpen(false);
          fetchBanners();
        }
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this banner?')) return;
    try {
      const res = await apiFetch(`/banners/admin/delete/${id}`, { method: 'DELETE' });
      if (res.success) {
        addToast(res.message, 'success');
        fetchBanners();
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <AdminLayout title="Homepage Banners">
      <Head>
        <title>Manage Banners — Adilabad App Admin</title>
      </Head>

      <div className="space-y-6">
        <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Promotional Banners ({banners.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Control the prominent hero and seasonal banners displayed on the homepage.
            </p>
          </div>

          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add Banner</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map((b) => (
            <div key={b.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="relative aspect-[21/9] bg-slate-900">
                <img src={b.image_url} alt={b.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/80 text-white text-xs font-bold">
                  Priority: {b.priority}
                </div>
              </div>
              <div className="p-6 space-y-2">
                <h3 className="font-bold text-slate-900 text-base">{b.title}</h3>
                <p className="text-xs text-slate-500">{b.subtitle}</p>
                <p className="text-xs text-brand-600 font-mono pt-1">Link: {b.link_url}</p>

                <div className="pt-4 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-lg mb-4">
              {editingBanner ? 'Edit Banner' : 'Create Banner'}
            </h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Subtitle
                </label>
                <textarea
                  rows={2}
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Link URL *
                  </label>
                  <input
                    type="text"
                    required
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Priority
                  </label>
                  <input
                    type="number"
                    value={priority}
                    onChange={(e) => setPriority(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md"
                >
                  Save Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
