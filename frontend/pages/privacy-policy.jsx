import React from 'react';
import Head from 'next/head';
import MainLayout from '../src/components/layout/MainLayout';

export default function PrivacyPolicyPage() {
  return (
    <>
      <Head>
        <title>Privacy Policy — Adilabad App</title>
      </Head>

      <div className="bg-slate-50 py-12 sm:py-20 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-sm space-y-6 text-slate-700 text-sm sm:text-base leading-relaxed">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-xs text-slate-400">Last updated: October 2026</p>

            <h2 className="text-xl font-bold text-slate-900 pt-4">1. Information We Collect</h2>
            <p>
              Adilabad App collects minimal information required to provide our discovery service. If you register for an account, we collect your name, email, and phone number to manage saved bookmarks and deliver opted-in local notifications.
            </p>

            <h2 className="text-xl font-bold text-slate-900 pt-4">2. Administrative Content Publishing</h2>
            <p>
              Adilabad App is a curated local platform. All public advertisements, commercial listings, and event details are created and verified directly by our administrative staff. Normal users do not publish public content.
            </p>

            <h2 className="text-xl font-bold text-slate-900 pt-4">3. Interactions & Click Analytics</h2>
            <p>
              When you click to Call, chat on WhatsApp, or get directions on Google Maps, we record anonymous interaction counts (such as click types) to help verified local businesses understand engagement. We do not sell your personal data.
            </p>

            <h2 className="text-xl font-bold text-slate-900 pt-4">4. Security</h2>
            <p>
              We implement industry-standard cryptographic practices (bcrypt password hashing, encrypted JWT session tokens, and strict Role-Based Access Controls) to ensure data confidentiality.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

PrivacyPolicyPage.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};
