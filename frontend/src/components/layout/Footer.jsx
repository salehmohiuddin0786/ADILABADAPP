import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, MessageSquare, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-md">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Adilabad<span className="text-brand-400">App</span>
              </span>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Your local platform to discover advertisements, businesses, events, offers and more in Adilabad.
            </p>

            <div className="pt-2 flex flex-col gap-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-400 shrink-0" />
                <span>Shivaji Chowk & Cinema Road, Adilabad, Telangana 504001</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-400 shrink-0" />
                <a href="tel:+919440112345" className="hover:text-white transition">+91 94401 12345</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-400 shrink-0" />
                <a href="mailto:hello@adilabadapp.com" className="hover:text-white transition">hello@adilabadapp.com</a>
              </div>
            </div>
          </div>

          {/* Quick Discover */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Discover</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/advertisements" className="hover:text-white transition flex items-center gap-1">
                  Advertisements
                </Link>
              </li>
              <li>
                <Link href="/businesses" className="hover:text-white transition flex items-center gap-1">
                  Business Directory
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-white transition flex items-center gap-1">
                  Upcoming Events
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-white transition flex items-center gap-1">
                  All Categories
                </Link>
              </li>
              <li>
                <Link href="/explore" className="hover:text-white transition flex items-center gap-1">
                  Explore Adilabad
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Categories</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/categories/property" className="hover:text-white transition">
                  Property in Adilabad
                </Link>
              </li>
              <li>
                <Link href="/categories/electronics" className="hover:text-white transition">
                  Electronics & Appliances
                </Link>
              </li>
              <li>
                <Link href="/categories/vehicles" className="hover:text-white transition">
                  Vehicles & Automobiles
                </Link>
              </li>
              <li>
                <Link href="/categories/jobs" className="hover:text-white transition">
                  Local Jobs
                </Link>
              </li>
              <li>
                <Link href="/categories/food-restaurants" className="hover:text-white transition">
                  Food & Restaurants
                </Link>
              </li>
            </ul>
          </div>

          {/* Information & Legal */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Company</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/about" className="hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-brand-400 transition flex items-center gap-1 text-slate-400">
                  Admin Portal <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 Adilabad App. All Rights Reserved.</p>
          <p className="text-center sm:text-right">
            Private local advertising and information portal. Discover Adilabad. Discover Local.
          </p>
        </div>
      </div>
    </footer>
  );
}
