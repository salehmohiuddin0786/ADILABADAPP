// Adilabad App Progressive Web App Service Worker
const CACHE_NAME = 'adilabad-cache-v1';
const PRECACHE_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.svg',
  '/images/icons/icon-192x192.svg',
  '/images/icons/icon-512x512.svg',
  '/images/placeholders/shopping.svg',
  '/images/placeholders/property.svg',
  '/images/placeholders/food.svg',
  '/images/placeholders/jobs.svg',
  '/images/placeholders/vehicles.svg',
  '/images/placeholders/electronics.svg',
  '/images/placeholders/agriculture.svg',
  '/images/placeholders/services.svg',
  '/images/placeholders/rentals.svg',
  '/images/placeholders/default.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('Precache partial fallback:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Only intercept GET requests for same-origin static assets
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  // Skip API calls and Next.js internal HMR chunks
  if (url.pathname.startsWith('/api') || url.pathname.includes('/_next/webpack-hmr')) {
    return;
  }

  // Stale-while-revalidate for images and icons
  if (url.pathname.startsWith('/images/') || url.pathname.endsWith('.svg') || url.pathname.endsWith('.png')) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        }).catch(() => cachedResponse);
        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // Network first with offline fallback for navigation
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/'))
    );
  }
});
