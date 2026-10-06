const GAME_INFO = {
  stand: {
    title: 'The Big Ask', icon: '💬', seconds: 45,
    instructions: 'Read each customer, then choose a low, fair, or bold asking price. Fair offers balance profit and happiness; bold offers can build huge streaks—or be refused.'
  },
  orchard: {
    title: 'Basket Blitz', icon: '🧺', seconds: 35,
    instructions: 'Move the basket with your pointer or arrow keys. Catch ripe fruit, and avoid rotten fruit, rocks, and bugs.'
  },
  depot: {
    title: 'Delivery Sort', icon: '📦', seconds: 40,
    instructions: 'Select a fruit crate, then choose the matching route label. Sort as many as you can before dispatch closes.'
  },
  market: {
    title: 'Market Rush', icon: '🛍️', seconds: 40,
    instructions: 'Fill each shopping list in the exact order shown. A wrong item costs time and breaks your streak.'
  },
  juice: {
    title: 'Perfect Blend', icon: '🧃', seconds: 45,
    instructions: 'Memorize the glowing fruit recipe, then reproduce it in order. Each successful blend adds another ingredient.'
  },
  tropical: {
    title: 'Coconut Splash', icon: '🥥', seconds: 38,
    instructions: 'Move along the beach to collect tropical fruit. Dodge heavy coconuts, crabs, and splashy hazards.'
  },
  frozen: {
    title: 'Berry Slide', icon: '🧊', seconds: 42,
    instructions: 'Use left and right to guide each sliding berry into its matching basket lane. Match the icon, not just the color.'
  },
  watermelon: {
    title: 'Watermelon Bowling', icon: '🎳', seconds: 42,
    instructions: 'Stop the swaying aim marker in the green zone, then roll. Better aim knocks down more fruit pins; clear all ten for a strike bonus.'
  },
  auction: {
    title: 'Fruit Auction', icon: '🔨', seconds: 46,
    instructions: 'Use the market estimate to bid on rare fruit without overpaying. Pass on overpriced lots and bank the profit from smart purchases.'
  },
  monkey: {
    title: 'Monkey Trouble', icon: '🐒', seconds: 40,
    instructions: 'Monkeys are raiding the banana grove! Tap each thief before it escapes. Fast catches save bananas and build a patrol streak.'
  },
  festival: {
    title: 'Golden Fruit Frenzy', icon: '🏆', seconds: 50,
    instructions: 'Championship rules! Catch festival fruit, dodge hazards, and complete the changing fruit callout for combo bonuses.'
  }
};

const FRUIT_SET = ['🍎', '🍌', '🍊', '🍓', '🫐', '🍉', '🍍', '🥭', '🥝', '🍑'];
const TROPICAL_SET = ['🍍', '🥭', '🥝', '🍌', '⭐'];
const HAZARDS = ['🪨', '🐛', '🪰', '🦠'];

const shuffle = values => [...values].sort(() => Math.random() - 0.5);
const choose = values => values[Math.floor(Math.random() * values.length)];
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

class Session {
  constructor(options) {
    this.options = options;
    this.container = options.container;
    this.info = GAME_INFO[options.id];
    this.score = 0;
    this.streak = 0;
    this.time = this.info.seconds;
    this.finished = false;
    this.disposers = [];
    this.timeouts = new Set();
    this.intervals = new Set();
  }

  timeout(fn, ms) {
    const id = setTimeout(() => { this.timeouts.delete(id); if (!this.finished) fn(); }, ms);
    this.timeouts.add(id);
    return id;
  }

  interval(fn, ms) {
    const id = setInterval(() => { if (!this.finished && !document.hidden) fn(); }, ms);
    this.intervals.add(id);
    return id;
  }

  listen(target, name, fn, opts) {
    target.addEventListener(name, fn, opts);
    this.disposers.push(() => target.removeEventListener(name, fn, opts));
  }

