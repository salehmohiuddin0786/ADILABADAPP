import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Building2,
  Search,
  Plus,
  CheckCircle2,
  Clock,
  MapPin,
  Trash2,
  Check,
  AlertTriangle,
  RefreshCw,
  Home,
  User,
  Key,
  Eye,
  ExternalLink,
  Phone,
  MessageSquare,
  X,
  Compass,
  Layers,
  LayoutGrid,
  List,
  FileSpreadsheet
} from 'lucide-react';
import AdminLayout from '../../src/components/layout/AdminLayout';
import UniversalBulkImportModal from '../../src/components/admin/UniversalBulkImportModal';
import { submissionService } from '../../src/shared/services/submissionService';
import { useToast } from '../../src/context/ToastContext';
import { handleImageError, getCategoryFallbackImage } from '../../src/utils/imageFallback';

export default function AdminPropertiesPage() {
  const { addToast } = useToast();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('grid');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [inspectingProperty, setInspectingProperty] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Commercial Showroom',
    pricing: '₹45,000 / month',
    location: 'Cinema Road, Adilabad',
    owner_name: 'Adilabad Prime Properties',
    owner_phone: '+91 98480 22334',
    description: '',
    image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'
  });

  const loadProperties = async () => {
    setLoading(true);
    try {
      const res = await submissionService.getSubmissions({ module: 'properties' });
      setProperties(Array.isArray(res?.data) ? res.data : []);
    } catch (e) {
      console.error(e);
      setProperties([]);
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

  const handleApprove = async (id, title) => {
    await submissionService.approveAndPublish(id);
    addToast(`"${title}" approved and live in Property Catalog!`, 'success');
    loadProperties();
  };

  const handleReject = async (id, title) => {
    await submissionService.rejectSubmission(id, 'Property title documents or pricing require verification.');
    addToast(`"${title}" rejected.`, 'info');
    loadProperties();
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete property listing "${title}"?`)) return;
    await submissionService.deleteSubmission(id);
    addToast(`"${title}" deleted.`, 'info');
    loadProperties();
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await submissionService.createSubmission({
      module: 'properties',
      moduleLabel: 'Commercial Property',
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
    addToast('Property listing created and published!', 'success');
    setShowAddModal(false);
    setFormData({
      title: '',
      category: 'Commercial Showroom',
      pricing: '₹45,000 / month',
      location: 'Cinema Road, Adilabad',
      owner_name: 'Adilabad Prime Properties',
      owner_phone: '+91 98480 22334',
      description: '',
      image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'
    });
    loadProperties();
  };

  const filtered = properties.filter((item) => {
    if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.title?.toLowerCase().includes(q) ||
      item.category?.toLowerCase().includes(q) ||
      item.location?.toLowerCase().includes(q) ||
      item.owner_name?.toLowerCase().includes(q)
    );
  });

  const pendingCount = properties.filter((i) => i.status === 'PENDING_APPROVAL').length;
  const publishedCount = properties.filter((i) => i.status === 'PUBLISHED').length;

  return (
    <AdminLayout title="Real Estate & Commercial Properties">
      <Head>
        <title>Properties Management — Super Admin Adilabad App</title>
      </Head>

      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-xl backdrop-blur-xl">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-6 h-6 text-brand-400" />
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Commercial & Real Estate ({properties.length})
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Manage commercial showrooms, prime godowns, agricultural land parcels, and residential properties.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowImportModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition shrink-0 shadow-sm"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Import Properties</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-600/20 transition shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Property</span>
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
            <span className="text-[10px] uppercase font-mono block">All Properties</span>
            <span className="text-xl font-black text-white mt-1 block">{properties.length}</span>
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
            <span className="text-[10px] uppercase font-mono block">Live in App</span>
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
              {properties.filter((i) => i.status === 'REJECTED').length}
            </span>
          </button>
        </div>

        {/* Filter & Control Deck */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search property title, type, location, owner or broker..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-brand-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-white text-xs"
              >
                <X className='w-5 h-5' />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center p-1 rounded-xl bg-slate-950/80 border border-slate-800">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  viewMode === 'grid'
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Grid Cards Layout"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Grid</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  viewMode === 'table'
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Table Rows Layout"
              >
                <List className="w-3.5 h-3.5" />
                <span>Table</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Display: Grid Mode vs Table Mode */}
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-xs">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-brand-400" />
            Loading real estate listings...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-slate-400 text-xs bg-slate-900/50 border border-slate-800 rounded-3xl">
            <Building2 className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            No property listings found matching the current filter.
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900/90 rounded-3xl overflow-hidden border border-slate-800/90 hover:border-brand-500/50 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="relative aspect-[16/9] bg-slate-950 overflow-hidden">
                  <img
                    src={item.image_url || getCategoryFallbackImage('property', item.title)}
                    alt={item.title}
                    onError={(e) => handleImageError(e, 'property', item.title)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full bg-slate-900/90 backdrop-blur-md text-white text-[11px] font-bold border border-slate-700/60 font-mono">
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
                  <div className="absolute bottom-3 right-3 px-3 py-1 rounded-xl bg-slate-900/95 backdrop-blur-md text-brand-400 text-xs font-black border border-slate-700 shadow-md">
                    {item.pricing}
                  </div>
                </div>

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="font-bold text-white text-sm line-clamp-1 group-hover:text-brand-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{item.description}</p>

                    <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>

                    <div className="flex items-center justify-between pt-2 text-[11px] text-slate-400 border-t border-slate-800/60">
                      <div className="flex items-center gap-2 truncate">
                        <User className="w-3 h-3 text-slate-500 shrink-0" />
                        <span className="truncate text-white font-medium">{item.owner_name}</span>
                      </div>
                      <span className="font-mono text-slate-400 shrink-0">{item.owner_phone}</span>
                    </div>
                  </div>

                  <div className="pt-3 flex items-center justify-between border-t border-slate-800/80 gap-2">
                    <button
                      onClick={() => setInspectingProperty(item)}
                      className="px-3 py-1.5 rounded-xl bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 border border-brand-500/30 text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleDelete(item.id, item.title)}
                        title="Delete Property"
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      {item.status === 'PENDING_APPROVAL' && (
                        <>
                          <button
                            onClick={() => handleReject(item.id, item.title)}
                            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 text-xs font-bold transition"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleApprove(item.id, item.title)}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" />
                            <span>Approve</span>
                          </button>
                        </>
                      )}
                      {item.status === 'PUBLISHED' && (
                        <Link
                          href="/categories/property"
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Live
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Table View */
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-mono font-bold text-[10px]">
                  <tr>
                    <th className="py-3.5 px-6">Property / Space</th>
                    <th className="py-3.5 px-4">Type</th>
                    <th className="py-3.5 px-4">Rent / Rate</th>
                    <th className="py-3.5 px-4">Location</th>
                    <th className="py-3.5 px-4">Owner Contact</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/50 transition">
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image_url || getCategoryFallbackImage('property', item.title)}
                            alt={item.title}
                            onError={(e) => handleImageError(e, 'property', item.title)}
                            className="w-10 h-10 rounded-xl object-cover bg-slate-800 border border-slate-700 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-white text-xs leading-snug">{item.title}</p>
                            <p className="text-[11px] text-slate-400">{item.owner_name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-300">{item.category}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-brand-400">{item.pricing}</td>
                      <td className="py-3.5 px-4 text-slate-400">{item.location}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-300">{item.owner_phone}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                            item.status === 'PUBLISHED'
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                              : item.status === 'PENDING_APPROVAL'
                              ? 'bg-amber-950 text-amber-300 border-amber-800'
                              : 'bg-rose-950 text-rose-300 border-rose-800'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setInspectingProperty(item)}
                            className="p-1.5 rounded-lg text-slate-300 hover:text-brand-300 hover:bg-slate-800 transition"
                            title="Inspect Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          {item.status === 'PENDING_APPROVAL' && (
                            <button
                              onClick={() => handleApprove(item.id, item.title)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow flex items-center gap-1"
                            >
                              <Check className="w-3 h-3" />
                              <span>Approve</span>
                            </button>
                          )}
                          <Link
                            href="/categories/property"
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs inline-flex items-center gap-1 border border-slate-700"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                          <button
                            onClick={() => handleDelete(item.id, item.title)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition"
                            title="Delete Listing"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal: Complete Details & Inspection */}
        {inspectingProperty && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-800 flex items-start justify-between bg-slate-950/70">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-brand-950 text-brand-400 border border-brand-800 text-[10px] font-mono font-bold">
                      {inspectingProperty.id}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                        inspectingProperty.status === 'PUBLISHED'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                          : inspectingProperty.status === 'PENDING_APPROVAL'
                          ? 'bg-amber-950 text-amber-300 border-amber-800'
                          : 'bg-rose-950 text-rose-300 border-rose-800'
                      }`}
                    >
                      {inspectingProperty.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-white">{inspectingProperty.title}</h3>
                </div>
                <button
                  onClick={() => setInspectingProperty(null)}
                  className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1">
                {/* Media Preview Banner */}
                <div className="relative aspect-[16/8] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                  <img
                    src={inspectingProperty.image_url || getCategoryFallbackImage('property', inspectingProperty.title)}
                    alt={inspectingProperty.title}
                    onError={(e) => handleImageError(e, 'property', inspectingProperty.title)}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 left-3 px-3 py-1 rounded-xl bg-slate-900/90 backdrop-blur-md text-white text-xs font-bold border border-slate-700">
                    Type: {inspectingProperty.category}
                  </div>
                </div>

                {/* KPI Specs Matrix */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">Rent / Price</span>
                    <span className="text-sm font-black text-brand-400 mt-1 block">{inspectingProperty.pricing}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">Carpet / Built Area</span>
                    <span className="text-xs font-bold text-white mt-1 block">
                      {inspectingProperty.specs?.area_sqft ? `${inspectingProperty.specs.area_sqft} Sq.Ft` : '2,400 Sq.Ft'}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">Location / Zone</span>
                    <span className="text-xs font-bold text-emerald-400 mt-1 block truncate">{inspectingProperty.location}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">Parking & Power</span>
                    <span className="text-xs font-bold text-amber-400 mt-1 block">
                      {inspectingProperty.specs?.parking || 'Dedicated (12 Cars)'}
                    </span>
                  </div>
                </div>

                {/* Owner / Realtor Contact Card */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-brand-950 text-brand-400 border border-brand-800 flex items-center justify-center font-black text-sm">
                      {inspectingProperty.owner_name?.charAt(0) || 'P'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-white text-sm">{inspectingProperty.owner_name}</p>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
                          Verified Owner / Broker
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">{inspectingProperty.owner_phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${inspectingProperty.owner_phone}`}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5 text-brand-400" />
                      <span>Call</span>
                    </a>
                    <a
                      href={`https://wa.me/${(inspectingProperty.owner_phone || '').replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Property Specifications & Terms</h4>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80 whitespace-pre-line">
                    {inspectingProperty.description || 'No detailed specifications provided for this property listing.'}
                  </p>
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="p-5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3">
                <button
                  onClick={() => {
                    handleDelete(inspectingProperty.id, inspectingProperty.title);
                    setInspectingProperty(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800 text-xs font-bold transition"
                >
                  Delete Listing
                </button>

                <div className="flex items-center gap-2">
                  <Link
                    href="/categories/property"
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View Public Page</span>
                  </Link>

                  {inspectingProperty.status === 'PENDING_APPROVAL' && (
                    <>
                      <button
                        onClick={() => {
                          handleReject(inspectingProperty.id, inspectingProperty.title);
                          setInspectingProperty(null);
                        }}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 text-xs font-bold transition"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => {
                          handleApprove(inspectingProperty.id, inspectingProperty.title);
                          setInspectingProperty(null);
                        }}
                        className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve & Publish</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Add Property */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-base font-black text-white">Add Property Listing</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white"><X className='w-5 h-5' /></button>
              </div>

              <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Property Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-brand-500"
                    placeholder="e.g. 1800 Sq.Ft Showroom with Glass Frontage"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Category / Type *</label>
                    <input
                      type="text"
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Rent / Price *</label>
                    <input
                      type="text"
                      required
                      value={formData.pricing}
                      onChange={(e) => setFormData({ ...formData, pricing: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Location *</label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Owner Contact *</label>
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
                  <label className="block text-slate-300 font-bold mb-1">Property Image URL</label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Property Details & Specs</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-brand-500"
                    placeholder="Specify carpet area, frontage, parking, power backup, floor number..."
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
        {/* Universal Bulk Import Modal */}
        <UniversalBulkImportModal
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          module="properties"
          moduleTitle="Property Listings"
          onImportSuccess={loadProperties}
        />
      </div>
    </AdminLayout>
  );
}
