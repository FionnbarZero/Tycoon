export const SAVE_VERSION = 5;
export const SAVE_KEY = 'fruitopia-tycoon-save-v3';

export const FRUITS = {
  apple: { name: 'Apple', icon: '🍎', value: 4, level: 1, growth: 7, supply: 'Apple Grove trees', use: 'Orchard Crate and Sunshine Juice' },
  lemon: { name: 'Lemon', icon: '🍋', value: 5, level: 2, growth: 9, supply: 'Sunny citrus row', use: 'Lemonade, candy, and Electric Lime research' },
  banana: { name: 'Banana', icon: '🍌', value: 6, level: 2, growth: 10, supply: 'Warm orchard row', use: 'Banana Berry Smoothie' },
  orange: { name: 'Orange', icon: '🍊', value: 7, level: 2, growth: 11, supply: 'Citrus terraces', use: 'Sunshine Juice and Dragon Punch' },
  strawberry: { name: 'Strawberry', icon: '🍓', value: 8, level: 3, growth: 9, supply: 'Raised berry beds', use: 'Banana Berry Smoothie' },
  blueberry: { name: 'Blueberry', icon: '🫐', value: 10, level: 4, growth: 13, supply: 'Market garden bushes', use: 'Blueberry Bowl and Frosted Berry Bowl' },
  watermelon: { name: 'Watermelon', icon: '🍉', value: 14, level: 5, growth: 18, supply: 'Sunny melon patch', use: 'Melon Kiwi Cooler' },
  pineapple: { name: 'Pineapple', icon: '🍍', value: 18, level: 7, growth: 24, supply: 'Tropical Island plots', use: 'Tropical Gift Basket' },
  mango: { name: 'Mango', icon: '🥭', value: 20, level: 8, growth: 26, supply: 'Tropical Island grove', use: 'Tropical Gift Basket' },
  kiwi: { name: 'Kiwi', icon: '🥝', value: 22, level: 8, growth: 28, supply: 'Juice Lab greenhouse', use: 'Melon Kiwi Cooler and Star Sparkle' },
  peach: { name: 'Peach', icon: '🍑', value: 24, level: 9, growth: 30, supply: 'Market orchard annex', use: 'Peach Preserve and Golden Orchard Pie' },
  coconut: { name: 'Coconut', icon: '🥥', value: 28, level: 9, growth: 34, supply: 'Tropical palms', use: 'Tropical Gift Basket and Coconut Cream' },
  dragonfruit: { name: 'Dragon Fruit', icon: '🐉', value: 38, level: 11, growth: 42, supply: 'Rare-seed greenhouse', use: 'Dragon Punch and Rainbow Feast' },
  starfruit: { name: 'Starfruit', icon: '⭐', value: 42, level: 12, growth: 46, supply: 'Island star garden', use: 'Star Sparkle and Rainbow Feast' },
  frozenberry: { name: 'Frozen Berries', icon: '🧊', value: 46, level: 13, growth: 48, supply: 'Frozen Valley berry tunnels', use: 'Frosted Berry Bowl' },
  goldenapple: { name: 'Golden Apple', icon: '🍏', value: 75, level: 15, growth: 65, supply: 'Golden-fruit events and rare trees', use: 'Golden Orchard Pie' },
  rainbowfruit: { name: 'Rainbow Fruit', icon: '🌈', value: 120, level: 18, growth: 90, supply: 'Grand Festival conservatory', use: 'Rainbow Feast' },
  moonmelon: { name: 'Moon Melon', icon: '🌙', value: 180, level: 99, growth: 110, rarity: 'Legendary', hybrid: true, supply: 'Watermelon + Starfruit research', use: 'Moonlit desserts and cosmic contracts' },
  crystalcherry: { name: 'Crystal Cherry', icon: '💎', value: 190, level: 99, growth: 115, rarity: 'Legendary', hybrid: true, supply: 'Blueberry + Peach research', use: 'Collector boxes and patents' },
  firemango: { name: 'Fire Mango', icon: '🔥', value: 205, level: 99, growth: 120, rarity: 'Legendary', hybrid: true, supply: 'Mango + Dragon Fruit research', use: 'Spicy candy and volcano tourism' },
  galaxygrape: { name: 'Galaxy Grape', icon: '🌌', value: 225, level: 99, growth: 125, rarity: 'Cosmic', hybrid: true, supply: 'Blueberry + Starfruit research', use: 'Cosmic juice and research patents' },
  candyapple: { name: 'Candy Apple', icon: '🍭', value: 155, level: 99, growth: 95, rarity: 'Rare', hybrid: true, supply: 'Apple + Strawberry research', use: 'Fruit candy and carnival orders' },
  icepineapple: { name: 'Ice Pineapple', icon: '🧊', value: 210, level: 99, growth: 120, rarity: 'Legendary', hybrid: true, supply: 'Pineapple + Frozen Berry research', use: 'Frozen desserts and resort contracts' },
  goldenbanana: { name: 'Golden Banana', icon: '🌟', value: 240, level: 99, growth: 130, rarity: 'Legendary', hybrid: true, supply: 'Banana + Golden Apple research', use: 'Rare auctions and monkey treaties' },
  rainbowpeach: { name: 'Rainbow Peach', icon: '🌈', value: 230, level: 99, growth: 125, rarity: 'Legendary', hybrid: true, supply: 'Peach + Rainbow Fruit research', use: 'Festival feasts and premium gifts' },
  cloudberry: { name: 'Cloudberry', icon: '☁️', value: 260, level: 99, growth: 140, rarity: 'Cosmic', hybrid: true, supply: 'Frozen Berry + Starfruit research', use: 'Airline orders and floating orchards' },
  dragonberry: { name: 'Dragon Berry', icon: '🐲', value: 275, level: 99, growth: 145, rarity: 'Cosmic', hybrid: true, supply: 'Dragon Fruit + Blueberry research', use: 'Championship punch and patents' },
  electriclime: { name: 'Electric Lime', icon: '⚡', value: 290, level: 99, growth: 150, rarity: 'Cosmic', hybrid: true, supply: 'Lemon + Starfruit research', use: 'Energy candy and technology contracts' }
};

