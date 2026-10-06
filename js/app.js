import {
  SAVE_KEY, FRUITS, DISTRICTS, VEHICLES, ROUTES, RECIPES, WORKERS, MILESTONES,
  ACHIEVEMENTS, XP_FOR_LEVEL, getDistrict, formatIngredients
} from './config.js';
import {
  clamp, round2, totalInventory, totalFruitInventory, totalProductInventory, districtProgress, isDistrictUnlocked, titleForLevel,
  calculateBonuses, createInitialState, decodeSave, encodeSave, addXP, spend, addCash,
  addCoins, addInventory, addProduct, removeIngredients, progressStat, achievementUpdates,
  offlineSummary, newSeasonReward, startNewSeason
} from './core.js';
import { startMinigame, GAME_INFO } from './minigames.js';
import {
  BUILDINGS, BUILDING_CATEGORIES, OFFICE_UPGRADES, WORKER_CHARACTERS,
  PRODUCTION_LINES, EXPANDED_EVENTS, MINIGAME_CATALOG, SECRETS, EVOLUTION_AGES,
  buildingCost, getBuilding, getOfficeLevel
} from './expansion-config.js';
import {
  isFruitUnlocked, syncFruitDiscoveries, hasOfficeUpgrade, buildingLevel,
  averageWorkerHappiness, purchaseBuilding, createPhoneMessage, generateOrder,
  respondToOrder, canFulfillOrder, supplyOrder, startProduction, collectProduction,
  startResearch, resolveResearch, createWorkerVisit, applyWorkerChoice, discoverSecret
} from './expansion-core.js';
import { phoneMarkup, renderPhoneApp } from './phone.js';
import { officeMarkup, officeUpgradeMarkup, conversationMarkup, OFFICE_OBJECTS } from './office.js';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const now = () => Date.now();
const formatNumber = value => {
  const n = Number(value) || 0;
  if (n >= 1e9) return `${(n / 1e9).toFixed(n >= 1e10 ? 0 : 1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(n >= 1e7 ? 0 : 1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(n >= 1e4 ? 0 : 1)}K`;
  return Math.floor(n).toLocaleString();
};
const money = value => `$${formatNumber(value)}`;
const timeText = seconds => {
  const safe = Math.max(0, Math.ceil(seconds));
  if (safe >= 3600) return `${Math.floor(safe / 3600)}h ${Math.floor((safe % 3600) / 60)}m`;
  if (safe >= 60) return `${Math.floor(safe / 60)}m ${safe % 60}s`;
  return `${safe}s`;
};
const escapeHTML = value => String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));

let state;
try {
  state = decodeSave(localStorage.getItem(SAVE_KEY));
} catch {
  state = createInitialState();
}

const runtime = {
  zoom: innerWidth < 700 ? .58 : .75,
  target: null,
  keys: new Set(),
  pan: false,
  dragging: false,
  dragStart: null,
  lastFrame: performance.now(),
  lastEconomy: performance.now(),
  saleTimer: 0,
  pickerTimer: 0,
  makerTimer: 0,
  saveTimer: 0,
  requestAt: now() + 12000,
  phoneMessageAt: now() + 26000,
  orderAt: now() + 18000,
  workerVisitAt: now() + 32000,
  officeOpen: false,
  officeCategory: 'Communication',
  companyCategory: 'Starter',
  gamepadSeen: false,
  lastWorldRender: 0,
  modalCleanup: null,
  modalReturnFocus: null,
  audioContext: null,
  musicNodes: null,
  activeMinigame: null,
  resumeAt: now(),
  knownUnlocked: new Set(DISTRICTS.filter(d => isDistrictUnlocked(state, d)).map(d => d.id))
};

const dom = {
  world: $('#world'), viewport: $('#worldViewport'), sizer: $('#worldSizer'), player: $('#player'),
  marker: $('#moveMarker'), districtLayer: $('#districtLayer'), treeLayer: $('#treeLayer'),
  crateLayer: $('#crateLayer'), vehicleLayer: $('#vehicleLayer'), decor: $('#worldDecor'),
  modalHost: $('#modalHost'), toast: $('#toastRegion'), save: $('#saveIndicator')
};

function playSound(kind = 'tap') {
  if (!state.settings.sound) return;
  try {
    runtime.audioContext ??= new (window.AudioContext || window.webkitAudioContext)();
    const context = runtime.audioContext;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const notes = { tap: 360, harvest: 620, purchase: 470, coin: 880, level: 740, success: 690, fail: 170, countdown: 510, complete: 980 };
    oscillator.frequency.value = notes[kind] || notes.tap;
    oscillator.type = kind === 'fail' ? 'sawtooth' : 'sine';
    gain.gain.setValueAtTime(.055, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(.001, context.currentTime + (kind === 'level' ? .5 : .18));
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + (kind === 'level' ? .52 : .2));
  } catch { /* Audio is optional; gameplay never depends on it. */ }
}

function toggleMusic(enabled) {
  state.settings.music = enabled;
  if (!enabled && runtime.musicNodes) {
    runtime.musicNodes.forEach(node => { try { node.stop(); } catch {} });
    runtime.musicNodes = null;
    return;
  }
  if (!enabled || runtime.musicNodes) return;
  try {
    runtime.audioContext ??= new (window.AudioContext || window.webkitAudioContext)();
    const context = runtime.audioContext;
    const master = context.createGain();
    master.gain.value = .018;
    master.connect(context.destination);
    const notes = [261.6, 329.6, 392];
    runtime.musicNodes = notes.map((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency / 2;
      gain.gain.value = index === 0 ? .75 : .32;
      oscillator.connect(gain).connect(master);
      oscillator.start();
      return oscillator;
    });
  } catch { state.settings.music = false; }
}

function toast(title, message, icon = '🍓', type = '') {
  const node = document.createElement('div');
  node.className = `toast ${type}`;
  node.innerHTML = `<span class="toast-icon" aria-hidden="true">${icon}</span><span><strong>${escapeHTML(title)}</strong><small>${escapeHTML(message)}</small></span>`;
  dom.toast.append(node);
  setTimeout(() => node.remove(), 4300);
}

function rewardFly(icon, event) {
  if (state.settings.reducedMotion) return;
  const node = document.createElement('span');
  node.className = 'reward-fly';
  node.textContent = icon;
  node.style.left = `${event?.clientX || innerWidth / 2}px`;
  node.style.top = `${event?.clientY || innerHeight / 2}px`;
  document.body.append(node);
  setTimeout(() => node.remove(), 1100);
}

function updateObjectiveProgress(type, amount) {
  const safe = Math.max(0, Number(amount) || 0);
  for (const quest of state.quests) {
    if (!quest.claimed && quest.type === type) quest.progress = Math.min(quest.target, (quest.progress || 0) + safe);
  }
  for (const milestone of MILESTONES) {
    const entry = state.milestones[milestone.id];
    if (entry && !entry.claimed && milestone.type === type) entry.progress = Math.min(milestone.target, (entry.progress || 0) + safe);
  }
}

function record(type, amount = 1) {
  progressStat(state, type, amount);
  const unlocked = achievementUpdates(state);
  for (const achievement of unlocked) {
    updateObjectiveProgress('earnCoins', achievement.reward);
    toast('Achievement unlocked!', `${achievement.name} · +${achievement.reward} Fruit Coins`, achievement.icon, 'reward');
    playSound('complete');
  }
  renderQuests();
}

function gainCash(amount, source = '') {
  const gained = addCash(state, amount);
  if (gained) record('earnCash', gained);
  if (source) scheduleSave();
  return gained;
}

function gainCoins(amount, source = '') {
  const gained = addCoins(state, amount);
  if (gained) record('earnCoins', gained);
  if (source) scheduleSave();
  return gained;
}

function gainXP(amount) {
  const levels = addXP(state, amount);
  if (levels) {
    const bonus = state.level * 20;
    gainCash(bonus, 'level');
    toast('Empire level up!', `Level ${state.level}: ${titleForLevel(state.level)} · ${money(bonus)} bonus`, '🌟', 'reward');
    playSound('level');
    checkDistrictUnlocks();
  }
  return levels;
}

function scheduleSave() {
  runtime.saveTimer = Math.max(runtime.saveTimer, 1);
  dom.save.textContent = 'Saving…';
  dom.save.classList.add('saving');
}

function saveGame(show = false) {
  try {
    state.lastSavedAt = now();
    localStorage.setItem(SAVE_KEY, encodeSave(state, state.lastSavedAt));
    dom.save.textContent = '✓ Saved';
    dom.save.classList.remove('saving');
    runtime.saveTimer = 0;
    if (show) toast('Game saved', 'Your fruit empire is safe on this device.', '💾');
    return true;
  } catch {
    dom.save.textContent = 'Save failed';
    dom.save.classList.add('saving');
    toast('Could not save', 'Browser storage may be unavailable.', '⚠️', 'error');
    return false;
  }
}

function openModal({ title, eyebrow = 'Fruitopia Tycoon', content = '', wide = false, minigame = false, onOpen = null, onClose = null }) {
  closeModal();
  runtime.modalReturnFocus = document.activeElement;
  const fragment = $('#modalTemplate').content.cloneNode(true);
  const backdrop = $('.modal-backdrop', fragment);
  const modal = $('.modal', fragment);
  if (wide) modal.classList.add('wide');
  if (minigame) modal.classList.add('minigame-modal');
  $('#modalTitle', fragment).textContent = title;
  $('#modalEyebrow', fragment).textContent = eyebrow;
  const body = $('.modal-body', fragment);
  body.innerHTML = content;
  dom.modalHost.append(fragment);
  const close = () => closeModal();
  $('.modal-close', dom.modalHost).addEventListener('click', close);
  $('.modal-backdrop', dom.modalHost).addEventListener('pointerdown', event => {
    if (event.target === event.currentTarget) close();
  });
  const keyHandler = event => {
    if (event.key === 'Escape') { event.preventDefault(); close(); return; }
    if (event.key !== 'Tab') return;
    const focusable = $$('button:not(:disabled), [href], select:not(:disabled), input:not(:disabled), [tabindex]:not([tabindex="-1"])', modal);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };
  document.addEventListener('keydown', keyHandler);
  runtime.modalCleanup = () => {
    document.removeEventListener('keydown', keyHandler);
    onClose?.();
  };
  onOpen?.(body, modal);
  queueMicrotask(() => $('.modal-close', modal)?.focus());
  return { body, modal };
}

function closeModal() {
  runtime.modalCleanup?.();
  runtime.modalCleanup = null;
  dom.modalHost.innerHTML = '';
  if (runtime.modalReturnFocus?.isConnected) runtime.modalReturnFocus.focus();
  runtime.modalReturnFocus = null;
}

const TREE_POSITIONS = [
  [590, 150], [700, 145], [820, 145], [930, 175], [600, 255], [715, 250],
  [850, 250], [965, 285], [565, 365], [690, 375], [840, 365], [965, 405],
  [1090, 170], [1190, 205], [1290, 255], [1590, 520], [1790, 520], [1360, 1000],
  [1510, 980], [1640, 1040], [720, 1030]
];
const CRATE_POSITIONS = {
  stand: [230, 470], orchard: [1010, 180], depot: [1300, 520], market: [570, 790],
  juice: [1130, 850], tropical: [1920, 830], frozen: [1710, 1160], festival: [570, 1240]
};
const DECOR_ICONS = ['🌼', '🌷', '🌻', '🪻', '🌿', '🪨', '🌲', '🌳', '🌾', '🍄'];

function renderDecor() {
  const random = (() => {
    let seed = 771;
    return () => ((seed = seed * 16807 % 2147483647) - 1) / 2147483646;
  })();
  dom.decor.innerHTML = Array.from({ length: 92 }, (_, index) => {
    const icon = DECOR_ICONS[Math.floor(random() * DECOR_ICONS.length)];
    const x = 35 + random() * 2110;
    const y = 55 + random() * 1280;
    const type = icon === '🪨' ? 'rock' : ['🌼', '🌷', '🌻', '🪻'].includes(icon) ? 'flower' : '';
    return `<span class="decor ${type}" style="left:${x}px;top:${y}px;animation-delay:-${(index % 7) * .4}s">${icon}</span>`;
  }).join('');
}

function renderWorld(force = false) {
  if (!force && now() - runtime.lastWorldRender < 850) return;
  runtime.lastWorldRender = now();
  const timestamp = now();
  const bonuses = calculateBonuses(state);
  dom.treeLayer.innerHTML = state.trees.map((tree, index) => {
    const fruit = FRUITS[tree.fruit];
    const [x, y] = TREE_POSITIONS[index] || [600 + (index % 5) * 100, 200 + Math.floor(index / 5) * 100];
    const unlocked = isFruitUnlocked(state, tree.fruit);
    const ready = unlocked && tree.readyAt <= timestamp;
    const left = Math.max(0, (tree.readyAt - timestamp) / 1000);
    const almost = !ready && left <= fruit.growth * .25;
    const status = tree.diseased ? 'Diseased' : tree.golden ? 'Golden' : ready ? 'Ripe' : almost ? 'Almost ready' : tree.wateredUntil > timestamp ? 'Watered' : tree.fertilizedUntil > timestamp ? 'Fertilized' : tree.plantedAt && tree.plantedAt > timestamp - 1600 ? 'Empty' : 'Growing';
    return `<button class="tree-node ${!unlocked ? 'locked' : ready ? 'ready' : 'harvested'} ${status.toLowerCase().replaceAll(' ', '-')}" type="button" data-tree="${escapeHTML(tree.id)}" style="left:${x}px;top:${y}px" aria-label="${ready ? `Harvest ${fruit.name}` : unlocked ? `${fruit.name}: ${status}, ${timeText(left)}` : `${fruit.name} unlocks at level ${fruit.level}`}">
      <span class="tree-crown">${tree.fruit === 'strawberry' || tree.fruit === 'blueberry' || tree.fruit === 'frozenberry' ? '🌿' : tree.fruit === 'coconut' ? '🌴' : '🌳'}</span>
      <span class="tree-fruit">${unlocked ? tree.diseased ? '🦠' : tree.golden ? '✨' : fruit.icon : '🔒'}</span>
      <span class="tree-timer">${!unlocked ? `Lv ${fruit.level}` : ready ? 'Pick me!' : `${status} · ${timeText(left)}`}</span>
    </button>`;
  }).join('');
  $$('[data-tree]', dom.treeLayer).forEach(button => button.addEventListener('click', event => harvestTree(button.dataset.tree, event)));

  dom.districtLayer.innerHTML = DISTRICTS.map((area, index) => {
    const unlocked = isDistrictUnlocked(state, area);
    const progress = districtProgress(state, area.id);
    const purchased = area.upgrades.filter(upgrade => state.upgrades[area.id].includes(upgrade.id));
    const visual = purchased.map((upgrade, i) => {
      const positions = [[-4, 55], [185, 53], [18, 3], [183, 5], [46, 88], [154, 91], [86, -17], [130, -13]];
      const [dx, dy] = positions[i];
      return `<span class="building-decor" style="left:${dx}px;top:${dy}px" title="${escapeHTML(upgrade.name)}">${upgrade.icon}</span>`;
    }).join('');
    const status = !unlocked ? `Unlock: level ${area.unlock.level}${area.unlock.prev ? ` + ${area.unlock.progress}% ${getDistrict(area.unlock.prev).name}` : ''}` : progress === 100 ? 'Complete · ✨ Mastered' : `${progress}% complete${progress >= 75 ? ' · ⚡ Teleporter' : ''}`;
    return `<button class="district-marker ${!unlocked ? 'locked' : ''} ${progress === 100 ? 'completed' : ''}" type="button" data-district="${area.id}" style="left:${area.x - 115}px;top:${area.y - 72}px;--d1:${area.colors[0]};--d2:${area.colors[1]}" aria-label="${escapeHTML(area.name)}. ${escapeHTML(status)}">
      <span class="district-building">${area.icon}</span>${visual}<span class="district-label">${escapeHTML(area.name)}<small>${escapeHTML(status)}</small></span>
    </button>`;
  }).join('') + `<button class="special-world-building office-world-marker" type="button" data-open-office-world style="left:315px;top:330px"><span>${getOfficeLevel(state).icon}</span><b>${escapeHTML(getOfficeLevel(state).name)}</b><small>Enter office</small></button>` +
    BUILDINGS.filter(building => buildingLevel(state, building.id) > 0 && !['roadside_fruit_stand', 'orchard_shed', 'tiny_office'].includes(building.id)).map((building, index) => {
      const area = getDistrict(building.district);
      const level = buildingLevel(state, building.id);
      const x = area.x + ((index % 5) - 2) * 31;
      const y = area.y + 76 + Math.floor((index % 10) / 5) * 38;
      return `<button class="built-world-node level-${level}" type="button" data-world-building="${building.id}" style="left:${x}px;top:${y}px" title="${escapeHTML(building.name)} · stage ${level}"><span>${building.icon}</span><small>${level}</small></button>`;
    }).join('') + WORKER_CHARACTERS.filter(worker => state.workerRoster?.[worker.id]?.hired).map((worker, index) => {
      const area = getDistrict(state.workerRoster[worker.id].assignment || 'stand') || DISTRICTS[0];
      return `<button class="world-worker" type="button" data-world-worker="${worker.id}" style="left:${area.x - 85 + (index % 5) * 34}px;top:${area.y + 115 + Math.floor(index / 5) * 34}px" aria-label="Talk to ${escapeHTML(worker.name)}"><span>${worker.avatar}</span><small>${escapeHTML(worker.name.split(' ')[0])}</small></button>`;
    }).join('');
  $$('[data-district]', dom.districtLayer).forEach(button => button.addEventListener('click', () => {
    const area = getDistrict(button.dataset.district);
    if (!isDistrictUnlocked(state, area)) {
      toast('Area still locked', `Reach level ${area.unlock.level}${area.unlock.prev ? ` and ${area.unlock.progress}% in ${getDistrict(area.unlock.prev).name}` : ''}.`, '🔒', 'error');
      playSound('fail');
      return;
    }
    openDistrict(area.id);
  }));
  $('[data-open-office-world]', dom.districtLayer)?.addEventListener('click', openOffice);
  $$('[data-world-building]', dom.districtLayer).forEach(button => button.addEventListener('click', () => openBuildings(getBuilding(button.dataset.worldBuilding)?.category)));
  $$('[data-world-worker]', dom.districtLayer).forEach(button => button.addEventListener('click', () => openWorkerDetail(button.dataset.worldWorker)));

  dom.crateLayer.innerHTML = DISTRICTS.filter(area => isDistrictUnlocked(state, area) && !state.hiddenCrates.includes(area.id)).map(area => {
    const [x, y] = CRATE_POSITIONS[area.id];
    return `<button class="hidden-crate" type="button" data-crate="${area.id}" style="left:${x}px;top:${y}px" aria-label="Hidden Fruit Coin crate in ${escapeHTML(area.name)}">🎁</button>`;
  }).join('');
  $$('[data-crate]', dom.crateLayer).forEach(button => button.addEventListener('click', event => collectCrate(button.dataset.crate, event)));

  const active = state.deliveries.filter(delivery => !delivery.rewarded && delivery.endsAt > timestamp);
  dom.vehicleLayer.innerHTML = active.map((delivery, index) => {
    const vehicle = VEHICLES.find(item => item.id === delivery.vehicleId);
    const duration = Math.max(4, (delivery.endsAt - delivery.startedAt) / 1000);
    return `<span class="world-vehicle" style="left:${1140 + index * 35}px;top:${430 + index * 16}px;--drive-time:${duration}s" title="${escapeHTML(vehicle.name)} delivering">${vehicle.icon}</span>`;
  }).join('');

  dom.player.style.left = `${state.player.x}px`;
  dom.player.style.top = `${state.player.y}px`;
  $('#basketValue').textContent = `${totalFruitInventory(state)}/${Math.floor(bonuses.capacity)} · 📦${totalProductInventory(state)}/${Math.floor(bonuses.warehouse)}`;
}

