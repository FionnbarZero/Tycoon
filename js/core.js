import {
  SAVE_VERSION, FRUITS, DISTRICTS, VEHICLES, WORKERS, RECIPES, QUEST_POOL,
  MILESTONES, ACHIEVEMENTS, XP_FOR_LEVEL, LEVEL_TITLES
} from './config.js';
import { BUILDINGS, OFFICE_UPGRADES, WORKER_CHARACTERS, EVOLUTION_AGES } from './expansion-config.js';

export const clamp = (value, min, max) => Math.min(max, Math.max(min, Number(value) || 0));
export const round2 = value => Math.round((Number(value) || 0) * 100) / 100;

export function seededRandom(seed) {
  let value = Math.abs(Number(seed) || 1) % 2147483647;
  if (!value) value = 1;
  return () => ((value = value * 16807 % 2147483647) - 1) / 2147483646;
}

export function totalInventory(state) {
  return totalFruitInventory(state) + totalProductInventory(state);
}

export const totalFruitInventory = state => Object.values(state.inventory || {}).reduce((sum, n) => sum + Math.max(0, Number(n) || 0), 0);
export const totalProductInventory = state => Object.values(state.products || {}).reduce((sum, n) => sum + Math.max(0, Number(n) || 0), 0);

export function districtProgress(state, districtId) {
  const district = DISTRICTS.find(item => item.id === districtId);
  if (!district) return 0;
  const bought = district.upgrades.filter(upgrade => state.upgrades?.[districtId]?.includes(upgrade.id)).length;
  return Math.round((bought / district.upgrades.length) * 100);
}

export function isDistrictUnlocked(state, district) {
  if ((state.level || 1) < district.unlock.level) return false;
  if (district.unlock.prev && districtProgress(state, district.unlock.prev) < (district.unlock.progress || 0)) return false;
  return true;
}

export function titleForLevel(level) {
  return [...LEVEL_TITLES].reverse().find(([needed]) => level >= needed)?.[1] || LEVEL_TITLES[0][1];
}