  shell(arenaClass = '') {
    this.container.innerHTML = `
      <div class="minigame-intro"><strong>${this.info.icon} How to play:</strong> ${this.info.instructions}</div>
      <div class="minigame-hud">
        <div class="hud-stat"><small>Score</small><strong data-hud="score">0</strong></div>
        <div class="hud-stat"><small>Time</small><strong data-hud="time">${this.time}s</strong></div>
        <div class="hud-stat"><small>Streak</small><strong data-hud="streak">0×</strong></div>
      </div>
      <div class="minigame-arena ${arenaClass}" data-arena></div>
      <div class="game-controls" data-controls></div>`;
    this.arena = this.container.querySelector('[data-arena]');
    this.controls = this.container.querySelector('[data-controls]');
    this.scoreEl = this.container.querySelector('[data-hud="score"]');
    this.timeEl = this.container.querySelector('[data-hud="time"]');
    this.streakEl = this.container.querySelector('[data-hud="streak"]');
    this.interval(() => {
      this.time -= 1;
      this.timeEl.textContent = `${this.time}s`;
      if (this.time <= 0) this.finish();
      else if (this.time <= 3) this.options.onSound?.('countdown');
    }, 1000);
  }

  points(amount, success = true) {
    this.score = Math.max(0, this.score + amount);
    this.streak = success ? this.streak + 1 : 0;
    this.scoreEl.textContent = Math.floor(this.score);
    this.streakEl.textContent = `${this.streak}×`;
    this.options.onSound?.(success ? 'success' : 'fail');
  }

  finish() {
    if (this.finished) return;
    this.finished = true;
    const score = Math.max(0, Math.floor(this.score));
    const rewards = {
      cash: Math.max(25, Math.floor(score * 1.9 + 20)),
      xp: Math.max(15, Math.floor(score * .7 + 12)),
      coins: score >= 220 ? 3 : score >= 110 ? 2 : score >= 45 ? 1 : 0
    };
    this.cleanup(false);
    this.container.innerHTML = `
      <div class="result-card">
        <span class="result-icon">${score >= 160 ? '🏆' : score >= 70 ? '🌟' : '🍎'}</span>
        <h3>${score >= 160 ? 'Fruitastic!' : score >= 70 ? 'Nicely grown!' : 'Good practice!'}</h3>
        <p>Final score: <strong>${score}</strong></p>
        <div class="reward-line"><span class="reward-pill">💵 $${rewards.cash}</span><span class="reward-pill">⭐ ${rewards.xp} XP</span><span class="reward-pill">🪙 ${rewards.coins}</span></div>
        <div class="result-actions"><button class="primary-button" type="button" data-collect>Collect rewards</button><button type="button" data-replay disabled>Replay</button></div>
      </div>`;
    const collect = this.container.querySelector('[data-collect]');
    const replay = this.container.querySelector('[data-replay]');
    let collected = false;
    collect.addEventListener('click', () => {
      if (collected) return;
      collected = true;
      collect.disabled = true;
      collect.textContent = 'Collected ✓';
      this.options.onFinish({ score, rewards });
      replay.disabled = false;
    }, { once: true });
    replay.addEventListener('click', () => {
      if (!collected) return;
      this.options.onReplay?.();
    }, { once: true });
  }

  cleanup(markFinished = true) {
    if (markFinished) this.finished = true;
    for (const id of this.timeouts) clearTimeout(id);
    for (const id of this.intervals) clearInterval(id);
    for (const dispose of this.disposers) dispose();
    this.timeouts.clear();
    this.intervals.clear();
    this.disposers = [];
  }
}

