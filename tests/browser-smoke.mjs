import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import { DISTRICTS } from '../js/config.js';
import { EXPANDED_EVENTS } from '../js/expansion-config.js';

const endpoint = process.env.FRUITOPIA_CDP || 'http://127.0.0.1:9228';
const pageUrl = process.env.FRUITOPIA_URL || 'http://127.0.0.1:8000/?testMode=1';
const targets = await fetch(`${endpoint}/json/list`).then(response => response.json());
const target = targets.find(item => item.type === 'page');
assert.ok(target, 'A Chrome page target must exist');

const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  ws.addEventListener('open', resolve, { once: true });
  ws.addEventListener('error', reject, { once: true });
});

let sequence = 0;
const pending = new Map();
const browserErrors = [];
ws.addEventListener('message', event => {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) {
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(message.error.message));
    else resolve(message.result);
    return;
  }
  if (message.method === 'Runtime.exceptionThrown') browserErrors.push(message.params.exceptionDetails.exception?.description || message.params.exceptionDetails.text);
  if (message.method === 'Log.entryAdded' && message.params.entry.level === 'error') browserErrors.push(message.params.entry.text);
  if (message.method === 'Runtime.consoleAPICalled' && message.params.type === 'error') browserErrors.push(message.params.args.map(arg => arg.value || arg.description).join(' '));
});

function send(method, params = {}) {
  const id = ++sequence;
  ws.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

async function evaluate(expression) {
  const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true, userGesture: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
  return result.result.value;
}

async function waitFor(expression, timeout = 9000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    if (await evaluate(`Boolean(${expression})`)) return;
    await new Promise(resolve => setTimeout(resolve, 80));
  }
  throw new Error(`Timed out waiting for: ${expression}`);
}

await Promise.all([
  send('Runtime.enable'), send('Log.enable'), send('Page.enable'),
  send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false })
]);
await send('Page.navigate', { url: pageUrl });
await send('Page.bringToFront');
await waitFor('window.__fruitopia');
await evaluate('localStorage.clear(); window.__fruitopia.reset()');
await waitFor('document.querySelectorAll("[data-tree]").length === 22');

const initial = await evaluate('window.__fruitopia.getState()');
assert.equal(initial.cash, 1);
assert.equal(initial.level, 1);
assert.equal(initial.version, 5);
assert.equal(await evaluate('document.querySelectorAll("[data-district]").length'), 8);
assert.equal(await evaluate('document.querySelectorAll("[data-tree].ready").length >= 6'), true);
assert.equal(await evaluate('document.querySelectorAll("[data-open-office-world]").length'), 1);

// Keyboard world movement and the $1 first purchase.
const startX = initial.player.x;
await evaluate('document.querySelector("#worldViewport").focus()');
await evaluate('document.querySelector("#worldViewport").dispatchEvent(new KeyboardEvent("keydown",{key:"d",bubbles:true}))');
assert.equal(await evaluate('window.__fruitopia.heldKeys().includes("d")'), true);
await evaluate('window.__fruitopia.stepMovement()');
await evaluate('document.querySelector("#worldViewport").dispatchEvent(new KeyboardEvent("keyup",{key:"d",bubbles:true}))');
const movementProbe = await evaluate('({x:window.__fruitopia.getState().player.x,hidden:document.hidden,focus:document.activeElement?.id,modal:Boolean(document.querySelector(".modal-backdrop"))})');
assert.ok(movementProbe.x > startX, `keyboard movement failed: ${JSON.stringify(movementProbe)}`);
await evaluate('window.__fruitopia.open("office")');
await waitFor('document.querySelector(".office-scene")');
assert.equal(await evaluate('document.querySelectorAll(".office-object").length'), 17);
await evaluate('document.querySelector("[data-office-upgrades]").click()');
await waitFor('document.querySelector("[data-office-upgrade=basic_phone]")');
await evaluate('document.querySelector("[data-office-upgrade=basic_phone]").click()');
assert.equal(await evaluate('window.__fruitopia.getState().office.upgrades.includes("basic_phone")'), true);
assert.equal(await evaluate('window.__fruitopia.getState().cash'), 0);

