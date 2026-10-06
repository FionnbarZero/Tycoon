const slug = value => value.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
const DISTRICT_CYCLE = ['stand', 'orchard', 'market', 'juice', 'depot', 'tropical', 'frozen', 'festival'];

const GROUPS = [
  {
    category: 'Starter', icon: '🌱', startLevel: 1, base: 5,
    names: [
      ['Roadside Fruit Stand', '🏡', 'Turns fresh fruit into steady roadside sales.'],
      ['Orchard Shed', '🛖', 'Stores tools, seeds, and upgraded picking baskets.'],
      ['Tiny Office', '🗄️', 'A walkable home for staff conversations and company decisions.'],
      ['Fruit Coin Booth', '🪙', 'Trades renewable fruit and rotating prizes for Fruit Coins.'],
      ['Delivery Garage', '🚚', 'Loads vehicles and dispatches automatic delivery routes.'],
      ['Farmers Market', '🧺', 'Hosts product stalls with crowd and variety bonuses.']
    ]
  },
  {
    category: 'Food Production', icon: '🧃', startLevel: 2, base: 90,
    names: [
      ['Juice Bar', '🧃', 'Presses fresh fruit into bottled juice.'],
      ['Smoothie Shop', '🥤', 'Blends chilled fruit into valuable smoothies.'],
      ['Jam Kitchen', '🫙', 'Cooks berries and orchard fruit into jam.'],
      ['Fruit Bakery', '🥧', 'Bakes pies and pastries for premium orders.'],
      ['Candy Factory', '🍬', 'Coats and crystallizes fruit candy in timed batches.'],
      ['Ice-Cream Parlor', '🍨', 'Creates frozen fruit desserts and visitor income.'],
      ['Fruit-Drying House', '☀️', 'Preserves fruit into compact delivery snacks.'],
      ['Gift-Basket Workshop', '🎁', 'Assembles high-value mixed-fruit presents.'],
      ['Chocolate-Dipping Shop', '🍫', 'Makes luxurious dipped-fruit boxes.'],
      ['Fruit Pizza Restaurant', '🍕', 'Serves colorful fruit pizzas to restaurant crowds.']
    ]
  },
  {
    category: 'Farming', icon: '🌿', startLevel: 3, base: 220,
    names: [
      ['Seed Store', '🌱', 'Opens reliable seed supplies and rotating rare stock.'],
      ['Greenhouse', '🏡', 'Protects trees and shortens growth cycles.'],
      ['Bee Garden', '🐝', 'Improves pollination, fruit quality, and rare finds.'],
      ['Water Tower', '💧', 'Waters whole orchard rows automatically.'],
      ['Compost Center', '♻️', 'Recycles scraps into stronger harvest yields.'],
      ['Tree Nursery', '🌳', 'Raises saplings and expands orchard capacity.'],
      ['Weather Station', '🌦️', 'Forecasts events and reduces weather penalties.'],
      ['Rainbow Greenhouse', '🌈', 'Cultivates discovered hybrid and rainbow fruit.'],
      ['Underground Mushroom Farm', '🍄', 'Produces curious cellar crops and research points.'],
      ['Golden Orchard Temple', '🏛️', 'Raises golden-fruit odds and Fruit Coin income.']
    ]
  },
  {
    category: 'Workers', icon: '🧑‍🌾', startLevel: 4, base: 420,
    names: [
      ['Hiring Center', '📋', 'Unlocks interviews and a larger worker roster.'],
      ['Training Academy', '🎓', 'Raises worker skills and promotion limits.'],
      ['Break Room', '☕', 'Restores worker energy and happiness.'],
      ['Worker Apartments', '🏘️', 'Improves loyalty and offline productivity.'],
      ['Management Office', '🧑‍💼', 'Coordinates workers across every district.'],
      ['Mechanic Workshop', '🔧', 'Keeps machines and vehicles operating quickly.'],
      ['Medical Clinic', '🩺', 'Prevents long worker downtime after incidents.'],
      ['Employee Clubhouse', '🎲', 'Builds happiness, friendships, and special quests.'],
      ['Uniform Shop', '🧢', 'Equips crews for small speed and reputation bonuses.'],
      ['Worker Awards Hall', '🏅', 'Turns worker milestones into loyalty and XP.']
    ]
  },
  {
    category: 'Business', icon: '🏢', startLevel: 6, base: 950,
    names: [
      ['Company Headquarters', '🏢', 'Unlocks company-wide planning and larger contracts.'],
      ['Fruit Bank', '🏦', 'Provides fictional company investments and dividends.'],
      ['Customer Call Center', '🎧', 'Generates more phone orders and negotiation data.'],
      ['Marketing Studio', '📣', 'Creates advertising campaigns and sponsorship income.'],
      ['Accounting Office', '🧮', 'Improves reports, invoices, and passive profit.'],
      ['Research Laboratory', '🔬', 'Combines fruit into hybrids and patent discoveries.'],
      ['Contract Center', '📝', 'Unlocks restaurant and supermarket contracts.'],
      ['Fruit Exchange', '📈', 'Trades fruit against changing fictional market prices.'],
      ['Investor Lounge', '🛋️', 'Hosts business meetings with risks and rewards.'],
      ['Conference Center', '🤝', 'Enables company decisions and reputation events.']
    ]
  },
  {
    category: 'Transportation', icon: '🚛', startLevel: 7, base: 1800,
    names: [
      ['Cargo-Bike Garage', '🛺', 'Maintains cargo bicycles for neighborhood routes.'],
      ['Refrigerated Warehouse', '❄️', 'Expands product storage and protects cold goods.'],
      ['Packing Factory', '📦', 'Speeds loading and raises delivery payments.'],
      ['Train Station', '🚂', 'Moves bulk contracts between distant districts.'],
      ['Fruit Harbor', '⚓', 'Opens ocean contracts and visitor traffic.'],
      ['Airport Hangar', '🛫', 'Supports premium air freight and urgent orders.'],
      ['Boat Dock', '⛵', 'Dispatches fruit boats to island customers.'],
      ['Teleport Station', '⚡', 'Reduces travel friction across completed districts.'],
      ['Drone Center', '🛸', 'Automates small high-speed delivery orders.'],
      ['Rocket Launchpad', '🚀', 'Sends rare fruit to cosmic late-game customers.']
    ]
  },
  {
    category: 'Entertainment', icon: '🎡', startLevel: 8, base: 3200,
    names: [
      ['Fruit Museum', '🏛️', 'Displays discoveries and sells educational tickets.'],
      ['Watermelon Water Park', '🏖️', 'Attracts crowds and unlocks Watermelon Bowling.'],
      ['Fruit Carnival', '🎠', 'Hosts changing games and festival events.'],
      ['Banana Jungle Tour', '🌴', 'Runs guided tours and unlocks Monkey Trouble.'],
      ['Fruit Aquarium', '🐠', 'Combines tropical exhibits with visitor income.'],
      ['Apple Maze', '🌀', 'Sells timed maze tickets and hides seasonal clues.'],
      ['Smoothie Cinema', '🎬', 'Earns tickets and advertises featured products.'],
      ['Fruit Stadium', '🏟️', 'Hosts championships and sponsorships.'],
      ['Mascot Theater', '🎭', 'Improves reputation through cheerful performances.'],
      ['Grand Festival Grounds', '🎪', 'Hosts the endgame Golden Fruit championship.']
    ]
  },
  {
    category: 'Secret', icon: '🔐', startLevel: 10, base: 6500,
    names: [
      ['Abandoned Juice Factory', '🏚️', 'Restores forgotten machinery and lost recipes.'],
      ['Hidden Office Basement', '🗝️', 'Conceals records, codes, and a mysterious contact.'],
      ['Underground Fruit Vault', '🧱', 'Stores rare fruit beyond ordinary warehouse limits.'],
      ['Mysterious Radio Tower', '📻', 'Receives strange event forecasts and transmissions.'],
      ['Secret Island Laboratory', '🧪', 'Researches unusual tropical hybrid combinations.'],
      ['Ancient Orchard Ruins', '🗿', 'Reveals old seed lore and golden-tree clues.'],
      ['Sewer Greenhouse', '🪴', 'Turns humorous failed experiments into useful crops.'],
      ['Time Greenhouse', '⏳', 'Accelerates one production or research timer at a time.'],
      ['Alien Trading Post', '👽', 'Trades cosmic fruit for rare technology.'],
      ['Portal Building', '🌀', 'Connects the strangest corners of Fruitopia.']
    ]
  },
  {
    category: 'Late Game', icon: '🌌', startLevel: 16, base: 22000,
    names: [
      ['Robot Factory', '🤖', 'Builds tireless specialist automation crews.'],
      ['Fruit Corporation Tower', '🏙️', 'Adds executive floors and global company bonuses.'],
      ['Weather-Control Center', '🌤️', 'Lets the company soften or extend weather events.'],
      ['Golden Bank', '🏦', 'Converts endgame achievements into Golden Seed value.'],
      ['Floating Orchard', '☁️', 'Grows high-quality fruit above weather hazards.'],
      ['Underwater Farm', '🌊', 'Cultivates aquatic hybrids and tourism income.'],
      ['Volcano Greenhouse', '🌋', 'Produces fiery fruit and heat-resistant seeds.'],
      ['Moon Orchard', '🌙', 'Grows Moon Melons and boosts offline research.'],
      ['Cosmic Fruit Station', '🛰️', 'Runs interstellar fruit experiments and routes.'],
      ['Fruitopia Palace', '👑', 'Celebrates a fully evolved fruit corporation.']
    ]
  }
];

