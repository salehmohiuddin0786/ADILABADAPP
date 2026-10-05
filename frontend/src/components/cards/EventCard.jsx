import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, ArrowRight, Bookmark } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function EventCard({ event }) {
  const { isFavorited, toggleFavorite } = useAuth();
  const favorited = isFavorited('event', event.id);

  const defaultCover = 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80';
  const coverUrl = event.cover_url || defaultCover;

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite('event', event.id);
  };

  const formattedDate = event.event_date
    ? new Date(event.event_date).toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : 'Upcoming';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.25 }}
      className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-brand-400 transition-all duration-300 flex flex-col overflow-hidden group"
    >
      <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden">
        <img
          src={coverUrl}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Date pill */}
        <div className="absolute top-3 left-3 px-3 py-1 rounded-xl bg-slate-900/85 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5 shadow-md border border-white/10">
          <Calendar className="w-3.5 h-3.5 text-brand-400" />
          <span>{formattedDate}</span>
        </div>

        {/* Bookmark */}
        <button
          onClick={handleFavoriteClick}
          aria-label={favorited ? 'Remove favorite' : 'Save event'}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 shadow-md backdrop-blur-md hover:scale-110 active:scale-95 ${
            favorited
              ? 'bg-brand-600 text-white ring-2 ring-brand-300'
              : 'bg-white/90 text-slate-700 hover:text-brand-600 hover:bg-white'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-brand-600 font-bold mb-2">
            <Clock className="w-3.5 h-3.5" />
            <span>{event.event_time}</span>
          </div>

          <Link href={`/events/${event.slug}`}>
            <h3 className="font-bold text-slate-900 text-base group-hover:text-brand-600 transition line-clamp-2 mb-2 leading-snug">
              {event.title}
            </h3>
          </Link>

          <p className="flex items-center gap-1.5 text-xs text-slate-500 truncate mb-1">
            <MapPin className="w-3.5 h-3.5 text-brand-500 shrink-0" />
            <span>{event.venue}, Adilabad</span>
          </p>

          <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
            {event.description}
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-4">
          <span className="text-[11px] text-slate-400 font-medium truncate max-w-[150px]">
            Organized by {event.organizer}
          </span>

          <Link
            href={`/events/${event.slug}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-brand-600 bg-brand-50 hover:bg-brand-600 hover:text-white hover:shadow-md hover:shadow-brand-500/20 transition-all duration-200"
          >
            <span>View Event</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
