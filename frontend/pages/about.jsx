import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { MapPin, ShieldCheck, Sparkles, PhoneCall, CheckCircle } from 'lucide-react';
import MainLayout from '../src/components/layout/MainLayout';

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About Us — Adilabad App</title>
        <meta
          name="description"
          content="About Adilabad App, the premier local advertising and discovery platform for Adilabad, Telangana."
        />
      </Head>

      <div className="bg-slate-50 py-12 sm:py-20 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="text-center space-y-3">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
              Discover Adilabad. Discover Local.
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              About Adilabad App
            </h1>
            <p className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Bringing local advertisements, commercial showrooms, properties, vehicles, jobs, events, and community services into one unified, verified digital destination.
            </p>
          </div>

          {/* Mission Card */}
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-sm space-y-6">
            <h2 className="text-2xl font-black text-slate-900">Our Local Mission</h2>
            <p className="text-slate-700 leading-relaxed text-base">
              Founded specifically for the residents, merchants, and visitors of Adilabad, Telangana, <strong>Adilabad App</strong> bridges the gap between traditional local classifieds and modern digital discovery. We eliminate the frustration of scattered social media posts, unverified listings, and outdated contacts by providing a modern, fast, and organized platform.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
              <div className="p-5 rounded-2xl bg-brand-50/60 border border-brand-100 space-y-2">
                <ShieldCheck className="w-6 h-6 text-brand-600" />
                <h4 className="font-bold text-slate-900">Admin-Verified Quality</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Unlike chaotic bulletin boards, only designated administrators review and publish listings. This ensures 100% genuine phone numbers, exact locations, and real photos.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-2">
                <PhoneCall className="w-6 h-6 text-emerald-600" />
                <h4 className="font-bold text-slate-900">Direct Buyer-Seller Contact</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Connect straight with business owners and advertisers via 1-tap phone calls, WhatsApp messages, and turn-by-turn Google Maps directions. No middlemen or commissions.
                </p>
              </div>
            </div>
          </div>

          {/* Platform Standards */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="text-xl font-bold text-slate-900">What We Provide</h3>
            <ul className="space-y-3 text-sm text-slate-700">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                <span><strong>Local Commercial Deals:</strong> Exclusive festival discounts and offers from retail stores across Cinema Road, Shivaji Chowk, and Gandhi Chowk.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                <span><strong>Real Estate & Property:</strong> Verified rental shops, independent villas, and open residential plots in Teachers Colony, Dwaraka Nagar, and Mavala.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                <span><strong>Vehicles & Agriculture:</strong> Used cars, motorcycles, tractors, and agricultural farm equipment tailored for Adilabad farmers.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                <span><strong>Upcoming Events & Exhibitions:</strong> Fairs, cricket cups, cultural handloom expos, and health camps happening in town.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

AboutPage.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};
