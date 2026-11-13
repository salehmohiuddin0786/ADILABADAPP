import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../../shared/contexts/LanguageContext';
import { MapPin, Phone, Mail, ShieldCheck, Heart } from 'lucide-react';

export default function PublicFooter() {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-700 to-emerald-500 flex items-center justify-center text-white font-extrabold text-base shadow-lg shadow-emerald-950">
                A
              </div>
              <span className="font-black text-2xl tracking-tight text-white">
                Adilabad<span className="text-amber-400">App</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              {t('brand.subheading')} Built for Adilabad, Utnoor, Boath, Echoda, Bela, and all surrounding mandals.
            </p>
            <div className="pt-2 flex items-center space-x-4 rtl:space-x-reverse text-xs text-slate-400">
              <span className="flex items-center">
                <MapPin className="w-3.5 h-3.5 text-amber-400 mr-1 ml-1" />
                Adilabad, Telangana, 504001
              </span>
              <span className="flex items-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 mr-1 ml-1" />
                Verified Local Listings
              </span>
            </div>
          </div>

          {/* Core Modules */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100 mb-4">
              Core Modules
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link href="/advertisements" className="hover:text-emerald-400 transition-colors">Local Advertisements</Link></li>
              <li><Link href="/businesses" className="hover:text-emerald-400 transition-colors">Business Directory</Link></li>
              <li><Link href="/rentals" className="hover:text-amber-400 font-semibold transition-colors">Rent Your Items</Link></li>
              <li><Link href="/buy-sell" className="hover:text-emerald-400 transition-colors">Buy & Sell Classifieds</Link></li>
              <li><Link href="/services" className="hover:text-emerald-400 transition-colors">Local Technicians</Link></li>
              <li><Link href="/jobs" className="hover:text-emerald-400 transition-colors">Adilabad Careers</Link></li>
            </ul>
          </div>

          {/* Hyperlocal Niches */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100 mb-4">
              Adilabad Life
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link href="/food" className="hover:text-emerald-400 transition-colors">Food & Restaurants</Link></li>
              <li><Link href="/live" className="hover:text-emerald-400 transition-colors">Adilabad Live Notices</Link></li>
              <li><Link href="/explore" className="hover:text-emerald-400 transition-colors">Waterfalls & Tourism</Link></li>
              <li><Link href="/properties" className="hover:text-emerald-400 transition-colors">House & Shop Rentals</Link></li>
              <li><Link href="/agriculture" className="hover:text-emerald-400 transition-colors">Agri Equipment & Seeds</Link></li>
              <li><Link href="/weddings" className="hover:text-emerald-400 transition-colors">Wedding Vendors</Link></li>
            </ul>
          </div>

          {/* Portals & Trust */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100 mb-4">
              Portals & Trust
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link href="/customer/dashboard" className="hover:text-amber-400 transition-colors">Customer Hub</Link></li>
              <li><Link href="/owner/dashboard" className="hover:text-amber-400 transition-colors">Owner & Partner Portal</Link></li>
              <li><Link href="/admin/login" className="hover:text-emerald-400 transition-colors">Admin Portal</Link></li>
              <li><Link href="/about" className="hover:text-emerald-400 transition-colors">About the Platform</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-emerald-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Adilabad App. All rights reserved. Private Hyperlocal Discovery Platform.</p>
          <p className="mt-3 sm:mt-0 flex items-center">
            Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 mx-1 fill-rose-500" /> for the community of Adilabad, Telangana.
          </p>
        </div>
      </div>
    </footer>
  );
}