for (const fruit of Object.values(FRUITS)) {
  fruit.rarity ??= fruit.level >= 15 ? 'Legendary' : fruit.level >= 10 ? 'Rare' : fruit.level >= 5 ? 'Uncommon' : 'Common';
  fruit.qualityLevels ??= ['Everyday', 'Fresh', 'Premium', 'Prize', 'Golden'];
  fruit.demand ??= Math.max(1, Math.round(6 - Math.min(4, fruit.value / 35)));
}

const district = (id, name, icon, x, y, unlock, minigame, minigameCost, upgrades, colors) => ({
  id, name, icon, x, y, unlock, minigame, minigameCost, upgrades, colors
});

export const DISTRICTS = [
  district('stand', 'Sunny Side Fruit Stand', '🏡', 360, 330, { level: 1 }, 'The Big Ask', 4, [
    ['sign', 'Better Sign', 'A hand-painted sign draws more neighbors.', 40, 0, '🪧', { passive: 0.35, sale: 0.05 }],
    ['awning', 'Striped Awning', 'Keeps fruit cool and the counter cheerful.', 65, 0, '⛱️', { passive: 0.55 }],
    ['baskets', 'Display Baskets', 'Show more tempting fruit at once.', 95, 0, '🧺', { capacity: 12, sale: 0.05 }],
    ['counter', 'Larger Counter', 'Serve a bigger lunchtime crowd.', 135, 0, '🪵', { passive: 0.9 }],
    ['board', 'Price Board', 'Clear prices speed up every sale.', 185, 0, '📋', { sale: 0.12 }],
    ['register', 'Cash Register', 'No more counting change twice.', 250, 1, '🧾', { passive: 1.4 }],
    ['cashier', 'Friendly Cashier', 'A warm welcome earns better tips.', 360, 2, '🧑‍🌾', { tips: 0.08, passive: 2 }],
    ['loyalty', 'Loyalty Club', 'Regulars return for premium produce.', 520, 3, '💛', { sale: 0.2, passive: 3 }]
  ], ['#ffca63', '#ff8b54']),
  district('orchard', 'Apple Grove Orchard', '🌳', 790, 290, { level: 1 }, 'Basket Blitz', 5, [
    ['watering', 'Copper Watering Cans', 'Healthy roots shorten every grow cycle.', 45, 0, '🚿', { growth: 0.06 }],
    ['soil', 'Rich Compost', 'Better soil yields an extra fruit sometimes.', 80, 0, '🪴', { harvest: 0.12 }],
    ['bees', 'Busy Bee Hives', 'Pollinators improve quality and coin odds.', 120, 0, '🐝', { coinChance: 0.04 }],
    ['capacity', 'Stacked Crates', 'Add room for a bigger harvest.', 170, 0, '📦', { capacity: 18 }],
    ['seeds', 'Rare Seed Shed', 'Unlock unusual fruit seeds sooner.', 230, 1, '🌱', { rare: 1 }],
    ['sprinklers', 'Rainbow Sprinklers', 'Automate watering across every row.', 320, 2, '💦', { growth: 0.12 }],
    ['pickers', 'Picker Cottage', 'Gives orchard workers a cozy base.', 460, 2, '🏠', { automation: 1 }],
    ['greenhouse', 'Glass Greenhouse', 'Grow premium fruit in any season.', 650, 4, '🏛️', { growth: 0.18, harvest: 0.2 }]
  ], ['#8fd25b', '#4ca95f']),
  district('depot', 'Delivery Depot', '🚚', 1180, 400, { level: 2 }, 'Delivery Sort', 7, [
    ['ramp', 'Loading Ramp', 'Load basic routes more quickly.', 160, 0, '🛹', { deliverySpeed: 0.04 }],
    ['shelves', 'Crate Shelves', 'Organized crates prevent lost produce.', 230, 0, '🧰', { deliveryPay: 0.07 }],
    ['radio', 'Route Radio', 'Drivers learn about traffic early.', 320, 1, '📻', { deliverySpeed: 0.07 }],
    ['garage', 'Covered Garage', 'Protect and maintain every vehicle.', 460, 1, '🏭', { passive: 1.5 }],
    ['mapdesk', 'Dispatch Map Desk', 'Better planning improves tip chances.', 650, 2, '🗺️', { tips: 0.06 }],
    ['coldbay', 'Cold Storage Bay', 'Send berries and juices farther.', 900, 3, '❄️', { capacity: 24, deliveryPay: 0.08 }],
    ['workshop', 'Mechanic Workshop', 'Tune the whole fleet between runs.', 1250, 4, '🔧', { deliverySpeed: 0.12 }],
    ['tower', 'Dispatch Tower', 'Coordinate routes across Fruitopia.', 1800, 6, '🗼', { passive: 5, deliveryPay: 0.15 }]
  ], ['#7ec8ff', '#3e7ecb']),
  district('market', 'Market Square', '🏘️', 730, 690, { level: 4, prev: 'depot', progress: 50 }, 'Market Rush', 9, [
    ['stalls', 'Canvas Stalls', 'Open colorful stalls for local sellers.', 420, 1, '⛺', { passive: 2 }],
    ['fountain', 'Fruit Fountain', 'A juicy landmark draws curious shoppers.', 580, 1, '⛲', { passive: 2.5 }],
    ['lights', 'Market Lanterns', 'Keep the evening market open longer.', 780, 2, '🏮', { passive: 3.2 }],
    ['bakery', 'Pie Bakery', 'Turn orchard fruit into fragrant pies.', 1050, 2, '🥧', { recipe: 1 }],
    ['jamshop', 'Jam & Preserve Shop', 'Bottle surplus fruit for premium sales.', 1400, 3, '🫙', { recipe: 1 }],
    ['stage', 'Busker Stage', 'Music lifts moods and customer tips.', 1900, 4, '🎻', { tips: 0.08 }],
    ['arcade', 'Shopping Arcade', 'A covered lane adds premium vendors.', 2600, 5, '🏬', { sale: 0.12 }],
    ['clock', 'Golden Market Clock', 'Makes every market day feel special.', 3600, 7, '🕰️', { passive: 10 }]
  ], ['#ff9e80', '#e95f76']),
  district('juice', 'Juice Lab', '🧃', 1270, 760, { level: 6, prev: 'market', progress: 50 }, 'Perfect Blend', 12, [
    ['press', 'Citrus Press', 'Squeeze bright, simple juices.', 900, 2, '🍊', { craft: 0.05 }],
    ['blender', 'Turbo Blender', 'Blend smoothies without the long wait.', 1250, 2, '🥤', { craft: 0.08 }],
    ['counter', 'Tasting Counter', 'Samples make crafted goods sell faster.', 1700, 3, '🥛', { sale: 0.08 }],
    ['chiller', 'Glass Chiller', 'Keep delicate blends fresh.', 2300, 4, '🧊', { capacity: 30 }],
    ['bottler', 'Bottle Line', 'Package juice for delivery routes.', 3100, 5, '🍾', { passive: 7 }],
    ['flavor', 'Flavor Scanner', 'Find the best balance in every recipe.', 4200, 6, '🔬', { craft: 0.12 }],
    ['maker', 'Juice Maker Station', 'A trained maker blends while you explore.', 5700, 8, '🧑‍🔬', { automation: 1 }],
    ['reactor', 'Rainbow Flavor Reactor', 'Create the rarest festival blends.', 7800, 10, '⚗️', { passive: 18, craft: 0.2 }]
  ], ['#bc8cff', '#7254c9']),
  district('tropical', 'Tropical Island', '🏝️', 1730, 690, { level: 8, prev: 'juice', progress: 50 }, 'Coconut Splash', 16, [
    ['dock', 'Bamboo Dock', 'Welcome fruit boats to the island.', 2200, 3, '🛶', { passive: 6 }],
    ['palms', 'Coconut Palms', 'Grow a steady supply of coconuts.', 3000, 4, '🌴', { harvest: 0.12 }],
    ['grove', 'Mango Grove', 'Plant fragrant premium mango trees.', 4100, 5, '🥭', { passive: 8 }],
    ['tiki', 'Fruit Tiki Bar', 'Serve island blends with umbrellas.', 5600, 6, '🍹', { sale: 0.1 }],
    ['bridge', 'Rope Bridges', 'Connect remote growing terraces.', 7600, 8, '🌉', { growth: 0.08 }],
    ['reef', 'Reef Market', 'Trade with boat crews from afar.', 10300, 10, '🐠', { deliveryPay: 0.1 }],
    ['villa', 'Worker Villas', 'Rested crews harvest more carefully.', 14000, 12, '🏖️', { automation: 1 }],
    ['temple', 'Sunfruit Temple', 'A glowing island landmark.', 19000, 15, '🛕', { passive: 38 }]
  ], ['#42d5b5', '#168c91']),
  district('frozen', 'Frozen Fruit Valley', '🏔️', 1450, 1080, { level: 11, prev: 'tropical', progress: 50 }, 'Berry Slide', 22, [
    ['boots', 'Snow Boots', 'Reach frosty berry rows safely.', 6500, 6, '🥾', { passive: 11 }],
    ['tunnels', 'Berry Tunnels', 'Shield bushes from biting wind.', 8800, 8, '⛺', { growth: 0.08 }],
    ['sleigh', 'Fruit Sleigh', 'Glide produce down to the depot.', 12000, 10, '🛷', { deliverySpeed: 0.08 }],
    ['freezer', 'Flash Freezer', 'Create valuable frozen berry packs.', 16500, 12, '❄️', { craft: 0.1 }],
    ['cabin', 'Cocoa Cabin', 'Warm customers linger and spend.', 22500, 14, '🏠', { passive: 24 }],
    ['lift', 'Crate Ski Lift', 'Move harvests over steep ridges.', 30500, 17, '🚡', { capacity: 45 }],
    ['research', 'Cold Research Dome', 'Researchers improve rare fruit yields.', 41500, 20, '🔭', { rare: 1 }],
    ['palace', 'Crystal Fruit Palace', 'Crown the glittering valley.', 56000, 26, '🏰', { passive: 80 }]
  ], ['#b8e8ff', '#718ccb']),
  district('festival', 'Grand Fruit Festival', '🎪', 760, 1130, { level: 15, prev: 'frozen', progress: 75 }, 'Golden Fruit Frenzy', 32, [
    ['gate', 'Festival Gate', 'Welcome guests beneath a fruit arch.', 18000, 12, '🎟️', { passive: 25 }],
    ['games', 'Carnival Games', 'Offer playful ways to win fruit prizes.', 25000, 14, '🎯', { passive: 32 }],
    ['parade', 'Fruit Parade', 'A daily procession fills the streets.', 34000, 17, '🥁', { tips: 0.1 }],
    ['kitchen', 'Festival Kitchen', 'Cook spectacular shared feasts.', 46000, 20, '👩‍🍳', { craft: 0.15 }],
    ['wheel', 'Orchard Sky Wheel', 'A glowing landmark seen everywhere.', 62000, 24, '🎡', { passive: 55 }],
    ['arena', 'Golden Arena', 'Host elite fruit competitions.', 84000, 28, '🏟️', { passive: 70 }],
    ['workers', 'Festival Crew Hall', 'Coordinate sellers, cooks, and guides.', 114000, 34, '🎭', { automation: 1 }],
    ['crown', 'Rainbow Fruit Crown', 'Complete the brightest empire in the valley.', 155000, 45, '👑', { passive: 180, sale: 0.2 }]
  ], ['#ffdc51', '#f05d86'])
].map(d => ({ ...d, upgrades: d.upgrades.map(([id, name, desc, cash, coins, icon, effect]) => ({ id, name, desc, cash, coins, icon, effect })) }));

