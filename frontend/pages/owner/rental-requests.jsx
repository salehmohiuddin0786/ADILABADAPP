import React, { useState } from 'react';
import Head from 'next/head';
import { Inbox, Phone, Calendar, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';
import OwnerLayout from '../../src/panels/owner-panel/OwnerLayout';
import { useToast } from '../../src/context/ToastContext';

export default function OwnerRentalRequestsPage() {
  const { addToast } = useToast();
  const [requests, setRequests] = useState([
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

  const handleDecision = (id, newStatus) => {
    setRequests((prev) =>
      (Array.isArray(prev) ? prev : []).map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    addToast(
      newStatus === 'ACCEPTED'
        ? 'Proposal accepted! Handover scheduled with customer.'
        : 'Proposal rejected.',
      newStatus === 'ACCEPTED' ? 'success' : 'info'
    );
  };

  return (
    <OwnerLayout title="Rental Booking Requests">
      <Head>
        <title>Customer Rental Requests — Adilabad Owner Portal</title>
      </Head>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Incoming Reservation Proposals</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Review proposed dates, contact the customer directly, and confirm pickup inspection in Adilabad.
          </p>
        </div>

        <div className="space-y-4">
          {(Array.isArray(requests) ? requests : []).map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {req.booking_code}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      req.status === 'ACCEPTED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : req.status === 'REJECTED'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {req.status}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base">{req.item_title}</h3>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" /> {req.start_date} to {req.end_date} ({req.days} days)
                  </span>
                  <span>
                    Customer: <strong>{req.customer_name}</strong>
                  </span>
                  <a
                    href={`tel:${req.customer_phone}`}
                    className="flex items-center gap-1 text-emerald-700 font-bold hover:underline"
                  >
                    <Phone className="w-3.5 h-3.5" /> +91 {req.customer_phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0">
                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Total Due at Handover</span>
                  <span className="text-lg font-black text-slate-900 block">₹{req.rental_fee + req.deposit}</span>
                  <span className="text-[10px] text-slate-400 block">(Rent ₹{req.rental_fee} + Dep ₹{req.deposit})</span>
                </div>

                {req.status === 'PENDING' ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDecision(req.id, 'ACCEPTED')}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Accept
                    </button>
                    <button
                      onClick={() => handleDecision(req.id, 'REJECTED')}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-rose-700 font-bold text-xs"
                    >
                      Decline
                    </button>
                  </div>
                ) : (
                  <span className="text-xs font-semibold text-slate-500 italic">
                    Decision logged: {req.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </OwnerLayout>
  );
}
