import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, Phone, MessageCircle, Bookmark, Sparkles, Tag, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '../../utils/api';

export default function AdvertisementCard({ ad }) {
  const { isFavorited, toggleFavorite } = useAuth();
  const favorited = isFavorited('advertisement', ad.id);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite('advertisement', ad.id);
  };

  const handleActionClick = (type, e) => {
    e.stopPropagation();
    apiFetch(`/advertisements/${ad.id}/click`, {
      method: 'POST',
      body: JSON.stringify({ type })
    }).catch(() => {});
  };

  const defaultImg = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80';
  const imgUrl = ad.primary_image || defaultImg;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.25 }}
      className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-brand-400 transition-all duration-300 flex flex-col overflow-hidden group"
    >
      {/* Image & Badges */}
      <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden">
        <img
          src={imgUrl}
          alt={ad.title}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        {/* Subtle Dark Gradient Overlay at bottom of image for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Featured Badge */}
        {ad.is_featured === 1 && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 text-white text-[10px] sm:text-[11px] font-black uppercase tracking-wider flex items-center gap-1 shadow-lg shadow-amber-500/30">
            <Sparkles className="w-3 h-3 fill-current animate-pulse" />
            <span>Featured Deal</span>
          </div>
        )}

        {/* Category Pill */}
        <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-slate-900/85 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5 shadow-md border border-white/10">
          <Tag className="w-3 h-3 text-brand-400" />
          <span>{ad.category_name}</span>
        </div>

        {/* Favorite Save Button */}
        <button
          onClick={handleFavoriteClick}
          aria-label={favorited ? 'Remove from favorites' : 'Save to favorites'}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 shadow-md backdrop-blur-md hover:scale-110 active:scale-95 ${
            favorited
              ? 'bg-brand-600 text-white ring-2 ring-brand-300'
              : 'bg-white/90 text-slate-700 hover:text-brand-600 hover:bg-white'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Body Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Price display if present */}
          {ad.price_display && (
            <div className="flex items-baseline gap-1.5 mb-1.5">
              <span className="text-lg sm:text-xl font-black text-brand-600 tracking-tight">
                {ad.price_display}
              </span>
              {ad.price_unit && (
                <span className="text-xs text-slate-400 font-medium">/{ad.price_unit}</span>
              )}
            </div>
          )}

          {/* Title */}
          <Link href={`/advertisements/${ad.slug}`}>
            <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2 group-hover:text-brand-600 transition mb-2">
              {ad.title}
            </h3>
          </Link>

          {/* Business & Location */}
          <div className="space-y-1 text-xs text-slate-500 mb-3">
            <p className="font-semibold text-slate-700 truncate flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block shrink-0" />
              <span>{ad.business_name}</span>
            </p>
            {ad.location_name && (
              <p className="flex items-center gap-1 truncate text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{ad.location_name}, Adilabad</span>
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            {ad.phone && (
              <a
                href={`tel:${ad.phone}`}
                onClick={(e) => handleActionClick('call', e)}
                title="Call Now"
                className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white hover:scale-105 active:scale-95 flex items-center justify-center transition-all shadow-sm"
              >
                <Phone className="w-3.5 h-3.5" />
              </a>
            )}
            {ad.whatsapp && (
              <a
                href={`https://wa.me/${ad.whatsapp.replace(/[^0-9]/g, '')}?text=Hi,%20I%20saw%20your%20ad%20"${encodeURIComponent(ad.title)}"%20on%20Adilabad%20App.`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => handleActionClick('whatsapp', e)}
                title="Chat on WhatsApp"
                className="w-8 h-8 rounded-xl bg-green-50 text-green-700 hover:bg-green-600 hover:text-white hover:scale-105 active:scale-95 flex items-center justify-center transition-all shadow-sm"
              >
                <MessageCircle className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          <Link
            href={`/advertisements/${ad.slug}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-brand-600 bg-brand-50 hover:bg-brand-600 hover:text-white hover:shadow-md hover:shadow-brand-500/20 transition-all duration-200"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
