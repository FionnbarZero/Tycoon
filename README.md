# Fruitopia Tycoon

Fruitopia Tycoon is a dependency-free, responsive browser game about growing six apple trees and a $1 roadside stand into a magical fruit corporation. It combines a walkable canvas world with orchard care, crafting, districts, construction, workers, recruiting, research, automatic deliveries, minigames, secrets, quests, events, office management, and seasonal prestige.

## Play locally

```bash
python3 -m http.server 8080
```

Open `http://127.0.0.1:8080` in a modern browser. Progress is stored locally under the version-9 Fruitopia save key; older saves migrate automatically and no account or backend is required.

## Controls

- `WASD` or arrow keys: walk in the world or office
- Click or tap: walk to a destination or interact
- Touch direction pad: mobile movement
- Connected gamepad left stick: world movement
- Mouse wheel or `+` / `−` controls: zoom
- Drag the world: pan
- Find Me: recenter on the player
- `Enter` or `Space`: activate focused controls
- `Escape`: close dialogs

Reduced motion, sound, music, and autosave are available under More → Settings.

## Game systems

- Eight developing districts with 64 working improvements, hidden crates, teleporters, workers, completion bonuses, and district minigames
- 28 fruit varieties, five quality grades, renewable cared-for trees, 21 recipes, and separate basket/product storage
- 11 timed hybrid experiments with safe failure recovery, patents, research notes, and renewable hybrid trees
- 106 unique company buildings across 11 categories, each with three upgrade levels and live company effects
- Ten fruit laboratories and ten timed production businesses
- Seven delivery tiers, 12 vehicles, and 18 automatic routes with cargo, product, subscription, reputation, streak, subscriber, and one-time payment rules
- 14 named workers with assignments, energy, happiness, loyalty, equipment, skills, ranks, memories, conversations, and recruiting files
- Job advertisements, applicant conversations, interviews, reference checks, trial shifts, negotiated offers, and hiring
- Five office stages, 17 interactive office objects, and 44 office upgrades
- A 13-app smartphone with messages, contacts, negotiated orders, fictional market/bank features, research, maps, settings, and secrets
- 11 replayable timed minigames with keyboard/touch/pointer control, high scores, and one-time run rewards
- 20 timed events, 11 discoverable secrets, daily quests, milestones, achievements, and seasonal Golden Seed prestige
- Six surface manholes and a second walkable underground world with five sewer sections, water channels, landmarks, characters, puzzles, gates, shortcuts, and one-time treasures
- Container-based Green Sewer Water collection, eight discoverable mixing recipes, timed offline experiments, 17 sewer quests, and six additional underground secrets
- A hidden, family-friendly Fruit Mafia Club with permanent $100 fictional membership, non-purchasable Club Chips, visible daily limits, posted prize tables, Plinko, and fruit slots
- Fruit Mafia: The Mystery Crate, an original members-only one-hit survival game for one player and 3–9 strategic computer opponents, with 23 timed/automatic/manual/reaction cards, 16 crate events, rebound chains, spectators, family-friendly object mode, AI memories, and one-time round rewards
- Versioned migration, corrupted-save repair, capped offline progress, and duplicate-payment protection

All employment, banking, investments, money, applicants, contacts, Club Chips, and gambling-style activities are fictional in-game systems with no real-money purchase or cash-out.

## Verification

```bash
npm run check
npm test
npm run build
```

The browser suite expects Chrome with a remote-debugging endpoint and the game served locally:

```bash
TYCOON_CDP_ENDPOINT=http://127.0.0.1:9246 npm run test:browser
```

The production build is written to `dist/` and remains a static site.
