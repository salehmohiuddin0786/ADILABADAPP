import React, { useState } from 'react';
import Head from 'next/head';
import { Sparkles, Plus, Calendar, MapPin, ExternalLink } from 'lucide-react';
import OwnerLayout from '../../src/panels/owner-panel/OwnerLayout';
import { useToast } from '../../src/context/ToastContext';

export default function OwnerEventsPage() {
  const { addToast } = useToast();
  const [events] = useState([
    {
      id: 1,
      title: 'Adilabad Mega Electronics & Home Gadgets Expo 2026',
      venue: 'Town Hall Grounds, Shivaji Chowk',
      date: 'Dec 15 — Dec 18, 2026',
      ticket: 'Free Entry',
      status: 'PUBLISHED'
    }
  ]);

  return (
    <OwnerLayout title="My Hosted Events & Exhibitions">
      <Head>
        <title>Hosted Events — Adilabad Owner Portal</title>
      </Head>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">District Events & Expos</h2>
            <p className="text-xs text-slate-500 mt-0.5">Promote consumer expos, musical nights, cultural fests, and workshops.</p>
          </div>
          <button
            onClick={() => addToast('Event submission form opened.', 'info')}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Create District Event
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(Array.isArray(events) ? events : []).map((ev) => (
            <div key={ev.id} className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {ev.status}
                </span>
                <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">{ev.ticket}</span>
              </div>
              <h3 className="font-bold text-slate-900 text-base">{ev.title}</h3>
              <div className="space-y-1 text-xs text-slate-500">
                <p className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-brand-600" /> {ev.date}
                </p>
                <p className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-brand-600" /> {ev.venue}
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-emerald-700 font-bold">Featured on Homepage</span>
                <button
                  onClick={() => addToast('Event details updated.', 'success')}
                  className="text-brand-600 font-bold hover:underline"
                >
                  Manage Event
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </OwnerLayout>
  );
}
