export const SEWER_WORLD={width:240,height:180,worldWidth:2400,worldHeight:1800,unitScale:10,layoutId:"fruitopia-sewer-fixed-v4-north-annex"};

export const SEWER_LAYOUT_POINTS={
  westEntrance:{x:35,y:20},centralEntrance:{x:120,y:20},eastEntrance:{x:205,y:20},overviewMap:{x:116,y:19},
  mafiaEntrance:{x:45,y:52},northPipeMaze:{x:120,y:52},greenWaterCave:{x:205,y:52},
  cardRoom:{x:45,y:84},deadEndD1:{x:120,y:84},labLift:{x:205,y:84},
  mazeMap:{x:120,y:105},mazeStart:{x:120,y:113},testLab:{x:205,y:115},maintenance:{x:165,y:112},
  machineRoom:{x:45,y:118},mafiaGameRoom:{x:45,y:84}
};

export const SEWER_ENTRANCES=[
  {id:"sunny-manhole",name:"Manhole A · West Sewer Tunnel",x:105,y:476,sewerX:35,sewerY:20,zone:"front-drain-entrance",unlock:"Discover a sewer clue, speak with Bruno Bramble, or inspect the Hidden Office Basement."},
  {id:"market-manhole",name:"Manhole B · Central Sewer Hub",x:360,y:476,sewerX:120,sewerY:20,zone:"central-pump-station",unlock:"Open it from inside the Yellow Maintenance Quarter."},
  {id:"depot-manhole",name:"Manhole C · East Sewer Tunnel",x:600,y:476,sewerX:205,sewerY:20,zone:"surface-exit-network",unlock:"Repair the first pump from underground."},
  {id:"juice-manhole",name:"Research Ridge Drain Manhole",x:372,y:255,sewerX:205,sewerY:115,zone:"sewer-test-laboratory",unlock:"Complete the first safe Green-Water experiment."},
  {id:"mafia-alley-manhole",name:"Golden Grape Manhole",x:132,y:330,sewerX:45,sewerY:84,zone:"fruit-mafia-club",unlock:"Become a permanent Fruit Mafia Club member.",undergroundOnly:true}
];
export const SEWER_ENTRANCE_BY_ID=Object.fromEntries(SEWER_ENTRANCES.map(item=>[item.id,item]));