export function calculateBonuses(state) {
  const bonuses = {
    capacity: 30, warehouse: 20, sale: 1, passive: 0, growth: 1, harvest: 1, coinChance: 0.1,
    deliverySpeed: 1, deliveryPay: 1, tips: 0.04, craft: 1, rare: 0,
    productionSpeed: 1, productionValue: 1, workerSpeed: 1, happiness: 0,
    offline: 1, reputation: 0, research: 0, advertising: 0, orderValue: 1,
    negotiation: 0, quality: 1, eventReward: 1, ticket: 0, investment: 1,
    automation: 0, patent: 0, global: 0
  };
  for (const area of DISTRICTS) {
    for (const upgrade of area.upgrades) {
      if (!state.upgrades?.[area.id]?.includes(upgrade.id)) continue;
      const e = upgrade.effect || {};
      bonuses.capacity += e.capacity || 0;
      bonuses.sale += e.sale || 0;
      bonuses.passive += e.passive || 0;
      bonuses.growth -= e.growth || 0;
      bonuses.harvest += e.harvest || 0;
      bonuses.coinChance += e.coinChance || 0;
      bonuses.deliverySpeed += e.deliverySpeed || 0;
      bonuses.deliveryPay += e.deliveryPay || 0;
      bonuses.tips += e.tips || 0;
      bonuses.craft += e.craft || 0;
      bonuses.rare += e.rare || 0;
    }
  }
  const workers = state.workers || {};
  bonuses.sale += (workers.cashier || 0) * 0.05;
  bonuses.passive += (workers.seller || 0) * 1.25 + (workers.festival_worker || 0) * 2.5;
  bonuses.deliverySpeed += (workers.driver || 0) * 0.05;
  bonuses.deliveryPay += (workers.mechanic || 0) * 0.06;
  bonuses.coinChance += (workers.researcher || 0) * 0.012;
  bonuses.coinChance += bonuses.rare * 0.025;
  for (const roster of Object.values(state.workerRoster || {})) {
    if (!roster.hired) continue;
    const rank = ({ Common: 1, Skilled: 1.15, Expert: 1.35, Legendary: 1.7 })[roster.rank] || 1;
    const morale = .55 + (roster.happiness || 0) / 200;
    const energy = .6 + (roster.energy || 0) / 250;
    const productivity = rank * morale * energy * (1 + (roster.equipment || 0) * .04);
    bonuses.workerSpeed += (roster.skill || 1) * .008 * productivity;
    bonuses.passive += (roster.skill || 1) * .035 * productivity;
    bonuses.productionSpeed += (roster.skill || 1) * .003 * productivity;
  }
  for (const building of BUILDINGS) {
    const level = clamp(state.buildings?.[building.id] || 0, 0, building.maxLevel);
    if (!level) continue;
    const amount = building.amount * level;
    if (building.effect === 'growth') bonuses.growth -= amount;
    else if (building.effect === 'capacity' || building.effect === 'warehouse' || building.effect === 'passive' || building.effect === 'advertising' || building.effect === 'ticket' || building.effect === 'research' || building.effect === 'happiness' || building.effect === 'rare' || building.effect === 'coinChance' || building.effect === 'negotiation' || building.effect === 'global' || building.effect === 'automation') bonuses[building.effect] += amount;
    else bonuses[building.effect] = (bonuses[building.effect] || 1) + amount;
  }
  for (const upgrade of OFFICE_UPGRADES) {
    if (!state.office?.upgrades?.includes(upgrade.id) || upgrade.effect === 'phone') continue;
    if (upgrade.effect === 'growth') bonuses.growth -= upgrade.amount;
    else if (['passive', 'advertising', 'ticket', 'research', 'happiness', 'reputation', 'rare', 'coinChance', 'negotiation', 'global', 'automation'].includes(upgrade.effect)) bonuses[upgrade.effect] += upgrade.amount;
    else bonuses[upgrade.effect] = (bonuses[upgrade.effect] || 1) + upgrade.amount;
  }
  const permanent = state.permanent || {};
  bonuses.sale += (permanent.sales || 0) * 0.08;
  bonuses.growth -= (permanent.growth || 0) * 0.04;
  bonuses.coinChance += (permanent.luck || 0) * 0.015;
  bonuses.capacity += (permanent.capacity || 0) * 15;
  bonuses.workerSpeed += (permanent.workers || 0) * .05;
  bonuses.deliverySpeed += (permanent.deliveries || 0) * .05;
  bonuses.offline += (permanent.offline || 0) * .1;
  bonuses.orderValue += (permanent.budgets || 0) * .06;
  bonuses.tips += (permanent.tips || 0) * .02;
  const global = 1 + bonuses.global;
  for (const key of ['sale', 'harvest', 'deliveryPay', 'craft', 'productionValue', 'orderValue', 'eventReward', 'investment']) bonuses[key] *= global;
  bonuses.passive = (bonuses.passive + bonuses.advertising + bonuses.ticket + (state.research?.patents?.length || 0) * .35) * global;
  bonuses.passive += new Set((state.marketStalls || []).filter(Boolean)).size * .45;
  bonuses.growth = clamp(bonuses.growth, 0.35, 1);
  bonuses.coinChance = clamp(bonuses.coinChance, 0.02, 0.72);
  return bonuses;
}

function initialTrees(now) {
  const ids = Object.keys(FRUITS).filter(id => !FRUITS[id].hybrid);
  return Array.from({ length: 6 + ids.length - 1 }, (_, index) => {
    // Six apple trees make the opening immediately tactile; one later tree for
    // every other fruit ensures the orchard visibly represents the full book.
    const fruit = index < 6 ? 'apple' : ids[Math.min(index - 5, ids.length - 1)];
    return {
      id: `tree-${index}`, fruit, readyAt: index < 6 ? now - 1 : now + FRUITS[fruit].growth * 1000,
      plantedAt: now - (index < 6 ? FRUITS[fruit].growth * 1000 : 0), level: 1,
      wateredUntil: 0, fertilizedUntil: 0, diseased: false, golden: false
    };
  });
}