export const VEHICLES = [
  { id: 'bicycle', name: 'Bicycle', icon: '🚲', cost: 140, coins: 0, level: 2, speed: 1 },
  { id: 'cargo_bike', name: 'Cargo Bicycle', icon: '🛺', cost: 460, coins: 1, level: 3, speed: 1.12 },
  { id: 'scooter', name: 'Scooter', icon: '🛵', cost: 1100, coins: 2, level: 5, speed: 1.25 },
  { id: 'van', name: 'Delivery Van', icon: '🚐', cost: 3500, coins: 5, level: 7, speed: 1.45 },
  { id: 'drone', name: 'Delivery Drone', icon: '🛸', cost: 7800, coins: 8, level: 9, speed: 2.35 },
  { id: 'truck', name: 'Refrigerated Truck', icon: '🚛', cost: 11000, coins: 10, level: 10, speed: 1.7 },
  { id: 'train', name: 'Fruit Train', icon: '🚂', cost: 22000, coins: 14, level: 12, speed: 1.6 },
  { id: 'boat', name: 'Fruit Boat', icon: '⛵', cost: 28000, coins: 16, level: 12, speed: 1.55 },
  { id: 'cargo_boat', name: 'Cargo Boat', icon: '🚢', cost: 52000, coins: 22, level: 14, speed: 1.72 },
  { id: 'fruit_plane', name: 'Fruit Plane', icon: '✈️', cost: 76000, coins: 28, level: 15, speed: 2.05 },
  { id: 'helicopter', name: 'Fruit Helicopter', icon: '🚁', cost: 90000, coins: 35, level: 16, speed: 2.2 },
  { id: 'rocket', name: 'Fruit Rocket', icon: '🚀', cost: 290000, coins: 65, level: 20, speed: 3.1 }
];

