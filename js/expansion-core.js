import { FRUITS, RECIPES } from './config.js';
import {
  BUILDINGS, HYBRID_RECIPES, PRODUCTION_LINES, WORKER_CHARACTERS, EXPANDED_EVENTS,
  CONTACTS, SECRETS, getBuilding, buildingCost
} from './expansion-config.js';
import {
  addProduct, calculateBonuses, clamp, removeIngredients, spend,
  totalProductInventory
} from './core.js';

export function isFruitUnlocked(state, fruitId) {
  const fruit = FRUITS[fruitId];
  if (!fruit) return false;
  if (state.fruitDiscoveries?.includes(fruitId)) return true;
  return !fruit.hybrid && state.level >= fruit.level;
}

export function syncFruitDiscoveries(state) {
  state.fruitDiscoveries ??= ['apple'];
  const added = [];
  for (const [id, fruit] of Object.entries(FRUITS)) {
    if (!fruit.hybrid && state.level >= fruit.level && !state.fruitDiscoveries.includes(id)) {
      state.fruitDiscoveries.push(id);
      added.push(id);
    }
  }
  return added;
}

export const hasOfficeUpgrade = (state, id) => state.office?.upgrades?.includes(id);
export const buildingLevel = (state, id) => Math.max(0, Number(state.buildings?.[id]) || 0);

const SECRET_BUILDING_KEYS = {
  abandoned_juice_factory: 'forgotten_lab', hidden_office_basement: 'basement',
  underground_fruit_vault: 'tunnels', mysterious_radio_tower: 'locked_contact',
  secret_island_laboratory: 'secret_island', ancient_orchard_ruins: 'golden_tree',
  sewer_greenhouse: 'forgotten_lab', time_greenhouse: 'ghost_fruit',
  alien_trading_post: 'alien_signal', portal_building: 'secret_championship'
};

export function averageWorkerHappiness(state) {
  const hired = WORKER_CHARACTERS.filter(worker => state.workerRoster?.[worker.id]?.hired);
  if (!hired.length) return 50;
  return Math.round(hired.reduce((sum, worker) => sum + (state.workerRoster[worker.id].happiness || 0), 0) / hired.length);
}

export function canPurchaseBuilding(state, id) {
  const building = getBuilding(id);
  if (!building) return { ok: false, reason: 'Unknown building.' };
  const level = buildingLevel(state, id);
  if (level >= building.maxLevel) return { ok: false, reason: 'Fully upgraded.' };
  if (state.level < building.level) return { ok: false, reason: `Requires empire level ${building.level}.` };
  if (building.secret && !state.secrets?.discovered?.includes(SECRET_BUILDING_KEYS[id]) && level === 0) {
    return { ok: false, reason: 'Follow clues to reveal this secret building.' };
  }
  const cost = buildingCost(building, level);
  if (state.cash < cost.cash || state.coins < cost.coins) return { ok: false, reason: 'Not enough Cash or Fruit Coins.', cost };
  return { ok: true, building, level, cost };
}

export function purchaseBuilding(state, id) {
  const check = canPurchaseBuilding(state, id);
  if (!check.ok) return check;
  if (!spend(state, check.cost.cash, check.cost.coins)) return { ok: false, reason: 'Resources changed before purchase.' };
  state.buildings[id] = check.level + 1;
  return { ok: true, building: check.building, level: check.level + 1, cost: check.cost };
}

export function createPhoneMessage(state, { contactId, text, actions = [], kind = 'message', relatedId = null, timestamp = Date.now() }) {
  state.phone.messages ??= [];
  const message = {
    id: `msg-${timestamp}-${Math.random().toString(36).slice(2, 7)}`,
    contactId, text, actions, kind, relatedId, timestamp, unread: true, resolved: false
  };
  state.phone.messages.push(message);
  state.phone.messages = state.phone.messages.slice(-120);
  state.phone.unread = (state.phone.unread || 0) + 1;
  state.phone.lastMessageAt = timestamp;
  const history = state.workerRoster?.[contactId]?.messageHistory;
  if (Array.isArray(history)) {
    history.push({ text, timestamp, direction: 'in' });
    state.workerRoster[contactId].messageHistory = history.slice(-40);
  }
  return message;
}