function bigAsk(session) {
  session.shell('ask-game');
  session.arena.outerHTML = '<div class="ask-stage" data-arena></div>';
  session.arena = session.container.querySelector('[data-arena]');
  const moods = [
    ['😊', 'cheerful', 1.12], ['🙂', 'relaxed', 1], ['😐', 'careful', .88], ['😤', 'impatient', .78], ['🤑', 'generous', 1.35], ['🧐', 'picky', .74]
  ];
  const next = () => {
    if (session.finished) return;
    const [face, mood, moodFactor] = choose(moods);
    const fruit = choose(FRUIT_SET.slice(0, 7));
    const quantity = 1 + Math.floor(Math.random() * 5);
    const quality = .8 + Math.random() * .45;
    const reputation = 1 + Math.min(.28, session.streak * .025 + (session.options.reputation || 0) * .0015);
    const fair = Math.round(quantity * 8 * quality * moodFactor * reputation);
    const patience = mood === 'impatient' ? 'low' : mood === 'relaxed' ? 'high' : 'medium';
    session.arena.innerHTML = `<div class="ask-customer"><span class="ask-face">${face}</span><div class="speech"><strong>“I’d like ${quantity} ${fruit}, please!”</strong><br><small>${mood} mood · ${quality > 1.08 ? 'premium' : quality < .92 ? 'everyday' : 'fresh'} quality · ${patience} patience</small></div></div>`;
    const offers = [
      ['friendly', Math.max(2, Math.round(fair * .62)), .99],
      ['fair', fair, clamp(.83 + (moodFactor - 1) * .25, .66, .96)],
      ['bold', Math.round(fair * 1.55), clamp(.43 + (moodFactor - 1) * .34 + session.streak * .015, .18, .72)]
    ];
    session.controls.innerHTML = offers.map(([kind, price]) => `<button type="button" class="${kind}" data-kind="${kind}" data-price="${price}"><small>${kind.toUpperCase()}</small><br>$${price}</button>`).join('') + (session.options.customCounter ? `<label class="custom-offer"><span>Custom counteroffer</span><input type="number" min="1" max="${fair * 3}" value="${fair}" data-custom-price><button type="button" data-kind="custom">Ask</button></label>` : '');
    const resolveOffer = (kind, price, chance) => {
      session.controls.querySelectorAll('button, input').forEach(button => { button.disabled = true; });
      const sold = Math.random() < chance;
      if (sold) {
        const bonus = kind === 'bold' || kind === 'custom' ? 10 : kind === 'fair' ? 5 : 1;
        session.points(price + bonus + session.streak * 2, true);
        session.arena.querySelector('.speech').innerHTML = `<strong>${kind === 'bold' || kind === 'custom' ? '“A splurge—but worth it!”' : '“Delicious! Thank you!”'}</strong><br><small>Sale made for $${price}</small>`;
      } else {
        session.points(-8, false);
        session.arena.querySelector('.ask-face').textContent = '🙅';
        session.arena.querySelector('.speech').innerHTML = '<strong>“That is a bit too rich for me.”</strong><br><small>No sale this time</small>';
      }
      session.timeout(next, 650);
    };
    for (const [kind, price, chance] of offers) {
      session.controls.querySelector(`[data-kind="${kind}"]`).addEventListener('click', () => {
        resolveOffer(kind, price, chance);
      }, { once: true });
    }
    const custom = session.controls.querySelector('[data-kind="custom"]');
    custom?.addEventListener('click', () => {
      const price = clamp(Number(session.controls.querySelector('[data-custom-price]').value) || fair, 1, fair * 3);
      const ratio = price / Math.max(1, fair);
      const chance = clamp(1.18 - ratio * .45 + (moodFactor - 1) * .25, .08, .96);
      resolveOffer('custom', Math.round(price), chance);
    }, { once: true });
  };
  next();
}

