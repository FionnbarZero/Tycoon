import {writeFile} from "node:fs/promises";
import {connect,expect} from "./cdp.mjs";

const browser=await connect();const{command,evaluate,wait,exceptions,consoleErrors}=browser;
const clear=await command("Page.addScriptToEvaluateOnNewDocument",{source:"localStorage.clear();"});
await command("Page.reload",{ignoreCache:true});await wait(1000);await command("Page.removeScriptToEvaluateOnNewDocument",{identifier:clear.identifier});

const initial=await evaluate(`({
  title:document.title,
  cash:document.querySelector('#cashValue').textContent,
  nav:document.querySelectorAll('#mainNav [data-nav]').length,
  canvas:Boolean(document.querySelector('#world')),
  touchPad:Boolean(document.querySelector('#touchPad')),
  exposed:Boolean(window.__FRUITOPIA__),
  trees:window.__FRUITOPIA__?.core.state.trees.length,
  counts:window.__FRUITOPIA__?{fruits:__FRUITOPIA__.Config.FRUITS.length,recipes:__FRUITOPIA__.Config.RECIPES.length,buildings:__FRUITOPIA__.Config.BUILDINGS.length,routes:__FRUITOPIA__.Config.ROUTES.length,workers:__FRUITOPIA__.Config.WORKERS.length,minigames:__FRUITOPIA__.Config.MINIGAMES.length,sewerEntrances:__FRUITOPIA__.Config.SEWER_ENTRANCES.length,sewerRecipes:__FRUITOPIA__.Config.SEWER_RECIPES.length}:{},
  saveVersion:window.__FRUITOPIA__?.core.state.version,
  futureMafiaPlayable:window.__FRUITOPIA__?.Config.FUTURE_MAFIA_GAME.playable
})`);
expect(initial.title==="Fruitopia Tycoon","Wrong title");expect(initial.cash==="$1","New game must start with $1");expect(initial.nav===9,"Nine main navigation buttons required");expect(initial.canvas&&initial.touchPad&&initial.exposed,"Game shell missing");expect(initial.trees===6,"Six trees required");expect(JSON.stringify(initial.counts)===JSON.stringify({fruits:28,recipes:21,buildings:106,routes:18,workers:14,minigames:11,sewerEntrances:6,sewerRecipes:8}),"Catalog count mismatch");expect(initial.saveVersion===9,"Save version must be 9");expect(initial.futureMafiaPlayable===true,"Mystery Crate configuration must be playable");

await wait(150);
expect(await evaluate("window.__FRUITOPIA__.world.entities.filter(entity=>entity.type==='manhole').length===6"),"Six visible surface manholes were not rendered");
const manholePoint=await evaluate(`(()=>{const game=window.__FRUITOPIA__,entrance=game.Config.SEWER_ENTRANCES[0];game.core.state.player.x=entrance.x;game.core.state.player.y=entrance.y;game.world.findPlayer();const p=game.world.worldToScreen(entrance.x,entrance.y),r=document.querySelector('#world').getBoundingClientRect();return{x:r.left+p.x,y:r.top+p.y};})()`);
await command("Input.dispatchMouseEvent",{type:"mousePressed",button:"left",clickCount:1,x:manholePoint.x,y:manholePoint.y});await command("Input.dispatchMouseEvent",{type:"mouseReleased",button:"left",clickCount:1,x:manholePoint.x,y:manholePoint.y});
let manholeOpened=false;for(let attempt=0;attempt<30&&!manholeOpened;attempt++){await wait(100);manholeOpened=await evaluate("document.querySelector('#dialogTitle')?.textContent==='Sunny Side Manhole'");}expect(manholeOpened,"Approaching and clicking a manhole did not open its interaction");
await evaluate("document.querySelector('[data-do=manhole][data-value=inspect]').click();true");await wait(70);await evaluate("document.querySelector('[data-do=manhole][data-value=open]').click();true");await wait(70);expect(await evaluate("Boolean(document.querySelector('[data-do=enter-sewer]'))"),"Opened manhole lacks Enter Sewer button");await evaluate("document.querySelector('[data-do=enter-sewer]').click();true");await wait(200);
expect(await evaluate("window.__FRUITOPIA__.core.state.sewer.active && !document.querySelector('#sewerHud').classList.contains('hidden')"),"Entering the sewer did not switch to the underground world");let sewerRendered=false;for(let attempt=0;attempt<30&&!sewerRendered;attempt++){await wait(100);sewerRendered=await evaluate("window.__FRUITOPIA__.world.entities.some(entity=>entity.type==='sewer-lab') && window.__FRUITOPIA__.world.entities.some(entity=>entity.type==='sewer-map')");}expect(sewerRendered,"Explorable sewer objects were not rendered");