const ORDER_CUSTOMERS = [
  ['school', 'Sunnybank School', '🏫', .9, .2, 0],
  ['office', 'Maple & Moss Office', '🏢', 1, .25, 5],
  ['chef', 'Chef Sorrel', '👨‍🍳', 1.2, .3, 10],
  ['supermarket', 'Nora North', '🛒', 1.35, .18, 20],
  ['collector', 'Professor Pome', '🧐', 1.8, .45, 35],
  ['mayor', 'Mayor Marigold', '🎩', 1.55, .35, 28]
];

export function generateOrder(state, timestamp = Date.now(), random = Math.random) {
  const availableCustomers = ORDER_CUSTOMERS.filter(([, , , , , reputation]) => state.reputation >= reputation);
  const customer = availableCustomers[Math.floor(random() * availableCustomers.length)] || ORDER_CUSTOMERS[0];
  const [contactId, customerName, avatar, multiplier, tipChance, reputation] = customer;
  const unlockedFruit = Object.keys(FRUITS).filter(id => isFruitUnlocked(state, id));
  const unlockedRecipes = RECIPES.filter(recipe => state.level >= recipe.level && (!FRUITS[Object.keys(recipe.ingredients)[0]]?.hybrid || isFruitUnlocked(state, Object.keys(recipe.ingredients)[0])));
  const wantsProduct = unlockedRecipes.length > 0 && random() < .46;
  const item = wantsProduct ? unlockedRecipes[Math.floor(random() * unlockedRecipes.length)] : null;
  const fruitId = unlockedFruit[Math.floor(random() * unlockedFruit.length)] || 'apple';
  const quantity = wantsProduct ? 2 + Math.floor(random() * 4) : 5 + Math.floor(random() * (8 + Math.max(0, state.level - 1)));
  const unitValue = wantsProduct ? item.value : FRUITS[fruitId].value;
  const urgency = random() < .25 ? 'rush' : random() < .55 ? 'standard' : 'flexible';
  const quality = Math.min(5, 1 + Math.floor(state.reputation / 25) + (random() < .25 ? 1 : 0));
  const eventOrder = state.event?.endsAt > timestamp ? (EXPANDED_EVENTS[state.event.type]?.effect?.orderValue ?? 1) : 1;
  const basePayment = Math.round(unitValue * quantity * multiplier * (urgency === 'rush' ? 1.35 : 1) * eventOrder);
  const order = {
    id: `order-${timestamp}-${Math.random().toString(36).slice(2, 6)}`,
    contactId, customerName, avatar, kind: wantsProduct ? 'product' : 'fruit',
    itemId: wantsProduct ? item.id : fruitId, quantity, quality,
    deadline: timestamp + (urgency === 'rush' ? 90000 : urgency === 'standard' ? 210000 : 360000),
    urgency, basePayment, payment: basePayment, tipChance, reputation,
    status: 'offered', negotiationAttempts: 0, premium: false, fast: false
  };
  state.orders.push(order);
  state.orders = state.orders.slice(-40);
  createPhoneMessage(state, {
    contactId,
    text: `${customerName}: Can Fruitopia supply ${quantity} ${wantsProduct ? item.name : FRUITS[fruitId].name}${quality > 1 ? ` at quality ${quality}` : ''}? Offer: $${basePayment}.`,
    kind: 'order', relatedId: order.id,
    actions: ['accept', 'ask10', 'ask25', 'premium', 'fast', 'moreTime', 'decline']
  });
  return order;
}

