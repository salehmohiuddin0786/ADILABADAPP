import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  FileText,
  Building,
  Store,
  UserCheck,
  AlertTriangle,
  Search,
  Filter,
  Check,
  X,
  ExternalLink,
  ChevronRight,
  Clock,
  MapPin,
  Phone,
  Eye,
  Download,
  Sparkles,
  RefreshCw,
  Layers,
  Tag,
  Calendar,
  MessageSquare,
  Trash2
} from 'lucide-react';
import AdminLayout from '../../src/components/layout/AdminLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { submissionService } from '../../src/shared/services/submissionService';
import { useToast } from '../../src/context/ToastContext';
import { handleImageError, getCategoryFallbackImage } from '../../src/utils/imageFallback';
import { modalOverlayVariants, modalContentVariants } from '../../src/shared/animations/motionPresets';

export default function AdminModerationCenter() {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedModule, setSelectedModule] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMandal, setSelectedMandal] = useState('all');
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  const [reviewModalItem, setReviewModalItem] = useState(null);
  const [changeRequestText, setChangeRequestText] = useState('');
  const [showChangeDialog, setShowChangeDialog] = useState(false);
  const [counts, setCounts] = useState({ total: 0, pending: 0, published: 0, changes_requested: 0, rejected: 0 });

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const res = await submissionService.getSubmissions();
      setSubmissions(Array.isArray(res.data) ? res.data : []);
      const c = await submissionService.getCounts();
      setCounts(c);
    } catch (e) {
      console.error('Failed to load submissions in admin:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
    const handleSync = () => loadSubmissions();
    if (typeof window !== 'undefined') {
      window.addEventListener('adilabad_submissions_updated', handleSync);
      return () => window.removeEventListener('adilabad_submissions_updated', handleSync);
    }
  }, []);

  const handleApprove = async (id) => {
    const res = await submissionService.approveAndPublish(id);
    if (res.success) {
      addToast(res.message, 'success');
      loadSubmissions();
      if (reviewModalItem?.id === id) setReviewModalItem(null);
    }
  };

  const handleReject = async (id) => {
    const reason = prompt('Please enter rejection reason for this submission:', 'Does not meet district content guidelines.');
    if (!reason) return;
    const res = await submissionService.rejectSubmission(id, reason);
    if (res.success) {
      addToast(res.message, 'info');
      loadSubmissions();
      if (reviewModalItem?.id === id) setReviewModalItem(null);
    }
  };

  const handleRequestChanges = async (id) => {
    const note = changeRequestText.trim() || prompt('Enter change instructions for the owner:', 'Please upload clearer item photo and confirm pickup address.');
    if (!note) return;
    const res = await submissionService.requestChanges(id, note);
    if (res.success) {
      addToast(res.message, 'info');
      setShowChangeDialog(false);
      setChangeRequestText('');
      loadSubmissions();
      if (reviewModalItem?.id === id) setReviewModalItem(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to permanently delete this submission?')) return;
    const res = await submissionService.deleteSubmission(id);
    if (res.success) {
      addToast(res.message, 'info');
      loadSubmissions();
      if (reviewModalItem?.id === id) setReviewModalItem(null);
    }
  };

  const toggleSelect = (id) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleBatchApprove = async () => {
    if (selectedItems.length === 0) return;
    for (const id of selectedItems) {
      await submissionService.approveAndPublish(id);
    }
    addToast(`Batch approved & published ${selectedItems.length} submissions!`, 'success');
    setSelectedItems([]);
    loadSubmissions();
  };

  const filtered = submissions.filter((item) => {
    if (activeTab === 'pending' && item.status !== 'PENDING_APPROVAL') return false;
    if (activeTab === 'published' && item.status !== 'PUBLISHED') return false;
    if (activeTab === 'changes' && item.status !== 'CHANGES_REQUESTED') return false;
    if (activeTab === 'rejected' && item.status !== 'REJECTED') return false;

    if (selectedModule !== 'all' && item.module !== selectedModule) return false;
    if (selectedMandal !== 'all' && !item.location?.toLowerCase().includes(selectedMandal.toLowerCase())) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title?.toLowerCase().includes(q) ||
        item.owner_name?.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q) ||
        item.id?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <AdminLayout title="Approval & Moderation Centre">
      <Head>
        <title>Approval & Moderation Centre — Super Admin Adilabad App</title>
      </Head>

      <div className="space-y-6">
        {/* Header Ribbon & KPI Matrix */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                  Central District Approval Engine
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
                Super Admin Submission & Moderation Centre
              </h1>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                Review, approve, request changes, or reject listings submitted by Adilabad owners across rentals, advertisements, business profiles, and events.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={loadSubmissions}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                title="Refresh Submissions"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-brand-400' : ''}`} />
              </button>
              {selectedItems.length > 0 && (
                <button
                  onClick={handleBatchApprove}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition flex items-center space-x-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Batch Approve ({selectedItems.length})</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5">
            <button
              onClick={() => setActiveTab('pending')}
              className={`p-3.5 rounded-2xl border text-left transition ${
                activeTab === 'pending'
                  ? 'bg-amber-500/10 border-amber-500/50 shadow-lg'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase text-amber-400 font-mono">Pending Review</span>
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-2xl font-black text-white mt-1">{counts.pending}</p>
              <span className="text-[10px] text-slate-400">Awaiting your approval</span>
            </button>

            <button
              onClick={() => setActiveTab('published')}
              className={`p-3.5 rounded-2xl border text-left transition ${
                activeTab === 'published'
                  ? 'bg-emerald-500/10 border-emerald-500/50 shadow-lg'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase text-emerald-400 font-mono">Published Live</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-black text-white mt-1">{counts.published}</p>
              <span className="text-[10px] text-slate-400">Live in marketplace</span>
            </button>

            <button
              onClick={() => setActiveTab('changes')}
              className={`p-3.5 rounded-2xl border text-left transition ${
                activeTab === 'changes'
                  ? 'bg-orange-500/10 border-orange-500/50 shadow-lg'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase text-orange-400 font-mono">Changes Requested</span>
                <AlertTriangle className="w-4 h-4 text-orange-400" />
              </div>
              <p className="text-2xl font-black text-white mt-1">{counts.changes_requested}</p>
              <span className="text-[10px] text-slate-400">Waiting for owner update</span>
            </button>

            <button
              onClick={() => setActiveTab('rejected')}
              className={`p-3.5 rounded-2xl border text-left transition ${
                activeTab === 'rejected'
                  ? 'bg-rose-500/10 border-rose-500/50 shadow-lg'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase text-rose-400 font-mono">Rejected</span>
                <XCircle className="w-4 h-4 text-rose-400" />
              </div>
              <p className="text-2xl font-black text-white mt-1">{counts.rejected}</p>
              <span className="text-[10px] text-slate-400">Declined submissions</span>
            </button>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {['all', 'pending', 'published', 'changes', 'rejected'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition ${
                  activeTab === tab
                    ? 'bg-brand-500 text-slate-950 shadow'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {tab === 'changes' ? 'Changes Requested' : tab}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1 max-w-xl">
            {/* Module Filter */}
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 sm:py-1.5 text-xs text-slate-300 focus:outline-none focus:border-brand-500"
            >
              <option value="all">All Modules</option>
              <option value="rentals">Rentals & Fleet</option>
              <option value="advertisements">Advertisements</option>
              <option value="businesses">Business Profiles</option>
              <option value="events">Events & Expos</option>
              <option value="offers">Offers & Coupons</option>
              <option value="buy-sell">Buy & Sell</option>
              <option value="services">Services</option>
              <option value="jobs">Jobs</option>
              <option value="properties">Properties</option>
            </select>

            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search submission title, owner, category, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Submissions List / Table */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          {loading ? (
            <div className="py-20 text-center flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-3 border-brand-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-mono text-slate-400">Loading submissions across district modules...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center gap-3">
              <ShieldCheck className="w-12 h-12 text-slate-600" />
              <h3 className="text-base font-bold text-white">No Submissions Found in Current Filter</h3>
              <p className="text-xs text-slate-400 max-w-sm">
                {activeTab === 'pending' && counts.published > 0
                  ? `All ${counts.published} submissions have been approved and published live in the marketplace!`
                  : 'No items match the selected tab and filters. Owners can submit new items anytime from the Owner Portal.'}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                {activeTab === 'pending' && counts.published > 0 && (
                  <button
                    onClick={() => setActiveTab('published')}
                    className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-black text-xs transition shadow"
                  >
                    View {counts.published} Live Published Items &rarr;
                  </button>
                )}
                <button
                  onClick={() => {
                    submissionService.resetToInitialSeed();
                    loadSubmissions();
                    addToast('Reset demo submissions queue with pending approvals!', 'success');
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition"
                >
                  Load Sample Pending Submissions
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[780px] text-left text-xs text-slate-300">
                <thead className="bg-slate-950/90 border-b border-slate-800 text-slate-400 uppercase font-mono font-bold text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={selectedItems.length > 0 && selectedItems.length === filtered.length}
                        onChange={() => {
                          if (selectedItems.length === filtered.length) setSelectedItems([]);
                          else setSelectedItems(filtered.map((f) => f.id));
                        }}
                        className="rounded border-slate-700 bg-slate-900 text-brand-500 focus:ring-0"
                      />
                    </th>
                    <th className="py-3.5 px-4">Item & Module</th>
                    <th className="py-3.5 px-4">Owner / Contact</th>
                    <th className="py-3.5 px-4">Rates / Pricing</th>
                    <th className="py-3.5 px-4">Location</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-6 text-right">Approval Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-4 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => toggleSelect(item.id)}
                          className="rounded border-slate-700 bg-slate-900 text-brand-500 focus:ring-0"
                        />
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image_url || getCategoryFallbackImage(item.module || item.category, item.title)}
                            alt={item.title}
                            onError={(e) => handleImageError(e, item.module || item.category, item.title)}
                            className="w-11 h-11 rounded-xl object-cover bg-slate-800 border border-slate-700 shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-xs">{item.title}</span>
                              <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[9px] font-mono font-bold uppercase border border-slate-700">
                                {item.moduleLabel || item.module}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
                              ID: {item.id} • {item.category}
                            </p>
                            {item.review_notes && (
                              <p className="text-[10px] text-amber-300 bg-amber-950/60 border border-amber-800/80 px-2 py-0.5 rounded mt-1 inline-block">
                                <strong>Note:</strong> {item.review_notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <p className="font-semibold text-white">{item.owner_name}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{item.owner_phone}</p>
                      </td>

                      <td className="py-4 px-4 font-mono font-bold text-emerald-400">
                        {item.pricing || (item.daily_rate ? `₹${item.daily_rate}/day` : '—')}
                        {item.security_deposit ? (
                          <span className="block text-[10px] text-amber-400 font-normal">
                            Deposit: ₹{item.security_deposit}
                          </span>
                        ) : null}
                      </td>

                      <td className="py-4 px-4 text-slate-400 font-medium">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                          <span className="truncate max-w-[130px]">{item.location}</span>
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black uppercase tracking-wider ${
                            item.status === 'PUBLISHED'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : item.status === 'CHANGES_REQUESTED'
                              ? 'bg-orange-950 text-orange-300 border border-orange-800'
                              : item.status === 'REJECTED'
                              ? 'bg-rose-950 text-rose-300 border border-rose-800'
                              : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setReviewModalItem(item)}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition"
                            title="Inspect Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {item.status !== 'PUBLISHED' && (
                            <button
                              onClick={() => handleApprove(item.id)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow transition flex items-center gap-1"
                              title="Approve & Publish Live"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                          )}

                          {item.status === 'PENDING_APPROVAL' && (
                            <button
                              onClick={() => {
                                setReviewModalItem(item);
                                setShowChangeDialog(true);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold border border-amber-500/40 transition"
                              title="Request Changes"
                            >
                              Revise
                            </button>
                          )}

                          {item.status !== 'REJECTED' && (
                            <button
                              onClick={() => handleReject(item.id)}
                              className="px-2 py-1 rounded-lg hover:bg-rose-950/40 text-rose-400 text-xs font-bold transition"
                              title="Reject Submission"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1 rounded-lg text-slate-500 hover:text-rose-400 transition"
                            title="Delete"
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
          )}
        </div>
      </div>

      {/* Review & Inspection Modal */}
      <AnimatePresence>
        {reviewModalItem && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalOverlayVariants}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
          >
            <motion.div
              variants={modalContentVariants}
              className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase text-brand-400 font-bold">
                    {reviewModalItem.moduleLabel} Inspection
                  </span>
                  <h3 className="text-lg font-black text-white">{reviewModalItem.title}</h3>
                </div>
                <button
                  onClick={() => setReviewModalItem(null)}
                  className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <img
                  src={reviewModalItem.image_url || getCategoryFallbackImage(reviewModalItem.module || reviewModalItem.category, reviewModalItem.title)}
                  alt={reviewModalItem.title}
                  onError={(e) => handleImageError(e, reviewModalItem.module || reviewModalItem.category, reviewModalItem.title)}
                  className="w-full h-48 rounded-2xl object-cover bg-slate-950 border border-slate-800"
                />
                <div className="space-y-2 text-xs text-slate-300">
                  <p><strong>Module:</strong> {reviewModalItem.moduleLabel}</p>
                  <p><strong>Category:</strong> {reviewModalItem.category}</p>
                  <p><strong>Pricing:</strong> {reviewModalItem.pricing || `₹${reviewModalItem.daily_rate}/day`}</p>
                  <p><strong>Security Deposit:</strong> ₹{reviewModalItem.security_deposit || 0}</p>
                  <p><strong>Location:</strong> {reviewModalItem.location}</p>
                  <p><strong>Owner Name:</strong> {reviewModalItem.owner_name}</p>
                  <p><strong>Owner Phone:</strong> {reviewModalItem.owner_phone}</p>
                  <p><strong>Status:</strong> <span className="font-mono font-bold text-amber-400">{reviewModalItem.status}</span></p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
                <span className="font-bold text-white block">Description:</span>
                <p>{reviewModalItem.description || 'No description provided.'}</p>
              </div>

              {showChangeDialog ? (
                <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-800/80 space-y-3">
                  <span className="text-xs font-bold text-amber-300 block">Feedback / Change Instructions for Owner:</span>
                  <textarea
                    rows={3}
                    value={changeRequestText}
                    onChange={(e) => setChangeRequestText(e.target.value)}
                    placeholder="e.g. Please upload an invoice or clear photo of the serial number..."
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setShowChangeDialog(false)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-400 text-xs font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleRequestChanges(reviewModalItem.id)}
                      className="px-4 py-1.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold shadow"
                    >
                      Send Change Request
                    </button>
                  </div>
                </div>
              ) : null}

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-800">
                <button
                  onClick={() => handleDelete(reviewModalItem.id)}
                  className="text-xs font-bold text-rose-400 hover:text-rose-300 py-1 text-center sm:text-left"
                >
                  Delete Permanently
                </button>
                <div className="flex flex-wrap sm:flex-nowrap items-center justify-end gap-2">
                  <button
                    onClick={() => setShowChangeDialog(!showChangeDialog)}
                    className="flex-1 sm:flex-initial px-4 py-2.5 sm:py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold hover:bg-amber-500/30 transition text-center"
                  >
                    Request Changes
                  </button>
                  <button
                    onClick={() => handleReject(reviewModalItem.id)}
                    className="flex-1 sm:flex-initial px-4 py-2.5 sm:py-2 rounded-xl bg-rose-600/30 text-rose-300 border border-rose-500/50 text-xs font-bold hover:bg-rose-600/50 transition text-center"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(reviewModalItem.id)}
                    className="w-full sm:w-auto px-5 py-2.5 sm:py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg transition flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Approve & Publish</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