function initialWorkerRoster() {
  return Object.fromEntries(WORKER_CHARACTERS.map((worker, index) => [worker.id, {
    hired: index === 0, rank: 'Common', skill: 1, experience: 0, happiness: 68, energy: 100,
    loyalty: index === 0 ? 58 : 40, equipment: 0, assignment: worker.id === 'picker' ? 'orchard' : null,
    memories: [], messageHistory: [], dialogueSeen: 0
  }]));
}

export function createQuests(day = Math.floor(Date.now() / 86400000)) {
  const random = seededRandom(day + 704);
  const pool = [...QUEST_POOL].sort(() => random() - 0.5).slice(0, 3);
  return pool.map((quest, index) => {
    const rank = Math.min(2, Math.floor(random() * 3));
    const target = quest.targets[rank];
    return {
      id: `${day}-${quest.type}-${index}`,
      type: quest.type,
      label: quest.label(target),
      icon: quest.icon,
      target,
      progress: 0,
      claimed: false,
      reward: { cash: 70 + rank * 95, coins: 1 + rank, xp: 35 + rank * 30 }
    };
  });
}

export function createInitialState(now = Date.now()) {
  const inventory = Object.fromEntries(Object.keys(FRUITS).map(id => [id, 0]));
  inventory.apple = 8;
  return {
    version: SAVE_VERSION,
    cash: 1,
    coins: 0,
    xp: 0,
    level: 1,
    lifetimeCash: 0,
    inventory,
    products: {},
    fruitQuality: Object.fromEntries(Object.keys(FRUITS).map(id => [id, 1])),
    fruitDiscoveries: ['apple'],
    upgrades: Object.fromEntries(DISTRICTS.map(d => [d.id, []])),
    districtRewards: [],
    teleporters: [],
    minigames: {},
    highScores: {},
    vehicles: ['bicycle'],
    deliveries: [],
    workers: Object.fromEntries(WORKERS.map(w => [w.id, 0])),
    workerRoster: initialWorkerRoster(),
    buildings: Object.fromEntries(BUILDINGS.map(building => [building.id, ['roadside_fruit_stand', 'orchard_shed', 'tiny_office'].includes(building.id) ? 1 : 0])),
    office: { level: 1, upgrades: [], queue: [], activeVisitor: null, player: { x: 48, y: 72 }, decorations: [], visitCooldowns: {} },
    phone: { unlocked: false, activeApp: 'messages', unread: 0, lastMessageAt: now, messages: [], theme: 'orchard' },
    orders: [],
    production: [],
    research: { points: 0, notebook: [], active: null, patents: [], failures: 0, experiments: 0 },
    secrets: { discovered: [], clues: [] },
    investments: { orchardFund: 0, marketFund: 0, labFund: 0, lastDividendAt: now },
    reputation: 5,
    marketStalls: ['apple', null, null],
    evolution: { age: 'apple', progress: 0 },
    trees: initialTrees(now),
    featured: { type: 'fruit', id: 'apple', until: 0 },
    quests: createQuests(),
    questDay: Math.floor(now / 86400000),
    milestones: Object.fromEntries(MILESTONES.map(q => [q.id, { progress: 0, claimed: false }])),
    achievements: {},
    stats: {
      harvest: 0, earnCash: 0, earnCoins: 0, sell: 0, craft: 0, delivery: 0,
      upgrade: 0, minigame: 0, districtComplete: 0, highScore: 0, building: 0,
      order: 0, research: 0, conversation: 0, secret: 0
    },
    customer: null,
    event: null,
    nextEventAt: now + 45000,
    eventHistory: [],
    hiddenCrates: [],
    goldenSeeds: 0,
    permanent: { sales: 0, growth: 0, luck: 0, capacity: 0, workers: 0, deliveries: 0, offline: 0, budgets: 0, tips: 0 },
    season: 1,
    player: { x: 430, y: 430 },
    tutorialStep: 0,
    settings: { sound: true, music: false, reducedMotion: false, autosave: true },
    lastSavedAt: now,
    lastTickAt: now
  };
}

