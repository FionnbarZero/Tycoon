export const SEWER_WORLD={width:240,height:180,worldWidth:2400,worldHeight:1800,unitScale:10,layoutId:"fruitopia-sewer-fixed-v3-hub"};

export const SEWER_LAYOUT_POINTS={
  westEntrance:{x:35,y:24},centralEntrance:{x:120,y:24},eastEntrance:{x:205,y:24},
  overviewMap:{x:116,y:23},mazeMap:{x:120,y:68},mazeStart:{x:120,y:78},
  greenWaterCave:{x:205,y:88},mafiaEntrance:{x:120,y:144},mafiaGameRoom:{x:70,y:164},machineRoom:{x:170,y:164}
};

export const SEWER_ENTRANCES=[
  {id:"sunny-manhole",name:"Manhole A · West Sewer Tunnel",x:105,y:476,sewerX:35,sewerY:24,zone:"front-drain-entrance",unlock:"Discover a sewer clue, speak with Bruno Bramble, or inspect the Hidden Office Basement."},
  {id:"market-manhole",name:"Manhole B · Central Sewer Hub",x:360,y:476,sewerX:120,sewerY:24,zone:"central-pump-station",unlock:"Open it from inside the Yellow Maintenance Quarter."},
  {id:"depot-manhole",name:"Manhole C · East Sewer Tunnel",x:600,y:476,sewerX:205,sewerY:24,zone:"surface-exit-network",unlock:"Repair the first pump from underground."},
  {id:"juice-manhole",name:"Research Ridge Drain Manhole",x:372,y:255,sewerX:35,sewerY:78,zone:"sewer-test-laboratory",unlock:"Complete the first safe Green-Water experiment."},
  {id:"mafia-alley-manhole",name:"Golden Grape Manhole",x:132,y:330,sewerX:70,sewerY:164,zone:"fruit-mafia-club",unlock:"Become a permanent Fruit Mafia Club member.",undergroundOnly:true}
];
export const SEWER_ENTRANCE_BY_ID=Object.fromEntries(SEWER_ENTRANCES.map(item=>[item.id,item]));