export function respondToOrder(state, orderId, response, random = Math.random) {
  const order = state.orders.find(item => item.id === orderId);
  if (!order || order.status !== 'offered') return { ok: false, message: 'That offer is no longer available.' };
  if (response === 'accept') {
    order.status = 'accepted';
    return { ok: true, accepted: true, message: 'Order accepted. Supply it before the deadline.' };
  }
  if (response === 'decline') {
    order.status = 'declined';
    state.reputation = clamp(state.reputation - .25, 0, 100);
    return { ok: true, accepted: false, message: 'Declined politely. The customer appreciated the quick reply.' };
  }
  order.negotiationAttempts += 1;
  const bonuses = calculateBonuses(state);
  let chance = .75 + state.reputation / 250 + bonuses.negotiation;
  let multiplier = 1;
  if (response === 'ask10') { multiplier = 1.1; chance -= .12; }
  if (response === 'ask25') { multiplier = 1.25; chance -= .35; }
  if (response === 'premium') { multiplier = 1.3; chance -= .16; order.premium = true; order.quality = Math.min(5, order.quality + 1); }
  if (response === 'fast') { multiplier = 1.22; chance -= .1; order.fast = true; order.deadline -= 30000; }
  if (response === 'moreTime') { chance -= .08; order.deadline += 120000; }
  const accepted = random() < clamp(chance - order.negotiationAttempts * .05, .08, .95);
  if (accepted) {
    order.payment = Math.round(order.basePayment * multiplier * bonuses.orderValue);
    order.status = 'accepted';
    state.reputation = clamp(state.reputation + .5, 0, 100);
    return { ok: true, accepted: true, message: `Counteroffer accepted for $${order.payment}.` };
  }
  if (response === 'ask25' && random() < .5) {
    order.status = 'declined';
    state.reputation = clamp(state.reputation - .5, 0, 100);
    return { ok: true, accepted: false, rejected: true, message: 'The customer rejected the price and withdrew the order.' };
  }
  return { ok: true, accepted: false, message: 'They declined that term, but the original offer remains.', retry: true };
}

export function canFulfillOrder(state, order) {
  if (!order || order.status !== 'accepted' || order.deadline < Date.now()) return false;
  const storage = order.kind === 'product' ? state.products : state.inventory;
  if ((storage[order.itemId] || 0) < order.quantity) return false;
  if (order.kind === 'fruit' && (state.fruitQuality?.[order.itemId] || 1) < order.quality) return false;
  return true;
}

export function supplyOrder(state, orderId) {
  const order = state.orders.find(item => item.id === orderId);
  if (!canFulfillOrder(state, order)) return { ok: false, message: 'The requested stock, quality, or deadline is not ready.' };
  const storage = order.kind === 'product' ? state.products : state.inventory;
  storage[order.itemId] -= order.quantity;
  order.status = 'payment';
  const tip = Math.random() < order.tipChance ? Math.round(order.payment * (.08 + Math.random() * .18)) : 0;
  order.finalPayment = order.payment + tip;
  order.tip = tip;
  const message = createPhoneMessage(state, {
    contactId: order.contactId, kind: 'payment', relatedId: order.id,
    text: `Order received! Your fictional Fruitopia payment of $${order.finalPayment}${tip ? ` includes a $${tip} tip` : ''} is ready.`,
    actions: ['collectPayment']
  });
  return { ok: true, order, message };
}

export function startProduction(state, buildingId, timestamp = Date.now()) {
  const line = PRODUCTION_LINES.find(item => item.building === buildingId);
  const building = getBuilding(buildingId);
  const recipe = line && RECIPES.find(item => item.id === line.recipe);
  const level = buildingLevel(state, buildingId);
  if (!line || !building || !recipe || !level) return { ok: false, message: 'Build this production business first.' };
  if (totalProductInventory(state) >= calculateBonuses(state).warehouse) return { ok: false, message: 'The warehouse is full.' };
  if (!removeIngredients(state, recipe.ingredients)) return { ok: false, message: 'The required fruit is not in storage.' };
  const bonuses = calculateBonuses(state);
  const eventSpeed = state.event?.endsAt > timestamp ? (EXPANDED_EVENTS[state.event.type]?.effect?.productionSpeed ?? 1) : 1;
  if (eventSpeed <= 0) return { ok: false, message: 'Production is paused by the current event. Handle it through the phone or wait for repairs.' };
  const duration = line.seconds / ((bonuses.productionSpeed + (level - 1) * .12) * eventSpeed);
  const job = {
    id: `production-${timestamp}-${Math.random().toString(36).slice(2, 6)}`,
    buildingId, recipeId: recipe.id, quantity: level, startedAt: timestamp,
    endsAt: timestamp + duration * 1000, claimed: false
  };
  state.production.push(job);
  state.production = state.production.slice(-30);
  return { ok: true, job, recipe, building };
}

