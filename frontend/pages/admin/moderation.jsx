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
  Sparkles
} from 'lucide-react';
import AdminLayout from '../../src/components/layout/AdminLayout';

export default function AdminModerationCenter() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMandal, setSelectedMandal] = useState('all');
  const [selectedItems, setSelectedItems] = useState([]);
  const [actionNotice, setActionNotice] = useState(null);

  const [queue, setQueue] = useState([
    {
      id: 'MOD-101',
      type: 'MERCHANT_KYC',
      typeLabel: 'Merchant KYC Verification',
      title: 'Adilabad Media Works & Camera Rentals',
      applicant: 'Syed Usama',
      phone: '+91 98480 22334',
      mandal: 'Adilabad Urban',
      address: 'Cinema Road, Opp. Geeta Theatre, Adilabad - 504001',
      docType: 'Telangana Shop Act & GST Registration',
      docNumber: 'TS-ADB-2024-88419',
      submittedAt: 'Today at 10:15 AM',
      riskScore: 'Low (0.02)',
      status: 'pending',
      details: 'Applying for Tier-1 Commercial Merchant certification for professional mirrorless camera gear rentals.'
    },
    {
      id: 'MOD-102',
      type: 'STOREFRONT',
      typeLabel: 'New Business Storefront',
      title: 'Shree Balaji Electronics & Appliances',
      applicant: 'Ramesh Balaji',
      phone: '+91 94401 23456',
      mandal: 'Adilabad Urban',
      address: 'Opposite Geeta Theatre, Cinema Road, Adilabad',
      docType: 'Adilabad Municipality Trade License',
      docNumber: 'ADB-MUNC-TL-4912',
      submittedAt: 'Today at 09:40 AM',
      riskScore: 'Low (0.01)',
      status: 'pending',
      details: 'New retail storefront listing with multi-brand electronics, Bajaj Finserv finance desk, and brand warranty center.'
    },
    {
      id: 'MOD-103',
      type: 'RENTAL_ITEM',
      typeLabel: 'Heavy Equipment Rental',
      title: 'John Deere 5050D Tractor with Cultivator',
      applicant: 'Telangana Agri Hub',
      phone: '+91 98499 11223',
      mandal: 'Utnoor Road',
      address: 'Utnoor Highway Crossing, Adilabad Rural',
      docType: 'Vehicle RC & Commercial Insurance',
      docNumber: 'TS-01-EA-4910',
      submittedAt: 'Yesterday at 04:20 PM',
      riskScore: 'Low (0.03)',
      status: 'pending',
      details: 'Listing 50HP tractor with cultivator attachment. Security deposit ₹8,000, daily hire ₹3,200.'
    },
    {
      id: 'MOD-104',
      type: 'FLAGGED_AD',
      typeLabel: 'Citizen Flagged Content',
      title: 'Residential Plot Sale 200 Sq Yds - Boath Road',
      applicant: 'Private Seller (Unverified)',
      phone: '+91 91234 56789',
      mandal: 'Boath',
      address: 'Survey No. 42/B, Boath Mandal, Adilabad',
      docType: 'Gram Panchayat Layout Approval',
      docNumber: 'Pending Verification',
      submittedAt: 'Yesterday at 02:10 PM',
      riskScore: 'Medium (0.48)',
      status: 'pending',
      details: 'Reported by 2 users for unverified layout permission. Needs DTCP or Gram Panchayat documentation.'
    },
    {
      id: 'MOD-105',
      type: 'MERCHANT_KYC',
      typeLabel: 'Merchant KYC Verification',
      title: 'Hotel Mehfil & Family Restaurant',
      applicant: 'Mohammed Farooq',
      phone: '+91 94401 55667',
      mandal: 'Shivaji Chowk',
      address: 'Main Road, Shivaji Chowk, Adilabad',
      docType: 'FSSAI Food Safety License',
      docNumber: 'FSSAI-13624001000492',
      submittedAt: '2 days ago',
      riskScore: 'Low (0.01)',
      status: 'pending',
      details: 'Dining and family restaurant verified catering license renewal for seasonal promotions.'
    }
  ]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = JSON.parse(localStorage.getItem('adilabad_rentals') || '[]');
        if (Array.isArray(stored) && stored.length > 0) {
          const userRentals = stored.map((r) => ({
            id: `MOD-RENT-${r.id}`,
            type: 'RENTAL_ITEM',
            typeLabel: 'User Rental Upload',
            title: r.title,
            applicant: r.owner_name || 'Verified Merchant',
            phone: r.owner_phone || '+91 98480 22334',
            mandal: r.location || 'Adilabad Urban',
            address: r.pickup_address || r.location || 'Adilabad, Telangana',
            docType: 'Owner Equipment Declaration & ID',
            docNumber: `RENT-REG-${String(r.id).slice(-6)}`,
            submittedAt: r.created_at ? new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
            riskScore: 'Low (0.01)',
            status: r.status === 'AVAILABLE' ? 'approved' : 'pending',
            details: `${r.category_name || 'Equipment'} • Daily: ₹${r.daily_rate} • Deposit: ₹${r.security_deposit} • ${r.description || ''}`
          }));

          setQueue((prev) => {
            const existingIds = new Set(prev.map((p) => p.id));
            const newOnes = userRentals.filter((u) => !existingIds.has(u.id));
            return [...newOnes, ...prev];
          });
        }
      } catch (e) {}
    }
  }, []);

  const showNotice = (msg) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleApprove = (id) => {
    setQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'approved' } : item))
    );
    showNotice(`Item ${id} approved & published successfully.`);
  };

  const handleReject = (id) => {
    setQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'rejected' } : item))
    );
    showNotice(`Item ${id} marked as rejected. Submitter notified.`);
  };

  const toggleSelect = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBatchApprove = () => {
    if (selectedItems.length === 0) return;
    setQueue((prev) =>
      prev.map((item) =>
        selectedItems.includes(item.id) ? { ...item, status: 'approved' } : item
      )
    );
    showNotice(`Batch approved ${selectedItems.length} selected items.`);
    setSelectedItems([]);
  };

  const filteredQueue = queue.filter((item) => {
    if (activeTab === 'pending' && item.status !== 'pending') return false;
    if (activeTab === 'approved' && item.status !== 'approved') return false;
    if (activeTab === 'rejected' && item.status !== 'rejected') return false;
    if (activeTab === 'kyc' && item.type !== 'MERCHANT_KYC') return false;
    if (activeTab === 'flagged' && item.type !== 'FLAGGED_AD') return false;

    if (selectedMandal !== 'all' && item.mandal !== selectedMandal) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.applicant.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        item.docNumber.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pendingCount = queue.filter((i) => i.status === 'pending').length;
  const approvedCount = queue.filter((i) => i.status === 'approved').length;
  const rejectedCount = queue.filter((i) => i.status === 'rejected').length;

  return (
    <AdminLayout title="Moderation & Verification Center">
      <Head>
        <title>Moderation Center — Super Admin Adilabad App</title>
      </Head>

      {/* Floating Action Toast Notification */}
      {actionNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-950/90 text-emerald-200 border border-emerald-600/50 px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-md flex items-center space-x-3 text-xs font-bold animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Header Ribbon & KPI Matrix */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-brand-400" />
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  District Moderation & Compliance Center
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Authoritative verification of merchant shop licenses, government GSTINs, land layout titles, and community reports.
              </p>
            </div>

            {selectedItems.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBatchApprove}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/25 transition flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Approve Selected ({selectedItems.length})</span>
                </button>
                <button
                  onClick={() => setSelectedItems([])}
                  className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pending Review</span>
                <p className="text-2xl font-black text-amber-400 mt-0.5">{pendingCount}</p>
              </div>
              <Clock className="w-6 h-6 text-amber-500/40" />
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Approved Today</span>
                <p className="text-2xl font-black text-emerald-400 mt-0.5">{approvedCount}</p>
              </div>
              <CheckCircle2 className="w-6 h-6 text-emerald-500/40" />
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Rejected / Escalated</span>
                <p className="text-2xl font-black text-rose-400 mt-0.5">{rejectedCount}</p>
              </div>
              <XCircle className="w-6 h-6 text-rose-500/40" />
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Avg Resolution SLA</span>
                <p className="text-2xl font-black text-white mt-0.5">14 <span className="text-sm font-semibold text-slate-400">mins</span></p>
              </div>
              <Sparkles className="w-6 h-6 text-brand-400/40" />
            </div>
          </div>
        </div>

        {/* Filter Bar & Tabs */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Tab Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {[
              { id: 'all', label: 'All Items' },
              { id: 'pending', label: `Pending (${pendingCount})` },
              { id: 'kyc', label: 'Merchant KYC' },
              { id: 'flagged', label: 'Flagged Content' },
              { id: 'approved', label: 'Approved' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-brand-600 text-white shadow'
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search & Mandal Filter */}
          <div className="flex items-center gap-2.5">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search business, applicant, doc #..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>

            <select
              value={selectedMandal}
              onChange={(e) => setSelectedMandal(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-brand-500"
            >
              <option value="all">All Mandals</option>
              <option value="Adilabad Urban">Adilabad Urban</option>
              <option value="Cinema Road">Cinema Road</option>
              <option value="Utnoor Road">Utnoor Road</option>
              <option value="Shivaji Chowk">Shivaji Chowk</option>
              <option value="Boath">Boath</option>
            </select>
          </div>
        </div>

        {/* Moderation Queue Stream Cards */}
        <div className="space-y-4">
          {filteredQueue.length === 0 ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center flex flex-col items-center gap-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400" />
              <h3 className="text-base font-bold text-white">No Items Matching Filter</h3>
              <p className="text-xs text-slate-400 max-w-sm">
                No active verification requests matching the selected category or search query.
              </p>
            </div>
          ) : (
            filteredQueue.map((item) => {
              const isSelected = selectedItems.includes(item.id);
              return (
                <div
                  key={item.id}
                  className={`bg-slate-900/90 border rounded-3xl p-5 sm:p-6 shadow-xl transition-all ${
                    isSelected
                      ? 'border-brand-500 bg-brand-950/20'
                      : item.status === 'approved'
                      ? 'border-emerald-800/60 bg-emerald-950/10'
                      : item.status === 'rejected'
                      ? 'border-rose-800/60 bg-rose-950/10'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Item Information */}
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(item.id)}
                        className="mt-1 rounded border-slate-700 text-brand-600 focus:ring-brand-500 w-4 h-4 bg-slate-950 cursor-pointer"
                      />

                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-brand-950 text-brand-300 border border-brand-800">
                            {item.typeLabel}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            ID: {item.id}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            • {item.submittedAt}
                          </span>
                          {item.status === 'approved' && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              Approved
                            </span>
                          )}
                          {item.status === 'rejected' && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800 flex items-center gap-1">
                              <XCircle className="w-3 h-3 text-rose-400" />
                              Rejected
                            </span>
                          )}
                        </div>

                        <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                          {item.title}
                        </h3>

                        <p className="text-xs text-slate-300 leading-relaxed">
                          {item.details}
                        </p>

                        <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-400 pt-1 font-medium">
                          <span className="flex items-center gap-1">
                            <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                            {item.applicant}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-slate-500" />
                            {item.phone}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-500" />
                            {item.mandal}
                          </span>
                        </div>

                        {/* Government & Compliance Document Bar */}
                        <div className="mt-3 p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                            <div>
                              <span className="text-slate-300 font-bold">{item.docType}: </span>
                              <span className="font-mono text-amber-300 font-semibold">{item.docNumber}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-400 font-mono">
                              Risk Index: <strong className="text-emerald-400">{item.riskScore}</strong>
                            </span>
                            <button
                              onClick={() => showNotice(`Simulating document preview for ${item.docNumber}`)}
                              className="text-[11px] font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1"
                            >
                              <span>Inspect Proof</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex lg:flex-col items-center gap-2 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                      {item.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => handleApprove(item.id)}
                            className="flex-1 lg:w-36 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-1.5"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve & Verify</span>
                          </button>
                          <button
                            onClick={() => handleReject(item.id)}
                            className="flex-1 lg:w-36 py-2 px-3 rounded-xl bg-slate-800 hover:bg-rose-950/60 text-slate-300 hover:text-rose-300 font-bold text-xs border border-slate-700 hover:border-rose-700 transition flex items-center justify-center gap-1.5"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Reject Notice</span>
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => {
                            setQueue((prev) =>
                              prev.map((i) => (i.id === item.id ? { ...i, status: 'pending' } : i))
                            );
                            showNotice(`Reopened item ${item.id} for moderation.`);
                          }}
                          className="w-full lg:w-36 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 transition"
                        >
                          Reopen Review
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