export const SEWER_SECTIONS=[
  ["front-drain-entrance","West Sewer Tunnel",35,24,50,28,"#68746d","#72e58b","💧","Slow dripping, road rumbles, and small green pools","Manhole A · Sample Pool · Maintenance Desk","Safe sample collection and first-tunnel tutorial","First bottles and a clear route east to the hub"],
  ["central-pump-station","Central Sewer Hub",120,24,50,30,"#4e6267","#77d6d1","⚙️","Rotating pumps, map-room hum, and checkpoint bell","Manhole B · Network Map · Four Great Pumps · Save Point","Restores routes, lights, and passive green water","Main junction for every underground branch"],
  ["green-water-canals","Green-Water Cave",205,88,46,40,"#356b59","#68f08c","🌊","Cave drips, bubbling green water, and pipe echoes","Glow Pool · Sample Shelf · Mixing Materials","Container-based renewable sample collection","Supplies laboratory experiments and maze puzzles"],
  ["sewer-test-laboratory","Sewer Test Laboratory",35,78,46,30,"#536c75","#89f7c8","🧪","Electrical hum, bubbling, and warning beeps","Mixing Chamber · Observation Window · Plant Chamber","Timed experiments and recipe discovery","Connects Fruit Labs, workers, and the research drain"],
  ["abandoned-maintenance-wing","Abandoned Maintenance Wing",75,78,30,28,"#6d655d","#f5ba63","🧰","Loose chains and rolling maintenance carts","Rusted Lockers · Equipment Cage · Collapsed Hall","Repair puzzle and navigation equipment","Opens the maze preparation room"],
  ["maze-entrance","Sewer Maze Entrance",120,68,30,20,"#5b625f","#efe0a0","🗺️","Quiet echoes and Bruno's warning radio","Hand-Drawn Map · Supply Table · Start Line","Entrance-only full map and emergency preparation","Only complete navigational overview"],
  ["red-pipe-quarter","Red Pipe Maze",82,105,34,28,"#6f403d","#ff736a","🔴","Steam bursts and hot pipe knocks","Triple Red Valve · Steam Clock · Broken Boiler","Pressure puzzle and turning bridge route","Red Emblem and Forgotten Lab shortcut"],
  ["blue-canal-quarter","Blue Canal Maze",164,105,36,28,"#36586f","#64c6ff","🔵","Drips, waterfalls, and hollow canal echoes","Blue Waterfall · Drain Gates · Turning Bridge","Three-stage water-level puzzle","Blue Emblem and Green-Water Cave shortcut"],
  ["yellow-maintenance-quarter","Yellow Gate Maze",105,89,30,20,"#736536","#ffe36e","🟡","Flickering current and generator clacks","Locked Gates · Fuse Wall · Sparking Junction","Parts and switchboard puzzle","Yellow Emblem, Test Lab power, and Manhole B"],
  ["green-root-quarter","Green Root Maze",140,126,34,22,"#3c6747","#74e47c","🟢","Root creaks, insects, and soft glowing tones","Giant Root Arch · Mushroom Circle · Living Bridge","Water testing and irrigation puzzle","Green Emblem and Underground Garden"],
  ["black-pipe-center","Black-Pipe Maze Center",125,108,24,22,"#2e3138","#e7bd57","⚫","Deep machinery and heartbeat-like pipes","Four-Color Door · Pressure Machine · Golden Grape","Insert four persistent emblems","Mafia Entrance, reward chest, and permanent shortcut"],
  ["forgotten-fruit-laboratory","Forgotten Fruit Laboratory",45,124,42,24,"#584f69","#cda2ff","👻","Old tanks, glass chimes, and faint signal static","Hybrid Vault · Ghost Tank · Cosmic Receiver","Recover lost formula and secret research","Hybrid clue, decoration, and Lyra conversation"],
  ["fruit-mafia-club","Mafia Game Room",70,164,52,24,"#493554","#e9c45d","🍇","Muffled club music, cards, crate mechanisms, and table chatter","Card Tables · Mystery Crate · Spectator Rail","Original event-driven Fruit Mafia survival game","Club reputation, card collection, and game rewards"],
  ["underground-fruit-garden","Underground Fruit Garden",205,130,42,22,"#426c50","#9cff95","🌱","Peaceful music, irrigation, and tiny insects","Mutant Plots · Pipe Orchard · Greenhouse Controls","Renewable sewer ingredient farming","Sewer recipes, rare plants, and worker requests"],
  ["surface-exit-network","East Sewer Tunnel",205,24,50,28,"#555e61","#e3a75c","🪜","Large pipeline rumbles and hidden-supply echoes","Manhole C · Large Pipelines · Supply Alcove","Persistent east-side exit and supply route","Direct access to the Green-Water Cave"],
  ["mafia-entrance","Mafia Entrance",120,144,28,16,"#29242c","#e8b640","🕴️","Quiet pipes, a guarded door, and a velvet-rope click","Guarded Doorway · $100 Membership Pad · Golden Grape","One-time fictional-Cash membership checkpoint","Opens both underground Mafia rooms permanently"],
  ["underground-machine-room","Underground Machine Room",170,164,52,24,"#302b37","#e8b640","🎰","Jackpot bells, fruit reels, gears, and prize-counter chatter","Jackpot Machine · Fruit Slots · Reward Counter · Hidden Storage","Fictional Club Chip machines and one-time prize collection","Club Chips, prizes, history, and secret storage"]
].map(([id,name,x,y,w,h,color,accent,icon,sound,landmarks,system,reward])=>({id,name,x,y,w,h,color,accent,icon,sound,landmarks:landmarks.split(" · "),system,reward,description:`${system}. ${reward}.`,maze:["red-pipe-quarter","blue-canal-quarter","yellow-maintenance-quarter","green-root-quarter","black-pipe-center"].includes(id)}));
export const SEWER_SECTION_BY_ID=Object.fromEntries(SEWER_SECTIONS.map(item=>[item.id,item]));

