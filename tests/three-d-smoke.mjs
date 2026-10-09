import {writeFile} from "node:fs/promises";
import {connect,expect} from "./cdp.mjs";

const browser=await connect();
const{command,evaluate,wait,exceptions,consoleErrors}=browser;
const ready=async()=>{await wait(350);for(let attempt=0;attempt<120;attempt++){if(await evaluate("Boolean(window.__FRUITOPIA__?.world?.perspectiveCamera)"))return true;await wait(100);}return false;};

expect(await ready(),"Perspective 3D world did not initialize");
await evaluate(`(()=>{const g=__FRUITOPIA__;if(g.core.state.sewer.active){g.core.leaveSewer();g.world.rebuild(true);g.world.findPlayer();}document.querySelector('[data-action=close-dialog]')?.click();document.querySelector('#world').focus();return true;})()`);
await evaluate("__FRUITOPIA__.world.setCameraDistance(8);true");await wait(250);
const initial=await evaluate(`(()=>{const g=__FRUITOPIA__,w=g.world;return{
  webgl:w.webgl,
  perspective:w.perspectiveCamera.isPerspectiveCamera,
  sceneChildren:w.scene.children.length,
  worldObjects:w.root.children.length,
  playerVisible:w.playerGroup.visible,
  distance:w.targetDistance,
  indicator:document.querySelector('#cameraIndicator b').textContent,
  buildings:w.root.children.filter(item=>item.type==='Group').length,
  countrySpacing:w.countrySpacing,
  physicalSignCount:w.physicalSigns.length,
  visiblePhysicalSigns:w.physicalSigns.filter(item=>item.object.visible).length,
  signTexts:w.physicalSigns.map(item=>item.object.userData.signText),
  proximityLabelCount:w.proximityLabels.length,
  visibleProximityLabels:w.proximityLabels.filter(item=>item.object.visible).length,
  treeRows:g.core.state.trees.slice(0,6).map(tree=>[tree.x,tree.y]),
  controls:document.querySelector('#controlHint').textContent,
  mobile:Boolean(document.querySelector('#cameraDistance')&&document.querySelector('[data-control=interact]'))
}})()`);
expect(initial.webgl&&initial.perspective,"World is not using a real WebGL perspective camera");
expect(initial.sceneChildren>=4&&initial.worldObjects>100,"3D scene did not create terrain, buildings, trees, roads, and characters");
expect(initial.playerVisible&&initial.indicator.includes("Third Person"),"Game did not open in third-person view");
expect(initial.controls.includes("Wheel to change view")&&initial.mobile,"Camera controls or mobile fallback are missing");
expect(initial.countrySpacing>=2.2,"The surface world was not expanded to country-scale spacing");
for(const text of ["SUNNY SIDE FRUIT STAND","APPLE GROVE ORCHARD","FRUITOPIA OFFICE","DELIVERY DEPOT","FRUIT RESEARCH LAB","MARKET TOWN","SHIPPING HARBOR ↓","MOUNTAIN ROAD ↑","MINIGAME ARCADE →"])expect(initial.signTexts.includes(text),`Missing readable physical sign: ${text}`);
expect(initial.physicalSignCount>=25&&initial.visiblePhysicalSigns<initial.physicalSignCount,"Physical signs are missing or distant signs are not being culled");
expect(initial.proximityLabelCount>0&&initial.visibleProximityLabels<initial.proximityLabelCount,"Supplemental labels are not proximity-controlled");
expect(JSON.stringify(initial.treeRows)===JSON.stringify([[78,408],[86,408],[94,408],[78,418],[86,418],[94,418]]),"Starter apple trees are not arranged in two walkable rows");

const rect=await evaluate(`(()=>{const r=document.querySelector('#world').getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.height/2}})()`);
const originalYaw=await evaluate("__FRUITOPIA__.world.yaw");
for(let index=0;index<6;index++)await command("Input.dispatchMouseEvent",{type:"mouseWheel",x:rect.x,y:rect.y,deltaX:0,deltaY:-150});
await wait(500);
const firstPerson=await evaluate(`(()=>{const w=__FRUITOPIA__.world;return{distance:w.targetDistance,mode:__FRUITOPIA__.core.state.camera.mode,yaw:w.yaw,playerVisible:w.playerGroup.visible,crosshair:getComputedStyle(document.querySelector('#crosshair')).display,indicator:document.querySelector('#cameraIndicator b').textContent}})()`);
expect(firstPerson.distance===0&&firstPerson.mode==="first-person","Wheel-up zoom did not enter first person");
expect(firstPerson.yaw===originalYaw&&!firstPerson.playerVisible,"Changing view reset facing or left the player body in front of the camera");
expect(firstPerson.crosshair!=="none"&&firstPerson.indicator==="First Person","First-person crosshair or indicator is missing");

await evaluate("document.querySelector('[data-action=close-dialog]')?.click();document.querySelector('#world').focus();true");
await command("Input.dispatchKeyEvent",{type:"keyDown",key:"v",code:"KeyV",windowsVirtualKeyCode:86});await command("Input.dispatchKeyEvent",{type:"keyUp",key:"v",code:"KeyV",windowsVirtualKeyCode:86});
let vRestored=false;for(let attempt=0;attempt<20&&!vRestored;attempt++){await wait(100);vRestored=await evaluate("__FRUITOPIA__.world.targetDistance>=5 && __FRUITOPIA__.world.playerGroup.visible");}expect(vRestored,"V did not restore the normal third-person camera");
await command("Input.dispatchMouseEvent",{type:"mouseWheel",x:rect.x,y:rect.y,deltaX:0,deltaY:450});await wait(250);
expect(await evaluate("__FRUITOPIA__.world.targetDistance>__FRUITOPIA__.core.state.camera.normalDistance-1"),"Wheel-down zoom did not pull the camera backward");

