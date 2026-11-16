import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import {
  Wrench,
  Search,
  Plus,
  CheckCircle2,
  Clock,
  MapPin,
  Trash2,
  Check,
  AlertTriangle,
  RefreshCw,
  Phone,
  User,
  ShieldCheck
} from 'lucide-react';
import AdminLayout from '../../src/components/layout/AdminLayout';
import { submissionService } from '../../src/shared/services/submissionService';
import { useToast } from '../../src/context/ToastContext';

export default function AdminServicesPage() {
  const { addToast } = useToast();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Home & Commercial Services',
    pricing: '₹499 Inspection Fee',
    location: 'Gandhi Chowk, Adilabad',
    owner_name: 'Adilabad Service Hub',
    owner_phone: '+91 98480 22334',
    description: '',
    image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800'
  });

  const loadServices = async () => {
    setLoading(true);
    try {
      const res = await submissionService.getSubmissions({ module: 'services' });
      setServices(Array.isArray(res?.data) ? res.data : []);
    } catch (e) {
      console.error(e);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
    const handleSync = () => loadServices();
    if (typeof window !== 'undefined') {
      window.addEventListener('adilabad_submissions_updated', handleSync);
      return () => window.removeEventListener('adilabad_submissions_updated', handleSync);
    }
  }, []);

  const handleApprove = async (id, title) => {
    await submissionService.approveAndPublish(id);
    addToast(`"${title}" approved and live in Services Directory!`, 'success');
    loadServices();
  };

  const handleReject = async (id, title) => {
    await submissionService.rejectSubmission(id, 'Listing does not meet verification guidelines.');
    addToast(`"${title}" rejected.`, 'info');
    loadServices();
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete service listing "${title}"?`)) return;
    await submissionService.deleteSubmission(id);
    addToast(`"${title}" deleted.`, 'info');
    loadServices();
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await submissionService.createSubmission({
      module: 'services',
      moduleLabel: 'Commercial Service',
      title: formData.title,
      category: formData.category,
      pricing: formData.pricing,
      location: formData.location,
      owner_id: 1,
      owner_name: formData.owner_name,
      owner_phone: formData.owner_phone,
      description: formData.description,
      image_url: formData.image_url,
      status: 'PUBLISHED'
    });
    addToast('Service listing created and published!', 'success');
    setShowAddModal(false);
    setFormData({
      title: '',
      category: 'Home & Commercial Services',
      pricing: '₹499 Inspection Fee',
      location: 'Gandhi Chowk, Adilabad',
      owner_name: 'Adilabad Service Hub',
      owner_phone: '+91 98480 22334',
      description: '',
      image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800'
    });
    loadServices();
  };

  const filtered = services.filter((s) => {
    if (statusFilter !== 'ALL' && s.status !== statusFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.title?.toLowerCase().includes(q) ||
      s.category?.toLowerCase().includes(q) ||
      s.location?.toLowerCase().includes(q) ||
      s.owner_name?.toLowerCase().includes(q)
    );
  });

  const pendingCount = services.filter((s) => s.status === 'PENDING_APPROVAL').length;
  const publishedCount = services.filter((s) => s.status === 'PUBLISHED').length;

  return (
    <AdminLayout title="Services Directory Moderation & Catalog">
      <Head>
        <title>Services Management — Super Admin Adilabad App</title>
      </Head>

      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-xl backdrop-blur-xl">
          <div>
            <div className="flex items-center gap-2">
              <Wrench className="w-6 h-6 text-brand-400" />
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Services Directory ({services.length})
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Verify technician profiles, approve commercial service listings, and moderate contractor bookings.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-600/20 transition shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Service</span>
            </button>
          </div>
        </div>

        {/* Status Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`p-4 rounded-2xl border text-left transition ${
              statusFilter === 'ALL'
                ? 'bg-slate-800/90 border-brand-500 text-white'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <span className="text-[10px] uppercase font-mono block">All Services</span>
            <span className="text-xl font-black text-white mt-1 block">{services.length}</span>
          </button>
          <button
            onClick={() => setStatusFilter('PENDING_APPROVAL')}
            className={`p-4 rounded-2xl border text-left transition ${
              statusFilter === 'PENDING_APPROVAL'
                ? 'bg-slate-800/90 border-amber-500 text-white'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <span className="text-[10px] uppercase font-mono block">Pending Review</span>
            <span className="text-xl font-black text-amber-400 mt-1 block">{pendingCount}</span>
          </button>
          <button
            onClick={() => setStatusFilter('PUBLISHED')}
            className={`p-4 rounded-2xl border text-left transition ${
              statusFilter === 'PUBLISHED'
                ? 'bg-slate-800/90 border-emerald-500 text-white'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <span className="text-[10px] uppercase font-mono block">Published Live</span>
            <span className="text-xl font-black text-emerald-400 mt-1 block">{publishedCount}</span>
          </button>
          <button
            onClick={() => setStatusFilter('REJECTED')}
            className={`p-4 rounded-2xl border text-left transition ${
              statusFilter === 'REJECTED'
                ? 'bg-slate-800/90 border-rose-500 text-white'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <span className="text-[10px] uppercase font-mono block">Rejected / Archived</span>
            <span className="text-xl font-black text-rose-400 mt-1 block">
              {services.filter((s) => s.status === 'REJECTED').length}
            </span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-xl flex items-center gap-3">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search service title, category, provider name, or location..."
            className="w-full bg-transparent text-white text-xs placeholder:text-slate-500 focus:outline-none"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-xs text-slate-400 hover:text-white">
              Clear
            </button>
          )}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-full py-16 text-center text-slate-400 text-xs">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-brand-400" />
              Loading service listings...
            </div>
          ) : filtered.length === 0 ? (
            <div className="col-span-full py-16 text-center text-slate-400 text-xs bg-slate-900/50 border border-slate-800 rounded-3xl">
              <Wrench className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              No service listings found matching the selected filter.
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900/90 rounded-3xl overflow-hidden border border-slate-800 shadow-xl flex flex-col justify-between"
              >
                <div className="relative aspect-[16/9] bg-slate-950">
                  <img
                    src={item.image_url || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800'}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-full bg-slate-900/90 text-white text-[11px] font-bold border border-slate-700/60 font-mono">
                      {item.category}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${
                        item.status === 'PUBLISHED'
                          ? 'bg-emerald-950/90 text-emerald-300 border-emerald-700'
                          : item.status === 'PENDING_APPROVAL'
                          ? 'bg-amber-950/90 text-amber-300 border-amber-700'
                          : 'bg-rose-950/90 text-rose-300 border-rose-700'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="font-bold text-white text-base leading-snug">{item.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2">{item.description}</p>

                    <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-300">
                      <span className="font-black text-brand-400 text-sm">{item.pricing}</span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        {item.location}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400 border-t border-slate-800/60">
                      <User className="w-3 h-3 text-slate-500" />
                      <span>{item.owner_name}</span>
                      <span className="text-slate-600">•</span>
                      <span>{item.owner_phone}</span>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-slate-800/80">
                    <button
                      onClick={() => handleDelete(item.id, item.title)}
                      title="Delete Listing"
                      className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 rounded-xl transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-2">
                      {item.status === 'PENDING_APPROVAL' && (
                        <>
                          <button
                            onClick={() => handleReject(item.id, item.title)}
                            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 text-xs font-bold transition"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleApprove(item.id, item.title)}
                            className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow flex items-center gap-1.5"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve & Publish</span>
                          </button>
                        </>
                      )}
                      {item.status === 'PUBLISHED' && (
                        <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Live in App
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal: Add Service */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-base font-black text-white">Create Commercial Service Listing</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Service Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-brand-500"
                    placeholder="e.g. Master Electrician & Submersible Motor Repair"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Category *</label>
                    <input
                      type="text"
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Pricing / Fee *</label>
                    <input
                      type="text"
                      required
                      value={formData.pricing}
                      onChange={(e) => setFormData({ ...formData, pricing: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Service Location *</label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Provider Phone *</label>
                    <input
                      type="text"
                      required
                      value={formData.owner_phone}
                      onChange={(e) => setFormData({ ...formData, owner_phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Cover Image URL</label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-brand-500"
                    placeholder="Provide details about expertise, equipment, turnaround time..."
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-brand-600 text-white font-bold shadow-md shadow-brand-600/30 hover:bg-brand-500 transition"
                  >
                    Create & Publish
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
