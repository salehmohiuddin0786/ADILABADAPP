import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  Navigation,
  Globe,
  Share2,
  Bookmark,
  ExternalLink,
  Users
} from 'lucide-react';
import MainLayout from '../../src/components/layout/MainLayout';
import EventCard from '../../src/components/cards/EventCard';
import ShareModal from '../../src/components/modals/ShareModal';
import { useAuth } from '../../src/context/AuthContext';
import { apiFetch } from '../../src/utils/api';

export default function EventDetailPage({ event }) {
  const { isFavorited, toggleFavorite } = useAuth();
  const [shareModalOpen, setShareModalOpen] = useState(false);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800">Event Not Found</h2>
          <Link href="/events" className="inline-block mt-4 text-brand-600 font-bold">
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const favorited = isFavorited('event', event.id);

  const formattedDate = event.event_date
    ? new Date(event.event_date).toLocaleDateString('en-IN', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    : 'Date TBA';

  const mapsQuery = `${event.venue}, ${event.address}, Adilabad`;
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`;

  return (
    <>
      <Head>
        <title>{event.title} — Adilabad Events</title>
        <meta name="description" content={event.description?.slice(0, 160)} />
      </Head>

      <div className="bg-slate-50 py-6 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 truncate">
            <Link href="/" className="hover:text-brand-600">Home</Link>
            <span>/</span>
            <Link href="/events" className="hover:text-brand-600">Events</Link>
            <span>/</span>
            <span className="text-slate-800 font-medium truncate">{event.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* LEFT DETAILS */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white rounded-3xl p-3 sm:p-4 border border-slate-200/90 shadow-sm overflow-hidden">
                <div className="relative aspect-[16/9] bg-slate-900 rounded-2xl overflow-hidden">
                  <img
                    src={event.cover_url || 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80'}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold mb-3">
                    <Calendar className="w-3.5 h-3.5 text-brand-600" />
                    <span>{formattedDate}</span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                    {event.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-500 mt-3 font-medium">
                    <span className="flex items-center gap-1.5 text-brand-600 font-semibold">
                      <Clock className="w-4 h-4" />
                      {event.event_time}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      {event.venue}, Adilabad
                    </span>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                    About this Event
                  </h3>
                  <div className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                    {event.description}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleFavorite('event', event.id)}
                      className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition flex items-center gap-2 ${
                        favorited
                          ? 'bg-brand-600 text-white border-brand-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-brand-500'
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
                      <span>{favorited ? 'Saved Event' : 'Save Event'}</span>
                    </button>

                    <button
                      onClick={() => setShareModalOpen(true)}
                      className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border border-slate-200 bg-white text-slate-700 hover:border-brand-500 transition flex items-center gap-2"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDEBAR */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-5">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Organizer & Venue
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">
                    {event.organizer}
                  </h3>
                </div>

                <div className="space-y-3">
                  {event.registration_url && (
                    <a
                      href={event.registration_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md transition"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Register / Get Passes</span>
                    </a>
                  )}

                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition"
                  >
                    <Navigation className="w-4 h-4 text-brand-600" />
                    <span>Get Directions to Venue</span>
                  </a>

                  {event.phone && (
                    <a
                      href={`tel:${event.phone}`}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white font-semibold text-xs transition"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Contact Organizer ({event.phone})</span>
                    </a>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 text-xs text-slate-600 space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-800">{event.venue}</p>
                      <p className="text-slate-500">{event.address}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* OTHER UPCOMING EVENTS */}
          {event.upcoming && event.upcoming.length > 0 && (
            <div className="mt-16 pt-12 border-t border-slate-200">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-8">
                More Upcoming Events
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {event.upcoming.map((ev) => (
                  <EventCard key={ev.id} event={ev} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        title={event.title}
        slug={event.slug}
        id={event.id}
        type="event"
      />
    </>
  );
}

EventDetailPage.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};

export async function getServerSideProps({ params }) {
  try {
    const res = await apiFetch(`/events/detail/${params.slug}`);
    return {
      props: {
        event: res.data || null
      }
    };
  } catch (error) {
    return { props: { event: null } };
  }
}
