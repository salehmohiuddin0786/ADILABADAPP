import React, { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import '../styles/globals.css';
import { AuthProvider } from '../src/context/AuthContext';
import { ToastProvider } from '../src/context/ToastContext';
import { LanguageProvider } from '../src/shared/contexts/LanguageContext';
import InstallPwaPrompt from '../src/components/common/InstallPwaPrompt';
import RouteProgressBar from '../src/components/common/RouteProgressBar';

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const getLayout = Component.getLayout || ((page) => page);

  useEffect(() => {
    const scrollToTop = () => {
      if (typeof window === 'undefined') return;
      try {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      } catch (e) {
        window.scrollTo(0, 0);
      }
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
      const mainEl = document.querySelector('main');
      if (mainEl && mainEl.scrollTop > 0) mainEl.scrollTop = 0;
    };

    const handleRouteDone = (url, { shallow }) => {
      if (!shallow) {
        scrollToTop();
        requestAnimationFrame(scrollToTop);
        setTimeout(scrollToTop, 60);
      }
    };
    router.events.on('routeChangeComplete', handleRouteDone);
    return () => {
      router.events.off('routeChangeComplete', handleRouteDone);
    };
  }, [router]);

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
        <RouteProgressBar />
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
