// 便利店工作台 · Service Worker（网络优先，离线兜底，按真实网址缓存）
const CACHE = "cvs-store-v2";
const PRECACHE = [
  "./",
  "index.html",
  "xinpeng.html",
  "manifest.webmanifest",
  "xinpeng.webmanifest",
  "icon-192.png",
  "icon-512.png",
  "icon-mask.png"
];
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  e.respondWith(
    fetch(req)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
        return res;
      })
      .catch(() => caches.match(req).then(r => r || caches.match("./")))
  );
});
