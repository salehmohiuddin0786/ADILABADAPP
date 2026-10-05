import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Phone, MessageCircle, Navigation, Star, Sparkles, ArrowRight, Bookmark } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function BusinessCard({ business }) {
  const { isFavorited, toggleFavorite } = useAuth();
  const favorited = isFavorited('business', business.id);

  const defaultCover = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80';
  const coverUrl = business.cover_url || defaultCover;

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite('business', business.id);
  };

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${business.name}, ${business.address}, Adilabad`)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.25 }}
      className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-brand-400 transition-all duration-300 flex flex-col overflow-hidden group"
    >
      {/* Cover Image & Logo */}
      <div className="relative aspect-[16/9] bg-slate-900 overflow-hidden">
        <img
          src={coverUrl}
          alt={business.name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Featured Badge */}
        {business.is_featured === 1 && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-600 text-white text-[10px] sm:text-[11px] font-black uppercase tracking-wider flex items-center gap-1 shadow-lg shadow-emerald-500/30">
            <Sparkles className="w-3 h-3 fill-current animate-pulse" />
            <span>Verified Business</span>
          </div>
        )}

        {/* Bookmark Favorite */}
        <button
          onClick={handleFavoriteClick}
          aria-label={favorited ? 'Remove favorite' : 'Save business'}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 shadow-md backdrop-blur-md hover:scale-110 active:scale-95 ${
            favorited
              ? 'bg-brand-600 text-white ring-2 ring-brand-300'
              : 'bg-white/90 text-slate-700 hover:text-brand-600 hover:bg-white'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
        </button>

        {/* Category Badge */}
        <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-slate-900/85 backdrop-blur-md text-white text-xs font-semibold border border-white/10 shadow">
          {business.category_name}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="flex items-center bg-amber-50 border border-amber-200 text-amber-700 font-bold text-xs px-2 py-0.5 rounded-md">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 mr-1" />
              <span>{business.rating || 4.8}</span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">({business.total_reviews || 18} verified reviews)</span>
          </div>

          <Link href={`/businesses/${business.slug}`}>
            <h3 className="font-bold text-slate-900 text-base group-hover:text-brand-600 transition line-clamp-1 mb-1">
              {business.name}
            </h3>
          </Link>

          <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
            {business.description}
          </p>

          <div className="flex items-center gap-1 text-xs text-slate-500 truncate mb-4">
            <MapPin className="w-3.5 h-3.5 text-brand-500 shrink-0" />
            <span>{business.location_name || 'Adilabad'}, Adilabad</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-100 grid grid-cols-4 gap-1.5 text-center">
          {business.phone && (
            <a
              href={`tel:${business.phone}`}
              title="Call Business"
              className="py-2 px-2 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white flex items-center justify-center transition-all duration-200 text-xs font-bold gap-1 shadow-sm hover:scale-[1.02]"
            >
              <Phone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Call</span>
            </a>
          )}

          {business.whatsapp && (
            <a
              href={`https://wa.me/${business.whatsapp.replace(/[^0-9]/g, '')}?text=Hi,%20I%20found%20your%20business%20"${encodeURIComponent(business.name)}"%20on%20Adilabad%20App.`}
              target="_blank"
              rel="noopener noreferrer"
              title="WhatsApp Message"
              className="py-2 px-2 rounded-xl bg-green-50 hover:bg-green-600 text-green-700 hover:text-white flex items-center justify-center transition-all duration-200 text-xs font-bold gap-1 shadow-sm hover:scale-[1.02]"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WA</span>
            </a>
          )}

          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Directions on Google Maps"
            className="py-2 px-2 rounded-xl bg-slate-100 hover:bg-slate-800 text-slate-700 hover:text-white flex items-center justify-center transition-all duration-200 text-xs font-bold gap-1 shadow-sm hover:scale-[1.02]"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Map</span>
          </a>

          <Link
            href={`/businesses/${business.slug}`}
            className="py-2 px-2 rounded-xl bg-brand-50 hover:bg-brand-600 text-brand-700 hover:text-white flex items-center justify-center transition-all duration-200 text-xs font-bold gap-0.5 shadow-sm hover:scale-[1.02]"
          >
            <span>View</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