await evaluate("(()=>{const g=window.__FRUITOPIA__;g.core.state.sewer.player={x:52,y:48,section:'sewer-maze'};g.core.updateSewerLocation();g.openPage('sewer-object','sewer-map:entrance-map');return true;})()");await wait(60);expect(await evaluate("Boolean(document.querySelector('.maze-map'))"),"Entrance-only full maze map did not render at the entrance");await evaluate("(()=>{const g=window.__FRUITOPIA__;g.core.state.sewer.player.x=70;g.openPage('sewer-object','sewer-map:entrance-map');return true;})()");await wait(60);expect(await evaluate("!document.querySelector('.maze-map') && document.querySelector('#dialog').textContent.includes('Map unavailable')"),"Full maze map remained available away from the entrance");

await evaluate(`(()=>{const g=window.__FRUITOPIA__;g.core.state.sewer.mafia.invitation=true;g.core.state.cash=100;const joined=g.core.buyMafiaMembership();if(!joined.ok)throw new Error(joined.message);g.openPage('sewer','club');return true;})()`);await wait(80);
expect(await evaluate("document.querySelectorAll('[data-plinko-slot]').length===7 && document.querySelectorAll('[data-plinko-slot]')[3].textContent.includes('JACKPOT')"),"Plinko board or center jackpot is missing");expect(await evaluate("document.querySelector('.private-room').textContent.includes('Mystery Crate') && Boolean(document.querySelector('[data-nav=mafia-game]'))"),"Playable Mystery Crate room is missing from the club");
await evaluate("document.querySelector('[data-nav=mafia-game]').click();true");await wait(80);expect(await evaluate("document.querySelector('#dialogTitle').textContent.includes('Mystery Crate') && document.querySelectorAll('#mafiaOpponents option').length===7 && document.querySelector('[data-do=mafia-start]')"),"Mystery Crate setup did not render");await evaluate("document.querySelector('[data-do=mafia-start]').click();true");await wait(100);expect(await evaluate("(()=>{const g=window.__FRUITOPIA__,human=g.core.state.sewer.mafiaGame.participants.find(p=>p.human);return document.querySelectorAll('.mafia-seat').length===4&&human.hand.length===2&&Boolean(document.querySelector('.mystery-crate'))&&!document.querySelector('[data-do=mafia-attack]');})()"),"Mystery Crate table, starting cards, or event-only attack rule failed");await evaluate("document.querySelector('[data-do=mafia-next]').click();true");await wait(80);expect(await evaluate("window.__FRUITOPIA__.core.state.sewer.mafiaGame.turn===1 && document.querySelector('.mafia-history').textContent.length>0"),"Mystery Crate did not produce and log an event");const mysteryScreenshot=await command("Page.captureScreenshot",{format:"png",captureBeyondViewport:false});await writeFile("/tmp/fruitopia-mystery-crate.png",Buffer.from(mysteryScreenshot.data,"base64"));await evaluate("window.__FRUITOPIA__.openPage('sewer','club');true");await wait(60);
await evaluate("document.querySelector('[data-do=plinko-drop]').click();true");await wait(80);expect(await evaluate("(()=>{const g=window.__FRUITOPIA__,ball=document.querySelector('.plinko-ball');return Boolean(ball)&&Number(ball.dataset.slot)===g.core.state.sewer.plinko.pending.visualSlot&&g.core.state.sewer.plinko.pending.slotIndex===g.core.state.sewer.plinko.pending.visualSlot;})()"),"Plinko visual slot does not match its stored reward");await evaluate("(()=>{const g=window.__FRUITOPIA__;g.core.state.sewer.plinko.pending.readyAt=g.core.now-1;g.openPage('sewer','club');document.querySelector('[data-do=collect-plinko]').click();return true;})()");await wait(60);expect(await evaluate("window.__FRUITOPIA__.core.state.sewer.plinko.history.length===1"),"Plinko result was not collected exactly once");
await evaluate("(()=>{const g=window.__FRUITOPIA__;g.core.state.sewer.mafia.clubChips=10;g.openPage('sewer','club');document.querySelector('[data-do=spin-slots]').click();return true;})()");await wait(80);expect(await evaluate("(()=>{const g=window.__FRUITOPIA__,reels=document.querySelector('.slot-reels');return reels.dataset.reels===g.core.state.sewer.slots.pending.visualReels.join('')&&g.core.state.sewer.slots.pending.reels.join('')===g.core.state.sewer.slots.pending.visualReels.join('');})()"),"Fruit slot visual reels do not match their stored result");await evaluate("(()=>{const g=window.__FRUITOPIA__;g.core.state.sewer.slots.pending.readyAt=g.core.now-1;g.openPage('sewer','club');document.querySelector('[data-do=collect-slots]').click();return true;})()");await wait(60);expect(await evaluate("window.__FRUITOPIA__.core.state.sewer.slots.history.length===1"),"Fruit slot result was not collected exactly once");
await evaluate("(()=>{const g=window.__FRUITOPIA__;g.openPage('sewer','overview');document.querySelector('[data-do=leave-sewer]').click();return true;})()");await wait(100);expect(await evaluate("!window.__FRUITOPIA__.core.state.sewer.active && document.querySelector('#sewerHud').classList.contains('hidden')"),"Returning to the surface failed");

