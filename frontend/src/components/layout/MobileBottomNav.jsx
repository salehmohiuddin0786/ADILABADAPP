import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import {
  Home,
  Megaphone,
  Store,
  Calendar,
  Bookmark
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function MobileBottomNav() {
  const router = useRouter();
  const { favorites } = useAuth();

  // If in admin routes or item detail pages, don't show standard bottom nav
  const isDetailPage =
    router.pathname === '/advertisements/[slug]' ||
    router.pathname === '/businesses/[slug]';

  if (router.pathname.startsWith('/admin') || isDetailPage) {
    return null;
  }

  const navItems = [
    {
      name: 'Home',
      href: '/',
      icon: Home,
      exact: true
    },
    {
      name: 'Ads',
      href: '/advertisements',
      icon: Megaphone,
      exact: false
    },
    {
      name: 'Directory',
      href: '/businesses',
      icon: Store,
      exact: false
    },
    {
      name: 'Events',
      href: '/events',
      icon: Calendar,
      exact: false
    },
    {
      name: 'Saved',
      href: '/favorites',
      icon: Bookmark,
      exact: false,
      badge: favorites.length > 0 ? favorites.length : null
    }
  ];

  const isCurrentActive = (item) => {
    if (item.exact) {
      return router.pathname === item.href;
    }
    return router.pathname.startsWith(item.href);
  };

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 shadow-[0_-4px_25px_rgba(0,0,0,0.06)] md:hidden px-2 py-1.5 transition-all"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isCurrentActive(item);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 select-none ${
                active
                  ? 'text-brand-600 font-bold'
                  : 'text-slate-500 hover:text-slate-900 font-medium'
              }`}
            >
              {/* Active Background Glow Pill */}
              {active && (
                <motion.div
                  layoutId="mobileNavPill"
                  className="absolute inset-0 bg-brand-50 rounded-2xl -z-10 border border-brand-100"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}

              {/* Icon with relative badge */}
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    active ? 'scale-110 stroke-[2.4]' : 'scale-100 stroke-[1.8]'
                  }`}
                />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span className={`text-[10px] tracking-tight mt-0.5 ${active ? 'font-bold' : 'font-medium'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
