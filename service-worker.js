const CACHE_NAME="fruitopia-tycoon-v15.1";
const APP_SHELL=[
  "./",
  "./index.html",
  "./styles.css",
  "./game.js",
  "./manifest.webmanifest",
  "./icons/apple-icon.svg",
  "./src/config.js",
  "./src/color-config.js",
  "./src/world-expansion-config.js",
  "./src/upgrade-config.js",
  "./src/outside-config.js",
  "./src/sewer-config.js",
  "./src/mafia-config.js",
  "./src/mafia-game.js",
  "./src/core.js",
  "./src/world.js",
  "./src/minigames.js"
];

self.addEventListener("install",event=>{
  event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(APP_SHELL)).then(()=>self.skipWaiting()));
});

self.addEventListener("activate",event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE_NAME).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});

self.addEventListener("fetch",event=>{
  const request=event.request;
  if(request.method!=="GET")return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin)return;
  event.respondWith((async()=>{
    try{
      const response=await fetch(request);
      if(response.ok){const cache=await caches.open(CACHE_NAME);cache.put(request,response.clone());}
      return response;
    }catch{
      const cached=await caches.match(request,{ignoreSearch:true});
      if(cached)return cached;
      if(request.mode==="navigate")return caches.match("./index.html");
      return new Response("Fruitopia is offline and this asset has not been cached yet.",{status:503,headers:{"Content-Type":"text/plain; charset=utf-8"}});
    }
  })());
});

self.addEventListener("message",event=>{if(event.data==="SKIP_WAITING")self.skipWaiting();});