// Insufficient funds remain atomic, then unlock the phone early through real UI.
await evaluate('window.__fruitopia.closeModal(); document.querySelector("[data-district=stand]").click(); document.querySelector("[data-upgrade=sign]").click()');
assert.equal(await evaluate('window.__fruitopia.getState().upgrades.stand.length'), 0);
await evaluate('window.__fruitopia.closeModal(); window.__fruitopia.setResources({cash:100,coins:10,level:2}); window.__fruitopia.open("office")');
await waitFor('document.querySelector("[data-office-upgrades]")');
await evaluate('document.querySelector("[data-office-upgrades]").click(); document.querySelector("[data-office-upgrade=smartphone]").click()');
assert.equal(await evaluate('window.__fruitopia.getState().phone.unlocked'), true);
await evaluate('window.__fruitopia.open("phone")');
await waitFor('document.querySelector(".phone-device:not(.locked-phone)")');
assert.equal(await evaluate('document.querySelectorAll("[data-phone-app]").length'), 13);

// Harvest, care states, and Fruit Coin-capable manual interaction.
await evaluate('window.__fruitopia.closeModal()');
const beforeHarvest = await evaluate('window.__fruitopia.getState()');
await evaluate('document.querySelector("[data-tree].ready").click()');
const afterHarvest = await evaluate('window.__fruitopia.getState()');
assert.ok(afterHarvest.stats.harvest > beforeHarvest.stats.harvest);
assert.ok(afterHarvest.xp > beforeHarvest.xp);
await evaluate('document.querySelector("[data-tree].harvested").click()');
await waitFor('document.querySelector("[data-tree-action=water]")');
assert.equal(await evaluate('document.querySelectorAll("[data-tree-action]").length'), 4);

// Fund and inspect the complete construction catalog, then run a timed factory batch.
await evaluate('window.__fruitopia.closeModal(); window.__fruitopia.setResources({cash:10000000,coins:5000,level:20}); window.__fruitopia.fillInventory(40); window.__fruitopia.setExpansion({reputation:60,research:20,quality:5}); window.__fruitopia.open("company")');
await waitFor('document.querySelectorAll("[data-building-category]").length === 9');
assert.equal(await evaluate('document.querySelector(".company-totals").textContent.includes("/86")'), true);
await evaluate('document.querySelector("[data-building-category=\\"Food Production\\"]").click()');
await waitFor('document.querySelector("[data-building-buy=juice_bar]")');
await evaluate('document.querySelector("[data-building-buy=juice_bar]").click()');
assert.equal(await evaluate('window.__fruitopia.getState().buildings.juice_bar'), 1);
await evaluate('document.querySelector("[data-produce=juice_bar]").click()');
assert.equal(await evaluate('window.__fruitopia.getState().production.filter(job => !job.claimed).length'), 1);
await evaluate('window.__fruitopia.finishProduction()');
assert.ok(await evaluate('window.__fruitopia.getState().products.sunshine_juice > 0'));

// Worker management and a queued, consequential office conversation.
await evaluate('window.__fruitopia.closeModal(); window.__fruitopia.open("workers")');
await waitFor('document.querySelectorAll(".worker-card").length === 14');
await evaluate('document.querySelector("[data-worker-hire=cashier]").click()');
assert.equal(await evaluate('window.__fruitopia.getState().workerRoster.cashier.hired'), true);
await evaluate('window.__fruitopia.closeModal(); window.__fruitopia.open("office")');
await waitFor('document.querySelector("[data-invite-worker]")');
await evaluate('document.querySelector("[data-invite-worker]").click()');
await waitFor('document.querySelector("[data-office-worker]")');
await evaluate('document.querySelector("[data-office-worker]").click()');
await waitFor('document.querySelector(".conversation-scene")');
assert.ok((await evaluate('document.querySelectorAll("[data-worker-choice]").length')) >= 3);
await evaluate('document.querySelector("[data-worker-choice]").click()');
assert.equal(await evaluate('window.__fruitopia.getState().stats.conversation'), 1);