export function sanitizeState(input, now = Date.now()) {
  const base = createInitialState(now);
  if (!input || typeof input !== 'object') return base;
  const state = { ...base, ...input };
  state.version = SAVE_VERSION;
  for (const key of ['cash', 'coins', 'xp', 'level', 'lifetimeCash', 'goldenSeeds', 'season']) {
    state[key] = Math.max(key === 'level' || key === 'season' ? 1 : 0, Number(state[key]) || 0);
  }
  state.inventory = { ...base.inventory, ...(input.inventory || {}) };
  for (const id of Object.keys(state.inventory)) state.inventory[id] = Math.max(0, Math.floor(Number(state.inventory[id]) || 0));
  state.products = { ...(input.products || {}) };
  for (const id of Object.keys(state.products)) state.products[id] = Math.max(0, Math.floor(Number(state.products[id]) || 0));
  state.fruitQuality = { ...base.fruitQuality, ...(input.fruitQuality || {}) };
  for (const id of Object.keys(state.fruitQuality)) state.fruitQuality[id] = clamp(state.fruitQuality[id], 1, 5);
  state.fruitDiscoveries = [...new Set(input.fruitDiscoveries || base.fruitDiscoveries)].filter(id => FRUITS[id]);
  state.upgrades = { ...base.upgrades, ...(input.upgrades || {}) };
  for (const district of DISTRICTS) {
    const valid = new Set(district.upgrades.map(u => u.id));
    state.upgrades[district.id] = [...new Set(state.upgrades[district.id] || [])].filter(id => valid.has(id));
  }
  state.vehicles = [...new Set(input.vehicles || base.vehicles)].filter(id => VEHICLES.some(v => v.id === id));
  if (!state.vehicles.length) state.vehicles = ['bicycle'];
  state.deliveries = Array.isArray(input.deliveries) ? input.deliveries.filter(d => d && d.id && d.endsAt) : [];
  state.workers = { ...base.workers, ...(input.workers || {}) };
  for (const id of Object.keys(state.workers)) state.workers[id] = clamp(Math.floor(state.workers[id]), 0, 10);
  state.workerRoster = { ...base.workerRoster };
  for (const worker of WORKER_CHARACTERS) {
    const incoming = input.workerRoster?.[worker.id] || {};
    state.workerRoster[worker.id] = {
      ...base.workerRoster[worker.id], ...incoming,
      hired: Boolean(incoming.hired ?? base.workerRoster[worker.id].hired),
      rank: ['Common', 'Skilled', 'Expert', 'Legendary'].includes(incoming.rank) ? incoming.rank : 'Common',
      skill: clamp(Math.floor(incoming.skill || 1), 1, 10),
      experience: Math.max(0, Number(incoming.experience) || 0),
      happiness: clamp(incoming.happiness ?? base.workerRoster[worker.id].happiness, 0, 100),
      energy: clamp(incoming.energy ?? 100, 0, 100), loyalty: clamp(incoming.loyalty ?? 40, 0, 100),
      equipment: clamp(Math.floor(incoming.equipment || 0), 0, 5),
      memories: Array.isArray(incoming.memories) ? incoming.memories.slice(-30) : [],
      messageHistory: Array.isArray(incoming.messageHistory) ? incoming.messageHistory.slice(-40) : []
    };
  }
  state.buildings = { ...base.buildings, ...(input.buildings || {}) };
  for (const building of BUILDINGS) state.buildings[building.id] = clamp(Math.floor(state.buildings[building.id] || 0), 0, building.maxLevel);
  const validOffice = new Set(OFFICE_UPGRADES.map(upgrade => upgrade.id));
  state.office = { ...base.office, ...(input.office || {}) };
  state.office.upgrades = [...new Set(input.office?.upgrades || [])].filter(id => validOffice.has(id));
  state.office.queue = [...new Set(input.office?.queue || [])].filter(id => WORKER_CHARACTERS.some(worker => worker.id === id));
  state.office.player = { x: clamp(input.office?.player?.x ?? 48, 5, 95), y: clamp(input.office?.player?.y ?? 72, 15, 88) };
  state.office.decorations = [...new Set(input.office?.decorations || [])].slice(0, 30);
  state.phone = { ...base.phone, ...(input.phone || {}) };
  state.phone.unlocked = Boolean(state.phone.unlocked || state.office.upgrades.includes('smartphone'));
  state.phone.messages = Array.isArray(input.phone?.messages) ? input.phone.messages.filter(message => message?.id && message?.text).slice(-120) : [];
  state.phone.unread = Math.max(0, Math.floor(Number(state.phone.unread) || 0));
  state.orders = Array.isArray(input.orders) ? input.orders.filter(order => order?.id && order?.itemId && ['fruit', 'product'].includes(order?.kind)).slice(-40) : [];
  state.production = Array.isArray(input.production) ? input.production.filter(job => job?.id && job?.recipeId && job?.endsAt).slice(-30) : [];
  state.research = { ...base.research, ...(input.research || {}) };
  state.research.points = Math.max(0, Number(state.research.points) || 0);
  state.research.notebook = [...new Set(input.research?.notebook || [])].filter(id => FRUITS[id]);
  state.research.patents = [...new Set(input.research?.patents || [])].filter(id => FRUITS[id]);
  state.secrets = { ...base.secrets, ...(input.secrets || {}) };
  state.secrets.discovered = [...new Set(input.secrets?.discovered || [])];
  state.secrets.clues = [...new Set(input.secrets?.clues || [])];
  state.investments = { ...base.investments, ...(input.investments || {}) };
  for (const id of ['orchardFund', 'marketFund', 'labFund']) state.investments[id] = Math.max(0, Number(state.investments[id]) || 0);
  state.reputation = clamp(input.reputation ?? base.reputation, 0, 100);
  state.marketStalls = Array.isArray(input.marketStalls) ? input.marketStalls.slice(0, 3) : base.marketStalls;
  state.evolution = { ...base.evolution, ...(input.evolution || {}) };
  if (!EVOLUTION_AGES.some(age => age.id === state.evolution.age)) state.evolution.age = 'apple';
  state.trees = Array.isArray(input.trees) && input.trees.length ? input.trees.map((tree, i) => ({
    id: String(tree.id || `tree-${i}`),
    fruit: FRUITS[tree.fruit] ? tree.fruit : 'apple',
    readyAt: Number(tree.readyAt) || now,
    level: clamp(Math.floor(tree.level || 1), 1, 8),
    plantedAt: Number(tree.plantedAt) || now,
    wateredUntil: Number(tree.wateredUntil) || 0,
    fertilizedUntil: Number(tree.fertilizedUntil) || 0,
    diseased: Boolean(tree.diseased), golden: Boolean(tree.golden)
  })) : base.trees;
  state.stats = { ...base.stats, ...(input.stats || {}) };
  state.settings = { ...base.settings, ...(input.settings || {}) };
  state.permanent = { ...base.permanent, ...(input.permanent || {}) };
  state.player = {
    x: clamp(input.player?.x ?? base.player.x, 80, 2120),
    y: clamp(input.player?.y ?? base.player.y, 80, 1320)
  };
  if (!Array.isArray(state.quests) || state.questDay !== Math.floor(now / 86400000)) {
    state.quests = createQuests();
    state.questDay = Math.floor(now / 86400000);
  }
  state.milestones = { ...base.milestones, ...(input.milestones || {}) };
  state.achievements = { ...(input.achievements || {}) };
  state.minigames = { ...(input.minigames || {}) };
  state.highScores = { ...(input.highScores || {}) };
  state.teleporters = [...new Set(input.teleporters || [])].filter(id => DISTRICTS.some(d => d.id === id));
  state.hiddenCrates = [...new Set(input.hiddenCrates || [])];
  state.districtRewards = [...new Set(input.districtRewards || [])];
  state.eventHistory = Array.isArray(input.eventHistory) ? input.eventHistory.slice(-20) : [];
  return state;
}

