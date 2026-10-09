# Fruitopia Tycoon

Fruitopia Tycoon is a responsive 3D browser game about growing six apple trees and a $1 roadside stand into a magical fruit corporation. Its Three.js perspective world is backed by the original data-driven tycoon engine, preserving orchard care, crafting, districts, construction, workers, recruiting, research, automatic deliveries, shipping, mountains, sewers, minigames, secrets, investors, quests, events, office management, and seasonal prestige.

## Play locally

```bash
npm install
npm run build
python3 -m http.server 8080 --directory dist
```

Open `http://127.0.0.1:8080` in a modern WebGL-capable browser. Progress is stored locally under the version-20 Fruitopia save key; older saves migrate automatically and no account or backend is required. The hosted game installs an offline app shell, including its 3D modules, after the first successful visit, so temporary connection loss does not interrupt play.

## Controls

- `WASD` or arrow keys: move relative to the camera
- Mouse movement or touch-drag: look around
- Mouse wheel up: move closer and continue into first person
- Mouse wheel down: step through close, normal, and wide third person
- `V`: switch immediately between first person and the normal third-person distance
- `E`: interact with the crosshair target or nearest object in front of the player
- Hold `Shift`: run
- `Space`: jump where jumping is allowed, or hold to activate a focused purchase pad
- Click the world in first person: capture the mouse pointer
- `Escape`: release the pointer or close an open dialog
- Find Me: return the camera behind the player
- Touch direction pad: mobile movement
- Mobile View buttons or camera-distance slider: change camera distance
- Mobile Use and Jump buttons: interact and jump
- Connected gamepad: left stick moves, right stick looks, primary button interacts, secondary button jumps, and the top button switches view

Shadows, render distance, model quality, effects quality, reduced motion, sound, music, and autosave are available under More → Settings or the Smartphone Settings app.

## Game systems

- Eight developing districts with 64 working improvements, hidden crates, teleporters, workers, completion bonuses, and district minigames
- A real perspective 3D world with rolling terrain, tall mountains, individual fruit trees, modeled buildings, broad roads, bridges, water, workers, vehicles, physical purchase pads, camera collision, and distance-based detail culling
- Country-scale district spacing with landscaped building lots, entrances, sidewalks, delivery lanes, open scenery, a two-row starter orchard, mounted high-resolution text signs, road directions, and proximity-faded supplemental labels
- Smooth saved first-person, close third-person, normal third-person, and wide third-person camera distances on the surface and underground
- A connected 7,200 × 7,200 north-to-south Fruitopia country with 40 regions, 88 buildable plots, distinct terrain and sound identities, illustrated map layers, and progression-based fast travel
- An authoritative country plan running from Summit Observatory through the mountain farms, orchard/research/farm belt, Upper Main Road civic belt, Office Headquarters, starter/market/delivery districts, Grand Central Road, festival/factory/shipping belt, freight harbor, Lemon Coast, and Fruit Islands
- Berrywood Forest, Melon Wetlands, Peach Blossom Hills, Citrus Highlands, Old Fruitopia Town, Railway Junction, a clean fruit-themed Industrial District, Lemon Coast, Coconut Bay, Dragon Fruit Desert, Starfruit Observatory Basin, Frozen Peaks, and a five-island Fruit Archipelago
- 28 fruit varieties, five quality grades, renewable cared-for trees, 21 recipes, and separate basket/product storage
- A 15-section Orchard Estate with 114 land, soil, water, tree-care, pollination, harvesting, storage, worker, transport, and research upgrades across seven visible estate stages
- 11 timed hybrid experiments with safe failure recovery, patents, research notes, and renewable hybrid trees
- 106 unique company buildings across 11 categories, each with three upgrade levels and live company effects
- Ten fruit laboratories and ten timed production businesses
- Seven delivery tiers, 12 vehicles, and 18 automatic routes with cargo, product, subscription, reputation, streak, subscriber, and one-time payment rules
- 14 named workers with assignments, energy, happiness, loyalty, equipment, skills, ranks, memories, conversations, and recruiting files
- Job advertisements, applicant conversations, interviews, reference checks, trial shifts, negotiated offers, and hiring
- Five office stages, 17 interactive office objects, and 44 office upgrades
- A 27-app smartphone with messages, contacts, negotiated orders, shipping, construction, fictional market/bank features, research, maps, settings, and secrets
- 27 replayable timed minigames across districts, attractions, sewers, mountains, shipping, and the Fruit Mafia Club, with keyboard/touch/pointer control, high scores, and one-time run rewards
- 20 timed events, 11 discoverable secrets, daily quests, milestones, achievements, and seasonal Golden Seed prestige
- Five modeled surface manholes and a separate 17-zone 3D underground world organized around Manholes A–C, the West and East Tunnels, Central Sewer Hub, Green-Water Cave, persistent maze, guarded Mafia Entrance, Mystery Crate game room, and Underground Machine Room
- Container-based Green Sewer Water collection, eight discoverable mixing recipes, timed offline experiments, 17 sewer quests, and six additional underground secrets
- A hidden, family-friendly Fruit Mafia Club with permanent $100 fictional membership, non-purchasable Club Chips, visible daily limits, posted prize tables, Plinko, and fruit slots
- Fruit Mafia: The Mystery Crate, an original members-only one-hit survival game for one player and 3–9 strategic computer opponents, with 23 timed/automatic/manual/reaction cards, 16 crate events, rebound chains, spectators, family-friendly object mode, AI memories, and one-time round rewards
- A 15-stage Shipping Harbor with eight vessels, 19 sea routes, six container types, crew management, real cargo preparation, route events, Harbor Reputation, offline travel, and one-time contract payment safeguards
- Versioned migration, corrupted-save repair, capped offline progress, and duplicate-payment protection

All employment, banking, investments, money, applicants, contacts, Club Chips, and gambling-style activities are fictional in-game systems with no real-money purchase or cash-out.

## Verification

```bash
npm run check
npm test
npm run build
npm run test:browser
```

The browser suite expects Chrome with a remote-debugging endpoint and the game served locally:

```bash
TYCOON_GAME_URL=http://127.0.0.1:8080 TYCOON_CDP_ENDPOINT=http://127.0.0.1:9246 npm run test:browser
```

The production build is written to `dist/` and remains a static site.