export const SEWER_SECTIONS=[
  ["front-drain-entrance","West Sewer Tunnel",35,20,50,24,"#68746d","#72e58b","💧","Slow dripping, road rumbles, and small green pools","Manhole A · Sample Pool · Maintenance Desk","Safe sample collection and first-tunnel tutorial","First bottles and a clear route east to the hub"],
  ["central-pump-station","Central Sewer Hub",120,20,50,24,"#4e6267","#77d6d1","⚙️","Rotating pumps, map-room hum, and checkpoint bell","Manhole B · Network Map · Four Great Pumps · Save Point","Restores routes, lights, and passive green water","Main junction for every underground branch"],
  ["surface-exit-network","East Sewer Tunnel",205,20,50,24,"#555e61","#e3a75c","🪜","Large pipeline rumbles and hidden-supply echoes","Manhole C · Large Pipelines · Supply Alcove","Persistent east-side exit and supply route","Direct access to the North Annex"],
  ["mafia-entrance","Mafia Entrance",45,52,46,24,"#29242c","#e8b640","🕴️","Quiet pipes, a guarded door, and a velvet-rope click","Guarded Doorway · $100 Membership Pad · Golden Grape","One-time fictional-Cash membership checkpoint","Opens the Card Room and underground machines permanently"],
  ["north-pipe-maze","North Pipe Maze",120,52,46,24,"#414a4d","#d6e2cf","🧭","Pipe knocks, distant water, and hollow northern echoes","North Plan Board · Three-Way Junction · D1 Marker","Recognizable northern junction connecting the annex","Routes toward the Card Room, cave, D1, and deeper maze"],
  ["green-water-canals","Green-Water Cave",205,52,46,24,"#356b59","#68f08c","🌊","Cave drips, bubbling green water, and pipe echoes","Glow Pool · Sample Shelf · Mixing Materials","Container-based renewable sample collection","Supplies laboratory experiments and maze puzzles"],
  ["fruit-mafia-club","Mafia Card Room",45,84,46,24,"#493554","#e9c45d","🃏","Muffled club music, cards, crate mechanisms, and table chatter","Card Tables · Mystery Crate · Spectator Rail","Original event-driven Fruit Mafia survival game","Club reputation, card collection, and game rewards"],
  ["north-dead-end-d1","D1 Dead End",120,84,34,18,"#555d5a","#ff9f43","D1","A dry echo and the rattle of a hidden supply box","D1 Wall Mark · Dead-End Cache · Chalk Turnaround","Optional navigation landmark and one-time cache","Rewards careful exploration without hiding progression"],
  ["lab-lift","Lab Lift",205,84,28,18,"#315c66","#54d9e8","↕","Lift cables, relays, and a laboratory arrival bell","Lift Platform · Power Relay · LAB Sign","Persistent shortcut between the cave and Test Lab","Fast access to Green-Water experiments"],
  ["sewer-test-laboratory","Sewer Test Laboratory",205,115,38,24,"#536c75","#89f7c8","🧪","Electrical hum, bubbling, and warning beeps","Mixing Chamber · Observation Window · Plant Chamber","Timed experiments and recipe discovery","Connects Fruit Labs, workers, and the Research Ridge drain"],
  ["abandoned-maintenance-wing","Abandoned Maintenance Wing",165,112,26,22,"#6d655d","#f5ba63","🧰","Loose chains and rolling maintenance carts","Rusted Lockers · Equipment Cage · Collapsed Hall","Repair puzzle and navigation equipment","Opens the deeper maze preparation room"],
  ["maze-entrance","Sewer Maze Entrance",120,105,28,16,"#5b625f","#efe0a0","🗺️","Quiet echoes and Bruno's warning radio","Hand-Drawn Map · Supply Table · Start Line","Entrance-only full map and emergency preparation","Only complete navigational overview"],
  ["yellow-maintenance-quarter","Yellow Gate Maze",110,122,26,16,"#736536","#ffe36e","🟡","Flickering current and generator clacks","Locked Gates · Fuse Wall · Sparking Junction","Parts and switchboard puzzle","Yellow Emblem, Test Lab power, and Manhole B"],
  ["red-pipe-quarter","Red Pipe Maze",75,140,34,22,"#6f403d","#ff736a","🔴","Steam bursts and hot pipe knocks","Triple Red Valve · Steam Clock · Broken Boiler","Pressure puzzle and turning bridge route","Red Emblem and Forgotten Lab shortcut"],
  ["blue-canal-quarter","Blue Canal Maze",170,140,36,22,"#36586f","#64c6ff","🔵","Drips, waterfalls, and hollow canal echoes","Blue Waterfall · Drain Gates · Turning Bridge","Three-stage water-level puzzle","Blue Emblem and Green-Water Cave shortcut"],
  ["black-pipe-center","Black-Pipe Maze Center",125,143,24,20,"#2e3138","#e7bd57","⚫","Deep machinery and heartbeat-like pipes","Four-Color Door · Pressure Machine · Golden Grape","Insert four persistent emblems","Mafia access, reward chest, and permanent shortcut"],
  ["green-root-quarter","Green Root Maze",140,162,34,16,"#3c6747","#74e47c","🟢","Root creaks, insects, and soft glowing tones","Giant Root Arch · Mushroom Circle · Living Bridge","Water testing and irrigation puzzle","Green Emblem and Underground Garden"],
  ["forgotten-fruit-laboratory","Forgotten Fruit Laboratory",45,162,42,16,"#584f69","#cda2ff","👻","Old tanks, glass chimes, and faint signal static","Hybrid Vault · Ghost Tank · Cosmic Receiver","Recover lost formula and secret research","Hybrid clue, decoration, and Lyra conversation"],
  ["underground-fruit-garden","Underground Fruit Garden",205,162,42,16,"#426c50","#9cff95","🌱","Peaceful music, irrigation, and tiny insects","Mutant Plots · Pipe Orchard · Greenhouse Controls","Renewable sewer ingredient farming","Sewer recipes, rare plants, and worker requests"],
  ["underground-machine-room","Underground Machine Room",45,118,46,18,"#302b37","#e8b640","🎰","Jackpot bells, fruit reels, gears, and prize-counter chatter","Jackpot Machine · Fruit Slots · Reward Counter · Hidden Storage","Fictional Club Chip machines and one-time prize collection","Club Chips, prizes, history, and secret storage"]
].map(([id,name,x,y,w,h,color,accent,icon,sound,landmarks,system,reward])=>({id,name,x,y,w,h,color,accent,icon,sound,landmarks:landmarks.split(" · "),system,reward,description:`${system}. ${reward}.`,maze:["red-pipe-quarter","blue-canal-quarter","yellow-maintenance-quarter","green-root-quarter","black-pipe-center"].includes(id)}));
export const SEWER_SECTION_BY_ID=Object.fromEntries(SEWER_SECTIONS.map(item=>[item.id,item]));