// Phone order negotiation, supply, and payment are all single-collection interactions.
await evaluate('window.__fruitopia.closeModal(); window.__fruitopia.fillInventory(100); window.__fruitopia.fillProducts(100)');
const order = await evaluate('window.__fruitopia.generateOrder()');
await evaluate(`window.__fruitopia.respondOrder(${JSON.stringify(order.id)}, "accept")`);
const supply = await evaluate(`window.__fruitopia.supplyOrder(${JSON.stringify(order.id)})`);
assert.equal(supply.ok, true);
const cashBeforePayment = await evaluate('window.__fruitopia.getState().cash');
await evaluate(`window.__fruitopia.collectPayment(${JSON.stringify(order.id)})`);
const cashAfterPayment = await evaluate('window.__fruitopia.getState().cash');
assert.ok(cashAfterPayment > cashBeforePayment);
await evaluate(`window.__fruitopia.collectPayment(${JSON.stringify(order.id)})`);
assert.equal(await evaluate('window.__fruitopia.getState().cash'), cashAfterPayment);

// District construction, teleporter, and its minigame purchase via real buttons.
await evaluate('window.__fruitopia.open("company"); window.__fruitopia.closeModal(); document.querySelector("[data-district=stand]").click()');
for (let index = 0; index < 6; index += 1) await evaluate('document.querySelector("[data-upgrade]:not(:disabled)").click()');
assert.equal(await evaluate('window.__fruitopia.getState().upgrades.stand.length'), 6);
assert.equal(await evaluate('window.__fruitopia.getState().teleporters.includes("stand")'), true);
await evaluate('document.querySelector("[data-buy-game=stand]").click(); document.querySelector("[data-play=stand]").click()');
await waitFor('document.querySelector(".ask-stage")');
await evaluate('window.__fruitopia.finishMinigame()');
await waitFor('document.querySelector("[data-collect]")');
const beforeGameReward = await evaluate('window.__fruitopia.getState().cash');
await evaluate('document.querySelector("[data-collect]").click()');
const afterGameReward = await evaluate('window.__fruitopia.getState().cash');
assert.ok(afterGameReward > beforeGameReward);
await evaluate('document.querySelector("[data-collect]").click()');
assert.equal(await evaluate('window.__fruitopia.getState().cash'), afterGameReward);
assert.equal(await evaluate('document.querySelector("[data-replay]").disabled'), false);
await evaluate('window.__fruitopia.closeModal(); window.__fruitopia.setResources({cash:1000000000,coins:100000,level:30})');
for (const district of DISTRICTS.slice(1)) {
  for (const upgrade of district.upgrades.slice(0, 6)) {
    await evaluate(`window.__fruitopia.buyUpgrade(${JSON.stringify(district.id)},${JSON.stringify(upgrade.id)})`);
  }
  assert.equal(await evaluate(`window.__fruitopia.buyMinigame(${JSON.stringify(district.id)})`), true, district.id);
}
assert.equal(await evaluate('Object.keys(window.__fruitopia.getState().minigames).length'), 8);
await evaluate('window.__fruitopia.unlockAllMinigames()');

// Instantiate all eleven modes to catch setup/cleanup errors.
const gameSelectors = {
  stand: '.ask-stage', orchard: '.basket-game', depot: '.sort-game', market: '.market-game', juice: '.blend-game',
  tropical: '.tropical-game', frozen: '.berry-game', watermelon: '.bowling-game', auction: '.auction-game',
  monkey: '.monkey-game', festival: '.festival-game'
};
for (const [id, selector] of Object.entries(gameSelectors)) {
  await evaluate(`window.__fruitopia.openMinigame(${JSON.stringify(id)})`);
  await waitFor(`document.querySelector(${JSON.stringify(selector)})`);
  await evaluate('window.__fruitopia.closeModal()');
}
assert.equal(await evaluate('Object.keys(window.__fruitopia.getState().minigames).length'), 11);