const CATEGORY_EFFECTS = {
  Starter: [['passive', .25], ['capacity', 5], ['reputation', .5], ['coinChance', .006]],
  'Food Production': [['productionSpeed', .035], ['productionValue', .06], ['warehouse', 8], ['passive', .8]],
  Farming: [['growth', .018], ['harvest', .055], ['quality', .045], ['coinChance', .009]],
  Workers: [['workerSpeed', .035], ['happiness', 1.5], ['offline', .035], ['passive', 1.2]],
  Business: [['orderValue', .055], ['negotiation', .025], ['research', .2], ['advertising', 1.6]],
  Transportation: [['deliverySpeed', .035], ['deliveryPay', .055], ['warehouse', 12], ['passive', 2.2]],
  Entertainment: [['ticket', 2.5], ['reputation', 1.1], ['eventReward', .06], ['passive', 3]],
  Secret: [['rare', .06], ['research', .6], ['offline', .06], ['coinChance', .015]],
  'Late Game': [['global', .045], ['automation', .06], ['offline', .09], ['passive', 12]]
};

let globalBuildingIndex = 0;
export const BUILDING_CATEGORIES = GROUPS.map(group => ({ id: slug(group.category), name: group.category, icon: group.icon }));
export const BUILDINGS = GROUPS.flatMap(group => group.names.map((entry, index) => {
  const [name, icon, description] = entry;
  const globalIndex = globalBuildingIndex++;
  const [effect, amount] = CATEGORY_EFFECTS[group.category][index % CATEGORY_EFFECTS[group.category].length];
  const cash = Math.max(1, Math.round(group.base * Math.pow(1.42, index)));
  const level = group.startLevel + Math.floor(index / 3);
  const secret = group.category === 'Secret';
  return {
    id: slug(name), name, icon, description, category: group.category,
    district: DISTRICT_CYCLE[(globalIndex + Math.floor(globalIndex / 9)) % DISTRICT_CYCLE.length],
    cash, coins: globalIndex < 12 ? 0 : Math.floor(globalIndex / 15), level, maxLevel: 3,
    effect, amount, secret,
    stages: ['Construction site', 'Open for business', 'Expanded operation', 'Fruitopia landmark']
  };
}));

