import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Sparkles, Plus, Calendar, MapPin, ExternalLink, X } from 'lucide-react';
import OwnerLayout from '../../src/panels/owner-panel/OwnerLayout';
import { useToast } from '../../src/context/ToastContext';
import { submissionService } from '../../src/shared/services/submissionService';

export default function OwnerEventsPage() {
  const { addToast } = useToast();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Expos & Trade Fairs',
    venue: 'Town Hall Grounds, Adilabad',
    date: 'Dec 15 — Dec 18, 2026',
    pricing: 'Free Public Entry',
    description: '',
    image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'
  });

  const loadEvents = async () => {
    setLoading(true);
    try {
      const res = await submissionService.getSubmissions({ module: 'events' });
      setEvents(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
    const handleSync = () => loadEvents();
    if (typeof window !== 'undefined') {
      window.addEventListener('adilabad_submissions_updated', handleSync);
      return () => window.removeEventListener('adilabad_submissions_updated', handleSync);
    }
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.venue) {
      addToast('Please provide event title and venue.', 'error');
      return;
    }

    const res = await submissionService.createSubmission({
      module: 'events',
      title: formData.title,
      category: formData.category,
      pricing: formData.pricing,
      location: formData.venue,
      description: formData.description,
      image_url: formData.image_url,
      specs: { event_date: formData.date }
    });

    if (res.success) {
      addToast(`Event "${formData.title}" submitted for Super Admin verification & publishing!`, 'success');
      setShowCreateModal(false);
      setFormData({
        title: '',
        category: 'Expos & Trade Fairs',
        venue: 'Town Hall Grounds, Adilabad',
        date: 'Dec 15 — Dec 18, 2026',
        pricing: 'Free Public Entry',
        description: '',
        image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'
      });
      loadEvents();
    }
  };

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
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Create District Event
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(Array.isArray(events) ? events : []).map((ev) => (
            <div key={ev.id} className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    ev.status === 'PUBLISHED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : ev.status === 'CHANGES_REQUESTED'
                      ? 'bg-orange-100 text-orange-800'
                      : ev.status === 'REJECTED'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {ev.status}
                </span>
                <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                  {ev.pricing || 'Free Entry'}
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-base">{ev.title}</h3>
              <div className="space-y-1 text-xs text-slate-500">
                <p className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-brand-600" /> {ev.specs?.event_date || 'Upcoming'}
                </p>
                <p className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-brand-600" /> {ev.location}
                </p>
                {ev.review_notes && (
                  <p className="text-[10px] text-amber-800 bg-amber-50 border border-amber-200 p-1.5 rounded-lg mt-1">
                    <strong>Admin Note:</strong> {ev.review_notes}
                  </p>
                )}
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono text-[10px]">ID: {ev.id}</span>
                {ev.status === 'PUBLISHED' ? (
                  <span className="text-emerald-700 font-bold">Live on Marketplace</span>
                ) : (
                  <span className="text-amber-600 font-bold">Awaiting Super Admin</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-900">Host New District Event</h3>
              <button onClick={() => setShowCreateModal(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Adilabad Agri Expo & Kisan Mela"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-800 outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Venue / Ground *</label>
                  <input
                    type="text"
                    required
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Date & Time</label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-800 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Entry Ticket / Fee</label>
                  <input
                    type="text"
                    value={formData.pricing}
                    onChange={(e) => setFormData({ ...formData, pricing: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-800 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Event Poster Image URL</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Event Description & Program Schedule</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detail schedule, chief guests, stall booking info..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-800 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow"
                >
                  Submit Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </OwnerLayout>
  );
}
