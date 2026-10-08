export const SEWER_WORLD={width:120,height:90};

export const SEWER_ENTRANCES=[
  {id:"sunny-manhole",name:"Sunny Side Manhole",x:15,y:56,sewerX:8,sewerY:76,unlock:"Inspect its carved apple symbol and follow the sewer clue."},
  {id:"orchard-manhole",name:"Orchard Road Manhole",x:34,y:67,sewerX:14,sewerY:76,unlock:"Reach Empire level 3 or ask Bruno Bramble about the orchard road."},
  {id:"depot-manhole",name:"Depot Service Manhole",x:54,y:59,sewerX:22,sewerY:76,unlock:"Help the Lost Delivery Driver below Fruitopia."},
  {id:"market-manhole",name:"Market Alley Manhole",x:73,y:44,sewerX:31,sewerY:76,unlock:"Find a Maintenance Key or discover the Underground Fruit Tunnels."},
  {id:"juice-manhole",name:"Juice Lab Drain",x:84,y:31,sewerX:39,sewerY:76,unlock:"Build the Sewer Greenhouse or investigate the Forgotten Fruit Laboratory."},
  {id:"mafia-alley-manhole",name:"Velvet Alley Manhole",x:64,y:38,sewerX:47,sewerY:76,unlock:"Earn a Fruit Mafia invitation and find the club symbol."}
];
export const SEWER_ENTRANCE_BY_ID=Object.fromEntries(SEWER_ENTRANCES.map(item=>[item.id,item]));

export const SEWER_SECTIONS=[
  {id:"drainage-entrance",name:"Drainage Entrance",x:3,y:67,w:45,h:19,color:"#65736b",description:"A safe landing of ladders, old signs, bottles, and the first brass valve."},
  {id:"green-water-channels",name:"Green-Water Channels",x:3,y:43,w:43,h:20,color:"#426f60",description:"Narrow bridges cross luminous water, broken pipes, and strange sewer plants."},
  {id:"sewer-test-lab",name:"Sewer Test Lab",x:4,y:5,w:39,h:32,color:"#536b72",description:"A ruined laboratory restored around one enthusiastic bubbling machine."},
  {id:"sewer-maze",name:"The Sewer Maze",x:48,y:29,w:48,h:55,color:"#4d5959",description:"Branching maintenance tunnels with landmarks, puzzles, gates, and shortcuts."},
  {id:"fruit-mafia-club",name:"Fruit Mafia Club",x:99,y:2,w:19,h:25,color:"#43364f",description:"A silly velvet-rope fruit club hidden behind the maze."}
];

// Center-line corridors. The renderer gives them thick stone walls and a dry inner path.
export const SEWER_PATHS=[
  [[8,76],[48,76]],[[14,76],[14,58]],[[14,58],[38,58]],[[28,58],[28,35]],[[28,35],[28,20]],
  [[28,20],[42,20]],[[42,20],[42,48]],[[42,48],[52,48]],[[52,48],[52,76]],[[52,76],[63,76]],
  [[52,48],[63,48]],[[63,48],[63,76]],[[63,48],[63,36]],[[63,36],[76,36]],[[76,36],[76,51]],
  [[76,51],[88,51]],[[88,51],[88,68]],[[88,68],[76,68]],[[76,68],[76,78]],[[76,78],[91,78]],
  [[63,60],[76,60]],[[63,60],[63,68]],[[63,68],[70,68]],[[70,68],[70,43]],[[70,43],[83,43]],
  [[83,43],[83,34]],[[83,34],[93,34]],[[93,34],[93,17]],[[93,17],[103,17]],[[103,17],[115,17]],
  [[103,17],[103,8]],[[103,8],[115,8]],[[115,8],[115,23]],[[115,23],[103,23]]
];

