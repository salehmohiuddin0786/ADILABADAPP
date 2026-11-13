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
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '../../utils/api';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [activeRentals, setActiveRentals] = useState([]);
  const [stats, setStats] = useState({
    activeRentals: 1,
    pendingRequests: 2,
    savedFavorites: 4,
    jobApplications: 1,
    enquiries: 3
  });

  useEffect(() => {
    // In production or mock fallback, fetch user's rental bookings
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
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full flex items-center"><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Confirmed</span>;
      case 'ACTIVE':
        return <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-full">In Hand (Active)</span>;
      case 'PENDING':
        return <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full">Awaiting Owner</span>;
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
            Manage your rental reservations, track local service requests, review saved advertisements, and connect directly with Adilabad businesses.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/rentals"
              className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition-all flex items-center"
            >
              <Layers className="w-4 h-4 mr-1.5" />
              <span>Browse Rental Equipment</span>
            </Link>
            <Link
              href="/advertisements"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2.5 rounded-xl text-xs backdrop-blur-sm transition-all"
            >
              Browse Local Advertisements
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Active Rentals</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{stats.activeRentals}</p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Live Handover</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Rental Requests</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{stats.pendingRequests}</p>
          <span className="text-[11px] text-amber-600 font-semibold mt-1 block">In Owner Review</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Saved Listings</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{stats.savedFavorites}</p>
          <span className="text-[11px] text-slate-500 font-semibold mt-1 block">Quick Access</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Job Apps</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{stats.jobApplications}</p>
          <span className="text-[11px] text-blue-600 font-semibold mt-1 block">Submitted</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Enquiries</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{stats.enquiries}</p>
          <span className="text-[11px] text-indigo-600 font-semibold mt-1 block">Local Showrooms</span>
        </div>
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
