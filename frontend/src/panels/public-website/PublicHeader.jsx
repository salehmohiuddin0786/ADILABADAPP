import React, { useState } from 'react';
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
  Percent,
  Briefcase,
  Wrench,
  ShoppingBag,
  MoreHorizontal,
  ChevronDown,
  User,
  ShieldCheck,
  Building,
  Menu,
  X,
  Bookmark
} from 'lucide-react';
import { useLanguage } from '../../shared/contexts/LanguageContext';
import { useAuth } from '../../context/AuthContext';

export default function PublicHeader({ selectedLocation = 'Adilabad', onSelectLocation }) {
  const router = useRouter();
  const { t, currentLanguage, changeLanguage, supportedLanguages, isRTL } = useLanguage();
  const { user, isAuthenticated, logout, favorites = [] } = useAuth();

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const LOCATIONS = [
    'Adilabad Town',
    'Collectorate Area',
    'Cinema Road',
    'Subhash Nagar',
    'Utnoor',
    'Boath',
    'Echoda',
    'Bela',
    'Indervelly'
  ];

  const PRIMARY_NAV = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.advertisements'), href: '/advertisements' },
    { name: t('nav.businesses'), href: '/businesses' },
    { name: t('nav.rentals'), href: '/rentals', highlight: true },
    { name: t('nav.buySell'), href: '/buy-sell' },
    { name: t('nav.services'), href: '/services' },
    { name: t('nav.jobs'), href: '/jobs' },
    { name: t('nav.events'), href: '/events' },
    { name: t('nav.offers'), href: '/offers' }
  ];

  const MORE_NAV = [
    { name: t('nav.food'), href: '/food', icon: Store },
    { name: t('nav.live'), href: '/live', icon: Sparkles },
    { name: t('nav.explore'), href: '/explore', icon: MapPin },
    { name: t('nav.properties'), href: '/properties', icon: Building },
    { name: t('nav.education'), href: '/education', icon: Briefcase },
    { name: t('nav.agriculture'), href: '/agriculture', icon: Layers },
    { name: t('nav.weddings'), href: '/weddings', icon: Tag }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-colors">
      {/* Top Utility Bar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <span className="flex items-center text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block mr-1.5 ml-1.5"></span>
              Adilabad Super App 2.0 Live
            </span>
            <span className="text-slate-400">|</span>
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="flex items-center hover:text-white transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-400 mr-1 ml-1" />
              <span>Location: <strong>{selectedLocation}</strong></span>
              <ChevronDown className="w-3 h-3 ml-1 mr-1" />
            </button>
          </div>

          <div className="flex items-center space-x-5 rtl:space-x-reverse">
            {/* Multilingual Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center space-x-1.5 rtl:space-x-reverse hover:text-white transition-colors font-medium"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>{supportedLanguages.find(l => l.code === currentLanguage)?.nativeLabel || 'English'}</span>
                <ChevronDown className="w-3 h-3" />
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

            {/* Quick Panel Switches for Multi-Role Users */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <Link href="/customer/dashboard" className="hover:text-amber-300 transition-colors">
                  {t('nav.customerPanel')}
                </Link>
                <Link href="/owner/dashboard" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">
                  {t('nav.ownerPanel')}
                </Link>
                {user?.role === 'admin' && (
                  <Link href="/admin" className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors">
                    {t('nav.adminPanel')}
                  </Link>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <Link href="/login" className="hover:text-white font-medium transition-colors">
                  {t('nav.login')}
                </Link>
                <span className="text-emerald-700/60">|</span>
                <Link href="/owner/login" className="text-amber-300 hover:text-amber-200 font-semibold transition-colors">
                  Owner Portal
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Branding */}
          <Link href="/" className="flex items-center space-x-2.5 rtl:space-x-reverse group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-800 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-900/20 group-hover:scale-105 transition-transform">
              <span className="font-extrabold text-lg tracking-wider">A</span>
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <span className="font-black text-xl tracking-tight text-slate-900 group-hover:text-emerald-800 transition-colors">
                  Adilabad<span className="text-amber-500">App</span>
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  SUPER
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium tracking-wide">
                Your City • Your Marketplace
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
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

            {/* More Menu Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                className="flex items-center space-x-1 px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-emerald-800 hover:bg-slate-50 transition-colors"
              >
                <span>{t('nav.more')}</span>
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
                          className="flex items-center space-x-2.5 rtl:space-x-reverse px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
                        >
                          <Icon className="w-4 h-4 text-emerald-600" />
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
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Link
              href="/search"
              aria-label="Universal Search"
              className="p-2.5 text-slate-600 hover:text-emerald-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <Search className="w-5 h-5" />
            </Link>

            <Link
              href="/favorites"
              aria-label="View Saved Favorites"
              className="relative p-2.5 text-slate-600 hover:text-emerald-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <Bookmark className="w-5 h-5" />
              {favorites && favorites.length > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[17px] h-[17px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center shadow">
                  {favorites.length}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <Link
                href="/customer/dashboard"
                className="flex items-center space-x-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-2 rounded-xl font-semibold text-sm hover:bg-emerald-100 transition-colors"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">{user?.name?.split(' ')[0] || 'Account'}</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm px-4 py-2 rounded-xl shadow-sm transition-all"
              >
                {t('nav.login')}
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-xl"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 shadow-xl"
          >
            <div className="grid grid-cols-2 gap-2 mb-4">
              {PRIMARY_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-800 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100">
              <span className="text-xs font-bold uppercase text-slate-400 tracking-wider block mb-2">
                Explore More
              </span>
              <div className="grid grid-cols-2 gap-2">
                {MORE_NAV.map((sub) => (
                  <Link
                    key={sub.href}
                    href={sub.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-xs font-medium text-slate-600 hover:text-emerald-800 py-1.5"
                  >
                    {sub.name}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