await evaluate("document.querySelector('[data-nav=company]').click();true");await wait(100);
expect(await evaluate("document.querySelector('#dialogTitle').textContent==='Fruitopia Company' && document.querySelectorAll('[data-nav=district]').length===8"),"Company districts screen missing");
await evaluate("document.querySelector('[data-do=subpage][data-value=buildings]').click();true");await wait(100);
expect(await evaluate("document.querySelectorAll('[data-building-card]').length===106"),"Company screen must expose all 106 buildings");
await evaluate("document.querySelector('#buildingCategory').value='Fruit Labs';document.querySelector('#buildingCategory').dispatchEvent(new Event('change',{bubbles:true}));true");
expect(await evaluate("[...document.querySelectorAll('[data-building-card]:not(.hidden)')].length===10"),"Building category filter failed");
await evaluate("document.querySelector('[data-action=close-dialog]').click();true");

const treePoint=await evaluate(`(()=>{const game=window.__FRUITOPIA__,tree=game.core.state.trees[0];game.core.state.player.x=tree.x-1;game.core.state.player.y=tree.y;game.world.findPlayer();const p=game.world.worldToScreen(tree.x,tree.y),r=document.querySelector('#world').getBoundingClientRect();return{x:r.left+p.x,y:r.top+p.y};})()`);
await wait(200);
await command("Input.dispatchMouseEvent",{type:"mousePressed",button:"left",clickCount:1,x:treePoint.x,y:treePoint.y});await command("Input.dispatchMouseEvent",{type:"mouseReleased",button:"left",clickCount:1,x:treePoint.x,y:treePoint.y});
let treeOpened=false;for(let attempt=0;attempt<30&&!treeOpened;attempt++){await wait(100);treeOpened=await evaluate("document.querySelector('#dialogTitle')?.textContent==='Apple Tree'");}
expect(treeOpened,"Click-to-walk tree interaction did not open");
await evaluate("document.querySelector('[data-do=harvest-tree]').click();true");await wait(100);
expect(await evaluate("window.__FRUITOPIA__.core.state.stats.harvested>=1"),"Tree harvest failed");

await evaluate("document.querySelector('[data-action=close-dialog]').click();document.querySelector('[data-nav=recipes]').click();true");await wait(100);
expect(await evaluate("document.querySelectorAll('[data-do=craft]').length===21"),"All 21 recipes missing");
await evaluate("document.querySelector('[data-action=close-dialog]').click();document.querySelector('[data-nav=phone]').click();true");
expect(await evaluate("document.querySelector('#dialog').textContent.includes('Smartphone locked') && document.querySelector('[data-do=go-office-upgrades]')"),"Locked phone must explain exact upgrades");