export function migrateSave(raw, now = Date.now()) {
  if (!raw || typeof raw !== 'object') return createInitialState(now);
  let migrated = { ...raw };
  const version = Number(migrated.version) || 1;
  if (version < 2) {
    migrated.goldenSeeds ??= 0;
    migrated.permanent ??= { sales: 0, growth: 0, luck: 0, capacity: 0 };
    migrated.season ??= 1;
  }
  if (version < 3) {
    migrated.products ??= {};
    migrated.eventHistory ??= [];
    migrated.hiddenCrates ??= [];
    migrated.districtRewards ??= [];
  }
  if (version < 4) {
    migrated.buildings ??= {};
    migrated.office ??= { upgrades: [] };
    migrated.phone ??= { unlocked: false, messages: [] };
    migrated.orders ??= [];
    migrated.production ??= [];
    migrated.research ??= { points: 0, notebook: [], patents: [] };
    migrated.secrets ??= { discovered: [], clues: [] };
  }
  if (version < 5) {
    migrated.workerRoster ??= {};
    migrated.fruitQuality ??= {};
    migrated.fruitDiscoveries ??= ['apple'];
    migrated.evolution ??= { age: 'apple', progress: 0 };
  }
  migrated.version = SAVE_VERSION;
  return sanitizeState(migrated, now);
}