const officeUpgrade = (id, name, icon, category, cash, level, description, effect, amount, requires = null, coins = 0) => ({
  id, name, icon, category, cash, level, description, effect, amount, requires, coins
});

export const OFFICE_UPGRADES = [
  officeUpgrade('basic_phone', 'Basic Desk Phone', '☎️', 'Communication', 1, 1, 'Calls the stand and garage from the office.', 'reputation', .5),
  officeUpgrade('smartphone', 'Fruitopia Smartphone', '📱', 'Communication', 24, 1, 'Unlocks the complete interactive company phone.', 'phone', 1, 'basic_phone'),
  officeUpgrade('group_messages', 'Group Messages', '💬', 'Communication', 90, 2, 'Workers coordinate events and problems together.', 'workerSpeed', .03, 'smartphone'),
  officeUpgrade('customer_database', 'Customer Database', '🗂️', 'Communication', 180, 3, 'Shows customer history and improves negotiation odds.', 'negotiation', .04, 'smartphone'),
  officeUpgrade('custom_counteroffer', 'Custom Counteroffers', '🤝', 'Communication', 320, 4, 'Adds custom pricing to The Big Ask and phone deals.', 'negotiation', .06, 'customer_database', 1),
  officeUpgrade('priority_notifications', 'Priority Notifications', '🔔', 'Communication', 520, 5, 'Surfaces urgent deliveries, events, and orders first.', 'eventReward', .04, 'group_messages'),
  officeUpgrade('remote_management', 'Remote Management', '🛰️', 'Communication', 900, 7, 'Manage production and workers from anywhere.', 'automation', .05, 'priority_notifications', 2),

  officeUpgrade('cash_register', 'Office Cash Register', '🧾', 'Finance', 12, 1, 'Improves records for every stand sale.', 'sale', .025),
  officeUpgrade('company_safe', 'Company Safe', '🔐', 'Finance', 75, 2, 'Protects cash and reveals a basement clue.', 'offline', .025, 'cash_register'),
  officeUpgrade('accountant', 'Accountant Desk', '🧮', 'Finance', 190, 3, 'Unlocks financial reports and invoice bonuses.', 'passive', 1.2, 'cash_register'),
  officeUpgrade('automatic_invoices', 'Automatic Invoices', '📄', 'Finance', 450, 5, 'Raises contract and phone-order payments.', 'orderValue', .07, 'accountant', 1),
  officeUpgrade('investment_dashboard', 'Investment Dashboard', '📊', 'Finance', 850, 7, 'Unlocks fictional company investments.', 'investment', .06, 'accountant', 2),
  officeUpgrade('profit_forecasting', 'Profit Forecasting', '🔮', 'Finance', 1700, 9, 'Improves investments and event predictions.', 'investment', .09, 'investment_dashboard', 3),
  officeUpgrade('golden_ledger', 'Golden Ledger', '📒', 'Finance', 3800, 12, 'Boosts endgame offline and prestige earnings.', 'offline', .08, 'profit_forecasting', 5),

  officeUpgrade('hiring_board', 'Hiring Board', '📌', 'Workers', 30, 1, 'Unlocks interviews for named workers.', 'happiness', 1),
  officeUpgrade('break_area', 'Break Area', '☕', 'Workers', 110, 2, 'Restores worker energy during office visits.', 'happiness', 2, 'hiring_board'),
  officeUpgrade('training_room', 'Training Room', '🎓', 'Workers', 260, 4, 'Raises worker skill training limits.', 'workerSpeed', .045, 'hiring_board', 1),
  officeUpgrade('employee_benefits', 'Employee Benefits', '💛', 'Workers', 620, 6, 'Improves happiness and loyalty after every shift.', 'happiness', 4, 'break_area', 2),
  officeUpgrade('worker_transportation', 'Worker Transportation', '🚌', 'Workers', 1200, 8, 'Moves workers between districts more efficiently.', 'workerSpeed', .07, 'training_room', 3),
  officeUpgrade('manager_offices', 'Manager Offices', '🧑‍💼', 'Workers', 2600, 10, 'Unlocks managers and company-wide automation.', 'automation', .08, 'worker_transportation', 5),
  officeUpgrade('employee_board', 'Employee Board', '🪧', 'Workers', 4800, 13, 'Shows live happiness, energy, and loyalty.', 'happiness', 6, 'manager_offices', 6),

  officeUpgrade('computer', 'Office Computer', '🖥️', 'Technology', 55, 2, 'Unlocks research records and production reports.', 'research', .15),
  officeUpgrade('faster_computer', 'Faster Computer', '💻', 'Technology', 170, 3, 'Speeds research and administrative tasks.', 'research', .25, 'computer'),
  officeUpgrade('business_server', 'Business Server', '🗄️', 'Technology', 520, 5, 'Improves offline automation and message capacity.', 'offline', .04, 'faster_computer', 2),
  officeUpgrade('fruit_analytics', 'Fruit Analytics', '📈', 'Technology', 1100, 7, 'Raises fruit quality and customer-order value.', 'quality', .08, 'business_server', 3),
  officeUpgrade('automated_scheduling', 'Automated Scheduling', '🗓️', 'Technology', 2400, 10, 'Speeds production, training, and deliveries.', 'productionSpeed', .1, 'fruit_analytics', 5),
  officeUpgrade('ai_assistant', 'Orchard Intelligence Assistant', '🤖', 'Technology', 5200, 13, 'Suggests upgrades and automates routine decisions.', 'automation', .12, 'automated_scheduling', 8),
  officeUpgrade('research_board', 'Research Board', '🧬', 'Technology', 9000, 16, 'Increases secret hybrid discovery odds.', 'research', 1, 'ai_assistant', 10),

  officeUpgrade('posters', 'Hand-Painted Posters', '🪧', 'Marketing', 18, 1, 'Adds a small advertising income stream.', 'advertising', .45),
  officeUpgrade('radio_ads', 'Radio Advertisements', '📻', 'Marketing', 140, 3, 'Attracts more customers and curious callers.', 'advertising', 1.2, 'posters'),
  officeUpgrade('social_campaign', 'Fruit Friends Campaign', '📸', 'Marketing', 420, 5, 'Improves reputation and phone-order frequency.', 'reputation', 2, 'radio_ads', 1),
  officeUpgrade('television_ad', 'Television Advertisement', '📺', 'Marketing', 1300, 8, 'Raises sales during Fruit Rush events.', 'sale', .09, 'social_campaign', 3),
  officeUpgrade('fruit_sponsorship', 'Champion Fruit Sponsorship', '🏅', 'Marketing', 3600, 11, 'Adds sponsorship income after minigames.', 'eventReward', .1, 'television_ad', 6),
  officeUpgrade('global_campaign', 'Global Brand Campaign', '🌍', 'Marketing', 9500, 15, 'Raises all sales, tickets, and order payments.', 'global', .1, 'fruit_sponsorship', 12),

  officeUpgrade('better_desk', 'Better Desk', '🪵', 'Office', 8, 1, 'Makes conversations more productive.', 'reputation', .4),
  officeUpgrade('comfortable_chair', 'Comfortable Chair', '🪑', 'Office', 35, 1, 'Improves patience during worker meetings.', 'happiness', 1.5, 'better_desk'),
  officeUpgrade('filing_cabinet', 'Filing Cabinet', '🗃️', 'Office', 80, 2, 'Stores clues, contracts, and worker histories.', 'orderValue', .025, 'better_desk'),
  officeUpgrade('wall_map', 'Fruitopia Wall Map', '🗺️', 'Office', 150, 3, 'Makes teleport and district planning available inside.', 'deliverySpeed', .025, 'filing_cabinet'),
  officeUpgrade('meeting_table', 'Meeting Table', '🪑', 'Office', 330, 4, 'Allows complex worker and investor decisions.', 'negotiation', .03, 'wall_map', 1),
  officeUpgrade('trophy_cabinet', 'Trophy Cabinet', '🏆', 'Office', 700, 6, 'Displays achievements and raises reputation.', 'reputation', 3, 'meeting_table', 2),
  officeUpgrade('second_floor', 'Second Office Floor', '🏗️', 'Office', 1700, 9, 'Expands the office to a modern headquarters.', 'passive', 4, 'trophy_cabinet', 4),
  officeUpgrade('conference_room', 'Conference Room', '🤝', 'Office', 3600, 11, 'Hosts larger business meetings and story quests.', 'orderValue', .08, 'second_floor', 6),
  officeUpgrade('executive_office', 'Executive Office', '🛋️', 'Office', 8000, 14, 'Upgrades the tower and improves every negotiation.', 'negotiation', .11, 'conference_room', 10),
  officeUpgrade('command_floor', 'Command Center Floor', '🛸', 'Office', 18000, 18, 'Transforms the office into a futuristic command center.', 'global', .14, 'executive_office', 18)
];

