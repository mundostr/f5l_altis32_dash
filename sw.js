const CACHE_NAME = 'f5l-dash-v3.1.24';
const SCOPE_URL = self.registration.scope;
const INDEX_URL = new URL('./index.html', SCOPE_URL).href;
const CORE_ASSETS = [
  new URL('./', SCOPE_URL).href,
  INDEX_URL,
  new URL('./manifest.json', SCOPE_URL).href,
  new URL('./icon.svg', SCOPE_URL).href
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS)));
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names
      .filter(name => name.startsWith('f5l-dash-') && name !== CACHE_NAME)
      .map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;

  const url = new URL(request.url);
  if (url.searchParams.has('version_check')) return;
  const isAppPage = url.pathname === new URL(INDEX_URL).pathname;
  if (request.mode === 'navigate' || isAppPage) {
    event.respondWith((async () => {
      const cached = await caches.match(request, { ignoreSearch: true })
        || await caches.match(INDEX_URL);
      if (cached) return cached;
      return fetch(request);
    })());
    return;
  }

  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, response.clone());
    }
    return response;
  })());
});
