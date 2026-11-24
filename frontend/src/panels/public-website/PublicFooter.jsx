import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../../shared/contexts/LanguageContext';
import { MapPin, Phone, Mail, ShieldCheck, Heart, Sparkles, Layers, Building, HelpCircle } from 'lucide-react';

export default function PublicFooter() {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-950 text-slate-300 pt-12 sm:pt-16 pb-28 md:pb-12 border-t border-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Brand Header Section */}
        <div className="pb-8 mb-8 border-b border-slate-800/80 flex flex-col items-center text-center md:flex-row md:items-center md:justify-between md:text-left gap-6">
          <div className="space-y-3 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2.5 rtl:space-x-reverse">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-700 to-emerald-500 flex items-center justify-center text-white font-extrabold text-base shadow-lg shadow-emerald-950 shrink-0">
                A
              </div>
              <div>
                <span className="font-black text-2xl tracking-tight text-white">
                  Adilabad<span className="text-amber-400">App</span>
                </span>
                <span className="ml-2 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider">
                  Super App 2.0
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed text-center md:text-left">
              Adilabad's central hyperlocal marketplace for verified advertisements, rentals, commercial directory, local technicians, and community services.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 text-xs text-slate-400 shrink-0">
            <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
              <MapPin className="w-3.5 h-3.5 text-amber-400 mr-1.5 shrink-0" />
              <span>Adilabad District, TS</span>
            </span>
            <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 mr-1.5 shrink-0" />
              <span>100% Verified Listings</span>
            </span>
          </div>
        </div>

        {/* 4 Symmetric Link Columns: Balanced & Centered in the Middle */}
        <div className="w-full max-w-sm sm:max-w-2xl lg:max-w-none mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 pb-10 border-b border-slate-800/80">
          
          {/* Column 1: Marketplace */}
          <div className="space-y-3 px-1 sm:px-0 flex flex-col items-center text-center">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-200 flex items-center justify-center gap-1.5 w-full">
              <Layers className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Marketplace</span>
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400 text-center w-full">
              <li>
                <Link href="/advertisements" className="hover:text-emerald-400 transition-colors block py-0.5 text-center">
                  Advertisements
                </Link>
              </li>
              <li>
                <Link href="/rentals" className="hover:text-emerald-400 transition-colors block py-0.5 text-center">
                  Rental Equipment
                </Link>
              </li>
              <li>
                <Link href="/businesses" className="hover:text-emerald-400 transition-colors block py-0.5 text-center">
                  Business Directory
                </Link>
              </li>
              <li>
                <Link href="/buy-sell" className="hover:text-emerald-400 transition-colors block py-0.5 text-center">
                  Buy & Sell Items
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-emerald-400 transition-colors block py-0.5 text-center">
                  Local Services
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="hover:text-emerald-400 transition-colors block py-0.5 text-center">
                  Career Vacancies
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Adilabad Life */}
          <div className="space-y-3 px-1 sm:px-0 flex flex-col items-center text-center">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-200 flex items-center justify-center gap-1.5 w-full">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Adilabad Life</span>
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400 text-center w-full">
              <li>
                <Link href="/food" className="hover:text-emerald-400 transition-colors block py-0.5 text-center">
                  Food & Dining
                </Link>
              </li>
              <li>
                <Link href="/properties" className="hover:text-emerald-400 transition-colors block py-0.5 text-center">
                  Houses & Lands
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-emerald-400 transition-colors block py-0.5 text-center">
                  Events & Expos
                </Link>
              </li>
              <li>
                <Link href="/agriculture" className="hover:text-emerald-400 transition-colors block py-0.5 text-center">
                  Agri & Farming
                </Link>
              </li>
              <li>
                <Link href="/explore" className="hover:text-emerald-400 transition-colors block py-0.5 text-center">
                  Local Tourism
                </Link>
              </li>
              <li>
                <Link href="/offers" className="hover:text-emerald-400 transition-colors block py-0.5 text-center">
                  Offers & Coupons
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Portals & Access */}
          <div className="space-y-3 px-1 sm:px-0 flex flex-col items-center text-center">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-200 flex items-center justify-center gap-1.5 w-full">
              <Building className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>Portals</span>
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400 text-center w-full">
              <li>
                <Link href="/customer/dashboard" className="hover:text-emerald-400 transition-colors block py-0.5 text-center">
                  Customer Hub
                </Link>
              </li>
              <li>
                <Link href="/owner/dashboard" className="hover:text-emerald-400 transition-colors block py-0.5 text-center">
                  Owner Portal
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-emerald-400 transition-colors block py-0.5 text-center">
                  Admin Center
                </Link>
              </li>
              <li>
                <Link href="/staff/dashboard" className="hover:text-emerald-400 transition-colors block py-0.5 text-center">
                  Staff Workspace
                </Link>
              </li>
              <li>
                <Link href="/favorites" className="hover:text-emerald-400 transition-colors block py-0.5 text-center">
                  Saved Favorites
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-emerald-400 transition-colors block py-0.5 text-center">
                  All Categories
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Help & Support */}
          <div className="space-y-3 px-1 sm:px-0 flex flex-col items-center text-center">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-200 flex items-center justify-center gap-1.5 w-full">
              <HelpCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>Support</span>
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400 text-center w-full">
              <li>
                <Link href="/about" className="hover:text-emerald-400 transition-colors block py-0.5 text-center">
                  About the App
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-emerald-400 transition-colors block py-0.5 text-center">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-emerald-400 transition-colors block py-0.5 text-center">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-emerald-400 transition-colors block py-0.5 text-center">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/customer/support" className="hover:text-emerald-400 transition-colors block py-0.5 text-center">
                  Help Center
                </Link>
              </li>
              <li>
                <a href="tel:+919440112345" className="hover:text-emerald-400 transition-colors block py-0.5 font-mono text-center">
                  +91 94401 12345
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Adilabad App. All rights reserved. Private Hyperlocal Discovery Platform.</p>
          <p className="flex items-center justify-center">
            Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 mx-1 fill-rose-500" /> for Adilabad, Telangana.
          </p>
        </div>
      </div>
    </footer>
  );
}