// Fixed hub-and-branch graph. The recognizable macro layout mirrors the three
// surface manholes while the detailed maze retains loops, quarters, and shortcuts.
export const SEWER_PATHS=[
  [[35,24],[70,24],[120,24],[160,24],[205,24]],
  [[35,24],[35,52],[35,78]],[[35,78],[58,78],[75,78],[98,72],[120,68]],
  [[120,24],[120,46],[120,68]],[[205,24],[205,55],[205,88]],
  [[120,68],[146,70],[175,80],[205,88]],
  [[120,78],[105,89],[82,105],[98,118],[125,108]],
  [[120,78],[140,84],[164,105],[146,118],[125,108]],
  [[105,89],[125,108],[140,126],[164,105],[105,89]],
  [[82,105],[64,112],[45,124]],[[164,105],[184,99],[205,88]],
  [[140,126],[170,128],[205,130]],[[125,108],[120,126],[120,144]],
  [[120,144],[96,151],[70,164]],[[120,144],[145,151],[170,164]],
  [[70,164],[105,164],[120,144],[145,164],[170,164]],
  [[45,124],[68,132],[92,128],[120,126]],[[205,88],[205,108],[205,130]]
];

export const SEWER_ROOMS=[
  ["west-tunnel-room",35,24,46,24],["central-hub-room",120,24,46,26],["east-tunnel-room",205,24,46,24],
  ["test-lab-room",35,78,42,26],["maintenance-room",75,78,26,24],["maze-prep-room",120,68,26,16],
  ["red-boiler-room",82,105,30,24],["blue-control-room",164,105,32,24],["yellow-generator-room",105,89,26,16],
  ["green-root-room",140,126,30,18],["center-room",125,108,20,18],["forgotten-lab-room",45,124,38,20],
  ["green-water-cave-room",205,88,42,36],["garden-room",205,130,38,18],["mafia-entry-room",120,144,24,12],
  ["mafia-game-room",70,164,48,20],["machine-room",170,164,48,20]
].map(([id,x,y,w,h])=>({id,x,y,w,h}));

export const SEWER_LANDMARKS=[
  ["sewer-overview-board","Underground Network Map","🗺️",116,23,"central-pump-station"],["four-pumps","Four Great Pumps","⚙️",128,29,"central-pump-station"],
  ["west-sample-pool","West Sample Pool","💧",27,28,"front-drain-entrance"],["east-supply-alcove","Hidden Supply Alcove","📦",216,28,"surface-exit-network"],
  ["glow-pool","Glowing Pool","💚",205,88,"green-water-canals"],["mixing-machine","Mixing Machine","🧪",40,78,"sewer-test-laboratory"],
  ["rusted-lockers","Rusted Lockers","🗄️",75,78,"abandoned-maintenance-wing"],["maze-board","Maze Entrance Board","📍",120,68,"maze-entrance"],
  ["triple-red-valve","Triple Red Valve","🔴",82,105,"red-pipe-quarter"],["steam-clock","Steam Clock","🕰️",74,101,"red-pipe-quarter"],
  ["blue-waterfall","Blue Waterfall","🌊",164,105,"blue-canal-quarter"],["maintenance-boat","Turning Bridge","🌉",170,111,"blue-canal-quarter"],
  ["broken-generator","Broken Generator","⚡",105,89,"yellow-maintenance-quarter"],["yellow-fuse-wall","Yellow Fuse Wall","🔌",112,92,"yellow-maintenance-quarter"],
  ["giant-root-arch","Giant Root Arch","🌿",140,126,"green-root-quarter"],["mushroom-circle","Glowing Mushroom Circle","🍄",148,130,"green-root-quarter"],
  ["four-color-door","Four-Color Valve Door","🚪",125,108,"black-pipe-center"],["golden-grape","Golden Grape Symbol","🍇",129,112,"black-pipe-center"],
  ["ghost-tank","Ghost Fruit Tank","👻",45,124,"forgotten-fruit-laboratory"],["pipe-orchard","Pipe Orchard","🌳",205,130,"underground-fruit-garden"],
  ["velvet-desk","Guarded Velvet Door","🎩",120,144,"mafia-entrance"],["mystery-crate-table","Mystery Crate Table","📦",70,164,"fruit-mafia-club"],
  ["jackpot-pipe","Jackpot Machine","🎰",164,164,"underground-machine-room"],["hidden-prize-storage","Hidden Prize Storage","🎁",180,168,"underground-machine-room"]
].map(([id,name,icon,x,y,section])=>({id,name,icon,x,y,section}));

