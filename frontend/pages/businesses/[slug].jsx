import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  MessageCircle,
  Navigation,
  Globe,
  Mail,
  Star,
  Clock,
  CheckCircle,
  Share2,
  Bookmark,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import MainLayout from '../../src/components/layout/MainLayout';
import AdvertisementCard from '../../src/components/cards/AdvertisementCard';
import ShareModal from '../../src/components/modals/ShareModal';
import { useAuth } from '../../src/context/AuthContext';
import { apiFetch } from '../../src/utils/api';

export default function BusinessDetailPage({ business }) {
  const { isFavorited, toggleFavorite } = useAuth();
  const [shareModalOpen, setShareModalOpen] = useState(false);

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800">Business Not Found</h2>
          <Link href="/businesses" className="inline-block mt-4 text-brand-600 font-bold">
            Back to Business Directory
          </Link>
        </div>
      </div>
    );
  }

  const favorited = isFavorited('business', business.id);

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const mapsQuery = `${business.name}, ${business.address}, Adilabad`;
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`;

  return (
    <>
      <Head>
        <title>{business.name} — Adilabad Business Directory</title>
        <meta name="description" content={business.description?.slice(0, 160)} />
      </Head>

      <div className="bg-slate-50 py-6 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 truncate">
            <Link href="/" className="hover:text-brand-600">Home</Link>
            <span>/</span>
            <Link href="/businesses" className="hover:text-brand-600">Businesses</Link>
            <span>/</span>
            <span className="text-slate-800 font-medium truncate">{business.name}</span>
          </nav>

          {/* Business Hero Banner */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden mb-8">
            <div className="relative aspect-[21/9] sm:aspect-[21/7] bg-slate-900 overflow-hidden">
              <img
                src={business.cover_url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80'}
                alt={business.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            </div>

            <div className="p-6 sm:p-8 -mt-16 sm:-mt-20 relative z-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
              <div className="flex items-end gap-5">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white border-4 border-white shadow-xl overflow-hidden shrink-0">
                  <img
                    src={business.logo_url || 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=300&q=80'}
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="px-3 py-1 rounded-lg bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-wider">
                    {business.category_name}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                    {business.name}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
                    <span>{business.location_name || 'Adilabad Town'}, Adilabad</span>
                  </p>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  onClick={() => toggleFavorite('business', business.id)}
                  className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition flex items-center justify-center gap-2 ${
                    favorited
                      ? 'bg-brand-600 text-white border-brand-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-brand-500'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
                  <span>{favorited ? 'Saved' : 'Save'}</span>
                </button>

                <button
                  onClick={() => setShareModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold border border-slate-200 bg-white text-slate-700 hover:border-brand-500 transition flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* LEFT DETAILS */}
            <div className="lg:col-span-8 space-y-6">
              {/* About Business */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-slate-900">About {business.name}</h2>
                <div className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {business.description}
                </div>
              </div>

              {/* Services Offered */}
              {business.services && business.services.length > 0 && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
                  <h2 className="text-lg font-bold text-slate-900">Key Services & Highlights</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {business.services.map((svc) => (
                      <div key={svc.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{svc.service_name}</h4>
                          {svc.description && (
                            <p className="text-xs text-slate-500 mt-0.5">{svc.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Ads from this business */}
              {business.advertisements && business.advertisements.length > 0 && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
                  <h2 className="text-lg font-bold text-slate-900">Advertisements by this Business</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {business.advertisements.map((ad) => (
                      <AdvertisementCard key={ad.id} ad={ad} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT SIDEBAR: CONTACT & OPENING HOURS */}
            <div className="lg:col-span-4 space-y-6">
              {/* Contact Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-5">
                <h3 className="font-bold text-slate-900 text-base">Contact Information</h3>

                <div className="space-y-3">
                  {business.phone && (
                    <a
                      href={`tel:${business.phone}`}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Call: {business.phone}</span>
                    </a>
                  )}

                  {business.whatsapp && (
                    <a
                      href={`https://wa.me/${business.whatsapp.replace(/[^0-9]/g, '')}?text=Hi,%20I%20saw%20your%20business%20listing%20"${encodeURIComponent(business.name)}"%20on%20Adilabad%20App.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-bold text-sm shadow-md transition"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp Message</span>
                    </a>
                  )}

                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition"
                  >
                    <Navigation className="w-4 h-4 text-brand-600" />
                    <span>Get Directions (Maps)</span>
                  </a>

                  {business.website && (
                    <a
                      href={business.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition"
                    >
                      <Globe className="w-3.5 h-3.5 text-slate-400" />
                      <span>Visit Website</span>
                    </a>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 text-xs text-slate-600 space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                    <span>{business.address}</span>
                  </div>
                </div>
              </div>

              {/* Opening Hours Card */}
              {business.hours && business.hours.length > 0 && (
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
                    <Clock className="w-4 h-4 text-brand-600" />
                    <span>Opening Hours</span>
                  </div>

                  <div className="divide-y divide-slate-100 text-xs">
                    {business.hours.map((h) => (
                      <div key={h.day_of_week} className="py-2 flex items-center justify-between">
                        <span className="font-semibold text-slate-700">{daysOfWeek[h.day_of_week]}</span>
                        <span className={h.is_closed ? 'text-rose-600 font-bold' : 'text-slate-500'}>
                          {h.is_closed ? 'Closed' : `${h.open_time?.slice(0, 5)} - ${h.close_time?.slice(0, 5)}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        title={business.name}
        slug={business.slug}
        id={business.id}
        type="business"
      />

      {/* MOBILE STICKY CONTACT ACTION BAR (PHONE ONLY) */}
      <div className="fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/90 p-3 sm:hidden shadow-[0_-4px_25px_rgba(0,0,0,0.12)] flex items-center gap-2">
        <button
          onClick={() => toggleFavorite('business', business.id)}
          aria-label={favorited ? 'Saved' : 'Save'}
          className={`p-3 rounded-2xl border transition shrink-0 ${
            favorited
              ? 'bg-brand-50 border-brand-300 text-brand-600'
              : 'bg-slate-100 border-slate-200 text-slate-700'
          }`}
        >
          <Bookmark className={`w-5 h-5 ${favorited ? 'fill-current text-brand-600' : ''}`} />
        </button>

        {business.phone && (
          <a
            href={`tel:${business.phone}`}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-2xl bg-emerald-600 text-white font-bold text-sm shadow-md active:scale-95 transition"
          >
            <Phone className="w-4 h-4" />
            <span>Call Now</span>
          </a>
        )}

        {business.whatsapp && (
          <a
            href={`https://wa.me/${business.whatsapp.replace(/[^0-9]/g, '')}?text=Hi,%20I%20found%20your%20business%20"${encodeURIComponent(business.name)}"%20on%20Adilabad%20App.`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-2xl bg-green-600 text-white font-bold text-sm shadow-md active:scale-95 transition"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp</span>
          </a>
        )}
      </div>
    </>
  );
}

BusinessDetailPage.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};

export async function getServerSideProps({ params }) {
  try {
    const res = await apiFetch(`/businesses/detail/${params.slug}`);
    return {
      props: {
        business: res.data || null
      }
    };
  } catch (error) {
    return { props: { business: null } };
  }
}
