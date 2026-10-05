import React from 'react';
import Head from 'next/head';
import MainLayout from '../src/components/layout/MainLayout';

export default function TermsPage() {
  return (
    <>
      <Head>
        <title>Terms & Conditions — Adilabad App</title>
      </Head>

      <div className="bg-slate-50 py-12 sm:py-20 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-sm space-y-6 text-slate-700 text-sm sm:text-base leading-relaxed">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Terms & Conditions
            </h1>
            <p className="text-xs text-slate-400">Effective Date: October 2026</p>

            <h2 className="text-xl font-bold text-slate-900 pt-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using Adilabad App, you agree to comply with and be bound by these terms. This is a private local advertising and discovery platform focused on Adilabad, Telangana, and is not affiliated with any government department.
            </p>

            <h2 className="text-xl font-bold text-slate-900 pt-4">2. Core Business & Publishing Rules</h2>
            <p>
              <strong>Only platform administrators can create, edit, and publish content.</strong> Visitors and registered members cannot post advertisements, upload listings, or publish banners. Visitors may browse, search, save favorites, share, call, or chat with verified businesses.
            </p>

            <h2 className="text-xl font-bold text-slate-900 pt-4">3. Disclaimers & Accuracy</h2>
            <p>
              While all listings are reviewed by administrators prior to publishing, users are advised to exercise normal commercial prudence when purchasing goods, hiring contractors, or renting property in Adilabad.
            </p>

            <h2 className="text-xl font-bold text-slate-900 pt-4">4. Reporting Violations</h2>
            <p>
              Users can report any listing containing inaccurate contact details, expired offers, or improper content using the Report button on the advertisement detail page.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

TermsPage.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};
