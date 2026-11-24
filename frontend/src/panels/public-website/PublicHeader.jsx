import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  MapPin,
  Globe,
  Sparkles,
  Layers,
  Store,
  Tag,
  Calendar,
  Briefcase,
  Wrench,
  ShoppingBag,
  ChevronDown,
  User,
  ShieldCheck,
  Building,
  Menu,
  X,
  Bookmark,
  ExternalLink,
  ChevronRight,
  LogOut,
  Phone
} from 'lucide-react';
import { useLanguage } from '../../shared/contexts/LanguageContext';
import { useAuth } from '../../context/AuthContext';

export default function PublicHeader({ selectedLocation: propLocation = 'Adilabad', onSelectLocation }) {
  const router = useRouter();
  const { t, currentLanguage, changeLanguage, supportedLanguages } = useLanguage();
  const { user, isAuthenticated, logout, favorites = [] } = useAuth();

  const [currentLoc, setCurrentLoc] = useState(propLocation);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');

  // Sync prop changes
  useEffect(() => {
    if (propLocation) setCurrentLoc(propLocation);
  }, [propLocation]);

  // Read saved location on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('adilabad_selected_location');
      if (saved) setCurrentLoc(saved);
    }
  }, []);

  // Close menus on route navigation
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsLocationModalOpen(false);
    setIsLangOpen(false);
    setIsMoreOpen(false);
  }, [router.asPath]);

  // Lock body scroll when mobile menu or modal is open
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (isMobileMenuOpen || isLocationModalOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
      }
    };
  }, [isMobileMenuOpen, isLocationModalOpen]);

  const LOCATIONS = [
    'Adilabad Town',
    'Collectorate Area',
    'Cinema Road',
    'Subhash Nagar',
    'Shivaji Chowk',
    'Gandhi Chowk',
    'Dwaraka Nagar',
    'Teachers Colony',
    'Mavala',
    'Utnoor',
    'Boath',
    'Echoda',
    'Bela',
    'Indervelly',
    'Jainath',
    'Gudihathnoor',
    'Bazarhathnoor',
    'Narnoor',
    'Talamadugu'
  ];

  const handleSelectLoc = (loc) => {
    setCurrentLoc(loc);
    if (typeof window !== 'undefined') {
      localStorage.setItem('adilabad_selected_location', loc);
    }
    if (onSelectLocation) onSelectLocation(loc);
    setIsLocationModalOpen(false);
  };

  const PRIMARY_NAV = [
    { name: t('nav.home') || 'Home', href: '/' },
    { name: t('nav.advertisements') || 'Advertisements', href: '/advertisements' },
    { name: t('nav.businesses') || 'Businesses', href: '/businesses' },
    { name: t('nav.rentals') || 'Rent Items', href: '/rentals', highlight: true },
    { name: t('nav.buySell') || 'Buy & Sell', href: '/buy-sell' },
    { name: t('nav.services') || 'Services', href: '/services' },
    { name: t('nav.jobs') || 'Jobs', href: '/jobs' },
    { name: t('nav.events') || 'Events', href: '/events' },
    { name: t('nav.offers') || 'Offers', href: '/offers' }
  ];

  const MORE_NAV = [
    { name: t('nav.food') || 'Food & Dining', href: '/food', icon: Store },
    { name: t('nav.properties') || 'Properties', href: '/properties', icon: Building },
    { name: t('nav.explore') || 'Explore Tourism', href: '/explore', icon: MapPin },
    { name: t('nav.agriculture') || 'Agriculture Hub', href: '/agriculture', icon: Layers },
    { name: t('nav.weddings') || 'Wedding Services', href: '/weddings', icon: Tag },
    { name: t('nav.live') || 'Live Notices', href: '/live', icon: Sparkles }
  ];

  const filteredLocations = LOCATIONS.filter((l) =>
    l.toLowerCase().includes(locationSearch.toLowerCase().trim())
  );

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 transition-colors shadow-xs">
        {/* 1. TOP UTILITY BAR (Desktop & Tablet only) */}
        <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 hidden md:block">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <span className="flex items-center text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block mr-1.5 ml-1.5" />
                Adilabad Super App 2.0 Live
              </span>
              <span className="text-slate-600">|</span>
              <button
                onClick={() => setIsLocationModalOpen(true)}
                className="flex items-center hover:text-white transition-colors cursor-pointer group"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-400 mr-1 ml-1 group-hover:scale-110 transition-transform" />
                <span>Location: <strong className="text-white underline decoration-amber-400/60 underline-offset-2">{currentLoc}</strong></span>
                <ChevronDown className="w-3 h-3 ml-1 text-slate-400" />
              </button>
            </div>

            <div className="flex items-center space-x-5 rtl:space-x-reverse">
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className="flex items-center space-x-1.5 hover:text-white transition-colors font-medium cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{supportedLanguages.find(l => l.code === currentLanguage)?.nativeLabel || 'English'}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                <AnimatePresence>
                  {isLangOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute right-0 mt-2 w-36 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-100 py-1.5 z-50"
                    >
                      {supportedLanguages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            changeLanguage(lang.code);
                            setIsLangOpen(false);
                          }}
                          className={`w-full text-left px-3.5 py-1.5 text-xs font-medium hover:bg-emerald-50 hover:text-emerald-700 transition-colors flex items-center justify-between ${
                            currentLanguage === lang.code ? 'bg-emerald-50 text-emerald-700 font-bold' : ''
                          }`}
                        >
                          <span>{lang.nativeLabel}</span>
                          <span className="text-[10px] text-slate-400 uppercase">{lang.code}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Quick Portal Switch links */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <Link href="/customer/dashboard" className="hover:text-amber-300 transition-colors">
                    Customer Hub
                  </Link>
                  <Link href="/owner/dashboard" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">
                    Owner Portal
                  </Link>
                  {user?.role === 'admin' && (
                    <Link href="/admin" className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors">
                      Admin Center
                    </Link>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <Link href="/login" className="hover:text-white font-medium transition-colors">
                    Sign In
                  </Link>
                  <span className="text-slate-600">|</span>
                  <Link href="/owner/login" className="text-amber-300 hover:text-amber-200 font-semibold transition-colors">
                    Owner Portal
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 2. MAIN HEADER BAR (Mobile Adaptive & Full Desktop) */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
            
            {/* Logo & City Selector Branding */}
            <div className="flex items-center space-x-2 shrink-0">
              <Link href="/" className="flex items-center space-x-2 group">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-800 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-900/20 group-hover:scale-105 transition-transform shrink-0">
                  <span className="font-extrabold text-base sm:text-lg tracking-wider">A</span>
                </div>
                <div className="flex flex-col justify-center">
                  <div className="flex items-center space-x-1">
                    <span className="font-black text-lg sm:text-xl tracking-tight text-slate-900 group-hover:text-emerald-800 transition-colors leading-tight">
                      Adilabad<span className="text-amber-500">App</span>
                    </span>
                    <span className="hidden sm:inline-block bg-emerald-100 text-emerald-800 text-[9px] sm:text-[10px] font-bold px-1.5 py-0.2 rounded-full shrink-0">
                      SUPER
                    </span>
                  </div>
                  {/* Mobile Tap-to-Change Location Subtitle (Zomato / Swiggy style) */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsLocationModalOpen(true);
                    }}
                    className="flex lg:hidden items-center text-[11px] font-semibold text-slate-600 hover:text-emerald-700 transition mt-0.5 leading-none"
                    title="Change Location"
                  >
                    <MapPin className="w-3 h-3 text-amber-500 mr-0.5 shrink-0" />
                    <span className="truncate max-w-[125px]">{currentLoc}</span>
                    <ChevronDown className="w-3 h-3 ml-0.5 text-slate-400 shrink-0" />
                  </button>
                  <p className="text-[10px] text-slate-500 font-medium tracking-wide hidden lg:block truncate leading-none mt-1">
                    Your City • Your Marketplace
                  </p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1 rtl:space-x-reverse">
              {PRIMARY_NAV.map((item) => {
                const active = router.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                      active
                        ? 'bg-emerald-50 text-emerald-800'
                        : item.highlight
                        ? 'text-amber-600 hover:bg-amber-50 font-bold'
                        : 'text-slate-700 hover:text-emerald-800 hover:bg-slate-50'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}

              {/* Desktop More Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsMoreOpen(!isMoreOpen)}
                  className="flex items-center space-x-1 px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-emerald-800 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <span>More</span>
                  <ChevronDown className="w-4 h-4 ml-0.5" />
                </button>

                <AnimatePresence>
                  {isMoreOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50 grid gap-1"
                    >
                      {MORE_NAV.map((sub) => {
                        const Icon = sub.icon;
                        return (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            onClick={() => setIsMoreOpen(false)}
                            className="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
                          >
                            <Icon className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>{sub.name}</span>
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            {/* Action CTAs */}
            <div className="flex items-center space-x-1.5 sm:space-x-2 rtl:space-x-reverse shrink-0">
              {/* Universal Search (Desktop) */}
              <Link
                href="/search"
                aria-label="Universal Search"
                className="p-2 text-slate-600 hover:text-emerald-800 hover:bg-slate-100 rounded-xl transition-colors hidden sm:flex"
              >
                <Search className="w-5 h-5" />
              </Link>

              {/* Favorites (Desktop) */}
              <Link
                href="/favorites"
                aria-label="View Saved Favorites"
                className="relative p-2 text-slate-600 hover:text-emerald-800 hover:bg-slate-100 rounded-xl transition-colors hidden sm:flex"
              >
                <Bookmark className="w-5 h-5" />
                {favorites && favorites.length > 0 && (
                  <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center shadow">
                    {favorites.length}
                  </span>
                )}
              </Link>

              {/* Authentication Button */}
              {isAuthenticated ? (
                <Link
                  href="/customer/dashboard"
                  className="flex items-center space-x-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl font-bold text-xs sm:text-sm hover:bg-emerald-100 transition-colors"
                >
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="truncate max-w-[80px] sm:max-w-none">{user?.name?.split(' ')[0] || 'Account'}</span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl shadow-xs transition-all shrink-0"
                >
                  Sign In
                </Link>
              )}

              {/* Mobile Hamburger Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle Mobile Menu"
                className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition active:scale-95 shrink-0"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5 text-slate-900" /> : <Menu className="w-5 h-5 text-slate-900" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 3. MOBILE APP SLIDE-OVER DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            {/* Slide-in Content Panel */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="relative w-[85vw] max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto"
            >
              {/* Drawer Header */}
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-800 to-emerald-600 flex items-center justify-center text-white font-extrabold text-sm shadow">
                    A
                  </div>
                  <div>
                    <span className="font-black text-base text-slate-900">
                      Adilabad<span className="text-amber-500">App</span>
                    </span>
                    <p className="text-[10px] text-slate-500">Quick Portal & City Navigation</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-xl bg-slate-200/80 hover:bg-slate-300 flex items-center justify-center text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Scrollable Body */}
              <div className="flex-1 p-4 space-y-5 overflow-y-auto">
                
                {/* Location & Language Bar */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsLocationModalOpen(true);
                    }}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold text-left transition"
                  >
                    <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="truncate flex-1">{currentLoc}</span>
                  </button>

                  <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
                    {supportedLanguages.slice(0, 3).map((l) => (
                      <button
                        key={l.code}
                        onClick={() => changeLanguage(l.code)}
                        className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase transition ${
                          currentLanguage === l.code
                            ? 'bg-emerald-800 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {l.code}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Portals Fast Access Cards */}
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 block px-1">
                    Direct Portal Access
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/owner/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 hover:bg-amber-100 transition block space-y-1"
                    >
                      <Store className="w-4 h-4 text-amber-600" />
                      <div className="font-bold text-xs">Owner Portal</div>
                      <div className="text-[10px] text-amber-700">Manage Listings & Rentals</div>
                    </Link>

                    <Link
                      href="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-3 rounded-2xl bg-brand-50 border border-brand-200 text-brand-900 hover:bg-brand-100 transition block space-y-1"
                    >
                      <ShieldCheck className="w-4 h-4 text-brand-600" />
                      <div className="font-bold text-xs">Admin Center</div>
                      <div className="text-[10px] text-brand-700">Moderation & Command</div>
                    </Link>

                    <Link
                      href="/customer/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 hover:bg-emerald-100 transition block space-y-1"
                    >
                      <User className="w-4 h-4 text-emerald-600" />
                      <div className="font-bold text-xs">Customer Hub</div>
                      <div className="text-[10px] text-emerald-700">Profile & Requests</div>
                    </Link>

                    <Link
                      href="/staff/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-3 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 hover:bg-blue-100 transition block space-y-1"
                    >
                      <Briefcase className="w-4 h-4 text-blue-600" />
                      <div className="font-bold text-xs">Staff Workspace</div>
                      <div className="text-[10px] text-blue-700">Assigned Tasks</div>
                    </Link>
                  </div>
                </div>

                {/* Primary Navigation Modules */}
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 block px-1">
                    Marketplace Categories
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {PRIMARY_NAV.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`p-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                          item.highlight
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : router.pathname === item.href
                            ? 'bg-emerald-800 text-white shadow-xs'
                            : 'bg-slate-50 text-slate-800 hover:bg-slate-100 border border-slate-200/60'
                        }`}
                      >
                        <span className="truncate">{item.name}</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-60 shrink-0" />
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Explore Niches */}
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 block px-1">
                    Adilabad Life & Niches
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {MORE_NAV.map((sub) => {
                      const Icon = sub.icon;
                      return (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-2 p-2 rounded-xl text-xs font-medium text-slate-700 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-800 transition"
                        >
                          <Icon className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{sub.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Drawer Footer Actions */}
              <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-2">
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out ({user?.name?.split(' ')[0]})</span>
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="py-2.5 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs text-center transition shadow-xs"
                    >
                      Resident Sign In
                    </Link>
                    <Link
                      href="/owner/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs text-center transition shadow-xs"
                    >
                      Store Sign In
                    </Link>
                  </div>
                )}
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* 4. LOCALITY & MANDAL SELECTOR MODAL */}
      <AnimatePresence>
        {isLocationModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-t-3xl sm:rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-black text-base text-slate-900">Select Location in Adilabad</h3>
                    <p className="text-[11px] text-slate-500">Filter advertisements and services near you</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsLocationModalOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search Locality Input */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  placeholder="Search Mandal, Area or Landmark..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              {/* Location List */}
              <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
                {filteredLocations.map((loc) => {
                  const isSelected = currentLoc === loc;
                  return (
                    <button
                      key={loc}
                      onClick={() => handleSelectLoc(loc)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
                        isSelected
                          ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-600' : 'text-slate-400'}`} />
                        <span>{loc}</span>
                      </span>
                      {isSelected && (
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          Active
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Quick Reset to All Adilabad */}
              <button
                onClick={() => handleSelectLoc('Adilabad')}
                className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition"
              >
                Reset to All Adilabad District
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