export const WATER_POINTS=[
  {id:"entrance-drip",name:"Entrance Drip",water:"murky-green-water",quality:"Murky Green Water",x:20,y:58,cooldown:35},
  {id:"glow-channel",name:"Glowing Channel Tap",water:"glowing-green-water",quality:"Glowing Green Water",x:38,y:50,cooldown:50},
  {id:"purifier-outlet",name:"Purifier Outlet",water:"filtered-sewer-water",quality:"Filtered Sewer Water",x:37,y:23,cooldown:55},
  {id:"warning-pipe",name:"Cartoon Warning Pipe",water:"radioactive-looking-fruit-water",quality:"Radioactive-Looking Fruit Water",x:58,y:44,cooldown:65},
  {id:"ancient-pipe",name:"Ancient Pipe Spring",water:"ancient-pipe-water",quality:"Ancient Pipe Water",x:84,y:68,cooldown:80},
  {id:"cosmic-seep",name:"Cosmic Green Seep",water:"cosmic-green-water",quality:"Cosmic Green Water",x:91,y:18,cooldown:100}
];
export const WATER_POINT_BY_ID=Object.fromEntries(WATER_POINTS.map(item=>[item.id,item]));

export const SEWER_CONTAINERS=[
  {id:"empty-bottle",name:"Empty Bottle",icon:"🍼",capacity:1},
  {id:"sample-jar",name:"Sample Jar",icon:"🫙",capacity:1},
  {id:"reinforced-flask",name:"Reinforced Flask",icon:"⚗️",capacity:1},
  {id:"laboratory-container",name:"Laboratory Container",icon:"🧪",capacity:1},
  {id:"large-sample-tank",name:"Large Sample Tank",icon:"🛢️",capacity:3}
];
export const SEWER_CONTAINER_BY_ID=Object.fromEntries(SEWER_CONTAINERS.map(item=>[item.id,item]));

export const SEWER_ITEMS=[
  ...SEWER_CONTAINERS,
  {id:"valve-key",name:"Valve Key",icon:"🗝️"},{id:"maintenance-key",name:"Maintenance Key",icon:"🔑"},
  {id:"chalk-marker",name:"Chalk Marker",icon:"🖍️"},{id:"maze-note",name:"Maze Note",icon:"📝"},
  {id:"emergency-return-token",name:"Emergency Return Token",icon:"🪙"},{id:"charged-sewer-sample",name:"Charged Sewer Sample",icon:"⚡"},
  {id:"mutant-seed",name:"Mutant Seed",icon:"🌱"},{id:"rare-seed",name:"Rare Seed",icon:"🌰"},
  {id:"strange-mushroom",name:"Strange Mushroom",icon:"🍄"},{id:"research-sample",name:"Research Sample",icon:"🔬"},
  {id:"glowing-apple",name:"Glowing Apple",icon:"🍏"},{id:"sewer-lemonade",name:"Sewer Lemonade",icon:"🥤"},
  {id:"slime-berry",name:"Slime Berry",icon:"🫐"},{id:"green-banana-fertilizer",name:"Green Banana Fertilizer",icon:"🧴"},
  {id:"glow-juice",name:"Glow Juice",icon:"🧃"},{id:"chilled-pipe-gel",name:"Chilled Pipe Gel",icon:"🧊"},
  {id:"funny-sludge",name:"Funny Fruit Sludge",icon:"🫠"},{id:"fruit-mafia-invitation",name:"Fruit Mafia Invitation",icon:"✉️"},
  {id:"club-membership-card",name:"Club Membership Card",icon:"🎴"},{id:"plinko-prize-ticket",name:"Plinko Prize Ticket",icon:"🎟️"}
];
export const SEWER_ITEM_BY_ID=Object.fromEntries(SEWER_ITEMS.map(item=>[item.id,item]));

export const SEWER_RECIPES=[
  {id:"glowing-apple",water:"any-green",ingredient:"apple",result:"glowing-apple",name:"Glowing Apple",effect:"Improves rare-fruit chance temporarily."},
  {id:"sewer-lemonade",water:"any-green",ingredient:"lemon",result:"sewer-lemonade",name:"Sewer Lemonade",effect:"A sellable product used by special requests."},
  {id:"slime-berry",water:"any-green",ingredient:"strawberry",result:"slime-berry",name:"Slime Berry",effect:"Unlocks a secret laboratory study."},
  {id:"green-banana-fertilizer",water:"any-green",ingredient:"banana",result:"green-banana-fertilizer",name:"Green Banana Fertilizer",effect:"Speeds every growing tree."},
  {id:"glow-juice",water:"filtered-sewer-water",ingredient:"blueberry",result:"glow-juice",name:"Glow Juice",effect:"Provides Research Points."},
  {id:"charged-sewer-sample",water:"glowing-green-water",ingredient:"electric-lime",result:"charged-sewer-sample",name:"Charged Sewer Sample",effect:"Powers a locked maze gate."},
  {id:"mutant-seed",water:"any-green",ingredient:"rare-seed",result:"mutant-seed",name:"Mutant Seed",effect:"Grows an odd but renewable sewer plant."},
  {id:"chilled-pipe-gel",water:"any-green",ingredient:"frozen-berries",result:"chilled-pipe-gel",name:"Chilled Pipe Gel",effect:"Supports cold-chain experiments."}
];