export const OFFICE_LEVELS = [
  { level: 1, threshold: 0, name: 'Wooden Shed Office', icon: '🛖' },
  { level: 2, threshold: 5, name: 'Small Business Office', icon: '🏠' },
  { level: 3, threshold: 13, name: 'Modern Fruit Headquarters', icon: '🏢' },
  { level: 4, threshold: 24, name: 'Fruit Corporation Tower', icon: '🏙️' },
  { level: 5, threshold: 36, name: 'Fruitopia Command Center', icon: '🛸' }
];

const worker = (id, name, avatar, role, personality, favorite, strength, weakness, topics) => ({
  id, name, avatar, role, personality, favorite, strength, weakness, topics
});

export const WORKER_CHARACTERS = [
  worker('picker', 'Pip Orchard', '🧑‍🌾', 'Fruit Picker', 'Optimistic and observant', 'apple', 'Careful harvesting', 'Overcommits', ['The apple trees are humming today.', 'I found an odd seed beneath the oldest tree.', 'A lighter basket would help me move faster.']),
  worker('cashier', 'Mina Till', '🧑‍💼', 'Cashier', 'Quick-witted and friendly', 'strawberry', 'Customer happiness', 'Hates messy displays', ['Customers love a tidy price board.', 'Someone left a Fruit Coin as a tip!', 'Could we improve the sampling table?']),
  worker('driver', 'Dash Clementine', '🧑‍✈️', 'Delivery Driver', 'Calm under pressure', 'orange', 'Fast routing', 'Skips breaks', ['Cottage Lane is clear today.', 'The van needs a tune-up soon.', 'I can take the rush order if we pack now.']),
  worker('juice_maker', 'Juniper Zest', '🧑‍🔬', 'Juice Maker', 'Inventive and excitable', 'lemon', 'Recipe discovery', 'Wastes ingredients experimenting', ['I have a sparkling lemon idea.', 'The blender made a very suspicious noise.', 'Could I try a premium batch?']),
  worker('baker', 'Bea Crumble', '👩‍🍳', 'Baker', 'Patient and practical', 'peach', 'Premium pastries', 'Slow perfectionist', ['A warm peach pie sells itself.', 'We are low on fruit for tomorrow.', 'The oven deserves a better temperature gauge.']),
  worker('mechanic', 'Rivet Berry', '🧑‍🔧', 'Mechanic', 'Direct and dependable', 'blueberry', 'Machine reliability', 'Blunt with customers', ['The packing belt needs attention.', 'I can fix it cheaply or fix it properly.', 'That scooter has another hundred routes in it.']),
  worker('researcher', 'Dr. Lyra Lime', '👩‍🔬', 'Scientist', 'Curious and mysterious', 'starfruit', 'Hybrid research', 'Distracted by rare fruit', ['Two ordinary fruits can hide an extraordinary result.', 'The failed sample is glowing. Probably fine.', 'I decoded part of the orchard inscription.']),
  worker('accountant', 'Cal Ledger', '🧑‍💻', 'Accountant', 'Cautious and dryly funny', 'kiwi', 'Profit forecasting', 'Avoids risk', ['The numbers are ripe, which is not an accounting term.', 'A safe investment could pay steady dividends.', 'Our invoices need fewer jam fingerprints.']),
  worker('marketing_manager', 'Sunny Peel', '👩‍🎨', 'Marketing Manager', 'Bold and sociable', 'banana', 'Advertising events', 'Expensive ideas', ['I can make the whole valley say Fruitopia.', 'A mascot would be memorable.', 'The next campaign needs a brighter sign.']),
  worker('office_assistant', 'Tess Pomelo', '🧑‍💼', 'Office Assistant', 'Organized and kind', 'mango', 'Visitor coordination', 'Worries too much', ['I have three visitors and only two chairs.', 'Your phone has a priority message.', 'I filed the mystery letter under “extremely strange.”']),
  worker('seller', 'Marco Melon', '🧔', 'Market Seller', 'Charming and competitive', 'watermelon', 'Combo sales', 'Gets carried away haggling', ['The market crowd wants variety.', 'Give me three products and I will build a combo.', 'A rival seller asked about our prices.']),
  worker('festival_worker', 'Faye Firework', '👩‍🎤', 'Festival Manager', 'Energetic and theatrical', 'rainbowfruit', 'Festival rewards', 'Plans too big', ['We need more lanterns. Always more lanterns.', 'A championship crowd is on the way.', 'The festival deserves a golden finale.']),
  worker('security', 'Bruno Bramble', '🧑‍✈️', 'Security Worker', 'Quiet and loyal', 'coconut', 'Secret discovery', 'Suspicious of everyone', ['I heard movement near the basement door.', 'Someone left footprints by the radio tower.', 'The rare-fruit vault is secure. Mostly.']),
  worker('manager', 'Avery Appleby', '🧑‍💼', 'District Manager', 'Strategic and diplomatic', 'goldenapple', 'Company automation', 'Too many meetings', ['One strong manager can help three good workers.', 'District happiness is becoming our best asset.', 'We should review the company plan.'])
];

