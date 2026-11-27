const CACHE = 'recallflow-v3-shell';
const BASE = self.registration.scope;
const ASSETS = [BASE, BASE+'index.html', BASE+'styles.css?v=300', BASE+'app.js?v=300', BASE+'manifest.webmanifest', BASE+'icons/icon.svg'];
self.addEventListener('install', event => {event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()))});
self.addEventListener('activate', event => {event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('recallflow-') && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()))});
self.addEventListener('fetch', event => {if(event.request.method!=='GET')return;const url=new URL(event.request.url);if(url.origin!==self.location.origin)return;event.respondWith(fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy))}return response}).catch(()=>caches.match(event.request).then(cached=>cached||caches.match(BASE+'index.html'))))});
self.addEventListener('notificationclick',event=>{event.notification.close();event.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(clients=>{for(const client of clients){if('focus'in client)return client.focus()}return self.clients.openWindow(BASE)}))});
