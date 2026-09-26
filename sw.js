// Service worker ساده: فقط پوسته‌ی ثابت اپ (HTML/آیکون‌ها) رو کش می‌کنه تا نصب
// روی صفحه‌ی اصلی به‌رسمیت شناخته بشه. هیچ داده‌ی زنده‌ای (Binance API) کش نمی‌شه —
// هر درخواست به دامنه‌ی دیگه (cross-origin) مستقیم از شبکه رد می‌شه.

const CACHE_NAME = 'saeed-analiz-shell-v1';
const SHELL_FILES = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_FILES)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // درخواست‌های خارج از این سایت (مثل api.binance.com) هرگز کش نمی‌شن.
  if (url.origin !== self.location.origin) {
    return; // اجازه بده مستقیم به شبکه بره
  }

  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req))
  );
});