function fallingCatch(session, tropical = false, festival = false) {
  session.shell(tropical ? 'tropical-game' : festival ? 'festival-game' : 'basket-game');
  session.arena.innerHTML = '<div class="catcher" data-catcher>🧺</div>' + (festival ? '<div class="market-order" data-callout style="position:absolute;left:12px;top:12px;z-index:9">Catch 🍎</div>' : '');
  const catcher = session.arena.querySelector('[data-catcher]');
  let x = 50;
  let callout = '🍎';
  const setX = next => { x = clamp(next, 7, 93); catcher.style.left = `${x}%`; };
  setX(x);
  const move = event => {
    const rect = session.arena.getBoundingClientRect();
    setX(((event.clientX - rect.left) / rect.width) * 100);
  };
  session.listen(session.arena, 'pointermove', move);
  session.listen(window, 'keydown', event => {
    if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') { event.preventDefault(); setX(x - 9); }
    if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') { event.preventDefault(); setX(x + 9); }
  });
  if (festival) {
    session.interval(() => {
      callout = choose(['🍎', '🍊', '🍓', '🫐', '🍍']);
      const node = session.arena.querySelector('[data-callout]');
      if (node) node.textContent = `Catch ${callout}`;
    }, 4800);
  }
  const spawn = () => {
    const isHazard = Math.random() < (tropical ? .3 : festival ? .26 : .23);
    let icon;
    if (tropical && isHazard) icon = choose(['🥥', '🦀', '🌊']);
    else if (festival && isHazard) icon = choose(['🎈', '🐛', '🪨']);
    else if (isHazard) icon = choose(HAZARDS);
    else icon = choose(tropical ? TROPICAL_SET : festival ? ['🍎', '🍊', '🍓', '🫐', '🍍', '🍏'] : FRUIT_SET);
    const itemX = 5 + Math.random() * 90;
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'falling-item';
    item.setAttribute('aria-label', isHazard ? `Avoid ${icon}` : `Catch ${icon}`);
    item.textContent = icon;
    item.style.left = `${itemX}%`;
    item.style.top = '-42px';
    item.style.animationDuration = `${2.2 + Math.random() * 1.2}s`;
    const catchNow = () => {
      if (!item.isConnected) return;
      const hit = Math.abs(itemX - x) < 10;
      if (hit) {
        if (isHazard) session.points(-10, false);
        else {
          const special = festival && icon === callout;
          session.points((special ? 18 : 7) + Math.min(8, session.streak), true);
        }
      }
      item.remove();
    };
    item.addEventListener('animationend', catchNow, { once: true });
    item.addEventListener('click', () => { setX(itemX); catchNow(); }, { once: true });
    session.arena.append(item);
  };
  session.interval(spawn, festival ? 480 : tropical ? 600 : 650);
  spawn();
}

function deliverySort(session) {
  session.shell('sort-game');
  const routes = [
    { name: 'Orchard', icon: '🌳', fruits: ['🍎', '🍑'] },
    { name: 'Beach', icon: '🏝️', fruits: ['🍌', '🍍', '🥭'] },
    { name: 'Market', icon: '🏘️', fruits: ['🍊', '🍓', '🫐'] }
  ];
  session.arena.innerHTML = `<div class="sort-grid">${routes.map((route, i) => `<button class="sort-bin" type="button" data-bin="${i}"><span>${route.icon}<br><strong>${route.name}</strong><br><small>${route.fruits.join(' ')}</small></span></button>`).join('')}</div><div class="game-controls" data-crates></div>`;
  const crates = session.arena.querySelector('[data-crates]');
  let selected = null;
  const refill = () => {
    const options = shuffle(routes.flatMap((route, routeIndex) => route.fruits.map(icon => ({ icon, routeIndex })))).slice(0, 4);
    crates.innerHTML = options.map((item, i) => `<button class="sort-crate" type="button" data-crate="${i}" data-route="${item.routeIndex}" aria-label="Select ${item.icon} crate">📦 ${item.icon}</button>`).join('');
    crates.querySelectorAll('[data-crate]').forEach(button => button.addEventListener('click', () => {
      crates.querySelectorAll('button').forEach(node => node.classList.remove('selected'));
      button.classList.add('selected');
      selected = button;
    }));
  };
  session.arena.querySelectorAll('[data-bin]').forEach(bin => bin.addEventListener('click', () => {
    if (!selected) return;
    if (selected.dataset.route === bin.dataset.bin) {
      session.points(12 + Math.min(8, session.streak), true);
      selected.remove();
      selected = null;
      if (!crates.children.length) refill();
    } else {
      session.points(-5, false);
      selected.classList.remove('selected');
      selected = null;
    }
  }));
  refill();
}

