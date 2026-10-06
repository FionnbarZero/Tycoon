import { OFFICE_UPGRADES, WORKER_CHARACTERS, getOfficeLevel } from './expansion-config.js';
import { averageWorkerHappiness } from './expansion-core.js';

const escapeHTML = value => String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));

const OFFICE_OBJECTS = [
  ['desk', 'Player desk', '🪵', null, 20, 54, 'Open the office upgrade tree'],
  ['chair', 'Chair', '🪑', 'comfortable_chair', 31, 58, 'Rest workers and review morale'],
  ['filing', 'Filing cabinet', '🗃️', 'filing_cabinet', 10, 28, 'Review contracts and secret clues'],
  ['map', 'Wall map', '🗺️', 'wall_map', 41, 18, 'Open the teleport map'],
  ['meeting', 'Meeting table', '🤝', 'meeting_table', 57, 62, 'Invite a worker conversation'],
  ['employee', 'Employee board', '🪧', 'employee_board', 76, 22, 'Open the full worker roster'],
  ['trophies', 'Trophy cabinet', '🏆', 'trophy_cabinet', 86, 28, 'Open achievements'],
  ['safe', 'Company safe', '🔐', 'company_safe', 9, 73, 'Collect saved office income'],
  ['charger', 'Phone charger', '🔌', 'smartphone', 39, 70, 'Open the Fruitopia Smartphone'],
  ['computer', 'Computer', '🖥️', 'computer', 25, 23, 'Open research and company reports'],
  ['accountant', 'Accountant desk', '🧮', 'accountant', 72, 67, 'Review fictional company investments'],
  ['assistant', 'Assistant desk', '🛎️', 'hiring_board', 84, 61, 'Coordinate office visitors'],
  ['research', 'Research board', '🧬', 'research_board', 57, 19, 'Open the hybrid-fruit notebook'],
  ['break', 'Break area', '☕', 'break_area', 12, 48, 'Restore worker energy'],
  ['conference', 'Conference room', '🗣️', 'conference_room', 69, 42, 'Hold larger company meetings'],
  ['executive', 'Executive office', '🛋️', 'executive_office', 88, 45, 'Review endgame company decisions'],
  ['elevator', 'Elevator', '🛗', 'second_floor', 94, 73, 'View the next office level']
];

export function officeMarkup(state) {
  const level = getOfficeLevel(state);
  const upgrades = new Set(state.office.upgrades);
  const activeId = state.office.activeVisitor?.workerId;
  const queue = state.office.queue || [];
  const floorClass = `office-level-${level.level}`;
  const objects = OFFICE_OBJECTS.map(([id, name, icon, required, x, y, description]) => {
    const unlocked = !required || upgrades.has(required);
    return `<button class="office-object ${unlocked ? '' : 'locked'}" type="button" data-office-object="${id}" style="left:${x}%;top:${y}%" aria-label="${escapeHTML(name)}. ${unlocked ? escapeHTML(description) : `Requires ${escapeHTML(OFFICE_UPGRADES.find(item => item.id === required)?.name || required)}`}"><span>${unlocked ? icon : '🔒'}</span><small>${escapeHTML(name)}</small></button>`;
  }).join('');
  const visitors = queue.slice(0, 4).map((workerId, index) => {
    const worker = WORKER_CHARACTERS.find(item => item.id === workerId);
    return worker ? `<button class="office-worker queued" type="button" data-office-worker="${workerId}" style="--queue:${index};left:${88 - index * 7}%;top:${84 - index * 2}%"><span>${worker.avatar}</span><small>${escapeHTML(worker.name)}</small></button>` : '';
  }).join('');
  const active = activeId ? WORKER_CHARACTERS.find(item => item.id === activeId) : null;
  return `<div class="office-layout"><section class="office-scene ${floorClass}" data-office-scene>
    <div class="office-wall-art">${level.level >= 5 ? '🌌 FRUITOPIA COMMAND' : level.level >= 4 ? 'FRUITOPIA CORPORATION' : level.level >= 3 ? 'FRUITOPIA HQ' : level.level >= 2 ? 'FRUITOPIA OFFICE' : 'THE LITTLE FRUIT OFFICE'}</div>
    <div class="office-window"><span>${level.level >= 4 ? '🏙️' : level.level >= 3 ? '🌄' : '🌳'}</span></div>
    <div class="office-door">🚪<small>EXIT</small></div>
    ${objects}${visitors}${active ? `<button class="office-worker active visiting" type="button" data-office-worker="${active.id}" style="left:56%;top:47%"><span>${active.avatar}</span><small>${escapeHTML(active.name)}</small><i>💬</i></button>` : ''}
    <div class="office-player" data-office-player style="left:${state.office.player.x}%;top:${state.office.player.y}%"><span>🧑‍🌾</span><small>You</small></div>
    <button class="office-exit" type="button" data-office-exit>Exit to world</button>
  </section><aside class="office-sidebar"><div class="office-level-card"><span>${level.icon}</span><div><small>Office level ${level.level}</small><strong>${escapeHTML(level.name)}</strong><p>${state.office.upgrades.length}/44 office upgrades</p></div></div>
    <div class="office-stat-grid"><span><b>${averageWorkerHappiness(state)}%</b><small>Happiness</small></span><span><b>${WORKER_CHARACTERS.filter(worker => state.workerRoster[worker.id].hired).length}</b><small>Workers</small></span><span><b>${queue.length}</b><small>Waiting</small></span></div>
    <button class="primary-button" type="button" data-office-upgrades>Office upgrade tree</button>
    <button class="secondary-button" type="button" data-invite-worker>Invite a worker</button>
    <div class="office-tip"><strong>Walk around</strong><p>Use WASD, arrow keys, or click the office floor. Select furniture or approach a worker to interact.</p></div>
  </aside></div>`;
}

