import React, { useState } from 'react';
import Head from 'next/head';
import { Calendar as CalendarIcon, Clock, Layers, ChevronLeft, ChevronRight } from 'lucide-react';
import OwnerLayout from '../../src/panels/owner-panel/OwnerLayout';

export default function OwnerBookingCalendarPage() {
  const [currentMonth, setCurrentMonth] = useState('November 2026');
  const [schedules] = useState([
    {
      id: 1,
      item: 'Sony Alpha A7 IV Kit',
      customer: 'Rahul Sharma',
      dates: 'Nov 16 — Nov 19',
      status: 'Reserved',
      badgeClass: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 2,
      item: 'John Deere 5050D Tractor',
      customer: 'Suresh Patel',
      dates: 'Nov 20 — Nov 23',
      status: 'Confirmed Handover',
      badgeClass: 'bg-blue-100 text-blue-800'
    },
    {
      id: 3,
      item: 'JBL VRX Sound System',
      customer: 'Anand Kumar Wedding',
      dates: 'Nov 27 — Nov 29',
      status: 'Advance Paid',
      badgeClass: 'bg-purple-100 text-purple-800'
    }
  ]);

  return (
    <OwnerLayout title="Rental Booking Calendar">
      <Head>
        <title>Booking Calendar — Adilabad Owner Portal</title>
      </Head>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Equipment Dispatch & Reservation Timeline</h2>
            <p className="text-xs text-slate-500 mt-0.5">Track upcoming dates to prevent overlapping rentals.</p>
          </div>
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold">
            <span>{currentMonth}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(Array.isArray(schedules) ? schedules : []).map((sc) => (
            <div key={sc.id} className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${sc.badgeClass}`}>
                  {sc.status}
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">
                  <CalendarIcon className="w-3.5 h-3.5 inline mr-1 text-slate-500" />
                  {sc.dates}
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-base">{sc.item}</h3>
              <p className="text-xs text-slate-500">Reserved by: <strong className="text-slate-800">{sc.customer}</strong></p>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-emerald-700 font-bold">Adilabad Yard</span>
                <span className="text-slate-400 font-medium">Auto-locked</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </OwnerLayout>
  );
}