function marketRush(session) {
  session.shell('market-game');
  const products = FRUIT_SET.slice(0, 8);
  let order = [];
  let index = 0;
  session.arena.innerHTML = '<div class="market-list"><div class="market-order" data-order></div><p data-market-note>Tap the list in order!</p><div class="market-products" data-products></div></div>';
  const orderEl = session.arena.querySelector('[data-order]');
  const note = session.arena.querySelector('[data-market-note]');
  const buttons = session.arena.querySelector('[data-products]');
  buttons.innerHTML = products.map(icon => `<button type="button" data-product="${icon}" aria-label="Add ${icon}">${icon}</button>`).join('');
  const newOrder = () => {
    index = 0;
    order = Array.from({ length: Math.min(5, 2 + Math.floor(session.score / 70)) }, () => choose(products));
    orderEl.innerHTML = order.map((icon, i) => `<span data-order-item="${i}">${icon}</span>`).join(' ');
    note.textContent = 'Tap the list in order!';
  };
  buttons.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
    if (button.dataset.product === order[index]) {
      orderEl.querySelector(`[data-order-item="${index}"]`).style.opacity = '.28';
      index += 1;
      if (index >= order.length) {
        session.points(10 * order.length + session.streak * 2, true);
        note.textContent = 'Order complete! 🎉';
        session.timeout(newOrder, 450);
      }
    } else {
      session.points(-6, false);
      note.textContent = 'Wrong item—start this list again!';
      session.timeout(newOrder, 350);
    }
  }));
  newOrder();
}

function perfectBlend(session) {
  session.shell('blend-game');
  const fruits = FRUIT_SET.slice(0, 7);
  let sequence = [];
  let entered = [];
  let accepting = false;
  session.arena.innerHTML = '<div class="sequence" data-sequence></div><p data-blend-note style="text-align:center">Watch the recipe…</p><div class="blend-buttons" data-blend-buttons></div>';
  const sequenceEl = session.arena.querySelector('[data-sequence]');
  const note = session.arena.querySelector('[data-blend-note]');
  const buttons = session.arena.querySelector('[data-blend-buttons]');
  buttons.innerHTML = fruits.map(icon => `<button type="button" data-fruit="${icon}" aria-label="Add ${icon}">${icon}</button>`).join('');
  const showRound = () => {
    accepting = false;
    entered = [];
    sequence.push(choose(fruits));
    sequenceEl.textContent = sequence.join(' ');
    note.textContent = `Memorize ${sequence.length} ingredient${sequence.length > 1 ? 's' : ''}…`;
    buttons.querySelectorAll('button').forEach(button => { button.disabled = true; });
    session.timeout(() => {
      sequenceEl.textContent = Array(sequence.length).fill('❔').join(' ');
      note.textContent = 'Now blend it!';
      buttons.querySelectorAll('button').forEach(button => { button.disabled = false; });
      accepting = true;
    }, 1100 + sequence.length * 240);
  };
  buttons.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
    if (!accepting) return;
    entered.push(button.dataset.fruit);
    sequenceEl.textContent = entered.join(' ') + ' ' + Array(sequence.length - entered.length).fill('❔').join(' ');
    const position = entered.length - 1;
    if (entered[position] !== sequence[position]) {
      accepting = false;
      session.points(-8, false);
      note.textContent = 'Oops—new recipe!';
      sequence = [];
      session.timeout(showRound, 650);
    } else if (entered.length === sequence.length) {
      accepting = false;
      session.points(sequence.length * 15, true);
      note.textContent = 'Perfect blend! ✨';
      session.timeout(showRound, 700);
    }
  }));
  showRound();
}

function berrySlide(session) {
  session.shell('berry-game');
  const berries = ['🫐', '🍓', '🧊'];
  session.arena.innerHTML = `<div class="ice-lanes">${berries.map(icon => `<div class="ice-lane"></div>`).join('')}</div>${berries.map((icon, i) => `<div class="lane-basket" style="left:${(i + .5) * 33.333}%">🧺<small style="position:absolute;left:14px;top:15px;font-size:19px">${icon}</small></div>`).join('')}<div class="lane-berry" data-berry></div>`;
  const berry = session.arena.querySelector('[data-berry]');
  let lane = 1;
  let target = 0;
  let y = 0;
  const newBerry = () => {
    target = Math.floor(Math.random() * 3);
    lane = 1;
    y = 0;
    berry.textContent = berries[target];
    berry.style.left = '50%';
    berry.style.top = '10px';
  };
  const move = direction => {
    lane = clamp(lane + direction, 0, 2);
    berry.style.left = `${(lane + .5) * 33.333}%`;
  };
  session.controls.innerHTML = '<button type="button" data-slide="-1">◀ Left</button><button type="button" data-slide="1">Right ▶</button>';
  session.controls.querySelectorAll('[data-slide]').forEach(button => button.addEventListener('click', () => move(Number(button.dataset.slide))));
  session.listen(window, 'keydown', event => {
    if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') { event.preventDefault(); move(-1); }
    if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') { event.preventDefault(); move(1); }
  });
  session.interval(() => {
    y += 4.2;
    berry.style.top = `${y}%`;
    if (y >= 80) {
      session.points(lane === target ? 18 + Math.min(session.streak * 2, 12) : -7, lane === target);
      newBerry();
    }
  }, 150);
  newBerry();
}