// Every random event renders its named banner and world-state class.
for (const type of Object.keys(EXPANDED_EVENTS)) {
  await evaluate(`window.__fruitopia.startEvent(${JSON.stringify(type)})`);
  assert.equal(await evaluate(`document.body.classList.contains(${JSON.stringify(`event-${type}`)})`), true, type);
  assert.ok((await evaluate('document.querySelector("#eventBanner").textContent.length')) > 5);
}

// Delivery pays exactly once.
await evaluate('window.__fruitopia.fillInventory(100); window.__fruitopia.open("deliveries")');
await waitFor('document.querySelector("[data-dispatch=cottages]")');
await evaluate('document.querySelector("[data-dispatch=cottages]").click()');
assert.equal(await evaluate('window.__fruitopia.getState().deliveries.filter(d => !d.rewarded).length'), 1);
const cashBeforeDelivery = await evaluate('window.__fruitopia.getState().cash');
await evaluate('window.__fruitopia.finishDeliveries()');
const cashAfterDelivery = await evaluate('window.__fruitopia.getState().cash');
assert.ok(cashAfterDelivery > cashBeforeDelivery);
await evaluate('window.__fruitopia.finishDeliveries()');
assert.equal(await evaluate('window.__fruitopia.getState().cash'), cashAfterDelivery);

// Research discovers a hybrid and preserves it across a versioned reload.
await evaluate('window.__fruitopia.closeModal(); window.__fruitopia.setExpansion({research:20,quality:5}); window.__fruitopia.fillInventory(100)');
const researchStart = await evaluate('window.__fruitopia.startResearch("watermelon","starfruit")');
assert.equal(researchStart.ok, true);
const researchResult = await evaluate('window.__fruitopia.finishResearch()');
assert.equal(researchResult.fruitId, 'moonmelon');
await evaluate('window.__fruitopia.save()');
const savedSnapshot = await evaluate('window.__fruitopia.getState()');
await send('Page.reload', { ignoreCache: true });
await waitFor('window.__fruitopia && window.__fruitopia.getState().phone.unlocked');
const restored = await evaluate('window.__fruitopia.getState()');
assert.equal(restored.upgrades.stand.length, savedSnapshot.upgrades.stand.length);
assert.equal(restored.minigames.stand, true);
assert.equal(restored.orders.find(item => item.id === order.id).status, 'complete');
assert.ok(restored.fruitDiscoveries.includes('moonmelon'));

// Teleport, focus-trapped modal, Escape, and cancelable reset.
await evaluate('window.__fruitopia.open("map"); document.querySelector("[data-map-district=stand]").click()');
assert.equal(await evaluate('Math.round(window.__fruitopia.getState().player.x)'), 360);
await evaluate('window.__fruitopia.open("settings")');
assert.equal(await evaluate('document.querySelector(".modal").contains(document.activeElement)'), true);
await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape' });
await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape' });
await waitFor('!document.querySelector(".modal-backdrop")');
const cashBeforeCancelReset = await evaluate('window.__fruitopia.getState().cash');
await evaluate('window.__fruitopia.open("settings"); document.querySelector("[data-reset]").click()');
await waitFor('document.querySelector("[data-cancel-reset]")');
await evaluate('document.querySelector("[data-cancel-reset]").click()');
assert.equal(await evaluate('window.__fruitopia.getState().cash'), cashBeforeCancelReset);

const desktopShot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
writeFileSync('/tmp/fruitopia-desktop.png', Buffer.from(desktopShot.data, 'base64'));

