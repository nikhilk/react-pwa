// sw.js
// Service worker — offline caching with stale-while-revalidate updates
//
// Install: precaches the app shell so the app works offline.
// Fetch: serves from cache immediately, then fetches from the network in the
//   background and updates the cache. Users see the cached version on the
//   current visit and receive updates on the next visit.
// Activate: deletes old caches when the version changes, so a new publish
//   clears stale assets on the next SW activation.
// skipWaiting + clients.claim: the new SW activates immediately without
//   waiting for all tabs to close.
//

const CACHE_NAME = 'app-20260531T211953'
const APP_ASSETS = [
  './',
  './fonts/dm-mono-italic-latin.woff2',
  './fonts/dm-mono-latin.woff2',
  './fonts/dm-sans-italic-latin.woff2',
  './fonts/dm-sans-latin.woff2',
  './icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './index.html',
  './main.js',
  './manifest.json',
  './styles.css',
]

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(APP_ASSETS)))
  self.skipWaiting()
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return
  const url = new URL(e.request.url)
  if (url.pathname.startsWith('/__')) return
  e.respondWith(
    caches.match(e.request).then((cached) => {
      const fetchPromise = fetch(e.request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone()
            caches.open(CACHE_NAME).then((c) => c.put(e.request, clone))
          }
          return response
        })
        .catch(() => cached)
      return cached || fetchPromise
    })
  )
})