export const SEWER_VALVES=[
  {id:"entrance-valve",name:"First Brass Valve",x:24,y:74,order:0,effect:"Lowers the entrance channel and opens the first walkway."},
  {id:"red-valve",name:"Red Pipe Valve",x:62,y:48,order:1,effect:"Starts the maze pressure sequence."},
  {id:"blue-valve",name:"Blue Pipe Valve",x:70,y:43,order:2,effect:"Balances the east pipe pressure."},
  {id:"yellow-valve",name:"Yellow Valve",x:83,y:34,order:3,effect:"Completes the pressure sequence and opens the center gate."},
  {id:"waterfall-valve",name:"Waterfall Valve",x:88,y:68,order:0,effect:"Redirects water and reveals a treasure walkway."}
];
export const SEWER_GATES=[
  {id:"channel-gate",name:"Green Channel Gate",x:42,y:48,requires:"entrance-valve",hint:"Turn the First Brass Valve."},
  {id:"pressure-gate",name:"Pressure Puzzle Gate",x:76,y:51,requires:"pressure-sequence",hint:"Turn the Red, Blue, then Yellow valves."},
  {id:"charged-gate",name:"Charged Sample Grate",x:93,y:34,requires:"charged-sewer-sample",hint:"Insert a Charged Sewer Sample."},
  {id:"mafia-gate",name:"Fruit Mafia Secret Grate",x:98,y:17,requires:"fruit-mafia-invitation",hint:"Find the symbol and earn a Fruit Mafia invitation."}
];
export const SEWER_SHORTCUTS=[
  {id:"lab-drain",name:"Test Lab Drain Shortcut",x:42,y:35,requires:"maintenance-key"},
  {id:"maze-cart",name:"Maintenance Cart Shortcut",x:70,y:68,requires:"rivet-or-key"},
  {id:"club-pipe",name:"Velvet Pipe Shortcut",x:93,y:17,requires:"membership"}
];
export const SEWER_TREASURES=[
  {id:"mushroom-cache",name:"Glowing Mushroom Cache",x:39,y:48,reward:{item:"strange-mushroom",amount:2}},
  {id:"coin-nook",name:"Fruit Coin Nook",x:63,y:76,reward:{coins:4}},
  {id:"old-toolbox",name:"Old Maintenance Toolbox",x:76,y:78,reward:{item:"maintenance-key",amount:1}},
  {id:"ancient-crate",name:"Ancient Pipe Crate",x:88,y:68,reward:{research:8,item:"rare-seed",amount:1}},
  {id:"velvet-box",name:"Velvet-Rope Prize Box",x:91,y:18,reward:{chips:12,item:"plinko-prize-ticket",amount:1}}
];

export const SEWER_CHARACTERS=[
  {id:"maintenance-worker",name:"Mossy Max",role:"Maintenance Worker",icon:"🧑‍🔧",x:17,y:72,dialogue:"These valves are older than Mayor Marigold's favorite hat."},
  {id:"sewer-researcher",name:"Drip Drop Dahlia",role:"Sewer Researcher",icon:"👩‍🔬",x:31,y:18,dialogue:"Green water is scientifically weird—and weird is data."},
  {id:"lost-delivery-driver",name:"Denny Detour",role:"Lost Delivery Driver",icon:"🧑‍✈️",x:38,y:57,dialogue:"I followed a crate marked SHORTCUT. It was not a shortcut."},
  {id:"mushroom-grower",name:"Marnie Morel",role:"Mushroom Grower",icon:"🧑‍🌾",x:22,y:46,dialogue:"The mushrooms prefer compliments and low lighting."},
  {id:"fruit-mafia-bouncer",name:"Big Fig",role:"Fruit Mafia Bouncer",icon:"🕴️",x:98,y:17,dialogue:"Password? No? Cash and good manners also work."},
  {id:"fruit-mafia-dealer",name:"Cherry Chips",role:"Club Chip Host",icon:"🍒",x:108,y:12,dialogue:"These chips are pretend, the prizes are fruity, and the odds are posted."},
  {id:"prize-counter-worker",name:"Perry Prize",role:"Prize Counter Worker",icon:"🎁",x:112,y:21,dialogue:"Tickets, trinkets, and absolutely no real-money value."},
  {id:"mysterious-plumber",name:"P. Lumb",role:"Mysterious Plumber",icon:"🪠",x:62,y:62,dialogue:"Every pipe tells a story. Most of them say glub."},
  {id:"former-lab-scientist",name:"Professor Pulp",role:"Former Laboratory Scientist",icon:"🧑‍🔬",x:39,y:17,dialogue:"The failed mixtures were only failures at being boring."},
  {id:"maze-explorer",name:"Navi Nectar",role:"Maze Explorer",icon:"🧭",x:53,y:75,dialogue:"Study the entrance map. Inside, the colored pipes are your best friends."}
];