export function officeUpgradeMarkup(state, activeCategory = 'Communication') {
  const categories = [...new Set(OFFICE_UPGRADES.map(upgrade => upgrade.category))];
  const owned = new Set(state.office.upgrades);
  return `<div class="tabs office-tabs">${categories.map(category => `<button type="button" data-office-category="${escapeHTML(category)}" class="${category === activeCategory ? 'active' : ''}">${escapeHTML(category)}</button>`).join('')}</div><div class="office-tree">${OFFICE_UPGRADES.filter(upgrade => upgrade.category === activeCategory).map(upgrade => {
    const purchased = owned.has(upgrade.id);
    const prerequisite = upgrade.requires ? OFFICE_UPGRADES.find(item => item.id === upgrade.requires) : null;
    const available = !purchased && state.level >= upgrade.level && (!upgrade.requires || owned.has(upgrade.requires));
    return `<article class="office-upgrade-node ${purchased ? 'purchased' : available ? 'available' : 'locked'}"><div class="office-node-icon">${purchased || available ? upgrade.icon : '🔒'}</div><div><h3>${escapeHTML(upgrade.name)}</h3><p>${escapeHTML(upgrade.description)}</p><div class="card-meta"><span class="tag cash">💵 $${upgrade.cash.toLocaleString()}</span>${upgrade.coins ? `<span class="tag coin">🪙 ${upgrade.coins}</span>` : ''}<span class="tag">Empire Lv ${upgrade.level}</span>${prerequisite && !owned.has(prerequisite.id) ? `<span class="tag">Needs ${escapeHTML(prerequisite.name)}</span>` : ''}</div><button class="card-button ${purchased ? 'purchased' : ''}" type="button" data-office-upgrade="${upgrade.id}" ${purchased || !available ? 'disabled' : ''}>${purchased ? 'Installed ✓' : available ? 'Purchase upgrade' : 'Locked'}</button></div></article>`;
  }).join('')}</div>`;
}

export function conversationMarkup(state, visit) {
  const worker = WORKER_CHARACTERS.find(item => item.id === visit.workerId);
  const roster = state.workerRoster[visit.workerId];
  return `<div class="conversation-scene"><div class="conversation-person"><span>${worker.avatar}</span><h3>${escapeHTML(worker.name)}</h3><small>${escapeHTML(worker.role)} · ${escapeHTML(worker.personality)}</small><div class="worker-vitals"><span>Skill ${roster.skill}</span><span>😊 ${Math.round(roster.happiness)}</span><span>⚡ ${Math.round(roster.energy)}</span><span>💛 ${Math.round(roster.loyalty)}</span></div></div><div class="conversation-bubble"><p>${escapeHTML(visit.text)}</p><div class="dialogue-choices">${visit.choices.map(choice => `<button type="button" data-worker-choice="${choice.id}">${escapeHTML(choice.label)}</button>`).join('')}<button type="button" class="secondary-button" data-worker-choice="later">Ask ${escapeHTML(worker.name)} to return later</button></div></div></div>`;
}

export { OFFICE_OBJECTS };
