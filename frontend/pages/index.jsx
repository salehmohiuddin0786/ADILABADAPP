import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  MapPin,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  PhoneCall,
  Clock,
  Compass,
  Store,
  Calendar,
  Layers,
  ChevronRight,
  ChevronDown,
  Tag,
  Star,
  MessageCircle,
  Home,
  Car,
  Utensils,
  Briefcase,
  Zap,
  Phone
} from 'lucide-react';
import MainLayout from '../src/components/layout/MainLayout';
import AdvertisementCard from '../src/components/cards/AdvertisementCard';
import BusinessCard from '../src/components/cards/BusinessCard';
import EventCard from '../src/components/cards/EventCard';
import CategoryCard from '../src/components/cards/CategoryCard';
import { apiFetch } from '../src/utils/api';
import {
  MOCK_CATEGORIES,
  MOCK_ADVERTISEMENTS,
  MOCK_BUSINESSES,
  MOCK_EVENTS,
  MOCK_BANNERS,
  MOCK_LOCATIONS
} from '../src/data/mockData';

const ROTATING_HIGHLIGHTS = [
  'Best Deals & Discounts',
  'Verified Local Showrooms',
  'Rental & Commercial Property',
  'Exciting Fairs & Cultural Events',
  'Trusted Healthcare & Doctors',
  'Top Local Career Openings'
];

const SEARCH_TABS = [
  { id: 'all', label: 'All Discovery', icon: Sparkles, route: '/search', placeholder: 'Search ads, businesses, offers, events in Adilabad...' },
  { id: 'advertisements', label: 'Advertisements', icon: Tag, route: '/advertisements', placeholder: 'Search electronics, sarees, properties, cars...' },
  { id: 'businesses', label: 'Verified Businesses', icon: Store, route: '/businesses', placeholder: 'Find showrooms, restaurants, doctors, clinics...' },
  { id: 'events', label: 'Events & Expos', icon: Calendar, route: '/events', placeholder: 'Search upcoming fairs, festivals, shopping melas...' }
];