function collectCrate(districtId, event) {
  if (state.hiddenCrates.includes(districtId)) return;
  state.hiddenCrates.push(districtId);
  const areaIndex = DISTRICTS.findIndex(item => item.id === districtId);
  const coins = 3 + Math.floor(areaIndex / 2);
  const cash = 55 * (areaIndex + 1);
  gainCoins(coins, 'crate');
  gainCash(cash, 'crate');
  gainXP(25 + areaIndex * 12);
  rewardFly('🪙', event);
  toast('Secret crate found!', `${coins} Fruit Coins · ${money(cash)} · bonus XP`, '🎁', 'reward');
  playSound('coin');
  renderWorld(true);
}

function eventEffect(key, fallback = 1) {
  if (!state.event || state.event.endsAt <= now()) return fallback;
  return EXPANDED_EVENTS[state.event.type]?.effect?.[key] ?? fallback;
}

function harvestTree(treeId, event, automatic = false) {
  const tree = state.trees.find(item => item.id === treeId);
  if (!tree) return false;
  const fruit = FRUITS[tree.fruit];
  if (!isFruitUnlocked(state, tree.fruit)) {
    toast('Seed not unlocked', `${fruit.name} unlocks at empire level ${fruit.level}.`, '🔒', 'error');
    return false;
  }
  if (tree.readyAt > now()) {
    if (!automatic) openTreeCare(treeId);
    return false;
  }
  if (tree.diseased) {
    if (!automatic) openTreeCare(treeId);
    return false;
  }
  const bonuses = calculateBonuses(state);
  const caredMultiplier = (tree.wateredUntil > now() ? 1.15 : 1) * (tree.fertilizedUntil > now() ? 1.3 : 1) * (tree.golden ? 2 : 1);
  const baseYield = Math.max(1, Math.round((2 + (tree.level || 1) * .5) * bonuses.harvest * eventEffect('harvest', 1) * caredMultiplier));
  const added = addInventory(state, tree.fruit, baseYield);
  if (!added) {
    if (!automatic) toast('Basket full', 'Sell fruit, craft a recipe, or buy storage space.', '🧺', 'error');
    return false;
  }
  tree.readyAt = now() + fruit.growth * 1000 * bonuses.growth * eventEffect('growth', 1) * (tree.wateredUntil > now() ? .8 : 1);
  tree.plantedAt = now();
  tree.golden = false;
  tree.diseased = Math.random() < .018;
  tree.wateredUntil = 0;
  tree.fertilizedUntil = 0;
  state.fruitQuality[tree.fruit] = clamp((state.fruitQuality[tree.fruit] || 1) + (automatic ? .002 : .018 * bonuses.quality), 1, 5);
  if (!automatic) state.research.points = round2(state.research.points + .12);
  record('harvest', added);
  gainXP(automatic ? 1 : 3 + Math.floor(added / 2));
  if (!automatic) {
    if (Math.random() < bonuses.coinChance + eventEffect('coinChance', 0)) {
      gainCoins(1, 'harvest');
      toast('Fruit Coin!', 'Manual harvesting uncovered a shiny Fruit Coin.', '🪙', 'reward');
      playSound('coin');
    } else playSound('harvest');
    rewardFly(fruit.icon, event);
  }
  scheduleSave();
  renderWorld(true);
  return true;
}

function openTreeCare(treeId) {
  const tree = state.trees.find(item => item.id === treeId);
  if (!tree) return;
  const fruit = FRUITS[tree.fruit];
  openModal({
    title: `${fruit.icon} ${fruit.name} Tree`, eyebrow: '🌿 Orchard care',
    content: `<div class="tree-care"><div class="tree-care-hero">${tree.diseased ? '🦠' : tree.readyAt <= now() ? fruit.icon : '🌳'}</div><p>${tree.diseased ? 'This tree is diseased and needs treatment before harvest.' : tree.readyAt <= now() ? 'The fruit is ripe and ready.' : `Growing for ${timeText((tree.readyAt - now()) / 1000)} more.`}</p><div class="game-controls"><button type="button" data-tree-action="water" ${tree.wateredUntil > now() ? 'disabled' : ''}>💧 Water · $2</button><button type="button" data-tree-action="fertilize" ${tree.fertilizedUntil > now() ? 'disabled' : ''}>♻️ Fertilize · $5</button><button type="button" data-tree-action="treat" ${tree.diseased ? '' : 'disabled'}>🩺 Treat · $8</button><button type="button" class="primary-button" data-tree-action="harvest" ${tree.readyAt <= now() && !tree.diseased ? '' : 'disabled'}>🧺 Harvest</button></div></div>`,
    onOpen: body => {
      $$('[data-tree-action]', body).forEach(button => button.addEventListener('click', event => {
        const action = button.dataset.treeAction;
        if (action === 'harvest') { closeModal(); harvestTree(treeId, event); return; }
        const cost = action === 'water' ? 2 : action === 'fertilize' ? 5 : 8;
        if (!spend(state, cost, 0)) { toast('Not enough Cash', `Tree care costs ${money(cost)}.`, '🌱', 'error'); return; }
        if (action === 'water') { tree.wateredUntil = now() + 90000; tree.readyAt = Math.max(now(), tree.readyAt - fruit.growth * 200); }
        if (action === 'fertilize') tree.fertilizedUntil = now() + 120000;
        if (action === 'treat') tree.diseased = false;
        playSound('purchase'); scheduleSave(); renderWorld(true); closeModal(); openTreeCare(treeId);
      }));
    }
  });
}

function setZoom(next) {
  const old = runtime.zoom;
  runtime.zoom = clamp(next, .45, 1.15);
  const centerX = (dom.viewport.scrollLeft + dom.viewport.clientWidth / 2) / old;
  const centerY = (dom.viewport.scrollTop + dom.viewport.clientHeight / 2) / old;
  dom.world.style.setProperty('--zoom', runtime.zoom);
  dom.sizer.style.width = `${2200 * runtime.zoom}px`;
  dom.sizer.style.height = `${1400 * runtime.zoom}px`;
  $('#zoomValue').textContent = `${Math.round(runtime.zoom * 100)}%`;
  dom.viewport.scrollLeft = centerX * runtime.zoom - dom.viewport.clientWidth / 2;
  dom.viewport.scrollTop = centerY * runtime.zoom - dom.viewport.clientHeight / 2;
}

function centerOn(x = state.player.x, y = state.player.y, smooth = true) {
  dom.viewport.scrollTo({ left: x * runtime.zoom - dom.viewport.clientWidth / 2, top: y * runtime.zoom - dom.viewport.clientHeight / 2, behavior: smooth && !state.settings.reducedMotion ? 'smooth' : 'auto' });
}

function teleportTo(districtId) {
  const area = getDistrict(districtId);
  if (!area || !isDistrictUnlocked(state, area)) return;
  const progress = districtProgress(state, districtId);
  if (progress < 75 && !['stand', 'orchard'].includes(districtId)) {
    toast('Teleporter offline', 'Reach 75% district completion to power this pad.', '⚡', 'error');
    return;
  }
  state.player.x = area.x;
  state.player.y = area.y + 120;
  runtime.target = null;
  renderWorld(true);
  closeModal();
  centerOn(undefined, undefined, false);
  toast('Teleported!', `Welcome to ${area.name}.`, '⚡');
  playSound('success');
}

function movementFrame(timestamp) {
  const delta = Math.min(.05, (timestamp - runtime.lastFrame) / 1000);
  runtime.lastFrame = timestamp;
  // Visibility changes clear held keys, so movement can safely stay frame-driven
  // without depending on browser-specific visibility behavior in installed apps.
  if (!dom.modalHost.firstElementChild) {
    let dx = 0, dy = 0;
    if (runtime.keys.has('arrowleft') || runtime.keys.has('a')) dx -= 1;
    if (runtime.keys.has('arrowright') || runtime.keys.has('d')) dx += 1;
    if (runtime.keys.has('arrowup') || runtime.keys.has('w')) dy -= 1;
    if (runtime.keys.has('arrowdown') || runtime.keys.has('s')) dy += 1;
    const gamepad = navigator.getGamepads?.()?.find(Boolean);
    if (gamepad) {
      const gx = Math.abs(gamepad.axes[0] || 0) > .18 ? gamepad.axes[0] : 0;
      const gy = Math.abs(gamepad.axes[1] || 0) > .18 ? gamepad.axes[1] : 0;
      dx += gx + (gamepad.buttons[15]?.pressed ? 1 : 0) - (gamepad.buttons[14]?.pressed ? 1 : 0);
      dy += gy + (gamepad.buttons[13]?.pressed ? 1 : 0) - (gamepad.buttons[12]?.pressed ? 1 : 0);
      runtime.gamepadSeen = true;
    }
    if (dx || dy) {
      runtime.target = null;
      const length = Math.hypot(dx, dy) || 1;
      state.player.x = clamp(state.player.x + dx / length * 240 * delta, 45, 2155);
      state.player.y = clamp(state.player.y + dy / length * 240 * delta, 65, 1340);
      dom.player.style.left = `${state.player.x}px`;
      dom.player.style.top = `${state.player.y}px`;
    } else if (runtime.target) {
      const tx = runtime.target.x - state.player.x;
      const ty = runtime.target.y - state.player.y;
      const distance = Math.hypot(tx, ty);
      if (distance < 8) runtime.target = null;
      else {
        const step = Math.min(distance, 220 * delta);
        state.player.x += tx / distance * step;
        state.player.y += ty / distance * step;
        dom.player.style.left = `${state.player.x}px`;
        dom.player.style.top = `${state.player.y}px`;
      }
    }
  }
  requestAnimationFrame(movementFrame);
}

function districtPassive(area) {
  const fromUpgrades = area.upgrades
    .filter(upgrade => state.upgrades[area.id].includes(upgrade.id))
    .reduce((sum, upgrade) => sum + (upgrade.effect.passive || 0), 0);
  const fromWorkers = WORKERS.filter(worker => worker.district === area.id)
    .reduce((sum, worker) => sum + (state.workers[worker.id] || 0) * (worker.id === 'festival_worker' ? 2.5 : worker.id === 'seller' ? 1.25 : .25), 0);
  return round2(fromUpgrades + fromWorkers);
}

function workerCost(worker) {
  const level = state.workers[worker.id] || 0;
  return { cash: Math.round(worker.base * Math.pow(1.72, level)), coins: level >= 4 ? Math.ceil((level - 3) / 2) : 0 };
}

function renderDistrictContent(body, districtId) {
  const area = getDistrict(districtId);
  const progress = districtProgress(state, districtId);
  const purchased = state.upgrades[districtId];
  const next = area.upgrades.find(upgrade => !purchased.includes(upgrade.id));
  const teleporterReady = progress >= 75;
  const minigameOwned = Boolean(state.minigames[districtId]);
  const areaWorkers = WORKERS.filter(worker => worker.district === districtId);
  const products = RECIPES.filter(recipe => recipe.district === districtId);
  const availableFruit = Object.entries(FRUITS).filter(([, fruit]) => fruit.level <= state.level).slice(-5);
  body.innerHTML = `
    <div class="district-hero">
      <div><h3>${area.icon} ${escapeHTML(area.name)}</h3><p>${progress === 100 ? 'This district is thriving at full brilliance.' : next ? `Recommended next: ${next.icon} ${escapeHTML(next.name)} — ${escapeHTML(next.desc)}` : 'Every improvement is complete.'}</p>
        <div class="district-statline"><span class="tag cash">↗ ${money(districtPassive(area))}/s passive</span><span class="tag">${availableFruit.map(([id, fruit]) => fruit.icon).join(' ')} available fruit</span><span class="tag ${teleporterReady ? 'coin' : ''}">⚡ Teleporter ${teleporterReady ? 'online' : `at 75%`}</span><span class="tag ${minigameOwned ? 'coin' : ''}">🎮 ${minigameOwned ? 'Minigame owned' : progress >= 75 ? 'Minigame revealed' : 'Minigame at 75%'}</span></div>
      </div>
      <div class="district-action"><div class="progress-wrap"><div class="progress-label"><strong>District progress</strong><span>${progress}%</span></div><div class="big-progress"><span style="width:${progress}%"></span></div></div>${teleporterReady ? `<button class="secondary-button" type="button" data-teleport="${area.id}" style="margin-top:9px">⚡ Teleport here</button>` : ''}</div>
    </div>
    <div class="section-title"><h3>District objectives</h3><small>${purchased.length}/8 improvements</small></div>
    <div class="card-grid">
      <article class="game-card ${purchased.length >= 6 ? 'completed' : ''}"><div class="card-top"><span class="card-icon">🔨</span><div><h4>Build the district</h4><p>Purchase 6 improvements to reveal its signature minigame.</p></div></div><div class="card-meta"><span class="tag">${Math.min(purchased.length, 6)} / 6</span></div></article>
      <article class="game-card ${minigameOwned ? 'completed' : ''}"><div class="card-top"><span class="card-icon">🎟️</span><div><h4>Local attraction</h4><p>Purchase ${escapeHTML(area.minigame)} with Fruit Coins.</p></div></div><div class="card-meta"><span class="tag">${minigameOwned ? 'Complete ✓' : 'Not purchased'}</span></div></article>
      <article class="game-card ${progress === 100 ? 'completed' : ''}"><div class="card-top"><span class="card-icon">✨</span><div><h4>District masterpiece</h4><p>Purchase all improvements for a major one-time reward.</p></div></div><div class="card-meta"><span class="tag">${progress} / 100%</span></div></article>
    </div>
    <div class="section-title"><h3>Improvements</h3><small>Each purchase changes the world map</small></div>
    <div class="card-grid">${area.upgrades.map((upgrade, index) => {
      const owned = purchased.includes(upgrade.id);
      const canBuy = !owned && state.cash >= upgrade.cash && state.coins >= upgrade.coins;
      return `<article class="game-card ${owned ? 'completed' : ''}"><div class="card-top"><span class="card-icon">${upgrade.icon}</span><div><h4>${index + 1}. ${escapeHTML(upgrade.name)}</h4><p>${escapeHTML(upgrade.desc)}</p></div></div><div class="card-meta"><span class="tag cash">💵 ${money(upgrade.cash)}</span>${upgrade.coins ? `<span class="tag coin">🪙 ${upgrade.coins}</span>` : ''}</div><button class="card-button ${owned ? 'purchased' : canBuy ? 'afford' : ''}" type="button" data-upgrade="${upgrade.id}" ${owned ? 'disabled' : ''}>${owned ? 'Purchased ✓' : 'Purchase improvement'}</button></article>`;
    }).join('')}</div>
    <div class="section-title"><h3>Workers & automation</h3><small>Interactive actions keep bonus rewards</small></div>
    <div class="card-grid">${areaWorkers.length ? areaWorkers.map(worker => {
      const level = state.workers[worker.id] || 0;
      const cost = workerCost(worker);
      return `<article class="game-card"><div class="card-top"><span class="card-icon">${worker.icon}</span><div><h4>${escapeHTML(worker.name)} · Lv ${level}</h4><p>${escapeHTML(worker.desc)}</p></div></div><div class="card-meta"><span class="tag cash">💵 ${money(cost.cash)}</span>${cost.coins ? `<span class="tag coin">🪙 ${cost.coins}</span>` : ''}</div><button class="card-button" type="button" data-worker="${worker.id}" ${level >= 10 ? 'disabled' : ''}>${level >= 10 ? 'Fully trained ✓' : level ? 'Train worker' : 'Hire worker'}</button></article>`;
    }).join('') : '<article class="game-card"><div class="card-top"><span class="card-icon">🤝</span><div><h4>Visiting crew</h4><p>Specialist workers for this area arrive as the empire expands.</p></div></div><div class="card-meta"><span class="tag">District upgrades still add automation</span></div></article>'}</div>
    <div class="section-title"><h3>Signature minigame</h3><small>High score: ${formatNumber(state.highScores[districtId] || 0)}</small></div>
    <article class="game-card ${minigameOwned ? 'selected' : progress < 75 ? 'locked' : ''}"><div class="card-top"><span class="card-icon">${GAME_INFO[districtId].icon}</span><div><h3>${escapeHTML(area.minigame)}</h3><p>${escapeHTML(GAME_INFO[districtId].instructions)}</p></div></div><div class="card-meta"><span class="tag">Replayable</span><span class="tag">Cash · XP · Fruit Coins</span>${!minigameOwned ? `<span class="tag coin">🪙 ${area.minigameCost}</span>` : ''}</div>${progress < 75 ? `<button class="card-button" disabled type="button">Reveals at 75% completion</button>` : minigameOwned ? `<button class="card-button" type="button" data-play="${districtId}">Play ${escapeHTML(area.minigame)}</button>` : `<button class="card-button" type="button" data-buy-game="${districtId}">Purchase minigame</button>`}</article>
    <div class="section-title"><h3>Local products</h3><button class="text-button" type="button" data-open-recipes>Open full recipe book</button></div>
    <div class="card-grid">${products.length ? products.map(recipe => `<article class="game-card"><div class="card-top"><span class="card-icon">${recipe.icon}</span><div><h4>${escapeHTML(recipe.name)}</h4><p>${formatIngredients(recipe.ingredients)} · sells for ${money(recipe.value)}</p></div></div></article>`).join('') : '<article class="game-card"><p>This district focuses on fresh fruit, routes, and upgrades.</p></article>'}</div>`;

  $$('[data-upgrade]', body).forEach(button => button.addEventListener('click', () => purchaseUpgrade(districtId, button.dataset.upgrade, body)));
  $$('[data-worker]', body).forEach(button => button.addEventListener('click', () => hireWorker(button.dataset.worker, () => renderDistrictContent(body, districtId))));
  $('[data-teleport]', body)?.addEventListener('click', () => teleportTo(districtId));
  $('[data-buy-game]', body)?.addEventListener('click', () => purchaseMinigame(districtId, body));
  $('[data-play]', body)?.addEventListener('click', () => openMinigame(districtId));
  $('[data-open-recipes]', body)?.addEventListener('click', () => openRecipes());
}

