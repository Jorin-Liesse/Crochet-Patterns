const cacheName = "cache-v1";

const resourcesToPrecache = [
  "/Crochet_Patterns/",
  "/Crochet_Patterns/index.html",
  "/Crochet_Patterns/style.css",
  "/Crochet_Patterns/script.js",
  "/Crochet_Patterns/manifest.json",
  "/Crochet_Patterns/styles/addButton.css",
  "/Crochet_Patterns/styles/addEditRecipePopup.css",
  "/Crochet_Patterns/styles/card.css",
  "/Crochet_Patterns/styles/darkModeSwitch.css",
  "/Crochet_Patterns/styles/deleteRecipePopup.css",
  "/Crochet_Patterns/styles/loading.css",
  "/Crochet_Patterns/styles/main.css",
  "/Crochet_Patterns/styles/searchBar.css",
  "/Crochet_Patterns/assets/icon.svg",
  "/Crochet_Patterns/assets/icons/apple-icon-180.png",
  "/Crochet_Patterns/assets/icons/apple-splash-1125-2436.jpg",
  "/Crochet_Patterns/assets/icons/apple-splash-1136-640.jpg",
  "/Crochet_Patterns/assets/icons/apple-splash-1170-2532.jpg",
  "/Crochet_Patterns/assets/icons/apple-splash-1179-2556.jpg",
  "/Crochet_Patterns/assets/icons/apple-splash-1242-2208.jpg",
  "/Crochet_Patterns/assets/icons/apple-splash-1242-2688.jpg",
  "/Crochet_Patterns/assets/icons/apple-splash-1284-2778.jpg",
  "/Crochet_Patterns/assets/icons/apple-splash-1290-2796.jpg",
  "/Crochet_Patterns/assets/icons/apple-splash-1334-750.jpg",
  "/Crochet_Patterns/assets/icons/apple-splash-1488-2266.jpg",
  "/Crochet_Patterns/assets/icons/apple-splash-1536-2048.jpg",
  "/Crochet_Patterns/assets/icons/apple-splash-1620-2160.jpg",
  "/Crochet_Patterns/assets/icons/apple-splash-1640-2360.jpg",
  "/Crochet_Patterns/assets/icons/apple-splash-1668-2224.jpg",
  "/Crochet_Patterns/assets/icons/apple-splash-1668-2388.jpg",
  "/Crochet_Patterns/assets/icons/apple-splash-1792-828.jpg",
  "/Crochet_Patterns/assets/icons/apple-splash-2048-1536.jpg",
  "/Crochet_Patterns/assets/icons/apple-splash-2048-2732.jpg",
  "/Crochet_Patterns/assets/icons/apple-splash-2160-1620.jpg",
  "/Crochet_Patterns/assets/icons/apple-splash-2208-1242.jpg",
  "/Crochet_Patterns/assets/icons/apple-splash-2224-1668.jpg",
  "/Crochet_Patterns/assets/icons/apple-splash-2266-1488.jpg",
  "/Crochet_Patterns/assets/icons/apple-splash-2360-1640.jpg",
  "/Crochet_Patterns/assets/icons/apple-splash-2388-1668.jpg",
  "/Crochet_Patterns/assets/icons/apple-splash-2436-1125.jpg",
  "/Crochet_Patterns/assets/icons/apple-splash-2532-1170.jpg",
  "/Crochet_Patterns/assets/icons/apple-splash-2556-1179.jpg",
  "/Crochet_Patterns/assets/icons/apple-splash-2688-1242.jpg",
  "/Crochet_Patterns/assets/icons/apple-splash-2732-2048.jpg",
  "/Crochet_Patterns/assets/icons/apple-splash-2778-1284.jpg",
  "/Crochet_Patterns/assets/icons/apple-splash-2796-1290.jpg",
  "/Crochet_Patterns/assets/icons/apple-splash-640-1136.jpg",
  "/Crochet_Patterns/assets/icons/apple-splash-750-1334.jpg",
  "/Crochet_Patterns/assets/icons/apple-splash-828-1792.jpg",
  "/Crochet_Patterns/assets/icons/manifest-icon-192.maskable.png",
  "/Crochet_Patterns/assets/icons/manifest-icon-512.maskable.png",
  "/Crochet_Patterns/assets/page-recipe-book_Mobile.png",
  "/Crochet_Patterns/assets/page-recipe-book_PC.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(cacheName)
      .then((cache) => {
        return cache.addAll(resourcesToPrecache);
      })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(caches.match(event.request)
    .then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