export function addXP(state, amount) {
  state.xp += Math.max(0, amount);
  let leveled = 0;
  while (state.xp >= XP_FOR_LEVEL(state.level)) {
    state.xp -= XP_FOR_LEVEL(state.level);
    state.level += 1;
    leveled += 1;
  }
  return leveled;
}

export function canAfford(state, cash = 0, coins = 0) {
  return state.cash + 1e-6 >= cash && state.coins + 1e-6 >= coins;
}

export function spend(state, cash = 0, coins = 0) {
  if (!canAfford(state, cash, coins)) return false;
  state.cash = round2(Math.max(0, state.cash - cash));
  state.coins = Math.max(0, Math.floor(state.coins - coins));
  return true;
}

export function addCash(state, amount) {
  const safe = Math.max(0, Number(amount) || 0);
  state.cash = round2(state.cash + safe);
  state.lifetimeCash = round2(state.lifetimeCash + safe);
  return safe;
}

export function addCoins(state, amount) {
  const safe = Math.max(0, Math.floor(Number(amount) || 0));
  state.coins += safe;
  return safe;
}

export function addInventory(state, fruitId, amount) {
  const bonuses = calculateBonuses(state);
  const room = Math.max(0, Math.floor(bonuses.capacity - totalFruitInventory(state)));
  const added = Math.min(room, Math.max(0, Math.floor(amount)));
  state.inventory[fruitId] = (state.inventory[fruitId] || 0) + added;
  return added;
}

export function addProduct(state, recipeId, amount = 1) {
  const bonuses = calculateBonuses(state);
  const room = Math.max(0, Math.floor(bonuses.warehouse - totalProductInventory(state)));
  const added = Math.min(room, Math.max(0, Math.floor(amount)));
  state.products[recipeId] = (state.products[recipeId] || 0) + added;
  return added;
}

export function removeIngredients(state, ingredients) {
  if (!Object.entries(ingredients).every(([id, count]) => (state.inventory[id] || 0) >= count)) return false;
  for (const [id, count] of Object.entries(ingredients)) state.inventory[id] -= count;
  return true;
}

export function progressStat(state, type, amount = 1) {
  const safe = Math.max(0, Number(amount) || 0);
  state.stats[type] = (state.stats[type] || 0) + safe;
  for (const quest of state.quests) {
    if (!quest.claimed && quest.type === type) quest.progress = Math.min(quest.target, (quest.progress || 0) + safe);
  }
  for (const milestone of MILESTONES) {
    const entry = state.milestones[milestone.id] || (state.milestones[milestone.id] = { progress: 0, claimed: false });
    if (!entry.claimed && milestone.type === type) entry.progress = Math.min(milestone.target, (entry.progress || 0) + safe);
  }
}

