(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[char]);
  const money = value => `$${Math.max(0, value).toLocaleString(undefined, { minimumFractionDigits: value % 1 ? 2 : 0, maximumFractionDigits: 2 })}`;
  const uid = prefix => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  const levelLabel = level => level < 0 ? `B${Math.abs(level)}` : `L${level + 1}`;
  const SAVE_KEY = "amusement-park-tycoon-v1";
  const TILE_W = 64;
  const TILE_H = 32;
  const LEVEL_H = 34;
  const STARTING_BUDGET = 50500;
  const LOT = { minX: -4, maxX: 16, minY: -3, maxY: 14 };
  const REGIONS = {
    meadow: { name: "Meadow Valley", description: "Open green terrain with balanced weather and classic park scenery.", lot: "#4e7c55", outer: "#345e48", sky: ["#6fa7b8","#a8c6bc"] },
    coast: { name: "Sunset Beach", description: "A sandy oceanfront lot with waves, fishing docks, boats, and bright coastal atmosphere.", lot: "#b99968", outer: "#87a875", sky: ["#55a9d5","#c4e6de"] },
    alpine: { name: "Alpine Ridge", description: "Cool mountain grass, rocky ledges, pines, and a dramatic highland skyline.", lot: "#5f7c62", outer: "#465d51", sky: ["#668ca6","#cad8d2"] },
    desert: { name: "Desert Springs", description: "Warm canyon soil, scattered cacti, red rocks, and clear golden skies.", lot: "#a9784e", outer: "#77543d", sky: ["#c07850","#e6c493"] }
  };

  const RIDES = {
    timber: { name: "Timber Ridge Hybrid", icon: "⌁", family: "Hybrid Coaster", coaster: true, ledgerBuild: true, maxSpeed: 70, maxHeight: 4, cost: 32000, freight: 0, delivery: 0, w: 8, h: 5, capacity: 24, cycle: 130, excitement: 7.1, intensity: 6.8, nausea: 4.2, reliability: 84, power: 20, color: "#b77942", description: "A wood-and-steel baseline coaster with a chain lift and compact airtime profile." },
    carousel: { name: "Retro Carousel", icon: "◉", family: "Family Flat", cost: 12000, freight: 500, delivery: 60, w: 3, h: 3, capacity: 30, cycle: 70, excitement: 3.2, intensity: 2.1, nausea: 1.2, reliability: 92, power: 8, color: "#f3c753", description: "Reliable, high-throughput nostalgia with a gentle excitement score." },
    whirlybird: { name: "Whirlybird Helicopters", icon: "✣", family: "Family Flat", cost: 14000, freight: 600, delivery: 90, w: 3, h: 3, capacity: 16, cycle: 80, excitement: 4.4, intensity: 3.1, nausea: 2.2, reliability: 88, power: 12, color: "#53d998", description: "Family favorite with hydraulic lifting arms that need regular oiling." },
    wave: { name: "Wave Swinger", icon: "✺", family: "Thrill Flat", cost: 18000, freight: 800, delivery: 120, w: 4, h: 4, capacity: 20, cycle: 95, excitement: 6.9, intensity: 6.1, nausea: 4.8, reliability: 75, power: 18, color: "#39a8ff", description: "Strong teen appeal, overhead cables, and demanding inspections." },
    safari: { name: "Backyard Truck / Cavern Safari", icon: "▰", family: "Tracked Ride", cost: 25000, freight: 1500, delivery: 240, w: 6, h: 5, capacity: 24, cycle: 150, excitement: 5.8, intensity: 3.4, nausea: 2.3, reliability: 85, power: 15, color: "#9dc65a", description: "Expedition trucks thread through canyon gaps and compact underground caves." },
    skywheel: { name: "Skywheel Vista", icon: "◯", family: "Family Flat", cost: 18000, freight: 700, delivery: 90, w: 4, h: 4, capacity: 32, cycle: 100, excitement: 5.4, intensity: 3.2, nausea: 2, reliability: 89, power: 16, color: "#f8b657", description: "A glowing observation wheel with huge capacity and a beautiful skyline view." },
    bumper: { name: "Neon Bumper Garage", icon: "⬡", family: "Family Flat", cost: 16500, freight: 650, delivery: 75, w: 4, h: 3, capacity: 20, cycle: 85, excitement: 5.8, intensity: 4.8, nausea: 2.8, reliability: 87, power: 18, color: "#ff65b8", description: "Colorful electric cars turn every cycle into a friendly, chaotic competition." },
    dropTower: { name: "Comet Drop Tower", icon: "↕", family: "Thrill Flat", cost: 28000, freight: 1100, delivery: 120, w: 4, h: 4, capacity: 16, cycle: 75, excitement: 8.1, intensity: 8.5, nausea: 6.2, reliability: 80, power: 26, color: "#8d79ff", description: "A compact skyline tower with a fast launch, long pause, and sudden drop." },
    hairpin: { name: "Hairpin Slideway", icon: "ϟ", family: "Drift Coaster", coaster: true, maxSpeed: 48, maxHeight: 2, cost: 85000, freight: 3200, delivery: 300, w: 8, h: 6, capacity: 16, cycle: 110, excitement: 8.8, intensity: 8.2, nausea: 6.5, reliability: 78, power: 36, color: "#ff5368", description: "Free-swinging whip cars drift through sharp lateral corners." },
    hydro: { name: "Hydro-Slide Drift", icon: "≈", family: "Water Coaster", coaster: true, maxSpeed: 55, maxHeight: 4, cost: 140000, freight: 5000, delivery: 420, w: 10, h: 8, capacity: 20, cycle: 150, excitement: 9.1, intensity: 7.5, nausea: 5.4, reliability: 72, power: 50, color: "#44c7e8", description: "Water-coaster boats hydroplane across broad fishtail curves." },
    neon: { name: "Neon Circuit", icon: "↯", family: "Launched Coaster", coaster: true, maxSpeed: 92, maxHeight: 5, cost: 125000, freight: 4500, delivery: 360, w: 8, h: 6, capacity: 20, cycle: 105, excitement: 9.3, intensity: 8.7, nausea: 6.1, reliability: 76, power: 75, color: "#33d6ff", description: "A high-speed hydraulic launch coaster with synchronized LED track lighting." },
    flyer: { name: "Pyrotechnic Arena Flyer", icon: "✧", family: "Flying Coaster", coaster: true, maxSpeed: 78, maxHeight: 5, cost: 180000, freight: 6500, delivery: 480, w: 10, h: 7, capacity: 24, cycle: 145, excitement: 9.7, intensity: 9.1, nausea: 7.2, reliability: 73, power: 68, color: "#ff874d", description: "A licensed suspended flyer synchronized with smoke, lighting, and arena effects." },
    spinner: { name: "Centrifugal Inertia Spinner", icon: "✥", family: "Drifting Thrill", cost: 48000, freight: 1800, delivery: 240, w: 4, h: 4, capacity: 24, cycle: 90, excitement: 7.8, intensity: 8.8, nausea: 9.2, reliability: 82, power: 28, color: "#a56cff", description: "Compact, powerful, and notorious for creating cleanup work." },
    skid: { name: "Diesel Cargo Skid", icon: "⟲", family: "Drifting Thrill", cost: 72000, freight: 2600, delivery: 270, w: 6, h: 5, capacity: 20, cycle: 100, excitement: 8.4, intensity: 8.6, nausea: 7.7, reliability: 70, power: 55, color: "#ff8b45", description: "Hydraulic cargo cars slam sideways around an industrial ring." },
    buttonEye: { name: "Button-Eye Workshop", icon: "◉", family: "Dark Ride", cost: 54000, freight: 2100, delivery: 240, w: 6, h: 5, capacity: 18, cycle: 140, excitement: 6.8, intensity: 4.1, nausea: 2.2, reliability: 86, power: 32, color: "#b28ac9", description: "Sewing-basket vehicles pass physical puppetry and claymation workshop scenes." },
    shadow: { name: "Shadow Corridor: The Chase", icon: "◐", family: "Dark Ride", cost: 78000, freight: 2900, delivery: 300, w: 7, h: 5, capacity: 16, cycle: 125, excitement: 8.6, intensity: 8.1, nausea: 5.2, reliability: 79, power: 44, color: "#6964a8", description: "Lane-switching vehicles flee a fluid Stalker entity through reactive corridors." },
    glitch: { name: "The Glitch Hub", icon: "▦", family: "Dark Ride", cost: 96000, freight: 3400, delivery: 330, w: 7, h: 6, capacity: 20, cycle: 135, excitement: 8.9, intensity: 8.4, nausea: 6.3, reliability: 74, power: 62, color: "#31d9bd", description: "A projection-mapped retro server room with backward vehicle drops." }
  };

  const COASTER_UPGRADES = {
    timber: [
      ["Reinforced Planking", "Structural degradation is reduced by 15%."],
      ["Splat-Guard Finishes", "Nausea incidents create 60% less local atmosphere damage."],
      ["Chain-Lift Overdrive", "The chain lift runs 25% faster at the cost of 8 kW."]
    ],
    hairpin: [
      ["Frictionless Castors", "Drift speed adds +0.8 Excitement."],
      ["Magnetic Snaps", "Controlled lateral damping reduces Nausea by 1.5."],
      ["Drift-Boost Triggers", "Three-turn drift chains pay a 15% ticket bonus."]
    ],
    hydro: [
      ["High-Pressure Nozzles", "Longer slides add +0.6 Excitement."],
      ["Hydroplane Stabilizers", "Heavy rain can no longer trigger pressure shutdowns."],
      ["Splash Zone Splashback", "A cooling aura slows nearby guest fatigue by 35%."]
    ],
    neon: [
      ["Capacitor Overload", "Launch velocity and Adrenaline increase by 20%."],
      ["LED Strobe Syncing", "Boardwalk scenery grants double local atmosphere."],
      ["Brake Run Power Recycling", "Deceleration returns 18 kW to the park grid."]
    ],
    flyer: [
      ["Heat Shielding", "Track can pass closer to pyrotechnic scenery."],
      ["Smoke Cloud Priming", "Atmospheric queues board at maximum Wonder."],
      ["Stunt Synchronization", "Every tenth cycle triggers a reputation burst."]
    ]
  };

  const TRACK_LAYOUTS = {
    uptown: { name: "Uptown Loop", ride: "neon", w: 7, h: 5, description: "Compact launch, geometric teardrop loop, broad return, and straight brake run.", nodes: [[0,0,0],[1,0,0],[2,0,0],[3,0,0],[4,0,0],[5,1,1],[5,2,2],[4,3,3],[3,4,2],[2,4,1],[1,4,0],[0,3,0],[0,2,0],[0,1,0],[0,0,0]] },
    slideway: { name: "Grid-Hugging Slideway", ride: "hairpin", w: 7, h: 6, description: "A flat switchback grid built around repeated 90-degree drifting corners.", nodes: [[0,0,0],[1,0,0],[2,0,0],[3,0,0],[4,0,0],[5,0,0],[5,1,0],[4,1,0],[3,1,0],[2,1,0],[1,1,0],[1,2,0],[2,2,0],[3,2,0],[4,2,0],[5,2,0],[5,3,0],[4,3,0],[3,3,0],[2,3,0],[1,3,0],[0,3,0],[0,2,0],[0,1,0],[0,0,0]] },
    suburban: { name: "Suburban Crest", ride: "timber", w: 9, h: 5, description: "A four-level chain lift, tunnel drop, banked return, and three measured bunny hops.", nodes: [[0,0,0],[1,0,1],[2,0,2],[3,0,3],[4,0,4],[5,0,3],[5,1,2],[6,1,1],[6,2,0],[7,3,-1],[6,4,0],[5,4,1],[4,4,0],[3,4,1],[2,4,0],[1,4,0],[0,3,0],[0,2,0],[0,1,0],[0,0,0]] }
  };

  const ITEMS = {
    infrastructure: [
      { id: "pathConcrete", name: "Concrete Path", icon: "═", cost: 10, kind: "path", speed: 1, unlockedBy: "concrete", description: "Baseline pedestrian route. Heavy use eventually creates cracks." },
      { id: "pathWood", name: "Wood Decking", icon: "≡", cost: 25, kind: "path", speed: 1.1, description: "Boardwalk path with nostalgia and lower trash retention." },
      { id: "pathLed", name: "LED Asphalt", icon: "▰", cost: 45, kind: "path", speed: 1.25, power: 0.2, description: "Fast illuminated path that removes nighttime slowdown." },
      { id: "queueStandard", name: "Stanchion Queue", icon: "⌇", cost: 15, kind: "queue", density: 4, unlockedBy: "queue", description: "Four waiting guests per tile. Spillover creates congestion." },
      { id: "queueBridge", name: "Bridge Queue", icon: "⌁", cost: 60, kind: "queue", density: 8, minLevel: 1, description: "High-density queue designed for elevated structures." },
      { id: "queueAtmos", name: "Atmospheric Queue", icon: "▤", cost: 40, kind: "queue", density: 3, power: 0.4, description: "Enclosed queue that builds Immersive Wonder." },
      { id: "foundation", name: "Foundation Block", icon: "■", cost: 50, kind: "block", description: "Stackable structural cube for platforms and supports." },
      { id: "stairs", name: "Upward Stairs", icon: "▟", cost: 300, kind: "vertical", speed: 0.75, description: "Links adjacent levels but increases guest fatigue." },
      { id: "escalator", name: "Escalator", icon: "▱", cost: 2000, kind: "vertical", speed: 1.25, power: 5, price: 0, description: "Powered vertical route with no climbing fatigue." }
    ],
    attractions: Object.entries(RIDES).map(([id, ride]) => ({ id, ...ride, kind: "ride" })),
    commerce: [
      { id: "fry", name: "Neon Fry Basket", icon: "▥", cost: 4000, kind: "food", w: 2, h: 2, power: 6, price: 6.5, aura: 4, description: "Salty boardwalk food raises thirst and adjacent drink demand." },
      { id: "wok", name: "Sichuan Wok Express", icon: "♨", cost: 6500, kind: "food", w: 3, h: 2, power: 8, price: 8.5, aura: 7, description: "Aromatic street kitchen that pulls guests from nearby paths." },
      { id: "pizza", name: "Dairy-Free Pizza Parlor", icon: "◒", cost: 8000, kind: "food", w: 3, h: 3, power: 18, price: 9, aura: 5, description: "High-capacity open kitchen demanding a stronger power grid." },
      { id: "iceCream", name: "Cloud Cone Creamery", icon: "♢", cost: 3500, kind: "food", w: 2, h: 2, power: 5, price: 5.5, aura: 3, description: "A cheerful ice-cream kiosk that cools guests down and sells quickly near family rides." },
      { id: "restroomSingle", name: "Comfort Station", icon: "WC", cost: 3000, kind: "restroom", w: 1, h: 1, capacity: 2, price: 0, water: 4, aura: 3, description: "Tiny two-guest relief station for tight spaces." },
      { id: "restroomMulti", name: "Utility Restroom", icon: "▦", cost: 7000, kind: "restroom", w: 2, h: 2, capacity: 12, price: 0, water: 12, aura: 4, description: "Stackable, high-throughput facility requiring a water connection." },
      { id: "arcade", name: "Pixel Palace Arcade", icon: "▣", cost: 12000, kind: "venue", w: 4, h: 3, capacity: 30, price: 4, power: 20, aura: 5, atmosphere: 12, description: "A neon indoor arcade packed with cabinets, prize machines, and family games." },
      { id: "gameBooth", name: "Midway Skill Games", icon: "◎", cost: 5000, kind: "venue", w: 2, h: 2, capacity: 12, price: 2.5, power: 6, aura: 3, atmosphere: 6, description: "Quick carnival games and prizes add an affordable activity between rides." },
      { id: "cinema", name: "Starlight 4D Cinema", icon: "▶", cost: 16500, kind: "venue", w: 4, h: 4, capacity: 40, price: 7.5, power: 28, aura: 6, atmosphere: 14, description: "An indoor motion theater that keeps visitors entertained during rain." },
      { id: "giftShop", name: "Uptown Gift Shop", icon: "◆", cost: 7500, kind: "shop", w: 3, h: 2, price: 8, power: 4, aura: 4, atmosphere: 7, description: "A bright souvenir building selling ride photos, plush toys, and park merchandise." },
      { id: "firstAid", name: "First Aid Lodge", icon: "+", cost: 5500, kind: "rest", w: 2, h: 2, price: 0, power: 3, aura: 3, atmosphere: 4, description: "A staffed recovery building that lowers fatigue and improves visitor confidence." },
      { id: "atm", name: "Park ATM", icon: "$", cost: 2500, kind: "service", w: 1, h: 1, price: 2.5, power: 1, description: "Lets cash-limited guests withdraw funds for a transaction fee." },
      { id: "bin", name: "Waste Bin", icon: "▣", cost: 150, kind: "service", w: 1, h: 1, capacity: 20, description: "Collects guest waste within five connected path tiles." }
    ],
    atmosphere: [
      { id: "photo", name: "Photo Boards", icon: "▧", cost: 1200, kind: "decor", w: 2, h: 1, aura: 3, atmosphere: 8, description: "Guests pause for photos, rest, and generate social buzz." },
      { id: "lantern", name: "Mason Lantern", icon: "✦", cost: 800, kind: "decor", w: 1, h: 1, aura: 2, atmosphere: 4, description: "Low-power-free lighting made from upcycled materials." },
      { id: "dino", name: "Dino Skeleton", icon: "☠", cost: 7500, kind: "decor", w: 4, h: 4, aura: 8, atmosphere: 15, description: "Large landmark adding Immersive Wonder to nearby rides." },
      { id: "tree", name: "Redwood Cluster", icon: "♠", cost: 450, kind: "decor", w: 1, h: 1, aura: 2, atmosphere: 3, description: "Natural shade and stress relief for nearby guests." },
      { id: "fountain", name: "Dancing Light Fountain", icon: "♒", cost: 2500, kind: "decor", w: 2, h: 2, aura: 4, atmosphere: 10, description: "Animated water jets and colored lights create a lively plaza centerpiece." },
      { id: "mascotStage", name: "Mascot Mini Stage", icon: "★", cost: 4500, kind: "decor", w: 3, h: 2, aura: 5, atmosphere: 12, description: "Short character shows delight families and brighten nearby paths." },
      { id: "dock", name: "Boardwalk Dock Module", icon: "═", cost: 900, kind: "decor", w: 3, h: 1, aura: 2, atmosphere: 5, description: "Snap-together timber pier sections for beach promenades and waterside viewing decks." },
      { id: "palm", name: "Coastal Palm Cluster", icon: "♧", cost: 650, kind: "decor", w: 1, h: 1, aura: 2, atmosphere: 4, description: "Wind-swept palms add shade and tropical character to paths and plazas." },
      { id: "lighthouse", name: "Mini Lighthouse", icon: "◭", cost: 4200, kind: "decor", w: 2, h: 2, aura: 6, atmosphere: 13, description: "A rotating coastal beacon becomes a highly visible park landmark after dark." },
      { id: "umbrella", name: "Beach Umbrellas", icon: "◒", cost: 500, kind: "decor", w: 2, h: 1, aura: 2, atmosphere: 3, description: "Colorful shade umbrellas create a relaxed guest rest area." },
      { id: "tunnelPortal", name: "Stone Tunnel Portal", icon: "∩", cost: 1800, kind: "decor", w: 2, h: 1, aura: 2, atmosphere: 6, description: "A themed portal masks coaster track as it dives into an underground section." },
      { id: "neonArch", name: "Neon Gateway Arch", icon: "Π", cost: 2200, kind: "decor", w: 2, h: 1, power: 2, aura: 4, atmosphere: 8, description: "A programmable light arch frames paths and futuristic ride entrances." },
      { id: "themeBoardwalk", name: "Boardwalk Theme", icon: "≈", cost: 5000, kind: "theme", theme: "boardwalk", description: "Paints connected ground with sand and weathered decking." },
      { id: "themeForest", name: "Eco-Forest Theme", icon: "♣", cost: 6000, kind: "theme", theme: "forest", description: "Redwoods, rocks, and lanterns reduce guest stress." },
      { id: "themeShipyard", name: "Shipyard Theme", icon: "⌗", cost: 4500, kind: "theme", theme: "shipyard", description: "Industrial ground treatment that speeds mechanical construction." },
      { id: "themeBeach", name: "Tropical Beach Pack", icon: "☼", cost: 5500, kind: "theme", theme: "beach", description: "Adds pale sand, turquoise accents, palms, and seaside boardwalk styling." },
      { id: "themeCarnival", name: "Colorburst Carnival Pack", icon: "✶", cost: 5200, kind: "theme", theme: "carnival", description: "Bright midway tiles and playful colors increase family appeal." },
      { id: "themeNeon", name: "Future Neon Pack", icon: "◇", cost: 7500, kind: "theme", theme: "neon", description: "Dark tech flooring and luminous grid lines amplify high-speed attractions." },
      { id: "themeAlpine", name: "Alpine Adventure Pack", icon: "▲", cost: 6200, kind: "theme", theme: "alpine", description: "Stone, snow edging, and rugged timber create a mountain expedition zone." }
    ]
  };

  const TOUR_STEPS = [
    ["Report to the job shack", "Walk to the construction trailer and press E at the blueprints desk."],
    ["Collect the Starter Toolkit", "Open the equipment locker inside the shack to unlock your build dock."],
    ["Visit the Used Ride Lot", "Leave through the gates and walk east to the red Used Ride Lot."],
    ["Purchase a starter ride", "Buy a Retro Carousel or another affordable attraction."],
    ["Acquire path blueprints", "Visit the blue Fabricator and buy Concrete and Queue blueprint packs."],
    ["Arrange freight shipping", "Take your pending ride to the yellow shipping desk and dispatch it."],
    ["Pave the main path", "Return to the lot, switch to Build Mode, and place concrete from the gate inward."],
    ["Sign for the delivery", "When the truck arrives, return to the Freight Depot and press E."],
    ["Anchor the ride blueprint", "Choose the delivered ride from Attractions and place its hologram beside your path."],
    ["Authorize construction", "Select the hologram and authorize your crew to assemble it."],
    ["Connect a queue", "Build a Standard Queue beside the completed ride."],
    ["Open for business", "Hire an operator, set a fair price, and open your first ride."]
  ];

  const defaultState = () => ({
    version: 1, profile: "", registered: false, toolkit: false, cash: 0, totalRevenue: 0, totalGuests: 0,
    reputation: 50, atmosphere: 0, cleanliness: 100, powerCapacity: 100, waterCapacity: 60, time: 480, day: 1,
    speed: 1, lotTier: 1, tutorial: 0, buildLevel: 0, activeTab: "infrastructure", activeTool: null,
    blueprintPacks: { concrete: false, queue: false }, materials: {}, rideInventory: {}, pendingOrders: [], shipments: [],
    objects: [], themes: [], staff: { janitors: 0, mechanics: 0 }, admission: { model: "open", gatePrice: 0, dayPass: 35, seasonPass: 120 },
    player: { x: 8, y: 12, z: 0 }, stats: { expenses: 0, profit: 0, complaints: 0 }, weather: "clear",
    reviewTotal: 0, reviewCount: 0, reviews: [], parkingCashFound: 0, bonuses: {}, region: "meadow",
    unlocked: { spinner: false, skid: false, hairpin: false, hydro: false, neon: false, flyer: false }, coasterLicenses: {}, powerTier: 1, level: 1, milestones: { path: false, freight: false }, lastSave: Date.now()
  });

  let state = load();
  let guests = [];
  let selected = null;
  let hoverTile = null;
  let hoveredObject = null;
  let walkMode = true;
  let rotation = 0;
  let auraOverlay = false;
  let penaltyOverlay = false;
  let keys = new Set();
  let camera = { x: 0, y: 0 };
  let dragStart = null;
  let lastTime = performance.now();
  let accumulator = 0;
  let spawnTimer = 0;
  let saveTimer = 0;
  let selectedShopVisited = false;
  let trackDraft = null;
  let pendingRideName = "";
  let audioContext = null;
  let walkTarget = null;
  let movementTimer = null;
  let celebrationUntil = 0;

  const canvas = $("#world");
  const ctx = canvas.getContext("2d");

  function ensureAudio(){if(!audioContext)audioContext=new (window.AudioContext||window.webkitAudioContext)();if(audioContext.state==="suspended")audioContext.resume();}
  function playBreakdownSound(type){if(!audioContext)return;const now=audioContext.currentTime,osc=audioContext.createOscillator(),gain=audioContext.createGain();osc.type=type==="hydro"?"sine":type==="neon"||type==="glitch"?"square":"sawtooth";osc.frequency.setValueAtTime(type==="hydro"?180:95,now);osc.frequency.exponentialRampToValueAtTime(38,now+.42);gain.gain.setValueAtTime(.08,now);gain.gain.exponentialRampToValueAtTime(.001,now+.48);osc.connect(gain).connect(audioContext.destination);osc.start(now);osc.stop(now+.5);}

  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(SAVE_KEY));
      if (saved?.version === 1) return { ...defaultState(), ...saved, player: { ...defaultState().player, ...saved.player } };
    } catch (error) { console.warn("Save could not be loaded", error); }
    return defaultState();
  }

  function save(force = false) {
    if (!force && saveTimer < 3) return;
    state.lastSave = Date.now();
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    saveTimer = 0;
    $("#saveStatus").textContent = "Saved just now";
  }

  function getItem(id) {
    for (const group of Object.values(ITEMS)) {
      const found = group.find(item => item.id === id);
      if (found) return found;
    }
    return null;
  }

  function parkNetWorth() {
    const assets=state.objects.reduce((sum,object)=>sum+(getItem(object.type)?.cost||0),0);
    const orders=state.pendingOrders.reduce((sum,order)=>sum+(RIDES[order.ride]?.cost||0),0);
    return state.cash+assets+orders;
  }

  function refreshCoasterUnlocks() {
    state.coasterLicenses ||= {};
    state.unlocked ||= {};
    state.level=clamp(1+Math.floor(state.totalGuests/100+state.totalRevenue/50000),1,10);
    state.powerTier=state.powerCapacity>=200?2:1;
    const foods=state.objects.filter(object=>getItem(object.type)?.kind==="food").length;
    const wood=state.objects.filter(object=>object.type==="pathWood").length;
    state.unlocked.timber=true;
    state.unlocked.hairpin=!!state.coasterLicenses.hairpin;
    state.unlocked.hydro=foods>=3&&wood>=6;
    state.unlocked.neon=state.level>=5&&state.powerTier>=2;
    state.unlocked.flyer=state.atmosphere>=80&&!!state.coasterLicenses.flyer;
    state.unlocked.buttonEye=state.level>=2;
    state.unlocked.shadow=state.level>=4&&state.reputation>=60;
    state.unlocked.glitch=state.level>=6&&state.powerTier>=2;
  }

  function coasterRequirement(id) {
    if(id==="timber")return "Available now in the construction ledger";
    if(id==="hairpin")return state.coasterLicenses?.hairpin?"Manufacturing blueprint licensed":"Requires $50,000 net worth + $10,000 blueprint";
    if(id==="hydro")return "Requires 3 food stalls linked by 6+ Wood Decking tiles";
    if(id==="neon")return `Requires Player Level 5 and Power Tier 2 · current L${state.level}/P${state.powerTier}`;
    if(id==="flyer")return state.coasterLicenses?.flyer?"Premium license signed":"Requires 80 Atmosphere + premium legal license";
    if(id==="buttonEye")return `Requires Player Level 2 · current L${state.level}`;
    if(id==="shadow")return `Requires Player Level 4 and 60 Reputation · current L${state.level}/${Math.round(state.reputation)}`;
    if(id==="glitch")return `Requires Player Level 6 and Power Tier 2 · current L${state.level}/P${state.powerTier}`;
    if(id==="spinner"||id==="skid")return "Requires the first municipal lot expansion";
    return "Expansion inventory";
  }

  function hasUpgrade(object,tier){return (object.upgrades||[]).includes(tier);}
  function effectivePower(object){const item=getItem(object.type);if(!item)return 0;let draw=item.power||0;if(object.type==="timber"&&hasUpgrade(object,2))draw+=8;if(object.type==="neon"&&hasUpgrade(object,2))draw=Math.max(5,draw-18);return draw;}
  function effectiveRideStats(object,item){let excitement=item.excitement,nausea=item.nausea,cycle=item.cycle;if(object.type==="hairpin"&&hasUpgrade(object,0))excitement+=.8;if(object.type==="hairpin"&&hasUpgrade(object,1))nausea=Math.max(0,nausea-1.5);if(object.type==="hydro"&&hasUpgrade(object,0))excitement+=.6;if(object.type==="neon"&&hasUpgrade(object,0))excitement+=.7;if(object.type==="timber"&&hasUpgrade(object,2))cycle*=.75;return{excitement,nausea,cycle};}

  function iso(x, y, z = 0) {
    const originX = (canvas.viewWidth || canvas.width) * 0.38 + camera.x;
    const originY = 58 + camera.y;
    return { x: originX + (x - y) * TILE_W / 2, y: originY + (x + y) * TILE_H / 2 - z * LEVEL_H };
  }

  function screenToGrid(px, py, z = state.buildLevel) {
    const originX = (canvas.viewWidth || canvas.width) * 0.38 + camera.x;
    const originY = 58 + camera.y;
    const sx = px - originX;
    const sy = py - originY + z * LEVEL_H;
    return { x: Math.floor(sy / TILE_H + sx / TILE_W), y: Math.floor(sy / TILE_H - sx / TILE_W), z };
  }

  const LANDMARKS = [
    { x: 2.3, y: 9.3, w: 2.5, h: 2.2, approach: { x: 3.5, y: 10.5 } },
    { x: 20, y: 2, w: 5, h: 4, approach: { x: 21.5, y: 4.2 } },
    { x: 23, y: 8, w: 5, h: 3.5, approach: { x: 24.5, y: 9.5 } },
    { x: 26, y: 4.5, w: 2.5, h: 2.5, approach: { x: 27, y: 5.5 } },
    { x: 19, y: 11, w: 3.5, h: 2.5, approach: { x: 20, y: 12.3 } },
    { x: 14.5, y: 1, w: 2.4, h: 3.3, approach: { x: 15.5, y: 2.5 } }
  ];

  function landmarkAt(tile) {
    return LANDMARKS.filter(landmark => tile.x >= Math.floor(landmark.x) - 2 && tile.x <= Math.ceil(landmark.x + landmark.w)
      && tile.y >= Math.floor(landmark.y) - 2 && tile.y <= Math.ceil(landmark.y + landmark.h))
      .sort((a,b)=>distance(tile,a.approach)-distance(tile,b.approach))[0];
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const scale = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.floor(rect.width * scale);
    canvas.height = Math.floor(rect.height * scale);
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    canvas.viewWidth = rect.width;
    canvas.viewHeight = rect.height;
  }

  function logicalPoint(event) {
    const rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  function diamond(x, y, color, stroke = "rgba(255,255,255,.08)") {
    const p = iso(x, y);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x + TILE_W / 2, p.y + TILE_H / 2);
    ctx.lineTo(p.x, p.y + TILE_H);
    ctx.lineTo(p.x - TILE_W / 2, p.y + TILE_H / 2);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.stroke(); }
  }

  function tileTop(x, y, z, color, alpha = 1) {
    const p = iso(x, y, z);
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x + TILE_W / 2, p.y + TILE_H / 2);
    ctx.lineTo(p.x, p.y + TILE_H);
    ctx.lineTo(p.x - TILE_W / 2, p.y + TILE_H / 2);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = "rgba(220,245,255,.12)";
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  function drawBlock(x, y, z, color = "#385469", height = LEVEL_H) {
    const top = iso(x, y, z + 1);
    const mid = iso(x, y, z);
    ctx.beginPath();
    ctx.moveTo(top.x - TILE_W / 2, top.y + TILE_H / 2);
    ctx.lineTo(top.x, top.y + TILE_H);
    ctx.lineTo(mid.x, mid.y + TILE_H);
    ctx.lineTo(mid.x - TILE_W / 2, mid.y + TILE_H / 2);
    ctx.closePath();
    ctx.fillStyle = shade(color, -30); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(top.x + TILE_W / 2, top.y + TILE_H / 2);
    ctx.lineTo(top.x, top.y + TILE_H);
    ctx.lineTo(mid.x, mid.y + TILE_H);
    ctx.lineTo(mid.x + TILE_W / 2, mid.y + TILE_H / 2);
    ctx.closePath();
    ctx.fillStyle = shade(color, -45); ctx.fill();
    tileTop(x, y, z + 1, color);
  }

  function shade(hex, amount) {
    const value = parseInt(hex.replace("#", ""), 16);
    const r = clamp((value >> 16) + amount, 0, 255);
    const g = clamp(((value >> 8) & 255) + amount, 0, 255);
    const b = clamp((value & 255) + amount, 0, 255);
    return `rgb(${r},${g},${b})`;
  }

  function drawWorld() {
    const width = canvas.viewWidth || canvas.width;
    const height = canvas.viewHeight || canvas.height;
    const region=REGIONS[state.region]||REGIONS.meadow;
    const sky = ctx.createLinearGradient(0, 0, 0, height);
    sky.addColorStop(0, state.weather === "rain" ? "#28404d" : region.sky[0]);
    sky.addColorStop(.45, state.weather === "rain" ? "#1d3340" : region.sky[1]);
    sky.addColorStop(1, "#1c3a35");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.translate(0, 0);
    drawTerrain();
    drawDistrict();
    drawLotObjects();
    drawGuests();
    drawPlayer();
    drawPreview();
    ctx.restore();
    drawCelebration();
  }

  function drawCelebration() {
    if (performance.now() >= celebrationUntil) return;
    const width=canvas.viewWidth||canvas.width,height=canvas.viewHeight||canvas.height,time=performance.now();
    const colors=["#ffcc55","#53d998","#ff65b8","#55cfff","#ffffff"];
    ctx.save();
    for(let i=0;i<48;i++){
      const speed=.035+(i%5)*.008,x=(i*127+time*speed)%width,y=(i*83+time*(.055+(i%4)*.012))%height;
      ctx.save();ctx.fillStyle=colors[i%colors.length];ctx.translate(x,y);ctx.rotate(time/900+i);ctx.fillRect(-3,-6,6,12);ctx.restore();
    }
    ctx.restore();
  }

  function drawTerrain() {
    const region=REGIONS[state.region]||REGIONS.meadow;
    for (let sum = -10; sum <= 44; sum++) {
      for (let x = -7; x <= 29; x++) {
        const y = sum - x;
        if (y < -6 || y > 16) continue;
        let color = region.outer;
        if (state.region==="coast"&&(x<LOT.minX||y<LOT.minY))color=(x>=LOT.minX-1||y>=LOT.minY-1)?"#d2b77c":"#26758c";
        if (x >= LOT.minX && x <= LOT.maxX && y >= LOT.minY && y <= LOT.maxY) color = region.lot;
        if (x >= 18 && x <= 28 && y >= 0 && y <= 14) color = "#47555a";
        if (y === 15 || y === 16) color = "#303b40";
        const themed = state.themes.find(theme => theme.x === x && theme.y === y);
        if (themed?.type === "boardwalk") color = "#a38b68";
        if (themed?.type === "forest") color = "#315b42";
        if (themed?.type === "shipyard") color = "#4c5559";
        if (themed?.type === "beach") color = "#cfb67f";
        if (themed?.type === "carnival") color = (x+y)%2?"#8e5e6e":"#65829a";
        if (themed?.type === "neon") color = (x+y)%2?"#182c3e":"#20384a";
        if (themed?.type === "alpine") color = (x+y)%3?"#63766c":"#89928a";
        diamond(x, y, color);
      }
    }
    drawRegionScenery();
    drawRoadMarkings();
    drawFence();
  }

  function drawRegionScenery(){
    ctx.save();
    if(state.region==="coast"){
      for(let x=-7;x<=-5;x++)tileTop(x,4,.04,"#8e623c",1);
      const pier=iso(-5.5,4.5);ctx.fillStyle="#70462c";for(let i=0;i<4;i++)ctx.fillRect(pier.x-45+i*28,pier.y+8,4,27);
      ctx.strokeStyle="rgba(195,244,255,.75)";ctx.lineWidth=2;for(let i=0;i<5;i++){const a=iso(-6.5+i*.8,-4.4);ctx.beginPath();ctx.arc(a.x,a.y+12,10,0,Math.PI);ctx.stroke();}
      const boat=iso(-5.8,-4.8);ctx.fillStyle="#f1e5c9";ctx.beginPath();ctx.moveTo(boat.x-22,boat.y);ctx.lineTo(boat.x+23,boat.y);ctx.lineTo(boat.x+13,boat.y+10);ctx.lineTo(boat.x-13,boat.y+10);ctx.closePath();ctx.fill();ctx.strokeStyle="#d85d4b";ctx.beginPath();ctx.moveTo(boat.x,boat.y);ctx.lineTo(boat.x,boat.y-30);ctx.lineTo(boat.x+18,boat.y-10);ctx.closePath();ctx.stroke();
    }else if(state.region==="alpine"){
      for(const [x,y,s] of [[-5,-3,34],[-6,5,28],[11,-5,38]]){const p=iso(x,y);ctx.fillStyle="#5c6b68";ctx.beginPath();ctx.moveTo(p.x-s,p.y);ctx.lineTo(p.x,p.y-s*1.5);ctx.lineTo(p.x+s,p.y);ctx.closePath();ctx.fill();ctx.fillStyle="#d8e4df";ctx.beginPath();ctx.moveTo(p.x-s*.3,p.y-s);ctx.lineTo(p.x,p.y-s*1.5);ctx.lineTo(p.x+s*.32,p.y-s);ctx.closePath();ctx.fill();}
    }else if(state.region==="desert"){
      for(const [x,y] of [[-5,2],[-6,9],[12,-5]]){const p=iso(x,y);ctx.fillStyle="#39724d";ctx.fillRect(p.x-3,p.y-33,6,34);ctx.fillRect(p.x-13,p.y-25,12,5);ctx.fillRect(p.x+2,p.y-18,12,5);ctx.fillStyle="#8d4939";ctx.beginPath();ctx.ellipse(p.x+18,p.y,17,8,0,0,Math.PI*2);ctx.fill();}
    }else{
      for(const [x,y,color] of [[-6,3,"#ffd35a"],[-5,8,"#ff7fa3"],[12,-5,"#8fd9ff"]]){const p=iso(x,y);ctx.fillStyle=color;for(let i=0;i<5;i++){ctx.beginPath();ctx.arc(p.x+Math.cos(i*1.26)*6,p.y-5+Math.sin(i*1.26)*3,3,0,Math.PI*2);ctx.fill();}}
    }
    ctx.restore();
  }

  function drawRoadMarkings() {
    ctx.save();
    ctx.strokeStyle = "rgba(235,205,92,.62)";
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 8]);
    const a = iso(-2, 15.5), b = iso(27, 15.5);
    ctx.beginPath(); ctx.moveTo(a.x, a.y + 16); ctx.lineTo(b.x, b.y + 16); ctx.stroke();
    ctx.restore();
  }

  function drawFence() {
    ctx.strokeStyle = "#94a7a8";
    ctx.lineWidth = 2;
    const edges = [];
    for (let x = LOT.minX; x <= LOT.maxX; x++) {
      edges.push([x, LOT.minY, x + 1, LOT.minY]);
      if (x < 7 || x > 9) edges.push([x, LOT.maxY + 1, x + 1, LOT.maxY + 1]);
    }
    for (let y = LOT.minY; y <= LOT.maxY; y++) { edges.push([LOT.minX, y, LOT.minX, y + 1]); edges.push([LOT.maxX + 1, y, LOT.maxX + 1, y + 1]); }
    for (const [x1, y1, x2, y2] of edges) {
      const a = iso(x1, y1), b = iso(x2, y2);
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(a.x, a.y - 13); ctx.moveTo(a.x, a.y - 10); ctx.lineTo(b.x, b.y - 10); ctx.lineTo(b.x, b.y); ctx.stroke();
    }
    const gate = iso(8, LOT.maxY + 1);
    ctx.fillStyle = "#ff9d45"; ctx.fillRect(gate.x - 3, gate.y - 26, 6, 26);
  }

  function drawDistrict() {
    drawUsedRideParkingLot();
    drawBuilding(2.3, 9.3, 2.5, 2.2, "#2d5870", "JOB SHACK", "#39a8ff");
    drawBuilding(23, 8, 5, 3.5, "#174f68", "BLUEPRINT FABRICATOR", "#39a8ff");
    drawBuilding(26, 4.5, 2.5, 2.5, "#3f365d", "LEGAL DISTRICT", "#b28cff");
    drawBuilding(19, 11, 3.5, 2.5, "#735320", "SHIPPING DESK", "#f3c753");
    drawBuilding(14.5, 1, 2.4, 3.3, "#48575a", "FREIGHT DEPOT", "#ff9d45");
    const truck = state.shipments.find(shipment => shipment.status === "arrived");
    if (truck) drawTruck(15, 3.2, truck.ride);
  }

  function drawUsedRideParkingLot(){
    ctx.save();
    for(let x=18;x<=25;x++)for(let y=1;y<=7;y++)tileTop(x,y,.01,"#3d474c",1);
    ctx.strokeStyle="rgba(235,220,150,.7)";ctx.lineWidth=2;
    for(let index=0;index<5;index++){
      const a=iso(18.7+index*1.55,6.8),b=iso(18.7+index*1.55,5.7);
      ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
    }
    const sign=iso(21.4,1.2);ctx.fillStyle="#d94f5f";ctx.fillRect(sign.x-46,sign.y-54,92,19);ctx.fillStyle="#e9f3f5";ctx.font="800 9px Inter";ctx.textAlign="center";ctx.fillText("USED RIDE LOT",sign.x,sign.y-41);ctx.fillStyle="#59666b";ctx.fillRect(sign.x-40,sign.y-35,4,35);ctx.fillRect(sign.x+36,sign.y-35,4,35);

    const carousel=iso(19.4,4.4);ctx.fillStyle="#9f3f4f";ctx.beginPath();ctx.ellipse(carousel.x,carousel.y,30,12,0,0,Math.PI*2);ctx.fill();ctx.fillStyle="#f0cf6a";ctx.beginPath();ctx.moveTo(carousel.x-31,carousel.y-22);ctx.lineTo(carousel.x,carousel.y-43);ctx.lineTo(carousel.x+31,carousel.y-22);ctx.closePath();ctx.fill();ctx.strokeStyle="#e8edf0";ctx.lineWidth=3;for(const dx of [-18,0,18]){ctx.beginPath();ctx.moveTo(carousel.x+dx,carousel.y-24);ctx.lineTo(carousel.x+dx,carousel.y-2);ctx.stroke();ctx.fillStyle="#68b9cc";ctx.fillRect(carousel.x+dx-6,carousel.y-12,12,6);}

    const wheel=iso(22.3,3);ctx.strokeStyle="#57b6cf";ctx.lineWidth=4;ctx.beginPath();ctx.arc(wheel.x,wheel.y-31,32,0,Math.PI*2);ctx.stroke();ctx.strokeStyle="#c9dadd";ctx.lineWidth=2;for(let i=0;i<8;i++){const angle=i*Math.PI/4,x=wheel.x+Math.cos(angle)*32,y=wheel.y-31+Math.sin(angle)*32;ctx.beginPath();ctx.moveTo(wheel.x,wheel.y-31);ctx.lineTo(x,y);ctx.stroke();ctx.fillStyle=i%2?"#f1be55":"#e66372";ctx.fillRect(x-5,y-3,10,7);}ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(wheel.x-20,wheel.y+10);ctx.lineTo(wheel.x,wheel.y-31);ctx.lineTo(wheel.x+20,wheel.y+10);ctx.stroke();

    const swinger=iso(24.3,5);ctx.strokeStyle="#d9e2e3";ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(swinger.x,swinger.y);ctx.lineTo(swinger.x,swinger.y-48);ctx.stroke();ctx.fillStyle="#678cb8";ctx.beginPath();ctx.ellipse(swinger.x,swinger.y-48,27,8,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle="#e6c96b";ctx.lineWidth=1;for(let i=0;i<6;i++){const angle=i*Math.PI/3,x=swinger.x+Math.cos(angle)*25,y=swinger.y-48+Math.sin(angle)*6;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(angle)*10,y+24);ctx.stroke();ctx.fillStyle="#d95f68";ctx.fillRect(x+Math.cos(angle)*10-4,y+21,8,5);}

    const train=iso(21.2,6.3);ctx.strokeStyle="#adb9bd";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(train.x-42,train.y+5);ctx.lineTo(train.x+42,train.y-16);ctx.stroke();for(let i=0;i<3;i++){const x=train.x-27+i*27,y=train.y-i*7;ctx.fillStyle=i?"#dc6a4e":"#f0c657";ctx.fillRect(x-11,y-13,22,11);ctx.fillStyle="#13252f";ctx.beginPath();ctx.arc(x-6,y,4,0,Math.PI*2);ctx.arc(x+7,y-3,4,0,Math.PI*2);ctx.fill();}
    if((state.parkingCashFound||0)<3){const p=iso(24.8,7);ctx.fillStyle="#69f0a9";ctx.shadowColor="#69f0a9";ctx.shadowBlur=12;ctx.font="800 13px Inter";ctx.textAlign="center";ctx.fillText("$",p.x,p.y-8);ctx.shadowBlur=0;}
    ctx.restore();
  }

  function drawBuilding(x, y, w, h, color, label, accent) {
    const p = iso(x, y);
    const right = iso(x + w, y), down = iso(x, y + h), far = iso(x + w, y + h);
    const roofY = 48;
    ctx.beginPath(); ctx.moveTo(p.x, p.y - roofY); ctx.lineTo(right.x, right.y - roofY); ctx.lineTo(far.x, far.y - roofY); ctx.lineTo(down.x, down.y - roofY); ctx.closePath(); ctx.fillStyle = shade(color, 25); ctx.fill();
    ctx.beginPath(); ctx.moveTo(down.x, down.y - roofY); ctx.lineTo(far.x, far.y - roofY); ctx.lineTo(far.x, far.y); ctx.lineTo(down.x, down.y); ctx.closePath(); ctx.fillStyle = shade(color, -25); ctx.fill();
    ctx.beginPath(); ctx.moveTo(right.x, right.y - roofY); ctx.lineTo(far.x, far.y - roofY); ctx.lineTo(far.x, far.y); ctx.lineTo(right.x, right.y); ctx.closePath(); ctx.fillStyle = color; ctx.fill();
    ctx.strokeStyle = accent; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(p.x, p.y - roofY); ctx.lineTo(right.x, right.y - roofY); ctx.stroke();
    const center = iso(x + w / 2, y + h / 2);
    ctx.fillStyle = "rgba(4,13,20,.78)"; ctx.fillRect(center.x - label.length * 3.2, center.y - roofY - 23, label.length * 6.4, 16);
    ctx.fillStyle = "#eaf8fd"; ctx.font = "700 8px Inter"; ctx.textAlign = "center"; ctx.fillText(label, center.x, center.y - roofY - 12);
  }

  function drawTruck(x, y, rideId) {
    const p = iso(x, y);
    ctx.fillStyle = "#d88d32"; ctx.fillRect(p.x - 28, p.y - 34, 50, 24);
    ctx.fillStyle = "#172d3a"; ctx.fillRect(p.x + 17, p.y - 29, 24, 19);
    ctx.fillStyle = "#111";
    for (const dx of [-17, 26]) { ctx.beginPath(); ctx.arc(p.x + dx, p.y - 7, 6, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = "#fff"; ctx.font = "700 7px Inter"; ctx.textAlign = "center"; ctx.fillText(RIDES[rideId]?.name.toUpperCase() || "FREIGHT", p.x, p.y - 20);
  }

  function drawLotObjects() {
    const sorted = [...state.objects].sort((a, b) => (a.x + a.y + a.z * 2) - (b.x + b.y + b.z * 2));
    for (const object of sorted) drawObject(object);
  }

  function drawObject(object) {
    const item = getItem(object.type);
    if (!item) return;
    if (selected === object.id && (auraOverlay || penaltyOverlay) && item.aura) drawInfluence(object, item);
    if (item.kind === "path" || item.kind === "queue") return drawPath(object, item);
    if (item.kind === "block") return drawBlock(object.x, object.y, object.z, "#596d73");
    if (item.kind === "vertical") return drawVertical(object, item);
    if (item.kind === "ride") return drawRide(object, item);
    if (["food", "restroom", "service", "venue", "shop", "rest"].includes(item.kind)) return drawFacility(object, item);
    if (item.kind === "decor") return drawDecor(object, item);
  }

  function drawInfluence(object,item){
    const color=penaltyOverlay&&["restroom","food"].includes(item.kind)?"#ff5368":"#ff9d45";
    ctx.save();ctx.globalAlpha=.26;ctx.fillStyle=color;
    for(let dx=-item.aura;dx<=item.aura;dx++)for(let dy=-item.aura;dy<=item.aura;dy++)if(Math.abs(dx)+Math.abs(dy)<=item.aura)tileTop(object.x+dx,object.y+dy,object.z+.01,color,.12);
    ctx.restore();
  }

  function drawPath(object, item) {
    const colors = { pathConcrete: "#879094", pathWood: "#9f7950", pathLed: "#244e63", queueStandard: "#596a73", queueBridge: "#525b78", queueAtmos: "#293951" };
    tileTop(object.x, object.y, object.z + .03, colors[object.type] || "#777");
    const p = iso(object.x, object.y, object.z + .03);
    if (item.kind === "queue") {
      ctx.strokeStyle = object.type === "queueAtmos" ? "#8c6ce8" : "#d9c26d"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(p.x - 20, p.y + 12); ctx.lineTo(p.x + 10, p.y + 27); ctx.moveTo(p.x - 9, p.y + 5); ctx.lineTo(p.x + 21, p.y + 20); ctx.stroke();
    }
    if (object.type === "pathLed") { ctx.strokeStyle = "#54dfff"; ctx.beginPath(); ctx.moveTo(p.x - 20, p.y + 16); ctx.lineTo(p.x, p.y + 26); ctx.stroke(); }
    if ((object.dirt || 0) > 35) { ctx.fillStyle = "#5f4f3f"; ctx.beginPath(); ctx.arc(p.x + 4, p.y + 17, 3, 0, Math.PI * 2); ctx.fill(); }
  }

  function drawVertical(object, item) {
    const p = iso(object.x, object.y, object.z);
    ctx.save(); ctx.translate(p.x, p.y + 25); ctx.rotate(-.46);
    ctx.fillStyle = item.id === "escalator" ? "#3d6476" : "#77868b"; ctx.fillRect(-22, -8, 45, 15);
    ctx.strokeStyle = item.id === "escalator" ? "#49c6ed" : "#c7d0d2";
    for (let x = -18; x < 22; x += 7) { ctx.beginPath(); ctx.moveTo(x, -7); ctx.lineTo(x, 7); ctx.stroke(); }
    ctx.restore();
  }

  function drawRide(object, item) {
    if(object.track?.length)return drawTrackedCoaster(object,item);
    const p = iso(object.x + item.w / 2, object.y + item.h / 2, object.z);
    const pulse = Math.sin(performance.now() / 280) * 2;
    if (object.state === "blueprint") {
      ctx.globalAlpha = .42; ctx.fillStyle = "#30ffab"; ctx.beginPath(); ctx.ellipse(p.x, p.y, item.w * 20, item.h * 10, 0, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
      ctx.strokeStyle = "#63ffc1"; ctx.setLineDash([5, 4]); ctx.stroke(); ctx.setLineDash([]);
      drawWorldLabel(p.x, p.y - 33, "AUTHORIZE CONSTRUCTION", "#53d998"); return;
    }
    if (object.state === "constructing") {
      ctx.strokeStyle = "#ffc45e"; ctx.lineWidth = 3; ctx.strokeRect(p.x - item.w * 18, p.y - 40, item.w * 36, 35);
      for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(p.x - 45 + i * 28, p.y - 40); ctx.lineTo(p.x - 30 + i * 28, p.y); ctx.stroke(); }
      drawWorldLabel(p.x, p.y - 55, `ASSEMBLY ${Math.ceil(object.buildRemaining)}s`, "#ffb456"); return;
    }
    ctx.fillStyle = "rgba(0,0,0,.25)"; ctx.beginPath(); ctx.ellipse(p.x, p.y + 16, item.w * 21, item.h * 10, 0, 0, Math.PI * 2); ctx.fill();
    if (item.family === "Dark Ride") {
      const width=item.w*28,height=item.h*11;
      ctx.fillStyle=shade(item.color,-55);ctx.fillRect(p.x-width/2,p.y-height-48,width,height+48);
      ctx.fillStyle=shade(item.color,-20);ctx.beginPath();ctx.moveTo(p.x-width/2-6,p.y-height-48);ctx.lineTo(p.x,p.y-height-68);ctx.lineTo(p.x+width/2+6,p.y-height-48);ctx.closePath();ctx.fill();
      ctx.strokeStyle=item.color;ctx.lineWidth=2;ctx.strokeRect(p.x-width/2+8,p.y-height-35,width-16,25);
      ctx.fillStyle="#07121e";ctx.font="700 9px Inter";ctx.textAlign="center";ctx.fillText(item.icon,p.x,p.y-height-18);
    } else if (object.type === "skywheel") {
      const spin=object.open?performance.now()/5000:0,radius=42;
      ctx.strokeStyle="#d9edf0";ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(p.x-26,p.y+22);ctx.lineTo(p.x,p.y-42);ctx.lineTo(p.x+26,p.y+22);ctx.stroke();
      ctx.strokeStyle=item.color;ctx.lineWidth=4;ctx.beginPath();ctx.arc(p.x,p.y-42,radius,0,Math.PI*2);ctx.stroke();
      for(let i=0;i<8;i++){const angle=spin+i*Math.PI/4,x=p.x+Math.cos(angle)*radius,y=p.y-42+Math.sin(angle)*radius;ctx.strokeStyle="rgba(230,245,248,.6)";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(p.x,p.y-42);ctx.lineTo(x,y);ctx.stroke();ctx.fillStyle=i%2?item.color:"#fff1a8";ctx.fillRect(x-6,y-3,12,7);}
    } else if (["carousel", "wave", "spinner", "skid", "whirlybird", "bumper", "dropTower"].includes(object.type)) {
      ctx.fillStyle = shade(item.color, -35); ctx.beginPath(); ctx.ellipse(p.x, p.y + 6, Math.max(28, item.w * 18), Math.max(14, item.h * 9), 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = item.color; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(p.x, p.y + 2, Math.max(22, item.w * 15), Math.max(11, item.h * 7), 0, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = "#dcecf0"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(p.x, p.y + 4); ctx.lineTo(p.x, p.y - 47 - (object.open ? pulse : 0)); ctx.stroke();
      for (let i = 0; i < 6; i++) { const angle = i * Math.PI / 3 + (object.open ? performance.now() / 900 : 0); const x = p.x + Math.cos(angle) * 34, y = p.y + Math.sin(angle) * 16 - 8; ctx.fillStyle = i % 2 ? item.color : "#e8f5f6"; ctx.fillRect(x - 5, y - 4, 10, 8); }
    } else {
      ctx.strokeStyle = item.color; ctx.lineWidth = 6; ctx.beginPath(); ctx.ellipse(p.x, p.y - 5, item.w * 22, item.h * 12, -.05, .2, Math.PI * 1.9); ctx.stroke();
      ctx.strokeStyle = "#263945"; ctx.lineWidth = 2; ctx.stroke();
      for (let i = 0; i < 5; i++) { ctx.strokeStyle = "#7d8d92"; ctx.beginPath(); ctx.moveTo(p.x - item.w * 18 + i * item.w * 9, p.y); ctx.lineTo(p.x - item.w * 18 + i * item.w * 9, p.y + 30); ctx.stroke(); }
      if (object.type === "hydro") { ctx.strokeStyle = "#54d7ef"; ctx.lineWidth = 10; ctx.beginPath(); ctx.ellipse(p.x, p.y, item.w * 17, item.h * 8, 0, 0, Math.PI * 2); ctx.stroke(); }
      if(object.open){const angle=performance.now()/900,x=p.x+Math.cos(angle)*item.w*19,y=p.y-5+Math.sin(angle)*item.h*10;ctx.fillStyle=object.type==="safari"?"#d59c4f":item.color;ctx.fillRect(x-10,y-5,20,9);ctx.fillStyle="#e9f5f4";ctx.fillRect(x-6,y-8,5,4);ctx.fillRect(x+2,y-8,5,4);}
    }
    const displayName=object.customName||item.name;
    if (object.broken) drawWorldLabel(p.x, p.y - 67, "⚠ RIDE SHUTDOWN", "#ff5368");
    else if (object.open) drawWorldLabel(p.x, p.y - 67, `${displayName.toUpperCase()} · OPEN`, "#53d998");
    else drawWorldLabel(p.x, p.y - 67, `${displayName.toUpperCase()} · CLOSED`, "#91aab6");
    if(object.broken){ctx.strokeStyle="#ffd35a";ctx.lineWidth=2;for(let i=0;i<5;i++){const angle=performance.now()/120+i*1.7;ctx.beginPath();ctx.moveTo(p.x,p.y-28);ctx.lineTo(p.x+Math.cos(angle)*18,p.y-28+Math.sin(angle)*13);ctx.stroke();}}
  }

  function drawTrackedCoaster(object,item){
    const nodes=object.track;
    ctx.save();ctx.lineCap="round";ctx.lineJoin="round";
    for(const node of nodes){if(node.z>0){const top=iso(node.x+.5,node.y+.5,node.z),ground=iso(node.x+.5,node.y+.5,0);ctx.strokeStyle="rgba(80,96,104,.8)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(top.x,top.y+10);ctx.lineTo(ground.x,ground.y+12);ctx.stroke();}}
    ctx.strokeStyle=object.state==="blueprint"?"rgba(75,255,181,.6)":item.color;ctx.lineWidth=item.id==="hydro"?10:6;ctx.setLineDash(object.state==="blueprint"?[7,5]:[]);ctx.beginPath();
    nodes.forEach((node,index)=>{const p=iso(node.x+.5,node.y+.5,node.z);index?ctx.lineTo(p.x,p.y+12):ctx.moveTo(p.x,p.y+12);});ctx.stroke();
    for(let index=1;index<nodes.length;index++){const a=nodes[index-1],b=nodes[index];if(a.z>=0&&b.z>=0)continue;const pa=iso(a.x+.5,a.y+.5,a.z),pb=iso(b.x+.5,b.y+.5,b.z);ctx.strokeStyle="rgba(12,26,33,.9)";ctx.lineWidth=item.id==="hydro"?13:9;ctx.setLineDash([5,5]);ctx.beginPath();ctx.moveTo(pa.x,pa.y+12);ctx.lineTo(pb.x,pb.y+12);ctx.stroke();ctx.strokeStyle="#66b7ae";ctx.lineWidth=2;ctx.stroke();ctx.setLineDash([]);}
    ctx.strokeStyle=object.state==="blueprint"?"rgba(225,255,241,.55)":"#d4e2e5";ctx.lineWidth=1.5;ctx.beginPath();nodes.forEach((node,index)=>{const p=iso(node.x+.5,node.y+.5,node.z);index?ctx.lineTo(p.x,p.y+9):ctx.moveTo(p.x,p.y+9);});ctx.stroke();ctx.setLineDash([]);
    if(object.open&&nodes.length>1){const cars=clamp(object.cars||3,1,5);for(let car=0;car<cars;car++){const progress=((performance.now()/90)-car*.28+nodes.length)%nodes.length,index=Math.floor(progress),next=(index+1)%nodes.length,t=progress-index,a=iso(nodes[index].x+.5,nodes[index].y+.5,nodes[index].z),b=iso(nodes[next].x+.5,nodes[next].y+.5,nodes[next].z),x=a.x+(b.x-a.x)*t,y=a.y+(b.y-a.y)*t;ctx.fillStyle=item.id==="hydro"?"#e8b75d":car?item.color:"#f5f8f8";ctx.fillRect(x-7,y+2,14,8);ctx.fillStyle="#122937";ctx.fillRect(x-4,y,8,4);if(nodes[index].z<0){ctx.fillStyle="rgba(255,237,147,.4)";ctx.beginPath();ctx.arc(x,y+5,10,0,Math.PI*2);ctx.fill();}}}
    const center=nodes.reduce((sum,node)=>({x:sum.x+node.x,y:sum.y+node.y,z:sum.z+node.z}),{x:0,y:0,z:0});center.x/=nodes.length;center.y/=nodes.length;center.z/=nodes.length;const label=iso(center.x+.5,center.y+.5,center.z);
    const display=object.customName||item.name;if(object.broken)drawWorldLabel(label.x,label.y-45,"⚠ SAFE SHUTDOWN","#ff5368");else if(object.state==="blueprint")drawWorldLabel(label.x,label.y-45,"AUTHORIZE TRACK CONSTRUCTION","#53d998");else if(object.state==="constructing")drawWorldLabel(label.x,label.y-45,`TRACK ASSEMBLY ${Math.ceil(object.buildRemaining)}s`,"#ffb456");else drawWorldLabel(label.x,label.y-45,`${display.toUpperCase()} · ${object.open?"OPEN":"CLOSED"}`,object.open?"#53d998":"#91aab6");
    if(object.broken){for(let i=0;i<5;i++){const px=label.x+Math.sin(performance.now()/250+i)*10,py=label.y-35-i*7;ctx.fillStyle=`rgba(170,190,195,${.5-i*.07})`;ctx.beginPath();ctx.arc(px,py,5+i*2,0,Math.PI*2);ctx.fill();}}
    ctx.restore();
  }

  function drawFacility(object, item) {
    const p = iso(object.x, object.y, object.z);
    const w = item.w || 1, h = item.h || 1, far = iso(object.x + w, object.y + h, object.z);
    const center = { x: (p.x + far.x) / 2, y: (p.y + far.y) / 2 };
    const color = item.kind === "food" ? "#b15b31" : item.kind === "restroom" ? "#3d7588" : item.kind === "venue" ? "#553b87" : item.kind === "shop" ? "#a55a76" : item.kind === "rest" ? "#3f8065" : "#3c5d64";
    ctx.fillStyle = shade(color, -25); ctx.fillRect(center.x - w * 16, center.y - 35, w * 32, 35);
    ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(center.x - w * 19, center.y - 35); ctx.lineTo(center.x, center.y - 48); ctx.lineTo(center.x + w * 19, center.y - 35); ctx.lineTo(center.x, center.y - 22); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#eaf6f8"; ctx.font = `700 ${item.id === "restroomSingle" ? 7 : 9}px Inter`; ctx.textAlign = "center"; ctx.fillText(item.icon, center.x, center.y - 16);
    if (item.id === "fry" || item.id === "wok") { ctx.strokeStyle = "rgba(255,220,160,.55)"; for (let i=0;i<3;i++){ctx.beginPath();ctx.arc(center.x+i*6-6,center.y-50-i*2,6+i*2,Math.PI,Math.PI*2);ctx.stroke();} }
    if(item.kind==="venue"){ctx.strokeStyle="#dd7dff";ctx.lineWidth=2;ctx.strokeRect(center.x-w*13,center.y-31,w*26,15);for(let i=0;i<4;i++){ctx.fillStyle=i%2?"#53d998":"#f3c753";ctx.fillRect(center.x-18+i*12,center.y-28,5,5);}}
  }

  function drawDecor(object, item) {
    const p = iso(object.x + (item.w || 1) / 2, object.y + (item.h || 1) / 2, object.z);
    if (item.id === "lantern") { ctx.fillStyle = "rgba(255,211,98,.2)"; ctx.beginPath(); ctx.arc(p.x, p.y - 15, 18, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#ffd96b"; ctx.fillRect(p.x - 3, p.y - 22, 6, 8); }
    else if (item.id === "tree") { ctx.fillStyle = "#564430"; ctx.fillRect(p.x - 3, p.y - 30, 6, 32); ctx.fillStyle = "#2f704c"; for (let i=0;i<3;i++){ctx.beginPath();ctx.arc(p.x+(i-1)*8,p.y-38-i*4,13,0,Math.PI*2);ctx.fill();} }
    else if (item.id === "dino") { ctx.strokeStyle = "#ded8b5"; ctx.lineWidth = 4; ctx.beginPath();ctx.moveTo(p.x-45,p.y-5);ctx.quadraticCurveTo(p.x,p.y-70,p.x+48,p.y-18);ctx.stroke();for(let i=0;i<5;i++){ctx.beginPath();ctx.moveTo(p.x-24+i*12,p.y-39);ctx.lineTo(p.x-20+i*12,p.y-14);ctx.stroke();} }
    else if(item.id==="dock"){ctx.fillStyle="#94633d";ctx.fillRect(p.x-52,p.y-18,104,20);ctx.strokeStyle="#d2a66f";ctx.lineWidth=2;for(let i=-45;i<50;i+=15){ctx.beginPath();ctx.moveTo(p.x+i,p.y-17);ctx.lineTo(p.x+i,p.y+1);ctx.stroke();}ctx.fillStyle="#65442f";ctx.fillRect(p.x-45,p.y,5,17);ctx.fillRect(p.x+40,p.y,5,17);}
    else if(item.id==="palm"){ctx.strokeStyle="#7e5c39";ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.quadraticCurveTo(p.x-4,p.y-25,p.x+5,p.y-48);ctx.stroke();ctx.strokeStyle="#3c8b59";ctx.lineWidth=5;for(let i=0;i<7;i++){const a=i*Math.PI*2/7;ctx.beginPath();ctx.moveTo(p.x+5,p.y-48);ctx.lineTo(p.x+5+Math.cos(a)*22,p.y-48+Math.sin(a)*9);ctx.stroke();}}
    else if(item.id==="lighthouse"){ctx.fillStyle="#ece9dc";ctx.beginPath();ctx.moveTo(p.x-15,p.y);ctx.lineTo(p.x-10,p.y-55);ctx.lineTo(p.x+10,p.y-55);ctx.lineTo(p.x+15,p.y);ctx.closePath();ctx.fill();ctx.fillStyle="#d85d4b";ctx.fillRect(p.x-12,p.y-43,24,9);ctx.fillRect(p.x-14,p.y-61,28,9);ctx.fillStyle="#ffe68a";ctx.beginPath();ctx.arc(p.x,p.y-65,7,0,Math.PI*2);ctx.fill();const sweep=performance.now()/900;ctx.fillStyle="rgba(255,235,150,.13)";ctx.beginPath();ctx.moveTo(p.x,p.y-65);ctx.lineTo(p.x+Math.cos(sweep)*100,p.y-65+Math.sin(sweep)*35);ctx.lineTo(p.x+Math.cos(sweep+.2)*100,p.y-65+Math.sin(sweep+.2)*35);ctx.closePath();ctx.fill();}
    else if(item.id==="umbrella"){for(let i=-1;i<=1;i++){ctx.strokeStyle="#d5e0df";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(p.x+i*24,p.y);ctx.lineTo(p.x+i*24,p.y-24);ctx.stroke();ctx.fillStyle=i%2?"#4cc3d9":"#ff7d6f";ctx.beginPath();ctx.arc(p.x+i*24,p.y-24,13,Math.PI,Math.PI*2);ctx.fill();}}
    else if(item.id==="fountain"){ctx.fillStyle="#447487";ctx.beginPath();ctx.ellipse(p.x,p.y,32,13,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle="#70dcf0";ctx.lineWidth=3;for(let i=-2;i<=2;i++){ctx.beginPath();ctx.moveTo(p.x+i*9,p.y-3);ctx.quadraticCurveTo(p.x+i*6,p.y-30-Math.abs(i)*3,p.x,p.y-8);ctx.stroke();}}
    else if(item.id==="mascotStage"){ctx.fillStyle="#67406e";ctx.fillRect(p.x-45,p.y-25,90,25);ctx.fillStyle="#f1c85e";ctx.fillRect(p.x-38,p.y-32,76,8);ctx.fillStyle="#ff8da1";ctx.beginPath();ctx.arc(p.x,p.y-43,10,0,Math.PI*2);ctx.fill();ctx.fillStyle="#eee";ctx.fillRect(p.x-7,p.y-33,14,19);}
    else if(item.id==="tunnelPortal"){ctx.strokeStyle="#817e78";ctx.lineWidth=10;ctx.beginPath();ctx.arc(p.x,p.y,27,Math.PI,Math.PI*2);ctx.stroke();ctx.fillStyle="#10171b";ctx.beginPath();ctx.arc(p.x,p.y,20,Math.PI,Math.PI*2);ctx.fill();ctx.fillRect(p.x-20,p.y-2,40,8);}
    else if(item.id==="neonArch"){ctx.strokeStyle="#63e8ff";ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(p.x-26,p.y);ctx.lineTo(p.x-26,p.y-30);ctx.quadraticCurveTo(p.x,p.y-55,p.x+26,p.y-30);ctx.lineTo(p.x+26,p.y);ctx.stroke();ctx.strokeStyle="#ff6bd8";ctx.lineWidth=2;ctx.stroke();}
    else { ctx.fillStyle = "#284454"; ctx.fillRect(p.x - 20, p.y - 32, 40, 31); ctx.fillStyle = "#f6d8a4"; ctx.beginPath();ctx.arc(p.x,p.y-18,10,0,Math.PI*2);ctx.fill(); }
  }

  function drawWorldLabel(x, y, text, color) {
    ctx.font = "700 7px Inter"; const width = ctx.measureText(text).width + 12;
    ctx.fillStyle = "rgba(4,14,22,.82)"; ctx.fillRect(x - width / 2, y - 10, width, 16);
    ctx.strokeStyle = color; ctx.strokeRect(x - width / 2, y - 10, width, 16);
    ctx.fillStyle = color; ctx.textAlign = "center"; ctx.fillText(text, x, y + 1);
  }

  function drawGuests() {
    for (const guest of guests) {
      const p = iso(guest.x, guest.y, guest.z || 0);
      ctx.fillStyle = "rgba(0,0,0,.2)"; ctx.beginPath();ctx.ellipse(p.x,p.y+7,5,2,0,0,Math.PI*2);ctx.fill();
      ctx.fillStyle = guest.color; ctx.beginPath();ctx.arc(p.x,p.y-5,4,0,Math.PI*2);ctx.fill();ctx.fillRect(p.x-3,p.y-2,6,9);
      if (guest.thought) { ctx.fillStyle = guest.thoughtColor || "#fff"; ctx.font="700 9px Inter";ctx.textAlign="center";ctx.fillText(guest.thought,p.x,p.y-15); }
    }
  }

  function drawPlayer() {
    const p = iso(state.player.x, state.player.y, state.player.z);
    ctx.strokeStyle = "#f3c753"; ctx.lineWidth = 2; ctx.beginPath();ctx.ellipse(p.x,p.y+7,10,5,0,0,Math.PI*2);ctx.stroke();
    ctx.fillStyle = "#132633";ctx.fillRect(p.x-5,p.y-9,10,16);ctx.fillStyle="#e5a37a";ctx.beginPath();ctx.arc(p.x,p.y-13,6,0,Math.PI*2);ctx.fill();
    ctx.fillStyle="#39a8ff";ctx.beginPath();ctx.moveTo(p.x-7,p.y-4);ctx.lineTo(p.x+7,p.y-4);ctx.lineTo(p.x,p.y+8);ctx.closePath();ctx.fill();
    if (walkMode) drawWorldLabel(p.x,p.y-34,state.profile ? state.profile.toUpperCase() : "PARK MANAGER","#f3c753");
  }

  function drawPreview() {
    if (walkMode || !state.activeTool || !hoverTile) return;
    if(state.activeTool.startsWith("track:")){drawTrackDraft(hoverTile);return;}
    if(state.activeTool.startsWith("prebuilt:")){drawPrebuiltPreview(hoverTile);return;}
    const item = getItem(state.activeTool);
    if (!item) return;
    const valid = validatePlacement(item, hoverTile.x, hoverTile.y, state.buildLevel);
    const w = item.w || 1, h = item.h || 1;
    for (let dx=0;dx<w;dx++) for(let dy=0;dy<h;dy++) tileTop(hoverTile.x+dx,hoverTile.y+dy,state.buildLevel+.08,valid.ok?"#33e79a":"#ff4f62",.42);
    const p=iso(hoverTile.x+w/2,hoverTile.y+h/2,state.buildLevel);
    drawWorldLabel(p.x,p.y-20,valid.ok?`✓ ${money(item.cost)}`:`✕ ${valid.reason}`,valid.ok?"#53d998":"#ff5368");
  }

  function drawTrackDraft(cursor){
    if(!trackDraft)return;const item=RIDES[trackDraft.rideId],nodes=[...trackDraft.nodes,cursor];
    ctx.save();ctx.strokeStyle="#51f0b0";ctx.lineWidth=5;ctx.setLineDash([7,5]);ctx.beginPath();nodes.forEach((node,index)=>{const p=iso(node.x+.5,node.y+.5,node.z??state.buildLevel);index?ctx.lineTo(p.x,p.y+12):ctx.moveTo(p.x,p.y+12);});ctx.stroke();ctx.setLineDash([]);
    for(const node of trackDraft.nodes){const p=iso(node.x+.5,node.y+.5,node.z);ctx.fillStyle="#dfffee";ctx.beginPath();ctx.arc(p.x,p.y+12,4,0,Math.PI*2);ctx.fill();}
    const validation=validateTrackNodes(nodes,item,false),p=iso(cursor.x+.5,cursor.y+.5,cursor.z??state.buildLevel);drawWorldLabel(p.x,p.y-15,validation.ok?`NODE ${nodes.length} · ENTER TO FINISH`:`✕ ${validation.reason}`,validation.ok?"#53d998":"#ff5368");ctx.restore();
  }

  function drawPrebuiltPreview(origin){
    if(!trackDraft)return;const layout=TRACK_LAYOUTS[trackDraft.layoutId],item=RIDES[trackDraft.rideId],nodes=layout.nodes.map(([x,y,z])=>({x:origin.x+x,y:origin.y+y,z})),validation=validateTrackNodes(nodes,item,true);
    ctx.save();ctx.strokeStyle=validation.ok?"rgba(74,255,180,.75)":"rgba(255,75,95,.75)";ctx.lineWidth=6;ctx.setLineDash([8,5]);ctx.beginPath();nodes.forEach((node,index)=>{const p=iso(node.x+.5,node.y+.5,node.z);index?ctx.lineTo(p.x,p.y+12):ctx.moveTo(p.x,p.y+12);});ctx.stroke();ctx.setLineDash([]);const p=iso(origin.x+layout.w/2,origin.y+layout.h/2,0);drawWorldLabel(p.x,p.y-32,validation.ok?`✓ ${layout.name.toUpperCase()}`:`✕ ${validation.reason}`,validation.ok?"#53d998":"#ff5368");ctx.restore();
  }

  function footprint(item, x, y) {
    const w = item.w || 1, h = item.h || 1;
    const cells = [];
    for (let dx = 0; dx < w; dx++) for (let dy = 0; dy < h; dy++) cells.push([x + dx, y + dy]);
    return cells;
  }
  function reservedCell(x,y){return (x>=2&&x<=5&&y>=9&&y<=12)||(x>=14&&x<=16&&y>=1&&y<=4);}

  function objectCovers(object, x, y, z = object.z) {
    const item = getItem(object.type);
    if (!item) return false;
    if(object.track?.length)return object.track.some(node=>node.x===x&&node.y===y&&node.z===z);
    if(object.z !== z)return false;
    return footprint(item, object.x, object.y).some(([cx, cy]) => cx === x && cy === y);
  }

  function validateTrackNodes(nodes,item,complete=false){
    if(!nodes.length)return{ok:true};let speed=item.id==="neon"?7:4;
    for(let index=0;index<nodes.length;index++){
      const node=nodes[index];
      if(node.x<LOT.minX||node.x>LOT.maxX||node.y<LOT.minY||node.y>LOT.maxY)return{ok:false,reason:"Track outside park boundary"};
      if(reservedCell(node.x,node.y))return{ok:false,reason:"Municipal structure clearance violated"};
      if(node.z< -3||node.z>item.maxHeight)return{ok:false,reason:`Height Limit: B3 to ${levelLabel(item.maxHeight)}`};
      const stairCollision=state.objects.find(object=>getItem(object.type)?.kind==="vertical"&&object.x===node.x&&object.y===node.y&&Math.abs(object.z-node.z)<=1);
      if(stairCollision)return{ok:false,reason:"Vertical Collision: Stair Clearance Violated"};
      const collision=state.objects.find(object=>objectCovers(object,node.x,node.y,node.z)&&!["path","queue"].includes(getItem(object.type)?.kind));
      if(collision)return{ok:false,reason:getItem(collision.type)?.kind==="vertical"?"Vertical Collision: Stair Clearance Violated":`Collision: ${getItem(collision.type)?.name}`};
      if(index){const previous=nodes[index-1],horizontal=Math.abs(node.x-previous.x)+Math.abs(node.y-previous.y),rise=node.z-previous.z;
        const closing=index===nodes.length-1&&node.x===nodes[0].x&&node.y===nodes[0].y&&node.z===nodes[0].z;
        if(!closing&&horizontal<1)return{ok:false,reason:"Track nodes overlap"};
        if(horizontal>2)return{ok:false,reason:"Track segment exceeds 2 grid units"};
        if(Math.abs(rise)>1)return{ok:false,reason:"Vertical step exceeds one level"};
        speed-=horizontal*(item.id==="hairpin"?.08:.12);if(rise>0)speed-=rise*1.15;if(rise<0)speed+=Math.abs(rise)*.65;if(item.id==="timber"&&rise>0)speed=Math.max(speed,3.2);
        if(speed<.65)return{ok:false,reason:"Friction Lock: Train Insufficient Speed"};
        if(speed*12>item.maxSpeed)return{ok:false,reason:`Speed Limit: ${item.maxSpeed} mph exceeded`};
      }
    }
    if(complete){if(nodes.length<6)return{ok:false,reason:"Track needs at least 6 nodes"};const first=nodes[0],last=nodes.at(-1);if(first.x!==last.x||first.y!==last.y||first.z!==last.z)return{ok:false,reason:"Track circuit must return to its station"};}
    return{ok:true,speed:Math.round(speed*12)};
  }

  function openRideNaming(item){
    openModal(modalShell("RIDE IDENTITY REGISTRY",`Name your ${item.name}`,`<p class="modal-copy">Give this individual attraction a park-specific name, or retain its factory designation.</p><input id="rideNameInput" class="name-input" maxlength="32" value="${item.name}">`,`<button class="modal-button" data-close>Cancel</button><button id="confirmRideName" class="modal-button primary">PLACE BLUEPRINT</button>`),()=>{$$("[data-close]").forEach(button=>button.onclick=closeModal);$("#rideNameInput").focus();$("#rideNameInput").select();$("#confirmRideName").onclick=()=>{pendingRideName=$("#rideNameInput").value.trim()||item.name;state.activeTool=item.id;walkMode=false;closeModal();renderBuildItems();updateUI();showWorldMessage(`${pendingRideName} · choose an anchor footprint`);};});
  }

  function openCoasterBuilder(item){
    const layouts=Object.entries(TRACK_LAYOUTS).filter(([,layout])=>layout.ride===item.id);
    openModal(modalShell("CUSTOM TRACK LEDGER",item.name,`<p class="modal-copy">Set the ride name and train size, then sculpt every left, right, rise, drop, and underground tunnel down to B3. Maximum ${item.maxSpeed} mph · maximum height L${item.maxHeight+1}.</p><label class="inspector-label">CUSTOM RIDE NAME</label><input id="coasterName" class="name-input" maxlength="32" value="${item.name}"><label class="inspector-label" style="margin-top:12px">CARTS PER TRAIN</label><select id="coasterCars" class="name-input" style="font-size:15px"><option value="1">1 individual cart</option><option value="2">2 linked carts</option><option value="3" selected>3 linked carts</option><option value="4">4 linked carts</option><option value="5">5 linked carts</option></select><div class="shop-grid" style="margin-top:12px"><article class="shop-card"><header><h3>◇ Custom Track</h3><strong>DIRECTION EDITOR</strong></header><p>Click a station tile, then use the on-screen arrows or WASD. Q dives, E rises, X undoes, and Enter finishes.</p><button data-track-custom>OPEN EDITOR</button></article>${layouts.map(([id,layout])=>`<article class="shop-card"><header><h3>${layout.name}</h3><strong>${layout.w}×${layout.h}</strong></header><p>${layout.description}</p><button data-layout="${id}">USE PREBUILT</button></article>`).join("")}</div>`,`<button class="modal-button" data-close>Cancel</button>`),()=>{
      $$("[data-close]").forEach(button=>button.onclick=closeModal);
      $('[data-track-custom]').onclick=()=>{pendingRideName=$("#coasterName").value.trim()||item.name;trackDraft={rideId:item.id,nodes:[],name:pendingRideName,cars:Number($("#coasterCars").value)||3};state.activeTool=`track:${item.id}`;walkMode=false;closeModal();updateUI();showWorldMessage("Track Editor · click a station tile, then choose every direction");};
      $$('[data-layout]').forEach(button=>button.onclick=()=>{pendingRideName=$("#coasterName").value.trim()||item.name;trackDraft={rideId:item.id,nodes:[],name:pendingRideName,cars:Number($("#coasterCars").value)||3,layoutId:button.dataset.layout};state.activeTool=`prebuilt:${item.id}`;walkMode=false;closeModal();updateUI();showWorldMessage(`${TRACK_LAYOUTS[button.dataset.layout].name} · choose an anchor tile`);});
    });
  }

  function addTrackNode(tile){
    if(!trackDraft)return;const item=getItem(trackDraft.rideId),node={x:tile.x,y:tile.y,z:state.buildLevel},nodes=[...trackDraft.nodes,node],validation=validateTrackNodes(nodes,item,false);
    if(!validation.ok){showWorldMessage(validation.reason);return;}trackDraft.nodes.push(node);$("#dockInstruction").textContent=`Track node ${trackDraft.nodes.length} · ${levelLabel(node.z)} · Enter validates`;updateTrackControls();
  }

  function stepTrackDirection(direction){
    if(!trackDraft||!state.activeTool?.startsWith("track:"))return;
    const last=trackDraft.nodes.at(-1);if(!last){showWorldMessage("Click a grid tile to place the station first");return;}
    const moves={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]},move=moves[direction];if(!move)return;
    addTrackNode({x:last.x+move[0],y:last.y+move[1],z:state.buildLevel});
  }

  function undoTrackNode(){
    if(!trackDraft?.nodes.length)return;trackDraft.nodes.pop();const last=trackDraft.nodes.at(-1);if(last)state.buildLevel=last.z;
    showWorldMessage(`Removed last track node · ${trackDraft.nodes.length} remain`);updateTrackControls();updateUI();
  }

  function updateTrackControls(){
    const active=!!trackDraft&&state.activeTool?.startsWith("track:"),panel=$("#trackControls");panel.classList.toggle("hidden",!active);if(!active)return;
    $("#trackDepthStatus").textContent=levelLabel(state.buildLevel);$("#trackControlStatus").textContent=trackDraft.nodes.length?`${trackDraft.nodes.length} NODES · ${trackDraft.cars||3} CARTS`:"CLICK A STATION TILE";
  }

  function finalizeTrack(){
    if(!trackDraft||!state.activeTool?.startsWith("track:"))return;const item=getItem(trackDraft.rideId),validation=validateTrackNodes(trackDraft.nodes,item,true);if(!validation.ok){showWorldMessage(validation.reason);return;}placeTrackRide(trackDraft.rideId,trackDraft.nodes,trackDraft.name,"Custom Circuit");
  }

  function placePrebuilt(origin){
    if(!trackDraft)return;const layout=TRACK_LAYOUTS[trackDraft.layoutId],nodes=layout.nodes.map(([x,y,z])=>({x:origin.x+x,y:origin.y+y,z})),item=getItem(trackDraft.rideId),validation=validateTrackNodes(nodes,item,true);if(!validation.ok){showWorldMessage(validation.reason);return;}placeTrackRide(trackDraft.rideId,nodes,trackDraft.name,layout.name);
  }

  function placeTrackRide(id,nodes,name,layout){
    const item=getItem(id),ledger=item.ledgerBuild&&(state.rideInventory[id]||0)<1;if(ledger&&state.cash<item.cost){showWorldMessage("Insufficient cash for coaster hardware");return;}if(!ledger&&(state.rideInventory[id]||0)<1){showWorldMessage("Coaster hardware has not been delivered");return;}
    if(ledger){state.cash-=item.cost;state.stats.expenses+=item.cost;}else state.rideInventory[id]--;
    const xs=nodes.map(node=>node.x),ys=nodes.map(node=>node.y),object={id:uid("coaster"),type:id,x:Math.min(...xs),y:Math.min(...ys),z:0,track:nodes.map(node=>({...node})),layout,cars:trackDraft?.cars||3,customName:name||item.name,state:"blueprint",operator:false,open:false,queue:0,cycles:0,condition:100,price:Math.max(6,item.excitement*1.5),revenue:0,upgrades:[]};state.objects.push(object);state.activeTool=null;trackDraft=null;state.buildLevel=0;if(state.tutorial===8)advanceTutorial(9);notify(`${object.customName} anchored`,`${layout} passed track geometry validation. Authorize construction from the inspector.`);selected=object.id;renderInspector(object);renderBuildItems();updateUI();saveTimer=99;save();
  }

  function validatePlacement(item, x, y, z) {
    if (x < LOT.minX || y < LOT.minY || x + (item.w || 1) - 1 > LOT.maxX || y + (item.h || 1) - 1 > LOT.maxY) return { ok: false, reason: "Outside park boundary" };
    if (item.minLevel && z < item.minLevel) return { ok: false, reason: `Requires L${item.minLevel + 1}` };
    const cells = footprint(item, x, y);
    for (const [cx, cy] of cells) {
      if(reservedCell(cx,cy))return {ok:false,reason:"Municipal structure clearance violated"};
      const collision = state.objects.find(object => objectCovers(object, cx, cy, z));
      if (collision) return { ok: false, reason: `Collision: ${getItem(collision.type)?.name || "occupied"}` };
      if (z > 0) {
        const supported = state.objects.some(object => object.type === "foundation" && object.x === cx && object.y === cy && object.z === z - 1)
          || state.objects.some(object => ["restroomMulti"].includes(object.type) && objectCovers(object, cx, cy, z - 1));
        if (!supported && item.kind !== "vertical") return { ok: false, reason: `Unsupported at L${z + 1}` };
      }
    }
    if (item.kind === "vertical" && z >= 5) return { ok: false, reason: "Maximum structural level" };
    if (item.kind === "ride" && (state.rideInventory[item.id] || 0) < 1) return { ok: false, reason: "Blueprint not delivered" };
    if (!item.unlockedBy && !state.toolkit) return { ok: false, reason: "Toolkit required" };
    if (item.unlockedBy && !state.blueprintPacks[item.unlockedBy]) return { ok: false, reason: "Buy blueprint pack" };
    const cost = item.kind === "ride" || (state.materials?.[item.id] || 0) > 0 ? 0 : item.cost;
    if (state.cash < cost) return { ok: false, reason: "Insufficient cash" };
    return { ok: true };
  }

  function placeItem(id, x, y, z = state.buildLevel) {
    const item = getItem(id);
    if (!item) return false;
    if (item.kind === "theme") {
      if (state.cash < item.cost) return notify("Insufficient cash", "Theme application requires more funds.", "warning"), false;
      state.cash -= item.cost; state.stats.expenses += item.cost;
      for (let dx=-2;dx<=2;dx++) for(let dy=-2;dy<=2;dy++) if (x+dx>=LOT.minX&&x+dx<=LOT.maxX&&y+dy>=LOT.minY&&y+dy<=LOT.maxY) state.themes.push({x:x+dx,y:y+dy,type:item.theme});
      state.atmosphere += 8; notify(`${item.name} applied`, "A 5×5 themed zone now affects nearby attractions."); updateUI(); return true;
    }
    const valid = validatePlacement(item, x, y, z);
    if (!valid.ok) { showWorldMessage(valid.reason); return false; }
    const stocked=(state.materials?.[item.id]||0)>0;
    const cost = item.kind === "ride" || stocked ? 0 : item.cost;
    state.cash -= cost; state.stats.expenses += cost;
    if(stocked)state.materials[item.id]--;
    const object = { id: uid("obj"), type: id, x, y, z, rotation, condition: 100, dirt: 0, price: item.price ?? (item.kind === "ride" ? Math.max(3, item.excitement * 1.5) : 0), revenue: 0 };
    if (item.kind === "ride") {
      object.customName=pendingRideName||item.name;pendingRideName="";object.state = "blueprint"; object.operator = false; object.open = false; object.queue = 0; object.cycles = 0;object.upgrades=[];
      state.rideInventory[id]--;
      state.activeTool=null;
      if (state.tutorial === 8) advanceTutorial(9);
    }
    state.objects.push(object);
    if (item.atmosphere) state.atmosphere += item.atmosphere;
    if(id==="arcade")awardMilestone("firstArcade","Arcade Opening Bonus",1500,"The city entertainment board sponsored your first arcade.");
    if(item.kind==="decor")awardMilestone("firstDecor","Beautification Bonus",500,"Your first decoration made the park more welcoming.");
    if (item.kind === "path") {
      state.milestones ||= { path: false, freight: false }; state.milestones.path = true;
      if (state.tutorial === 6) { advanceTutorial(7); if (state.milestones.freight) advanceTutorial(8); }
    }
    if (item.kind === "queue" && state.tutorial === 10) advanceTutorial(11);
    updateUI(); saveTimer = 99; save(); return true;
  }

  function placeLine(id, start, end) {
    const item = getItem(id);
    if (!item || !["path", "queue"].includes(item.kind)) return placeItem(id, end.x, end.y, state.buildLevel);
    let x0 = start.x, y0 = start.y, x1 = end.x, y1 = end.y;
    if (keys.has("Shift")) Math.abs(x1-x0) > Math.abs(y1-y0) ? y1=y0 : x1=x0;
    const dx = Math.abs(x1-x0), sx=x0<x1?1:-1, dy=-Math.abs(y1-y0), sy=y0<y1?1:-1;
    let error=dx+dy, placed=0,cashBefore=state.cash;
    while (true) {
      if (placeItem(id,x0,y0,state.buildLevel)) placed++;
      if (x0===x1&&y0===y1) break;
      const e2=2*error;if(e2>=dy){error+=dy;x0+=sx;}if(e2<=dx){error+=dx;y0+=sy;}
    }
    if (placed) notify(`${placed} tiles paved`, `${money(cashBefore-state.cash)} materials charged · ${state.materials?.[id]||0} stocked tiles remain.`);
  }

  function demolishAt(x, y, z) {
    const index = [...state.objects].reverse().findIndex(object => objectCovers(object,x,y,z));
    if (index < 0) return;
    const actual = state.objects.length - 1 - index;
    const object = state.objects[actual], item = getItem(object.type);
    state.objects.splice(actual,1);
    if (item.kind === "ride" && object.state === "blueprint" && !item.ledgerBuild) state.rideInventory[object.type]=(state.rideInventory[object.type]||0)+1;
    else state.cash += Math.floor(item.cost * .2);
    notify(`${item.name} demolished`, "Twenty percent of its value was recovered.", "warning");
    selected=null; closeInspector(); updateUI();
  }

  function selectAt(x, y, z) {
    const candidates = state.objects.filter(object => objectCovers(object,x,y,z));
    const object = candidates[candidates.length-1];
    if (!object) { selected=null;closeInspector();return; }
    selected=object.id; renderInspector(object);
  }

  function setTab(tab) {
    if (tab === "finance") { openFinance(); return; }
    state.activeTab=tab; state.activeTool=null;trackDraft=null;
    $$(".dock-tabs button").forEach(button=>button.classList.toggle("active",button.dataset.tab===tab));
    renderBuildItems(); updateUI();
  }

  function isItemAvailable(item) {
    if (item.kind === "ride") return item.ledgerBuild?state.toolkit&&state.cash>=item.cost:(state.rideInventory[item.id] || 0) > 0;
    if (item.unlockedBy) return !!state.blueprintPacks[item.unlockedBy];
    return state.toolkit;
  }

  function renderBuildItems() {
    const items=ITEMS[state.activeTab]||[];
    $("#buildItems").innerHTML=items.map(item=>{
      const available=isItemAvailable(item);
      const count=item.kind==="ride"?(state.rideInventory[item.id]||0):(state.materials?.[item.id]||0);
      return `<button class="build-item ${available?"":"locked"} ${state.activeTool===item.id?"active":""}" data-item="${item.id}" title="${item.description}"><span class="item-icon">${item.icon}</span><strong>${item.name}</strong><small>${item.kind==="ride"?(item.ledgerBuild?`${money(item.cost)} LEDGER`:available?"DELIVERED":"SHOP / FREIGHT"):count?"STOCKED":money(item.cost)}</small>${count?`<i class="count">×${count}</i>`:""}</button>`;
    }).join("");
    $$(".build-item").forEach(button=>button.addEventListener("click",()=>{
      const item=getItem(button.dataset.item);
      if(!isItemAvailable(item)){showWorldMessage(item.kind==="ride"?"Purchase and collect this ride in the Supply District":"Blueprint not yet acquired");return;}
      if(item.coaster){openCoasterBuilder(item);return;}
      if(item.kind==="ride"){openRideNaming(item);return;}
      state.activeTool=button.dataset.item; walkMode=false; renderBuildItems(); updateUI();
      $("#dockInstruction").textContent=`${item.name} selected · click or drag on the grid`;
    }));
  }

  function updateUI() {
    refreshCoasterUnlocks();
    const powerUsed=state.objects.reduce((total,object)=>total+effectivePower(object),0);
    const profit=state.totalRevenue-state.stats.expenses;
    $("#moneyValue").textContent=money(state.cash);
    $("#cashFlow").textContent=state.registered?`${profit>=0?"+":"−"}${money(Math.abs(profit))} NET`:`REGISTER TO BEGIN`;
    $("#guestValue").textContent=guests.length.toString();
    $("#parkCapacity").textContent=`LOT CAPACITY ${state.lotTier>1?220:120}`;
    $("#reputationValue").textContent=state.registered?`${Math.round(state.reputation)}%`:"—";
    const rating=state.reviewCount?state.reviewTotal/state.reviewCount:0;
    $("#reputationLabel").textContent=state.reviewCount?`★ ${rating.toFixed(1)} · ${state.reviewCount} REVIEW${state.reviewCount===1?"":"S"}`:"UNRATED · OPEN A RIDE";
    const latestReview=state.reviews?.[0],ticker=$("#reviewTicker");ticker.classList.toggle("hidden",!latestReview);if(latestReview){$("#reviewTickerStars").textContent=`${"★".repeat(Math.round(latestReview.stars))} ${latestReview.stars.toFixed(1)}`;$("#reviewTickerText").textContent=latestReview.text;}
    $("#powerValue").textContent=`${Math.round(powerUsed)} / ${state.powerCapacity} kW`;
    $("#powerFill").style.width=`${clamp(powerUsed/state.powerCapacity*100,0,100)}%`;
    $("#powerFill").style.background=powerUsed>state.powerCapacity?"#ff5368":"#39a8ff";
    const hour=Math.floor(state.time/60)%24, minute=Math.floor(state.time%60);
    $("#clockValue").textContent=`${hour%12||12}:${String(minute).padStart(2,"0")} ${hour>=12?"PM":"AM"}`;
    $("#weatherValue").textContent=state.weather==="rain"?"RAIN · 57°F":state.weather==="heat"?"HOT · 91°F":"CLEAR · 68°F";
    $("#levelValue").textContent=`P${state.level}`;$("#buildLevel").textContent=levelLabel(state.buildLevel);
    $("#atmosphereValue").textContent=Math.round(state.atmosphere);$("#cleanValue").textContent=`${Math.round(state.cleanliness)}%`;$("#profitValue").textContent=`${profit<0?"−":""}${money(Math.abs(profit))}`;
    $("#buildDock").classList.toggle("locked",!state.toolkit);
    $$(".dock-tabs button").forEach(button=>button.classList.toggle("active",button.dataset.tab===state.activeTab));
    $("#dockCategory").textContent=`${state.activeTab.toUpperCase()} INVENTORY`;
    if(!state.activeTool)$("#dockInstruction").textContent=state.toolkit?"Select a blueprint to begin construction":"Register and collect your toolkit";
    $("#walkToggle").classList.toggle("active",walkMode);$("#walkToggle").innerHTML=walkMode?`<span>◆</span> WALK MODE <kbd>V</kbd>`:`<span>◇</span> BUILD MODE <kbd>V</kbd>`;
    $("#controlHint").textContent=walkMode?"WASD move · E interact · V build mode":"Click to place · Shift locks path axis · Q/E levels · R rotates";
    $("#coordsValue").textContent=`${(REGIONS[state.region]||REGIONS.meadow).name.toUpperCase()} · ${levelLabel(state.buildLevel)}`;
    $$(".speed-controls button").forEach(button=>button.classList.toggle("active",+button.dataset.speed===state.speed));
    const step=Math.min(state.tutorial,TOUR_STEPS.length-1), objective=TOUR_STEPS[step];
    $("#objectiveStep").textContent=state.tutorial>=TOUR_STEPS.length?"COMPLETE":`${String(step+1).padStart(2,"0")} / ${String(TOUR_STEPS.length).padStart(2,"0")}`;
    $("#objectiveTitle").textContent=state.tutorial>=TOUR_STEPS.length?"Your park is operational":objective[0];
    $("#objectiveText").textContent=state.tutorial>=TOUR_STEPS.length?"Expand the lot, tune your prices, and grow a vertical amusement empire.":objective[1];
    $("#objectiveFill").style.width=`${clamp(state.tutorial/TOUR_STEPS.length*100,4,100)}%`;
    renderBuildItems();
    updateTrackControls();
  }

  function advanceTutorial(step) {
    if (step <= state.tutorial) return;
    state.tutorial=step;
    const title=step>=TOUR_STEPS.length?"Starter blueprint complete":TOUR_STEPS[step][0];
    notify(title,step>=TOUR_STEPS.length?"Your first attraction is open for business.":TOUR_STEPS[step][1]);
    updateUI(); saveTimer=99;save();
  }

  function notify(title, message, type="") {
    const toast=document.createElement("div");toast.className=`event-toast ${type}`;toast.innerHTML=`<strong>${title}</strong><span>${message}</span>`;$("#eventStack").prepend(toast);
    setTimeout(()=>toast.remove(),5000);
  }

  function awardMilestone(id, title, amount, message) {
    state.bonuses ||= {};
    if(state.bonuses[id])return false;
    state.bonuses[id]=true;state.cash+=amount;celebrationUntil=performance.now()+4000;
    notify(`${title} · ${money(amount)}`,message);saveTimer=99;save();updateUI();return true;
  }

  let messageTimer;
  function showWorldMessage(message) { const node=$("#worldMessage");node.textContent=message;node.classList.remove("hidden");clearTimeout(messageTimer);messageTimer=setTimeout(()=>node.classList.add("hidden"),2200); }

  function openModal(html, onReady) { $("#modal").innerHTML=html;$("#modalLayer").classList.remove("hidden");onReady?.(); }
  function closeModal(){$("#modalLayer").classList.add("hidden");$("#modal").innerHTML="";}
  function modalShell(kicker,title,body,actions=""){return `<header class="modal-header"><p class="kicker">${kicker}</p><h2>${title}</h2></header><div class="modal-body">${body}</div>${actions?`<div class="modal-actions">${actions}</div>`:""}`;}

  function registerProfile() {
    openModal(modalShell("CITY REGISTRY · ON-SITE LEDGER","Register your operator profile",`<p class="modal-copy">Enter the name that will appear on your permits, staff records, and local save.</p><input id="profileName" class="name-input" maxlength="20" autocomplete="off" placeholder="Manager name" value="${state.profile}">`,`<button class="modal-button" data-close>Cancel</button><button id="confirmProfile" class="modal-button primary">REGISTER & RELEASE ${money(STARTING_BUDGET)}</button>`),()=>{
      $("#profileName").focus();$$("[data-close]").forEach(b=>b.onclick=closeModal);$("#confirmProfile").onclick=()=>{const value=$("#profileName").value.trim();if(!value)return;state.profile=value;state.registered=true;state.cash=STARTING_BUDGET;closeModal();advanceTutorial(1);notify("Capital released",`${money(STARTING_BUDGET)} deposited into your park account.`);};
    });
  }

  function collectToolkit() {
    openModal(modalShell("EQUIPMENT LOCKER","Starter Toolkit issued",`<p class="modal-copy">Your digital blueprint scanner, financial ledger, district map, and safety hologram projector are ready.</p><div class="shop-stats"><span>◆ BUILD DOCK</span><span>◆ CONTEXT INSPECTOR</span><span>◆ DISTRICT MAP</span></div>`,`<button id="equipToolkit" class="modal-button primary">EQUIP TOOLKIT</button>`),()=>{$("#equipToolkit").onclick=()=>{state.toolkit=true;closeModal();advanceTutorial(2);updateUI();};});
  }

  function openUsedRideLot() {
    selectedShopVisited=true;if(state.tutorial===2)advanceTutorial(3);
    refreshCoasterUnlocks();
    const base=["carousel","whirlybird","wave","safari","skywheel","bumper","dropTower"],shop=Object.entries(RIDES).filter(([id,ride])=>!ride.ledgerBuild),cards=shop.map(([id,ride])=>{const unlocked=base.includes(id)||(id==="spinner"||id==="skid"?state.lotTier>1:!!state.unlocked[id]);let action=`<button data-buy-ride="${id}" ${!unlocked||state.cash<ride.cost?"disabled":""}>${unlocked?`PURCHASE · FREIGHT ${money(ride.freight)}`:"LOCKED"}</button>`;
      if(id==="hairpin"&&!state.coasterLicenses.hairpin)action=`<button data-license="hairpin" ${parkNetWorth()<50000||state.cash<10000?"disabled":""}>LICENSE BLUEPRINT · $10,000</button>`;
      if(id==="flyer"&&!state.coasterLicenses.flyer)action=`<button disabled>VISIT LEGAL DISTRICT OFFICES</button>`;
      return `<article class="shop-card"><header><h3>${ride.icon} ${ride.name}</h3><strong>${money(ride.cost)}</strong></header><p>${ride.description}</p><div class="shop-stats"><span>EXC ${ride.excitement}</span><span>REL ${ride.reliability}%</span><span>${ride.coaster?`${ride.maxSpeed} MPH · H${ride.maxHeight}`:`${ride.w}×${ride.h}`}</span></div>${unlocked?action:`<p class="inspector-copy">${coasterRequirement(id)}</p>${action}`}</article>`;}).join("");
    const searches=state.parkingCashFound||0,findsLeft=3-searches,parkingFind=searches<3?`<aside class="parking-find"><div><strong>💵 PARKING-LOT CASH FIND</strong><span>Search discarded seat cushions and old ticket booths. ${findsLeft} ${findsLeft===1?"find":"finds"} remain.</span></div><button id="searchParkingCash">SEARCH LOT</button></aside>`:`<aside class="parking-find exhausted"><div><strong>PARKING LOT SEARCHED</strong><span>You recovered every loose cash envelope in this shipment cycle.</span></div></aside>`;
    openModal(modalShell("MANUFACTURING DISTRICT · USED RIDE PARKING LOT","Scroll across the used-ride inventory",`<p class="modal-copy">Walk between parked secondhand attractions, recover abandoned cash, and scroll sideways across the complete machinery roster below. Purchase any available ride directly from its parking-space card.</p>${parkingFind}<div class="ride-scroll-controls"><button id="rideScrollLeft" aria-label="Previous rides">←</button><span>SCROLL / SWIPE ACROSS TO BROWSE</span><button id="rideScrollRight" aria-label="More rides">→</button></div><div class="ride-catalog"><div class="shop-grid">${cards}</div></div>`,`<button class="modal-button" data-close>Leave lot</button>`),()=>{
      $$("[data-close]").forEach(b=>b.onclick=closeModal);$$('[data-buy-ride]').forEach(button=>button.onclick=()=>buyRide(button.dataset.buyRide));$$('[data-license]').forEach(button=>button.onclick=()=>purchaseCoasterLicense(button.dataset.license));
      if($("#searchParkingCash"))$("#searchParkingCash").onclick=searchParkingCash;
      const catalog=$(".ride-catalog"),scroll=amount=>{catalog.scrollLeft=clamp(catalog.scrollLeft+amount,0,catalog.scrollWidth-catalog.clientWidth);};
      $("#rideScrollLeft").onclick=()=>scroll(-540);$("#rideScrollRight").onclick=()=>scroll(540);
      catalog.addEventListener("wheel",event=>{if(Math.abs(event.deltaY)>Math.abs(event.deltaX)){event.preventDefault();catalog.scrollLeft+=event.deltaY;}},{passive:false});
    });
  }

  function searchParkingCash(){
    if((state.parkingCashFound||0)>=3)return;
    const amount=[500,750,1000][state.parkingCashFound||0];state.parkingCashFound=(state.parkingCashFound||0)+1;state.cash+=amount;
    notify("Cash found between the parked rides",`${money(amount)} was added to your available construction budget.`);saveTimer=99;save();updateUI();openUsedRideLot();
  }

  function purchaseCoasterLicense(id){const cost=id==="hairpin"?10000:25000;if(state.cash<cost)return;if(id==="hairpin"&&parkNetWorth()<50000)return;if(id==="flyer"&&state.atmosphere<80)return;state.cash-=cost;state.stats.expenses+=cost;state.coasterLicenses[id]=true;refreshCoasterUnlocks();notify(`${RIDES[id].name} licensed`,"Manufacturing hardware is now available for purchase.");openUsedRideLot();updateUI();}

  function openLegalOffice(){const licensed=!!state.coasterLicenses.flyer,eligible=state.atmosphere>=80&&state.cash>=25000;openModal(modalShell("SPECIALTY LICENSING · LEGAL DISTRICT","Pyrotechnic flight contract",`<p class="modal-copy">The Arena Flyer requires an 80-point park Atmosphere rating, a specialty effects indemnity, and a $25,000 premium manufacturing license.</p><div class="stat-row"><span>Atmosphere requirement</span><strong>${Math.round(state.atmosphere)} / 80</strong></div><div class="stat-row"><span>Contract status</span><strong>${licensed?"SIGNED":"PENDING"}</strong></div>`,`<button class="modal-button" data-close>Leave office</button><button id="signFlyerLicense" class="modal-button primary" ${licensed||!eligible?"disabled":""}>${licensed?"LICENSE ACTIVE":"SIGN CONTRACT · $25,000"}</button>`),()=>{$$("[data-close]").forEach(button=>button.onclick=closeModal);$("#signFlyerLicense").onclick=()=>{const cost=25000;if(state.atmosphere<80||state.cash<cost)return;state.cash-=cost;state.stats.expenses+=cost;state.coasterLicenses.flyer=true;refreshCoasterUnlocks();closeModal();notify("Arena Flyer contract signed","Specialty hardware is now available at the Used Ride Lot.");updateUI();};});}

  function buyRide(id) {
    const ride=RIDES[id];if(!ride||state.cash<ride.cost)return;
    state.cash-=ride.cost;state.stats.expenses+=ride.cost;state.pendingOrders.push({id:uid("order"),ride:id,purchased:state.day});
    notify(`${ride.name} purchased`,`Awaiting ${money(ride.freight)} freight dispatch at the shipping desk.`);if(state.tutorial===3)advanceTutorial(4);closeModal();updateUI();saveTimer=99;save();
  }

  function openFabricator() {
    const concreteOwned=state.blueprintPacks.concrete,queueOwned=state.blueprintPacks.queue;
    openModal(modalShell("BLUEPRINT FABRICATOR","Infrastructure & structural licenses",`<p class="modal-copy">Blueprint packs unlock permanent grid construction. Placement materials are charged by the tile.</p><div class="shop-grid">
      <article class="shop-card"><header><h3>═ Concrete Pathing Pack</h3><strong>$2,000</strong></header><p>Permanent concrete paving license with 100 starter tiles represented in the purchase value.</p><button data-pack="concrete" ${concreteOwned||state.cash<2000?"disabled":""}>${concreteOwned?"OWNED":"BUY BLUEPRINT"}</button></article>
      <article class="shop-card"><header><h3>⌇ Queue Blueprint Set</h3><strong>$1,000</strong></header><p>Standard stanchions plus access to advanced elevated and atmospheric queue systems.</p><button data-pack="queue" ${queueOwned||state.cash<1000?"disabled":""}>${queueOwned?"OWNED":"BUY BLUEPRINT"}</button></article>
      <article class="shop-card"><header><h3>■ Vertical Structures</h3><strong>$2,000</strong></header><p>Foundation blocks, stairs, and structural inspection access. Included with your toolkit in this build.</p><button disabled>TOOLKIT LICENSED</button></article>
      <article class="shop-card"><header><h3>▱ Escalator Systems</h3><strong>$8,000</strong></header><p>Powered vertical passenger modules. Placement components cost $2,000 per level.</p><button disabled>CATALOG AVAILABLE</button></article></div>`,`<button class="modal-button" data-close>Leave Fabricator</button>`),()=>{
      $$("[data-close]").forEach(b=>b.onclick=closeModal);$$('[data-pack]').forEach(button=>button.onclick=()=>{const type=button.dataset.pack,cost=type==="concrete"?2000:1000;if(state.cash<cost)return;state.cash-=cost;state.stats.expenses+=cost;state.blueprintPacks[type]=true;state.materials||={};const material=type==="concrete"?"pathConcrete":"queueStandard";state.materials[material]=(state.materials[material]||0)+(type==="concrete"?100:50);notify(`${type==="concrete"?"Concrete Pathing":"Queue"} acquired`,`${type==="concrete"?100:50} starter tiles stocked in Infrastructure.`);if(state.tutorial===4&&state.blueprintPacks.concrete&&state.blueprintPacks.queue)advanceTutorial(5);updateUI();openFabricator();});
    });
  }

  function openShippingDesk() {
    const active=state.shipments.filter(shipment=>shipment.status==="transit");
    const orders=state.pendingOrders.length?`<div class="shop-grid">${state.pendingOrders.map(order=>{const ride=RIDES[order.ride];return `<article class="shop-card"><header><h3>${ride.name}</h3><strong>${money(ride.freight)}</strong></header><p>${Math.ceil(ride.delivery/60)} minute delivery · industrial flatbed</p><button data-dispatch="${order.id}" ${state.cash<ride.freight?"disabled":""}>DISPATCH FREIGHT</button></article>`}).join("")}</div>`:`<p class="modal-copy">No purchased machinery is awaiting dispatch. Visit the Used Ride Lot first.</p>`;
    const transit=active.length?`<p class="inspector-label" style="margin-top:18px">ACTIVE SHIPMENTS</p><div class="shop-grid">${active.map(shipment=>{const ride=RIDES[shipment.ride],cost=Math.ceil(ride.freight*.5*(shipment.rushes+1));return `<article class="shop-card"><header><h3>${ride.name}</h3><strong>${Math.ceil(shipment.remaining)}s</strong></header><p>${shipment.event==="starter"?"Starter express lane active":shipment.event==="delay"?"Traffic delay active":shipment.event==="damage"?"Crate inspection flagged":"Truck is en route"} · rush reduces remaining time by 50%</p><button data-rush="${shipment.id}" ${state.cash<cost?"disabled":""}>EXPEDITE · ${money(cost)}</button></article>`}).join("")}</div>`:"";
    const body=`<p class="modal-copy">Dispatch purchased machinery to your eastern Freight Depot. Delivery timers use simulation time.</p>${orders}${transit}`;
    openModal(modalShell("DISTRICT LOGISTICS","Freight shipping desk",body,`<button class="modal-button" data-close>Close ledger</button>`),()=>{$$("[data-close]").forEach(b=>b.onclick=closeModal);$$('[data-dispatch]').forEach(button=>button.onclick=()=>dispatchOrder(button.dataset.dispatch));$$('[data-rush]').forEach(button=>button.onclick=()=>{rushShipment(state.shipments.find(shipment=>shipment.id===button.dataset.rush));openShippingDesk();});});
  }

  function dispatchOrder(orderId) {
    const index=state.pendingOrders.findIndex(order=>order.id===orderId);if(index<0)return;const order=state.pendingOrders[index],ride=RIDES[order.ride];if(state.cash<ride.freight)return;
    state.cash-=ride.freight;state.stats.expenses+=ride.freight;state.pendingOrders.splice(index,1);
    const firstDelivery=!state.shipments.length&&!state.objects.some(object=>getItem(object.type)?.kind==="ride")&&!Object.values(state.rideInventory||{}).some(Boolean);
    const roll=Math.random();let event="clear",remaining=ride.delivery;if(firstDelivery){event="starter";remaining=Math.min(20,ride.delivery);}else if(roll<.12){event="delay";remaining*=1.35;}else if(roll<.2)event="parts";else if(roll<.27)event="damage";
    state.shipments.push({id:uid("ship"),ride:order.ride,remaining,status:"transit",event,rushes:0});
    notify(`${ride.name} dispatched`,event==="starter"?"Your first attraction gets free express handling and arrives in 20 seconds.":`${Math.ceil(remaining/60)} minute live freight window.${event==="delay"?" Traffic delay reported.":event==="parts"?" The driver found bonus spare parts.":event==="damage"?" Crate damage inspection required.":""}`,event==="delay"||event==="damage"?"warning":"");
    if(state.tutorial===5)advanceTutorial(6);closeModal();updateUI();
  }

  function collectFreight() {
    const shipment=state.shipments.find(entry=>entry.status==="arrived");if(!shipment){showWorldMessage("No freight is ready for sign-off");return;}
    shipment.status="collected";state.rideInventory[shipment.ride]=(state.rideInventory[shipment.ride]||0)+1;
    if(shipment.event==="parts")state.cash+=750;if(shipment.event==="damage")state.stats.expenses+=250;
    state.milestones ||= { path: false, freight: false }; state.milestones.freight = true;
    notify(`${RIDES[shipment.ride].name} signed in`,shipment.event==="parts"?"Bonus parts sold for $750.":shipment.event==="damage"?"Crate repairs added a $250 expense.":"Blueprint hologram added to Attractions.");
    if(state.tutorial===7)advanceTutorial(8);renderBuildItems();updateUI();saveTimer=99;save();
  }

  function renderInspector(object) {
    const item=getItem(object.type);if(!item)return;
    $("#inspector").classList.remove("hidden");$("#inspectorKicker").textContent=`${item.kind.toUpperCase()} · L${object.z+1}`;$("#inspectorTitle").textContent=object.customName||item.name;
    let body=`<section class="inspector-section"><p class="inspector-copy">${item.description}</p>${item.kind==="ride"?`<label class="inspector-label" style="margin-top:10px">CUSTOM RIDE NAME</label><input data-ride-name class="name-input" maxlength="32" value="${escapeHtml(object.customName||item.name)}">`:""}</section>`;
    if(item.kind==="ride"){
      const stats=effectiveRideStats(object,item);
      body+=`<section class="inspector-section"><label>LIVE RIDE TELEMETRY</label><div class="stat-row"><span>Excitement</span><strong>${stats.excitement.toFixed(1)} / 10</strong></div><div class="stat-row"><span>Intensity</span><strong>${item.intensity} / 10</strong></div><div class="stat-row"><span>Nausea</span><strong>${stats.nausea.toFixed(1)} / 10</strong></div>${item.coaster?`<div class="stat-row"><span>Safety envelope</span><strong>${item.maxSpeed} mph · L${item.maxHeight+1}</strong></div><div class="stat-row"><span>Track layout</span><strong>${object.layout||"Custom"}</strong></div><div class="stat-row"><span>Train consist</span><strong>${object.cars||3} carts</strong></div><div class="stat-row"><span>Deepest tunnel</span><strong>${levelLabel(Math.min(0,...(object.track||[]).map(node=>node.z)))}</strong></div>`:""}<div class="stat-row"><span>Reliability</span><strong>${Math.round(object.condition)}%</strong></div><div class="meter"><i style="width:${object.condition}%;background:${object.condition<30?'#ff5368':'#53d998'}"></i></div><div class="stat-row"><span>Queue</span><strong>${object.queue||0} guests</strong></div><div class="stat-row"><span>Lifetime revenue</span><strong>${money(object.revenue||0)}</strong></div></section>`;
      if(object.state==="blueprint") body+=`<section class="inspector-section"><label>CONSTRUCTION AUTHORIZATION</label><p class="inspector-copy">The footprint is anchored. Authorize your starter crew to assemble the mechanical components.</p><button class="inspector-button primary" data-action="authorize">AUTHORIZE CONSTRUCTION</button></section>`;
      else if(object.state==="constructing") body+=`<section class="inspector-section"><label>ASSEMBLY IN PROGRESS</label><div class="stat-row"><span>Time remaining</span><strong>${Math.ceil(object.buildRemaining)} sec</strong></div><button class="inspector-button orange" data-action="rushBuild">RUSH CREW · $1,000</button></section>`;
      else {
        body+=priceSection(object,"RIDE ADMISSION");
        body+=`<section class="inspector-section"><label>OPERATIONS</label><div class="stat-row"><span>Operator</span><strong>${object.operator?"ASSIGNED · $50/day":"VACANT"}</strong></div><button class="inspector-button" data-action="operator">${object.operator?"REMOVE OPERATOR":"HIRE OPERATOR · $50/day"}</button><button class="inspector-button primary" data-action="open" ${!object.operator||object.broken?"disabled":""}>${object.open?"CLOSE RIDE":"OPEN RIDE"}</button>${object.broken?`<button class="inspector-button orange" data-action="repair">AUTHORIZE REPAIR · $${Math.max(300,Math.round((100-object.condition)*25))}</button>`:""}</section>`;
      }
      if(item.coaster){object.upgrades||=[];const tree=COASTER_UPGRADES[item.id]||[],earned=Math.min(3,1+Math.floor((object.cycles||0)/20)),available=earned-object.upgrades.length;body+=`<section class="inspector-section"><label>COASTER ABILITY TREE · ${available} POINT${available===1?"":"S"}</label>${tree.map(([name,effect],index)=>`<div style="margin:8px 0;padding:8px;border:1px solid var(--line);background:#0a1d2a"><div class="stat-row"><span>TIER ${index+1}</span><strong>${object.upgrades.includes(index)?"INSTALLED":index===object.upgrades.length&&available>0?"AVAILABLE":"LOCKED"}</strong></div><strong style="font-size:10px">${name}</strong><p class="inspector-copy">${effect}</p>${!object.upgrades.includes(index)?`<button class="inspector-button" data-action="upgrade:${index}" ${index!==object.upgrades.length||available<=0?"disabled":""}>ALLOCATE SKILL POINT</button>`:""}</div>`).join("")}</section>`;}
    } else if(["food","restroom","service","vertical","venue","shop","rest"].includes(item.kind)) {
      body+=priceSection(object,item.kind==="food"?"ITEM PRICE":item.kind==="restroom"?"ENTRY FEE":item.kind==="vertical"?"SWIPE TOLL":item.kind==="venue"?"PLAY / SHOW PRICE":item.kind==="shop"?"AVERAGE PURCHASE":"SERVICE FEE");
      body+=`<section class="inspector-section"><label>LOCAL EFFECTS</label><div class="stat-row"><span>Power draw</span><strong>${item.power||0} kW</strong></div>${item.water?`<div class="stat-row"><span>Water draw</span><strong>${item.water} units</strong></div>`:""}${item.aura?`<div class="stat-row"><span>Influence radius</span><strong>${item.aura} tiles</strong></div>`:""}</section>`;
    } else {
      body+=`<section class="inspector-section"><label>ASSET CONDITION</label><div class="stat-row"><span>Condition</span><strong>${Math.round(object.condition||100)}%</strong></div><div class="stat-row"><span>Build level</span><strong>L${object.z+1}</strong></div>${item.aura?`<div class="stat-row"><span>Aura radius</span><strong>${item.aura} tiles</strong></div>`:""}</section>`;
    }
    if(item.aura)body+=`<section class="inspector-section"><label>HOLOGRAPHIC OVERLAYS</label><div class="toggle-row"><button data-action="aura" class="${auraOverlay?"active":""}">SCENT / AURA</button><button data-action="penalty" class="${penaltyOverlay?"active":""}">PENALTY ZONES</button></div></section>`;
    body+=`<section class="inspector-section"><button class="inspector-button danger" data-action="demolish">DEMOLISH · RECOVER 20%</button></section>`;
    $("#inspectorBody").innerHTML=body;bindInspectorActions(object);
  }

  function priceSection(object,label){return `<section class="inspector-section"><label>${label}</label><div class="price-input"><span>$</span><input data-price type="number" min="0" max="999" step="0.05" value="${Number(object.price||0).toFixed(2)}"></div><p class="inspector-copy">Press Enter or leave the field to apply. Guest value calculations update immediately.</p></section>`;}

  function bindInspectorActions(object){
    const nameInput=$("[data-ride-name]",$("#inspectorBody"));if(nameInput){const rename=()=>{object.customName=nameInput.value.trim()||getItem(object.type).name;$("#inspectorTitle").textContent=object.customName;saveTimer=99;save();};nameInput.addEventListener("change",rename);nameInput.addEventListener("keydown",event=>{if(event.key==="Enter"){rename();nameInput.blur();}});}
    const input=$("[data-price]",$("#inspectorBody"));if(input){const apply=()=>{object.price=clamp(Number(input.value)||0,0,999);input.value=object.price.toFixed(2);notify("Price updated",`${getItem(object.type).name} now charges ${money(object.price)}.`);saveTimer=99;save();};input.addEventListener("change",apply);input.addEventListener("keydown",event=>{if(event.key==="Enter"){apply();input.blur();}});}
    $$('[data-action]',$("#inspectorBody")).forEach(button=>button.onclick=()=>{
      const action=button.dataset.action,item=getItem(object.type);
      if(action.startsWith("upgrade:")){const tier=Number(action.split(":")[1]),earned=Math.min(3,1+Math.floor((object.cycles||0)/20));object.upgrades||=[];if(tier===object.upgrades.length&&object.upgrades.length<earned){object.upgrades.push(tier);if(object.type==="neon"&&tier===1)state.atmosphere+=10;notify(`${COASTER_UPGRADES[object.type][tier][0]} installed`,COASTER_UPGRADES[object.type][tier][1]);renderInspector(object);updateUI();}return;}
      if(action==="authorize"){const firstBuild=!state.objects.some(other=>other!==object&&getItem(other.type)?.kind==="ride"&&["constructing","built"].includes(other.state));object.state="constructing";object.buildRemaining=firstBuild?10:item.coaster?45:item.family==="Drifting Thrill"?30:18;if(state.themes.some(t=>t.type==="shipyard"&&Math.abs(t.x-object.x)<4&&Math.abs(t.y-object.y)<4))object.buildRemaining*=.75;if(firstBuild)notify("Starter crew fast-track","Your first attraction will be assembled in only 10 seconds.");if(state.tutorial===9)advanceTutorial(10);renderInspector(object);}
      if(action==="rushBuild"&&state.cash>=1000){state.cash-=1000;state.stats.expenses+=1000;object.buildRemaining=Math.max(1,object.buildRemaining*.5);renderInspector(object);updateUI();}
      if(action==="operator"){object.operator=!object.operator;if(!object.operator)object.open=false;renderInspector(object);}
      if(action==="open"){if(!object.open&&!hasAdjacentQueue(object)){showWorldMessage("Connect a dedicated queue tile beside this ride");return;}if(!object.open&&!hasAdjacentPath(object)){showWorldMessage("Connect the ride area to a main pedestrian path");return;}if(!object.open&&!routeToTarget({x:8.5,y:14.5},object,true)){showWorldMessage("Connect this queue to the main gate with an unbroken path");return;}const firstOpening=!state.objects.some(other=>other!==object&&getItem(other.type)?.kind==="ride"&&other.open);object.open=!object.open;if(object.open&&firstOpening){spawnTimer=0;awardMilestone("grandOpening","Grand Opening Bonus",2500,`Visitors are racing toward ${object.customName||item.name}.`);}if(object.open&&state.tutorial===11)advanceTutorial(12);renderInspector(object);updateUI();}
      if(action==="repair"){const cost=Math.max(300,Math.round((100-object.condition)*25));if(state.cash>=cost){state.cash-=cost;state.stats.expenses+=cost;object.condition=100;object.broken=false;notify(`${item.name} repaired`,"Safety inspection passed. The ride can reopen.");renderInspector(object);updateUI();}}
      if(action==="aura"){auraOverlay=!auraOverlay;renderInspector(object);}
      if(action==="penalty"){penaltyOverlay=!penaltyOverlay;renderInspector(object);}
      if(action==="demolish"){openModal(modalShell("DEMOLITION ORDER",`Remove ${item.name}?`,`<p class="modal-copy">This permanently removes the asset and recovers 20% of its purchase value.</p>`,`<button class="modal-button" data-close>Cancel</button><button id="confirmDemo" class="modal-button primary">CONFIRM DEMOLITION</button>`),()=>{$$("[data-close]").forEach(b=>b.onclick=closeModal);$("#confirmDemo").onclick=()=>{closeModal();demolishAt(object.x,object.y,object.z);};});}
    });
  }

  function closeInspector(){$("#inspector").classList.add("hidden");selected=null;}
  function hasAdjacentType(object,kinds){const item=getItem(object.type),cells=object.track?.length?object.track.map(node=>[node.x,node.y]):footprint(item,object.x,object.y);return state.objects.some(other=>{const otherItem=getItem(other.type);if(!otherItem||!kinds.includes(otherItem.kind)||other.z!==object.z)return false;return cells.some(([x,y])=>Math.abs(other.x-x)+Math.abs(other.y-y)<=1);});}
  const hasAdjacentQueue=object=>hasAdjacentType(object,["queue"]);
  const hasAdjacentPath=object=>hasAdjacentType(object,["path"]);

  function openFinance(){
    const priced=state.objects.filter(object=>["ride","food","restroom","service","vertical","venue","shop","rest"].includes(getItem(object.type)?.kind));
    openModal(modalShell("GLOBAL ECONOMIC LEDGER","Pricing & admissions",`<p class="modal-copy">Set exact prices globally. Guest willingness responds to excitement, urgency, reputation, loyalty, and remaining wallet cash.</p>
      <table class="ledger-table"><thead><tr><th>ADMISSION MODEL</th><th>GATE PRICE</th><th>DAY PASS</th></tr></thead><tbody><tr><td><select id="admissionModel"><option value="open" ${state.admission.model==="open"?"selected":""}>Open lot / pay per ride</option><option value="day" ${state.admission.model==="day"?"selected":""}>Day pass</option><option value="hybrid" ${state.admission.model==="hybrid"?"selected":""}>Hybrid admission</option></select></td><td><input id="gatePrice" type="number" min="0" value="${state.admission.gatePrice}"></td><td><input id="dayPassPrice" type="number" min="0" value="${state.admission.dayPass}"></td></tr></tbody></table>
      <table class="ledger-table"><thead><tr><th>ASSET</th><th>LEVEL</th><th>PRICE</th><th>REVENUE</th></tr></thead><tbody>${priced.length?priced.map(object=>`<tr><td>${getItem(object.type).name}</td><td>L${object.z+1}</td><td><input data-ledger-price="${object.id}" type="number" min="0" step=".05" value="${Number(object.price||0).toFixed(2)}"></td><td>${money(object.revenue||0)}</td></tr>`).join(""):`<tr><td colspan="4">No priced assets have been constructed.</td></tr>`}</tbody></table>`,`<button class="modal-button" data-close>Cancel</button><button id="applyLedger" class="modal-button primary">APPLY PRICES</button>`),()=>{$$("[data-close]").forEach(b=>b.onclick=closeModal);$("#applyLedger").onclick=()=>{state.admission.model=$("#admissionModel").value;state.admission.gatePrice=clamp(Number($("#gatePrice").value)||0,0,999);state.admission.dayPass=clamp(Number($("#dayPassPrice").value)||0,0,999);$$('[data-ledger-price]').forEach(input=>{const object=state.objects.find(entry=>entry.id===input.dataset.ledgerPrice);if(object)object.price=clamp(Number(input.value)||0,0,999);});closeModal();notify("Ledger applied","Park prices were updated globally.");saveTimer=99;save();};});
  }

  function openReviews(){
    const average=state.reviewCount?state.reviewTotal/state.reviewCount:0,paths=state.objects.filter(object=>getItem(object.type)?.kind==="path"),pathQuality=paths.length?paths.reduce((sum,path)=>sum+(path.condition??100),0)/paths.length:0;
    const recent=(state.reviews||[]).length?state.reviews.map(review=>`<article class="review-row"><strong>${"★".repeat(Math.round(review.stars))}<span>${review.stars.toFixed(1)}</span></strong><p>${escapeHtml(review.text)}</p><small>${review.type} · DAY ${review.day}</small></article>`).join(""):`<p class="modal-copy">Open a ride and connect it to the front gate. Visitors will post ratings after completing their visit.</p>`;
    openModal(modalShell("VISITOR REVIEWS · APPEARANCE","What guests think of your park",`<div class="review-summary"><strong>${average?average.toFixed(1):"—"}</strong><span>AVERAGE STARS<br>${state.reviewCount||0} VERIFIED REVIEW${state.reviewCount===1?"":"S"}</span></div><div class="shop-stats review-factors"><span>ATMOSPHERE ${Math.round(state.atmosphere)}</span><span>CLEANLINESS ${Math.round(state.cleanliness)}%</span><span>PATH QUALITY ${Math.round(pathQuality)}%</span></div><div class="review-list">${recent}</div>`,`<button class="modal-button primary" data-close>Back to park</button>`),()=>{$$("[data-close]").forEach(button=>button.onclick=closeModal);});
  }

  function openMenu(){const regionOptions=Object.entries(REGIONS).map(([id,region])=>`<option value="${id}" ${state.region===id?"selected":""}>${region.name}</option>`).join("");openModal(modalShell("PARK MANAGEMENT","Session controls",`<p class="modal-copy">${state.profile?`${state.profile}'s park`:"Unregistered park"} · Day ${state.day} · Local browser save</p><div class="shop-grid"><article class="shop-card"><h3>Staff roster</h3><p>Janitors sweep assigned paths. Mechanics automatically respond to safe ride shutdowns.</p><div class="shop-stats"><span>${state.staff.janitors} JANITORS</span><span>${state.staff.mechanics} MECHANICS</span></div><button id="hireJanitor">HIRE JANITOR · $80/day</button><button id="hireMechanic" style="margin-top:5px">HIRE MECHANIC · $120/day</button></article><article class="shop-card"><h3>Lot expansion</h3><p>Unlock drifting attractions and raise park capacity after operating two rides and welcoming 50 lifetime guests.</p><button id="expandLot" ${state.lotTier>1||state.cash<12000||state.totalGuests<50||state.objects.filter(o=>getItem(o.type)?.kind==="ride"&&o.open).length<2?"disabled":""}>PERMIT · $12,000</button></article><article class="shop-card"><h3>Park region</h3><p>Relocate the surrounding landscape without removing any of your paths, rides, or buildings.</p><select id="parkRegion" class="name-input" style="font-size:14px">${regionOptions}</select><button id="applyRegion" style="margin-top:6px">APPLY REGION</button></article></div>`,`<button class="modal-button" data-close>Resume</button><button id="saveNow" class="modal-button primary">SAVE NOW</button><button id="resetGame" class="modal-button">RESET PARK</button>`),()=>{
      $$("[data-close]").forEach(b=>b.onclick=closeModal);$("#saveNow").onclick=()=>{saveTimer=99;save();closeModal();notify("Park saved","All progress is stored in this browser.");};
      $("#hireJanitor").onclick=()=>{state.staff.janitors++;notify("Janitor hired","Automatic sweeping coverage expanded.");openMenu();};$("#hireMechanic").onclick=()=>{state.staff.mechanics++;notify("Mechanic hired","Breakdown response is now available.");openMenu();};
      $("#expandLot").onclick=()=>{state.cash-=12000;state.stats.expenses+=12000;state.lotTier=2;Object.keys(state.unlocked).forEach(key=>state.unlocked[key]=true);state.powerCapacity+=100;celebrationUntil=performance.now()+4000;notify("Expansion permit approved","Drifting Thrills, a larger crowd capacity, and a 200 kW grid are now available.");closeModal();updateUI();};
      $("#applyRegion").onclick=()=>{chooseRegion($("#parkRegion").value);closeModal();notify("Park region updated",`${REGIONS[state.region].name} scenery now surrounds your park.`);updateUI();};
      $("#resetGame").onclick=()=>{if(confirm("Reset the entire park and erase the local save?")){localStorage.removeItem(SAVE_KEY);location.reload();}};
    });}

  function distance(a,b){return Math.hypot(a.x-b.x,a.y-b.y);}
  function interact(){
    if(!walkMode)return;
    const p=state.player;
    if(distance(p,{x:3.5,y:10.5})<2.2){if(!state.registered)registerProfile();else if(!state.toolkit)collectToolkit();else showWorldMessage("Job shack ledger is up to date");return;}
    if(distance(p,{x:21.5,y:4.2})<3){openUsedRideLot();return;}
    if(distance(p,{x:24.5,y:9.5})<3){openFabricator();return;}
    if(distance(p,{x:27,y:5.5})<2.5){openLegalOffice();return;}
    if(distance(p,{x:20,y:12.3})<2.6){openShippingDesk();return;}
    if(distance(p,{x:15.5,y:2.5})<2.5){collectFreight();return;}
    const nearby=state.objects.map(object=>({object,d:distance(p,object)})).sort((a,b)=>a.d-b.d)[0];if(nearby&&nearby.d<2.2){selected=nearby.object.id;renderInspector(nearby.object);return;}
    showWorldMessage("Nothing nearby to interact with");
  }

  function rushShipment(shipment){if(!shipment||shipment.status!=="transit")return;const ride=RIDES[shipment.ride],cost=Math.ceil(ride.freight*.5*(shipment.rushes+1));if(state.cash<cost)return;state.cash-=cost;state.stats.expenses+=cost;shipment.remaining*=.5;shipment.rushes++;notify("Freight expedited",`${money(cost)} paid. Remaining delivery time reduced by half.`);updateUI();}

  function updateSimulation(dt){
    if(state.speed===0)return;
    const scaled=dt*state.speed;state.time+=scaled*3;saveTimer+=dt;
    if(state.time>=1440){state.time-=1440;state.day++;runDailyCosts();rollWeather();}
    for(const shipment of state.shipments){if(shipment.status==="transit"){shipment.remaining-=scaled;if(shipment.remaining<=0){shipment.status="arrived";notify("Freight has arrived",`${RIDES[shipment.ride].name} is waiting at the eastern depot. Sign the inventory to unlock it.`);}}}
    updateConstruction(scaled);updateRides(scaled);updateGuests(scaled);updateCleanliness(scaled);spawnTimer-=scaled;
    const openRides=state.objects.filter(object=>getItem(object.type)?.kind==="ride"&&object.open&&!object.broken);
    if(openRides.length&&spawnTimer<=0&&guests.length<(state.lotTier>1?220:120)){spawnGuest(openRides);const stars=state.reviewCount?state.reviewTotal/state.reviewCount:3;spawnTimer=Math.max(.8,3.8-openRides.length*.25-stars*.25-state.reputation/100);}
    if(state.totalGuests>=25)awardMilestone("guest25","Rising Park Bonus",2000,"Twenty-five visitors have entered your growing park.");
    if(saveTimer>8)save();
  }

  function updatePlayer(dt){
    if(!walkMode||$("#modalLayer").classList.contains("hidden")===false)return;
    const horizontal=(keys.has("d")||keys.has("ArrowRight")?1:0)-(keys.has("a")||keys.has("ArrowLeft")?1:0);
    const vertical=(keys.has("s")||keys.has("ArrowDown")?1:0)-(keys.has("w")||keys.has("ArrowUp")?1:0);
    let dx=horizontal+vertical,dy=vertical-horizontal,autoWalking=false;
    if(dx||dy)walkTarget=null;
    else if(walkTarget){
      autoWalking=true;
      dx=walkTarget.x-state.player.x;dy=walkTarget.y-state.player.y;
      if(Math.hypot(dx,dy)<.12){
        const shouldInteract=walkTarget.interact;
        walkTarget=null;
        if(shouldInteract)interact();
        return;
      }
    }
    if(!dx&&!dy)return;
    const length=Math.hypot(dx,dy),speed=autoWalking?18:keys.has("Shift")?4.2:3.4,step=Math.min(length,speed*dt);
    state.player.x=clamp(state.player.x+dx/length*step,LOT.minX-1,28);
    state.player.y=clamp(state.player.y+dy/length*step,LOT.minY-1,15.5);
  }

  function startMovementLoop(){
    let previous=performance.now();
    movementTimer=setInterval(()=>{
      const now=performance.now(),elapsed=Math.max(0,(now-previous)/1000),keyboardActive=["w","a","s","d","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].some(key=>keys.has(key)),dt=Math.min(walkTarget&&!keyboardActive?1:.2,elapsed);
      previous=now;updatePlayer(dt);
    },16);
  }

  function updateConstruction(dt){for(const object of state.objects){if(object.state==="constructing"){object.buildRemaining-=dt;if(object.buildRemaining<=0){object.state="built";object.buildRemaining=0;notify(`${getItem(object.type).name} assembled`,"Construction passed its initial safety check.");if(selected===object.id)renderInspector(object);}}}}

  function updateRides(dt){
    const load=state.objects.reduce((sum,o)=>sum+effectivePower(o),0),brownout=load>state.powerCapacity;
    for(const object of state.objects){const item=getItem(object.type);if(item?.kind!=="ride"||!object.open||object.broken)continue;let wear=dt*(100-item.reliability)/18000*(object.type==="hairpin"?2:1);if(object.type==="timber"&&hasUpgrade(object,0))wear*=.85;if(object.type==="hydro"&&state.weather==="rain"&&!hasUpgrade(object,1))wear*=1.5;object.condition-=wear;if(brownout)object.condition-=dt*.015;
      if((object.cycles||0)>=15&&object.condition<18&&Math.random()<dt*.025){object.broken=true;object.open=false;state.reputation=clamp(state.reputation-2,0,100);notify(`${object.customName||item.name} safely shut down`,object.type==="hydro"?"Water-pressure control triggered a safe stop.":object.type==="neon"||object.type==="glitch"?"Power-control diagnostics isolated the affected launch circuit.":"Preventive sensors detected excessive component wear.","danger");playBreakdownSound(object.type);if(state.staff.mechanics>0)setTimeout(()=>autoRepair(object),5000);}
    }
  }
  function autoRepair(object){if(!object.broken)return;const cost=Math.max(250,Math.round((100-object.condition)*18));if(state.cash>=cost){state.cash-=cost;state.stats.expenses+=cost;object.condition=90;object.broken=false;notify(`${getItem(object.type).name} repaired`,`${money(cost)} in parts used by your mechanic.`);updateUI();}}

  function pedestrianMap(){
    const map=new Map();
    for(const object of state.objects){const kind=getItem(object.type)?.kind;if(object.z===0&&["path","queue"].includes(kind))map.set(`${object.x},${object.y}`,{x:object.x,y:object.y,kind});}
    return map;
  }

  function routeToTarget(from,target,entranceOnly=false){
    const cells=pedestrianMap(),entry="8,14";if(!cells.size||entranceOnly&&!cells.has(entry))return null;
    let start=entry;
    if(!entranceOnly){let nearest=Infinity;for(const [key,cell] of cells){const d=Math.hypot(cell.x+.5-from.x,cell.y+.5-from.y);if(d<nearest){nearest=d;start=key;}}}
    const goals=new Set();
    if(target==="exit")goals.add(entry);
    else {
      const item=getItem(target.type),occupied=target.track?.length?target.track.filter(node=>node.z===0).map(node=>[node.x,node.y]):footprint(item,target.x,target.y);
      const adjacent=[];for(const [key,cell] of cells)if(occupied.some(([x,y])=>Math.abs(cell.x-x)+Math.abs(cell.y-y)<=1))adjacent.push([key,cell]);
      const preferred=item.kind==="ride"?adjacent.filter(([,cell])=>cell.kind==="queue"):adjacent;
      for(const [key] of preferred.length?preferred:adjacent)goals.add(key);
    }
    if(!goals.size||!cells.has(start))return null;
    const queue=[start],previous=new Map([[start,null]]);let finish=null;
    while(queue.length){const key=queue.shift();if(goals.has(key)){finish=key;break;}const cell=cells.get(key);for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const next=`${cell.x+dx},${cell.y+dy}`;if(cells.has(next)&&!previous.has(next)){previous.set(next,key);queue.push(next);}}}
    if(!finish)return null;const route=[];for(let key=finish;key;key=previous.get(key)){const cell=cells.get(key);route.push({x:cell.x+.5,y:cell.y+.5});}return route.reverse();
  }

  function sendGuestTo(guest,target,route=null){
    route||=routeToTarget(guest,target);if(!route)return false;guest.target=target==="exit"?"exit":target.id;guest.route=route;guest.routeIndex=0;guest.state="walking";return true;
  }

  function chooseTarget(guest){
    const groups=[];
    if(guest.bladder>70)groups.push(state.objects.filter(o=>getItem(o.type)?.kind==="restroom"));
    if(guest.hunger>60)groups.push(state.objects.filter(o=>getItem(o.type)?.kind==="food"));
    if(guest.fatigue>50)groups.push(state.objects.filter(o=>getItem(o.type)?.kind==="rest"));
    groups.push(state.objects.filter(o=>{const kind=getItem(o.type)?.kind;return kind==="venue"||kind==="shop"||(kind==="ride"&&o.open&&!o.broken);}));
    for(const candidates of groups){const reachable=candidates.map(target=>({target,route:routeToTarget(guest,target)})).filter(entry=>entry.route);if(reachable.length)return reachable[Math.floor(Math.random()*reachable.length)];}
    return null;
  }

  function sendGuestToNext(guest){const next=chooseTarget(guest);return next?sendGuestTo(guest,next.target,next.route):sendGuestTo(guest,"exit");}

  function spawnGuest(openRides){
    const reachable=openRides.map(target=>({target,route:routeToTarget({x:8.5,y:14.5},target,true)})).filter(entry=>entry.route);if(!reachable.length)return;
    const types=[{name:"Teen",wallet:40,color:"#ff6c80",thrill:1.3},{name:"Family",wallet:150,color:"#f3c753",thrill:.75},{name:"Adult",wallet:85,color:"#48cbd3",thrill:1}];const type=types[Math.floor(Math.random()*types.length)];
    let wallet=type.wallet*(.7+Math.random()*.6),entry=state.admission.model==="day"?state.admission.dayPass:state.admission.gatePrice;if(state.admission.model==="hybrid")entry=state.admission.gatePrice;
    const tolerance=(.8+state.reputation/250);if(entry>wallet*.45*tolerance){state.stats.complaints++;state.reputation=clamp(state.reputation-.03,0,100);return;}wallet-=entry;state.cash+=entry;state.totalRevenue+=entry;
    const choice=reachable[Math.floor(Math.random()*reachable.length)],guest={id:uid("guest"),x:8.5,y:14.5,z:0,type:type.name,color:type.color,thrill:type.thrill,wallet,hunger:Math.random()*35,thirst:Math.random()*30,bladder:Math.random()*20,fatigue:0,happiness:75,state:"walking",age:0,thought:""};
    sendGuestTo(guest,choice.target,choice.route);guests.push(guest);state.totalGuests++;
  }

  function parkAppearanceStars(guest){
    const paths=state.objects.filter(object=>getItem(object.type)?.kind==="path"),pathQuality=paths.length?paths.reduce((sum,path)=>sum+(path.condition??100),0)/paths.length:0;
    const visual=clamp(state.atmosphere,0,100)*.45+state.cleanliness*.35+pathQuality*.2;
    return clamp(Math.round((2+visual/33+(guest.happiness-70)/80)*2)/2,2,5);
  }

  function submitGuestReview(guest){
    const hasArcade=state.objects.some(object=>["arcade","gameBooth"].includes(object.type)),stars=parkAppearanceStars(guest),comments=stars>=4.5?(hasArcade?["The arcade and park look amazing!","Loved the games, rides, and beautiful scenery!"]:["Beautiful paths and scenery!","This park looks incredible."]):stars>=3.5?(hasArcade?["The midway games were great and the park looks good.","Fun games, clean paths, and a nice atmosphere."]:["Clean, fun, and welcoming.","A good-looking park with lots of potential."]):["The attractions were fun; add more scenery.","More decorations would make this place even better."];
    const text=comments[Math.floor(Math.random()*comments.length)];state.reviewTotal=(state.reviewTotal||0)+stars;state.reviewCount=(state.reviewCount||0)+1;state.reviews||=[];state.reviews.unshift({stars,text,type:guest.type,day:state.day});state.reviews=state.reviews.slice(0,12);state.reputation=clamp(state.reputation+(stars-3)*.08,0,100);
    if(state.reviewCount===1)awardMilestone("firstReview","First Review Bonus",1000,"Your first public park review is live.");
    if(state.reviewCount<=3||state.reviewCount%5===0)notify(`${stars.toFixed(1)}★ visitor review`,text,stars<3?"warning":"");updateUI();
  }

  function updateGuests(dt){
    for(const guest of guests){guest.age+=dt;guest.hunger+=dt*.18;guest.thirst+=dt*(state.weather==="heat"?.3:.15);guest.bladder+=dt*.12;const cooling=state.objects.some(object=>object.type==="hydro"&&object.open&&hasUpgrade(object,2)&&distance(object,guest)<7);guest.fatigue+=dt*.08*(cooling ? .65 : 1);if(guest.thoughtTimer){guest.thoughtTimer-=dt;if(guest.thoughtTimer<=0)guest.thought="";}
      if(guest.age>=420&&guest.target!=="exit")sendGuestTo(guest,"exit");
      if(guest.state==="queued"){guest.wait-=dt;guest.fatigue+=dt*.12;guest.hunger-=dt*.12;if(guest.wait<=0){const ride=state.objects.find(o=>o.id===guest.target);if(ride)ride.queue=Math.max(0,(ride.queue||1)-1);guest.visits=(guest.visits||0)+1;guest.happiness=clamp(guest.happiness+6,0,100);const otherRides=state.objects.some(object=>getItem(object.type)?.kind==="ride"&&object.open&&!object.broken&&object.id!==ride?.id);if(guest.visits>=3||!otherRides)sendGuestTo(guest,"exit");else sendGuestToNext(guest);}continue;}
      const target=guest.target==="exit"?"exit":state.objects.find(object=>object.id===guest.target);
      if(!target){sendGuestToNext(guest);continue;}
      const waypoint=guest.route?.[guest.routeIndex||0];
      if(waypoint){const dx=waypoint.x-guest.x,dy=waypoint.y-guest.y,dist=Math.hypot(dx,dy);if(dist>.08){const surface=state.objects.find(object=>object.z===0&&object.x===Math.floor(guest.x)&&object.y===Math.floor(guest.y)),speed=(getItem(surface?.type)?.speed||1)*(state.weather==="rain"&&surface?.type==="pathConcrete"?.72:1);guest.x+=dx/dist*Math.min(dist,dt*.9*speed);guest.y+=dy/dist*Math.min(dist,dt*.9*speed);continue;}guest.routeIndex=(guest.routeIndex||0)+1;continue;}
      if(target==="exit"){submitGuestReview(guest);guest.remove=true;continue;}
      processGuestArrival(guest,target,getItem(target.type));
    }
    guests=guests.filter(guest=>!guest.remove);
  }

  function processGuestArrival(guest,target,item){
    const rideStats=item.kind==="ride"?effectiveRideStats(target,item):null;let reference=0,urgency=1;if(item.kind==="ride")reference=rideStats.excitement*1.7*guest.thrill;if(item.kind==="food"){reference=7;urgency=1+guest.hunger/130;}if(item.kind==="restroom"){reference=.35;urgency=1+guest.bladder/35;}if(item.kind==="venue")reference=item.id==="arcade"?9:11;if(item.kind==="shop")reference=8;if(item.kind==="rest")reference=2;if(item.id==="atm")reference=3;
    const quality=.75+state.reputation/180+Math.min(.25,state.atmosphere/200),loyalty=guest.happiness/75,willing=reference*urgency*quality*loyalty;
    const accepted=guest.wallet>=target.price&&(target.price<=willing||Math.random()<clamp((willing-target.price)/Math.max(1,willing)*.5+.45,.05,.95));
    if(!accepted){guest.thought="$!";guest.thoughtColor="#ff5368";guest.thoughtTimer=3;guest.happiness-=8;state.stats.complaints++;state.reputation=clamp(state.reputation-.025,0,100);sendGuestToNext(guest);return;}
    guest.wallet-=target.price;let payout=target.price;if(target.type==="hairpin"&&hasUpgrade(target,2)&&((target.cycles||0)+1)%3===0)payout*=1.15;state.cash+=payout;state.totalRevenue+=payout;target.revenue=(target.revenue||0)+payout;
    if(item.kind==="ride"){guest.state="queued";guest.wait=rideStats.cycle;target.queue=(target.queue||0)+1;target.cycles=(target.cycles||0)+1;if(target.type==="flyer"&&hasUpgrade(target,2)&&target.cycles%10===0){state.reputation=clamp(state.reputation+1.5,0,100);notify("Synchronized stunt landed",`${target.customName||item.name} triggered a park-wide reputation burst.`);}}
    else if(item.kind==="food"){guest.hunger=0;guest.thirst+=item.id==="fry"?22:7;guest.bladder+=8;guest.happiness+=4;dirtyNearbyPath(target,item.id==="fry"?5:3);sendGuestToNext(guest);}
    else if(item.kind==="restroom"){guest.bladder=0;guest.happiness+=target.price>2?-12:3;sendGuestToNext(guest);}
    else if(item.kind==="venue"){guest.happiness=clamp(guest.happiness+(item.id==="arcade"?12:10),0,100);guest.fatigue+=4;guest.visits=(guest.visits||0)+1;guest.visits>=3?sendGuestTo(guest,"exit"):sendGuestToNext(guest);}
    else if(item.kind==="shop"){guest.happiness=clamp(guest.happiness+6,0,100);sendGuestToNext(guest);}
    else if(item.kind==="rest"){guest.fatigue=Math.max(0,guest.fatigue-35);guest.happiness=clamp(guest.happiness+5,0,100);sendGuestToNext(guest);}
    else if(item.id==="atm"){guest.wallet+=50;sendGuestToNext(guest);}
  }

  function dirtyNearbyPath(target,amount){const paths=state.objects.filter(o=>getItem(o.type)?.kind==="path").sort((a,b)=>distance(a,target)-distance(b,target));if(paths[0])paths[0].dirt=(paths[0].dirt||0)+amount;}
  function updateCleanliness(dt){const paths=state.objects.filter(o=>getItem(o.type)?.kind==="path");if(state.staff.janitors>0)for(const path of paths)path.dirt=Math.max(0,(path.dirt||0)-dt*.12*state.staff.janitors);const dirt=paths.reduce((sum,p)=>sum+(p.dirt||0),0);state.cleanliness=clamp(100-dirt/Math.max(1,paths.length)*1.5,0,100);if(state.cleanliness<50)state.reputation=clamp(state.reputation-dt*.002,0,100);}
  function runDailyCosts(){const operators=state.objects.filter(o=>o.operator).length,wages=operators*50+state.staff.janitors*80+state.staff.mechanics*120;if(wages){state.cash-=wages;state.stats.expenses+=wages;notify("Daily payroll processed",`${money(wages)} paid to ${operators+state.staff.janitors+state.staff.mechanics} staff.`);}for(const path of state.objects.filter(o=>getItem(o.type)?.kind==="path"))path.condition=Math.max(0,(path.condition??100)-(path.type==="pathConcrete"?1.2:path.type==="pathWood"?.7:.4));}
  function rollWeather(){const roll=Math.random();state.weather=roll<.2?"rain":roll>.88?"heat":"clear";if(state.weather==="rain")notify("Rain system moving in","Puddles slow basic paths. LED asphalt retains full visibility.","warning");if(state.weather==="heat")notify("Heat advisory","Guest thirst rises faster and water rides gain demand.","warning");}

  function frame(now){
    const elapsed=Math.min(.5,Math.max(0,(now-lastTime)/1000)),step=1/30;
    lastTime=now;accumulator+=elapsed;
    while(accumulator>=step){updateSimulation(step);accumulator-=step;}
    drawWorld();if(Math.floor(now/500)%2===0)updateUI();requestAnimationFrame(frame);
  }

  function bindEvents(){
    window.addEventListener("resize",resize);
    window.addEventListener("pointerdown",ensureAudio,{once:true});
    $("#enterGame").addEventListener("click",()=>{$("#intro").classList.add("hidden");notify(state.registered?`Welcome back, ${state.profile}`:"Welcome to Lot 01",state.registered?"Your park systems are online.":"Walk to the blue Job Shack and register at the ledger.");canvas.focus();});
    $("#walkToggle").addEventListener("click",toggleMode);
    $("#closeInspector").addEventListener("click",closeInspector);
    $("#menuButton").addEventListener("click",openMenu);
    $("#moneyCard").addEventListener("click",openFinance);
    $("#reviewCard").addEventListener("click",openReviews);
    $("#reviewTicker").addEventListener("click",openReviews);
    $$('[data-region]').forEach(button=>button.addEventListener("click",()=>chooseRegion(button.dataset.region)));
    $$('[data-track-move]').forEach(button=>button.addEventListener("click",()=>stepTrackDirection(button.dataset.trackMove)));
    $("#trackDive").addEventListener("click",()=>changeLevel(-1));$("#trackRise").addEventListener("click",()=>changeLevel(1));$("#trackUndo").addEventListener("click",undoTrackNode);$("#trackFinish").addEventListener("click",finalizeTrack);
    $("#levelDown").addEventListener("click",()=>changeLevel(-1));$("#levelUp").addEventListener("click",()=>changeLevel(1));
    $("#rotateButton").addEventListener("click",()=>{rotation=(rotation+1)%4;showWorldMessage(`Blueprint rotated ${rotation*90}°`);});
    $("#demolishButton").addEventListener("click",()=>{walkMode=false;state.activeTool="demolish";showWorldMessage("Demolition mode · select an asset to remove");updateUI();});
    $$(".dock-tabs button").forEach(button=>button.addEventListener("click",()=>setTab(button.dataset.tab)));
    $$(".speed-controls button").forEach(button=>button.addEventListener("click",()=>{state.speed=+button.dataset.speed;updateUI();}));
    $("#modalLayer").addEventListener("pointerdown",event=>{if(event.target===$("#modalLayer"))closeModal();});

    canvas.addEventListener("pointermove",event=>{
      const p=logicalPoint(event);hoverTile=screenToGrid(p.x,p.y,state.buildLevel);hoveredObject=state.objects.filter(o=>objectCovers(o,hoverTile.x,hoverTile.y,state.buildLevel)).at(-1)||null;
      const tip=$("#hoverTooltip");
      if(hoveredObject&&!state.activeTool){const item=getItem(hoveredObject.type);tip.innerHTML=`<strong>${item.name}</strong><span>${item.kind.toUpperCase()} · L${hoveredObject.z+1}${hoveredObject.open?" · OPEN":""}</span>`;tip.style.left=`${Math.min(p.x+14,(canvas.viewWidth||1000)-245)}px`;tip.style.top=`${Math.max(8,p.y-20)}px`;tip.classList.remove("hidden");}else tip.classList.add("hidden");
    });
    canvas.addEventListener("pointerleave",()=>{$("#hoverTooltip").classList.add("hidden");hoverTile=null;});
    canvas.addEventListener("pointerdown",event=>{const p=logicalPoint(event);dragStart=screenToGrid(p.x,p.y,state.buildLevel);if(event.isTrusted)canvas.setPointerCapture?.(event.pointerId);});
    canvas.addEventListener("pointerup",event=>{
      const p=logicalPoint(event),end=screenToGrid(p.x,p.y,state.buildLevel);if(event.isTrusted&&canvas.hasPointerCapture?.(event.pointerId))canvas.releasePointerCapture(event.pointerId);
      if(walkMode){
        const object=state.objects.filter(candidate=>objectCovers(candidate,end.x,end.y,state.buildLevel)).at(-1);
        if(object){selected=object.id;renderInspector(object);walkTarget=null;}
        else {const landmark=landmarkAt(end);walkTarget=landmark?{...landmark.approach,interact:true}:{x:clamp(end.x+.5,LOT.minX-1,28),y:clamp(end.y+.5,LOT.minY-1,15.5),interact:false};showWorldMessage(landmark?"Walking to interact · use WASD or arrows to steer":"Walking to destination · use WASD or arrows to steer");}
        dragStart=null;return;
      }
      if(state.activeTool==="demolish"){demolishAt(end.x,end.y,state.buildLevel);dragStart=null;return;}
      if(state.activeTool?.startsWith("track:")){addTrackNode(end);dragStart=null;return;}
      if(state.activeTool?.startsWith("prebuilt:")){placePrebuilt(end);dragStart=null;return;}
      if(state.activeTool){const item=getItem(state.activeTool);if(["path","queue"].includes(item?.kind)&&dragStart)placeLine(state.activeTool,dragStart,end);else placeItem(state.activeTool,end.x,end.y,state.buildLevel);renderBuildItems();}
      else selectAt(end.x,end.y,state.buildLevel);dragStart=null;
    });
    canvas.addEventListener("contextmenu",event=>{event.preventDefault();state.activeTool=null;trackDraft=null;renderBuildItems();updateTrackControls();showWorldMessage("Blueprint cancelled");});

    window.addEventListener("keydown",event=>{
      ensureAudio();
      const typing=["INPUT","TEXTAREA","SELECT"].includes(document.activeElement?.tagName);if(typing){if(event.key==="Escape")document.activeElement.blur();return;}
      if(state.activeTool?.startsWith("track:")){const direction={w:"up",W:"up",ArrowUp:"up",s:"down",S:"down",ArrowDown:"down",a:"left",A:"left",ArrowLeft:"left",d:"right",D:"right",ArrowRight:"right"}[event.key];if(direction){event.preventDefault();if(!event.repeat)stepTrackDirection(direction);return;}}
      keys.add(event.key.length===1?event.key.toLowerCase():event.key);keys.add(event.key);
      const movementKey=["w","W","a","A","s","S","d","D","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(event.key);
      if(movementKey){event.preventDefault();walkTarget=null;if(!walkMode&&!state.activeTool?.startsWith("track:")&&!state.activeTool?.startsWith("prebuilt:")){walkMode=true;state.activeTool=null;trackDraft=null;closeInspector();updateUI();}if(!event.repeat)updatePlayer(.08);}
      if(event.key==="Tab"&&$("#modalLayer").classList.contains("hidden")){event.preventDefault();$("#buildDock").classList.toggle("hidden");return;}
      if(event.key==="Escape"){if(!$("#modalLayer").classList.contains("hidden")){closeModal();return;}state.activeTool=null;trackDraft=null;state.buildLevel=Math.max(0,state.buildLevel);closeInspector();renderBuildItems();updateTrackControls();return;}
      if(event.key==="Enter"&&state.activeTool?.startsWith("track:")){finalizeTrack();return;}
      if((event.key==="x"||event.key==="X")&&state.activeTool?.startsWith("track:")){undoTrackNode();return;}
      if(event.key==="e"||event.key==="E"){walkMode?interact():changeLevel(1);return;}
      if((event.key==="q"||event.key==="Q")&&!walkMode){changeLevel(-1);return;}
      if(event.key==="v"||event.key==="V"){toggleMode();return;}
      if(event.key==="r"||event.key==="R"){rotation=(rotation+1)%4;showWorldMessage(`Blueprint rotated ${rotation*90}°`);return;}
      if(event.key==="a"||event.key==="A"){if(!walkMode){auraOverlay=!auraOverlay;if(selected)renderInspector(state.objects.find(o=>o.id===selected));}return;}
      if(event.key==="b"||event.key==="B"){if(!walkMode){penaltyOverlay=!penaltyOverlay;if(selected)renderInspector(state.objects.find(o=>o.id===selected));}return;}
      if(event.key==="p"||event.key==="P"){const input=$("[data-price]",$("#inspectorBody"));input?.focus();input?.select();return;}
      if(["Delete","Backspace"].includes(event.key)){event.preventDefault();walkMode=false;state.activeTool="demolish";showWorldMessage("Demolition mode");updateUI();return;}
      if(event.key===" "){event.preventDefault();state.speed=state.speed===0?1:0;updateUI();return;}
      if(event.key==="-"){state.speed=Math.max(0,[0,1,2,4][Math.max(0,[0,1,2,4].indexOf(state.speed)-1)]);updateUI();return;}
      if(event.key==="="||event.key==="+"){const speeds=[0,1,2,4],index=speeds.indexOf(state.speed);state.speed=speeds[Math.min(speeds.length-1,index+1)];updateUI();return;}
      if(event.key==="0"){state.speed=1;updateUI();return;}
      if(/^[1-5]$/.test(event.key)){setTab(["infrastructure","attractions","commerce","atmosphere","finance"][+event.key-1]);}
    });
    window.addEventListener("keyup",event=>{keys.delete(event.key.length===1?event.key.toLowerCase():event.key);keys.delete(event.key);});
    window.addEventListener("blur",()=>keys.clear());
    window.addEventListener("beforeunload",()=>save(true));
  }

  function chooseRegion(id){if(!REGIONS[id])return;state.region=id;$$('[data-region]').forEach(button=>button.classList.toggle("active",button.dataset.region===id));$("#regionDescription").textContent=REGIONS[id].description;save(true);}
  function changeLevel(amount){const minimum=state.activeTool?.startsWith("track:")?-3:0;state.buildLevel=clamp(state.buildLevel+amount,minimum,5);updateUI();showWorldMessage(`${state.buildLevel<0?"Underground depth":"Structural layer"} ${levelLabel(state.buildLevel)}`);}
  function toggleMode(){if(!state.toolkit&&!walkMode)return;walkMode=!walkMode;walkTarget=null;if(walkMode){state.activeTool=null;trackDraft=null;state.buildLevel=Math.max(0,state.buildLevel);}closeInspector();updateUI();}

  function init(){
    state.region=REGIONS[state.region]?state.region:"meadow";state.unlocked={spinner:false,skid:false,hairpin:false,hydro:false,neon:false,flyer:false,buttonEye:false,shadow:false,glitch:false,...state.unlocked};state.coasterLicenses||={};canvas.tabIndex=0;resize();bindEvents();startMovementLoop();renderBuildItems();updateUI();chooseRegion(state.region);
    if(state.registered)$("#enterGame").innerHTML=`RETURN TO ${state.profile.toUpperCase()}'S PARK <span>→</span>`;
    requestAnimationFrame(frame);
  }

  init();
})();
