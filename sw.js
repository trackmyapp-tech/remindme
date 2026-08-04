/* RemindMe service worker — network first, so updates arrive immediately */
const CACHE = 'remindme-v1';
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
   .then(() => self.clients.claim())
));
self.addEventListener('fetch', e => {
  if(e.request.method !== 'GET') return;
  if(e.request.url.indexOf('firebasedatabase.app') > -1) return;
  e.respondWith(
    fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy)).catch(()=>{});
      return res;
    }).catch(() => caches.match(e.request))
  );
});