export const ROUTES = [
  { id: 'cottages', name: 'Cottage Lane', icon: '🏠', vehicle: 'bicycle', seconds: 18, pay: 95, xp: 24, tip: 0.25, requires: { apple: 5 } },
  { id: 'school', name: 'Sunbeam School', icon: '🏫', vehicle: 'cargo_bike', seconds: 28, pay: 230, xp: 48, tip: 0.3, requires: { apple: 4, banana: 4 } },
  { id: 'cafe', name: 'Market Café', icon: '☕', vehicle: 'scooter', seconds: 38, pay: 520, xp: 80, tip: 0.32, requires: { orange: 5, strawberry: 4 } },
  { id: 'city', name: 'Juice Bar Row', icon: '🏙️', vehicle: 'van', seconds: 52, pay: 1500, xp: 145, tip: 0.35, requires: { blueberry: 6, watermelon: 3, kiwi: 2 } },
  { id: 'campus', name: 'Innovation Campus', icon: '🏫', vehicle: 'drone', seconds: 34, pay: 2800, xp: 190, tip: 0.36, requires: { lemon: 5, kiwi: 4, strawberry: 4 } },
  { id: 'ski', name: 'Snowcap Lodge', icon: '🏔️', vehicle: 'truck', seconds: 68, pay: 4800, xp: 260, tip: 0.38, requires: { frozenberry: 8, peach: 4 } },
  { id: 'rail', name: 'Cross-Valley Grocers', icon: '🚉', vehicle: 'train', seconds: 76, pay: 7900, xp: 360, tip: 0.38, requires: { apple: 12, orange: 10, watermelon: 5 } },
  { id: 'islands', name: 'Island Resort', icon: '🏝️', vehicle: 'boat', seconds: 82, pay: 9200, xp: 390, tip: 0.42, requires: { pineapple: 6, mango: 6, coconut: 4 } },
  { id: 'harbor_export', name: 'Grand Harbor Export', icon: '⚓', vehicle: 'cargo_boat', seconds: 94, pay: 17500, xp: 520, tip: 0.44, requires: { pineapple: 10, coconut: 8, mango: 8 } },
  { id: 'air_market', name: 'Continental Air Market', icon: '🛫', vehicle: 'fruit_plane', seconds: 90, pay: 31000, xp: 680, tip: 0.47, requires: { dragonfruit: 5, starfruit: 6, rainbowfruit: 2 } },
  { id: 'sky', name: 'Cloudtop Gala', icon: '☁️', vehicle: 'helicopter', seconds: 100, pay: 38000, xp: 760, tip: 0.5, requires: { starfruit: 5, dragonfruit: 4, goldenapple: 2 } },
  { id: 'orbital', name: 'Moon Orchard Station', icon: '🌙', vehicle: 'rocket', seconds: 120, pay: 150000, xp: 1600, tip: 0.55, requires: { moonmelon: 3, galaxygrape: 3, electriclime: 2 } }
];

