import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Bookmark,
  Bell,
  Menu,
  X,
  User,
  Shield,
  LogOut,
  ChevronDown,
  MapPin,
  ExternalLink,
  Compass
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '../../utils/api';

export default function Header() {
  const router = useRouter();
  const { user, isLoggedIn, isAdmin, logout, favorites } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Fetch latest notifications
    apiFetch('/notifications')
      .then((res) => {
        if (res.success && res.data) {
          setNotifications(res.data.slice(0, 5));
          const unread = res.data.filter((n) => !n.is_read).length;
          setUnreadCount(unread);
        }
      })
      .catch(() => {});
  }, [user]);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setNotifDropdownOpen(false);
    setUserDropdownOpen(false);
  }, [router.asPath]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Advertisements', href: '/advertisements' },
    { name: 'Businesses', href: '/businesses' },
    { name: 'Events', href: '/events' },
    { name: 'Explore', href: '/explore' }
  ];

  const isActive = (href) => {
    if (href === '/') return router.pathname === '/';
    return router.pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 group-hover:text-brand-600 transition">
                  Adilabad<span className="text-brand-600">App</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-600 -mt-1">
                  Discover Local
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive(link.href)
                      ? 'text-brand-600 bg-brand-50 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Hyper-local Adilabad live badge */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100/80 text-slate-700 text-xs font-bold border border-slate-200/70">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>Adilabad</span>
              <span className="text-slate-400 font-normal">•</span>
              <span className="text-slate-500 font-normal">504001</span>
            </div>
          </div>

          {/* Right Action Icons & Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Search Button */}
            <Link
              href="/search"
              aria-label="Search advertisements, businesses and events"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100/90 hover:bg-brand-50 hover:border-brand-200 text-slate-600 border border-slate-200/80 transition-all group text-xs sm:text-sm font-medium"
            >
              <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-600 transition" />
              <span className="text-slate-400 hidden sm:inline text-xs">Search...</span>
            </Link>

            {/* Favorites Icon */}
            <Link
              href="/favorites"
              aria-label="View Saved Favorites"
              className="relative p-2 rounded-xl text-slate-600 hover:text-brand-600 hover:bg-brand-50 transition border border-transparent hover:border-brand-200"
            >
              <Bookmark className="w-5 h-5" />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center shadow-md animate-pulse">
                  {favorites.length}
                </span>
              )}
            </Link>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                aria-label="Notifications"
                className="relative p-2 rounded-lg text-slate-600 hover:text-brand-600 hover:bg-brand-50 transition"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                )}
              </button>

              <AnimatePresence>
                {notifDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <h4 className="font-bold text-slate-900 text-sm">Notifications</h4>
                      <span className="text-xs text-slate-400">Adilabad Updates</span>
                    </div>

                    <div className="py-2 divide-y divide-slate-100 max-h-72 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((n) => (
                          <div key={n.id} className="py-2.5 px-1 hover:bg-slate-50 rounded-lg transition text-left">
                            <p className="text-xs font-semibold text-slate-800">{n.title}</p>
                            <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{n.message}</p>
                            {n.link_url && (
                              <Link
                                href={n.link_url}
                                className="inline-block mt-1 text-[11px] font-semibold text-brand-600 hover:underline"
                              >
                                View Details &rarr;
                              </Link>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="py-6 text-center text-xs text-slate-400">
                          No recent announcements.
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User / Admin Authentication State */}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 hover:border-brand-200 bg-white hover:bg-brand-50/50 transition text-sm font-semibold text-slate-800"
                >
                  <div className="w-7 h-7 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs uppercase">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden sm:inline max-w-[100px] truncate">{user?.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 text-sm"
                    >
                      <div className="p-3 border-b border-slate-100">
                        <p className="font-bold text-slate-900 truncate">{user?.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                        {isAdmin && (
                          <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            Administrator
                          </span>
                        )}
                      </div>

                      <div className="py-1">
                        {isAdmin && (
                          <Link
                            href="/admin"
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-brand-50 hover:text-brand-600 transition font-medium"
                          >
                            <Shield className="w-4 h-4 text-brand-600" />
                            Admin Dashboard
                          </Link>
                        )}
                        <Link
                          href="/profile"
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition"
                        >
                          <User className="w-4 h-4 text-slate-400" />
                          My Profile
                        </Link>
                        <Link
                          href="/favorites"
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition"
                        >
                          <Bookmark className="w-4 h-4 text-slate-400" />
                          Saved Items
                        </Link>
                      </div>

                      <div className="pt-1 border-t border-slate-100">
                        <button
                          onClick={logout}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 transition text-left"
                        >
                          <LogOut className="w-4 h-4 text-rose-500" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-brand-600 hover:bg-brand-50 transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/login?tab=register"
                  className="hidden sm:inline-flex px-4 py-2 rounded-xl text-sm font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-sm shadow-brand-600/20 transition"
                >
                  Create Account
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`block px-3 py-2.5 rounded-xl text-base font-semibold transition ${
                  isActive(link.href)
                    ? 'text-brand-600 bg-brand-50'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Link
                href="/categories"
                className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                All Categories
              </Link>
              <Link
                href="/favorites"
                className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Saved Favorites ({favorites.length})
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="block px-3 py-2 rounded-xl text-sm font-bold text-emerald-700 bg-emerald-50"
                >
                  Admin Control Panel
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
