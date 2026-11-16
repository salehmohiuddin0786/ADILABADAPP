import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Calendar, PlusCircle, Search, Trash2, MapPin, Sparkles } from 'lucide-react';
import AdminLayout from '../../../src/components/layout/AdminLayout';
import { apiFetch } from '../../../src/utils/api';
import { useToast } from '../../../src/context/ToastContext';

export default function AdminEventsPage() {
  const { addToast } = useToast();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const q = search ? `?search=${encodeURIComponent(search)}` : '';
      const res = await apiFetch(`/events/admin/list${q}`);
      if (res && res.success && Array.isArray(res.data)) {
        setEvents(res.data);
      } else if (res && Array.isArray(res)) {
        setEvents(res);
      } else {
        setEvents([]);
      }
    } catch (err) {
      addToast(err.message, 'error');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete event "${title}"?`)) return;
    try {
      const res = await apiFetch(`/events/admin/delete/${id}`, { method: 'DELETE' });
      if (res.success) {
        addToast(res.message, 'success');
        fetchEvents();
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <AdminLayout title="Event Management">
      <Head>
        <title>Manage Events — Adilabad App Admin</title>
      </Head>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-xl">
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">
              Events ({events.length})
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Admin-controlled festivals, cricket championships, exhibitions, and consumer expos in Adilabad.
            </p>
          </div>

          <Link
            href="/admin/events/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold shadow-md shadow-brand-600/20 transition shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Event</span>
          </Link>
        </div>

        {/* Events Table */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6">Event Title</th>
                  <th className="py-4 px-4">Date & Time</th>
                  <th className="py-4 px-4">Venue</th>
                  <th className="py-4 px-4">Organizer</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {(Array.isArray(events) ? events : []).map((ev) => (
                  <tr key={ev.id} className="hover:bg-slate-800/60 transition">
                    <td className="py-4 px-6 font-bold text-white">
                      <Link href={`/events/${ev.slug}`} target="_blank" className="hover:text-brand-400 transition">
                        {ev.title}
                      </Link>
                    </td>
                    <td className="py-4 px-4 text-xs font-semibold text-slate-300">
                      {ev.event_date} ({ev.event_time})
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-400">{ev.venue}</td>
                    <td className="py-4 px-4 text-xs font-medium text-slate-300">{ev.organizer}</td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
                        {ev.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDelete(ev.id, ev.title)}
                        className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
