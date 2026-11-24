import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en" className="h-full">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />

        {/* PWA Manifest & App Icons */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/icons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/images/icons/icon-192x192.png" />
        <link rel="mask-icon" href="/favicon.svg" color="#047857" />

        {/* Canonical URL & SEO Domain */}
        <link rel="canonical" href="https://adilabad.digitalcrowdtech.in/" />
        <meta property="og:site_name" content="Adilabad App" />
        <meta property="og:url" content="https://adilabad.digitalcrowdtech.in/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Adilabad App — Discover Adilabad. Discover Local." />
        <meta property="og:description" content="Find local advertisements, businesses, offers, events, jobs, property and services in Adilabad, Telangana." />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:domain" content="adilabad.digitalcrowdtech.in" />
        <meta name="twitter:url" content="https://adilabad.digitalcrowdtech.in/" />

        {/* Mobile App & OS Colors */}
        <meta name="theme-color" content="#0F172A" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#0284C7" media="(prefers-color-scheme: light)" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Adilabad App" />
        <meta name="application-name" content="Adilabad App" />
        <meta name="msapplication-TileColor" content="#0F172A" />
      </Head>
      <body className="h-full bg-slate-50 text-slate-900 selection:bg-brand-500 selection:text-white antialiased overflow-x-hidden">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