export const SEWER_QUESTS=[
  ["Open the First Manhole","Open the Sunny Side sewer entrance.",{cash:20,xp:20,item:"sample-jar"}],
  ["Collect Green Water","Collect one Green Sewer Water sample.",{research:3,xp:15}],
  ["Repair a Broken Valve","Turn the First Brass Valve.",{cash:30,chips:2}],
  ["Discover the Sewer Test Lab","Walk into the restored underground laboratory.",{research:5,xp:25}],
  ["Complete the First Experiment","Collect one Sewer Test Lab result.",{chips:4,xp:30}],
  ["Find the Maze Entrance","Reach the large entrance map.",{cash:35,xp:25}],
  ["Study the Entrance Map","Inspect the complete map at the maze entrance.",{item:"chalk-marker",xp:20}],
  ["Reach the Maze Center","Reach the Yellow Valve intersection.",{coins:2,xp:50}],
  ["Open a Shortcut","Open any persistent sewer shortcut.",{chips:4,xp:25}],
  ["Find a Fruit Mafia Symbol","Inspect the giant apple graffiti near the east grate.",{research:4,xp:30}],
  ["Earn a Fruit Mafia Invitation","Help a sewer character or discover it through an experiment.",{chips:6,xp:40}],
  ["Join the Fruit Mafia Club","Pay the permanent fictional $100 membership fee.",{chips:10,xp:60}],
  ["Play One Plinko Drop","Complete one fruit-ball drop.",{chips:3,xp:20}],
  ["Hit the Plinko Jackpot","Land in the wide center jackpot slot.",{coins:5,xp:100}],
  ["Discover Three Sewer Recipes","Record three recipes in the notebook.",{research:10,chips:5}],
  ["Help a Lost Worker","Talk to Denny Detour and recover his route.",{cash:50,xp:35}],
  ["Collect Rare Water","Collect Ancient Pipe Water or Cosmic Green Water.",{coins:3,research:6}]
].map(([name,description,reward])=>({id:name.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,""),name,description,reward}));

export const SEWER_SECRETS=["The First Fruit Mafia Member","The Green-Water Formula","The Lost Maintenance Room","The Jackpot Blueprint","The Pipe Orchard","The Maze Keeper"].map((name,index)=>({id:name.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,""),name,clueTarget:2+(index%2)}));

export const PLINKO_SLOTS=[
  {id:"small-left",label:"Small Prize",chips:1},{id:"medium-left",label:"Medium Prize",chips:3},
  {id:"large-left",label:"Large Prize",chips:5},{id:"jackpot",label:"JACKPOT",chips:10,jackpot:true},
  {id:"large-right",label:"Large Prize",chips:5},{id:"medium-right",label:"Medium Prize",chips:3},{id:"small-right",label:"Small Prize",chips:1}
];
export const PLINKO_COST=5;
export const PLINKO_DAILY_LIMIT=20;
export const SLOT_COST=4;
export const SLOT_DAILY_LIMIT=20;
export const SLOT_SYMBOLS=["🍎","🍋","🍌","🍓","🍉","🌟","🌈","🍇"];
export const FUTURE_MAFIA_GAME={id:"fruit-mafia-mystery-crate",name:"Fruit Mafia: The Mystery Crate",playable:true,locked:true,message:"Permanent club members may enter Don Durian's Mystery Crate room."};
