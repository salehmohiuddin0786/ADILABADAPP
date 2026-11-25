import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Layers,
  Inbox,
  Calendar,
  Clock,
  RotateCcw,
  CheckCircle,
  XCircle,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  PlusCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { submissionService } from '../../shared/services/submissionService';
import { staggerContainer, statWidgetVariants } from '../../shared/animations/motionPresets';

export default function OwnerDashboard() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [totalRentals, setTotalRentals] = useState(3);
  const [subCounts, setSubCounts] = useState({ pending: 0, published: 0, changes_requested: 0 });

  useEffect(() => {
    async function loadStats() {
      try {
        const c = await submissionService.getCounts();
        setSubCounts(c);
        const subRes = await submissionService.getSubmissions({ module: 'rentals' });
        if (Array.isArray(subRes?.data)) {
          setTotalRentals(subRes.data.length);
        }
      } catch (e) {}
    }
    loadStats();
    if (typeof window !== 'undefined') {
      window.addEventListener('adilabad_submissions_updated', loadStats);
      return () => window.removeEventListener('adilabad_submissions_updated', loadStats);
    }
  }, []);

  const [bookingRequests, setBookingRequests] = useState([
    {
      id: 1,
      booking_code: 'ADL-RENT-91024',
      item_title: 'Sony Alpha A7 IV Mirrorless Camera',
      customer_name: 'Rahul Sharma',
      customer_phone: '9848022334',
      start_date: '2026-11-16',
      end_date: '2026-11-19',
      days: 3,
      rental_fee: 4500,
      deposit: 5000,
      status: 'PENDING'
    },
    {
      id: 2,
      booking_code: 'ADL-RENT-77182',
      item_title: 'John Deere 5050D Tractor with Cultivator',
      customer_name: 'Suresh Patel',
      customer_phone: '9440192834',
      start_date: '2026-11-20',
      end_date: '2026-11-23',
      days: 3,
      rental_fee: 9600,
      deposit: 8000,
      status: 'PENDING'
    }
  ]);

  const handleAction = (bookingId, action) => {
    setBookingRequests((prev) =>
      (Array.isArray(prev) ? prev : []).map((b) => (b.id === bookingId ? { ...b, status: action === 'accept' ? 'ACCEPTED' : 'REJECTED' } : b))
    );
    showToast(
      action === 'accept' ? 'Booking proposal accepted! Customer notified.' : 'Booking proposal declined.',
      action === 'accept' ? 'success' : 'info'
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-bold mb-3">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Approved Commercial Partner — Adilabad District</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Commercial Management Dashboard
          </h2>
          <p className="mt-1 text-slate-300 text-sm max-w-xl">
            Control your rental inventory, review customer reservation proposals, issue handovers, and manage multi-niche business listings.
          </p>
        </div>

        <Link
          href="/owner/rentals/create"
          className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-5 py-3 rounded-2xl text-xs shadow-lg transition-all flex items-center space-x-2 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Publish New Rental Item</span>
        </Link>
      </div>

      {/* KPI Stats Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer(0.06, 0.05)}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <motion.div variants={statWidgetVariants} custom={0} whileHover={{ y: -4, transition: { duration: 0.2 } }}>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm h-full hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">Listed Items</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">{totalRentals}</p>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Active on Marketplace</span>
          </div>
        </motion.div>

        <motion.div variants={statWidgetVariants} custom={1} whileHover={{ y: -4, transition: { duration: 0.2 } }}>
          <Link href="/owner/rentals" className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:border-amber-300 hover:shadow-md transition block h-full">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">Pending Approvals</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Inbox className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">{subCounts.pending}</p>
            <span className="text-[11px] text-amber-600 font-semibold mt-1 block">In Super Admin Queue →</span>
          </Link>
        </motion.div>

        <motion.div variants={statWidgetVariants} custom={2} whileHover={{ y: -4, transition: { duration: 0.2 } }}>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm h-full hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">Active Rentals</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">4</p>
            <span className="text-[11px] text-blue-600 font-semibold mt-1 block">With Customers</span>
          </div>
        </motion.div>

        <motion.div variants={statWidgetVariants} custom={3} whileHover={{ y: -4, transition: { duration: 0.2 } }}>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm h-full hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">Security Deposits</span>
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">₹32,000</p>
            <span className="text-[11px] text-purple-600 font-semibold mt-1 block">Held Safe Offline</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Incoming Rental Proposals Queue */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Incoming Rental Proposals</h3>
            <p className="text-xs text-slate-500">Review and accept customer booking requests before deadline</p>
          </div>
          <Link
            href="/owner/rental-requests"
            className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center"
          >
            <span>View All ({bookingRequests.length})</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {(Array.isArray(bookingRequests) ? bookingRequests : []).map((b) => (
            <div key={b.id} className="p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold text-slate-400">{b.booking_code}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    b.status === 'ACCEPTED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : b.status === 'REJECTED'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {b.status}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-base">{b.item_title}</h4>
                <p className="text-xs text-slate-500">
                  Customer: <strong>{b.customer_name}</strong> ({b.customer_phone}) • Period: {b.start_date} to {b.end_date} ({b.days} days)
                </p>
                <div className="text-xs text-slate-600 font-medium pt-1">
                  Rental Fee: <strong className="text-emerald-800">₹{b.rental_fee}</strong> | Deposit: <strong>₹{b.deposit}</strong>
                </div>
              </div>

              {b.status === 'PENDING' ? (
                <div className="flex items-center space-x-2 w-full md:w-auto">
                  <button
                    onClick={() => handleAction(b.id, 'reject')}
                    className="flex-1 md:flex-initial flex items-center justify-center space-x-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <XCircle className="w-4 h-4 text-rose-500" />
                    <span>Decline</span>
                  </button>
                  <button
                    onClick={() => handleAction(b.id, 'accept')}
                    className="flex-1 md:flex-initial flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Accept Booking</span>
                  </button>
                </div>
              ) : (
                <span className="text-xs font-bold text-slate-500 italic">
                  Status: {b.status}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