export const RECIPES = [
  { id: 'orchard_crate', name: 'Orchard Crate', icon: '📦', category: 'Bundle', level: 1, district: 'stand', value: 34, ingredients: { apple: 5 } },
  { id: 'sunshine_juice', name: 'Sunshine Juice', icon: '🧃', category: 'Juice', level: 2, district: 'stand', value: 66, ingredients: { apple: 3, orange: 2 } },
  { id: 'banana_smoothie', name: 'Banana Berry Smoothie', icon: '🥤', category: 'Smoothie', level: 3, district: 'orchard', value: 94, ingredients: { banana: 3, strawberry: 2 } },
  { id: 'blueberry_bowl', name: 'Blueberry Breakfast Bowl', icon: '🥣', category: 'Fruit Bowl', level: 4, district: 'market', value: 130, ingredients: { blueberry: 4, banana: 2 } },
  { id: 'melon_cooler', name: 'Melon Kiwi Cooler', icon: '🍹', category: 'Juice', level: 8, district: 'juice', value: 245, ingredients: { watermelon: 2, kiwi: 3 } },
  { id: 'peach_preserve', name: 'Peach Preserve', icon: '🫙', category: 'Preserve', level: 9, district: 'market', value: 270, ingredients: { peach: 4, apple: 2 } },
  { id: 'tropical_basket', name: 'Tropical Gift Basket', icon: '🎁', category: 'Gift Basket', level: 9, district: 'tropical', value: 420, ingredients: { pineapple: 3, mango: 3, coconut: 2 } },
  { id: 'coconut_cream', name: 'Coconut Cream Cup', icon: '🍨', category: 'Dessert', level: 10, district: 'tropical', value: 315, ingredients: { coconut: 4, banana: 2 } },
  { id: 'dragon_punch', name: 'Dragon Punch', icon: '🐲', category: 'Juice', level: 11, district: 'juice', value: 510, ingredients: { dragonfruit: 3, orange: 3 } },
  { id: 'star_sparkle', name: 'Star Sparkle', icon: '✨', category: 'Smoothie', level: 12, district: 'tropical', value: 590, ingredients: { starfruit: 3, kiwi: 3 } },
  { id: 'frosted_bowl', name: 'Frosted Berry Bowl', icon: '❄️', category: 'Fruit Bowl', level: 13, district: 'frozen', value: 680, ingredients: { frozenberry: 4, blueberry: 4 } },
  { id: 'golden_pie', name: 'Golden Orchard Pie', icon: '🥧', category: 'Pie', level: 15, district: 'festival', value: 1100, ingredients: { goldenapple: 2, peach: 4 } },
  { id: 'rainbow_feast', name: 'Rainbow Fruit Feast', icon: '🌈', category: 'Festival', level: 18, district: 'festival', value: 2600, ingredients: { rainbowfruit: 1, dragonfruit: 3, starfruit: 3 } },
  { id: 'lemonade', name: 'Sparkling Lemonade', icon: '🍋', category: 'Juice', level: 2, district: 'stand', value: 58, ingredients: { lemon: 4 } },
  { id: 'fruit_candy', name: 'Jewel Fruit Candy', icon: '🍬', category: 'Candy', level: 7, district: 'market', value: 235, ingredients: { strawberry: 3, lemon: 2, apple: 2 } },
  { id: 'berry_ice_cream', name: 'Berry Cloud Ice Cream', icon: '🍨', category: 'Ice Cream', level: 8, district: 'frozen', value: 310, ingredients: { blueberry: 3, strawberry: 3, banana: 1 } },
  { id: 'dried_fruit', name: 'Sunny Dried Fruit', icon: '☀️', category: 'Dried Fruit', level: 6, district: 'market', value: 190, ingredients: { apple: 2, banana: 2, orange: 2 } },
  { id: 'chocolate_fruit', name: 'Chocolate Fruit Box', icon: '🍫', category: 'Dessert', level: 10, district: 'tropical', value: 480, ingredients: { strawberry: 3, banana: 2, coconut: 2 } },
  { id: 'fruit_pizza', name: 'Rainbow Fruit Pizza', icon: '🍕', category: 'Restaurant', level: 12, district: 'festival', value: 720, ingredients: { peach: 2, kiwi: 2, pineapple: 2, strawberry: 2 } },
  { id: 'moon_tart', name: 'Moon Melon Tart', icon: '🌙', category: 'Hybrid Dessert', level: 18, district: 'festival', value: 2200, ingredients: { moonmelon: 1, starfruit: 2 } },
  { id: 'electric_candy', name: 'Electric Lime Candy', icon: '⚡', category: 'Hybrid Candy', level: 20, district: 'juice', value: 3100, ingredients: { electriclime: 1, candyapple: 1 } }
];