export function collectProduction(state, timestamp = Date.now()) {
  const completed = [];
  for (const job of state.production) {
    if (job.claimed || job.endsAt > timestamp) continue;
    const recipe = RECIPES.find(item => item.id === job.recipeId);
    if (!recipe) { job.claimed = true; continue; }
    const added = addProduct(state, recipe.id, job.quantity || 1);
    if (!added) continue;
    job.claimed = true;
    completed.push({ job, recipe, added });
  }
  state.production = state.production.filter(job => !job.claimed || timestamp - job.endsAt < 120000);
  return completed;
}

export function startResearch(state, fruitA, fruitB, timestamp = Date.now()) {
  if (state.research.active) return { ok: false, message: 'An experiment is already running.' };
  if (fruitA === fruitB) return { ok: false, message: 'Choose two different fruits.' };
  if (!isFruitUnlocked(state, fruitA) || !isFruitUnlocked(state, fruitB)) return { ok: false, message: 'Both fruits must be discovered first.' };
  if ((state.inventory[fruitA] || 0) < 2 || (state.inventory[fruitB] || 0) < 2) return { ok: false, message: 'Experiments require two of each fruit.' };
  if ((state.research.points || 0) < 2) return { ok: false, message: 'Earn two Research Points from harvesting, buildings, or worker ideas.' };
  state.inventory[fruitA] -= 2;
  state.inventory[fruitB] -= 2;
  state.research.points -= 2;
  const duration = 24 / Math.max(.5, 1 + calculateBonuses(state).research * .08 + (state.workers.researcher || 0) * .08);
  state.research.active = { fruits: [fruitA, fruitB], startedAt: timestamp, endsAt: timestamp + duration * 1000 };
  return { ok: true, message: 'Experiment started.', duration };
}

const FAILURE_LINES = [
  'The sample became extremely confident jam.',
  'The mixture sneezed, apologized, and turned beige.',
  'A tiny fruit umbrella appeared. No fruit did.',
  'The scanner reports “delicious, but scientifically ordinary.”',
  'The experiment produced one warm sock and no explanation.'
];

export function resolveResearch(state, timestamp = Date.now(), random = Math.random) {
  const active = state.research.active;
  if (!active || active.endsAt > timestamp) return null;
  const pair = [...active.fruits].sort();
  const recipe = HYBRID_RECIPES.find(item => item.ingredients[0] === pair[0] && item.ingredients[1] === pair[1]);
  const bonuses = calculateBonuses(state);
  const event = state.event?.endsAt > timestamp ? EXPANDED_EVENTS[state.event.type]?.effect || {} : {};
  const success = recipe && random() < clamp(.76 + bonuses.rare + bonuses.research * .015 + (event.rare || 0) + (event.research || 0) * .02, .76, .98);
  state.research.active = null;
  state.research.experiments = (state.research.experiments || 0) + 1;
  if (!success) {
    state.research.failures = (state.research.failures || 0) + 1;
    state.research.points += 1;
    return { success: false, message: FAILURE_LINES[Math.floor(random() * FAILURE_LINES.length)] };
  }
  const fruitId = recipe.result;
  const first = !state.fruitDiscoveries.includes(fruitId);
  if (first) {
    state.fruitDiscoveries.push(fruitId);
    state.research.notebook.push(fruitId);
    state.research.patents.push(fruitId);
    state.trees.push({
      id: `hybrid-${fruitId}`, fruit: fruitId, readyAt: timestamp + FRUITS[fruitId].growth * 1000,
      plantedAt: timestamp, level: 1, wateredUntil: 0, fertilizedUntil: 0, diseased: false, golden: false
    });
  }
  state.inventory[fruitId] = (state.inventory[fruitId] || 0) + 1;
  return { success: true, fruitId, fruit: FRUITS[fruitId], first };
}