// Tablet keeps the two-column management layout without page overflow.
await send('Emulation.setDeviceMetricsOverride', { width: 900, height: 1100, deviceScaleFactor: 1, mobile: true });
await send('Page.reload', { ignoreCache: true });
await waitFor('window.__fruitopia && document.querySelector(".world-card")');
const tablet = await evaluate(`({innerWidth,scrollWidth:document.documentElement.scrollWidth,sideRail:getComputedStyle(document.querySelector('.side-rail')).display,dockWidth:document.querySelector('.dock').getBoundingClientRect().width})`);
assert.ok(tablet.scrollWidth <= tablet.innerWidth + 1, `tablet overflow: ${JSON.stringify(tablet)}`);
assert.equal(tablet.sideRail, 'flex');
assert.ok(tablet.dockWidth <= tablet.innerWidth);

// Mobile: world, touch pad, scrollable dock, and phone all remain inside the viewport.
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
await send('Page.reload', { ignoreCache: true });
await waitFor('window.__fruitopia && document.querySelector(".world-card")');
const mobile = await evaluate(`(() => {
  const world = document.querySelector('.world-card').getBoundingClientRect();
  const dock = document.querySelector('.dock').getBoundingClientRect();
  const touch = getComputedStyle(document.querySelector('.touch-pad')).display;
  return { innerWidth, scrollWidth: document.documentElement.scrollWidth, worldHeight: world.height, dockBottom: dock.bottom, dockWidth: dock.width, touch };
})()`);
assert.ok(mobile.scrollWidth <= mobile.innerWidth + 1, `mobile overflow: ${JSON.stringify(mobile)}`);
assert.ok(mobile.worldHeight > 450);
assert.ok(mobile.dockBottom <= 844);
assert.ok(mobile.dockWidth <= 390);
assert.equal(mobile.touch, 'grid');
await evaluate('window.__fruitopia.open("phone")');
await waitFor('document.querySelector(".phone-device")');
const phoneMobile = await evaluate(`(() => { const box = document.querySelector('.phone-device').getBoundingClientRect(); return { left:box.left,right:box.right,width:box.width,innerWidth }; })()`);
assert.ok(phoneMobile.left >= 0 && phoneMobile.right <= phoneMobile.innerWidth);
const mobileShot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
writeFileSync('/tmp/fruitopia-mobile.png', Buffer.from(mobileShot.data, 'base64'));

// Prestige confirmation resets ordinary progress but preserves high scores and discoveries.
await evaluate('window.__fruitopia.closeModal(); window.__fruitopia.setResources({cash:150000,coins:100,level:18,lifetimeCash:150000}); window.__fruitopia.open("season")');
const seasonBefore = await evaluate('window.__fruitopia.getState().season');
const highBefore = await evaluate('window.__fruitopia.getState().highScores.stand || 0');
await evaluate('document.querySelector("[data-new-season]").click()');
await waitFor('document.querySelector("[data-confirm-season]")');
await evaluate('document.querySelector("[data-confirm-season]").click()');
const afterSeason = await evaluate('window.__fruitopia.getState()');
assert.equal(afterSeason.season, seasonBefore + 1);
assert.ok(afterSeason.goldenSeeds > 0);
assert.equal(afterSeason.level, 1);
assert.equal(afterSeason.highScores.stand || 0, highBefore);
assert.ok(afterSeason.fruitDiscoveries.includes('moonmelon'));

assert.deepEqual(browserErrors, [], `Browser errors: ${browserErrors.join('\n')}`);
console.log(JSON.stringify({
  ok: true, districts: DISTRICTS.length, buildings: 86, trees: 22, workers: 14,
  minigamesOpened: 11, phoneApps: 13, phonePaymentPaidOnce: true,
  minigameRewardPaidOnce: true, deliveryPaidOnce: true, hybridResearch: researchResult.fruitId,
  keyboardMovedPlayer: true, saveRestored: true, resetCancelPreservedSave: true,
  tablet, mobile, phoneMobile, prestigeSeason: afterSeason.season, browserErrors
}, null, 2));
ws.close();