export function achievementUpdates(state) {
  const unlocked = [];
  for (const achievement of ACHIEVEMENTS) {
    if (state.achievements[achievement.id]) continue;
    if ((state.stats[achievement.stat] || 0) >= achievement.target) {
      state.achievements[achievement.id] = Date.now();
      addCoins(state, achievement.reward);
      unlocked.push(achievement);
    }
  }
  return unlocked;
}

export function offlineSummary(state, now = Date.now()) {
  const elapsed = clamp((now - (state.lastSavedAt || now)) / 1000, 0, 4 * 3600);
  if (elapsed < 15) return { seconds: elapsed, cash: 0, fruit: 0 };
  const bonuses = calculateBonuses(state);
  const cash = round2(bonuses.passive * elapsed * 0.65 * bonuses.offline);
  addCash(state, cash);
  const pickerLevel = state.workers.picker || 0;
  const fruit = Math.min(Math.floor(elapsed / 25) * pickerLevel, Math.floor(bonuses.capacity - totalFruitInventory(state)));
  if (fruit > 0) addInventory(state, 'apple', fruit);
  let production = 0;
  for (const job of state.production || []) {
    if (job.claimed || job.endsAt > now) continue;
    const recipe = RECIPES.find(item => item.id === job.recipeId);
    if (recipe && addProduct(state, recipe.id, job.quantity || 1)) production += job.quantity || 1;
    job.claimed = true;
  }
  for (const roster of Object.values(state.workerRoster || {})) roster.energy = clamp((roster.energy || 0) + elapsed / 180, 0, 100);
  return { seconds: elapsed, cash, fruit, production, researchReady: Boolean(state.research?.active?.endsAt <= now) };
}

export function encodeSave(state, now = Date.now()) {
  const clean = sanitizeState(state, now);
  clean.lastSavedAt = now;
  clean.lastTickAt = now;
  return JSON.stringify(clean);
}

export function decodeSave(text, now = Date.now()) {
  try {
    return migrateSave(JSON.parse(text), now);
  } catch {
    return createInitialState(now);
  }
}

export function newSeasonReward(state) {
  if (state.level < 18 && state.lifetimeCash < 100000) return 0;
  return Math.max(1, Math.floor(Math.sqrt(state.lifetimeCash / 25000)) + Math.floor(state.level / 8));
}

export function startNewSeason(state, now = Date.now()) {
  const earned = newSeasonReward(state);
  if (!earned) return null;
  const fresh = createInitialState(now);
  fresh.goldenSeeds = (state.goldenSeeds || 0) + earned;
  fresh.permanent = { ...fresh.permanent, ...(state.permanent || {}) };
  fresh.season = (state.season || 1) + 1;
  fresh.settings = { ...fresh.settings, ...(state.settings || {}) };
  fresh.achievements = { ...(state.achievements || {}) };
  fresh.highScores = { ...(state.highScores || {}) };
  fresh.fruitDiscoveries = [...new Set(state.fruitDiscoveries || ['apple'])];
  for (const fruitId of fresh.fruitDiscoveries.filter(id => FRUITS[id]?.hybrid)) {
    fresh.trees.push({
      id: `hybrid-${fruitId}`, fruit: fruitId, readyAt: now + FRUITS[fruitId].growth * 1000,
      plantedAt: now, level: 1, wateredUntil: 0, fertilizedUntil: 0, diseased: false, golden: false
    });
  }
  fresh.research.notebook = [...new Set(state.research?.notebook || [])];
  fresh.workerRoster = Object.fromEntries(Object.entries(fresh.workerRoster).map(([id, worker]) => [id, {
    ...worker,
    memories: [...(state.workerRoster?.[id]?.memories || [])],
    dialogueSeen: state.workerRoster?.[id]?.dialogueSeen || 0,
    loyalty: Math.max(worker.loyalty, state.workerRoster?.[id]?.loyalty || 0)
  }]));
  fresh.office.decorations = [...(state.office?.decorations || [])];
  fresh.evolution = {
    age: [...EVOLUTION_AGES].reverse().find(age => fresh.season >= age.seasons)?.id || 'apple',
    progress: (state.evolution?.progress || 0) + 1
  };
  return { state: fresh, earned };
}