// Fixed hub-and-branch graph. The recognizable macro layout mirrors the three
// surface manholes while the detailed maze retains loops, quarters, and shortcuts.
export const SEWER_PATHS=[
  [[35,20],[75,20],[120,20],[165,20],[205,20]],
  [[35,20],[35,36],[45,52]],[[120,20],[120,36],[120,52]],[[205,20],[205,36],[205,52]],
  [[45,52],[80,52],[120,52],[165,52],[205,52]],
  [[45,52],[45,68],[45,84]],[[120,52],[120,68],[120,84],[120,105]],[[205,52],[205,68],[205,84],[205,115]],
  [[45,84],[45,101],[45,118]],[[205,115],[185,112],[165,112],[142,108],[120,105]],
  [[120,113],[110,122],[75,140],[100,145],[125,143]],
  [[120,113],[145,123],[170,140],[148,149],[125,143]],
  [[110,122],[125,143],[140,162],[170,140],[110,122]],
  [[75,140],[58,151],[45,162]],[[170,140],[188,151],[205,162]],[[140,162],[170,162],[205,162]],
  [[125,143],[104,124],[92,101],[70,74],[45,52]],[[45,118],[72,126],[100,136],[125,143]]
];

export const SEWER_ROOMS=[
  ["west-tunnel-room",35,20,46,20],["central-hub-room",120,20,46,20],["east-tunnel-room",205,20,46,20],
  ["mafia-entry-room",45,52,42,20],["north-pipe-room",120,52,42,20],["green-water-cave-room",205,52,42,20],
  ["card-room",45,84,42,20],["dead-end-d1-room",120,84,30,14],["lab-lift-room",205,84,24,14],
  ["machine-room",45,118,42,14],["maze-prep-room",120,105,24,12],["maintenance-room",165,112,22,18],["test-lab-room",205,115,34,20],
  ["yellow-generator-room",110,122,22,12],["red-boiler-room",75,140,30,18],["blue-control-room",170,140,32,18],
  ["center-room",125,143,20,16],["green-root-room",140,162,30,12],["forgotten-lab-room",45,162,38,12],["garden-room",205,162,38,12]
].map(([id,x,y,w,h])=>({id,x,y,w,h}));

export const SEWER_LANDMARKS=[
  ["sewer-overview-board","Underground Network Map","🗺️",116,19,"central-pump-station"],["four-pumps","Four Great Pumps","⚙️",128,26,"central-pump-station"],
  ["west-sample-pool","West Sample Pool","💧",27,24,"front-drain-entrance"],["east-supply-alcove","Hidden Supply Alcove","📦",216,24,"surface-exit-network"],
  ["velvet-desk","Guarded Velvet Door","🎩",45,52,"mafia-entrance"],["north-layout-board","North Annex Plan","🧭",120,52,"north-pipe-maze"],["glow-pool","Glowing Pool","💚",205,52,"green-water-canals"],
  ["mystery-crate-table","Mystery Crate Table","📦",45,84,"fruit-mafia-club"],["d1-wall-mark","D1 Dead End Marker","D1",120,84,"north-dead-end-d1"],
  ["mixing-machine","Mixing Machine","🧪",205,115,"sewer-test-laboratory"],["rusted-lockers","Rusted Lockers","🗄️",165,112,"abandoned-maintenance-wing"],["maze-board","Maze Entrance Board","📍",120,105,"maze-entrance"],
  ["triple-red-valve","Triple Red Valve","🔴",75,140,"red-pipe-quarter"],["steam-clock","Steam Clock","🕰️",68,136,"red-pipe-quarter"],
  ["blue-waterfall","Blue Waterfall","🌊",170,140,"blue-canal-quarter"],["maintenance-boat","Turning Bridge","🌉",176,145,"blue-canal-quarter"],
  ["broken-generator","Broken Generator","⚡",110,122,"yellow-maintenance-quarter"],["yellow-fuse-wall","Yellow Fuse Wall","🔌",116,125,"yellow-maintenance-quarter"],
  ["giant-root-arch","Giant Root Arch","🌿",140,162,"green-root-quarter"],["mushroom-circle","Glowing Mushroom Circle","🍄",148,165,"green-root-quarter"],
  ["four-color-door","Four-Color Valve Door","🚪",125,143,"black-pipe-center"],["golden-grape","Golden Grape Symbol","🍇",129,146,"black-pipe-center"],
  ["ghost-tank","Ghost Fruit Tank","👻",45,162,"forgotten-fruit-laboratory"],["pipe-orchard","Pipe Orchard","🌳",205,162,"underground-fruit-garden"],
  ["jackpot-pipe","Jackpot Machine","🎰",39,118,"underground-machine-room"],["hidden-prize-storage","Hidden Prize Storage","🎁",53,121,"underground-machine-room"]
].map(([id,name,icon,x,y,section])=>({id,name,icon,x,y,section}));

