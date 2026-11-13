importScripts("version.js");
const CACHE="sadino-ws-v"+APP_VERSION;
const ASET=["./","index.html","version.js","logic.js","office-layout.js","office.js","app.js","pages.js","styles.css","manifest.json","icon-192.png","icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASET)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
// Hanya navigasi halaman yang boleh jatuh ke index.html; file lain yang gagal tetap gagal (tidak menyamar jadi HTML)
self.addEventListener("fetch",e=>{if(e.request.method!=="GET")return;e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).catch(()=>e.request.mode==="navigate"?caches.match("index.html"):Response.error())))});