export const WORKERS = [
  { id: 'picker', name: 'Pickers', icon: '🧑‍🌾', district: 'orchard', base: 320, desc: 'Harvest one ready tree automatically every few seconds.' },
  { id: 'cashier', name: 'Cashiers', icon: '🧑‍💼', district: 'stand', base: 380, desc: 'Sell inventory faster and improve stand income.' },
  { id: 'driver', name: 'Delivery Drivers', icon: '🧑‍✈️', district: 'depot', base: 850, desc: 'Shorten delivery travel times.' },
  { id: 'juice_maker', name: 'Juice Makers', icon: '🧑‍🔬', district: 'juice', base: 1800, desc: 'Occasionally craft an affordable unlocked recipe.' },
  { id: 'seller', name: 'Market Sellers', icon: '🧑‍🍳', district: 'market', base: 1450, desc: 'Add steady market income.' },
  { id: 'mechanic', name: 'Mechanics', icon: '🧑‍🔧', district: 'depot', base: 2600, desc: 'Increase all vehicle payouts.' },
  { id: 'researcher', name: 'Researchers', icon: '🧑‍🏫', district: 'frozen', base: 7500, desc: 'Improve rare-fruit and Fruit Coin chances.' },
  { id: 'festival_worker', name: 'Festival Workers', icon: '🎭', district: 'festival', base: 12000, desc: 'Generate festival ticket income and XP.' },
  { id: 'baker', name: 'Bakers', icon: '👩‍🍳', district: 'market', base: 2100, desc: 'Improve pie, candy, and restaurant production.' },
  { id: 'accountant', name: 'Accountants', icon: '🧑‍💻', district: 'stand', base: 2800, desc: 'Improve invoices, investments, and offline income.' },
  { id: 'marketing_manager', name: 'Marketing Managers', icon: '👩‍🎨', district: 'market', base: 3600, desc: 'Increase reputation, advertising, and customer demand.' },
  { id: 'office_assistant', name: 'Office Assistants', icon: '🧑‍💼', district: 'stand', base: 1900, desc: 'Organize messages and queue office visitors.' },
  { id: 'security', name: 'Security Workers', icon: '🧑‍✈️', district: 'tropical', base: 5200, desc: 'Protect rare fruit and reveal secret clues.' },
  { id: 'manager', name: 'District Managers', icon: '🧑‍💼', district: 'festival', base: 8500, desc: 'Boost every assigned worker and automation system.' }
];

