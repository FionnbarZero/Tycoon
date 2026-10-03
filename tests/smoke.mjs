import { writeFile } from "node:fs/promises";

const endpoint = process.env.TYCOON_CDP_ENDPOINT || "http://127.0.0.1:9246";
const gameUrl = process.env.TYCOON_GAME_URL || "http://127.0.0.1:8080";
const pages = await fetch(`${endpoint}/json/list`).then(response => response.json());
const page = pages.find(entry => entry.type === "page" && entry.url.startsWith(gameUrl));
if (!page) throw new Error("Amusement Park Tycoon page not found");

const socket = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});
let id = 0;
const pending = new Map();
const exceptions = [];
socket.addEventListener("message", event => {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) {
    const request = pending.get(message.id); pending.delete(message.id);
    message.error ? request.reject(new Error(message.error.message)) : request.resolve(message.result);
  }
  if (message.method === "Runtime.exceptionThrown") exceptions.push(message.params.exceptionDetails.exception?.description || message.params.exceptionDetails.text);
});
const command = (method, params = {}) => {
  const requestId = ++id;
  socket.send(JSON.stringify({ id: requestId, method, params }));
  return new Promise((resolve, reject) => pending.set(requestId, { resolve, reject }));
};
const evaluate = async expression => {
  const response = await command("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (response.exceptionDetails) throw new Error(response.exceptionDetails.exception?.description || response.exceptionDetails.text);
  return response.result.value;
};
const wait = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));
const expect = (condition, message) => { if (!condition) throw new Error(message); };

await command("Runtime.enable");
await command("Page.enable");
await command("Page.bringToFront");
const clearPreload = await command("Page.addScriptToEvaluateOnNewDocument", { source: "localStorage.clear();" });
await command("Page.reload", { ignoreCache: true });
await wait(800);
await command("Page.removeScriptToEvaluateOnNewDocument", { identifier: clearPreload.identifier });

const initial = await evaluate(`({
  title: document.title,
  intro: !document.querySelector('#intro').classList.contains('hidden'),
  tabs: document.querySelectorAll('.dock-tabs button').length,
  canvas: Boolean(document.querySelector('#world'))
})`);
expect(initial.title === "Amusement Park Tycoon", "Unexpected page title");
expect(initial.intro, "Intro screen should be visible on first load");
expect(initial.tabs === 5, "Five build tabs should be present");
expect(initial.canvas, "World canvas is missing");

await evaluate("document.querySelector('#enterGame').click(); true");
await wait(300);
const shell = await evaluate(`({
  objective: document.querySelector('#objectiveTitle').textContent,
  dockLocked: document.querySelector('#buildDock').classList.contains('locked'),
  cash: document.querySelector('#moneyValue').textContent
})`);
expect(shell.objective.includes("job shack"), "Starter objective is incorrect");
expect(shell.dockLocked, "Build dock should remain locked before registration");
expect(shell.cash === "$0", "Unregistered park should start with $0");

const registrationScenario = { version: 1, profile: "", registered: false, toolkit: false, cash: 0, tutorial: 0, player: { x: 3.5, y: 10.5, z: 0 } };
const registrationPreload = await command("Page.addScriptToEvaluateOnNewDocument", {
  source: `localStorage.setItem('amusement-park-tycoon-v1', ${JSON.stringify(JSON.stringify(registrationScenario))});`
});
await command("Page.reload", { ignoreCache: true });
await wait(700);
await command("Page.removeScriptToEvaluateOnNewDocument", { identifier: registrationPreload.identifier });
await evaluate("document.querySelector('#enterGame').click(); window.dispatchEvent(new KeyboardEvent('keydown', { key: 'e', bubbles: true })); window.dispatchEvent(new KeyboardEvent('keyup', { key: 'e', bubbles: true })); true");
await wait(100);
expect(await evaluate("document.querySelector('#modal').textContent.includes('$50,500')"), "Registration should advertise the $50,500 starting budget");
await evaluate("document.querySelector('#profileName').value='Budget Tester'; document.querySelector('#confirmProfile').click(); true");
await wait(100);
expect(await evaluate("document.querySelector('#moneyValue').textContent === '$50,500'"), "Registration did not grant exactly $50,500");

