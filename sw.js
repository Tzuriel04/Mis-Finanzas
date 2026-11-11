// Lets the app open instantly, even without internet. Your data is not here: the app keeps it on the phone.
// Change VERSION when you upload new files.
const VERSION = 'mis-finanzas-v15';
const FILES = ['./', 'index.html', 'manifest.webmanifest', 'icon-180.png', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// The app opens from the saved copy right away (no waiting for the network) and,
// in the background, downloads the newest version for the next time you open it.
// Requests to Google (your data) never go through here.
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  const isPage = req.mode === 'navigate' || req.url.endsWith('index.html');
  const key = isPage ? 'index.html' : req;
  e.respondWith(caches.open(VERSION).then(cache => cache.match(key).then(hit => {
    const fresh = fetch(req).then(res => {
      if (res && res.ok) cache.put(key, res.clone());
      return res;
    }).catch(() => hit);
    if (hit) { e.waitUntil(fresh); return hit; }
    return fresh;
  })));
});