export const QUEST_POOL = [
  { type: 'harvest', label: n => `Harvest ${n} fruit`, targets: [10, 18, 28], icon: '🧺' },
  { type: 'earnCash', label: n => `Earn $${n}`, targets: [150, 400, 900], icon: '💵' },
  { type: 'earnCoins', label: n => `Earn ${n} Fruit Coins`, targets: [2, 4, 6], icon: '🪙' },
  { type: 'sell', label: n => `Sell ${n} items`, targets: [12, 22, 35], icon: '🏷️' },
  { type: 'craft', label: n => `Craft ${n} products`, targets: [2, 4, 7], icon: '🧃' },
  { type: 'delivery', label: n => `Complete ${n} deliveries`, targets: [1, 2, 3], icon: '🚚' },
  { type: 'upgrade', label: n => `Buy ${n} improvements`, targets: [1, 2, 3], icon: '🔨' },
  { type: 'minigame', label: n => `Play ${n} minigame${n > 1 ? 's' : ''}`, targets: [1, 2, 3], icon: '🎮' }
];

export const MILESTONES = [
  { id: 'tutorial_harvest', name: 'First Pick', desc: 'Harvest a ripe tree.', type: 'harvest', target: 1, reward: { cash: 35, xp: 25 } },
  { id: 'tutorial_upgrade', name: 'Fresh Paint', desc: 'Purchase any district improvement.', type: 'upgrade', target: 1, reward: { cash: 60, coins: 1, xp: 35 } },
  { id: 'tutorial_delivery', name: 'On the Road', desc: 'Complete your first delivery.', type: 'delivery', target: 1, reward: { cash: 120, coins: 2, xp: 60 } },
  { id: 'fruit_100', name: 'Full Baskets', desc: 'Harvest 100 fruit.', type: 'harvest', target: 100, reward: { cash: 500, coins: 3, xp: 150 } },
  { id: 'craft_20', name: 'Recipe Regular', desc: 'Craft 20 products.', type: 'craft', target: 20, reward: { cash: 900, coins: 5, xp: 240 } },
  { id: 'delivery_10', name: 'Route Master', desc: 'Complete 10 deliveries.', type: 'delivery', target: 10, reward: { cash: 1500, coins: 6, xp: 320 } },
  { id: 'minigame_10', name: 'Arcade Orchardist', desc: 'Play 10 minigames.', type: 'minigame', target: 10, reward: { cash: 2000, coins: 8, xp: 400 } },
  { id: 'district_1', name: 'Neighborhood Hero', desc: 'Complete any district.', type: 'districtComplete', target: 1, reward: { cash: 3000, coins: 10, xp: 500 } }
];

