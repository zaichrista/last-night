/* Only public app assets are cached. Network first keeps reopened apps current. */
const PREFIX = 'last-night-' + encodeURIComponent(self.registration.scope) + '-';
const CACHE = PREFIX + 'v2';
const FILES = ['./', 'index.html', 'css/style.css', 'js/app.js', 'js/register.js',
  'manifest.webmanifest', 'icons/favicon.svg', 'icons/icon-192.png',
  'icons/icon-512.png', 'icons/apple-touch-180.png'];
const URLS = new Set(FILES.map(path => new URL(path, self.registration.scope).href));
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES.map(path =>
    new Request(new URL(path, self.registration.scope), {cache: 'reload'})))));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys
    .filter(key => key.startsWith(PREFIX) && key !== CACHE)
    .map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || !URLS.has(event.request.url)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    try {
      const response = await fetch(event.request, {cache: 'no-cache'});
      if (!response.ok || response.redirected) throw new Error('Asset unavailable');
      await cache.put(event.request, response.clone());
      return response;
    } catch (error) {
      const saved = await cache.match(event.request);
      return saved || Response.error();
    }
  })());
});