export const SEWER_CONTAINERS=[
  {id:"empty-bottle",name:"Empty Bottle",icon:"🍼",capacity:1,rank:1},{id:"sample-jar",name:"Sample Jar",icon:"🫙",capacity:1,rank:2},
  {id:"reinforced-flask",name:"Reinforced Flask",icon:"⚗️",capacity:1,rank:3},{id:"laboratory-container",name:"Laboratory Container",icon:"🧪",capacity:1,rank:4},
  {id:"large-sample-tank",name:"Large Sample Tank",icon:"🛢️",capacity:3,rank:5}
];
export const SEWER_CONTAINER_BY_ID=Object.fromEntries(SEWER_CONTAINERS.map(item=>[item.id,item]));
export const WATER_POINTS=[
  {id:"entrance-drip",name:"West Tunnel Sample Pool",water:"murky-green-water",quality:"Murky Green Water",x:27,y:24,cooldown:35,requiredContainer:"empty-bottle",available:1,depth:"shallow"},
  {id:"shallow-canal",name:"Green-Water Cave Shelf",water:"murky-green-water",quality:"Murky Green Water",x:196,y:50,cooldown:45,requiredContainer:"empty-bottle",available:2,depth:"shallow"},
  {id:"pump-reservoir",name:"Central Hub Pump Reservoir",water:"filtered-sewer-water",quality:"Filtered Green Water",x:134,y:26,cooldown:60,requiredContainer:"sample-jar",available:2,depth:"shallow",requires:"pumps-full"},
  {id:"glow-channel",name:"Green-Water Cave Glow Pool",water:"glowing-green-water",quality:"Glowing Green Water",x:211,y:55,cooldown:70,requiredContainer:"reinforced-flask",available:1,depth:"deep"},
  {id:"purifier-outlet",name:"Laboratory Purifier",water:"filtered-sewer-water",quality:"Filtered Green Water",x:211,y:117,cooldown:55,requiredContainer:"sample-jar",available:2,depth:"shallow",requires:"lab-electricity"},
  {id:"warning-pipe",name:"Red Maze Warning Pipe",water:"radioactive-looking-fruit-water",quality:"Radioactive-Looking Fruit Water",x:72,y:144,cooldown:80,requiredContainer:"reinforced-flask",available:1,depth:"shallow"},
  {id:"blue-vault-pool",name:"Blue Maze Vault Pool",water:"glowing-green-water",quality:"Glowing Green Water",x:176,y:143,cooldown:90,requiredContainer:"reinforced-flask",available:1,depth:"deep",requires:"blue-water-emblem"},
  {id:"ancient-pipe",name:"Ancient Root Pipe Spring",water:"ancient-pipe-water",quality:"Ancient Pipe Water",x:144,y:164,cooldown:110,requiredContainer:"laboratory-container",available:1,depth:"deep"},
  {id:"cosmic-seep",name:"Garden Cosmic Drain",water:"cosmic-green-water",quality:"Cosmic Green Water",x:211,y:164,cooldown:180,requiredContainer:"large-sample-tank",available:1,depth:"deep",requires:"cosmic-age"}
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

export const SEWER_PUMPS=["red","blue","yellow","green"].map((color,index)=>({id:`${color}-pump`,name:`${color[0].toUpperCase()+color.slice(1)} ${index===0?"Pressure":index===1?"Water":index===2?"Power":"Root Filter"} Pump`,x:108+index*8,y:26,part:index===0?null:["copper-wire","generator-gear","replacement-pump-fuse"][index-1]}));
export const SEWER_VALVES=[
  {id:"entrance-valve",name:"West Tunnel Brass Valve",x:70,y:20,order:0,effect:"Opens the safe route from Manhole A to the Central Sewer Hub."},
  {id:"red-valve",name:"Red Hub Valve",x:110,y:28,order:1,effect:"Starts the central hub pressure sequence."},
  {id:"blue-valve",name:"Blue Hub Valve",x:120,y:28,order:2,effect:"Balances the hub water pressure."},
  {id:"yellow-valve",name:"Yellow Hub Valve",x:130,y:28,order:3,effect:"Completes the hub pressure sequence."},
  {id:"waterfall-valve",name:"Green-Water Cave Valve",x:205,y:62,order:0,effect:"Redirects cave water and reveals the blue-vault walkway."}
];
export const SEWER_GATES=[
  {id:"channel-gate",name:"West-to-Hub Gate",x:78,y:20,requires:"entrance-valve",hint:"Turn the West Tunnel Brass Valve."},
  {id:"pressure-gate",name:"Sewer Maze Gate",x:120,y:113,requires:"pump-and-repair",hint:"Restore all four pumps and repair the collapsed Maintenance Wing route."},
  {id:"charged-gate",name:"Charged Inner Grate",x:116,y:128,requires:"charged-sewer-sample",hint:"Insert a Charged Sewer Sample."},
  {id:"center-door",name:"Four-Color Valve Door",x:125,y:143,requires:"four-emblems",hint:"Collect and insert all four quarter emblems."},
  {id:"forgotten-lab-door",name:"Forgotten Laboratory Door",x:58,y:151,requires:"center-open",hint:"Activate Black-Pipe Center."},
  {id:"mafia-gate",name:"Fruit Mafia Guarded Door",x:45,y:68,requires:"center-open",hint:"Open Black-Pipe Center and inspect the Golden Grape symbol."}
];
export const SEWER_SHORTCUTS=[
  {id:"lab-drain",name:"Test Lab Drain Shortcut",x:195,y:115,requires:"maintenance-key"},
  {id:"lab-lift",name:"Cave-to-Lab Lift",x:205,y:84,requires:"maintenance-key",destination:"sewer-test-laboratory"},
  {id:"maze-cart",name:"Maintenance Cart Shortcut",x:155,y:108,requires:"rivet-or-key"},
  {id:"blue-pump",name:"Blue Maze Cave Shortcut",x:185,y:132,requires:"blue-water-emblem"},{id:"red-lab",name:"Red Maze Lab Shortcut",x:58,y:151,requires:"red-pressure-emblem"},
  {id:"center-ring",name:"Black-Pipe Center Shortcut",x:136,y:143,requires:"center-open"},{id:"garden-root",name:"Living Root Shortcut",x:181,y:160,requires:"green-root-emblem"},
  {id:"club-pipe",name:"Velvet Pipe Shortcut",x:45,y:101,requires:"membership"}
];
export const SEWER_TREASURES=[
  {id:"entrance-bottles",name:"West Tunnel Bottle Shelf",x:26,y:20,reward:{item:"empty-bottle",amount:2}},
  {id:"mushroom-cache",name:"Green-Water Cave Mushroom Cache",x:196,y:56,reward:{item:"strange-mushroom",amount:2}},
  {id:"d1-cache",name:"D1 Turnaround Cache",x:120,y:84,reward:{cash:35,item:"chalk-marker",amount:2}},
  {id:"coin-nook",name:"Red Maze Fruit Coin Nook",x:68,y:144,reward:{coins:4}},{id:"old-toolbox",name:"Old Maintenance Toolbox",x:165,y:112,reward:{item:"maintenance-key",amount:1}},
  {id:"marker-locker",name:"Maze Navigation Locker",x:114,y:105,reward:{item:"chalk-marker",amount:4}},{id:"red-boiler-vault",name:"Boiler Vault",x:80,y:145,reward:{research:8,item:"replacement-pump-fuse",amount:1}},
  {id:"blue-drain-cache",name:"Flooded Drain Cache",x:176,y:145,reward:{coins:3,item:"copper-wire",amount:1}},
  {id:"yellow-parts-bin",name:"Generator Parts Bin",x:116,y:125,reward:{item:"generator-gear",amount:1}},
  {id:"green-seed-nest",name:"Root-Wrapped Seed Nest",x:147,y:164,reward:{item:"rare-seed",amount:1}},
  {id:"ancient-crate",name:"Ancient Pipe Crate",x:136,y:164,reward:{research:8,item:"rare-seed",amount:1}},
  {id:"center-chest",name:"Black-Pipe Reward Chest",x:128,y:146,reward:{cash:150,coins:8,research:15,chips:12}},
  {id:"forgotten-vault",name:"Forgotten Research Vault",x:48,y:164,reward:{research:20,item:"forgotten-formula",amount:1}},
  {id:"garden-cache",name:"Pipe Orchard Basket",x:208,y:164,reward:{item:"mutant-seed",amount:2}},
  {id:"velvet-box",name:"Hidden Machine-Room Prize Box",x:53,y:121,reward:{chips:12,item:"plinko-prize-ticket",amount:1}}
];
export const SEWER_CHECKPOINTS=[{id:"front-bell",name:"West Tunnel Emergency Bell",x:25,y:20,section:"front-drain-entrance"},{id:"pump-bell",name:"Central Hub Save Bell",x:120,y:16,section:"central-pump-station"},{id:"maze-bell",name:"Maze Entrance Bell",x:120,y:105,section:"maze-entrance"},{id:"center-bell",name:"Center Maintenance Bell",x:125,y:143,section:"black-pipe-center"}];
export const SEWER_QUARTERS={
  red:{id:"red",name:"Red Pressure Quarter",emblem:"red-pressure-emblem",solution:[2,1,3],landmarks:["Triple Red Valve","Steam Clock","Melted Apple Sign","Broken Boiler","Red Pipe Bridge"]},
  blue:{id:"blue",name:"Blue Canal Quarter",emblem:"blue-water-emblem",solution:["high","middle","low"],landmarks:["Blue Waterfall","Three Drain Gates","Maintenance Boat","Blueberry Mosaic","Flood-Control Wheel"]},
  yellow:{id:"yellow",name:"Yellow Maintenance Quarter",emblem:"yellow-power-emblem",parts:["yellow-fuse","copper-wire","generator-gear"],landmarks:["Broken Generator","Yellow Fuse Wall","Maintenance Elevator","Lemon Warning Sign","Sparking Junction"]},
  green:{id:"green",name:"Green Root Quarter",emblem:"green-root-emblem",samples:["murky-green-water","filtered-sewer-water","glowing-green-water"],safe:"filtered-sewer-water",landmarks:["Giant Root Arch","Sewer Greenhouse","Glowing Mushroom Circle","Ancient Irrigation Wheel","Green Fruit Statue"]}
};
export const CHALK_SYMBOLS=["left","right","dead-end","important","treasure","exit","water","mafia"];

export const SEWER_CHARACTERS=[
  ["maintenance-worker","Mossy Max","Maintenance Worker","🧑‍🔧",112,26,"These hub pumps are older than Mayor Marigold's favorite hat."],
  ["sewer-researcher","Drip Drop Dahlia","Sewer Researcher","👩‍🔬",201,115,"Green water is scientifically weird—and weird is data."],
  ["lost-delivery-driver","Denny Detour","Lost Delivery Driver","🧑‍✈️",115,84,"I followed a crate marked D1. It was definitely a dead end."],
  ["mushroom-grower","Marnie Morel","Mushroom Grower","🧑‍🌾",201,164,"The mushrooms prefer compliments and low lighting."],
  ["fruit-mafia-bouncer","Big Fig","Fruit Mafia Bouncer","🕴️",45,60,"Password? No? Cash and good manners also work."],
  ["fruit-mafia-dealer","Cherry Chips","Club Chip Host","🍒",43,86,"The Mystery Crate uses strategy and luck—not real money."],
  ["prize-counter-worker","Perry Prize","Prize Counter Worker","🎁",49,120,"Tickets, trinkets, and absolutely no real-money value."],
  ["mysterious-plumber","P. Lumb","Mysterious Plumber","🪠",127,138,"Every pipe tells a story. Most of them say glub."],
  ["former-lab-scientist","Professor Pulp","Former Laboratory Scientist","🧑‍🔬",45,164,"The failed mixtures were only failures at being boring."],
  ["maze-explorer","Navi Nectar","Maze Explorer","🧭",116,105,"Study the entrance map. Inside, colored pipes and landmarks are your friends."]
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
