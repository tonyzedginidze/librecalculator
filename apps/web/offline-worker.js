/* VERSION and PACK_ASSETS are supplied by the production build. */
const prefix = `oc-pack-${VERSION}-`;
let updating = Promise.resolve();
async function syncPacks(ids) {
  const next = [
    ...new Set(["core", ...ids.filter((id) => Object.hasOwn(PACK_ASSETS, id))]),
  ];
  for (const id of next) {
    const name = `${prefix}${id}`;
    if (!(await caches.has(name))) {
      const cache = await caches.open(name);
      try {
        await cache.addAll(PACK_ASSETS[id]);
      } catch (error) {
        await caches.delete(name);
        throw error;
      }
    }
  }
  for (const name of await caches.keys())
    if (
      name.startsWith(prefix) &&
      !next.some((id) => name === `${prefix}${id}`)
    )
      await caches.delete(name);
}
self.addEventListener("install", (event) => {
  event.waitUntil(syncPacks(["core"]));
});
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      for (const name of await caches.keys())
        if (name.startsWith("oc-pack-") && !name.startsWith(prefix))
          await caches.delete(name);
      await self.clients.claim();
    })(),
  );
});
self.addEventListener("message", (event) => {
  if (event.data?.type !== "activate-packs" || !Array.isArray(event.data.ids))
    return;
  updating = updating.catch(() => {}).then(() => syncPacks(event.data.ids));
  event.waitUntil(updating);
});
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET" || url.origin !== self.location.origin)
    return;
  event.respondWith(
    (async () => {
      let path = url.pathname;
      if (!path.includes(".") && !path.endsWith("/")) path += "/";
      // Serve cached HTML and hashed chunks from the same build, even while online.
      for (const name of (await caches.keys()).filter((name) =>
        name.startsWith(prefix),
      )) {
        const cache = await caches.open(name);
        const cached = await cache.match(path);
        if (cached) return cached;
      }
      return fetch(event.request);
    })(),
  );
});
