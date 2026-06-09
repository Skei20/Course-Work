const CACHE_NAME = 'course-work-v1';
const ASSETS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // Apps Script / Google calls always go to the network (never cache live data).
  if (event.request.url.includes('script.google.com') ||
      event.request.url.includes('googleusercontent') ||
      event.request.url.includes('macros')) {
    return; // default network handling
  }
  // App shell: cache-first so it opens offline.
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request)));
});
