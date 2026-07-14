importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);

  workbox.core.skipWaiting();
  workbox.core.clientsClaim();

  // Precache App Shell
  workbox.precaching.precacheAndRoute([
    { url: '/index.html', revision: '1' },
    { url: '/style.css', revision: '1' },
    { url: '/script.js', revision: '1' },
    { url: '/manifest.json', revision: '1' },
    { url: '/CROSSING SWITZERLAND 2026 (1).gpx', revision: '1' }
  ]);

  // Route for index.html
  workbox.routing.registerRoute(
    ({request}) => request.mode === 'navigate',
    new workbox.strategies.NetworkFirst({
      cacheName: 'pages-cache',
    })
  );

  // Cache Map Tiles (Swiss Topo & OpenStreetMap)
  // We use CacheFirst so that if the user has downloaded the tiles offline via script.js,
  // the SW intercepts the request and serves the cached tile instantly without hitting the network.
  workbox.routing.registerRoute(
    ({url}) => url.href.includes('geo.admin.ch') || url.href.includes('openstreetmap.org'),
    new workbox.strategies.CacheFirst({
      cacheName: 'map-tiles-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 10000, // We want to cache a lot of tiles for offline
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        }),
      ],
    })
  );

  // Cache CDN resources (Leaflet, Chart.js, etc.)
  workbox.routing.registerRoute(
    ({url}) => url.origin === 'https://unpkg.com' || url.origin === 'https://cdn.jsdelivr.net' || url.origin === 'https://api.mapbox.com',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'cdn-resources-cache',
    })
  );

} else {
  console.log(`Boo! Workbox didn't load 😬`);
}
