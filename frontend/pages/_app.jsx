import React, { useEffect } from 'react';
import Head from 'next/head';
import '../styles/globals.css';
import { AuthProvider } from '../src/context/AuthContext';
import { ToastProvider } from '../src/context/ToastContext';
import { LanguageProvider } from '../src/shared/contexts/LanguageContext';
import InstallPwaPrompt from '../src/components/common/InstallPwaPrompt';

export default function App({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page);

  useEffect(() => {
    // Register Service Worker for PWA
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            console.log('[PWA] Service Worker registered with scope:', reg.scope);
          })
          .catch((err) => {
            console.warn('[PWA] Service Worker registration failed:', err);
          });
      });
    }
  }, []);

  return (
    <>
      <Head>
        <title>Adilabad App — Discover Adilabad. Discover Local.</title>
        <meta name="description" content="Find local advertisements, businesses, offers, events, jobs, property and services in Adilabad, Telangana." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <LanguageProvider>
        <ToastProvider>
          <AuthProvider>
            {getLayout(<Component {...pageProps} />)}
            <InstallPwaPrompt />
          </AuthProvider>
        </ToastProvider>
      </LanguageProvider>
    </>
  );
}