export const CONTACTS = [
  { id: 'mayor', name: 'Mayor Marigold', avatar: '🎩', role: 'Mayor of Fruitopia', personality: 'Civic-minded' },
  { id: 'chef', name: 'Chef Sorrel', avatar: '👨‍🍳', role: 'Restaurant Owner', personality: 'Demanding gourmet' },
  { id: 'supermarket', name: 'Nora North', avatar: '🛒', role: 'Supermarket Manager', personality: 'Volume buyer' },
  { id: 'investor', name: 'Ivy Venture', avatar: '💼', role: 'Fruit Investor', personality: 'Calculated risk-taker' },
  { id: 'festival', name: 'Festival Committee', avatar: '🎪', role: 'Event Organizer', personality: 'Enthusiastic' },
  { id: 'collector', name: 'Professor Pome', avatar: '🧐', role: 'Rare-Fruit Collector', personality: 'Eccentric' },
  { id: 'rival', name: 'Rowan Rind', avatar: '😎', role: 'Friendly Rival', personality: 'Competitive but fair' },
  { id: 'mystery', name: 'Unknown Orchard', avatar: '❔', role: 'Mysterious Caller', personality: 'Unknown' }
];

export const HYBRID_RECIPES = [
  ['watermelon', 'starfruit', 'moonmelon'], ['blueberry', 'peach', 'crystalcherry'],
  ['mango', 'dragonfruit', 'firemango'], ['blueberry', 'starfruit', 'galaxygrape'],
  ['apple', 'strawberry', 'candyapple'], ['pineapple', 'frozenberry', 'icepineapple'],
  ['banana', 'goldenapple', 'goldenbanana'], ['peach', 'rainbowfruit', 'rainbowpeach'],
  ['frozenberry', 'starfruit', 'cloudberry'], ['dragonfruit', 'blueberry', 'dragonberry'],
  ['lemon', 'starfruit', 'electriclime']
].map(([a, b, result]) => ({ ingredients: [a, b].sort(), result }));