export const SEWER_CONTAINERS=[
  {id:"empty-bottle",name:"Empty Bottle",icon:"🍼",capacity:1,rank:1},{id:"sample-jar",name:"Sample Jar",icon:"🫙",capacity:1,rank:2},
  {id:"reinforced-flask",name:"Reinforced Flask",icon:"⚗️",capacity:1,rank:3},{id:"laboratory-container",name:"Laboratory Container",icon:"🧪",capacity:1,rank:4},
  {id:"large-sample-tank",name:"Large Sample Tank",icon:"🛢️",capacity:3,rank:5}
];
export const SEWER_CONTAINER_BY_ID=Object.fromEntries(SEWER_CONTAINERS.map(item=>[item.id,item]));
export const WATER_POINTS=[
  {id:"entrance-drip",name:"West Tunnel Sample Pool",water:"murky-green-water",quality:"Murky Green Water",x:27,y:28,cooldown:35,requiredContainer:"empty-bottle",available:1,depth:"shallow"},
  {id:"shallow-canal",name:"Green-Water Cave Shelf",water:"murky-green-water",quality:"Murky Green Water",x:196,y:84,cooldown:45,requiredContainer:"empty-bottle",available:2,depth:"shallow"},
  {id:"pump-reservoir",name:"Central Hub Pump Reservoir",water:"filtered-sewer-water",quality:"Filtered Green Water",x:134,y:31,cooldown:60,requiredContainer:"sample-jar",available:2,depth:"shallow",requires:"pumps-full"},
  {id:"glow-channel",name:"Green-Water Cave Glow Pool",water:"glowing-green-water",quality:"Glowing Green Water",x:211,y:91,cooldown:70,requiredContainer:"reinforced-flask",available:1,depth:"deep"},
  {id:"purifier-outlet",name:"Laboratory Purifier",water:"filtered-sewer-water",quality:"Filtered Green Water",x:43,y:80,cooldown:55,requiredContainer:"sample-jar",available:2,depth:"shallow",requires:"lab-electricity"},
  {id:"warning-pipe",name:"Red Maze Warning Pipe",water:"radioactive-looking-fruit-water",quality:"Radioactive-Looking Fruit Water",x:79,y:110,cooldown:80,requiredContainer:"reinforced-flask",available:1,depth:"shallow"},
  {id:"blue-vault-pool",name:"Blue Maze Vault Pool",water:"glowing-green-water",quality:"Glowing Green Water",x:170,y:108,cooldown:90,requiredContainer:"reinforced-flask",available:1,depth:"deep",requires:"blue-water-emblem"},
  {id:"ancient-pipe",name:"Ancient Root Pipe Spring",water:"ancient-pipe-water",quality:"Ancient Pipe Water",x:144,y:128,cooldown:110,requiredContainer:"laboratory-container",available:1,depth:"deep"},
  {id:"cosmic-seep",name:"Garden Cosmic Drain",water:"cosmic-green-water",quality:"Cosmic Green Water",x:211,y:132,cooldown:180,requiredContainer:"large-sample-tank",available:1,depth:"deep",requires:"cosmic-age"}
];
export const WATER_POINT_BY_ID=Object.fromEntries(WATER_POINTS.map(item=>[item.id,item]));

