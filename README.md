# Amusement Park Tycoon

A dependency-free, browser-based park management game built around physical logistics, vertical construction, guest psychology, and detailed micro-pricing.

## Play locally

```bash
python3 -m http.server 8080
```

Open `http://127.0.0.1:8080` in a modern desktop browser.

## The opening loop

1. Walk to the on-lot Job Shack and register for the starting $50,500.
2. Collect the Starter Toolkit to unlock construction and finance controls.
3. Visit the Used Ride Lot and purchase an attraction.
4. Buy concrete and queue blueprints at the Fabricator.
5. Dispatch the ride from the Shipping Desk and sign for it at the Freight Depot.
6. Pave a path, place the delivered hologram, authorize construction, connect its queue, hire an operator, and open for business.

## Controls

- `WASD` or arrow keys: walk
- Click a destination or labeled district building: walk there and interact
- `E`: interact in Walk Mode; raise construction level in Build Mode
- `V`: toggle Walk/Build Mode
- `1`–`5`: Infrastructure, Attractions, Commerce, Atmosphere, and Finance
- `R`: rotate blueprint
- `Q` / `E`: construction level down/up
- `X`: remove the most recent custom coaster node
- `Enter`: validate and finish a closed custom coaster circuit
- Hold `Shift`: constrain dragged paths to one axis
- `A` / `B`: aura and penalty overlays
- `P`: focus the selected asset's price
- `Delete` or `Backspace`: demolition mode
- `Space`: pause/resume; `-` / `=`: simulation speed
- `Escape`: cancel selection

## Implemented systems

- Isometric fenced lot, commercial district, walking avatar, contextual interaction, and guided starter tutorial
- Used-ride purchasing, freight fees, a 20-second first-delivery express lane, random delays/damage/spare parts, collection, and paid construction rushing
- Side-scrolling Used Ride Parking Lot with visible parked machinery, direct purchase cards, and three recoverable cash finds
- Three path surfaces, three queue formats, vertical foundation blocks, stairs, escalators, four structural levels, collision/support validation, and hologram feedback
- Seventeen active rides: five custom-track coasters, eight family/thrill flats, and four tracked/dark rides
- Node-based coaster construction with six vertical levels, speed/friction validation, stair and object collision checks, animated trains, and three compact prebuilt layouts
- Individual ride naming plus three-tier ability trees earned through operation cycles
- Construction, staffing, condition, animated/synthesized breakdown feedback, repair, power, admission, queues, and revenue
- Food stalls, item pricing, thirst interactions, restrooms and bladder needs, ATMs, bins, scenery radii, themed ground, atmosphere, litter, janitors, mechanics, weather, and daily payroll
- Guest wallets, demographic preferences, price tolerance, value-for-money decisions, complaints, park reputation, admission models, and a global economic ledger
- Path-locked guest routing from the main gate through connected walkways and queues
- Appearance reviews driven by atmosphere, cleanliness, path condition, visitor happiness, and a live review ticker
- A 48% larger starter lot with 120-guest capacity, plus arcades, midway games, food stalls, a 4D cinema, gift shop, First Aid Lodge, fountains, and mascot stages
- Beginner-friendly one-time cash rewards, a 10-second first build, early breakdown protection, and a lower-cost lot expansion milestone
- Persistent local saves, lot expansion milestones, drifting-ride unlocks, responsive UI, keyboard controls, and accessible non-color placement feedback

## Smoke test

The browser smoke test expects Chrome to be running with a remote debugging endpoint:

```bash
TYCOON_CDP_ENDPOINT=http://127.0.0.1:9245 node tests/smoke.mjs
TYCOON_CDP_ENDPOINT=http://127.0.0.1:9245 node tests/movement-smoke.mjs
```
