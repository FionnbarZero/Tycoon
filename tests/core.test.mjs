import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createInitialState, sanitizeState, migrateSave, encodeSave, decodeSave,
  totalInventory, totalFruitInventory, totalProductInventory, districtProgress,
  calculateBonuses, addInventory, addProduct, removeIngredients, addXP, spend,
  offlineSummary, newSeasonReward, startNewSeason, isDistrictUnlocked
} from '../js/core.js';
import { DISTRICTS, FRUITS, RECIPES, VEHICLES, ROUTES, SAVE_VERSION, XP_FOR_LEVEL } from '../js/config.js';
import {
  BUILDINGS, OFFICE_UPGRADES, WORKER_CHARACTERS, EXPANDED_EVENTS,
  MINIGAME_CATALOG, PRODUCTION_LINES, SECRETS, EVOLUTION_AGES
} from '../js/expansion-config.js';
import {
  syncFruitDiscoveries, purchaseBuilding, generateOrder, respondToOrder,
  supplyOrder, startProduction, collectProduction, startResearch, resolveResearch,
  createWorkerVisit, applyWorkerChoice, discoverSecret
} from '../js/expansion-core.js';

test('new game begins with one dollar and several renewable ways forward', () => {
  const timestamp = 2_000_000;
  const state = createInitialState(timestamp);
  assert.equal(state.cash, 1);
  assert.ok(state.inventory.apple > 0);
  assert.equal(state.trees.filter(tree => tree.readyAt <= timestamp && tree.fruit === 'apple').length, 6);
  assert.equal(new Set(state.trees.map(tree => tree.fruit)).size, Object.values(FRUITS).filter(fruit => !fruit.hybrid).length);
  assert.equal(OFFICE_UPGRADES.find(upgrade => upgrade.id === 'basic_phone').cash, 1);
  assert.ok(state.vehicles.includes('bicycle'));
  assert.ok(isDistrictUnlocked(state, DISTRICTS[0]));
  assert.ok(isDistrictUnlocked(state, DISTRICTS[1]));
  assert.equal(state.buildings.roadside_fruit_stand, 1);
  assert.equal(state.workerRoster.picker.hired, true);
});

test('complete content catalog is data-driven and internally linked', () => {
  assert.equal(Object.keys(FRUITS).length, 28);
  assert.equal(Object.values(FRUITS).filter(fruit => fruit.hybrid).length, 11);
  assert.equal(DISTRICTS.length, 8);
  assert.ok(DISTRICTS.every(district => district.upgrades.length >= 6));
  assert.equal(VEHICLES.length, 12);
  assert.equal(ROUTES.length, 12);
  assert.ok(ROUTES.every(route => route.vehicle && Object.keys(route.requires).length));
  assert.ok(Object.values(FRUITS).every(fruit => fruit.icon && fruit.value && fruit.growth && fruit.supply && fruit.use && fruit.rarity && fruit.demand));
  assert.equal(BUILDINGS.length, 86);
  assert.equal(new Set(BUILDINGS.map(building => building.id)).size, 86);
  assert.ok(BUILDINGS.every(building => building.stages.length === 4 && building.effect && building.description));
  assert.equal(OFFICE_UPGRADES.length, 44);
  assert.equal(WORKER_CHARACTERS.length, 14);
  assert.ok(WORKER_CHARACTERS.every(worker => worker.name && worker.role && worker.personality && worker.strength && worker.weakness && worker.favorite && worker.topics.length >= 3));
  assert.equal(Object.keys(EXPANDED_EVENTS).length, 20);
  assert.equal(MINIGAME_CATALOG.length, 11);
  assert.equal(SECRETS.length, 11);
  assert.equal(EVOLUTION_AGES.length, 6);
});

test('fruit and product storage are separate and never exceed capacity', () => {
  const state = createInitialState();
  const bonuses = calculateBonuses(state);
  const added = addInventory(state, 'apple', 9999);
  assert.equal(totalFruitInventory(state), bonuses.capacity);
  assert.equal(added, bonuses.capacity - 8);
  assert.equal(removeIngredients(state, { apple: bonuses.capacity + 1 }), false);
  assert.ok(state.inventory.apple >= 0);
  assert.equal(addProduct(state, 'orchard_crate', 999), bonuses.warehouse);
  assert.equal(totalProductInventory(state), bonuses.warehouse);
  assert.equal(totalInventory(state), bonuses.capacity + bonuses.warehouse);
});