function openDistrict(districtId) {
  const area = getDistrict(districtId);
  openModal({
    title: area.name,
    eyebrow: `${area.icon} District workshop`,
    wide: true,
    onOpen: body => renderDistrictContent(body, districtId)
  });
}

function renderCompany(body, category = runtime.companyCategory) {
  runtime.companyCategory = category || 'Starter';
  const list = BUILDINGS.filter(building => building.category === runtime.companyCategory);
  const activeProduction = state.production.filter(job => !job.claimed);
  body.innerHTML = `<div class="company-overview"><div><h3>🍓 Fruitopia Corporation</h3><p>Construct and expand every part of the company. Each building has three visible stages and a real economic effect.</p></div><div class="company-totals"><b>${BUILDINGS.filter(building => buildingLevel(state, building.id) > 0).length}/86</b><small>buildings open</small></div></div><div class="tabs building-tabs">${BUILDING_CATEGORIES.map(item => `<button type="button" data-building-category="${escapeHTML(item.name)}" class="${item.name === runtime.companyCategory ? 'active' : ''}">${item.icon} ${escapeHTML(item.name)}</button>`).join('')}</div><div class="card-grid building-grid">${list.map(building => {
    const level = buildingLevel(state, building.id);
    const cost = buildingCost(building, level);
    const secretKey = building.secret && level === 0;
    const line = PRODUCTION_LINES.find(item => item.building === building.id);
    const job = activeProduction.find(item => item.buildingId === building.id);
    const stage = building.stages[level];
    const attractionReady = !state.attractionVisits?.[building.id] || state.attractionVisits[building.id] <= now() - 10000;
    const boothOptions = Object.entries(FRUITS).filter(([id, fruit]) => !fruit.hybrid && isFruitUnlocked(state, id)).slice(0, 10); const boothFruit = boothOptions[Math.floor(now() / 86400000) % Math.max(1, boothOptions.length)] || ['apple', FRUITS.apple]; const boothCount = 8 + (Math.floor(now() / 86400000) % 5);
    const special = level && building.id === 'fruit_coin_booth' ? `<button type="button" class="secondary-button" data-building-action="coinExchange" data-fruit="${boothFruit[0]}" data-count="${boothCount}">Today's trade: ${boothCount} ${boothFruit[1].icon} · +1 🪙</button>` : level && building.id === 'farmers_market' ? '<button type="button" class="secondary-button" data-building-action="marketStalls">Manage three market stalls</button>' : level && building.id === 'seed_store' ? '<button type="button" class="secondary-button" data-building-action="seedPacket">Buy research seed · $35</button>' : level && ['fruit_museum','watermelon_water_park','fruit_carnival','banana_jungle_tour','fruit_aquarium','apple_maze','smoothie_cinema','fruit_stadium','mascot_theater','grand_festival_grounds'].includes(building.id) ? `<button type="button" class="secondary-button" data-building-action="tickets" data-building-id="${building.id}" ${attractionReady ? '' : 'disabled'}>${attractionReady ? 'Open attraction · earn tickets' : 'Visitors exploring…'}</button>` : '';
    return `<article class="game-card building-card ${level >= building.maxLevel ? 'completed' : level ? 'selected' : ''}"><div class="building-visual stage-${level}"><span>${building.icon}</span><i>${level ? `Lv ${level}` : 'SITE'}</i></div><div class="card-top"><div><h3>${escapeHTML(building.name)}</h3><p>${escapeHTML(building.description)}</p></div></div><div class="card-meta"><span class="tag">${escapeHTML(stage)}</span><span class="tag">${escapeHTML(building.effect)} +${building.amount}</span><span class="tag">${escapeHTML(getDistrict(building.district)?.name || building.district)}</span></div>${line && level ? `<button type="button" class="secondary-button" data-produce="${building.id}" ${job ? 'disabled' : ''}>${job ? `Producing · ${timeText((job.endsAt - now()) / 1000)}` : 'Start production batch'}</button>` : ''}${special}<button class="card-button ${level >= building.maxLevel ? 'purchased' : state.cash >= cost.cash && state.coins >= cost.coins ? 'afford' : ''}" type="button" data-building-buy="${building.id}" ${level >= building.maxLevel ? 'disabled' : ''}>${level >= building.maxLevel ? 'Landmark complete ✓' : secretKey ? `Reveal & build · ${money(cost.cash)}${cost.coins ? ` + 🪙${cost.coins}` : ''}` : `${level ? 'Expand' : 'Construct'} · ${money(cost.cash)}${cost.coins ? ` + 🪙${cost.coins}` : ''}`}</button></article>`;
  }).join('')}</div>`;
  $$('[data-building-category]', body).forEach(button => button.addEventListener('click', () => renderCompany(body, button.dataset.buildingCategory)));
  $$('[data-building-buy]', body).forEach(button => button.addEventListener('click', () => {
    if (button.disabled) return;
    button.disabled = true;
    const result = purchaseBuilding(state, button.dataset.buildingBuy);
    if (!result.ok) {
      toast('Building unavailable', result.reason, '🏗️', 'error'); playSound('fail'); renderCompany(body); return;
    }
    state.stats.building += 1;
    gainXP(12 + result.building.level * 5 + result.level * 8);
    if (result.building.id === 'research_laboratory') state.research.points += 2;
    toast(result.level === 1 ? 'Building opened!' : 'Building expanded!', `${result.building.icon} ${result.building.name} reached stage ${result.level}.`, result.building.icon, 'reward');
    playSound('purchase'); scheduleSave(); renderHUD(); renderWorld(true); renderCompany(body);
  }));
  $$('[data-produce]', body).forEach(button => button.addEventListener('click', () => {
    const result = startProduction(state, button.dataset.produce);
    if (!result.ok) { toast('Cannot start batch', result.message, '🏭', 'error'); return; }
    toast('Production started', `${result.recipe.icon} ${result.recipe.name} will finish in ${timeText(result.duration)}.`, result.building.icon);
    playSound('success'); scheduleSave(); renderCompany(body);
  }));
  $$('[data-building-action]', body).forEach(button => button.addEventListener('click', () => {
    const action = button.dataset.buildingAction;
    if (action === 'coinExchange') {
      const id = button.dataset.fruit; const count = Number(button.dataset.count);
      if ((state.inventory[id] || 0) < count) { toast('Rotating trade not ready', `Today’s booth wants ${count} ${FRUITS[id].name}.`, '🪙', 'error'); return; }
      state.inventory[id] -= count; gainCoins(1, 'exchange'); toast('Fruit Coin minted!', `${count} ${FRUITS[id].name} were exchanged in today’s rotating trade.`, '🪙', 'reward');
    } else if (action === 'marketStalls') {
      openMarketStalls(); return;
    } else if (action === 'marketCombo') {
      const stocked = Object.keys(state.inventory).filter(id => state.inventory[id] > 0).slice(0, 3);
      if (stocked.length < 3) { toast('Combo needs variety', 'Stock three different fruits.', '🧺', 'error'); return; }
      let payout = 0; for (const id of stocked) { state.inventory[id] -= 1; payout += FRUITS[id].value; } payout = Math.round(payout * 2.25); gainCash(payout, 'combo'); record('sell', 3); toast('Market combo sold!', `${money(payout)} from a colorful three-fruit deal.`, '🧺', 'reward');
    } else if (action === 'seedPacket') {
      if (!spend(state, 35, 0)) { toast('Not enough Cash', 'A research seed packet costs $35.', '🌱', 'error'); return; } state.research.points += 2; toast('Research seed opened', '+2 Research Points.', '🌱', 'reward');
    } else if (action === 'tickets') {
      const building = getBuilding(button.dataset.buildingId); state.attractionVisits ??= {}; if (state.attractionVisits[building.id] > now() - 10000) return; state.attractionVisits[building.id] = now(); const reward = Math.round((12 * buildingLevel(state, building.id) + calculateBonuses(state).ticket) * eventEffect('ticket', 1)); gainCash(reward, 'tickets'); state.reputation = clamp(state.reputation + .2, 0, 100); toast('Visitors welcomed!', `${money(reward)} in festival tickets.`, '🎟️', 'reward'); renderCompany(body);
    }
    playSound('coin'); scheduleSave(); renderHUD();
  }));
}

function openBuildings(category = runtime.companyCategory) {
  openModal({ title: 'Company Construction', eyebrow: '🏗️ 86 functional buildings', wide: true, onOpen: body => renderCompany(body, category || 'Starter') });
}

function openMarketStalls() {
  const options = [
    ...Object.entries(FRUITS).filter(([id]) => isFruitUnlocked(state, id)).map(([id, fruit]) => [`fruit:${id}`, `${fruit.icon} ${fruit.name}`]),
    ...RECIPES.filter(recipe => state.level >= recipe.level).map(recipe => [`product:${recipe.id}`, `${recipe.icon} ${recipe.name}`])
  ];
  openModal({
    title: 'Farmers Market Stalls', eyebrow: '🧺 Variety builds a crowd bonus',
    content: `<p class="section-intro">Assign fruit or products to three staffed stalls. Each unique assignment adds passive market income; a stocked trio can be sold as a high-value combo.</p><div class="market-stall-grid">${[0,1,2].map(index => { const current = state.marketStalls[index]?.includes(':') ? state.marketStalls[index] : state.marketStalls[index] ? `fruit:${state.marketStalls[index]}` : ''; return `<label><span>Stall ${index + 1} · ${['Mina','Marco','Avery'][index]}</span><select data-stall="${index}"><option value="">Closed</option>${options.map(([value,label]) => `<option value="${value}" ${value === current ? 'selected' : ''}>${escapeHTML(label)}</option>`).join('')}</select></label>`; }).join('')}</div><div class="game-controls"><button class="primary-button" type="button" data-market-combo>Sell stocked combo</button></div>`,
    onOpen: body => {
      $$('[data-stall]', body).forEach(select => select.addEventListener('change', () => { state.marketStalls[Number(select.dataset.stall)] = select.value || null; scheduleSave(); renderHUD(); }));
      $('[data-market-combo]', body).addEventListener('click', () => {
        const assignments = state.marketStalls.filter(Boolean);
        if (assignments.length < 3 || new Set(assignments).size < 3) { toast('Crowd wants variety', 'Assign three different stocked items.', '🧺', 'error'); return; }
        const available = assignments.every(key => { const [type,id] = key.includes(':') ? key.split(':') : ['fruit',key]; return ((type === 'fruit' ? state.inventory : state.products)[id] || 0) > 0; });
        if (!available) { toast('A stall is out of stock', 'Harvest or produce every assigned item.', '📦', 'error'); return; }
        let value = 0; for (const key of assignments) { const [type,id] = key.includes(':') ? key.split(':') : ['fruit',key]; const storage = type === 'fruit' ? state.inventory : state.products; const item = type === 'fruit' ? FRUITS[id] : RECIPES.find(recipe => recipe.id === id); storage[id] -= 1; value += item.value; }
        const payout = Math.round(value * 2.35 * calculateBonuses(state).sale); gainCash(payout, 'market combo'); record('sell', 3); state.reputation = clamp(state.reputation + .5, 0, 100); toast('Crowd combo sold!', `${money(payout)} and a reputation boost.`, '🎉', 'reward'); playSound('coin'); scheduleSave(); renderHUD();
      });
    }
  });
}

function purchaseOfficeUpgrade(id, body) {
  const upgrade = OFFICE_UPGRADES.find(item => item.id === id);
  if (!upgrade || state.office.upgrades.includes(id)) return;
  if (state.level < upgrade.level || (upgrade.requires && !state.office.upgrades.includes(upgrade.requires))) {
    toast('Office path locked', 'Purchase the prerequisite and reach the required empire level.', upgrade.icon, 'error'); return;
  }
  if (!spend(state, upgrade.cash, upgrade.coins)) {
    toast('Office fund is short', `You need ${money(upgrade.cash)}${upgrade.coins ? ` and ${upgrade.coins} Fruit Coins` : ''}.`, upgrade.icon, 'error'); return;
  }
  state.office.upgrades.push(id);
  state.office.level = getOfficeLevel(state).level;
  if (id === 'smartphone') {
    state.phone.unlocked = true;
    createPhoneMessage(state, { contactId: 'assistant', text: 'Welcome to the Fruitopia company network! Orders, workers, deliveries, research, and secrets are now connected.', actions: ['info'] });
    toast('Smartphone unlocked!', 'The complete company phone is now available in the dock.', '📱', 'reward');
  }
  if (id === 'company_safe' && !state.secrets.clues.includes('basement')) state.secrets.clues.push('basement');
  gainXP(10 + upgrade.level * 5); playSound('purchase'); scheduleSave(); renderHUD(); renderOfficeUpgrades(body, runtime.officeCategory);
}

function renderOfficeUpgrades(body, category = runtime.officeCategory) {
  runtime.officeCategory = category;
  body.innerHTML = officeUpgradeMarkup(state, category);
  $$('[data-office-category]', body).forEach(button => button.addEventListener('click', () => renderOfficeUpgrades(body, button.dataset.officeCategory)));
  $$('[data-office-upgrade]', body).forEach(button => button.addEventListener('click', () => purchaseOfficeUpgrade(button.dataset.officeUpgrade, body)));
}

function openOfficeUpgrades() {
  openModal({ title: 'Office Upgrade Tree', eyebrow: `🏢 ${state.office.upgrades.length}/44 installed`, wide: true, onOpen: body => renderOfficeUpgrades(body) });
}

function queueWorkerVisit(workerId = null) {
  const available = WORKER_CHARACTERS.filter(worker => state.workerRoster[worker.id].hired && worker.id !== state.office.activeVisitor?.workerId && !state.office.queue.includes(worker.id));
  const worker = workerId ? available.find(item => item.id === workerId) : available[Math.floor(Math.random() * available.length)];
  if (!worker) return null;
  if (state.office.queue.length >= 4) return null;
  state.office.queue.push(worker.id);
  createPhoneMessage(state, { contactId: worker.id, text: 'Could we talk in your office? I will wait by the door.', actions: ['coming', 'handle', 'remind'], kind: 'worker', relatedId: worker.id });
  return worker;
}

function beginWorkerConversation(workerId, officeBody = null) {
  const returnToOffice = Boolean(officeBody);
  const existing = state.office.activeVisitor;
  if (existing && existing.workerId !== workerId) { toast('Meeting in progress', 'Finish the current conversation first.', '💬', 'error'); return; }
  const visit = existing || createWorkerVisit(state, workerId);
  if (!visit) return;
  state.office.queue = state.office.queue.filter(id => id !== workerId);
  state.office.activeVisitor = visit;
  openModal({
    title: 'Office Conversation', eyebrow: '💬 Your choice changes the company', wide: true,
    content: conversationMarkup(state, visit),
    onOpen: body => $$('[data-worker-choice]', body).forEach(button => button.addEventListener('click', () => {
      const result = applyWorkerChoice(state, visit, button.dataset.workerChoice);
      if (button.dataset.workerChoice === 'later') state.office.queue.push(workerId);
      state.office.activeVisitor = null;
      state.stats.conversation += 1;
      if (result.cashDelta > 0) { state.stats.earnCash += result.cashDelta; updateObjectiveProgress('earnCash', result.cashDelta); }
      gainXP(8 + Math.max(0, result.skill) * 4);
      toast('Decision made', result.message, WORKER_CHARACTERS.find(item => item.id === workerId)?.avatar || '💬', result.cashDelta > 0 ? 'reward' : '');
      playSound(result.happiness < 0 ? 'fail' : 'success'); scheduleSave(); closeModal();
      if (returnToOffice) openOffice();
    }))
  });
}

function officeObjectAction(id, body) {
  const actions = {
    desk: openOfficeUpgrades, chair: openWorkers, filing: () => openPhone('secrets'), map: openMap,
    meeting: () => { const worker = queueWorkerVisit(); if (worker) { toast('Meeting requested', `${worker.name} is entering the office.`, worker.avatar); renderOfficeScreen(body); } },
    employee: openWorkers, trophies: openAchievements, charger: () => openPhone(), computer: () => openPhone('research'),
    accountant: () => openPhone('banking'), assistant: openWorkers, research: () => openPhone('research'),
    conference: () => { const worker = queueWorkerVisit(); if (worker) beginWorkerConversation(worker.id); },
    executive: openSeason, elevator: () => { runtime.officeCategory = 'Office'; openOfficeUpgrades(); },
    break: () => { for (const roster of Object.values(state.workerRoster)) if (roster.hired) { roster.energy = clamp(roster.energy + 18, 0, 100); roster.happiness = clamp(roster.happiness + 1, 0, 100); } toast('Coffee break', 'Worker energy restored.', '☕'); renderOfficeScreen(body); },
    safe: () => { const elapsed = Math.min(3600, Math.max(0, (now() - (state.office.safeCollectedAt || state.lastSavedAt)) / 1000)); const amount = Math.floor(calculateBonuses(state).passive * elapsed * .08); state.office.safeCollectedAt = now(); gainCash(amount, 'safe'); toast('Company safe opened', amount ? `${money(amount)} in recorded office income.` : 'The safe is empty. Build passive-income businesses and return later.', '🔐'); scheduleSave(); renderHUD(); }
  };
  actions[id]?.();
}

function renderOfficeScreen(body) {
  body.innerHTML = officeMarkup(state);
  const scene = $('[data-office-scene]', body);
  scene.tabIndex = 0;
  const movePlayer = (dx, dy) => {
    state.office.player.x = clamp(state.office.player.x + dx, 5, 95);
    state.office.player.y = clamp(state.office.player.y + dy, 14, 88);
    const player = $('[data-office-player]', scene);
    player.style.left = `${state.office.player.x}%`; player.style.top = `${state.office.player.y}%`;
  };
  scene.addEventListener('keydown', event => {
    const key = event.key.toLowerCase();
    const moves = { arrowleft: [-4, 0], a: [-4, 0], arrowright: [4, 0], d: [4, 0], arrowup: [0, -4], w: [0, -4], arrowdown: [0, 4], s: [0, 4] };
    if (moves[key]) { event.preventDefault(); movePlayer(...moves[key]); }
  });
  scene.addEventListener('click', event => {
    if (event.target.closest('button')) return;
    const rect = scene.getBoundingClientRect();
    state.office.player.x = clamp((event.clientX - rect.left) / rect.width * 100, 5, 95);
    state.office.player.y = clamp((event.clientY - rect.top) / rect.height * 100, 14, 88);
    renderOfficeScreen(body);
  });
  $$('[data-office-object]', body).forEach(button => button.addEventListener('click', () => {
    if (button.classList.contains('locked')) { toast('Office object locked', button.getAttribute('aria-label').split('. ').at(-1), '🔒', 'error'); return; }
    officeObjectAction(button.dataset.officeObject, body);
  }));
  $$('[data-office-worker]', body).forEach(button => button.addEventListener('click', () => beginWorkerConversation(button.dataset.officeWorker, body)));
  $('[data-office-upgrades]', body).addEventListener('click', openOfficeUpgrades);
  $('[data-invite-worker]', body).addEventListener('click', () => { const worker = queueWorkerVisit(); toast(worker ? 'Worker invited' : 'Nobody else is available', worker ? `${worker.name} joined the office queue.` : 'Hire more workers or finish queued meetings.', worker?.avatar || '💬'); renderOfficeScreen(body); });
  $('[data-office-exit]', body).addEventListener('click', closeModal);
}

function openOffice() {
  runtime.officeOpen = true;
  openModal({ title: getOfficeLevel(state).name, eyebrow: '🏢 Walkable company office', wide: true, onOpen: renderOfficeScreen, onClose: () => { runtime.officeOpen = false; scheduleSave(); } });
}

function renderWorkers(body) {
  body.innerHTML = `<p class="section-intro">Named workers appear in their assigned district, remember office conversations, and improve through training, promotion, equipment, rest, and good decisions.</p><div class="worker-roster">${WORKER_CHARACTERS.map(worker => {
    const roster = state.workerRoster[worker.id];
    const unlockLevel = Math.max(1, 1 + Math.floor(WORKER_CHARACTERS.indexOf(worker) / 2));
    const hireCost = 25 + WORKER_CHARACTERS.indexOf(worker) * 42;
    const ranks = ['Common', 'Skilled', 'Expert', 'Legendary']; const rankIndex = ranks.indexOf(roster.rank || 'Common'); const rankSkill = [3, 6, 9][rankIndex] || 99;
    return `<article class="worker-card ${roster.hired ? '' : 'locked'}"><div class="worker-portrait">${roster.hired ? worker.avatar : '❔'}</div><div><h3>${escapeHTML(worker.name)} <span class="tag">${escapeHTML(roster.rank || 'Common')}</span></h3><p><strong>${escapeHTML(worker.role)}</strong> · ${escapeHTML(worker.personality)}</p><p>❤️ ${escapeHTML(FRUITS[worker.favorite]?.name || worker.favorite)} · Strength: ${escapeHTML(worker.strength)} · Weakness: ${escapeHTML(worker.weakness)}</p><div class="worker-vitals"><span>Skill ${roster.skill}</span><span>😊 ${Math.round(roster.happiness)}</span><span>⚡ ${Math.round(roster.energy)}</span><span>💛 ${Math.round(roster.loyalty)}</span><span>🧰 ${roster.equipment}</span></div></div><div class="worker-actions">${roster.hired ? `<button type="button" data-worker-talk="${worker.id}">Talk</button><button type="button" data-worker-train="${worker.id}" ${roster.skill >= 10 ? 'disabled' : ''}>Train · ${money(20 * roster.skill)}</button><button type="button" data-worker-equip="${worker.id}" ${roster.equipment >= 5 ? 'disabled' : ''}>Equipment · ${money(18 * (roster.equipment + 1))}</button><button type="button" data-worker-promote="${worker.id}" ${rankIndex >= 3 || roster.skill < rankSkill ? 'disabled' : ''}>${rankIndex >= 3 ? 'Legendary ✓' : roster.skill < rankSkill ? `Promote at skill ${rankSkill}` : `Promote · 🪙${rankIndex + 1}`}</button><button type="button" data-worker-assign="${worker.id}">Assign: ${escapeHTML(getDistrict(roster.assignment)?.name || 'Office')}</button>` : `<button class="primary-button" type="button" data-worker-hire="${worker.id}" ${state.level < unlockLevel ? 'disabled' : ''}>${state.level < unlockLevel ? `Interview at Lv ${unlockLevel}` : `Hire · ${money(hireCost)}`}</button>`}</div></article>`;
  }).join('')}</div>`;
  $$('[data-worker-hire]', body).forEach(button => button.addEventListener('click', () => {
    const index = WORKER_CHARACTERS.findIndex(item => item.id === button.dataset.workerHire);
    const worker = WORKER_CHARACTERS[index]; const cost = 25 + index * 42;
    if (!spend(state, cost, 0)) { toast('Hiring budget is short', `You need ${money(cost)}.`, worker.avatar, 'error'); return; }
    state.workerRoster[worker.id].hired = true; state.workerRoster[worker.id].assignment = worker.id === 'driver' ? 'depot' : worker.id === 'juice_maker' ? 'juice' : 'stand';
    state.workers[worker.id] = Math.max(1, state.workers[worker.id] || 0); gainXP(20); toast('Worker hired!', `${worker.name} joined as ${worker.role}.`, worker.avatar, 'reward'); scheduleSave(); renderWorkers(body); renderWorld(true);
  }));
  $$('[data-worker-train]', body).forEach(button => button.addEventListener('click', () => {
    const roster = state.workerRoster[button.dataset.workerTrain]; const cost = 20 * roster.skill;
    if (!spend(state, cost, 0)) { toast('Training fund is short', `You need ${money(cost)}.`, '🎓', 'error'); return; }
    roster.skill += 1; roster.experience += 20; roster.energy = clamp(roster.energy - 12, 0, 100); roster.happiness = clamp(roster.happiness + 2, 0, 100); playSound('purchase'); scheduleSave(); renderWorkers(body);
  }));
  $$('[data-worker-equip]', body).forEach(button => button.addEventListener('click', () => {
    const roster = state.workerRoster[button.dataset.workerEquip]; const cost = 18 * (roster.equipment + 1);
    if (!spend(state, cost, 0)) { toast('Equipment fund is short', `You need ${money(cost)}.`, '🧰', 'error'); return; }
    roster.equipment += 1; roster.happiness = clamp(roster.happiness + 4, 0, 100); playSound('purchase'); scheduleSave(); renderWorkers(body);
  }));
  $$('[data-worker-talk]', body).forEach(button => button.addEventListener('click', () => beginWorkerConversation(button.dataset.workerTalk)));
  $$('[data-worker-promote]', body).forEach(button => button.addEventListener('click', () => {
    const roster = state.workerRoster[button.dataset.workerPromote]; const ranks = ['Common', 'Skilled', 'Expert', 'Legendary']; const index = ranks.indexOf(roster.rank || 'Common'); const coinCost = index + 1; const cashCost = 80 * Math.pow(4, index);
    if (index >= 3 || !spend(state, cashCost, coinCost)) { toast('Promotion requirements', `This promotion needs ${money(cashCost)} and ${coinCost} Fruit Coins.`, '🏅', 'error'); return; }
    roster.rank = ranks[index + 1]; roster.happiness = clamp(roster.happiness + 8, 0, 100); roster.loyalty = clamp(roster.loyalty + 8, 0, 100); gainXP(30 * (index + 1)); toast('Worker promoted!', `${roster.rank} workers are faster and remember this milestone.`, '🏅', 'reward'); playSound('level'); scheduleSave(); renderWorkers(body);
  }));
  $$('[data-worker-assign]', body).forEach(button => button.addEventListener('click', () => {
    const roster = state.workerRoster[button.dataset.workerAssign]; const current = DISTRICTS.findIndex(item => item.id === roster.assignment); roster.assignment = DISTRICTS[(current + 1 + DISTRICTS.length) % DISTRICTS.length].id; scheduleSave(); renderWorkers(body); renderWorld(true);
  }));
}

function openWorkers() { openModal({ title: 'Fruitopia Team', eyebrow: `🧑‍🌾 ${WORKER_CHARACTERS.filter(worker => state.workerRoster[worker.id].hired).length} named workers hired`, wide: true, onOpen: renderWorkers }); }
function openWorkerDetail(workerId) { openWorkers(); requestAnimationFrame(() => $(`[data-worker-talk="${workerId}"]`, dom.modalHost)?.focus()); }

function resolvePhoneMessage(message, action) {
  if (!message || message.resolved) return;
  if (message.kind === 'order') {
    const result = respondToOrder(state, message.relatedId, action);
    toast(result.accepted ? 'Deal agreed!' : result.rejected ? 'Offer withdrawn' : 'Customer replied', result.message, result.accepted ? '🤝' : '💬', result.rejected ? 'error' : '');
    if (!result.retry) message.resolved = true;
  } else if (action === 'collectPayment') {
    const order = state.orders.find(item => item.id === message.relatedId);
    if (!order || order.status !== 'payment') return;
    order.status = 'complete'; message.resolved = true; gainCash(order.finalPayment, 'order'); gainXP(12 + order.quantity); state.reputation = clamp(state.reputation + 2, 0, 100); state.stats.order += 1;
    toast('Payment received!', `${money(order.finalPayment)} fictional Fruitopia Cash added.`, '💸', 'reward'); playSound('coin');
  } else {
    if (action === 'fix500' && state.cash < 50) { toast('Repair fund is short', 'Keep at least $50 available for an emergency repair.', '🔧', 'error'); return; }
    message.resolved = action !== 'remind';
    if (action === 'coming' && message.relatedId) queueWorkerVisit(message.relatedId);
    if (action === 'handle') {
      const roster = state.workerRoster[message.relatedId];
      if (roster) { roster.happiness = clamp(roster.happiness - 1, 0, 100); roster.experience += 4; }
      if (message.kind === 'event' && message.relatedId === 'machineBreakdown') {
        const mechanic = state.workerRoster.mechanic;
        if (mechanic?.hired) { mechanic.energy = clamp(mechanic.energy - 12, 0, 100); mechanic.experience += 12; state.event = null; toast('Mechanic handled it', 'Production is back online without an outside repair bill.', '🔧', 'reward'); }
        else if (state.event) { state.event.endsAt = Math.min(state.event.endsAt, now() + 15000); toast('Crew workaround', 'The outage will end sooner, but a mechanic would fix it immediately.', '🧰'); }
      }
    }
    if (action === 'fix500') { const paid = Math.min(500, state.cash); state.cash -= paid; if (state.event?.type === 'machineBreakdown') state.event = null; toast('Repair authorized', `${money(paid)} was used on repairs. Production is online.`, '🔧'); }
    if (action === 'pause') toast('Production paused', 'The team will protect equipment until you respond.', '⏸️');
    if (action === 'info') toast('Company network', 'Messages create orders, meetings, event choices, and payment opportunities.', '📱');
  }
  scheduleSave(); renderHUD();
}

function bindPhone(body) {
  $$('[data-phone-app]', body).forEach(button => button.addEventListener('click', () => { state.phone.activeApp = button.dataset.phoneApp; renderPhone(body); }));
  $$('[data-message-action]', body).forEach(button => button.addEventListener('click', () => { resolvePhoneMessage(state.phone.messages.find(item => item.id === button.dataset.messageId), button.dataset.messageAction); renderPhone(body); }));
  $$('[data-order-action]', body).forEach(button => button.addEventListener('click', () => { const result = respondToOrder(state, button.dataset.orderId, button.dataset.orderAction); toast(result.accepted ? 'Deal agreed!' : 'Customer replied', result.message, result.accepted ? '🤝' : '💬'); scheduleSave(); renderPhone(body); }));
  $$('[data-supply-order]', body).forEach(button => button.addEventListener('click', () => { const result = supplyOrder(state, button.dataset.supplyOrder); toast(result.ok ? 'Order supplied!' : 'Order not ready', result.message || 'A payment message just arrived.', result.ok ? '📦' : '⚠️', result.ok ? 'reward' : 'error'); playSound(result.ok ? 'success' : 'fail'); scheduleSave(); renderPhone(body); }));
  $('[data-generate-order]', body)?.addEventListener('click', () => { if (state.orders.filter(order => ['offered', 'accepted'].includes(order.status)).length >= 5) { toast('Order list full', 'Resolve an existing offer first.', '📦', 'error'); return; } generateOrder(state); playSound('tap'); scheduleSave(); renderPhone(body); });
  $('[data-phone-refresh]', body)?.addEventListener('click', () => { createWorkerPhoneMessage(); renderPhone(body); });
  $$('[data-contact]', body).forEach(button => button.addEventListener('click', () => { const contact = WORKER_CHARACTERS.find(item => item.id === button.dataset.contact); createPhoneMessage(state, { contactId: button.dataset.contact, text: contact ? contact.topics[Math.floor(Math.random() * contact.topics.length)] : 'Thanks for checking in. New company opportunities will appear here.', actions: contact ? ['coming', 'handle', 'remind'] : ['info'], kind: contact ? 'worker' : 'message', relatedId: contact?.id }); renderPhone(body); }));
  $('[data-open-workers]', body)?.addEventListener('click', openWorkers);
  $$('[data-phone-worker]', body).forEach(button => button.addEventListener('click', () => openWorkerDetail(button.dataset.phoneWorker)));
  $('[data-open-deliveries]', body)?.addEventListener('click', openDeliveries);
  $$('[data-market-buy]', body).forEach(button => button.addEventListener('click', () => { const price = Number(button.dataset.price); if (state.cash < price || totalFruitInventory(state) >= calculateBonuses(state).capacity) { toast('Trade unavailable', 'Check Cash and basket capacity.', '📈', 'error'); return; } spend(state, price, 0); addInventory(state, button.dataset.marketBuy, 1); playSound('purchase'); scheduleSave(); renderPhone(body); }));
  $$('[data-market-sell]', body).forEach(button => button.addEventListener('click', () => { const id = button.dataset.marketSell; if ((state.inventory[id] || 0) < 1) return; state.inventory[id] -= 1; gainCash(Number(button.dataset.price), 'market'); renderPhone(body); }));
  $$('[data-invest]', body).forEach(button => button.addEventListener('click', () => { if (!spend(state, 100, 0)) { toast('Not enough Cash', 'Investments use fictional company Cash.', '🏦', 'error'); return; } state.investments[button.dataset.invest] += 100; scheduleSave(); renderPhone(body); }));
  $('[data-collect-dividend]', body)?.addEventListener('click', () => { const elapsed = Math.min(21600, (now() - state.investments.lastDividendAt) / 1000); const invested = Object.entries(state.investments).filter(([id]) => id !== 'lastDividendAt').reduce((sum, [, amount]) => sum + amount, 0); const reward = Math.floor(invested * elapsed / 3600 * .018 * calculateBonuses(state).investment * eventEffect('investment', 1)); if (!reward) { toast('No dividend yet', 'Company funds accrue small fictional returns over time.', '🏦'); return; } state.investments.lastDividendAt = now(); gainCash(reward, 'investment'); toast('Dividends collected', `${money(reward)} added to company Cash.`, '🏦', 'reward'); renderPhone(body); });
  $('[data-start-research]', body)?.addEventListener('click', () => { const result = startResearch(state, $('[data-research-a]', body).value, $('[data-research-b]', body).value); toast(result.ok ? 'Experiment started' : 'Experiment blocked', result.message, '🔬', result.ok ? '' : 'error'); playSound(result.ok ? 'success' : 'fail'); scheduleSave(); renderPhone(body); });
  $$('[data-phone-teleport]', body).forEach(button => button.addEventListener('click', () => teleportTo(button.dataset.phoneTeleport)));
  $$('[data-phone-setting]', body).forEach(button => button.addEventListener('click', () => { const id = button.dataset.phoneSetting; state.settings[id] = !state.settings[id]; if (id === 'music') toggleMusic(state.settings.music); scheduleSave(); renderPhone(body); }));
  $('[data-open-settings]', body)?.addEventListener('click', openSettings);
  $('[data-open-milestones]', body)?.addEventListener('click', openMilestones);
  $('[data-open-office]', body)?.addEventListener('click', openOffice);
  $('[data-search-secret]', body)?.addEventListener('click', () => {
    const unknown = SECRETS.filter(secret => !state.secrets.clues.includes(secret.id) && !state.secrets.discovered.includes(secret.id));
    if (!unknown.length) { toast('No unread clues', 'Every known mystery has a lead.', '🔎'); return; }
    if (state.research.points < 1) { toast('More research needed', 'A clue search costs 1 Research Point. Harvest manually or run experiments.', '🔬', 'error'); return; }
    state.research.points -= 1; const secret = unknown[Math.floor(Math.random() * unknown.length)]; state.secrets.clues.push(secret.id); toast('A clue surfaced!', secret.clue, '🔎', 'reward'); scheduleSave(); renderPhone(body);
  });
  $$('[data-investigate-secret]', body).forEach(button => button.addEventListener('click', () => {
    const index = SECRETS.findIndex(item => item.id === button.dataset.investigateSecret); const cost = 40 + index * 25;
    if (!spend(state, cost, 0)) { toast('Investigation fund is short', `You need ${money(cost)}.`, '🔐', 'error'); return; }
    const secret = discoverSecret(state, button.dataset.investigateSecret); if (!secret) return;
    state.stats.secret += 1; gainCoins(2 + Math.floor(index / 3), 'secret'); gainXP(30 + index * 5); toast('Secret discovered!', `${secret.name} is now in the archive.`, '🔓', 'reward'); playSound('complete'); scheduleSave(); renderPhone(body); renderWorld(true);
  }));
}

function renderPhone(body) {
  body.innerHTML = phoneMarkup(state);
  if (state.phone.unlocked && state.phone.activeApp === 'messages') { state.phone.messages.forEach(message => { message.unread = false; }); state.phone.unread = 0; }
  bindPhone(body); renderHUD();
}

function openPhone(appId = null) {
  if (appId) state.phone.activeApp = appId;
  openModal({ title: 'Fruitopia Smartphone', eyebrow: state.phone.unlocked ? '📱 Company network' : '🔒 Office upgrade required', wide: true, onOpen: renderPhone });
}

function createWorkerPhoneMessage() {
  if (!state.phone.unlocked) return null;
  const workers = WORKER_CHARACTERS.filter(worker => state.workerRoster[worker.id].hired);
  const worker = workers[Math.floor(Math.random() * workers.length)];
  if (!worker) return null;
  const ready = state.trees.some(tree => tree.readyAt <= now() && isFruitUnlocked(state, tree.fruit));
  const inventoryFull = totalFruitInventory(state) >= calculateBonuses(state).capacity;
  const scripts = [
    ready ? 'A tree is ripe and ready to harvest.' : 'The orchard rows are growing steadily.',
    inventoryFull ? 'Our fruit basket is full. The stand needs to sell or process stock.' : 'Inventory levels look healthy.',
    state.deliveries.some(item => !item.rewarded && item.endsAt <= now()) ? 'A delivery just returned to the garage.' : 'I checked the delivery schedule for you.',
    'I found a Fruit Coin under the equipment rack!', 'A customer asked whether we can make a premium order.',
    'Could we talk in your office about an idea?', 'Weather is shifting; the next event may affect production.'
  ];
  const text = scripts[Math.floor(Math.random() * scripts.length)];
  const message = createPhoneMessage(state, { contactId: worker.id, text, actions: text.includes('office') ? ['coming', 'handle', 'remind'] : ['info', 'handle'], kind: 'worker', relatedId: worker.id });
  if (text.includes('Fruit Coin')) gainCoins(1, 'worker');
  playSound('tap'); scheduleSave(); return message;
}

function renderArcade(body) {
  const extraCosts = { watermelon: 8, auction: 12, monkey: 10 };
  body.innerHTML = `<p class="section-intro">Every attraction is an active game with instructions, timer, score, difficulty, sound, rewards, persistent high score, and replay. District games unlock through district completion; special games unlock through their entertainment or business building.</p><div class="card-grid arcade-grid">${MINIGAME_CATALOG.map(game => {
    const district = getDistrict(game.id);
    const source = game.source === 'district' ? district : getBuilding(game.source);
    const sourceReady = game.source === 'district' ? Boolean(state.minigames[game.id]) : buildingLevel(state, game.source) > 0;
    const owned = Boolean(state.minigames[game.id]);
    const cost = extraCosts[game.id] || 0;
    return `<article class="game-card ${owned ? 'selected' : sourceReady ? '' : 'locked'}"><div class="card-top"><span class="card-icon">${game.icon}</span><div><h3>${escapeHTML(game.name)}</h3><p>${escapeHTML(GAME_INFO[game.id].instructions)}</p></div></div><div class="card-meta"><span class="tag">High ${formatNumber(state.highScores[game.id] || 0)}</span><span class="tag">${source ? escapeHTML(source.name) : 'Festival'}</span>${cost && !owned ? `<span class="tag coin">🪙 ${cost}</span>` : ''}</div>${owned ? `<button class="card-button" type="button" data-arcade-play="${game.id}">Play now</button>` : sourceReady && cost ? `<button class="card-button" type="button" data-arcade-buy="${game.id}">Purchase attraction</button>` : `<button class="card-button" type="button" disabled>${game.source === 'district' ? 'Purchase in its district' : `Build ${source?.name || game.source}`}</button>`}</article>`;
  }).join('')}</div>`;
  $$('[data-arcade-play]', body).forEach(button => button.addEventListener('click', () => openMinigame(button.dataset.arcadePlay)));
  $$('[data-arcade-buy]', body).forEach(button => button.addEventListener('click', () => { const id = button.dataset.arcadeBuy; const cost = extraCosts[id]; if (!spend(state, 0, cost)) { toast('More Fruit Coins needed', `This attraction costs ${cost} Fruit Coins.`, '🪙', 'error'); return; } state.minigames[id] = true; gainXP(55); playSound('purchase'); scheduleSave(); renderArcade(body); }));
}

function openArcade() { openModal({ title: 'Fruitopia Arcade', eyebrow: '🎮 11 active attractions', wide: true, onOpen: renderArcade }); }

function openMore() {
  openModal({ title: 'Company Journal', eyebrow: '☰ Collections, records & settings', wide: true, content: `<div class="card-grid menu-grid">${[['workers','🧑‍🌾','Workers'],['achievements','🏆','Achievements'],['milestones','📋','Milestones'],['map','🗺️','Teleport Map'],['research','🔬','Research'],['settings','⚙️','Settings'],['help','❔','Help & controls']].map(([id, icon, label]) => `<button class="menu-tile" type="button" data-more="${id}"><span>${icon}</span><b>${label}</b></button>`).join('')}</div>` });
  $$('[data-more]', dom.modalHost).forEach(button => button.addEventListener('click', () => ({ workers: openWorkers, achievements: openAchievements, milestones: openMilestones, map: openMap, research: () => openPhone('research'), settings: openSettings, help: openHelp })[button.dataset.more]?.()));
}

function purchaseUpgrade(districtId, upgradeId, body) {
  const area = getDistrict(districtId);
  const upgrade = area?.upgrades.find(item => item.id === upgradeId);
  if (!upgrade || state.upgrades[districtId].includes(upgradeId)) return;
  if (!spend(state, upgrade.cash, upgrade.coins)) {
    toast('Not enough resources', `You need ${money(upgrade.cash)}${upgrade.coins ? ` and ${upgrade.coins} Fruit Coins` : ''}.`, '🧺', 'error');
    playSound('fail');
    return;
  }
  state.upgrades[districtId].push(upgradeId);
  record('upgrade', 1);
  gainXP(18 + DISTRICTS.findIndex(item => item.id === districtId) * 8);
  const progress = districtProgress(state, districtId);
  if (progress >= 75 && !state.teleporters.includes(districtId)) {
    state.teleporters.push(districtId);
    toast('Teleporter online!', `${area.name} can now be reached instantly. Its minigame has been revealed.`, '⚡', 'reward');
  }
  if (progress === 100 && !state.districtRewards.includes(districtId)) {
    state.districtRewards.push(districtId);
    const index = DISTRICTS.findIndex(item => item.id === districtId);
    const reward = { cash: 850 * Math.pow(index + 1, 2), coins: 5 + index * 3, xp: 180 + index * 90 };
    gainCash(reward.cash, 'district');
    gainCoins(reward.coins, 'district');
    gainXP(reward.xp);
    record('districtComplete', 1);
    toast('District completed!', `${money(reward.cash)} · ${reward.coins} Fruit Coins · ${reward.xp} XP`, '🎉', 'reward');
    playSound('complete');
  } else {
    toast('Improvement built!', `${upgrade.icon} ${upgrade.name} is now part of ${area.name}.`, '🔨');
    playSound('purchase');
  }
  checkDistrictUnlocks();
  scheduleSave();
  renderHUD();
  renderWorld(true);
  renderDistrictContent(body, districtId);
}

function hireWorker(workerId, rerender) {
  const worker = WORKERS.find(item => item.id === workerId);
  if (!worker) return;
  const level = state.workers[workerId] || 0;
  if (level >= 10) return;
  const cost = workerCost(worker);
  if (!spend(state, cost.cash, cost.coins)) {
    toast('Training fund is short', `You need ${money(cost.cash)}${cost.coins ? ` and ${cost.coins} Fruit Coins` : ''}.`, worker.icon, 'error');
    return;
  }
  state.workers[workerId] = level + 1;
  gainXP(15 + level * 5);
  toast(level ? 'Worker trained!' : 'Worker hired!', `${worker.name} reached level ${level + 1}.`, worker.icon);
  playSound('purchase');
  scheduleSave();
  renderHUD();
  rerender?.();
}

function purchaseMinigame(districtId, body) {
  const area = getDistrict(districtId);
  if (districtProgress(state, districtId) < 75 || state.minigames[districtId]) return;
  if (!spend(state, 0, area.minigameCost)) {
    toast('More Fruit Coins needed', `Find crates, harvest manually, complete quests, or earn minigame rewards.`, '🪙', 'error');
    return;
  }
  state.minigames[districtId] = true;
  gainXP(65);
  toast('Minigame purchased!', `${area.minigame} is now open forever.`, GAME_INFO[districtId].icon, 'reward');
  playSound('purchase');
  scheduleSave();
  renderHUD();
  renderDistrictContent(body, districtId);
}

function openMinigame(gameId) {
  const area = getDistrict(gameId);
  const game = MINIGAME_CATALOG.find(item => item.id === gameId);
  if (!game || !state.minigames[gameId]) return;
  let cleanup;
  openModal({
    title: game.name,
    eyebrow: `${game.icon} ${area ? `${area.name} minigame` : 'Fruitopia attraction'}`,
    minigame: true,
    onOpen: body => {
      cleanup = startMinigame({
        id: gameId,
        container: body,
        onSound: playSound,
        reputation: state.reputation,
        customCounter: hasOfficeUpgrade(state, 'custom_counteroffer'),
        onReplay: () => openMinigame(gameId),
        onFinish: ({ score, rewards }) => {
          const multiplier = state.event?.type === 'monkeyInvasion' && gameId === 'monkey' && state.event.endsAt > now() ? 2 : eventEffect('minigame', 1);
          rewards.cash = Math.round(rewards.cash * multiplier * calculateBonuses(state).eventReward);
          rewards.coins = Math.round(rewards.coins * multiplier);
          gainCash(rewards.cash, 'minigame'); gainCoins(rewards.coins, 'minigame');
          gainXP(rewards.xp);
          state.highScores[gameId] = Math.max(state.highScores[gameId] || 0, score);
          state.stats.highScore = Math.max(state.stats.highScore || 0, score);
          record('minigame', 1);
          const unlocked = achievementUpdates(state);
          unlocked.forEach(item => toast('Achievement unlocked!', `${item.name} · +${item.reward} Fruit Coins`, item.icon, 'reward'));
          scheduleSave();
          renderHUD();
          toast('Minigame rewards collected', `${money(rewards.cash)} · ${rewards.xp} XP · ${rewards.coins} Fruit Coins`, '🎁', 'reward');
        }
      });
      runtime.activeMinigame = cleanup;
    },
    onClose: () => { cleanup?.(); runtime.activeMinigame = null; }
  });
}

function openFruitBook() {
  const capacity = calculateBonuses(state).capacity;
  openModal({
    title: 'Fruit Collection Book', eyebrow: `🧺 ${totalFruitInventory(state)} / ${Math.floor(capacity)} fruit · 📦 ${totalProductInventory(state)} / ${Math.floor(calculateBonuses(state).warehouse)} products`, wide: true,
    content: `<p class="section-intro">Every fruit has a source and a profitable purpose. New fruit unlocks with your empire level; rare-seed improvements improve access but never block progression.</p><div class="book-grid">${Object.entries(FRUITS).map(([id, fruit]) => {
      const unlocked = isFruitUnlocked(state, id);
      return `<article class="fruit-entry ${unlocked ? '' : 'locked'}"><span class="fruit-icon">${unlocked ? fruit.icon : '🔒'}</span><h3>${escapeHTML(fruit.name)}</h3><p><strong>${unlocked ? `${state.inventory[id] || 0} stored · ${money(fruit.value)} each` : fruit.hybrid ? 'Discover in the Research Laboratory' : `Unlocks at level ${fruit.level}`}</strong></p><p>${escapeHTML(fruit.rarity)} · Quality ${(state.fruitQuality[id] || 1).toFixed(1)}/5 · Demand ${fruit.demand}/5</p><p>Growth: ${timeText(fruit.growth)} · ${escapeHTML(fruit.supply)}</p><p>Used for: ${escapeHTML(fruit.use)}</p></article>`;
    }).join('')}</div><div class="section-title"><h3>Crafted inventory</h3><small>Products sell automatically for premium prices</small></div><div class="card-grid">${RECIPES.filter(recipe => state.level >= recipe.level).map(recipe => `<article class="game-card"><div class="card-top"><span class="card-icon">${recipe.icon}</span><div><h4>${escapeHTML(recipe.name)}</h4><p>${state.products[recipe.id] || 0} ready · ${money(recipe.value)} sale value</p></div></div></article>`).join('')}</div>`
  });
}

function canCraft(recipe) {
  return state.level >= recipe.level && totalProductInventory(state) < calculateBonuses(state).warehouse && Object.entries(recipe.ingredients).every(([id, count]) => (state.inventory[id] || 0) >= count);
}

function craftRecipe(recipeId, rerender) {
  const recipe = RECIPES.find(item => item.id === recipeId);
  if (!recipe || state.level < recipe.level || !canCraft(recipe)) {
    toast('Ingredients missing', recipe ? `You need ${formatIngredients(recipe.ingredients)}.` : 'That recipe is unavailable.', '🧺', 'error');
    return false;
  }
  if (!removeIngredients(state, recipe.ingredients)) return false;
  addProduct(state, recipe.id, 1);
  record('craft', 1);
  gainXP(Math.max(4, Math.floor(recipe.value / 35)));
  toast('Recipe crafted!', `${recipe.icon} ${recipe.name} will sell automatically for ${money(recipe.value)}.`, recipe.icon);
  playSound('success');
  scheduleSave();
  renderHUD();
  rerender?.();
  return true;
}

function renderRecipes(body) {
  body.innerHTML = `<p class="section-intro">Crafted products use more fruit but earn substantially more than raw produce. The stand sells them automatically; Market Day increases their price by 75%.</p><div class="card-grid">${RECIPES.map(recipe => {
    const unlocked = state.level >= recipe.level && Object.keys(recipe.ingredients).every(id => !FRUITS[id]?.hybrid || isFruitUnlocked(state, id));
    const craftable = canCraft(recipe);
    const district = getDistrict(recipe.district);
    return `<article class="game-card ${!unlocked ? 'locked' : craftable ? 'selected' : ''}"><div class="card-top"><span class="card-icon">${unlocked ? recipe.icon : '🔒'}</span><div><h3>${escapeHTML(recipe.name)}</h3><p>${escapeHTML(recipe.category)} · ${escapeHTML(district.name)}</p></div></div><div class="card-meta"><span class="tag">${formatIngredients(recipe.ingredients)}</span><span class="tag cash">Sells ${money(recipe.value)}</span><span class="tag">Stored: ${state.products[recipe.id] || 0}</span></div><button class="card-button ${craftable ? 'afford' : ''}" type="button" data-craft="${recipe.id}" ${!unlocked ? 'disabled' : ''}>${unlocked ? 'Craft product' : `Unlocks at level ${recipe.level}`}</button></article>`;
  }).join('')}</div>`;
  $$('[data-craft]', body).forEach(button => button.addEventListener('click', () => craftRecipe(button.dataset.craft, () => renderRecipes(body))));
}

function openRecipes() {
  openModal({ title: 'Recipe Book', eyebrow: '🧃 Juices, bundles, bowls & gifts', wide: true, onOpen: renderRecipes });
}

function vehicleMeets(route, vehicleId) {
  const requiredIndex = VEHICLES.findIndex(vehicle => vehicle.id === route.vehicle);
  const selectedIndex = VEHICLES.findIndex(vehicle => vehicle.id === vehicleId);
  return selectedIndex >= requiredIndex;
}

function availableVehicleFor(route) {
  return [...VEHICLES].reverse().find(vehicle => state.vehicles.includes(vehicle.id) && vehicleMeets(route, vehicle.id) && !state.deliveries.some(delivery => !delivery.rewarded && delivery.endsAt > now() && delivery.vehicleId === vehicle.id));
}

function renderDeliveries(body) {
  const timestamp = now();
  const active = state.deliveries.filter(delivery => !delivery.rewarded && delivery.endsAt > timestamp);
  body.innerHTML = `<div class="delivery-layout"><div><p class="section-intro">Choose a route and dispatch an available capable vehicle. Deliveries travel automatically—even while the game is closed—and rewards are paid once when they return.</p><div class="section-title"><h3>Routes</h3><small>${active.length} vehicle${active.length === 1 ? '' : 's'} traveling</small></div><div class="route-list">${ROUTES.map(route => {
    const required = VEHICLES.find(vehicle => vehicle.id === route.vehicle);
    const vehicle = availableVehicleFor(route);
    const unlocked = state.level >= required.level;
    const stocked = Object.entries(route.requires).every(([id, count]) => (state.inventory[id] || 0) >= count);
    return `<article class="route ${!unlocked ? 'locked' : ''}"><span class="route-icon">${route.icon}</span><div><h4>${escapeHTML(route.name)}</h4><p>${formatIngredients(route.requires)} · ${timeText(route.seconds)} · ${money(route.pay)} · ${route.xp} XP · up to ${Math.round(route.tip * 100)}% tip</p><div class="card-meta"><span class="tag">Requires ${required.icon} ${escapeHTML(required.name)} or better</span></div></div><button class="card-button" type="button" data-dispatch="${route.id}" ${!unlocked || !vehicle || !stocked ? 'disabled' : ''}>${!unlocked ? `Lv ${required.level}` : !stocked ? 'Need fruit' : !vehicle ? 'Vehicle busy' : `Send ${vehicle.icon}`}</button></article>`;
  }).join('')}</div><div class="section-title"><h3>Active deliveries</h3></div><div class="route-list">${active.length ? active.map(delivery => {
    const route = ROUTES.find(item => item.id === delivery.routeId);
    const vehicle = VEHICLES.find(item => item.id === delivery.vehicleId);
    const percent = clamp(((timestamp - delivery.startedAt) / (delivery.endsAt - delivery.startedAt)) * 100, 0, 100);
    return `<article class="route"><span class="route-icon">${vehicle.icon}</span><div><h4>${escapeHTML(route.name)}</h4><p data-delivery-time="${delivery.id}">Returns in ${timeText((delivery.endsAt - timestamp) / 1000)}</p><div class="delivery-progress"><div class="big-progress"><span data-delivery-bar="${delivery.id}" style="width:${percent}%"></span></div></div></div><span class="tag">En route</span></article>`;
  }).join('') : '<div class="waiting">No vehicles are traveling. Pick a stocked route above.</div>'}</div></div><aside><div class="section-title"><h3>Fleet garage</h3><small>${state.vehicles.length} / ${VEHICLES.length} owned</small></div><div class="route-list">${VEHICLES.map(vehicle => {
    const owned = state.vehicles.includes(vehicle.id);
    return `<article class="game-card ${owned ? 'completed' : state.level < vehicle.level ? 'locked' : ''}"><div class="card-top"><span class="card-icon">${vehicle.icon}</span><div><h4>${escapeHTML(vehicle.name)}</h4><p>Speed ×${vehicle.speed.toFixed(2)} · level ${vehicle.level}</p></div></div><div class="card-meta"><span class="tag cash">💵 ${money(vehicle.cost)}</span>${vehicle.coins ? `<span class="tag coin">🪙 ${vehicle.coins}</span>` : ''}</div><button class="card-button ${owned ? 'purchased' : ''}" type="button" data-vehicle="${vehicle.id}" ${owned || state.level < vehicle.level ? 'disabled' : ''}>${owned ? 'Owned ✓' : state.level < vehicle.level ? `Unlocks at level ${vehicle.level}` : 'Purchase vehicle'}</button></article>`;
  }).join('')}</div></aside></div>`;
  $$('[data-dispatch]', body).forEach(button => button.addEventListener('click', () => dispatchRoute(button.dataset.dispatch, () => renderDeliveries(body))));
  $$('[data-vehicle]', body).forEach(button => button.addEventListener('click', () => purchaseVehicle(button.dataset.vehicle, () => renderDeliveries(body))));
}

function openDeliveries() {
  openModal({ title: 'Delivery Dispatch', eyebrow: '🚚 Routes run automatically', wide: true, onOpen: renderDeliveries });
}

function purchaseVehicle(vehicleId, rerender) {
  const vehicle = VEHICLES.find(item => item.id === vehicleId);
  if (!vehicle || state.vehicles.includes(vehicleId) || state.level < vehicle.level) return;
  if (!spend(state, vehicle.cost, vehicle.coins)) {
    toast('Cannot afford this vehicle', `You need ${money(vehicle.cost)}${vehicle.coins ? ` and ${vehicle.coins} Fruit Coins` : ''}.`, vehicle.icon, 'error');
    return;
  }
  state.vehicles.push(vehicleId);
  gainXP(Math.round(vehicle.cost / 45));
  toast('New vehicle!', `${vehicle.name} joined the Fruitopia fleet.`, vehicle.icon, 'reward');
  playSound('purchase');
  scheduleSave();
  renderHUD();
  rerender?.();
}

function dispatchRoute(routeId, rerender) {
  const route = ROUTES.find(item => item.id === routeId);
  const vehicle = route && availableVehicleFor(route);
  if (!route || !vehicle || !removeIngredients(state, route.requires)) {
    toast('Cannot dispatch', 'Check the required fruit and make sure a capable vehicle is available.', '🚫', 'error');
    return;
  }
  const bonuses = calculateBonuses(state);
  const duration = route.seconds / vehicle.speed / bonuses.deliverySpeed / eventEffect('deliverySpeed', 1);
  const startedAt = now();
  state.deliveries.push({
    id: `delivery-${startedAt}-${Math.random().toString(36).slice(2, 7)}`,
    routeId, vehicleId: vehicle.id, startedAt, endsAt: startedAt + duration * 1000, rewarded: false
  });
  state.deliveries = state.deliveries.slice(-20);
  toast('Delivery dispatched!', `${vehicle.icon} ${vehicle.name} is heading to ${route.name}.`, '🚚');
  playSound('success');
  scheduleSave();
  renderHUD();
  renderWorld(true);
  rerender?.();
}

function openMap() {
  openModal({
    title: 'Fruitopia Teleport Map', eyebrow: '🗺️ Explore the whole valley', wide: true,
    content: `<p class="section-intro">Teleporters power on at 75% district completion. Sunny Side and Apple Grove are always available as home destinations.</p><div class="mini-map">${DISTRICTS.map(area => {
      const unlocked = isDistrictUnlocked(state, area);
      const progress = districtProgress(state, area.id);
      const canTeleport = unlocked && (progress >= 75 || ['stand', 'orchard'].includes(area.id));
      return `<button class="mini-map-node ${unlocked ? '' : 'locked'}" type="button" data-map-district="${area.id}" style="left:${(area.x / 2200) * 100}%;top:${(area.y / 1400) * 100}%" ${canTeleport ? '' : 'disabled'}>${unlocked ? area.icon : '🔒'}<small>${escapeHTML(area.name)}<br>${unlocked ? `${progress}%${canTeleport ? ' · Teleport' : ''}` : `Level ${area.unlock.level}`}</small></button>`;
    }).join('')}</div>`
  });
  $$('[data-map-district]', dom.modalHost).forEach(button => button.addEventListener('click', () => teleportTo(button.dataset.mapDistrict)));
}

function openAchievements() {
  openModal({
    title: 'Achievement Cabinet', eyebrow: `🏆 ${Object.keys(state.achievements).length} of ${ACHIEVEMENTS.length} unlocked`, wide: true,
    content: `<p class="section-intro">Achievements award Fruit Coins automatically the first time their goal is met.</p><div class="card-grid">${ACHIEVEMENTS.map(achievement => {
      const complete = Boolean(state.achievements[achievement.id]);
      const progress = Math.min(achievement.target, state.stats[achievement.stat] || 0);
      return `<article class="game-card ${complete ? 'completed' : ''}"><div class="card-top"><span class="card-icon">${complete ? achievement.icon : '🔒'}</span><div><h3>${escapeHTML(achievement.name)}</h3><p>${escapeHTML(achievement.desc)}</p></div></div><div class="card-meta"><span class="tag">${complete ? 'Completed ✓' : `${formatNumber(progress)} / ${formatNumber(achievement.target)}`}</span><span class="tag coin">🪙 ${achievement.reward}</span></div><div class="big-progress"><span style="width:${(progress / achievement.target) * 100}%"></span></div></article>`;
    }).join('')}</div>`
  });
}

function renderMilestones(body) {
  body.innerHTML = `<p class="section-intro">Milestones never expire. Claim each reward once when its objective is complete.</p><div class="card-grid">${MILESTONES.map(milestone => {
    const entry = state.milestones[milestone.id];
    const ready = entry.progress >= milestone.target && !entry.claimed;
    return `<article class="game-card ${entry.claimed ? 'completed' : ready ? 'selected' : ''}"><div class="card-top"><span class="card-icon">${entry.claimed ? '✓' : '🌱'}</span><div><h3>${escapeHTML(milestone.name)}</h3><p>${escapeHTML(milestone.desc)}</p></div></div><div class="card-meta"><span class="tag">${Math.floor(entry.progress)} / ${milestone.target}</span><span class="tag cash">${milestone.reward.cash ? money(milestone.reward.cash) : ''}</span>${milestone.reward.coins ? `<span class="tag coin">🪙 ${milestone.reward.coins}</span>` : ''}<span class="tag">⭐ ${milestone.reward.xp}</span></div><button class="card-button" type="button" data-milestone="${milestone.id}" ${ready ? '' : 'disabled'}>${entry.claimed ? 'Claimed ✓' : ready ? 'Claim reward' : 'In progress'}</button></article>`;
  }).join('')}</div>`;
  $$('[data-milestone]', body).forEach(button => button.addEventListener('click', () => claimMilestone(button.dataset.milestone, body)));
}

function openMilestones() {
  openModal({ title: 'Milestone Quests', eyebrow: '🌱 Long-term empire goals', wide: true, onOpen: renderMilestones });
}

function claimMilestone(id, body) {
  const milestone = MILESTONES.find(item => item.id === id);
  const entry = state.milestones[id];
  if (!milestone || !entry || entry.claimed || entry.progress < milestone.target) return;
  entry.claimed = true;
  gainCash(milestone.reward.cash || 0, 'milestone');
  gainCoins(milestone.reward.coins || 0, 'milestone');
  gainXP(milestone.reward.xp || 0);
  toast('Milestone claimed!', `${milestone.name} rewards added to your empire.`, '🎁', 'reward');
  playSound('coin');
  scheduleSave();
  renderHUD();
  renderMilestones(body);
}

const PERMANENT_BONUSES = {
  sales: { name: 'Evergreen Customers', icon: '💛', desc: '+8% sale price every season' },
  growth: { name: 'Heirloom Seeds', icon: '🌱', desc: 'Fruit grows 4% faster every season' },
  luck: { name: 'Golden Luck', icon: '✨', desc: '+1.5% manual Fruit Coin chance' },
  capacity: { name: 'Bottomless Baskets', icon: '🧺', desc: '+15 permanent storage capacity' },
  workers: { name: 'Skilled Alumni', icon: '🧑‍🌾', desc: '+5% permanent worker speed' },
  deliveries: { name: 'Seasoned Fleet', icon: '🚚', desc: '+5% permanent delivery speed' },
  offline: { name: 'Moonlit Operations', icon: '🌙', desc: '+10% permanent offline rewards' },
  budgets: { name: 'Trusted Brand', icon: '🤝', desc: '+6% permanent customer budgets' },
  tips: { name: 'Tip Top Service', icon: '🪙', desc: '+2% permanent tip chance' }
};

function renderSeason(body) {
  const reward = newSeasonReward(state);
  const age = EVOLUTION_AGES.find(item => item.id === state.evolution.age) || EVOLUTION_AGES[0];
  body.innerHTML = `<div class="district-hero"><div><h3>${age.icon} Season ${state.season} · ${escapeHTML(age.name)}</h3><p>A new season resets cash, ordinary upgrades, district construction, normal inventory, active production, and fleet progress. Achievements, fruit discoveries, high scores, worker memories, decorations, Golden Seeds, and evolution remain.</p><div class="district-statline"><span class="tag coin">🌟 ${state.goldenSeeds} Golden Seeds</span><span class="tag">Lifetime cash ${money(state.lifetimeCash)}</span><span class="tag">Empire level ${state.level}</span></div></div><div class="district-action"><button class="primary-button" type="button" data-new-season ${reward ? '' : 'disabled'}>${reward ? `Start new season · +${reward} Seeds` : 'Unlock at level 18 or $100K lifetime'}</button></div></div><div class="section-title"><h3>Company evolution</h3><small>New visual ages unlock across seasons</small></div><div class="age-track">${EVOLUTION_AGES.map(item => `<span class="${state.season >= item.seasons ? 'complete' : ''}">${item.icon}<b>${escapeHTML(item.name)}</b><small>Season ${item.seasons}</small></span>`).join('')}</div><div class="section-title"><h3>Permanent orchard legacy</h3><small>Golden Seed cost rises by level</small></div><div class="card-grid">${Object.entries(PERMANENT_BONUSES).map(([id, bonus]) => {
    const level = state.permanent[id] || 0;
    const cost = level + 1;
    return `<article class="game-card"><div class="card-top"><span class="card-icon">${bonus.icon}</span><div><h3>${escapeHTML(bonus.name)} · Lv ${level}</h3><p>${escapeHTML(bonus.desc)}</p></div></div><div class="card-meta"><span class="tag coin">🌟 ${cost} Golden Seed${cost === 1 ? '' : 's'}</span></div><button class="card-button" type="button" data-permanent="${id}" ${state.goldenSeeds < cost ? 'disabled' : ''}>Grow permanent bonus</button></article>`;
  }).join('')}</div>`;
  $('[data-new-season]', body)?.addEventListener('click', confirmNewSeason);
  $$('[data-permanent]', body).forEach(button => button.addEventListener('click', () => {
    const id = button.dataset.permanent;
    const cost = (state.permanent[id] || 0) + 1;
    if (state.goldenSeeds < cost) return;
    state.goldenSeeds -= cost;
    state.permanent[id] += 1;
    playSound('purchase');
    scheduleSave();
    renderHUD();
    renderSeason(body);
  }));
}

function openSeason() {
  openModal({ title: 'Start a New Season', eyebrow: '🌻 Prestige & permanent growth', wide: true, onOpen: renderSeason });
}

function confirmNewSeason() {
  const reward = newSeasonReward(state);
  if (!reward) return;
  openModal({
    title: 'Begin a new season?', eyebrow: 'This resets normal progress',
    content: `<div class="result-card"><span class="result-icon">🌻</span><h3>Earn ${reward} Golden Seeds</h3><p>Your permanent bonuses, settings, season count, and Golden Seeds stay. All ordinary empire progress restarts.</p><div class="game-controls"><button class="danger-button" type="button" data-confirm-season>Reset and begin</button><button class="secondary-button" type="button" data-cancel-season>Keep playing</button></div></div>`
  });
  $('[data-confirm-season]', dom.modalHost).addEventListener('click', () => {
    const result = startNewSeason(state);
    if (!result) return;
    state = result.state;
    saveGame();
    closeModal();
    renderAll();
    centerOn(undefined, undefined, false);
    toast('A new season begins!', `You earned ${result.earned} Golden Seeds. Permanent bonuses are active.`, '🌻', 'reward');
    playSound('level');
  });
  $('[data-cancel-season]', dom.modalHost).addEventListener('click', closeModal);
}

function renderSettings(body) {
  const settings = [
    ['sound', 'Sound effects', 'Harvests, purchases, rewards, and game feedback'],
    ['music', 'Gentle music', 'A quiet synthesized orchard chord'],
    ['reducedMotion', 'Reduced motion', 'Turns off decorative movement and transition effects'],
    ['autosave', 'Autosave', 'Save locally every ten seconds and after important actions']
  ];
  body.innerHTML = `<p class="section-intro">Progress is stored only in this browser using a versioned, migration-safe save. No account or backend is needed.</p>${settings.map(([id, name, desc]) => `<div class="setting-row"><span><b>${escapeHTML(name)}</b><small>${escapeHTML(desc)}</small></span><button class="toggle" type="button" role="switch" aria-checked="${Boolean(state.settings[id])}" aria-pressed="${Boolean(state.settings[id])}" data-setting="${id}" aria-label="Toggle ${escapeHTML(name)}"></button></div>`).join('')}<div class="section-title"><h3>Save data</h3></div><div class="game-controls"><button class="primary-button" type="button" data-save-now>Save now</button><button class="secondary-button" type="button" data-help>Controls & help</button><button class="danger-button" type="button" data-reset>Reset all progress</button></div><p class="section-intro" style="margin-top:14px">Save format v${state.version} · last saved ${new Date(state.lastSavedAt).toLocaleString()}</p>`;
  $$('[data-setting]', body).forEach(button => button.addEventListener('click', () => {
    const id = button.dataset.setting;
    state.settings[id] = !state.settings[id];
    if (id === 'music') toggleMusic(state.settings.music);
    if (id === 'reducedMotion') document.body.classList.toggle('reduce-motion', state.settings.reducedMotion);
    saveGame();
    renderSettings(body);
  }));
  $('[data-save-now]', body).addEventListener('click', () => saveGame(true));
  $('[data-help]', body).addEventListener('click', openHelp);
  $('[data-reset]', body).addEventListener('click', confirmReset);
}

function openSettings() {
  openModal({ title: 'Settings', eyebrow: '⚙️ Sound, motion & save data', onOpen: renderSettings });
}

function confirmReset() {
  openModal({
    title: 'Reset all progress?', eyebrow: 'This cannot be undone',
    content: `<div class="result-card"><span class="result-icon">⚠️</span><h3>Return to a tiny fruit stand</h3><p>This erases currencies, upgrades, fruit, high scores, achievements, Golden Seeds, and every season.</p><div class="game-controls"><button class="danger-button" type="button" data-confirm-reset>Yes, erase everything</button><button class="secondary-button" type="button" data-cancel-reset>Cancel</button></div></div>`
  });
  $('[data-confirm-reset]', dom.modalHost).addEventListener('click', () => {
    state = createInitialState();
    localStorage.removeItem(SAVE_KEY);
    saveGame();
    closeModal();
    renderAll();
    centerOn(undefined, undefined, false);
    toast('Fresh start', 'Your new Fruitopia season is ready to grow.', '🌱');
  });
  $('[data-cancel-reset]', dom.modalHost).addEventListener('click', closeModal);
}

function openHelp() {
  openModal({
    title: 'Welcome to Fruitopia!', eyebrow: '🍓 Controls & quick-start guide', wide: true,
    content: `<div class="card-grid">
      <article class="game-card"><div class="card-top"><span class="card-icon">🚶</span><div><h3>Explore</h3><p>Move with WASD or arrow keys. Click or tap open ground to walk there. On touch screens, use the direction pad. Use Pan mode to drag the map without moving.</p></div></div></article>
      <article class="game-card"><div class="card-top"><span class="card-icon">🌳</span><div><h3>Harvest</h3><p>Tap trees labeled “Pick me!” Ripe fruit enters your basket, earns XP, and can reveal Fruit Coins. Growth continues while you are away.</p></div></div></article>
      <article class="game-card"><div class="card-top"><span class="card-icon">🏡</span><div><h3>Build</h3><p>Open buildings to purchase improvements and workers. Six of eight improvements reveal the local minigame and power its teleporter.</p></div></div></article>
      <article class="game-card"><div class="card-top"><span class="card-icon">🧃</span><div><h3>Craft & sell</h3><p>The stand automatically sells one item at a time. Recipes turn fruit into more valuable products. Feature an item for a temporary 40% bonus.</p></div></div></article>
      <article class="game-card"><div class="card-top"><span class="card-icon">🚚</span><div><h3>Deliver</h3><p>Stock a route, own its required vehicle or better, then dispatch. The vehicle returns automatically with Cash, XP, and possible tips or Fruit Coins.</p></div></div></article>
      <article class="game-card"><div class="card-top"><span class="card-icon">⌨️</span><div><h3>Keyboard & accessibility</h3><p>Tab reaches every control, Enter or Space activates it, Escape closes dialogs, and focus stays inside open dialogs. Reduced motion is available in Settings.</p></div></div></article>
    </div><div class="section-title"><h3>First five minutes</h3></div><ol class="section-intro"><li>Harvest the six ripe apple trees near Apple Grove.</li><li>Buy Better Sign or Copper Watering Cans.</li><li>Claim the First Pick milestone and today’s quests.</li><li>Reach level 2, stock Cottage Lane, and dispatch the bicycle.</li><li>Complete six improvements in a district, then buy its minigame with Fruit Coins.</li></ol>`
  });
}

function openEmpireProgress() {
  const required = XP_FOR_LEVEL(state.level);
  openModal({
    title: `Empire Level ${state.level}`, eyebrow: `⭐ ${titleForLevel(state.level)}`,
    content: `<div class="district-hero"><div><h3>${formatNumber(state.xp)} / ${formatNumber(required)} XP</h3><p>Earn Empire XP from harvesting, recipes, improvements, deliveries, quests, minigames, and district completion.</p></div><span class="level-badge">${state.level}</span></div><div class="section-title"><h3>Empire snapshot</h3></div><div class="card-grid"><article class="game-card"><div class="card-top"><span class="card-icon">💵</span><div><h3>${money(state.lifetimeCash)}</h3><p>Lifetime cash earned this season</p></div></div></article><article class="game-card"><div class="card-top"><span class="card-icon">🏘️</span><div><h3>${state.stats.districtComplete || 0} complete</h3><p>${DISTRICTS.filter(area => isDistrictUnlocked(state, area)).length} of ${DISTRICTS.length} districts unlocked</p></div></div></article><article class="game-card"><div class="card-top"><span class="card-icon">🌻</span><div><h3>Season ${state.season}</h3><p>${state.goldenSeeds} Golden Seeds available</p></div></div></article></div>`
  });
}

function claimQuest(questId) {
  const quest = state.quests.find(item => item.id === questId);
  if (!quest || quest.claimed || quest.progress < quest.target) return;
  quest.claimed = true;
  gainCash(quest.reward.cash, 'quest');
  gainCoins(quest.reward.coins, 'quest');
  gainXP(quest.reward.xp);
  toast('Quest complete!', `${money(quest.reward.cash)} · ${quest.reward.coins} Fruit Coins · ${quest.reward.xp} XP`, quest.icon, 'reward');
  playSound('coin');
  scheduleSave();
  renderHUD();
  renderQuests();
}

function renderQuests() {
  const list = $('#questList');
  if (!list) return;
  list.innerHTML = state.quests.map(quest => {
    const ready = quest.progress >= quest.target && !quest.claimed;
    return `<article class="quest ${ready ? 'ready' : ''}"><span class="quest-icon">${quest.icon}</span><div><strong>${escapeHTML(quest.label)}</strong><small>${quest.claimed ? 'Reward claimed' : `${Math.floor(quest.progress)} / ${quest.target} · $${quest.reward.cash} + 🪙${quest.reward.coins}`}</small><div class="quest-progress"><span style="width:${Math.min(100, quest.progress / quest.target * 100)}%"></span></div></div><button class="claim-button" type="button" data-quest="${quest.id}" ${ready ? '' : 'disabled'}>${quest.claimed ? '✓' : ready ? 'Claim' : `${Math.floor(quest.progress)}/${quest.target}`}</button></article>`;
  }).join('');
  $$('[data-quest]', list).forEach(button => button.addEventListener('click', () => claimQuest(button.dataset.quest)));
}

function generateCustomer() {
  const fruits = Object.entries(FRUITS).filter(([id]) => isFruitUnlocked(state, id));
  const [fruitId, fruit] = fruits[Math.floor(Math.random() * fruits.length)] || ['apple', FRUITS.apple];
  const count = 2 + Math.floor(Math.random() * Math.min(5, 2 + state.level / 3));
  const golden = Math.random() < (state.event?.type === 'goldenCustomer' && state.event.endsAt > now() ? .65 : .07);
  state.customer = {
    id: `customer-${now()}`,
    fruitId, count, golden,
    reward: Math.round(fruit.value * count * (golden ? 4 : 2.15)),
    coins: golden ? 2 + Math.floor(Math.random() * 3) : Math.random() < .16 ? 1 : 0,
    expiresAt: now() + 65000
  };
  renderCustomer();
}

function fulfillCustomer() {
  const request = state.customer;
  if (!request || request.expiresAt <= now()) return;
  if ((state.inventory[request.fruitId] || 0) < request.count) {
    toast('Not enough fruit', `Harvest ${request.count} ${FRUITS[request.fruitId].name}.`, '🧺', 'error');
    return;
  }
  state.inventory[request.fruitId] -= request.count;
  gainCash(request.reward, 'customer');
  gainCoins(request.coins, 'customer');
  gainXP(8 + request.count * 2);
  record('sell', request.count);
  toast(request.golden ? 'Golden customer!' : 'Happy customer!', `${money(request.reward)}${request.coins ? ` · ${request.coins} Fruit Coin tip` : ''}`, request.golden ? '✨' : '😊', 'reward');
  playSound(request.golden ? 'coin' : 'success');
  state.customer = null;
  runtime.requestAt = now() + 25000;
  scheduleSave();
  renderCustomer();
  renderHUD();
}

function renderCustomer() {
  const host = $('#customerRequest');
  const face = $('#customerFace');
  const timer = $('#requestTimer');
  if (!host) return;
  const request = state.customer;
  if (!request || request.expiresAt <= now()) {
    if (request) { state.customer = null; runtime.requestAt = now() + 18000; }
    face.textContent = '🙂';
    timer.textContent = 'A neighbor is arriving…';
    host.innerHTML = '<div class="waiting">The stand is ready for a special order.</div>';
    return;
  }
  const fruit = FRUITS[request.fruitId];
  face.textContent = request.golden ? '🤑' : '😊';
  timer.textContent = `${timeText((request.expiresAt - now()) / 1000)} remaining`;
  const stocked = (state.inventory[request.fruitId] || 0) >= request.count;
  host.innerHTML = `<div class="request-card"><p>${request.golden ? '<strong>Golden customer:</strong> ' : ''}“Could I have ${request.count} ${fruit.icon} ${escapeHTML(fruit.name)}?”</p><div class="request-actions"><span><strong>${money(request.reward)}</strong>${request.coins ? ` + 🪙${request.coins}` : ''}</span><button type="button" data-fulfill ${stocked ? '' : 'disabled'}>${stocked ? 'Fill order' : `${state.inventory[request.fruitId] || 0}/${request.count}`}</button></div></div>`;
  $('[data-fulfill]', host)?.addEventListener('click', fulfillCustomer);
}

function renderFeatureOptions() {
  const select = $('#featuredSelect');
  if (!select) return;
  const current = select.value;
  const fruitOptions = Object.entries(FRUITS).filter(([, fruit]) => state.level >= fruit.level)
    .map(([id, fruit]) => `<option value="fruit:${id}">${fruit.icon} ${escapeHTML(fruit.name)}</option>`);
  const productOptions = RECIPES.filter(recipe => state.level >= recipe.level)
    .map(recipe => `<option value="product:${recipe.id}">${recipe.icon} ${escapeHTML(recipe.name)}</option>`);
  select.innerHTML = `<optgroup label="Fresh fruit">${fruitOptions.join('')}</optgroup><optgroup label="Crafted products">${productOptions.join('')}</optgroup>`;
  if ([...select.options].some(option => option.value === current)) select.value = current;
  else if (state.featured?.id) select.value = `${state.featured.type}:${state.featured.id}`;
}

function featureSelected() {
  const [type, id] = $('#featuredSelect').value.split(':');
  if (!id) return;
  state.featured = { type, id, until: now() + 120000 };
  const item = type === 'fruit' ? FRUITS[id] : RECIPES.find(recipe => recipe.id === id);
  toast('Featured special started!', `${item.icon} ${item.name} sells for 40% more for two minutes.`, '📣');
  playSound('success');
  scheduleSave();
  renderHUD();
}

function renderHUD() {
  const bonuses = calculateBonuses(state);
  $('#cashValue').textContent = money(state.cash);
  $('#coinValue').textContent = formatNumber(state.coins);
  $('#basketValue').textContent = `${totalFruitInventory(state)}/${Math.floor(bonuses.capacity)} · 📦${totalProductInventory(state)}/${Math.floor(bonuses.warehouse)}`;
  $('#incomeValue').textContent = `${money(bonuses.passive)}/s`;
  $('#levelValue').textContent = state.level;
  $('#levelTitle').textContent = titleForLevel(state.level);
  const required = XP_FOR_LEVEL(state.level);
  $('#xpFill').style.width = `${clamp(state.xp / required * 100, 0, 100)}%`;
  $('#xpValue').textContent = `${formatNumber(state.xp)} / ${formatNumber(required)} XP`;
  const featured = state.featured && state.featured.until > now();
  if (featured) {
    const item = state.featured.type === 'fruit' ? FRUITS[state.featured.id] : RECIPES.find(recipe => recipe.id === state.featured.id);
    $('#featuredStatus').textContent = item ? `${item.icon} ${item.name} · ${timeText((state.featured.until - now()) / 1000)} left` : 'Nothing featured yet.';
  } else $('#featuredStatus').textContent = 'Nothing featured yet.';
  const hasActive = state.deliveries.some(delivery => !delivery.rewarded && delivery.endsAt > now());
  $('#deliveryBadge').classList.toggle('hidden', !hasActive);
  $('#phoneBadge').classList.toggle('hidden', !state.phone.unlocked || !(state.phone.unread || state.orders.some(order => ['offered', 'payment'].includes(order.status))));
  $('#phoneBadge').textContent = Math.min(9, state.phone.unread || state.orders.filter(order => ['offered', 'payment'].includes(order.status)).length) || '!';
  $('#reputationValue').textContent = Math.round(state.reputation);
  $('#happinessValue').textContent = `${averageWorkerHappiness(state)}%`;
  $('#researchValue').textContent = formatNumber(state.research.points);
  document.body.dataset.age = state.evolution.age;
  document.body.classList.toggle('reduce-motion', state.settings.reducedMotion);
}

function checkDistrictUnlocks() {
  for (const area of DISTRICTS) {
    if (!isDistrictUnlocked(state, area) || runtime.knownUnlocked.has(area.id)) continue;
    runtime.knownUnlocked.add(area.id);
    toast('New district unlocked!', `${area.icon} ${area.name} is open to explore.`, '🗺️', 'reward');
    playSound('level');
  }
}

function sellOneItem() {
  const bonuses = calculateBonuses(state);
  let type = 'product';
  let id = Object.keys(state.products).find(productId => state.products[productId] > 0);
  if (state.featured?.until > now() && state.featured.type === 'product' && (state.products[state.featured.id] || 0) > 0) id = state.featured.id;
  if (!id) {
    type = 'fruit';
    id = Object.keys(state.inventory).find(fruitId => state.inventory[fruitId] > 0);
    if (state.featured?.until > now() && state.featured.type === 'fruit' && (state.inventory[state.featured.id] || 0) > 0) id = state.featured.id;
  }
  if (!id) return false;
  const item = type === 'fruit' ? FRUITS[id] : RECIPES.find(recipe => recipe.id === id);
  if (!item) return false;
  if (type === 'fruit') state.inventory[id] -= 1;
  else state.products[id] -= 1;
  let value = item.value * bonuses.sale * (type === 'product' ? bonuses.craft : 1);
  if (state.featured?.until > now() && state.featured.type === type && state.featured.id === id) value *= 1.4;
  value *= eventEffect('sale', 1);
  if (type === 'product') value *= eventEffect('productionValue', 1);
  gainCash(value, 'sale');
  record('sell', 1);
  if (Math.random() < bonuses.tips) {
    const tip = Math.max(1, Math.ceil(value * .25));
    gainCash(tip, 'tip');
    if (Math.random() < .12) {
      gainCoins(1, 'tip');
      toast('Shiny customer tip!', `${item.icon} A happy customer left a Fruit Coin.`, '🪙', 'reward');
    }
  }
  return true;
}

function autoCraft() {
  const maker = state.workers.juice_maker || 0;
  if (!maker) return false;
  const recipe = RECIPES.filter(canCraft).sort((a, b) => a.value - b.value)[0];
  if (!recipe || !removeIngredients(state, recipe.ingredients)) return false;
  addProduct(state, recipe.id, 1);
  record('craft', 1);
  gainXP(2 + maker);
  scheduleSave();
  return true;
}

function completeDeliveries() {
  const timestamp = now();
  const bonuses = calculateBonuses(state);
  let completed = 0;
  for (const delivery of state.deliveries) {
    if (delivery.rewarded || delivery.endsAt > timestamp) continue;
    // Mark first so repeated timers or a reload can never collect the same trip twice.
    delivery.rewarded = true;
    const route = ROUTES.find(item => item.id === delivery.routeId);
    const vehicle = VEHICLES.find(item => item.id === delivery.vehicleId);
    if (!route || !vehicle) continue;
    let payout = route.pay * bonuses.deliveryPay * eventEffect('deliveryPay', 1);
    const tipped = Math.random() < clamp(route.tip + bonuses.tips, 0, .9);
    const tip = tipped ? Math.round(payout * (.15 + Math.random() * .2)) : 0;
    payout += tip;
    const coinBonus = Math.random() < .26 ? 1 + (route.pay >= 9000 ? 1 : 0) : 0;
    gainCash(payout, 'delivery');
    gainCoins(coinBonus, 'delivery');
    gainXP(route.xp);
    record('delivery', 1);
    toast('Delivery returned!', `${vehicle.icon} ${route.name}: ${money(payout)}${tip ? ' including tip' : ''}${coinBonus ? ` · 🪙${coinBonus}` : ''}`, '📦', 'reward');
    playSound('complete');
    completed += 1;
  }
  if (completed) {
    scheduleSave();
    renderWorld(true);
    renderHUD();
  }
}

function startRandomEvent() {
  const keys = Object.keys(EXPANDED_EVENTS);
  const type = keys[Math.floor(Math.random() * keys.length)];
  const config = EXPANDED_EVENTS[type];
  state.event = { type, startedAt: now(), endsAt: now() + config.duration * 1000 };
  state.eventHistory.push({ type, at: now() });
  state.eventHistory = state.eventHistory.slice(-20);
  if (type === 'giantFruit') addInventory(state, 'watermelon', Math.min(3, Math.max(0, calculateBonuses(state).capacity - totalFruitInventory(state))));
  if (type === 'meteorFruit') state.research.points += 3;
  if (type === 'celebrityVisit') state.reputation = clamp(state.reputation + 2, 0, 100);
  if (type === 'inspection') state.reputation = clamp(state.reputation + (averageWorkerHappiness(state) >= 65 ? 2 : -.5), 0, 100);
  if (type === 'workerBirthday') for (const roster of Object.values(state.workerRoster)) if (roster.hired) roster.happiness = clamp(roster.happiness + 8, 0, 100);
  if (type === 'rainbowWeather' && state.secrets.clues.includes('golden_tree')) {
    const secret = discoverSecret(state, 'golden_tree');
    const appleTree = state.trees.find(tree => tree.fruit === 'apple');
    if (appleTree) { appleTree.golden = true; appleTree.readyAt = now(); }
    if (secret) { state.stats.secret += 1; gainCoins(3, 'secret'); }
  }
  if (type === 'mysteryCall' && !state.secrets.clues.includes('locked_contact')) state.secrets.clues.push('locked_contact');
  if (state.phone.unlocked) createPhoneMessage(state, { contactId: type === 'mysteryCall' ? 'mystery' : 'mayor', text: `${config.icon} ${config.name}: ${config.desc}`, actions: type === 'machineBreakdown' ? ['fix500', 'pause', 'handle'] : ['info', 'remind'], kind: 'event', relatedId: type });
  toast(`${config.name} event!`, config.desc, config.icon, 'reward');
  playSound('level');
  scheduleSave();
  renderEvent();
}

function renderEvent() {
  const banner = $('#eventBanner');
  for (const key of Object.keys(EXPANDED_EVENTS)) document.body.classList.remove(`event-${key}`);
  if (state.event && state.event.endsAt > now()) {
    const config = EXPANDED_EVENTS[state.event.type];
    document.body.classList.add(`event-${state.event.type}`);
    banner.innerHTML = `<strong>${config.icon} ${escapeHTML(config.name)}</strong> · ${escapeHTML(config.desc)} · <span>${timeText((state.event.endsAt - now()) / 1000)}</span>`;
    banner.classList.remove('hidden');
  } else {
    banner.classList.add('hidden');
    banner.innerHTML = '';
  }
}

function economyTick() {
  if (document.hidden) return;
  const timestamp = performance.now();
  const delta = Math.min(2, (timestamp - runtime.lastEconomy) / 1000);
  runtime.lastEconomy = timestamp;
  const bonuses = calculateBonuses(state);
  if (bonuses.passive > 0) gainCash(bonuses.passive * delta);
  runtime.saleTimer += delta;
  const saleInterval = Math.max(.65, 2.7 - (state.workers.cashier || 0) * .16);
  if (runtime.saleTimer >= saleInterval) {
    runtime.saleTimer %= saleInterval;
    sellOneItem();
  }
  runtime.pickerTimer += delta;
  const picker = state.workers.picker || 0;
  if (picker && runtime.pickerTimer >= Math.max(3, 14 - picker * 1.2)) {
    runtime.pickerTimer = 0;
    const ready = state.trees.find(tree => tree.readyAt <= now() && isFruitUnlocked(state, tree.fruit));
    if (ready) harvestTree(ready.id, null, true);
  }
  runtime.makerTimer += delta;
  const maker = state.workers.juice_maker || 0;
  if (maker && runtime.makerTimer >= Math.max(12, 48 - maker * 3.7)) {
    runtime.makerTimer = 0;
    autoCraft();
  }
  if (!state.customer && now() >= runtime.requestAt) generateCustomer();
  if (state.customer?.expiresAt <= now()) {
    state.customer = null;
    runtime.requestAt = now() + 18000;
  }
  for (const order of state.orders) {
    if (['offered', 'accepted'].includes(order.status) && order.deadline <= now()) {
      order.status = 'expired'; state.reputation = clamp(state.reputation - 1, 0, 100);
    }
  }
  const finishedBatches = collectProduction(state);
  for (const batch of finishedBatches) {
    record('craft', batch.added); gainXP(batch.added * 4);
    toast('Production complete!', `${batch.recipe.icon} ${batch.added} ${batch.recipe.name} added to the warehouse.`, '🏭', 'reward');
    if (state.phone.unlocked) createPhoneMessage(state, { contactId: 'juice_maker', text: `${batch.recipe.name} finished production and is ready in the warehouse.`, actions: ['info'], kind: 'worker' });
  }
  const research = resolveResearch(state);
  if (research) {
    state.stats.research += 1;
    if (research.success) { gainXP(35); gainCoins(research.first ? 2 : 0, 'research'); toast(research.first ? 'Hybrid discovered!' : 'Experiment succeeded', `${research.fruit.icon} ${research.fruit.name}${research.first ? ' added to the research notebook and orchard.' : ' produced again.'}`, '🔬', 'reward'); }
    else toast('Curious experiment', research.message, '🧪');
    scheduleSave(); renderWorld(true);
  }
  if (state.phone.unlocked && now() >= runtime.phoneMessageAt) { createWorkerPhoneMessage(); runtime.phoneMessageAt = now() + 45000 + Math.random() * 35000; }
  if (state.phone.unlocked && now() >= runtime.orderAt && state.orders.filter(order => ['offered', 'accepted'].includes(order.status)).length < 3) { generateOrder(state); runtime.orderAt = now() + 55000 + Math.random() * 45000; playSound('tap'); }
  if (now() >= runtime.workerVisitAt) { const worker = queueWorkerVisit(); runtime.workerVisitAt = now() + 70000 + Math.random() * 50000; if (worker && !state.phone.unlocked) toast('Office visitor', `${worker.name} is waiting in the office.`, worker.avatar); }
  for (const roster of Object.values(state.workerRoster)) if (roster.hired) roster.energy = clamp(roster.energy + delta * .025, 0, 100);
  const discovered = syncFruitDiscoveries(state);
  for (const id of discovered) toast('Fruit discovered!', `${FRUITS[id].icon} ${FRUITS[id].name} is now available.`, FRUITS[id].icon, 'reward');
  if (state.event?.endsAt <= now()) {
    const ended = EXPANDED_EVENTS[state.event.type];
    state.event = null;
    state.nextEventAt = now() + (125 + Math.random() * 90) * 1000;
    toast(`${ended.name} ended`, 'The valley is settling back into its usual rhythm.', ended.icon);
  }
  if (!state.event && now() >= state.nextEventAt) startRandomEvent();
  completeDeliveries();
  checkDistrictUnlocks();
  renderHUD();
  renderQuests();
  renderCustomer();
  renderEvent();
  renderWorld();
  runtime.saveTimer += delta;
  if (state.settings.autosave && runtime.saveTimer >= 10) saveGame();
}

function renderAll() {
  renderFeatureOptions();
  renderHUD();
  renderQuests();
  renderCustomer();
  renderEvent();
  renderWorld(true);
}

function bindControls() {
  $('#zoomOut').addEventListener('click', () => setZoom(runtime.zoom - .1));
  $('#zoomIn').addEventListener('click', () => setZoom(runtime.zoom + .1));
  $('#centerPlayer').addEventListener('click', () => centerOn());
  $('#panToggle').addEventListener('click', event => {
    runtime.pan = !runtime.pan;
    event.currentTarget.setAttribute('aria-pressed', runtime.pan);
    event.currentTarget.textContent = runtime.pan ? '🖐️ Panning' : '✋ Pan';
    dom.viewport.classList.toggle('pan-mode', runtime.pan);
  });
  $('#mapButton').addEventListener('click', openMap);
  $('#brandButton').addEventListener('click', openHelp);
  $('#basketButton').addEventListener('click', openFruitBook);
  $('#levelButton').addEventListener('click', openEmpireProgress);
  $('#milestoneButton').addEventListener('click', openMilestones);
  $('#reputationButton').addEventListener('click', () => openPhone('contacts'));
  $('#happinessButton').addEventListener('click', openWorkers);
  $('#researchButton').addEventListener('click', () => openPhone('research'));
  $('#featureButton').addEventListener('click', featureSelected);
  $$('.dock [data-screen]').forEach(button => button.addEventListener('click', () => {
    const actions = {
      office: openOffice, company: openBuildings, recipes: openRecipes, deliveries: openDeliveries,
      phone: openPhone, arcade: openArcade, fruit: openFruitBook, season: openSeason, more: openMore
    };
    actions[button.dataset.screen]?.();
  }));

  dom.world.addEventListener('click', event => {
    if (runtime.pan || runtime.dragging || event.target.closest('button')) return;
    const rect = dom.world.getBoundingClientRect();
    const x = clamp((event.clientX - rect.left) / runtime.zoom, 45, 2155);
    const y = clamp((event.clientY - rect.top) / runtime.zoom, 65, 1340);
    runtime.target = { x, y };
    dom.marker.style.left = `${x}px`;
    dom.marker.style.top = `${y}px`;
    dom.marker.classList.remove('visible');
    requestAnimationFrame(() => dom.marker.classList.add('visible'));
  });

  dom.viewport.addEventListener('pointerdown', event => {
    if (!runtime.pan && event.button !== 1) return;
    runtime.dragging = false;
    runtime.dragStart = { x: event.clientX, y: event.clientY, left: dom.viewport.scrollLeft, top: dom.viewport.scrollTop };
    dom.viewport.setPointerCapture?.(event.pointerId);
  });
  dom.viewport.addEventListener('pointermove', event => {
    if (!runtime.dragStart) return;
    const dx = event.clientX - runtime.dragStart.x;
    const dy = event.clientY - runtime.dragStart.y;
    if (Math.abs(dx) + Math.abs(dy) > 4) runtime.dragging = true;
    dom.viewport.scrollLeft = runtime.dragStart.left - dx;
    dom.viewport.scrollTop = runtime.dragStart.top - dy;
  });
  const stopDrag = () => {
    runtime.dragStart = null;
    setTimeout(() => { runtime.dragging = false; }, 0);
  };
  dom.viewport.addEventListener('pointerup', stopDrag);
  dom.viewport.addEventListener('pointercancel', stopDrag);

  window.addEventListener('keydown', event => {
    const key = event.key.toLowerCase();
    if (!dom.modalHost.firstElementChild && key === 'p') { event.preventDefault(); openPhone(); return; }
    if (!dom.modalHost.firstElementChild && key === 'o') { event.preventDefault(); openOffice(); return; }
    if (!['arrowleft', 'arrowright', 'arrowup', 'arrowdown', 'w', 'a', 's', 'd'].includes(key)) return;
    if ((event.target instanceof Element && event.target.matches('input, select, textarea, button')) || dom.modalHost.firstElementChild) return;
    event.preventDefault();
    runtime.keys.add(key);
  });
  window.addEventListener('keyup', event => runtime.keys.delete(event.key.toLowerCase()));
  window.addEventListener('blur', () => runtime.keys.clear());
  $$('.touch-pad [data-move]').forEach(button => {
    const map = { up: 'arrowup', down: 'arrowdown', left: 'arrowleft', right: 'arrowright' };
    const start = event => { event.preventDefault(); runtime.keys.add(map[button.dataset.move]); };
    const end = event => { event.preventDefault(); runtime.keys.delete(map[button.dataset.move]); };
    button.addEventListener('pointerdown', start);
    button.addEventListener('pointerup', end);
    button.addEventListener('pointercancel', end);
    button.addEventListener('pointerleave', end);
  });

  document.addEventListener('pointerdown', () => {
    if (state.settings.music && !runtime.musicNodes) toggleMusic(true);
  }, { once: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      runtime.keys.clear();
      saveGame();
      return;
    }
    runtime.lastEconomy = performance.now();
    const summary = offlineSummary(state);
    if (summary.cash) {
      record('earnCash', summary.cash);
      toast('Welcome back!', `${money(summary.cash)} passive income${summary.fruit ? ` · ${summary.fruit} apples picked` : ''}`, '🌤️', 'reward');
    }
    completeDeliveries();
    renderAll();
  });
  window.addEventListener('pagehide', () => saveGame());
}

function installTestHooks() {
  if (!new URLSearchParams(location.search).has('testMode')) return;
  window.__fruitopia = {
    getState: () => JSON.parse(JSON.stringify(state)),
    heldKeys: () => [...runtime.keys],
    stepMovement: () => movementFrame(runtime.lastFrame + 100),
    setResources: ({ cash = state.cash, coins = state.coins, level = state.level, xp = state.xp, lifetimeCash = state.lifetimeCash } = {}) => {
      state.cash = Math.max(0, cash); state.coins = Math.max(0, coins); state.level = Math.max(1, level); state.xp = Math.max(0, xp); state.lifetimeCash = Math.max(0, lifetimeCash); syncFruitDiscoveries(state); renderAll();
    },
    fillInventory: (amount = 20) => { for (const id of Object.keys(FRUITS)) state.inventory[id] = amount; renderAll(); },
    fillProducts: (amount = 20) => { for (const recipe of RECIPES) state.products[recipe.id] = amount; renderAll(); },
    setExpansion: ({ reputation = state.reputation, research = state.research.points, quality = null } = {}) => { state.reputation = reputation; state.research.points = research; if (quality !== null) for (const id of Object.keys(FRUITS)) state.fruitQuality[id] = quality; renderAll(); },
    hireWorker: id => { if (state.workerRoster[id]) { state.workerRoster[id].hired = true; state.workers[id] = Math.max(1, state.workers[id] || 0); } renderAll(); },
    buyUpgrade: (districtId, upgradeId) => {
      const fakeBody = document.createElement('div');
      purchaseUpgrade(districtId, upgradeId, fakeBody);
      return districtProgress(state, districtId);
    },
    buyMinigame: districtId => {
      const fakeBody = document.createElement('div');
      purchaseMinigame(districtId, fakeBody);
      return Boolean(state.minigames[districtId]);
    },
    openMinigame: districtId => openMinigame(districtId),
    finishMinigame: () => runtime.activeMinigame?.finish?.(),
    unlockAllMinigames: () => { for (const game of MINIGAME_CATALOG) state.minigames[game.id] = true; renderAll(); },
    craft: recipeId => craftRecipe(recipeId),
    harvestReady: () => {
      const tree = state.trees.find(item => item.readyAt <= now() && isFruitUnlocked(state, item.fruit));
      return tree ? harvestTree(tree.id, null, true) : false;
    },
    dispatch: routeId => dispatchRoute(routeId),
    finishDeliveries: () => { state.deliveries.forEach(delivery => { delivery.endsAt = now() - 1; }); completeDeliveries(); },
    buyBuilding: id => purchaseBuilding(state, id),
    buyOfficeUpgrade: id => { const body = document.createElement('div'); purchaseOfficeUpgrade(id, body); return state.office.upgrades.includes(id); },
    generateOrder: () => generateOrder(state),
    respondOrder: (id, response) => respondToOrder(state, id, response, () => 0),
    supplyOrder: id => supplyOrder(state, id),
    collectPayment: orderId => { const message = state.phone.messages.find(item => item.relatedId === orderId && item.kind === 'payment'); resolvePhoneMessage(message, 'collectPayment'); },
    queueVisit: id => queueWorkerVisit(id),
    startResearch: (a, b) => startResearch(state, a, b),
    finishResearch: () => { if (state.research.active) state.research.active.endsAt = now() - 1; return resolveResearch(state, now(), () => 0); },
    startProduction: id => startProduction(state, id),
    finishProduction: () => { state.production.forEach(job => { job.endsAt = now() - 1; }); return collectProduction(state); },
    startEvent: type => { state.nextEventAt = Infinity; const config = EXPANDED_EVENTS[type]; state.event = { type, startedAt: now(), endsAt: now() + config.duration * 1000 }; renderEvent(); },
    discoverSecret: id => discoverSecret(state, id),
    save: () => saveGame(),
    reset: () => { state = createInitialState(); saveGame(); renderAll(); },
    open: screen => ({ fruit: openFruitBook, recipes: openRecipes, deliveries: openDeliveries, map: openMap, settings: openSettings, office: openOffice, phone: openPhone, company: openBuildings, workers: openWorkers, arcade: openArcade, season: openSeason }[screen]?.()),
    closeModal
  };
}

const startupOffline = offlineSummary(state);
if (startupOffline.cash) {
  state.stats.earnCash += startupOffline.cash;
  updateObjectiveProgress('earnCash', startupOffline.cash);
}
bindControls();
setZoom(runtime.zoom);
renderDecor();
renderAll();
installTestHooks();
requestAnimationFrame(movementFrame);
setInterval(economyTick, 500);
setTimeout(() => centerOn(undefined, undefined, false), 60);
if (startupOffline.cash || startupOffline.fruit) {
  setTimeout(() => toast('Welcome back!', `${startupOffline.cash ? `${money(startupOffline.cash)} passive income` : ''}${startupOffline.cash && startupOffline.fruit ? ' · ' : ''}${startupOffline.fruit ? `${startupOffline.fruit} apples picked` : ''}`, '🌤️', 'reward'), 500);
} else if (!state.stats.harvest && !state.stats.upgrade) {
  setTimeout(() => toast('Welcome to Fruitopia!', 'Harvest a tree marked “Pick me!” to begin your fruit empire.', '🍎'), 600);
}
