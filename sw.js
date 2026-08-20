/* ============================================================
   みみトーン ─ Service Worker
   FNT標準：Network First ＋ controllerchange 自動リロード
   ※Cache-Firstにしない（古いHTMLが residual に残って出荷事故になった前例あり）
   ※デプロイのたびに CACHE_NAME を上げる
   ============================================================ */
const CACHE_NAME = 'mimi-v1.0.2';

const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icons/FNT512.png',
  './icons/FNT512-transparent.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then((c) => Promise.all(APP_SHELL.map((u) => c.add(u).catch(() => null))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* Network First：まずネット、落ちたらキャッシュ、それも無ければ index.html */
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // Webフォント等はブラウザ任せ

  /* HTMLだけはブラウザのHTTPキャッシュも迂回して取りに行く（古いHTMLが出る事故の対策） */
  var request = req;
  if (req.mode === 'navigate' || (req.headers.get('accept') || '').indexOf('text/html') >= 0) {
    try { request = new Request(req.url, { cache: 'reload', credentials: 'same-origin', mode: 'same-origin' }); }
    catch (err) { request = req; }
  }

  e.respondWith(
    fetch(request)
      .then((res) => {
        if (res && res.status === 200 && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, copy)).catch(() => {});
        }
        return res;
      })
      .catch(() =>
        caches.match(req).then((hit) => {
          if (hit) return hit;
          if (req.mode === 'navigate') return caches.match('./index.html');
          return new Response('', { status: 504, statusText: 'offline' });
        })
      )
  );
});

self.addEventListener('message', (e) => {
  if (e.data === 'SKIP_WAITING') self.skipWaiting();
});
