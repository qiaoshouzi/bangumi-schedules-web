/// <reference lib="webworker" />
const sw = self as unknown as ServiceWorkerGlobalScope

declare const __ASSETS_LIST__: string[]
declare const __BUILD_VERSION__: string

const CACHE_NAME = `swr-cache-${typeof __BUILD_VERSION__ !== 'undefined' ? __BUILD_VERSION__ : 'dev'}`
const PRECACHE_ASSETS = typeof __ASSETS_LIST__ !== 'undefined' ? __ASSETS_LIST__ : []

sw.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching all assets...')
      return cache.addAll(PRECACHE_ASSETS)
    }),
  )
  sw.skipWaiting()
})

sw.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.map((key) => key !== CACHE_NAME && caches.delete(key)))),
  )
  e.waitUntil(sw.clients.claim())
})

sw.addEventListener('fetch', (event) => {
  const request = event.request
  const url = new URL(request.url)
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) return

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cachedResponse = await cache.match(request)
      const resp = fetch(request).then((resp) => {
        if (resp.ok) cache.put(request, resp.clone())
        return resp
      })
      return cachedResponse || resp
    }),
  )
})