function watermelonBowling(session) {
  session.shell('bowling-game');
  let aim = 0;
  let direction = 1;
  let pins = 10;
  let frame = 1;
  let rolling = false;
  session.arena.innerHTML = `<div class="bowling-lane"><div class="fruit-pins" data-pins>${Array.from({ length: 10 }, (_, i) => `<span data-pin="${i}">🍉</span>`).join('')}</div><div class="bowling-ball" data-ball>🍊</div></div><div class="aim-track"><span class="aim-sweet">SWEET SPOT</span><span class="aim-marker" data-aim></span></div><p class="game-note" data-bowl-note>Frame 1 · 10 pins standing</p>`;
  session.controls.innerHTML = '<button class="primary-button" type="button" data-roll>🎳 Roll (Space)</button>';
  const marker = session.arena.querySelector('[data-aim]');
  const ball = session.arena.querySelector('[data-ball]');
  const note = session.arena.querySelector('[data-bowl-note]');
  const rollButton = session.controls.querySelector('[data-roll]');
  const resetPins = () => {
    pins = 10;
    session.arena.querySelectorAll('[data-pin]').forEach(pin => pin.classList.remove('down'));
  };
  const roll = () => {
    if (rolling || session.finished) return;
    rolling = true;
    rollButton.disabled = true;
    const accuracy = 1 - Math.abs(aim - 50) / 50;
    const knocked = Math.min(pins, Math.max(1, Math.round(accuracy * 7 + Math.random() * 3)));
    ball.classList.add('rolling');
    session.timeout(() => {
      const standing = [...session.arena.querySelectorAll('[data-pin]:not(.down)')];
      shuffle(standing).slice(0, knocked).forEach(pin => pin.classList.add('down'));
      pins -= knocked;
      const strike = knocked === 10;
      session.points(knocked * 8 + (strike ? 35 : pins === 0 ? 18 : 0), true);
      note.textContent = `${strike ? 'STRIKE! ' : ''}${knocked} pins knocked down · ${pins} standing`;
      ball.classList.remove('rolling');
      session.timeout(() => {
        frame += 1;
        if (pins === 0 || frame % 3 === 0) resetPins();
        note.textContent = `Frame ${frame} · ${pins} pins standing`;
        rolling = false;
        rollButton.disabled = false;
      }, 650);
    }, 650);
  };
  session.interval(() => {
    if (rolling) return;
    aim += direction * (2.2 + session.score / 500);
    if (aim >= 100 || aim <= 0) direction *= -1;
    aim = clamp(aim, 0, 100);
    marker.style.left = `${aim}%`;
  }, 32);
  rollButton.addEventListener('click', roll);
  session.listen(window, 'keydown', event => {
    if (event.code === 'Space') { event.preventDefault(); roll(); }
  });
}

