import {cp,mkdir,readFile,rm,stat} from "node:fs/promises";
import {join} from "node:path";

const root=new URL("../",import.meta.url);
const dist=new URL("../dist/",import.meta.url);
await rm(dist,{recursive:true,force:true});
await mkdir(dist,{recursive:true});
for(const file of ["index.html","styles.css","game.js","manifest.webmanifest","service-worker.js"])await cp(new URL(`../${file}`,import.meta.url),new URL(`../dist/${file}`,import.meta.url));
await cp(new URL("../src",import.meta.url),new URL("../dist/src",import.meta.url),{recursive:true});
await cp(new URL("../icons",import.meta.url),new URL("../dist/icons",import.meta.url),{recursive:true});
const html=await readFile(new URL("../dist/index.html",import.meta.url),"utf8");
if(!html.includes("Fruitopia Tycoon")||html.includes("Amusement Park Tycoon"))throw new Error("Production build identity check failed");
const required=["dist/index.html","dist/styles.css","dist/game.js","dist/manifest.webmanifest","dist/service-worker.js","dist/icons/apple-icon.svg","dist/src/config.js","dist/src/color-config.js","dist/src/world-expansion-config.js","dist/src/upgrade-config.js","dist/src/investor-config.js","dist/src/outside-config.js","dist/src/sewer-config.js","dist/src/mafia-config.js","dist/src/mafia-game.js","dist/src/core.js","dist/src/world.js","dist/src/minigames.js"];
for(const relative of required){const info=await stat(join(new URL("..",import.meta.url).pathname,relative));if(!info.isFile()||info.size===0)throw new Error(`Missing production asset: ${relative}`);}
console.log(`Fruitopia Tycoon production build complete: ${required.length} verified assets in dist/`);
