const CACHE_NAME = 'tool-app-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/admin.html',
  '/dashboard.html',
  '/style.css',
  '/user.js',
  '/admin.js',
  '/dashboard.js'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
});

self.addEventListener('activate', event => { event.waitUntil(self.clients.claim()); });

self.addEventListener('fetch', event => {
  event.respondWith(caches.match(event.request).then(response => response || fetch(event.request)).catch(() => caches.match('/index.html')));
});