test('spending is atomic and guards against negative currency', () => {
  const state = createInitialState();
  assert.equal(spend(state, 2, 0), false);
  assert.equal(state.cash, 1);
  assert.equal(spend(state, 1, 0), true);
  assert.equal(state.cash, 0);
  assert.equal(spend(state, 0, 1), false);
  assert.equal(state.coins, 0);
});

test('district teleporter threshold is derived from six purchased improvements', () => {
  const state = createInitialState();
  const stand = DISTRICTS.find(district => district.id === 'stand');
  state.upgrades.stand = stand.upgrades.slice(0, 6).map(upgrade => upgrade.id);
  assert.equal(districtProgress(state, 'stand'), 75);
  state.upgrades.stand = stand.upgrades.map(upgrade => upgrade.id);
  assert.equal(districtProgress(state, 'stand'), 100);
});

test('XP crosses multiple levels without losing overflow', () => {
  const state = createInitialState();
  const grant = XP_FOR_LEVEL(1) + XP_FOR_LEVEL(2) + 11;
  assert.equal(addXP(state, grant), 2);
  assert.equal(state.level, 3);
  assert.equal(state.xp, 11);
});

test('save migration repairs corrupt fields and preserves expansion data', () => {
  const old = { version: 1, cash: -50, coins: -3, level: 0, inventory: { apple: -9 }, vehicles: ['not-real'] };
  const migrated = migrateSave(old, 12345);
  assert.equal(migrated.version, SAVE_VERSION);
  assert.equal(migrated.cash, 0);
  assert.equal(migrated.coins, 0);
  assert.equal(migrated.level, 1);
  assert.equal(migrated.inventory.apple, 0);
  assert.deepEqual(migrated.vehicles, ['bicycle']);
  assert.equal(Object.keys(migrated.buildings).length, 86);
  assert.equal(Object.keys(migrated.workerRoster).length, 14);
  assert.equal(decodeSave('{not json').version, SAVE_VERSION);
  const orderState = createInitialState();
  orderState.orders.push({ id: 'saved-order', itemId: 'apple', kind: 'fruit', status: 'accepted', deadline: 999999 });
  assert.equal(decodeSave(encodeSave(orderState, 123), 123).orders[0].id, 'saved-order');
});

test('offline earnings are capped and complete production without duplication', () => {
  const end = 20_000_000;
  const state = createInitialState(end - 10 * 3600 * 1000);
  state.lastSavedAt = end - 10 * 3600 * 1000;
  state.upgrades.stand.push('sign');
  state.workers.picker = 2;
  state.production.push({ id: 'offline-job', recipeId: 'orchard_crate', quantity: 2, endsAt: end - 1, claimed: false });
  const summary = offlineSummary(state, end);
  assert.equal(summary.seconds, 4 * 3600);
  assert.ok(summary.cash > 0);
  assert.ok(summary.fruit > 0);
  assert.equal(summary.production, 2);
  assert.equal(state.products.orchard_crate, 2);
  assert.equal(offlineSummary(state, end + 1000).production, 0);
  assert.ok(totalFruitInventory(state) <= calculateBonuses(state).capacity);
});