await evaluate("document.querySelector('[data-action=close-dialog]').click();window.__FRUITOPIA__.core.state.districts['sunny-side-fruit-stand'].upgrades=[0,1,2,3];document.querySelector('[data-nav=arcade]').click();true");await wait(100);
expect(await evaluate("document.querySelectorAll('[data-do=start-minigame]').length===11"),"All 11 minigames missing");
await evaluate("document.querySelector('[data-do=start-minigame][data-id=the-big-ask]').click();true");await wait(150);
expect(await evaluate("document.querySelector('#minigameMount')?.classList.contains('minigame-stage')"),"Minigame did not start");
await evaluate("document.querySelector('[data-do=end-minigame]').click();true");await wait(50);
expect(await evaluate("document.querySelector('#minigameMount').textContent.includes('Run complete')"),"Minigame could not finish");
await evaluate("document.querySelector('#minigameMount button.primary-button').click();true");await wait(50);
const minigameRuns=await evaluate("window.__FRUITOPIA__.core.state.minigames.runs");expect(minigameRuns===1,"Minigame reward not recorded once");

await evaluate("document.querySelector('[data-action=close-dialog]').click();document.querySelector('[data-nav=office]').click();true");await wait(100);
expect(await evaluate("document.querySelectorAll('.office-object').length===17 && Boolean(document.querySelector('#officePlayer'))"),"Walkable office must include 17 objects");

const layouts=[];
for(const [width,height,label] of [[1440,900,"desktop"],[900,1024,"tablet"],[390,844,"mobile"]]){
  await command("Emulation.setDeviceMetricsOverride",{width,height,deviceScaleFactor:1,mobile:label==="mobile"});await wait(180);
  const layout=await evaluate(`({label:${JSON.stringify(label)},overflow:document.documentElement.scrollWidth>innerWidth+1,dialogOverflow:document.querySelector('#dialog').scrollWidth>document.querySelector('#dialog').clientWidth+1,navVisible:getComputedStyle(document.querySelector('#mainNav')).display!=='none',touchVisible:getComputedStyle(document.querySelector('#touchPad')).display})`);layouts.push(layout);expect(!layout.overflow,`${label} has horizontal page overflow`);expect(!layout.dialogOverflow,`${label} dialog overflows horizontally`);expect(layout.navVisible,`${label} navigation hidden`);if(label==="mobile")expect(layout.touchVisible==="grid","Mobile touch controls hidden");
}
await command("Emulation.clearDeviceMetricsOverride");

await evaluate(`(()=>{const dialog=document.querySelector('#dialog'),focus=[...dialog.querySelectorAll("button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex='0']")];focus.at(-1).focus();return focus.at(-1)===document.activeElement;})()`);
await command("Input.dispatchKeyEvent",{type:"keyDown",key:"Tab",code:"Tab",windowsVirtualKeyCode:9});await command("Input.dispatchKeyEvent",{type:"keyUp",key:"Tab",code:"Tab",windowsVirtualKeyCode:9});
expect(await evaluate("document.querySelector('#dialog').contains(document.activeElement)"),"Dialog focus escaped");
await command("Input.dispatchKeyEvent",{type:"keyDown",key:"Escape",code:"Escape",windowsVirtualKeyCode:27});await command("Input.dispatchKeyEvent",{type:"keyUp",key:"Escape",code:"Escape",windowsVirtualKeyCode:27});
expect(await evaluate("document.querySelector('#dialogLayer').classList.contains('hidden')"),"Escape did not close dialog");

expect(exceptions.length===0,`Runtime exceptions:\n${exceptions.join("\n")}`);expect(consoleErrors.length===0,`Console errors:\n${consoleErrors.join("\n")}`);
const screenshot=await command("Page.captureScreenshot",{format:"png",captureBeyondViewport:false});await writeFile("/tmp/fruitopia-tycoon-smoke.png",Buffer.from(screenshot.data,"base64"));
browser.close();console.log(JSON.stringify({ok:true,initial,layouts,screenshot:"/tmp/fruitopia-tycoon-smoke.png"},null,2));