await evaluate(`(()=>{const g=__FRUITOPIA__,w=g.world;w.yaw=Math.PI/2;w.pitch=-.18;w.setCameraDistance(6);g.core.state.player.x=105;g.core.state.player.y=430;w.findPlayer();document.querySelector('#world').focus();return true;})()`);
const beforeMove=await evaluate("structuredClone(__FRUITOPIA__.core.state.player)");
await command("Input.dispatchKeyEvent",{type:"keyDown",key:"w",code:"KeyW",windowsVirtualKeyCode:87});await wait(500);await command("Input.dispatchKeyEvent",{type:"keyUp",key:"w",code:"KeyW",windowsVirtualKeyCode:87});
const afterMove=await evaluate("structuredClone(__FRUITOPIA__.core.state.player)");
expect(afterMove.x>beforeMove.x+.5,"W movement was not relative to the camera direction");
expect(await evaluate("!__FRUITOPIA__.world.canMoveTo(112,400) && !__FRUITOPIA__.world.canMoveTo(700,20)"),"Building or locked-region collision is not enforced");

await evaluate(`(()=>{const g=__FRUITOPIA__,tree=g.core.state.trees[0],w=g.world;g.core.state.player.x=tree.x;g.core.state.player.y=tree.y+4;w.yaw=0;w.pitch=.18;w.setCameraDistance(0);w.findPlayer();return true;})()`);await wait(500);
const target=await evaluate("__FRUITOPIA__.world.targetedEntity?.type||null");
expect(target==="tree","First-person crosshair did not prioritize the targeted fruit tree");
await command("Input.dispatchKeyEvent",{type:"keyDown",key:"e",code:"KeyE",windowsVirtualKeyCode:69});await command("Input.dispatchKeyEvent",{type:"keyUp",key:"e",code:"KeyE",windowsVirtualKeyCode:69});await wait(150);
expect(await evaluate("document.querySelector('#dialogTitle')?.textContent.includes('Tree')||document.querySelector('#dialogTitle')?.textContent.includes('Apple')"),"E did not interact with the crosshair-targeted tree");
await evaluate("document.querySelector('[data-action=close-dialog]')?.click();true");

await evaluate(`(()=>{const g=__FRUITOPIA__;g.core.state.sewer.entrances['sunny-manhole'].open=true;g.core.enterSewer('sunny-manhole');g.world.findPlayer();return true;})()`);await wait(900);
const sewer=await evaluate(`(()=>{const w=__FRUITOPIA__.world;w.setCameraDistance(18);return{mode:w.worldMode,maxed:w.targetDistance,exits:w.entities.filter(item=>item.type==='sewer-exit').length,pumps:w.entities.filter(item=>item.type==='sewer-pump').length,water:w.entities.filter(item=>item.type==='water-point').length,networkMaps:w.entities.filter(item=>item.type==='sewer-network-map').length,northMaps:w.entities.filter(item=>item.type==='sewer-north-map').length,signTexts:w.physicalSigns.map(item=>item.object.userData.signText),fog:w.scene.fog?.isFogExp2===true}})()`);
expect(sewer.mode==="sewer"&&sewer.maxed===8&&sewer.exits>=1&&sewer.pumps===4&&sewer.water>=5&&sewer.fog,"Sewer did not rebuild as a constrained 3D underground world");
expect(sewer.networkMaps===1,"Central Sewer Hub is missing its interactive underground network map");
expect(sewer.northMaps===1,"North Pipe Maze is missing its interactive annex plan");
for(const text of ["WEST SEWER TUNNEL","CENTRAL SEWER HUB","EAST SEWER TUNNEL","MAFIA ENTRANCE","NORTH PIPE MAZE","GREEN-WATER CAVE","MAFIA CARD ROOM","D1 DEAD END","LAB LIFT","UNDERGROUND MACHINE ROOM"])expect(sewer.signTexts.includes(text),`Missing readable sewer sign: ${text}`);

await evaluate(`(()=>{const g=__FRUITOPIA__;g.core.leaveSewer();g.world.setCameraDistance(14);g.world.yaw=.73;g.core.state.camera.yaw=.73;g.save();return true;})()`);
expect(await evaluate(`(()=>{const saved=JSON.parse(localStorage.getItem(__FRUITOPIA__.Config.SAVE_KEY));return saved.camera.distance===14&&Math.abs(saved.camera.yaw-.73)<.001&&saved.version===21})()`),"Selected camera distance and facing were not serialized");
await command("Page.reload",{ignoreCache:true});await wait(1000);expect(await ready(),"3D game did not reopen from the camera save");
expect(await evaluate("__FRUITOPIA__.world.targetDistance===14 && Math.abs(__FRUITOPIA__.world.yaw-.73)<.001"),"Saved camera distance or facing did not restore after reopening");

const shot=await command("Page.captureScreenshot",{format:"png",captureBeyondViewport:false});await writeFile("/tmp/fruitopia-3d-camera.png",Buffer.from(shot.data,"base64"));
expect(exceptions.length===0,`3D runtime exceptions:\n${exceptions.join("\n")}`);
expect(consoleErrors.length===0,`3D console errors:\n${consoleErrors.join("\n")}`);
browser.close();
console.log(JSON.stringify({ok:true,initial,firstPerson,beforeMove,afterMove,sewer,screenshot:"/tmp/fruitopia-3d-camera.png"},null,2));
