import React from 'react';
import Head from 'next/head';
import '../styles/globals.css';
import { AuthProvider } from '../src/context/AuthContext';
import { ToastProvider } from '../src/context/ToastContext';

export default function App({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <>
      <Head>
        <title>Adilabad App — Discover Adilabad. Discover Local.</title>
        <meta name="description" content="Find local advertisements, businesses, offers, events, jobs, property and services in Adilabad, Telangana." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ToastProvider>
        <AuthProvider>
          {getLayout(<Component {...pageProps} />)}
        </AuthProvider>
      </ToastProvider>
    </>
  );
}
