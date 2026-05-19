// Villa Butterfly Staff Portal — Service Worker
const CACHE = 'vb-portal-v1';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());

self.addEventListener('fetch', event => {
  // Only handle same-origin requests, pass everything else through
  if (!event.request.url.startsWith(self.location.origin)) return;
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
