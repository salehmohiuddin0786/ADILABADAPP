import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Layers,
  Heart,
  Clock,
  Briefcase,
  Store,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Calendar,
  CheckCircle2,
  Tag,
  Wrench,
  PlusCircle,
  Eye,
  FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '../../utils/api';
import { submissionService } from '../../shared/services/submissionService';
import { fadeInUp, staggerContainer, statWidgetVariants } from '../../shared/animations/motionPresets';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [activeRentals, setActiveRentals] = useState([]);
  const [mySubmissions, setMySubmissions] = useState([]);
  const [stats, setStats] = useState({
    activeRentals: 2,
    buySellListings: 0,
    servicesCount: 0,
    jobApplications: 1,
    savedFavorites: 4
  });

  const loadData = async () => {
    try {
      const res = await submissionService.getSubmissions();
      const all = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
      setMySubmissions(all);

      const buySell = all.filter((s) => s.module === 'buy-sell');
      const servs = all.filter((s) => s.module === 'services');
      const jobs = all.filter((s) => s.module === 'jobs');
      const rentals = all.filter((s) => s.module === 'rentals');

      setStats({
        activeRentals: rentals.length > 0 ? rentals.length : 2,
        buySellListings: buySell.length,
        servicesCount: servs.length,
        jobApplications: jobs.length > 0 ? jobs.length : 1,
        savedFavorites: 4
      });
    } catch (e) {
      setMySubmissions([]);
    }
  };

  useEffect(() => {
    loadData();

    setActiveRentals([
      {
        id: 1,
        booking_code: 'ADL-RENT-49201',
        title: 'Sony Alpha A7 IV Mirrorless Camera',
        owner: 'Adilabad Media Works',
        start_date: '2026-11-15',
        end_date: '2026-11-18',
        total_days: 3,
        total_amount: 4500,
        status: 'CONFIRMED'
      },
      {
        id: 2,
        booking_code: 'ADL-RENT-83190',
        title: 'John Deere 5050D Tractor with Cultivator',
        owner: 'Telangana Agri Hub',
        start_date: '2026-11-20',
        end_date: '2026-11-22',
        total_days: 2,
        total_amount: 6400,
        status: 'PENDING'
      }
    ]);

    const handleUpdate = () => loadData();
    if (typeof window !== 'undefined') {
      window.addEventListener('adilabad_submissions_updated', handleUpdate);
      return () => window.removeEventListener('adilabad_submissions_updated', handleUpdate);
    }
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PUBLISHED':
        return <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full flex items-center"><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Live & Published</span>;
      case 'CONFIRMED':
        return <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full flex items-center"><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Confirmed</span>;
      case 'ACTIVE':
        return <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-full">In Hand (Active)</span>;
      case 'PENDING_APPROVAL':
      case 'PENDING':
        return <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full flex items-center"><Clock className="w-3.5 h-3.5 mr-1" /> Super Admin Review</span>;
      case 'CHANGES_REQUESTED':
        return <span className="bg-orange-100 text-orange-800 text-xs font-bold px-2.5 py-1 rounded-full flex items-center"><AlertCircle className="w-3.5 h-3.5 mr-1" /> Action Required</span>;
      default:
        return <span className="bg-slate-100 text-slate-800 text-xs font-bold px-2.5 py-1 rounded-full">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Hero */}
      <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-emerald-700/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-emerald-100 mb-3">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Verified Adilabad Resident Account</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'Local Resident'}!
          </h2>
          <p className="mt-2 text-emerald-100 text-sm leading-relaxed">
            Manage your rental reservations, post pre-owned items to sell, request local services, and track all your submissions across Adilabad.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/customer/buy-sell"
              className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition-all flex items-center space-x-1.5"
            >
              <Tag className="w-4 h-4" />
              <span>Sell Pre-Owned Item</span>
            </Link>
            <Link
              href="/customer/services"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2.5 rounded-xl text-xs backdrop-blur-sm transition-all flex items-center space-x-1.5"
            >
              <Wrench className="w-4 h-4" />
              <span>Post / Find Services</span>
            </Link>
            <Link
              href="/rentals"
              className="bg-emerald-700 hover:bg-emerald-600 text-white font-semibold px-4 py-2.5 rounded-xl text-xs transition-all flex items-center space-x-1.5"
            >
              <Layers className="w-4 h-4" />
              <span>Browse Equipment Rentals</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer(0.06, 0.05)}
        className="grid grid-cols-2 lg:grid-cols-5 gap-4"
      >
        <motion.div variants={statWidgetVariants} custom={0} whileHover={{ y: -4, transition: { duration: 0.2 } }}>
          <Link href="/customer/rentals/active" className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all block h-full">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">Rentals</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">{stats.activeRentals}</p>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Active Bookings</span>
          </Link>
        </motion.div>

        <motion.div variants={statWidgetVariants} custom={1} whileHover={{ y: -4, transition: { duration: 0.2 } }}>
          <Link href="/customer/buy-sell" className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:border-amber-500 hover:shadow-md transition-all block h-full">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">Sell Items</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <Tag className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">{stats.buySellListings}</p>
            <span className="text-[11px] text-amber-600 font-semibold mt-1 block">My Listings</span>
          </Link>
        </motion.div>

        <motion.div variants={statWidgetVariants} custom={2} whileHover={{ y: -4, transition: { duration: 0.2 } }}>
          <Link href="/customer/services" className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:border-blue-500 hover:shadow-md transition-all block h-full">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">Services</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                <Wrench className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">{stats.servicesCount}</p>
            <span className="text-[11px] text-blue-600 font-semibold mt-1 block">Listings & Requests</span>
          </Link>
        </motion.div>

        <motion.div variants={statWidgetVariants} custom={3} whileHover={{ y: -4, transition: { duration: 0.2 } }}>
          <Link href="/customer/jobs" className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:border-purple-500 hover:shadow-md transition-all block h-full">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">Jobs</span>
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                <Briefcase className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">{stats.jobApplications}</p>
            <span className="text-[11px] text-purple-600 font-semibold mt-1 block">Applications</span>
          </Link>
        </motion.div>

        <motion.div variants={statWidgetVariants} custom={4} whileHover={{ y: -4, transition: { duration: 0.2 } }} className="col-span-2 lg:col-span-1">
          <Link href="/customer/favorites" className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:border-rose-500 hover:shadow-md transition-all block h-full">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">Saved</span>
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                <Heart className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">{stats.savedFavorites}</p>
            <span className="text-[11px] text-rose-600 font-semibold mt-1 block">Shortlisted</span>
          </Link>
        </motion.div>
      </motion.div>

      {/* Customer's Posted Items & Submissions across all modules */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">My Recent Postings & Submissions</h3>
            <p className="text-xs text-slate-500">Track approval status for items and services you posted</p>
          </div>
          <div className="flex items-center space-x-2">
            <Link
              href="/customer/buy-sell"
              className="text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-200 transition-colors"
            >
              + Sell Item
            </Link>
            <Link
              href="/customer/services"
              className="text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-200 transition-colors"
            >
              + Add Service
            </Link>
          </div>
        </div>

        {mySubmissions.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="font-semibold text-slate-800 text-sm">No postings yet</h4>
            <p className="text-xs text-slate-500 mt-1">
              Have something to sell or a service to offer in Adilabad? Post your first item above!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {mySubmissions.slice(0, 6).map((sub) => (
              <div key={sub.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {sub.module}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-400">{sub.id}</span>
                    {getStatusBadge(sub.status)}
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{sub.title}</h4>
                  <p className="text-xs text-slate-500">
                    Location: <strong>{sub.location || 'Adilabad'}</strong> • {sub.category}
                    {sub.price ? ` • Price: ₹${Number(sub.price).toLocaleString()}` : ''}
                  </p>
                  {sub.adminNotes && (
                    <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200 mt-1">
                      <strong>Admin Note:</strong> {sub.adminNotes}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  {sub.status === 'PUBLISHED' && (
                    <Link
                      href={sub.module === 'buy-sell' ? '/buy-sell' : sub.module === 'services' ? '/services' : '/rentals'}
                      className="text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors flex items-center"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      View Live
                    </Link>
                  )}
                  <Link
                    href={`/customer/${sub.module === 'buy-sell' ? 'buy-sell' : sub.module === 'services' ? 'services' : 'dashboard'}`}
                    className="text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Manage
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Rental Reservations */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Current Rental Bookings</h3>
            <p className="text-xs text-slate-500">Track handover, return deadlines, and owner contacts</p>
          </div>
          <Link
            href="/customer/rentals/requests"
            className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {(Array.isArray(activeRentals) ? activeRentals : []).map((rental) => (
            <div key={rental.id} className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold text-slate-500">{rental.booking_code}</span>
                  {getStatusBadge(rental.status)}
                </div>
                <h4 className="font-bold text-slate-900 text-base">{rental.title}</h4>
                <p className="text-xs text-slate-500">
                  Owner: <strong>{rental.owner}</strong> • Duration: {rental.start_date} to {rental.end_date} ({rental.total_days} days)
                </p>
              </div>

              <div className="flex sm:flex-col items-end justify-between w-full sm:w-auto gap-2">
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Total Rental Due</span>
                  <span className="text-base font-extrabold text-slate-900">₹{rental.total_amount.toLocaleString()}</span>
                </div>
                <button className="text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 transition-colors">
                  Booking Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