export const ACHIEVEMENTS = [
  { id: 'apple_a_day', name: 'Apple a Day', icon: '🍎', desc: 'Harvest 25 fruit.', stat: 'harvest', target: 25, reward: 2 },
  { id: 'pocket_change', name: 'Pocketful of Sunshine', icon: '🪙', desc: 'Earn 10 Fruit Coins.', stat: 'earnCoins', target: 10, reward: 3 },
  { id: 'merchant', name: 'Market Maven', icon: '🏷️', desc: 'Sell 100 items.', stat: 'sell', target: 100, reward: 4 },
  { id: 'roadtrip', name: 'Road Trip', icon: '🚐', desc: 'Complete 8 deliveries.', stat: 'delivery', target: 8, reward: 4 },
  { id: 'builder', name: 'Fruit Architect', icon: '🔨', desc: 'Buy 18 improvements.', stat: 'upgrade', target: 18, reward: 5 },
  { id: 'gamer', name: 'High Scorer', icon: '🏆', desc: 'Score 150 in any minigame.', stat: 'highScore', target: 150, reward: 6 },
  { id: 'tycoon', name: 'Fruitopia Tycoon', icon: '👑', desc: 'Complete four districts.', stat: 'districtComplete', target: 4, reward: 12 }
];

export const EVENTS = {
  fruitRush: { name: 'Fruit Rush', icon: '⚡', desc: 'Stand sales are doubled!', duration: 75 },
  doubleHarvest: { name: 'Double Harvest', icon: '🌱', desc: 'Manual harvests yield twice the fruit!', duration: 70 },
  marketDay: { name: 'Market Day', icon: '🎈', desc: 'Crafted products sell for 75% more!', duration: 90 },
  goldenFruit: { name: 'Golden Fruit', icon: '✨', desc: 'Fruit Coin finds are much more likely!', duration: 60 }
};

export const LEVEL_TITLES = [
  [1, 'Stand Starter'], [3, 'Orchard Keeper'], [5, 'Fruit Merchant'], [8, 'Juice Innovator'],
  [11, 'Island Grower'], [14, 'Valley Magnate'], [18, 'Fruitopia Tycoon'], [25, 'Golden Legend']
];

export const XP_FOR_LEVEL = level => Math.round(85 * Math.pow(level, 1.45));

export const getDistrict = id => DISTRICTS.find(d => d.id === id);
export const getFruit = id => FRUITS[id];
export const formatIngredients = ingredients => Object.entries(ingredients)
  .map(([id, count]) => `${FRUITS[id]?.icon || ''} ${count}`)
  .join(' · ');
