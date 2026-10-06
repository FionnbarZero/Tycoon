# Fruitopia Tycoon

Fruitopia Tycoon is a complete, buildless browser management game. Start with $1, six ripe apple trees, a roadside stand, and a wooden office; grow into a fruit corporation with workers, factories, delivery fleets, negotiated phone orders, hybrid research, entertainment, secrets, and seasonal prestige.

## Run

No dependency install or backend is required.

```bash
python3 -m http.server 8000
```

Open <http://localhost:8000>. Progress is stored locally in a versioned `localStorage` save.

## Controls

- Move in the world or office with WASD, arrow keys, touch controls, click/tap-to-move, or a connected gamepad.
- Use `−` / `+` to zoom and **Pan** to drag the world map.
- Press `O` for the office and `P` for the smartphone.
- Click ripe trees to harvest; click growing trees to water, fertilize, or treat them.
- Tab navigates every control, Enter/Space activates it, and Escape closes dialogs.

## Included systems

- Eight explorable, visually developing districts with 8 improvements each, teleporters, completion rewards, workers, and district minigames
- 86 three-stage company buildings across starter, production, farming, worker, business, transport, entertainment, secret, and late-game categories
- A walkable five-level office, 44-upgrade tree, 17 interactive objects, and queued worker meetings with consequential choices
- 14 named workers with roles, personality, skill, happiness, energy, loyalty, equipment, assignments, dialogue, messages, and memories
- An unlockable 13-app smartphone with contacts, messages, negotiated orders, single-collection fictional payments, worker management, market, investments, delivery tracking, research, maps, and secrets
- 28 fruits including 11 research hybrids; 21 recipes; ten timed production businesses; separate basket and warehouse capacity
- Twelve purchasable vehicles and automatic routes spanning bicycles, scooters, refrigerated trucks, trains, boats, planes, drones, helicopters, and rockets
- 20 economy-changing random events and 11 fully playable, replayable minigames
- Quests, achievements, automatic sales, customer requests, tips, tickets, market combos, patents, advertising, investments, hidden crates, and offline progress
- Versioned v5 save migration, corruption repair, duplicate-reward guards, four-hour offline cap, and **Start a New Season** prestige with nine permanent Golden Seed upgrades and six evolution ages
- Responsive desktop/tablet/mobile UI, keyboard/gamepad/touch support, focus-trapped dialogs, optional Web Audio, and reduced-motion support

## Verify and build

```bash
npm run check
npm test
npm run build
```

The Node suite checks configuration coverage, economy safety, both storage types, all ten production lines, all 86 purchasable buildings, office/workers, orders, research, secrets, migration, offline progress, and prestige.

For the interaction and responsive browser suite, start the local server and a Chrome debugging session, then run:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --use-angle=swiftshader --enable-unsafe-swiftshader \
  --remote-debugging-port=9228 --user-data-dir=/tmp/fruitopia-browser-test \
  'http://127.0.0.1:8000/?testMode=1'

npm run test:browser
```

The browser test covers fresh progression, keyboard movement, office/phone unlocks, worker conversations, orders/payments, production, district progression, all 11 minigames, all 20 events, deliveries, hybrid research, save/reload, teleporting, reset cancellation, prestige, accessibility focus/Escape behavior, desktop/tablet/mobile sizing, and console errors. `npm run build` creates the deployable static site in `dist/`.
