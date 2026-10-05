import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Phone,
  MessageCircle,
  Navigation,
  Globe,
  Share2,
  Bookmark,
  Flag,
  Calendar,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Eye,
  CheckCircle,
  Tag,
  Maximize2,
  X
} from 'lucide-react';
import MainLayout from '../../src/components/layout/MainLayout';
import AdvertisementCard from '../../src/components/cards/AdvertisementCard';
import ShareModal from '../../src/components/modals/ShareModal';
import ReportModal from '../../src/components/modals/ReportModal';
import { useAuth } from '../../src/context/AuthContext';
import { apiFetch } from '../../src/utils/api';

export default function AdvertisementDetailPage({ ad }) {
  const { isFavorited, toggleFavorite } = useAuth();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  if (!ad) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800">Advertisement Not Found</h2>
          <p className="text-slate-500 mt-2">This listing might have expired or been removed.</p>
          <Link
            href="/advertisements"
            className="inline-block mt-4 px-5 py-2.5 rounded-xl bg-brand-600 text-white font-bold"
          >
            Browse Advertisements
          </Link>
        </div>
      </div>
    );
  }

  const favorited = isFavorited('advertisement', ad.id);

  const images = ad.images && ad.images.length > 0
    ? ad.images
    : [{ image_url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1000&q=80' }];

  const activeImage = images[activeImageIndex] || images[0];

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const trackInteraction = (type) => {
    apiFetch(`/advertisements/${ad.id}/click`, {
      method: 'POST',
      body: JSON.stringify({ type })
    }).catch(() => {});
  };

  const mapsQuery = `${ad.business_name}, ${ad.address}, Adilabad`;
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`;

  const formattedDate = ad.created_at
    ? new Date(ad.created_at).toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : null;

  return (
    <>
      <Head>
        <title>{ad.title} — Adilabad App</title>
        <meta name="description" content={ad.description?.slice(0, 160)} />
        <meta property="og:title" content={`${ad.title} — Adilabad App`} />
        <meta property="og:description" content={ad.description?.slice(0, 160)} />
        {activeImage?.image_url && <meta property="og:image" content={activeImage.image_url} />}
      </Head>

      <div className="bg-slate-50 py-6 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 truncate">
            <Link href="/" className="hover:text-brand-600 transition">
              Home
            </Link>
            <span>/</span>
            <Link href="/advertisements" className="hover:text-brand-600 transition">
              Advertisements
            </Link>
            <span>/</span>
            <Link href={`/categories/${ad.category_slug}`} className="hover:text-brand-600 transition">
              {ad.category_name}
            </Link>
            <span>/</span>
            <span className="text-slate-800 font-medium truncate">{ad.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            {/* LEFT COLUMN: GALLERY & DETAILS */}
            <div className="lg:col-span-8 space-y-6">
              {/* Image Gallery */}
              <div className="bg-white rounded-3xl p-3 sm:p-4 border border-slate-200/90 shadow-sm overflow-hidden">
                <div className="relative aspect-[16/10] bg-slate-900 rounded-2xl overflow-hidden group">
                  <img
                    src={activeImage.image_url}
                    alt={ad.title}
                    className="w-full h-full object-cover"
                  />

                  {/* Zoom Lightbox Trigger */}
                  <button
                    onClick={() => setLightboxOpen(true)}
                    className="absolute top-4 right-4 p-2.5 rounded-xl bg-slate-900/70 hover:bg-slate-900 text-white backdrop-blur-md transition shadow"
                    title="Fullscreen Lightbox"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>

                  {/* Previous / Next Arrows */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-slate-800 backdrop-blur-md transition shadow"
                        aria-label="Previous Image"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-slate-800 backdrop-blur-md transition shadow"
                        aria-label="Next Image"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}

                  {/* Featured Badge */}
                  {ad.is_featured === 1 && (
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow">
                      <Sparkles className="w-3.5 h-3.5 fill-current" />
                      Featured Ad
                    </div>
                  )}
                </div>

                {/* Thumbnails Row */}
                {images.length > 1 && (
                  <div className="flex items-center gap-2.5 mt-3 overflow-x-auto pb-1">
                    {images.map((img, idx) => (
                      <button
                        key={img.id || idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative w-20 h-14 sm:w-24 sm:h-16 rounded-xl overflow-hidden border-2 shrink-0 transition ${
                          idx === activeImageIndex
                            ? 'border-brand-600 scale-95 shadow-md'
                            : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={img.image_url}
                          alt="Thumbnail"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Title & Metadata Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                    <span className="px-3 py-1 rounded-lg bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-wide">
                      {ad.category_name}
                    </span>

                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {ad.views_count} views
                      </span>
                      {formattedDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          Published {formattedDate}
                        </span>
                      )}
                    </div>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                    {ad.title}
                  </h1>

                  {/* Price Banner */}
                  {ad.price_display && (
                    <div className="mt-3">
                      <span className="text-2xl sm:text-3xl font-black text-brand-600 tracking-tight">
                        {ad.price_display}
                      </span>
                      {ad.price_type && (
                        <span className="ml-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          ({ad.price_type.replace('_', ' ')})
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="pt-6 border-t border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                    Advertisement Details
                  </h3>
                  <div className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                    {ad.description}
                  </div>
                </div>

                {/* Location & Address */}
                <div className="pt-6 border-t border-slate-100 space-y-2">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Location in Adilabad
                  </h3>
                  <div className="flex items-start gap-2.5 text-sm text-slate-600">
                    <MapPin className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-800">{ad.location_name || 'Adilabad Town'}</p>
                      <p className="text-slate-500">{ad.address}</p>
                    </div>
                  </div>
                </div>

                {/* Share, Save, Report Actions Row */}
                <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleFavorite('advertisement', ad.id)}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition ${
                        favorited
                          ? 'bg-brand-600 text-white border-brand-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-brand-500 hover:text-brand-600'
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
                      <span>{favorited ? 'Saved to Favorites' : 'Save Advertisement'}</span>
                    </button>

                    <button
                      onClick={() => setShareModalOpen(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border border-slate-200 bg-white text-slate-700 hover:border-brand-500 hover:text-brand-600 transition"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                  </div>

                  <button
                    onClick={() => setReportModalOpen(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-rose-600 transition"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>Report this listing</span>
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: CONTACT ACTIONS & SELLER CARD */}
            <div className="lg:col-span-4 space-y-6">
              {/* Business / Advertiser Contact Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm sticky top-24 space-y-6">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Advertiser / Business
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mt-1">
                    {ad.business_name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Verified listing in Adilabad, Telangana
                  </p>
                </div>

                {/* Primary Action Buttons */}
                <div className="space-y-3">
                  {/* Call Button */}
                  <a
                    href={`tel:${ad.phone}`}
                    onClick={() => trackInteraction('call')}
                    className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-lg shadow-emerald-600/20 transition group"
                  >
                    <Phone className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    <span>Call: {ad.phone}</span>
                  </a>

                  {/* WhatsApp Button */}
                  {ad.whatsapp && (
                    <a
                      href={`https://wa.me/${ad.whatsapp.replace(/[^0-9]/g, '')}?text=Hi,%20I%20am%20interested%20in%20your%20advertisement%20"${encodeURIComponent(ad.title)}"%20listed%20on%20Adilabad%20App.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackInteraction('whatsapp')}
                      className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-bold text-base shadow-lg shadow-green-600/20 transition group"
                    >
                      <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span>Chat on WhatsApp</span>
                    </a>
                  )}

                  {/* Directions Button */}
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackInteraction('directions')}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition"
                  >
                    <Navigation className="w-4 h-4 text-brand-600" />
                    <span>Get Directions (Maps)</span>
                  </a>

                  {/* Website link if provided */}
                  {ad.website && (
                    <a
                      href={ad.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackInteraction('website')}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition"
                    >
                      <Globe className="w-3.5 h-3.5 text-slate-400" />
                      <span>Visit Official Website</span>
                    </a>
                  )}
                </div>

                {/* Safety / Verification Notice */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-500 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Administrator Verified</span>
                  </div>
                  <p className="leading-relaxed">
                    This advertisement was created and vetted by Adilabad App administration for authenticity.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RELATED ADVERTISEMENTS */}
          {ad.related && ad.related.length > 0 && (
            <div className="mt-16 pt-12 border-t border-slate-200">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
                    More in {ad.category_name}
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                    Related Advertisements
                  </h2>
                </div>
                <Link
                  href={`/categories/${ad.category_slug}`}
                  className="text-sm font-bold text-brand-600 hover:text-brand-700 transition"
                >
                  View All &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {ad.related.map((rel) => (
                  <AdvertisementCard key={rel.id} ad={rel} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* LIGHTBOX MODAL */}
      <AnimatePresence>
        {lightboxOpen && (
          <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/20 hover:bg-white text-black transition"
            >
              <X className="w-6 h-6" />
            </button>

            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white text-black transition"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white text-black transition"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            <img
              src={activeImage.image_url}
              alt={ad.title}
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
            />
          </div>
        )}
      </AnimatePresence>

      {/* SHARE MODAL */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        title={ad.title}
        slug={ad.slug}
        id={ad.id}
        type="advertisement"
      />

      {/* REPORT MODAL */}
      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        advertisementId={ad.id}
        advertisementTitle={ad.title}
      />
    </>
  );
}

AdvertisementDetailPage.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};

export async function getServerSideProps({ params }) {
  try {
    const res = await apiFetch(`/advertisements/detail/${params.slug}`);
    return {
      props: {
        ad: res.data || null
      }
    };
  } catch (error) {
    console.error('AdvertisementDetailPage getServerSideProps error:', error.message);
    return {
      props: {
        ad: null
      }
    };
  }
}
