import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, ShieldCheck, Heart, Layers, Sparkles, Building, HelpCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-12 sm:pt-16 pb-28 md:pb-12 border-t border-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Brand Header Section */}
        <div className="pb-8 mb-8 border-b border-slate-800/80 flex flex-col items-center text-center md:flex-row md:items-center md:justify-between md:text-left gap-6">
          <div className="space-y-3 flex flex-col items-center md:items-start text-center md:text-left">
            <Link href="/" className="flex items-center justify-center md:justify-start space-x-2.5 rtl:space-x-reverse">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-sky-400 flex items-center justify-center text-white font-extrabold text-base shadow-lg shrink-0">
                A
              </div>
              <div>
                <span className="font-black text-2xl tracking-tight text-white">
                  Adilabad<span className="text-amber-400">App</span>
                </span>
                <span className="ml-2 px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-400 border border-brand-500/30 text-[10px] font-black uppercase tracking-wider">
                  Super App
                </span>
              </div>
            </Link>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed text-center md:text-left">
              Your local platform to discover advertisements, business listings, rentals, events, offers, and services in Adilabad, Telangana.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 text-xs text-slate-400 shrink-0">
            <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
              <MapPin className="w-3.5 h-3.5 text-amber-400 mr-1.5 shrink-0" />
              <span>Adilabad, Telangana 504001</span>
            </span>
            <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 mr-1.5 shrink-0" />
              <span>Verified Local Marketplace</span>
            </span>
          </div>
        </div>

        {/* 4 Symmetric Link Columns: Balanced 2 Columns Centered on Mobile, 4 Columns on Desktop */}
        <div className="w-full max-w-sm sm:max-w-2xl lg:max-w-none mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 pb-10 border-b border-slate-800/80">
          
          {/* Column 1: Marketplace */}
          <div className="space-y-3 px-1 sm:px-0">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-brand-400 shrink-0" />
              <span>Marketplace</span>
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li>
                <Link href="/advertisements" className="hover:text-brand-400 transition-colors block py-0.5">
                  Advertisements
                </Link>
              </li>
              <li>
                <Link href="/rentals" className="hover:text-brand-400 transition-colors block py-0.5">
                  Rental Fleet
                </Link>
              </li>
              <li>
                <Link href="/businesses" className="hover:text-brand-400 transition-colors block py-0.5">
                  Business Directory
                </Link>
              </li>
              <li>
                <Link href="/buy-sell" className="hover:text-brand-400 transition-colors block py-0.5">
                  Buy & Sell Market
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-brand-400 transition-colors block py-0.5">
                  Local Services
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="hover:text-brand-400 transition-colors block py-0.5">
                  Local Jobs
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Adilabad Life */}
          <div className="space-y-3 px-1 sm:px-0">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Categories</span>
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li>
                <Link href="/food" className="hover:text-brand-400 transition-colors block py-0.5">
                  Food & Dining
                </Link>
              </li>
              <li>
                <Link href="/properties" className="hover:text-brand-400 transition-colors block py-0.5">
                  Property Listings
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-brand-400 transition-colors block py-0.5">
                  Upcoming Events
                </Link>
              </li>
              <li>
                <Link href="/agriculture" className="hover:text-brand-400 transition-colors block py-0.5">
                  Agri Equipment
                </Link>
              </li>
              <li>
                <Link href="/explore" className="hover:text-brand-400 transition-colors block py-0.5">
                  Explore Adilabad
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-brand-400 transition-colors block py-0.5">
                  All Categories
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Portals */}
          <div className="space-y-3 px-1 sm:px-0">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>Portals</span>
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li>
                <Link href="/customer/dashboard" className="hover:text-brand-400 transition-colors block py-0.5">
                  Customer Hub
                </Link>
              </li>
              <li>
                <Link href="/owner/dashboard" className="hover:text-brand-400 transition-colors block py-0.5">
                  Owner Portal
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-brand-400 transition-colors block py-0.5">
                  Admin Center
                </Link>
              </li>
              <li>
                <Link href="/staff/dashboard" className="hover:text-brand-400 transition-colors block py-0.5">
                  Staff Workspace
                </Link>
              </li>
              <li>
                <Link href="/favorites" className="hover:text-brand-400 transition-colors block py-0.5">
                  Saved Items
                </Link>
              </li>
              <li>
                <Link href="/offers" className="hover:text-brand-400 transition-colors block py-0.5">
                  Special Offers
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Support & Legal */}
          <div className="space-y-3 px-1 sm:px-0">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>Company</span>
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li>
                <Link href="/about" className="hover:text-brand-400 transition-colors block py-0.5">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-400 transition-colors block py-0.5">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-brand-400 transition-colors block py-0.5">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-brand-400 transition-colors block py-0.5">
                  Terms of Service
                </Link>
              </li>
              <li>
                <a href="tel:+919440112345" className="hover:text-brand-400 transition-colors block py-0.5 font-mono">
                  +91 94401 12345
                </a>
              </li>
              <li>
                <a href="mailto:hello@adilabadapp.com" className="hover:text-brand-400 transition-colors block py-0.5 truncate">
                  hello@adilabadapp.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Adilabad App. All rights reserved.</p>
          <p className="flex items-center justify-center">
            Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 mx-1 fill-rose-500" /> for Adilabad, Telangana.
          </p>
        </div>
      </div>
    </footer>
  );
}