test('buildings, production, research, secrets, orders, and worker choices mutate real state', () => {
  const state = createInitialState(1000);
  state.cash = 1_000_000;
  state.coins = 1000;
  state.level = 20;
  syncFruitDiscoveries(state);
  assert.equal(purchaseBuilding(state, 'juice_bar').ok, true);
  state.inventory.apple = 10; state.inventory.orange = 10;
  const production = startProduction(state, 'juice_bar', 2000);
  assert.equal(production.ok, true);
  production.job.endsAt = 2001;
  assert.equal(collectProduction(state, 3000)[0].recipe.id, 'sunshine_juice');

  state.research.points = 10;
  state.inventory.watermelon = 4; state.inventory.starfruit = 4;
  const experiment = startResearch(state, 'watermelon', 'starfruit', 4000);
  assert.equal(experiment.ok, true);
  state.research.active.endsAt = 4001;
  const result = resolveResearch(state, 5000, () => 0);
  assert.equal(result.fruitId, 'moonmelon');
  assert.ok(state.fruitDiscoveries.includes('moonmelon'));

  assert.equal(discoverSecret(state, 'basement').id, 'basement');
  assert.equal(discoverSecret(state, 'basement'), null);

  const order = generateOrder(state, Date.now(), () => 0);
  assert.equal(respondToOrder(state, order.id, 'accept', () => 0).accepted, true);
  state.fruitQuality[order.itemId] = 5;
  (order.kind === 'product' ? state.products : state.inventory)[order.itemId] = order.quantity;
  assert.equal(supplyOrder(state, order.id).ok, true);
  assert.equal(order.status, 'payment');

  const visit = createWorkerVisit(state, 'picker', () => 0);
  const cashBefore = state.cash;
  const decision = applyWorkerChoice(state, visit, 'fund', () => 0);
  assert.equal(decision.ok, true);
  assert.ok(state.cash < cashBefore);
  assert.ok(state.workerRoster.picker.happiness > 68);
});

test('every production building can start and complete its configured product', () => {
  assert.equal(PRODUCTION_LINES.length, 10);
  for (const line of PRODUCTION_LINES) {
    const state = createInitialState(1000);
    state.level = 30;
    syncFruitDiscoveries(state);
    state.buildings[line.building] = 1;
    for (const id of Object.keys(FRUITS)) state.inventory[id] = 50;
    const started = startProduction(state, line.building, 2000);
    assert.equal(started.ok, true, line.building);
    started.job.endsAt = 2001;
    const completed = collectProduction(state, 3000);
    assert.equal(completed.length, 1, line.building);
    assert.equal(completed[0].recipe.id, line.recipe);
    assert.ok(RECIPES.some(recipe => recipe.id === line.recipe));
  }
});

test('all 86 construction definitions can be purchased when requirements are met', () => {
  const state = createInitialState();
  state.level = 99;
  state.cash = 1e15;
  state.coins = 1e9;
  state.secrets.discovered = SECRETS.map(secret => secret.id);
  for (const building of BUILDINGS) {
    if (state.buildings[building.id] > 0) continue;
    const result = purchaseBuilding(state, building.id);
    assert.equal(result.ok, true, `${building.name}: ${result.reason || ''}`);
    assert.equal(state.buildings[building.id], 1);
  }
});

test('prestige preserves long-term collections, memories, and advances evolution', () => {
  const state = createInitialState();
  state.level = 18;
  state.lifetimeCash = 100000;
  state.permanent.sales = 2;
  state.achievements.apple_a_day = 123;
  state.highScores.stand = 200;
  state.fruitDiscoveries.push('moonmelon');
  state.workerRoster.picker.memories.push('A remembered meeting');
  state.office.decorations.push('golden_trophy');
  const expected = newSeasonReward(state);
  const result = startNewSeason(state, 5000);
  assert.equal(result.earned, expected);
  assert.equal(result.state.season, 2);
  assert.equal(result.state.permanent.sales, 2);
  assert.equal(result.state.goldenSeeds, expected);
  assert.equal(result.state.level, 1);
  assert.equal(result.state.highScores.stand, 200);
  assert.ok(result.state.fruitDiscoveries.includes('moonmelon'));
  assert.ok(result.state.trees.some(tree => tree.fruit === 'moonmelon'));
  assert.deepEqual(result.state.workerRoster.picker.memories, ['A remembered meeting']);
  assert.deepEqual(result.state.office.decorations, ['golden_trophy']);
  assert.equal(result.state.evolution.age, 'tropical');
});

test('sanitization removes unknown and duplicate purchases', () => {
  const raw = createInitialState();
  raw.upgrades.stand = ['sign', 'sign', 'unknown'];
  raw.workers.picker = 999;
  raw.office.upgrades = ['basic_phone', 'basic_phone', 'not-real'];
  raw.buildings.juice_bar = 99;
  const safe = sanitizeState(raw);
  assert.deepEqual(safe.upgrades.stand, ['sign']);
  assert.equal(safe.workers.picker, 10);
  assert.deepEqual(safe.office.upgrades, ['basic_phone']);
  assert.equal(safe.buildings.juice_bar, 3);
});
