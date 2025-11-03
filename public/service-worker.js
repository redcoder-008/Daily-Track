const CACHE_NAME = "popmitra-cache-v3";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/planner",
  "/expenses", 
  "/notes",
  "/bills",
  "/profile",
  "/auth",
  "/landing"
];

// Install service worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Activate service worker
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch with cache-first strategy for app shell
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch from network
      if (response) {
        return response;
      }
      
      // For API calls, try network first, fallback to cache
      if (event.request.url.includes('/api/') || event.request.url.includes('supabase')) {
        return fetch(event.request).catch(() => {
          return caches.match(event.request);
        });
      }
      
      // For other resources, fetch and cache
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        
        return response;
      });
    })
  );
});