const scenario = {
  version: 1, profile: "Test Manager", registered: true, toolkit: true, cash: 74250,
  totalRevenue: 14500, totalGuests: 312, reputation: 78, atmosphere: 38, cleanliness: 92,
  powerCapacity: 200, waterCapacity: 60, time: 1140, day: 6, speed: 0, lotTier: 2,
  tutorial: 12, buildLevel: 0, activeTab: "attractions", activeTool: null,
  blueprintPacks: { concrete: true, queue: true }, rideInventory: { spinner: 1 }, pendingOrders: [], shipments: [],
  themes: [{x:7,y:7,type:"boardwalk"}], staff: { janitors: 2, mechanics: 1 },
  admission: { model: "hybrid", gatePrice: 12, dayPass: 35, seasonPass: 120 },
  player: { x: 8, y: 12, z: 0 }, stats: { expenses: 42000, profit: 0, complaints: 3 }, weather: "clear",
  unlocked: { spinner: true, skid: true, hairpin: true, hydro: true },
  objects: [
    ...Array.from({length:8},(_,i)=>({id:`path-${i}`,type:"pathConcrete",x:8,y:14-i,z:0,condition:98,dirt:i===2?12:0,price:0})),
    {id:"queue-1",type:"queueStandard",x:9,y:7,z:0,condition:100,dirt:0,price:0},
    {id:"queue-2",type:"queueStandard",x:10,y:7,z:0,condition:100,dirt:0,price:0},
    {id:"ride-1",type:"carousel",x:10,y:4,z:0,condition:87,price:8.5,revenue:6300,state:"built",operator:true,open:true,queue:6,cycles:44},
    {id:"coaster-1",type:"timber",x:1,y:1,z:0,condition:91,price:13.5,revenue:8200,state:"built",operator:true,open:true,queue:8,cycles:64,customName:"Cedar Crest",layout:"Suburban Crest",upgrades:[0,1,2],track:[{x:1,y:1,z:0},{x:2,y:1,z:1},{x:3,y:1,z:2},{x:4,y:1,z:3},{x:5,y:1,z:4},{x:6,y:2,z:2},{x:7,y:3,z:0},{x:6,y:4,z:0},{x:5,y:4,z:1},{x:4,y:4,z:0},{x:3,y:4,z:1},{x:2,y:4,z:0},{x:1,y:3,z:0},{x:1,y:2,z:0},{x:1,y:1,z:0}]},
    {id:"food-1",type:"fry",x:5,y:8,z:0,condition:100,price:6.5,revenue:1400},
    {id:"rest-1",type:"restroomSingle",x:6,y:6,z:0,condition:100,price:.25,revenue:52},
    {id:"block-1",type:"foundation",x:3,y:5,z:0,condition:100,price:0},
    {id:"block-2",type:"foundation",x:4,y:5,z:0,condition:100,price:0},
    {id:"lantern-1",type:"lantern",x:8,y:9,z:0,condition:100,price:0}
  ]
};
const preload = await command("Page.addScriptToEvaluateOnNewDocument", {
  source: `localStorage.setItem('amusement-park-tycoon-v1', ${JSON.stringify(JSON.stringify(scenario))});`
});
await command("Page.reload", { ignoreCache: true });
await wait(900);
await command("Page.removeScriptToEvaluateOnNewDocument", { identifier: preload.identifier });
await evaluate("document.querySelector('#enterGame').click(); true");
await wait(500);
const loaded = await evaluate(`({
  cash: document.querySelector('#moneyValue').textContent,
  rep: document.querySelector('#reputationValue').textContent,
  dockLocked: document.querySelector('#buildDock').classList.contains('locked'),
  complete: document.querySelector('#objectiveStep').textContent,
  errors: document.querySelectorAll('.event-toast.danger').length,
  rideRoster: document.querySelectorAll('#buildItems .build-item').length,
  timberAvailable: !document.querySelector('[data-item=timber]').classList.contains('locked')
})`);
expect(loaded.cash.includes("74,250"), "Saved cash was not restored");
expect(loaded.rep === "78%", "Saved reputation was not restored");
expect(!loaded.dockLocked, "Toolkit should unlock the dock");
expect(loaded.complete === "COMPLETE", "Completed tutorial was not recognized");
expect(loaded.rideRoster === 14, "The active ride roster should contain 14 rides");
expect(loaded.timberAvailable, "Timber Ridge should be available directly from the construction ledger");
await evaluate("document.querySelector('[data-item=timber]').click(); true");
await wait(100);
expect(await evaluate("document.querySelector('#modal').textContent.includes('Custom Track')"), "Timber Ridge should open the custom track builder");
await evaluate("document.querySelector('#coasterName').value='Skyline Test'; document.querySelector('[data-track-custom]').click(); true");
await wait(50);
expect(await evaluate("document.querySelector('#worldMessage').textContent.includes('Track Editor')"), "Custom track editor did not activate");
await evaluate("window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); true");
await wait(50);
await evaluate("document.querySelector('[data-item=timber]').click(); true");
await wait(50);
await evaluate("document.querySelector('#coasterName').value='Smoke Ridge'; document.querySelector('[data-layout=suburban]').click(); true");
await wait(50);
await evaluate(`(() => {
  const canvas = document.querySelector('#world');
  const rect = canvas.getBoundingClientRect();
  const x = rect.left + rect.width * .38;
  const y = rect.top + 58 + (7.5 + 7.5) * 16;
  canvas.dispatchEvent(new PointerEvent('pointerdown', { bubbles:true, button:0, pointerId:77, clientX:x, clientY:y }));
  canvas.dispatchEvent(new PointerEvent('pointerup', { bubbles:true, button:0, pointerId:77, clientX:x, clientY:y }));
  return true;
})()`);
await wait(100);
const coasterPlacement = await evaluate(`({ title: document.querySelector('#inspectorTitle').textContent, message: document.querySelector('#worldMessage').textContent })`);
expect(coasterPlacement.title === "Smoke Ridge", "Validated prebuilt coaster was not anchored");
expect(exceptions.length === 0, `Runtime exceptions: ${exceptions.join("\n")}`);

const screenshot = await command("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
await writeFile("/tmp/amusement-tycoon-smoke.png", Buffer.from(screenshot.data, "base64"));
socket.close();
console.log(JSON.stringify({ ok: true, initial, shell, loaded, screenshot: "/tmp/amusement-tycoon-smoke.png" }, null, 2));
