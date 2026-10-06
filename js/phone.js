import { FRUITS, RECIPES, DISTRICTS, ACHIEVEMENTS } from './config.js';
import { WORKER_CHARACTERS, CONTACTS, SECRETS } from './expansion-config.js';
import { districtProgress, isDistrictUnlocked } from './core.js';
import { isFruitUnlocked } from './expansion-core.js';

const escapeHTML = value => String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
const money = value => `$${Math.max(0, Math.floor(Number(value) || 0)).toLocaleString()}`;
const timeText = timestamp => new Date(timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

export const PHONE_APPS = [
  ['messages', 'Messages', '💬'], ['contacts', 'Contacts', '👥'], ['orders', 'Orders', '📦'],
  ['workers', 'Workers', '🧑‍🌾'], ['deliveries', 'Tracker', '🚚'], ['market', 'Fruit Market', '📈'],
  ['banking', 'Company Bank', '🏦'], ['quests', 'Quests', '📋'], ['achievements', 'Achievements', '🏆'],
  ['research', 'Research', '🔬'], ['map', 'World Map', '🗺️'], ['settings', 'Settings', '⚙️'],
  ['secrets', 'Secrets', '🔐']
].map(([id, name, icon]) => ({ id, name, icon }));

function contactFor(id) {
  const worker = WORKER_CHARACTERS.find(item => item.id === id);
  if (worker) return { id, name: worker.name, avatar: worker.avatar, role: worker.role };
  return CONTACTS.find(item => item.id === id) || { id, name: 'Fruitopia Network', avatar: '🍓', role: 'Company message' };
}

function actionLabel(action) {
  return ({
    accept: 'Accept', decline: 'Decline politely', ask10: 'Ask 10% more', ask25: 'Ask 25% more',
    premium: 'Offer premium quality', fast: 'Offer faster delivery', moreTime: 'Request more time',
    collectPayment: 'Receive payment', coming: 'I’m coming', handle: 'Handle it yourself',
    fix500: 'Spend up to $500', pause: 'Pause production', remind: 'Remind me later', info: 'More information'
  })[action] || action;
}

function renderMessages(state) {
  const messages = [...(state.phone.messages || [])].reverse();
  return `<div class="phone-section-heading"><h3>Messages</h3><button type="button" data-phone-refresh>Check messages</button></div><div class="message-list">${messages.length ? messages.map(message => {
    const contact = contactFor(message.contactId);
    return `<article class="phone-message ${message.unread ? 'unread' : ''} ${message.kind === 'payment' ? 'payment' : ''}" data-message="${message.id}"><span class="contact-avatar">${contact.avatar}</span><div><div class="message-meta"><strong>${escapeHTML(contact.name)}</strong><time>${timeText(message.timestamp)}</time></div><p>${escapeHTML(message.text)}</p>${message.actions?.length && !message.resolved ? `<div class="message-actions">${message.actions.map(action => `<button type="button" data-message-action="${action}" data-message-id="${message.id}">${escapeHTML(actionLabel(action))}</button>`).join('')}</div>` : message.resolved ? '<small>Resolved ✓</small>' : ''}</div></article>`;
  }).join('') : '<div class="phone-empty">No messages yet. Check again or grow the company.</div>'}</div>`;
}

function renderContacts(state) {
  const contacts = [...WORKER_CHARACTERS.filter(worker => state.workerRoster?.[worker.id]?.hired), ...CONTACTS.filter(contact => contact.id !== 'mystery' || state.secrets.discovered.includes('locked_contact'))];
  return `<div class="phone-section-heading"><h3>Contacts</h3><small>${contacts.length} known</small></div><div class="phone-card-list">${contacts.map(contact => {
    const roster = state.workerRoster?.[contact.id];
    return `<article class="contact-row"><span class="contact-avatar">${contact.avatar}</span><div><strong>${escapeHTML(contact.name)}</strong><small>${escapeHTML(contact.role)}${roster ? ` · ${Math.round(roster.happiness)}% happy` : ''}</small></div><button type="button" data-contact="${contact.id}">Message</button></article>`;
  }).join('')}</div>`;
}

function orderItem(order) {
  return order.kind === 'product' ? RECIPES.find(item => item.id === order.itemId) : FRUITS[order.itemId];
}

function renderOrders(state) {
  const orders = [...state.orders].reverse();
  return `<div class="phone-section-heading"><h3>Customer Orders</h3><button type="button" data-generate-order>Find deal</button></div><div class="phone-card-list">${orders.length ? orders.map(order => {
    const item = orderItem(order) || { icon: '📦', name: order.itemId };
    const remaining = Math.max(0, Math.ceil((order.deadline - Date.now()) / 1000));
    const storage = order.kind === 'product' ? state.products : state.inventory;
    return `<article class="phone-order ${order.status}"><div class="phone-order-top"><span>${order.avatar}</span><div><strong>${escapeHTML(order.customerName)}</strong><small>${order.urgency} · reputation ${order.reputation}+</small></div><b>${money(order.payment)}</b></div><p>${item.icon} ${order.quantity} ${escapeHTML(item.name)} · quality ${order.quality} · ${remaining}s left</p><div class="phone-order-stock">Stock: ${storage[order.itemId] || 0}/${order.quantity}</div>${order.status === 'offered' ? `<div class="message-actions">${['accept', 'ask10', 'ask25', 'premium', 'fast', 'moreTime', 'decline'].map(action => `<button type="button" data-order-action="${action}" data-order-id="${order.id}">${actionLabel(action)}</button>`).join('')}</div>` : order.status === 'accepted' ? `<button class="phone-primary" type="button" data-supply-order="${order.id}">Supply order</button>` : `<small>Status: ${escapeHTML(order.status)}</small>`}</article>`;
  }).join('') : '<div class="phone-empty">No offers waiting. Find a deal when you are ready.</div>'}</div>`;
}

function renderWorkers(state) {
  return `<div class="phone-section-heading"><h3>Worker Management</h3><button type="button" data-open-workers>Full roster</button></div><div class="phone-card-list">${WORKER_CHARACTERS.map(worker => {
    const roster = state.workerRoster[worker.id];
    return `<article class="worker-phone-row ${roster.hired ? '' : 'locked'}"><span class="contact-avatar">${roster.hired ? worker.avatar : '🔒'}</span><div><strong>${escapeHTML(worker.name)}</strong><small>${escapeHTML(worker.role)} · skill ${roster.skill} · ${Math.round(roster.energy)}% energy</small><div class="tiny-meter"><span style="width:${roster.happiness}%"></span></div></div><button type="button" data-phone-worker="${worker.id}">${roster.hired ? 'Details' : 'Interview'}</button></article>`;
  }).join('')}</div>`;
}

function renderDeliveries(state) {
  const active = state.deliveries.filter(item => !item.rewarded);
  return `<div class="phone-section-heading"><h3>Delivery Tracker</h3><button type="button" data-open-deliveries>Dispatch</button></div><div class="phone-card-list">${active.length ? active.map(item => {
    const percent = Math.min(100, Math.max(0, (Date.now() - item.startedAt) / (item.endsAt - item.startedAt) * 100));
    return `<article class="phone-progress-card"><strong>🚚 ${escapeHTML(item.routeId.replaceAll('_', ' '))}</strong><small>${item.endsAt <= Date.now() ? 'Returning now' : `${Math.ceil((item.endsAt - Date.now()) / 1000)}s remaining`}</small><div class="tiny-meter"><span style="width:${percent}%"></span></div></article>`;
  }).join('') : '<div class="phone-empty">No active deliveries.</div>'}</div>`;
}

function dailyMarketMultiplier(id) {
  const day = Math.floor(Date.now() / 86400000);
  const seed = [...id].reduce((sum, char) => sum + char.charCodeAt(0), day);
  return .75 + ((seed * 37) % 55) / 100;
}

function renderMarket(state) {
  const fruits = Object.entries(FRUITS).filter(([id]) => isFruitUnlocked(state, id)).slice(0, 14);
  return `<div class="phone-section-heading"><h3>Fruit Market</h3><small>Fictional spot prices</small></div><div class="phone-card-list">${fruits.map(([id, fruit]) => {
    const multiplier = dailyMarketMultiplier(id);
    const price = Math.max(1, Math.round(fruit.value * multiplier));
    return `<article class="market-quote"><span>${fruit.icon}</span><div><strong>${escapeHTML(fruit.name)}</strong><small>${state.inventory[id] || 0} stored · demand ${fruit.demand}/5</small></div><b>${money(price)}</b><div><button type="button" data-market-buy="${id}" data-price="${price}">Buy 1</button><button type="button" data-market-sell="${id}" data-price="${price}" ${(state.inventory[id] || 0) ? '' : 'disabled'}>Sell 1</button></div></article>`;
  }).join('')}</div>`;
}

function renderBanking(state) {
  const funds = [
    ['orchardFund', 'Orchard Equipment Fund', '🌳', 'Steady, modest fictional dividends.'],
    ['marketFund', 'Market Expansion Fund', '🏘️', 'Balanced returns influenced by reputation.'],
    ['labFund', 'Fruit Research Fund', '🔬', 'Riskier returns with research bonuses.']
  ];
  const total = funds.reduce((sum, [id]) => sum + (state.investments[id] || 0), 0);
  return `<div class="phone-section-heading"><h3>Company Banking</h3><button type="button" data-collect-dividend>Collect dividends</button></div><div class="phone-bank-note">Fictional in-game company funds only · ${money(total)} invested</div><div class="phone-card-list">${funds.map(([id, name, icon, desc]) => `<article class="bank-card"><span class="contact-avatar">${icon}</span><div><strong>${escapeHTML(name)}</strong><small>${escapeHTML(desc)} · ${money(state.investments[id] || 0)} invested</small></div><button type="button" data-invest="${id}">Invest $100</button></article>`).join('')}</div>`;
}

function renderQuests(state) {
  return `<div class="phone-section-heading"><h3>Quests</h3><button type="button" data-open-milestones>Milestones</button></div><div class="phone-card-list">${state.quests.map(quest => `<article class="phone-progress-card"><strong>${quest.icon} ${escapeHTML(quest.label)}</strong><small>${Math.floor(quest.progress)} / ${quest.target}${quest.claimed ? ' · claimed' : ''}</small><div class="tiny-meter"><span style="width:${Math.min(100, quest.progress / quest.target * 100)}%"></span></div></article>`).join('')}</div>`;
}

function renderAchievements(state) {
  return `<div class="phone-section-heading"><h3>Achievements</h3><small>${Object.keys(state.achievements).length}/${ACHIEVEMENTS.length}</small></div><div class="phone-card-list">${ACHIEVEMENTS.map(item => `<article class="achievement-phone ${state.achievements[item.id] ? 'complete' : ''}"><span>${state.achievements[item.id] ? item.icon : '🔒'}</span><div><strong>${escapeHTML(item.name)}</strong><small>${escapeHTML(item.desc)} · 🪙${item.reward}</small></div></article>`).join('')}</div>`;
}

function renderResearch(state) {
  const unlocked = Object.entries(FRUITS).filter(([id]) => isFruitUnlocked(state, id));
  const active = state.research.active;
  return `<div class="phone-section-heading"><h3>Research Notebook</h3><span>🔬 ${Math.floor(state.research.points)} RP</span></div>${active ? `<article class="research-active"><strong>Experiment running</strong><p>${active.fruits.map(id => FRUITS[id].icon).join(' + ')} · ${Math.max(0, Math.ceil((active.endsAt - Date.now()) / 1000))}s</p></article>` : `<div class="research-picker"><select data-research-a>${unlocked.map(([id, fruit]) => `<option value="${id}">${fruit.icon} ${escapeHTML(fruit.name)}</option>`).join('')}</select><b>+</b><select data-research-b>${unlocked.map(([id, fruit], index) => `<option value="${id}" ${index === 1 ? 'selected' : ''}>${fruit.icon} ${escapeHTML(fruit.name)}</option>`).join('')}</select><button type="button" data-start-research>Experiment</button></div>`}<div class="phone-card-list">${state.research.notebook.length ? state.research.notebook.map(id => `<article class="research-entry"><span>${FRUITS[id].icon}</span><div><strong>${escapeHTML(FRUITS[id].name)}</strong><small>Discovered · patent income active</small></div></article>`).join('') : '<div class="phone-empty">Combine two discovered fruits. Secret pairs reveal hybrid varieties.</div>'}</div>`;
}

function renderMap(state) {
  return `<div class="phone-section-heading"><h3>World Map</h3><small>Teleport at 75%</small></div><div class="phone-map">${DISTRICTS.map(area => {
    const progress = districtProgress(state, area.id);
    const unlocked = isDistrictUnlocked(state, area);
    return `<button type="button" data-phone-teleport="${area.id}" ${unlocked && (progress >= 75 || ['stand', 'orchard'].includes(area.id)) ? '' : 'disabled'}><span>${unlocked ? area.icon : '🔒'}</span><b>${escapeHTML(area.name)}</b><small>${unlocked ? `${progress}%` : `Level ${area.unlock.level}`}</small></button>`;
  }).join('')}</div>`;
}

function renderSettings(state) {
  return `<div class="phone-section-heading"><h3>Phone Settings</h3></div>${[['sound', 'Sound effects'], ['music', 'Gentle music'], ['reducedMotion', 'Reduced motion'], ['autosave', 'Autosave']].map(([id, label]) => `<div class="phone-setting"><span>${escapeHTML(label)}</span><button type="button" role="switch" aria-checked="${Boolean(state.settings[id])}" data-phone-setting="${id}">${state.settings[id] ? 'On' : 'Off'}</button></div>`).join('')}<button class="phone-primary" type="button" data-open-settings>Full settings & save</button>`;
}

function renderSecrets(state) {
  return `<div class="phone-section-heading"><h3>Secrets</h3><button type="button" data-search-secret>Search for clue</button><small>${state.secrets.discovered.length}/${SECRETS.length}</small></div><div class="phone-card-list">${SECRETS.map(secret => {
    const found = state.secrets.discovered.includes(secret.id);
    const clue = state.secrets.clues.includes(secret.id);
    return `<article class="secret-entry ${found ? 'found' : ''}"><span>${found ? '🔓' : clue ? '🔎' : '❔'}</span><div><strong>${found ? escapeHTML(secret.name) : clue ? 'Clue discovered' : 'Unknown secret'}</strong><small>${found || clue ? escapeHTML(secret.clue) : 'Explore, research, and listen to workers.'}</small></div>${clue && !found ? `<button type="button" data-investigate-secret="${secret.id}">Investigate · $${(40 + SECRETS.indexOf(secret) * 25).toLocaleString()}</button>` : ''}</article>`;
  }).join('')}</div>`;
}

export function renderPhoneApp(state, appId) {
  return ({
    messages: renderMessages, contacts: renderContacts, orders: renderOrders, workers: renderWorkers,
    deliveries: renderDeliveries, market: renderMarket, banking: renderBanking, quests: renderQuests,
    achievements: renderAchievements, research: renderResearch, map: renderMap, settings: renderSettings,
    secrets: renderSecrets
  })[appId]?.(state) || '<div class="phone-empty">App unavailable.</div>';
}

export function phoneMarkup(state) {
  if (!state.phone.unlocked) {
    return `<div class="phone-device locked-phone"><div class="phone-notch"></div><div class="phone-lock-icon">🔒</div><h3>Fruitopia Smartphone</h3><p>Purchase the Basic Desk Phone and Fruitopia Smartphone in the office upgrade tree.</p><button class="phone-primary" type="button" data-open-office>Enter the office</button></div>`;
  }
  const active = PHONE_APPS.some(app => app.id === state.phone.activeApp) ? state.phone.activeApp : 'messages';
  const orderBadge = state.orders.filter(order => ['offered', 'accepted', 'payment'].includes(order.status)).length;
  const deliveryBadge = state.deliveries.filter(item => !item.rewarded).length;
  return `<div class="phone-device theme-${escapeHTML(state.phone.theme || 'orchard')}"><div class="phone-notch"></div><header class="phone-status"><span>${new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span><span>⭐ Rep ${Math.round(state.reputation)} · 🔬 ${Math.floor(state.research.points)} RP</span></header><nav class="phone-app-grid" aria-label="Phone applications">${PHONE_APPS.map(app => {
    const badge = app.id === 'messages' ? state.phone.unread : app.id === 'orders' ? orderBadge : app.id === 'deliveries' ? deliveryBadge : 0;
    return `<button type="button" class="${app.id === active ? 'active' : ''}" data-phone-app="${app.id}"><span>${app.icon}</span><small>${escapeHTML(app.name)}</small>${badge ? `<i>${badge}</i>` : ''}</button>`;
  }).join('')}</nav><main class="phone-screen" data-phone-screen>${renderPhoneApp(state, active)}</main><div class="phone-home-bar"></div></div>`;
}