const VISIT_TYPES = ['equipment', 'problem', 'training', 'raise', 'idea', 'inventory', 'rare', 'celebrate'];

export function createWorkerVisit(state, workerId, random = Math.random) {
  const worker = WORKER_CHARACTERS.find(item => item.id === workerId);
  const roster = state.workerRoster?.[workerId];
  if (!worker || !roster?.hired) return null;
  const type = VISIT_TYPES[Math.floor(random() * VISIT_TYPES.length)];
  const cost = Math.max(8, Math.round(18 * roster.skill * (1 + state.level * .08)));
  const scripts = {
    equipment: [`My ${worker.role.toLowerCase()} tools are holding me back. Could we improve them?`, [['fund', `Buy equipment ($${cost})`], ['prototype', 'Try a cheap prototype'], ['later', 'Come back later']]],
    problem: [`I found a problem in my district. We can stop work and fix it, or work around it.`, [['fix', `Repair it properly ($${cost})`], ['workaround', 'Use a temporary workaround'], ['pause', 'Pause and investigate']]],
    training: [`I want to train in ${worker.strength.toLowerCase()}. It could help, but I will be off shift briefly.`, [['train', `Approve training ($${cost})`], ['mentor', 'Pair me with a mentor'], ['later', 'Schedule it later']]],
    raise: [`I have been thinking about my contribution. Could we discuss a raise?`, [['raise', `Grant a raise ($${cost})`], ['bonus', `Offer a smaller bonus ($${Math.ceil(cost / 2)})`], ['goals', 'Set promotion goals']]],
    idea: [`I have a risky idea involving ${FRUITS[worker.favorite]?.name || 'fruit'}. It might improve profits—or make a memorable mess.`, [['fundIdea', `Fund the idea ($${cost})`], ['testIdea', 'Run a small test'], ['declineIdea', 'Focus on current work']]],
    inventory: [`We are running low on useful stock. Should I slow production or buy time with a substitute?`, [['slow', 'Slow production'], ['substitute', `Authorize substitutes ($${Math.ceil(cost / 2)})`], ['push', 'Keep the current pace']]],
    rare: [`I found an unusual seed near my station. Researching it costs time, but selling it now is certain cash.`, [['researchSeed', 'Send it to research'], ['sellSeed', `Sell it now (+$${cost * 2})`], ['keepSeed', 'Keep it as a clue']]],
    celebrate: [`The team reached a milestone! A celebration costs money but could lift everyone.`, [['party', `Host a celebration ($${cost})`], ['praise', 'Give a heartfelt speech'], ['work', 'Celebrate after the shift']]]
  };
  const [text, choices] = scripts[type];
  return { id: `visit-${Date.now()}-${workerId}`, workerId, type, text, choices: choices.map(([id, label]) => ({ id, label })), cost };
}