export default function HomePage({
  categories = [],
  featuredAds = [],
  latestAds = [],
  businesses = [],
  events = [],
  banners = [],
  locations = []
}) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  const [highlightIndex, setHighlightIndex] = useState(0);

  // Dynamic rotating highlight keywords
  useEffect(() => {
    const interval = setInterval(() => {
      setHighlightIndex((prev) => (prev + 1) % ROTATING_HIGHLIGHTS.length);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  const activeTabConfig = SEARCH_TABS.find(t => t.id === activeTab) || SEARCH_TABS[0];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (searchTerm.trim()) queryParams.set('q', searchTerm.trim());
    if (selectedLocation && selectedLocation !== 'all') queryParams.set('location', selectedLocation);
    
    const targetRoute = activeTabConfig.route;
    const queryStr = queryParams.toString();
    router.push(queryStr ? `${targetRoute}?${queryStr}` : targetRoute);
  };

  const heroBanner = banners[0] || {
    title: "Discover What's Happening in Adilabad",
    subtitle: "Find local businesses, advertisements, offers, events, jobs and more — all in one place."
  };

  // Top spotlight items from props for the floating preview showcase
  const spotlightAd = featuredAds[0] || latestAds[0] || {
    title: 'Shree Balaji Mega Electronics Festival Sale',
    slug: 'shree-balaji-mega-festival-electronics-sale',
    category_name: 'Electronics',
    location_name: 'Cinema Road',
    price: 34999,
    images: [{ image_url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80' }]
  };

  const spotlightBusiness = businesses[0] || {
    name: 'Swagath Grand Family Restaurant',
    slug: 'swagath-grand-family-restaurant',
    category_name: 'Food & Restaurants',
    location_name: 'Dwaraka Nagar',
    rating: 4.8,
    phone: '+91 98480 12345',
    whatsapp: '+91 98480 12345'
  };

  const spotlightEvent = events[0] || {
    title: 'Adilabad Mega Consumer Fair 2026',
    slug: 'adilabad-mega-consumer-fair-food-festival-2026',
    event_date: 'Oct 15 - Oct 20, 2026',
    venue: 'Gandhi Maidan'
  };

  return (
    <>
      <Head>
        <title>Adilabad App — Discover Adilabad. Discover Local.</title>
        <meta
          name="description"
          content="Adilabad's #1 local advertising and discovery platform. Explore verified advertisements, local businesses, events, properties, vehicles and jobs in Adilabad, Telangana."
        />
        <meta property="og:title" content="Adilabad App — Discover Adilabad. Discover Local." />
        <meta
          property="og:description"
          content="Find verified local advertisements, businesses, offers, events, and jobs in Adilabad, Telangana."
        />
        <meta property="og:type" content="website" />
      </Head>

      {/* 1. UPGRADED DYNAMIC HERO SECTION WITH INTERACTIVE TABS, ROTATING HIGHLIGHTS & FLOATING PREVIEWS */}
      <section className="relative overflow-hidden haikei-hero-bg text-white pt-10 pb-20 sm:pt-16 sm:pb-28 lg:pt-20 lg:pb-32">
        {/* Ambient Glowing Light Orbs */}
        <div className="absolute top-1/4 left-10 w-80 h-80 bg-brand-500/25 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
        <div className="absolute -top-20 right-1/4 w-72 h-72 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            
            {/* LEFT COLUMN: HERO HEADLINE & SMART DUAL-SEARCH INTERFACE */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Live Status Badge */}
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/60 border border-brand-400/30 text-brand-300 text-xs sm:text-sm font-semibold backdrop-blur-md shadow-inner"
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span>Live in Adilabad, Telangana</span>
                <span className="text-slate-500">•</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  100% Admin Verified
                </span>
              </motion.div>

              {/* Dynamic Main Headline */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="space-y-2"
              >
                <h1 className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-black tracking-tight leading-[1.12]">
                  Discover What’s Happening in{' '}
                  <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-sky-300 to-emerald-300">
                    Adilabad
                  </span>
                </h1>

                {/* Animated Rotating Highlight Flipper */}
                <div className="flex items-center gap-2 pt-1 text-sm sm:text-lg text-slate-300 font-medium">
                  <span className="text-slate-400 shrink-0">Explore top</span>
                  <div className="relative h-8 overflow-hidden flex items-center">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={ROTATING_HIGHLIGHTS[highlightIndex]}
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -18 }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                        className="inline-block px-3 py-0.5 rounded-lg bg-brand-500/25 border border-brand-400/40 text-brand-200 font-bold text-sm sm:text-base shadow-sm"
                      >
                        {ROTATING_HIGHLIGHTS[highlightIndex]}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>

              {/* Subtitle description */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.2 }}
                className="text-slate-300 text-sm sm:text-base max-w-xl font-normal leading-relaxed"
              >
                Adilabad's premier local marketplace. Browse verified ads, connect with trusted shops and restaurants, discover community events, and access direct WhatsApp & call support.
              </motion.p>

              {/* Interactive Search Container */}
              <motion.div
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="pt-2 space-y-3"
              >
                {/* Search Mode Pill Tabs */}
                <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900/70 border border-white/10 backdrop-blur-xl overflow-x-auto no-scrollbar scrollbar-none max-w-full">
                  {SEARCH_TABS.map((tab) => {
                    const TabIcon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                          isActive
                            ? 'text-white shadow-md'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                        }`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeHeroTab"
                            className="absolute inset-0 bg-brand-600 rounded-xl"
                            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                          />
                        )}
                        <span className="relative z-10 flex items-center gap-1.5">
                          <TabIcon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                          {tab.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Smart Dual-Input Search Bar (Locality Selector + Keyword Input) */}
                <form
                  onSubmit={handleSearchSubmit}
                  className="bg-white/95 rounded-2xl p-2 shadow-2xl border border-white/30 backdrop-blur-md text-slate-900"
                >
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    
                    {/* Adilabad Locality Dropdown Selector */}
                    <div className="relative flex items-center sm:w-48 shrink-0 px-3 py-2 bg-slate-100/90 rounded-xl border border-slate-200/80 focus-within:border-brand-500 transition">
                      <MapPin className="w-4 h-4 text-brand-600 shrink-0 mr-2" />
                      <select
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-800 focus:outline-none cursor-pointer appearance-none pr-4"
                      >
                        <option value="all">All Adilabad</option>
                        {locations && locations.length > 0 ? (
                          locations.map((loc) => (
                            <option key={loc.id} value={loc.name}>
                              {loc.name}
                            </option>
                          ))
                        ) : (
                          <>
                            <option value="Cinema Road">Cinema Road</option>
                            <option value="Shivaji Chowk">Shivaji Chowk</option>
                            <option value="Dwaraka Nagar">Dwaraka Nagar</option>
                            <option value="Teachers Colony">Teachers Colony</option>
                            <option value="Gandhi Chowk">Gandhi Chowk</option>
                            <option value="Mavala">Mavala</option>
                            <option value="Collectorate Area">Collectorate Area</option>
                            <option value="Bus Stand Road">Bus Stand Road</option>
                            <option value="IB Chowk">IB Chowk</option>
                          </>
                        )}
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 pointer-events-none" />
                    </div>

                    {/* Search Input */}
                    <div className="relative flex-1 flex items-center px-3 py-1">
                      <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0 hidden sm:block" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={activeTabConfig.placeholder}
                        className="w-full py-1 text-slate-900 placeholder-slate-400 text-xs sm:text-sm font-medium focus:outline-none bg-transparent"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 text-white text-xs sm:text-sm font-bold shadow-lg shadow-brand-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
                    >
                      <Search className="w-4 h-4" />
                      <span>Search</span>
                    </button>
                  </div>
                </form>

                {/* Popular Search Tags with Icons */}
                <div className="pt-1 flex flex-wrap items-center gap-1.5 text-xs text-slate-300">
                  <span className="font-semibold text-slate-400 mr-1 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-brand-400" />
                    Trending:
                  </span>
                  <Link
                    href="/search?q=Electronics"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-slate-200 transition"
                  >
                    <Zap className="w-3 h-3 text-amber-400" />
                    <span>Electronics Sale</span>
                  </Link>
                  <Link
                    href="/search?q=Property"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-slate-200 transition"
                  >
                    <Home className="w-3 h-3 text-sky-400" />
                    <span>Houses & Land</span>
                  </Link>
                  <Link
                    href="/search?q=Restaurant"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-slate-200 transition"
                  >
                    <Utensils className="w-3 h-3 text-emerald-400" />
                    <span>Family Dining</span>
                  </Link>
                  <Link
                    href="/search?q=Vehicles"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-slate-200 transition"
                  >
                    <Car className="w-3 h-3 text-purple-400" />
                    <span>Cars & Bikes</span>
                  </Link>
                  <Link
                    href="/search?q=Jobs"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-slate-200 transition"
                  >
                    <Briefcase className="w-3 h-3 text-rose-400" />
                    <span>Adilabad Jobs</span>
                  </Link>
                </div>
              </motion.div>

              {/* Live Trust Metrics Bar */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left border-t border-white/10"
              >
                <div>
                  <div className="text-lg sm:text-xl font-black text-white">500+</div>
                  <div className="text-[11px] sm:text-xs text-slate-400">Verified Ads</div>
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-black text-emerald-400">100+</div>
                  <div className="text-[11px] sm:text-xs text-slate-400">Verified Shops</div>
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-black text-sky-400">14</div>
                  <div className="text-[11px] sm:text-xs text-slate-400">Localities Covered</div>
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-black text-amber-400">0% Spam</div>
                  <div className="text-[11px] sm:text-xs text-slate-400">Admin Curated</div>
                </div>
              </motion.div>

            </div>

            {/* RIGHT COLUMN: FLOATING INTERACTIVE ADILABAD HIGHLIGHTS SHOWCASE */}
            <div className="lg:col-span-5 relative hidden lg:block">
              
              {/* Floating Orbit Badge 1 (Top Left) */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-4 -left-6 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full glass-pill text-xs font-bold text-white shadow-xl"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <MapPin className="w-3.5 h-3.5 text-brand-300" />
                <span>Cinema Road Active</span>
              </motion.div>

              {/* Floating Orbit Badge 2 (Bottom Right) */}
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -bottom-5 right-2 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full glass-pill text-xs font-bold text-emerald-300 shadow-xl"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Admin Verified Only</span>
              </motion.div>

              {/* Main Floating Glass Showcase Deck */}
              <div className="relative space-y-4">
                
                {/* 1. Spotlight Featured Ad Card */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="glass-panel rounded-3xl p-4 shadow-2xl transition hover:border-brand-400/50"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-500/30 text-brand-300 font-bold border border-brand-400/30">
                      <Sparkles className="w-3 h-3 text-brand-300" />
                      Featured Deal
                    </span>
                    <span className="text-slate-300 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {spotlightAd.location_name || 'Adilabad'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3.5 mt-3">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-800 shrink-0 border border-white/15 relative">
                      <img
                        src={spotlightAd.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=400&q=80'}
                        alt={spotlightAd.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-white truncate">
                        {spotlightAd.title}
                      </h4>
                      <p className="text-xs text-brand-300 font-medium mt-0.5">
                        {spotlightAd.category_name || 'Electronics'}
                      </p>
                      {spotlightAd.price && (
                        <div className="text-base font-black text-emerald-400 mt-1">
                          ₹{Number(spotlightAd.price).toLocaleString('en-IN')}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 flex items-center justify-between">
                    <Link
                      href={`/advertisements/${spotlightAd.slug}`}
                      className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition shadow"
                    >
                      <span>View Deal Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>

                {/* 2. Spotlight Verified Business Card */}
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  className="glass-panel rounded-3xl p-4 shadow-2xl ml-4 transition hover:border-emerald-400/50"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 font-black">
                        <Store className="w-5 h-5" />
                      </div>
                      <div>
                        <h5 className="font-bold text-white text-xs truncate max-w-[160px]">
                          {spotlightBusiness.name}
                        </h5>
                        <p className="text-[11px] text-slate-300 flex items-center gap-1">
                          <MapPin className="w-2.5 h-2.5 text-slate-400" />
                          {spotlightBusiness.location_name || 'Dwaraka Nagar'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-amber-400/20 px-2 py-0.5 rounded-lg border border-amber-400/30 text-amber-300 text-xs font-bold">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{spotlightBusiness.rating || '4.8'}</span>
                    </div>
                  </div>

                  {/* Quick Connect Actions */}
                  <div className="mt-3 pt-2 border-t border-white/10 flex items-center gap-2">
                    <a
                      href={`tel:${spotlightBusiness.phone || '+919440123456'}`}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition"
                    >
                      <Phone className="w-3 h-3 text-sky-400" />
                      <span>Call</span>
                    </a>
                    <a
                      href={`https://wa.me/${(spotlightBusiness.whatsapp || '919440123456').replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-xl bg-emerald-600/80 hover:bg-emerald-600 text-white text-xs font-semibold transition"
                    >
                      <MessageCircle className="w-3 h-3 text-white" />
                      <span>WhatsApp</span>
                    </a>
                    <Link
                      href={`/businesses/${spotlightBusiness.slug}`}
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold transition"
                    >
                      Profile
                    </Link>
                  </div>
                </motion.div>

                {/* 3. Upcoming Event Ticker Card */}
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="glass-panel rounded-2xl px-4 py-2.5 shadow-xl flex items-center justify-between text-xs mr-4"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-white truncate max-w-[180px]">
                        {spotlightEvent.title}
                      </div>
                      <div className="text-[11px] text-slate-300">
                        {spotlightEvent.event_date || 'Upcoming Fair'} • {spotlightEvent.venue || 'Adilabad'}
                      </div>
                    </div>
                  </div>
                  <Link
                    href={`/events/${spotlightEvent.slug}`}
                    className="text-brand-300 hover:text-white font-bold flex items-center gap-1 text-[11px]"
                  >
                    Details <ChevronRight className="w-3 h-3" />
                  </Link>
                </motion.div>

              </div>
            </div>

          </div>
        </div>

        {/* Decorative Wave Transition */}
        <div className="absolute bottom-0 inset-x-0 h-8 sm:h-12 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>


      {/* 2. VALUE PROPOSITION STRIP */}
      <section className="bg-white border-b border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <ShieldCheck className="w-6 h-6 text-emerald-600 mb-1" />
              <p className="text-xs sm:text-sm font-bold text-slate-900">100% Admin Verified</p>
              <p className="text-[11px] text-slate-600">Zero spam, verified listings</p>
            </div>
            <div className="flex flex-col items-center">
              <PhoneCall className="w-6 h-6 text-brand-600 mb-1" />
              <p className="text-xs sm:text-sm font-bold text-slate-900">Direct Contact</p>
              <p className="text-[11px] text-slate-600">Call & WhatsApp directly</p>
            </div>
            <div className="flex flex-col items-center">
              <MapPin className="w-6 h-6 text-amber-600 mb-1" />
              <p className="text-xs sm:text-sm font-bold text-slate-900">Adilabad Centric</p>
              <p className="text-[11px] text-slate-600">Every locality covered</p>
            </div>
            <div className="flex flex-col items-center">
              <Clock className="w-6 h-6 text-purple-600 mb-1" />
              <p className="text-xs sm:text-sm font-bold text-slate-900">Updated Daily</p>
              <p className="text-[11px] text-slate-600">Fresh deals & events</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATEGORIES SECTION */}
      <section className="py-14 sm:py-18 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
                Browse By Industry
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                Explore Popular Categories
              </h2>
            </div>
            <Link
              href="/categories"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:text-brand-700 transition"
            >
              <span>View All Categories</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {categories.slice(0, 8).map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURED ADVERTISEMENTS */}
      <section className="py-14 sm:py-18 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-current" />
                <span>Handpicked & Verified</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Featured Advertisements
              </h2>
            </div>
            <Link
              href="/advertisements?featured=true"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:text-brand-700 transition"
            >
              <span>View All Featured</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredAds.slice(0, 6).map((ad) => (
              <AdvertisementCard key={ad.id} ad={ad} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. PROMOTIONAL HIGHLIGHT BANNER (HAIKEI STYLED) */}
      <section className="py-12 bg-slate-900 text-white relative overflow-hidden haikei-blob-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-gradient-to-r from-brand-900/90 to-slate-900/90 rounded-3xl p-8 sm:p-12 border border-brand-500/20 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-xl space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-widest text-brand-400">
                Local Business Spotlight
              </span>
              <h3 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                Looking for Top Commercial Showrooms or Independent Homes in Adilabad?
              </h3>
              <p className="text-sm sm:text-base text-slate-300">
                Explore prime spaces along Cinema Road, Teachers Colony, and Dwaraka Nagar verified by our local team.
              </p>
            </div>
            <Link
              href="/categories/property"
              className="px-6 py-3.5 rounded-2xl bg-white text-slate-900 hover:bg-brand-50 text-sm sm:text-base font-bold shadow-xl transition shrink-0"
            >
              Explore Property Listings &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* 6. LATEST ADVERTISEMENTS */}
      <section className="py-14 sm:py-18 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
                Just Published
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                Latest Advertisements in Adilabad
              </h2>
            </div>
            <Link
              href="/advertisements"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:text-brand-700 transition"
            >
              <span>View All Advertisements</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestAds.slice(0, 6).map((ad) => (
              <AdvertisementCard key={ad.id} ad={ad} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. POPULAR LOCAL BUSINESSES */}
      <section className="py-14 sm:py-18 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
                Local Directory
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                Popular Businesses & Services
              </h2>
            </div>
            <Link
              href="/businesses"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:text-brand-700 transition"
            >
              <span>View Business Directory</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {businesses.slice(0, 4).map((biz) => (
              <BusinessCard key={biz.id} business={biz} />
            ))}
          </div>
        </div>
      </section>

      {/* 8. UPCOMING EVENTS IN ADILABAD */}
      <section className="py-14 sm:py-18 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
                Local Happenings
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                Upcoming Local Events
              </h2>
            </div>
            <Link
              href="/events"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:text-brand-700 transition"
            >
              <span>View All Events</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.slice(0, 3).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* 9. EXPLORE ADILABAD (LOCAL DISCOVERY SECTION) */}
      <section className="py-16 sm:py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
              Local Guide
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1 mb-3">
              Explore Adilabad: Sights & Culture
            </h2>
            <p className="text-sm sm:text-base text-slate-500">
              Famous attractions, waterfalls, temples, and historical landmarks around Adilabad district.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Kuntala Waterfalls */}
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3] group shadow-md">
              <img
                src="https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=800&q=80"
                alt="Kuntala Waterfalls Adilabad"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent p-6 flex flex-col justify-end text-white">
                <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">Natural Wonder</span>
                <h4 className="text-xl font-bold">Kuntala Waterfalls</h4>
                <p className="text-xs text-slate-300 mt-1">Telangana’s highest natural cascading waterfall located near Neredigonda.</p>
              </div>
            </div>

            {/* Pochera Waterfalls */}
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3] group shadow-md">
              <img
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
                alt="Pochera Falls"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent p-6 flex flex-col justify-end text-white">
                <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">Scenic Destination</span>
                <h4 className="text-xl font-bold">Pochera Waterfalls</h4>
                <p className="text-xs text-slate-300 mt-1">Stunning rocky plateau plunge waterfall fed by the Kadam river.</p>
              </div>
            </div>

            {/* Kawal Tiger Reserve & Jainath */}
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3] group shadow-md">
              <img
                src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=800&q=80"
                alt="Kawal Wildlife & Temples"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent p-6 flex flex-col justify-end text-white">
                <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">Heritage & Wildlife</span>
                <h4 className="text-xl font-bold">Kawal Wildlife & Jainath Temple</h4>
                <p className="text-xs text-slate-300 mt-1">Historical Pallava architecture temple and biodiversity safari sanctuary.</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-50 hover:bg-brand-100 text-brand-700 text-sm font-bold transition"
            >
              <span>Explore Complete Adilabad City Guide</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

HomePage.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};

export async function getServerSideProps() {
  try {
    const [catRes, featRes, latestRes, bizRes, evRes, banRes, locRes] = await Promise.all([
      apiFetch('/categories'),
      apiFetch('/advertisements?featured=true&limit=6'),
      apiFetch('/advertisements?limit=6'),
      apiFetch('/businesses?limit=4'),
      apiFetch('/events?limit=3'),
      apiFetch('/banners'),
      apiFetch('/locations')
    ]);

    return {
      props: {
        categories: catRes.data || [],
        featuredAds: featRes.data || [],
        latestAds: latestRes.data || [],
        businesses: bizRes.data || [],
        events: evRes.data || [],
        banners: banRes.data || [],
        locations: locRes.data || []
      }
    };
  } catch (error) {
    console.warn('HomePage getServerSideProps offline fallback:', error.message);
    return {
      props: {
        categories: MOCK_CATEGORIES,
        featuredAds: MOCK_ADVERTISEMENTS.filter(a => a.is_featured === 1).slice(0, 6),
        latestAds: MOCK_ADVERTISEMENTS.slice(0, 6),
        businesses: MOCK_BUSINESSES.slice(0, 4),
        events: MOCK_EVENTS.slice(0, 3),
        banners: MOCK_BANNERS,
        locations: MOCK_LOCATIONS
      }
    };
  }
}