export const PRODUCTION_LINES = [
  { building: 'juice_bar', recipe: 'sunshine_juice', seconds: 12 },
  { building: 'smoothie_shop', recipe: 'banana_smoothie', seconds: 15 },
  { building: 'jam_kitchen', recipe: 'peach_preserve', seconds: 18 },
  { building: 'fruit_bakery', recipe: 'golden_pie', seconds: 24 },
  { building: 'candy_factory', recipe: 'fruit_candy', seconds: 20 },
  { building: 'ice_cream_parlor', recipe: 'berry_ice_cream', seconds: 22 },
  { building: 'fruit_drying_house', recipe: 'dried_fruit', seconds: 16 },
  { building: 'gift_basket_workshop', recipe: 'tropical_basket', seconds: 28 },
  { building: 'chocolate_dipping_shop', recipe: 'chocolate_fruit', seconds: 26 },
  { building: 'fruit_pizza_restaurant', recipe: 'fruit_pizza', seconds: 30 }
];

export const EXPANDED_EVENTS = Object.fromEntries(Object.entries({
  fruitRush: ['Fruit Rush', '⚡', 'Stand sales are doubled!', 75, { sale: 2 }],
  doubleHarvest: ['Double Harvest', '🌱', 'Manual harvests yield twice the fruit!', 70, { harvest: 2 }],
  heavyRain: ['Heavy Rain', '🌧️', 'Trees grow faster, but deliveries slow down.', 80, { growth: .62, deliverySpeed: .78 }],
  heatWave: ['Heat Wave', '☀️', 'Juice sells for more while unwatered trees grow slowly.', 75, { productionValue: 1.5, growth: 1.25 }],
  goldenCustomer: ['Golden Customer', '🤑', 'Special customers pay more and tip Fruit Coins.', 65, { orderValue: 1.5, coinChance: .18 }],
  celebrityVisit: ['Celebrity Visit', '🌟', 'Tickets, reputation, and featured products surge.', 70, { ticket: 2, reputation: 2 }],
  giantFruit: ['Giant Fruit', '🍉', 'Manual harvests produce enormous bonus yields.', 55, { harvest: 3 }],
  coinShower: ['Fruit Coin Shower', '🪙', 'Fruit Coin finds become dramatically more likely.', 45, { coinChance: .3 }],
  deliveryTraffic: ['Delivery Traffic', '🚧', 'Routes slow down, but patient customers pay more.', 70, { deliverySpeed: .7, deliveryPay: 1.25 }],
  machineBreakdown: ['Machine Breakdown', '🔧', 'Production pauses until handled by a mechanic or phone choice.', 80, { productionSpeed: 0 }],
  monkeyInvasion: ['Monkey Invasion', '🐒', 'Bananas are at risk; Monkey Trouble rewards are doubled.', 65, { minigame: 2 }],
  marketFestival: ['Market Festival', '🎈', 'Crafted products and market stalls earn 75% more.', 90, { productionValue: 1.75 }],
  rareMerchant: ['Rare Seed Merchant', '🧙', 'A rare hybrid seed trade is available by phone.', 90, { rare: .2 }],
  investorVisit: ['Investor Visit', '💼', 'Office investment choices have larger outcomes.', 75, { investment: 1.6 }],
  inspection: ['Surprise Inspection', '📋', 'High worker happiness earns a reputation bonus.', 55, { happinessCheck: 1 }],
  workerBirthday: ['Worker Birthday', '🎂', 'A small celebration boosts happiness and loyalty.', 80, { happiness: 8 }],
  powerOutage: ['Power Outage', '🔦', 'Machines slow down; manual harvesting stays valuable.', 55, { productionSpeed: .35, harvest: 1.35 }],
  rainbowWeather: ['Rainbow Weather', '🌈', 'Hybrid research and rare-fruit odds improve.', 65, { research: 2, rare: .18 }],
  meteorFruit: ['Meteor Fruit', '☄️', 'Cosmic fruit and research points may fall from the sky.', 50, { research: 3 }],
  mysteryCall: ['Mysterious Phone Call', '☎️', 'A strange caller offers a clue with uncertain consequences.', 85, { secret: 1 }]
}).map(([id, [name, icon, desc, duration, effect]]) => [id, { id, name, icon, desc, duration, effect }]));