export function applyWorkerChoice(state, visit, choiceId, random = Math.random) {
  const roster = state.workerRoster[visit.workerId];
  const worker = WORKER_CHARACTERS.find(item => item.id === visit.workerId);
  if (!roster || !worker) return { ok: false, message: 'The worker is unavailable.' };
  let spent = 0, earned = 0, happiness = 0, loyalty = 0, skill = 0, reputation = 0, research = 0, message = '';
  const fullCost = visit.cost;
  const halfCost = Math.ceil(fullCost / 2);
  const pay = cost => {
    if (state.cash < cost) return false;
    state.cash -= cost;
    spent += cost;
    return true;
  };
  const outcomes = {
    fund: () => pay(fullCost) ? (roster.equipment = Math.min(5, roster.equipment + 1), happiness = 8, loyalty = 4, message = 'The new equipment improves speed and morale.') : message = 'The company cannot afford that equipment yet.',
    prototype: () => { happiness = random() < .55 ? 5 : -2; skill = 1; message = happiness > 0 ? 'The prototype worked surprisingly well.' : 'The prototype wobbled, but taught a useful lesson.'; },
    fix: () => pay(fullCost) ? (happiness = 5, loyalty = 3, message = 'The problem is properly repaired.') : message = 'The repair fund is short.',
    workaround: () => { happiness = -2; skill = 1; message = 'The workaround keeps production moving with a small morale cost.'; },
    pause: () => { happiness = 3; roster.energy += 8; message = 'Careful investigation prevents a larger breakdown.'; },
    train: () => pay(fullCost) ? (skill = 1, happiness = 5, roster.energy -= 12, message = 'Training improved skill but used some energy.') : message = 'Training is currently unaffordable.',
    mentor: () => { skill = random() < .6 ? 1 : 0; loyalty = 4; message = skill ? 'Mentoring produced a breakthrough.' : 'Mentoring built loyalty; the skill gain may come later.'; },
    raise: () => pay(fullCost) ? (happiness = 12, loyalty = 8, message = 'The raise created lasting goodwill.') : message = 'The payroll cannot support that raise.',
    bonus: () => pay(halfCost) ? (happiness = 6, loyalty = 2, message = 'The bonus helped, though the raise question remains.') : message = 'Even the bonus is out of reach.',
    goals: () => { happiness = -1; loyalty = 3; skill = 1; message = 'Clear goals trade immediate happiness for future growth.'; },
    fundIdea: () => pay(fullCost) ? (earned += random() < .62 ? fullCost * 2.4 : 0, research = 2, happiness = 7, message = earned > 0 ? 'The bold idea paid off!' : 'The idea failed commercially but produced research data.') : message = 'The idea needs more funding.',
    testIdea: () => { research = 1; happiness = 2; message = 'The small test produced useful evidence without a big risk.'; },
    declineIdea: () => { happiness = -3; roster.energy += 5; message = 'The team stays focused, though the worker feels unheard.'; },
    slow: () => { happiness = 4; roster.energy += 10; message = 'A slower pace protects quality and energy.'; },
    substitute: () => pay(halfCost) ? (happiness = 1, message = 'Substitutes keep production running at slightly lower quality.') : message = 'Substitutes are unaffordable.',
    push: () => { happiness = -5; roster.energy -= 10; message = 'The order stays on pace, but the team is strained.'; },
    researchSeed: () => { research = 4; happiness = 3; message = 'The seed becomes a promising research lead.'; },
    sellSeed: () => { earned += fullCost * 2; happiness = -1; message = 'The certain sale helps cash, but the discovery is gone.'; },
    keepSeed: () => { if (!state.secrets.clues.includes('golden_tree')) state.secrets.clues.push('golden_tree'); loyalty = 3; message = 'The seed becomes a clue in the company archive.'; },
    party: () => pay(fullCost) ? (happiness = 10, loyalty = 5, reputation = 1, message = 'The celebration lifts the whole company.') : message = 'The party budget is not available.',
    praise: () => { happiness = 5; loyalty = 3; message = 'Sincere recognition lands well.'; },
    work: () => { happiness = -3; earned += halfCost; message = 'The shift earns extra cash, but the team wanted a moment together.'; },
    later: () => { happiness = -1; message = 'The worker will return later.'; }
  };
  outcomes[choiceId]?.();
  state.cash = Math.max(0, state.cash + earned);
  state.lifetimeCash += earned;
  roster.happiness = clamp(roster.happiness + happiness, 0, 100);
  roster.loyalty = clamp(roster.loyalty + loyalty, 0, 100);
  roster.energy = clamp(roster.energy, 0, 100);
  roster.skill = clamp(roster.skill + skill, 1, 10);
  roster.memories.push(`${new Date().toLocaleDateString()}: ${visit.type} — ${choiceId}`);
  roster.memories = roster.memories.slice(-30);
  state.reputation = clamp(state.reputation + reputation, 0, 100);
  state.research.points += research;
  return { ok: true, message, cashDelta: earned - spent, happiness, loyalty, skill, reputation, research };
}

export function discoverSecret(state, secretId) {
  const secret = SECRETS.find(item => item.id === secretId);
  if (!secret || state.secrets.discovered.includes(secretId)) return null;
  state.secrets.discovered.push(secretId);
  state.secrets.clues = state.secrets.clues.filter(id => id !== secretId);
  return secret;
}

export { buildingCost, getBuilding, CONTACTS, BUILDINGS };