export const SEWER_ITEMS=[...SEWER_CONTAINERS,
  {id:"valve-key",name:"Valve Key",icon:"🗝️"},{id:"valve-wrench",name:"Valve Wrench",icon:"🔧"},{id:"maintenance-key",name:"Maintenance Key",icon:"🔑"},
  {id:"chalk-marker",name:"Chalk Marker",icon:"🖍️"},{id:"permanent-marker-kit",name:"Permanent Marker Kit",icon:"✏️"},{id:"maze-note",name:"Maze Note",icon:"📝"},
  {id:"emergency-return-token",name:"Emergency Return Token",icon:"🪙"},{id:"yellow-fuse",name:"Yellow Fuse",icon:"🟨"},{id:"copper-wire",name:"Copper Wire",icon:"🧵"},
  {id:"generator-gear",name:"Generator Gear",icon:"⚙️"},{id:"replacement-pump-fuse",name:"Replacement Pump Fuse",icon:"🔋"},
  {id:"red-pressure-emblem",name:"Red Pressure Emblem",icon:"🔴"},{id:"blue-water-emblem",name:"Blue Water Emblem",icon:"🔵"},
  {id:"yellow-power-emblem",name:"Yellow Power Emblem",icon:"🟡"},{id:"green-root-emblem",name:"Green Root Emblem",icon:"🟢"},
  {id:"charged-sewer-sample",name:"Charged Sewer Sample",icon:"⚡"},{id:"mutant-seed",name:"Mutant Seed",icon:"🌱"},{id:"rare-seed",name:"Rare Seed",icon:"🌰"},
  {id:"strange-mushroom",name:"Strange Mushroom",icon:"🍄"},{id:"research-sample",name:"Research Sample",icon:"🔬"},{id:"glowing-apple",name:"Glowing Apple",icon:"🍏"},
  {id:"sewer-lemonade",name:"Sewer Lemonade",icon:"🥤"},{id:"slime-berry",name:"Slime Berry",icon:"🫐"},{id:"green-banana-fertilizer",name:"Green Banana Fertilizer",icon:"🧴"},
  {id:"glow-juice",name:"Glow Juice",icon:"🧃"},{id:"chilled-pipe-gel",name:"Chilled Pipe Gel",icon:"🧊"},{id:"funny-sludge",name:"Funny Fruit Sludge",icon:"🫠"},
  {id:"forgotten-formula",name:"Forgotten Fruit Formula",icon:"📜"},{id:"ghost-fruit-clue",name:"Ghost Fruit Clue",icon:"👻"},
  {id:"fruit-mafia-invitation",name:"Fruit Mafia Invitation",icon:"✉️"},{id:"club-membership-card",name:"Club Membership Card",icon:"🎴"},{id:"plinko-prize-ticket",name:"Plinko Prize Ticket",icon:"🎟️"}
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

export const SEWER_PUMPS=["red","blue","yellow","green"].map((color,index)=>({id:`${color}-pump`,name:`${color[0].toUpperCase()+color.slice(1)} ${index===0?"Pressure":index===1?"Water":index===2?"Power":"Root Filter"} Pump`,x:108+index*8,y:30,part:index===0?null:["copper-wire","generator-gear","replacement-pump-fuse"][index-1]}));
export const SEWER_VALVES=[
  {id:"entrance-valve",name:"West Tunnel Brass Valve",x:70,y:24,order:0,effect:"Opens the safe route from Manhole A to the Central Sewer Hub."},
  {id:"red-valve",name:"Red Hub Valve",x:110,y:33,order:1,effect:"Starts the central hub pressure sequence."},
  {id:"blue-valve",name:"Blue Hub Valve",x:120,y:33,order:2,effect:"Balances the hub water pressure."},
  {id:"yellow-valve",name:"Yellow Hub Valve",x:130,y:33,order:3,effect:"Completes the hub pressure sequence."},
  {id:"waterfall-valve",name:"Green-Water Cave Valve",x:205,y:78,order:0,effect:"Redirects cave water and reveals the blue-vault walkway."}
];
export const SEWER_GATES=[
  {id:"channel-gate",name:"West-to-Hub Gate",x:78,y:24,requires:"entrance-valve",hint:"Turn the West Tunnel Brass Valve."},
  {id:"pressure-gate",name:"Sewer Maze Gate",x:120,y:78,requires:"pump-and-repair",hint:"Restore all four pumps and repair the collapsed Maintenance Wing route."},
  {id:"charged-gate",name:"Charged Inner Grate",x:116,y:101,requires:"charged-sewer-sample",hint:"Insert a Charged Sewer Sample."},
  {id:"center-door",name:"Four-Color Valve Door",x:125,y:108,requires:"four-emblems",hint:"Collect and insert all four quarter emblems."},
  {id:"forgotten-lab-door",name:"Forgotten Laboratory Door",x:64,y:118,requires:"center-open",hint:"Activate Black-Pipe Center."},
  {id:"mafia-gate",name:"Fruit Mafia Guarded Door",x:120,y:138,requires:"center-open",hint:"Open Black-Pipe Center and inspect the Golden Grape symbol."}
];
export const SEWER_SHORTCUTS=[
  {id:"lab-drain",name:"Test Lab Drain Shortcut",x:56,y:78,requires:"maintenance-key"},{id:"maze-cart",name:"Maintenance Cart Shortcut",x:85,y:76,requires:"rivet-or-key"},
  {id:"blue-pump",name:"Blue Maze Cave Shortcut",x:183,y:96,requires:"blue-water-emblem"},{id:"red-lab",name:"Red Maze Lab Shortcut",x:64,y:118,requires:"red-pressure-emblem"},
  {id:"center-ring",name:"Black-Pipe Center Shortcut",x:136,y:108,requires:"center-open"},{id:"garden-root",name:"Living Root Shortcut",x:181,y:128,requires:"green-root-emblem"},
  {id:"club-pipe",name:"Velvet Pipe Shortcut",x:120,y:150,requires:"membership"}
];
export const SEWER_TREASURES=[
  {id:"entrance-bottles",name:"West Tunnel Bottle Shelf",x:26,y:20,reward:{item:"empty-bottle",amount:2}},
  {id:"mushroom-cache",name:"Green-Water Cave Mushroom Cache",x:196,y:96,reward:{item:"strange-mushroom",amount:2}},
  {id:"coin-nook",name:"Red Maze Fruit Coin Nook",x:75,y:110,reward:{coins:4}},{id:"old-toolbox",name:"Old Maintenance Toolbox",x:73,y:82,reward:{item:"maintenance-key",amount:1}},
  {id:"marker-locker",name:"Maze Navigation Locker",x:114,y:70,reward:{item:"chalk-marker",amount:4}},{id:"red-boiler-vault",name:"Boiler Vault",x:86,y:111,reward:{research:8,item:"replacement-pump-fuse",amount:1}},
  {id:"blue-drain-cache",name:"Flooded Drain Cache",x:171,y:111,reward:{coins:3,item:"copper-wire",amount:1}},
  {id:"yellow-parts-bin",name:"Generator Parts Bin",x:112,y:92,reward:{item:"generator-gear",amount:1}},
  {id:"green-seed-nest",name:"Root-Wrapped Seed Nest",x:147,y:129,reward:{item:"rare-seed",amount:1}},
  {id:"ancient-crate",name:"Ancient Pipe Crate",x:136,y:129,reward:{research:8,item:"rare-seed",amount:1}},
  {id:"center-chest",name:"Black-Pipe Reward Chest",x:128,y:111,reward:{cash:150,coins:8,research:15,chips:12}},
  {id:"forgotten-vault",name:"Forgotten Research Vault",x:48,y:126,reward:{research:20,item:"forgotten-formula",amount:1}},
  {id:"garden-cache",name:"Pipe Orchard Basket",x:208,y:132,reward:{item:"mutant-seed",amount:2}},
  {id:"velvet-box",name:"Hidden Machine-Room Prize Box",x:182,y:168,reward:{chips:12,item:"plinko-prize-ticket",amount:1}}
];
export const SEWER_CHECKPOINTS=[{id:"front-bell",name:"West Tunnel Emergency Bell",x:25,y:24,section:"front-drain-entrance"},{id:"pump-bell",name:"Central Hub Save Bell",x:120,y:20,section:"central-pump-station"},{id:"maze-bell",name:"Maze Entrance Bell",x:120,y:68,section:"maze-entrance"},{id:"center-bell",name:"Center Maintenance Bell",x:125,y:108,section:"black-pipe-center"}];
export const SEWER_QUARTERS={
  red:{id:"red",name:"Red Pressure Quarter",emblem:"red-pressure-emblem",solution:[2,1,3],landmarks:["Triple Red Valve","Steam Clock","Melted Apple Sign","Broken Boiler","Red Pipe Bridge"]},
  blue:{id:"blue",name:"Blue Canal Quarter",emblem:"blue-water-emblem",solution:["high","middle","low"],landmarks:["Blue Waterfall","Three Drain Gates","Maintenance Boat","Blueberry Mosaic","Flood-Control Wheel"]},
  yellow:{id:"yellow",name:"Yellow Maintenance Quarter",emblem:"yellow-power-emblem",parts:["yellow-fuse","copper-wire","generator-gear"],landmarks:["Broken Generator","Yellow Fuse Wall","Maintenance Elevator","Lemon Warning Sign","Sparking Junction"]},
  green:{id:"green",name:"Green Root Quarter",emblem:"green-root-emblem",samples:["murky-green-water","filtered-sewer-water","glowing-green-water"],safe:"filtered-sewer-water",landmarks:["Giant Root Arch","Sewer Greenhouse","Glowing Mushroom Circle","Ancient Irrigation Wheel","Green Fruit Statue"]}
};
export const CHALK_SYMBOLS=["left","right","dead-end","important","treasure","exit","water","mafia"];

export const SEWER_CHARACTERS=[
  ["maintenance-worker","Mossy Max","Maintenance Worker","🧑‍🔧",112,32,"These hub pumps are older than Mayor Marigold's favorite hat."],
  ["sewer-researcher","Drip Drop Dahlia","Sewer Researcher","👩‍🔬",31,82,"Green water is scientifically weird—and weird is data."],
  ["lost-delivery-driver","Denny Detour","Lost Delivery Driver","🧑‍✈️",75,82,"I followed a crate marked SHORTCUT. It was not a shortcut."],
  ["mushroom-grower","Marnie Morel","Mushroom Grower","🧑‍🌾",201,132,"The mushrooms prefer compliments and low lighting."],
  ["fruit-mafia-bouncer","Big Fig","Fruit Mafia Bouncer","🕴️",120,144,"Password? No? Cash and good manners also work."],
  ["fruit-mafia-dealer","Cherry Chips","Club Chip Host","🍒",68,166,"The Mystery Crate uses strategy and luck—not real money."],
  ["prize-counter-worker","Perry Prize","Prize Counter Worker","🎁",178,166,"Tickets, trinkets, and absolutely no real-money value."],
  ["mysterious-plumber","P. Lumb","Mysterious Plumber","🪠",127,103,"Every pipe tells a story. Most of them say glub."],
  ["former-lab-scientist","Professor Pulp","Former Laboratory Scientist","🧑‍🔬",45,126,"The failed mixtures were only failures at being boring."],
  ["maze-explorer","Navi Nectar","Maze Explorer","🧭",116,70,"Study the entrance map. Inside, colored pipes and landmarks are your friends."]
].map(([id,name,role,icon,x,y,dialogue])=>({id,name,role,icon,x,y,dialogue}));

export const SEWER_QUESTS=[
  ["Open the First Manhole","Open the Fruit Stand Road sewer entrance.",{cash:20,xp:20,item:"sample-jar"}],
  ["Collect Green Water","Collect one Green Sewer Water sample.",{research:3,xp:15}],
  ["Repair a Broken Valve","Turn the Tutorial Brass Valve.",{cash:30,chips:2}],
  ["Repair the Pump Station","Restore all four great pumps.",{cash:80,research:8,xp:50}],
  ["Discover the Sewer Test Lab","Walk into the underground laboratory.",{research:5,xp:25}],
  ["Restore the Sewer Test Lab","Restore power, fuse, machine, and safe test.",{research:12,xp:60}],
  ["Complete the First Experiment","Collect one Sewer Test Lab result.",{chips:4,xp:30}],
  ["Find the Maze Entrance","Reach the large entrance map.",{cash:35,xp:25}],
  ["Study the Entrance Map","Inspect the complete map at the maze entrance.",{item:"chalk-marker",xp:20}],
  ["Collect Four Emblems","Solve every colored maze quarter.",{coins:6,xp:100}],
  ["Reach the Maze Center","Open the Four-Color Valve Door.",{coins:4,xp:75}],
  ["Open a Shortcut","Open any persistent sewer shortcut.",{chips:4,xp:25}],
  ["Find a Fruit Mafia Symbol","Inspect the Golden Grape symbol.",{research:4,xp:30}],
  ["Earn a Fruit Mafia Invitation","Help a sewer character or discover it through an experiment.",{chips:6,xp:40}],
  ["Join the Fruit Mafia Club","Pay the permanent fictional $100 membership fee.",{chips:10,xp:60}],
  ["Discover the Forgotten Lab","Open the old hybrid-research vault.",{research:15,xp:75}],
  ["Restore the Underground Garden","Restart its irrigation and first growing plot.",{item:"mutant-seed",xp:60}],
  ["Play One Plinko Drop","Complete one fruit-ball drop.",{chips:3,xp:20}],
  ["Hit the Plinko Jackpot","Land in the wide center jackpot slot.",{coins:5,xp:100}],
  ["Discover Three Sewer Recipes","Record three recipes in the notebook.",{research:10,chips:5}],
  ["Help a Lost Worker","Talk to Denny Detour and recover his route.",{cash:50,xp:35}],
  ["Collect Rare Water","Collect Ancient Pipe Water or Cosmic Green Water.",{coins:3,research:6}]
].map(([name,description,reward])=>({id:name.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,""),name,description,reward}));

export const SEWER_SECRETS=["The First Fruit Mafia Member","The Green-Water Formula","The Lost Maintenance Room","The Jackpot Blueprint","The Pipe Orchard","The Maze Keeper"].map((name,index)=>({id:name.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,""),name,clueTarget:2+(index%2)}));
export const PLINKO_SLOTS=[{id:"small-left",label:"Small Prize",chips:1},{id:"medium-left",label:"Medium Prize",chips:3},{id:"large-left",label:"Large Prize",chips:5},{id:"jackpot",label:"JACKPOT",chips:10,jackpot:true},{id:"large-right",label:"Large Prize",chips:5},{id:"medium-right",label:"Medium Prize",chips:3},{id:"small-right",label:"Small Prize",chips:1}];
export const PLINKO_COST=5,PLINKO_DAILY_LIMIT=20,SLOT_COST=4,SLOT_DAILY_LIMIT=20;
export const SLOT_SYMBOLS=["🍎","🍋","🍌","🍓","🍉","🌟","🌈","🍇"];
export const FUTURE_MAFIA_GAME={id:"fruit-mafia-mystery-crate",name:"Fruit Mafia: The Mystery Crate",playable:true,locked:true,message:"Permanent club members may enter Don Durian's Mystery Crate room."};