export const MINIGAME_CATALOG = [
  ['stand', 'The Big Ask', '💬', 'district'], ['orchard', 'Basket Blitz', '🧺', 'district'],
  ['depot', 'Delivery Sort', '📦', 'district'], ['market', 'Market Rush', '🛍️', 'district'],
  ['juice', 'Perfect Blend', '🧃', 'district'], ['tropical', 'Coconut Splash', '🥥', 'district'],
  ['frozen', 'Berry Slide', '🧊', 'district'], ['watermelon', 'Watermelon Bowling', '🎳', 'watermelon_water_park'],
  ['auction', 'Fruit Auction', '🔨', 'fruit_exchange'], ['monkey', 'Monkey Trouble', '🐒', 'banana_jungle_tour'],
  ['festival', 'Golden Fruit Frenzy', '🏆', 'district']
].map(([id, name, icon, source]) => ({ id, name, icon, source }));

export const SECRETS = [
  ['basement', 'Hidden Office Basement', 'The filing cabinet has scratches around its base.'],
  ['tunnels', 'Underground Fruit Tunnels', 'Old roots form arrows beneath Apple Grove.'],
  ['locked_contact', 'The Locked Contact', 'A phone number is hidden across worker stories.'],
  ['secret_island', 'Secret Island', 'A boat captain mentions a light beyond the reef.'],
  ['golden_tree', 'The Wandering Golden Tree', 'It appears during the brightest weather.'],
  ['investor_story', 'The Orchard Investor', 'Ivy Venture knows more than she admits.'],
  ['forgotten_lab', 'Forgotten Fruit Laboratory', 'Failed experiments leave a useful trail.'],
  ['ghost_fruit', 'Midnight Ghost Fruit', 'A pale fruit only visits quiet orchards.'],
  ['hidden_code', 'The Six-Peel Code', 'Six workers each remember one symbol.'],
  ['alien_signal', 'The Cosmic Signal', 'The radio tower points beyond the moon.'],
  ['secret_championship', 'Secret Championship', 'Master every public game to receive an invitation.']
].map(([id, name, clue]) => ({ id, name, clue }));

export const EVOLUTION_AGES = [
  ['apple', 'Apple Age', '🍎', 1], ['tropical', 'Tropical Age', '🏝️', 2],
  ['frozen', 'Frozen Age', '❄️', 4], ['rainbow', 'Rainbow Age', '🌈', 7],
  ['golden', 'Golden Age', '✨', 11], ['cosmic', 'Cosmic Fruit Age', '🌌', 16]
].map(([id, name, icon, seasons]) => ({ id, name, icon, seasons }));

export const getBuilding = id => BUILDINGS.find(building => building.id === id);
export const getOfficeLevel = state => [...OFFICE_LEVELS].reverse().find(level => (state.office?.upgrades?.length || 0) >= level.threshold) || OFFICE_LEVELS[0];
export const buildingCost = (building, currentLevel = 0) => ({
  cash: Math.round(building.cash * Math.pow(2.15, currentLevel)),
  coins: building.coins ? building.coins + currentLevel : currentLevel >= 2 && building.level >= 8 ? 1 : 0
});