function fruitAuction(session) {
  session.shell('auction-game');
  const lots = [
    ['🍏', 'Golden Apple', 45], ['🌙', 'Moon Melon', 80], ['🍒', 'Crystal Cherry', 62],
    ['🥭', 'Fire Mango', 72], ['🍇', 'Galaxy Grape', 96], ['🌈', 'Rainbow Peach', 115]
  ];
  let current;
  let bid = 0;
  let rivalTimer;
  session.arena.innerHTML = '<div class="auction-stage"><div class="auction-lot" data-lot></div><div class="auction-board" data-auction-board></div><p data-auction-note>Study the estimate, then bid or pass.</p></div>';
  session.controls.innerHTML = '<button type="button" data-auction="bid">🔨 Bid +10%</button><button type="button" data-auction="buy" class="primary-button">Buy lot</button><button type="button" data-auction="pass">Pass</button>';
  const lotEl = session.arena.querySelector('[data-lot]');
  const board = session.arena.querySelector('[data-auction-board]');
  const note = session.arena.querySelector('[data-auction-note]');
  const update = () => { board.innerHTML = `<strong>Current bid $${bid}</strong><small>Estimated value $${current[2]}</small>`; };
  const nextLot = () => {
    current = choose(lots);
    bid = Math.max(8, Math.round(current[2] * (.35 + Math.random() * .42)));
    lotEl.innerHTML = `<span>${current[0]}</span><strong>${current[1]}</strong>`;
    note.textContent = 'The rival bidder is watching closely…';
    update();
    clearTimeout(rivalTimer);
    rivalTimer = session.timeout(() => {
      if (Math.random() < .68) {
        bid = Math.round(bid * 1.1);
        update();
        note.textContent = 'A rival raised the bid!';
      }
    }, 1500);
  };
  session.controls.querySelector('[data-auction="bid"]').addEventListener('click', () => {
    bid = Math.round(bid * 1.1);
    update();
    note.textContent = bid > current[2] ? 'Careful: you are above the estimate.' : 'Your bid leads—for now.';
  });
  session.controls.querySelector('[data-auction="buy"]').addEventListener('click', () => {
    const profit = current[2] - bid;
    session.points(profit > 0 ? profit + 12 : Math.max(-20, profit), profit > 0);
    note.textContent = profit > 0 ? `Smart buy! Estimated profit: $${profit}.` : `Overpaid by $${Math.abs(profit)}.`;
    session.timeout(nextLot, 600);
  });
  session.controls.querySelector('[data-auction="pass"]').addEventListener('click', () => {
    session.points(bid > current[2] * .9 ? 8 : -2, bid > current[2] * .9);
    note.textContent = bid > current[2] * .9 ? 'Good restraint!' : 'That bargain got away.';
    session.timeout(nextLot, 450);
  });
  nextLot();
}

function monkeyTrouble(session) {
  session.shell('monkey-game');
  let bananas = 20;
  session.arena.innerHTML = '<div class="jungle-canopy"></div><div class="banana-bank" data-bank>🍌 Bananas safe: 20</div>';
  const bank = session.arena.querySelector('[data-bank]');
  const spawn = () => {
    if (session.finished) return;
    const monkey = document.createElement('button');
    monkey.type = 'button';
    monkey.className = 'monkey-thief';
    monkey.innerHTML = '🐒<small>🍌</small>';
    monkey.setAttribute('aria-label', 'Stop banana thief');
    monkey.style.left = `${5 + Math.random() * 82}%`;
    monkey.style.top = `${12 + Math.random() * 62}%`;
    let caught = false;
    monkey.addEventListener('click', () => {
      if (caught) return;
      caught = true;
      session.points(10 + Math.min(12, session.streak), true);
      monkey.textContent = '💨';
      session.timeout(() => monkey.remove(), 180);
    }, { once: true });
    session.arena.append(monkey);
    session.timeout(() => {
      if (caught || !monkey.isConnected) return;
      bananas = Math.max(0, bananas - 1);
      bank.textContent = `🍌 Bananas safe: ${bananas}`;
      session.points(-6, false);
      monkey.remove();
    }, Math.max(700, 1500 - session.score * 1.8));
  };
  session.interval(spawn, 720);
  spawn();
}

export function startMinigame(options) {
  const session = new Session(options);
  switch (options.id) {
    case 'stand': bigAsk(session); break;
    case 'orchard': fallingCatch(session); break;
    case 'depot': deliverySort(session); break;
    case 'market': marketRush(session); break;
    case 'juice': perfectBlend(session); break;
    case 'tropical': fallingCatch(session, true, false); break;
    case 'frozen': berrySlide(session); break;
    case 'watermelon': watermelonBowling(session); break;
    case 'auction': fruitAuction(session); break;
    case 'monkey': monkeyTrouble(session); break;
    case 'festival': fallingCatch(session, false, true); break;
    default: throw new Error(`Unknown minigame: ${options.id}`);
  }
  const stop = () => session.cleanup();
  stop.finish = () => session.finish();
  return stop;
}

export { GAME_INFO };
