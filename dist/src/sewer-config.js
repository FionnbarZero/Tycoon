export const SEWER_WORLD={width:240,height:180,worldWidth:2400,worldHeight:1800,unitScale:10,layoutId:"fruitopia-sewer-fixed-v2"};

export const SEWER_ENTRANCES=[
  {id:"sunny-manhole",name:"Fruit Stand Road Manhole",x:15,y:56,sewerX:20,sewerY:160,zone:"front-drain-entrance",unlock:"Discover a sewer clue, speak with Bruno Bramble, or inspect the Hidden Office Basement."},
  {id:"depot-manhole",name:"Delivery Depot Manhole",x:54,y:59,sewerX:58,sewerY:145,zone:"central-pump-station",unlock:"Repair the first pump from underground."},
  {id:"market-manhole",name:"Market Alley Manhole",x:73,y:44,sewerX:154,sewerY:67,zone:"yellow-maintenance-quarter",unlock:"Open it from inside the Yellow Maintenance Quarter."},
  {id:"juice-manhole",name:"Juice Lab Drain Manhole",x:84,y:31,sewerX:62,sewerY:113,zone:"sewer-test-laboratory",unlock:"Complete the first safe Green-Water experiment."},
  {id:"mafia-alley-manhole",name:"Golden Grape Manhole",x:78,y:18,sewerX:222,sewerY:35,zone:"fruit-mafia-club",unlock:"Become a permanent Fruit Mafia Club member.",undergroundOnly:true}
];
export const SEWER_ENTRANCE_BY_ID=Object.fromEntries(SEWER_ENTRANCES.map(item=>[item.id,item]));

export const SEWER_SECTIONS=[
  ["front-drain-entrance","Front Drain Entrance",8,145,45,28,"#68746d","#f6c86b","💧","Slow dripping and distant road sounds","Entrance Map · Maintenance Desk · Emergency Bell","Tutorial valve and safe checkpoint","First bottle, map, and route to the pump hub"],
  ["central-pump-station","Central Pump Station",48,128,40,38,"#4e6267","#77d6d1","⚙️","Rotating machinery and pressure thumps","Four Great Pumps · Pressure Board","Restores routes, lights, and passive green water","Delivery shortcut and sewer hub"],
  ["green-water-canals","Green-Water Canals",10,93,56,39,"#356b59","#68f08c","🌊","Running water, pipe echoes, and splashes","Glow Pool · Low Bridges · Canal Falls","Container-based renewable water collection","Supplies experiments, puzzles, and quests"],
  ["sewer-test-laboratory","Sewer Test Laboratory",52,91,40,32,"#536c75","#89f7c8","🧪","Electrical hum, bubbling, and warning beeps","Mixing Chamber · Observation Window · Plant Chamber","Timed experiments and recipe discovery","Connects Fruit Labs, workers, and Juice Lab drain"],
  ["abandoned-maintenance-wing","Abandoned Maintenance Wing",88,105,35,30,"#6d655d","#f5ba63","🧰","Loose chains and rolling maintenance carts","Rusted Lockers · Equipment Cage · Collapsed Hall","Repair puzzle and navigation equipment","Opens the maze preparation room"],
  ["maze-entrance","Maze Entrance",111,94,29,31,"#5b625f","#efe0a0","🗺️","Quiet echoes and Bruno's warning radio","Hand-Drawn Map · Supply Table · Start Line","Entrance-only full map and emergency preparation","Only complete navigational overview"],
  ["red-pipe-quarter","Red Pipe Quarter",128,42,45,53,"#6f403d","#ff736a","🔴","Steam bursts and hot pipe knocks","Triple Red Valve · Steam Clock · Broken Boiler","Pressure puzzle","Red Emblem and Forgotten Lab route"],
  ["blue-canal-quarter","Blue Canal Quarter",183,45,45,52,"#36586f","#64c6ff","🔵","Drips, waterfalls, and hollow canal echoes","Blue Waterfall · Drain Gates · Maintenance Boat","Three-stage water-level puzzle","Blue Emblem and rare collection point"],
  ["yellow-maintenance-quarter","Yellow Maintenance Quarter",142,99,49,39,"#736536","#ffe36e","🟡","Flickering current and generator clacks","Broken Generator · Fuse Wall · Sparking Junction","Parts and switchboard puzzle","Yellow Emblem, Test Lab power, Market exit"],
  ["green-root-quarter","Green Root Quarter",164,17,48,30,"#3c6747","#74e47c","🟢","Root creaks, insects, and soft glowing tones","Giant Root Arch · Mushroom Circle · Living Bridge","Water testing and irrigation puzzle","Green Emblem and Underground Garden"],
  ["black-pipe-center","Black-Pipe Center",173,62,32,29,"#2e3138","#e7bd57","⚫","Deep machinery and heartbeat-like pipes","Four-Color Door · Pressure Machine · Golden Grape","Insert four persistent emblems","Mafia Gate, reward chest, and permanent shortcut"],
  ["forgotten-fruit-laboratory","Forgotten Fruit Laboratory",119,17,42,25,"#584f69","#cda2ff","👻","Old tanks, glass chimes, and faint signal static","Hybrid Vault · Ghost Tank · Cosmic Receiver","Recover lost formula and secret research","Hybrid clue, decoration, and Lyra conversation"],
  ["fruit-mafia-club","Fruit Mafia Club",207,25,30,29,"#493554","#e9c45d","🍇","Muffled club music, chips, and Plinko pegs","Velvet Desk · Prize Vault · Mystery Crate Room","Club games and fictional-chip rewards","Club membership, contacts, and secret exit"],
  ["underground-fruit-garden","Underground Fruit Garden",184,4,43,17,"#426c50","#9cff95","🌱","Peaceful music, irrigation, and tiny insects","Mutant Plots · Pipe Orchard · Greenhouse Controls","Renewable sewer ingredient farming","Sewer recipes, rare plants, and worker requests"],
  ["surface-exit-network","Surface Exit Network",18,132,209,44,"#555e61","#e3a75c","🪜","Road rumbles and ladder echoes","Five Surface Ladders · Exit Signs · Checkpoints","Persistent fast-travel exits","Reconnects the underground district to Fruitopia"]
].map(([id,name,x,y,w,h,color,accent,icon,sound,landmarks,system,reward])=>({id,name,x,y,w,h,color,accent,icon,sound,landmarks:landmarks.split(" · "),system,reward,description:`${system}. ${reward}.`,maze:["red-pipe-quarter","blue-canal-quarter","yellow-maintenance-quarter","green-root-quarter","black-pipe-center"].includes(id)}));
export const SEWER_SECTION_BY_ID=Object.fromEntries(SEWER_SECTIONS.map(item=>[item.id,item]));

// Fixed center-line graph: a connected main route, outer ring, middle ring, inner ring, and deliberate loops.
export const SEWER_PATHS=[
  [[20,160],[38,160],[52,150],[58,145],[70,140],[70,125],[60,113]],
  [[38,160],[35,135],[32,112],[55,112]],[[60,113],[84,113],[103,119],[122,109]],
  [[58,145],[58,132],[78,132],[103,119]],[[122,109],[145,109],[154,119],[181,119]],
  [[122,109],[122,89],[135,83],[143,68],[151,55],[166,55]],
  [[122,89],[115,74],[126,55],[151,55]],[[151,55],[174,49],[195,52],[216,66],[218,89],[202,108],[181,119],[154,119],[138,101],[122,89]],
  [[142,68],[151,78],[174,84],[193,82],[207,70],[202,58],[183,55],[164,61],[151,78]],
  [[164,61],[174,70],[188,72],[197,66],[192,58],[178,55],[164,61]],
  [[151,55],[145,37],[140,29]],[[140,29],[158,29]],[[174,49],[180,34],[190,32],[205,35]],
  [[195,52],[206,36],[222,35]],[[188,72],[188,39],[184,20],[204,12],[221,12]],
  [[181,119],[169,128],[154,125],[154,67]],[[145,109],[154,91],[174,84]],
  [[202,108],[214,105],[220,90]],[[216,66],[225,66],[225,47]],
  [[103,119],[101,103],[112,94],[122,89]],[[35,135],[20,135],[20,160]],
  [[70,140],[58,145]],[[154,119],[154,67]],[[62,113],[62,102],[73,102]]
];

export const SEWER_ROOMS=[
  ["entrance-room",10,148,32,24],["pump-room",48,130,35,30],["canal-room",20,99,43,27],["test-lab-room",53,95,35,25],
  ["maintenance-room",91,108,29,23],["maze-prep-room",112,96,26,25],["red-boiler-room",132,45,35,27],["blue-control-room",190,62,31,28],
  ["yellow-generator-room",145,106,38,25],["green-root-room",176,20,34,25],["center-room",174,63,28,24],["forgotten-lab-room",122,20,34,19],
  ["mafia-club-room",209,27,25,24],["garden-room",186,6,39,15]
].map(([id,x,y,w,h])=>({id,x,y,w,h}));

export const SEWER_LANDMARKS=[
  ["sewer-overview-board","Surface & Pump Network Map","🗺️",23,156,"front-drain-entrance"],["four-pumps","Four Great Pumps","⚙️",58,143,"central-pump-station"],
  ["glow-pool","Glowing Pool","💚",40,107,"green-water-canals"],["mixing-machine","Mixing Machine","🧪",63,108,"sewer-test-laboratory"],
  ["rusted-lockers","Rusted Lockers","🗄️",100,116,"abandoned-maintenance-wing"],["maze-board","Maze Entrance Board","📍",120,105,"maze-entrance"],
  ["triple-red-valve","Triple Red Valve","🔴",148,67,"red-pipe-quarter"],["steam-clock","Steam Clock","🕰️",139,51,"red-pipe-quarter"],
  ["blue-waterfall","Blue Waterfall","🌊",210,75,"blue-canal-quarter"],["maintenance-boat","Maintenance Boat","🛶",201,91,"blue-canal-quarter"],
  ["broken-generator","Broken Generator","⚡",158,117,"yellow-maintenance-quarter"],["yellow-fuse-wall","Yellow Fuse Wall","🔌",175,121,"yellow-maintenance-quarter"],
  ["giant-root-arch","Giant Root Arch","🌿",188,37,"green-root-quarter"],["mushroom-circle","Glowing Mushroom Circle","🍄",201,26,"green-root-quarter"],
  ["four-color-door","Four-Color Valve Door","🚪",181,75,"black-pipe-center"],["golden-grape","Golden Grape Symbol","🍇",197,69,"black-pipe-center"],
  ["ghost-tank","Ghost Fruit Tank","👻",138,29,"forgotten-fruit-laboratory"],["pipe-orchard","Pipe Orchard","🌳",207,12,"underground-fruit-garden"],
  ["velvet-desk","Velvet Entrance Desk","🎩",216,42,"fruit-mafia-club"],["jackpot-pipe","Jackpot Pipe","🎰",191,80,"black-pipe-center"]
].map(([id,name,icon,x,y,section])=>({id,name,icon,x,y,section}));

export const SEWER_CONTAINERS=[
  {id:"empty-bottle",name:"Empty Bottle",icon:"🍼",capacity:1,rank:1},{id:"sample-jar",name:"Sample Jar",icon:"🫙",capacity:1,rank:2},
  {id:"reinforced-flask",name:"Reinforced Flask",icon:"⚗️",capacity:1,rank:3},{id:"laboratory-container",name:"Laboratory Container",icon:"🧪",capacity:1,rank:4},
  {id:"large-sample-tank",name:"Large Sample Tank",icon:"🛢️",capacity:3,rank:5}
];
export const SEWER_CONTAINER_BY_ID=Object.fromEntries(SEWER_CONTAINERS.map(item=>[item.id,item]));
export const WATER_POINTS=[
  {id:"entrance-drip",name:"Entrance Channel",water:"murky-green-water",quality:"Murky Green Water",x:34,y:143,cooldown:35,requiredContainer:"empty-bottle",available:1,depth:"shallow"},
  {id:"shallow-canal",name:"Canal Collection Station",water:"murky-green-water",quality:"Murky Green Water",x:33,y:112,cooldown:45,requiredContainer:"empty-bottle",available:2,depth:"shallow"},
  {id:"pump-reservoir",name:"Automatic Pump Reservoir",water:"filtered-sewer-water",quality:"Filtered Sewer Water",x:72,y:143,cooldown:60,requiredContainer:"sample-jar",available:2,depth:"shallow",requires:"pumps-full"},
  {id:"glow-channel",name:"Glowing Pool",water:"glowing-green-water",quality:"Glowing Green Water",x:47,y:103,cooldown:70,requiredContainer:"reinforced-flask",available:1,depth:"deep"},
  {id:"purifier-outlet",name:"Laboratory Purifier",water:"filtered-sewer-water",quality:"Filtered Sewer Water",x:72,y:104,cooldown:55,requiredContainer:"sample-jar",available:2,depth:"shallow",requires:"lab-electricity"},
  {id:"warning-pipe",name:"Cartoon Warning Pipe",water:"radioactive-looking-fruit-water",quality:"Radioactive-Looking Fruit Water",x:151,y:56,cooldown:80,requiredContainer:"reinforced-flask",available:1,depth:"shallow"},
  {id:"blue-vault-pool",name:"Blue Quarter Vault Pool",water:"glowing-green-water",quality:"Glowing Green Water",x:211,y:82,cooldown:90,requiredContainer:"reinforced-flask",available:1,depth:"deep",requires:"blue-water-emblem"},
  {id:"ancient-pipe",name:"Ancient Pipe Spring",water:"ancient-pipe-water",quality:"Ancient Pipe Water",x:159,y:43,cooldown:110,requiredContainer:"laboratory-container",available:1,depth:"deep"},
  {id:"cosmic-seep",name:"Cosmic Drain",water:"cosmic-green-water",quality:"Cosmic Green Water",x:220,y:12,cooldown:180,requiredContainer:"large-sample-tank",available:1,depth:"deep",requires:"cosmic-age"}
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

export const SEWER_PUMPS=["red","blue","yellow","green"].map((color,index)=>({id:`${color}-pump`,name:`${color[0].toUpperCase()+color.slice(1)} ${index===0?"Pressure":index===1?"Water":index===2?"Power":"Root Filter"} Pump`,x:54+index*7,y:140,part:index===0?null:["copper-wire","generator-gear","replacement-pump-fuse"][index-1]}));
export const SEWER_VALVES=[
  {id:"entrance-valve",name:"Tutorial Brass Valve",x:35,y:157,order:0,effect:"Opens the safe route to the Central Pump Station."},
  {id:"red-valve",name:"Red Pump Valve",x:55,y:139,order:1,effect:"Starts the legacy hub pressure sequence."},
  {id:"blue-valve",name:"Blue Pump Valve",x:62,y:139,order:2,effect:"Balances the hub water pressure."},
  {id:"yellow-valve",name:"Yellow Pump Valve",x:69,y:139,order:3,effect:"Completes the hub pressure sequence."},
  {id:"waterfall-valve",name:"Waterfall Valve",x:210,y:75,order:0,effect:"Redirects water and reveals the blue vault walkway."}
];
export const SEWER_GATES=[
  {id:"channel-gate",name:"Pump Station Gate",x:42,y:158,requires:"entrance-valve",hint:"Turn the Tutorial Brass Valve."},
  {id:"pressure-gate",name:"Maze Preparation Gate",x:114,y:98,requires:"pump-and-repair",hint:"Restore all four pumps and repair the collapsed Maintenance Wing route."},
  {id:"charged-gate",name:"Charged Inner Grate",x:164,y:61,requires:"charged-sewer-sample",hint:"Insert a Charged Sewer Sample."},
  {id:"center-door",name:"Four-Color Valve Door",x:177,y:72,requires:"four-emblems",hint:"Collect and insert all four quarter emblems."},
  {id:"forgotten-lab-door",name:"Forgotten Laboratory Door",x:145,y:37,requires:"center-open",hint:"Activate Black-Pipe Center."},
  {id:"mafia-gate",name:"Fruit Mafia Gate",x:205,y:35,requires:"center-open",hint:"Open Black-Pipe Center and inspect the Golden Grape symbol."}
];
export const SEWER_SHORTCUTS=[
  {id:"lab-drain",name:"Test Lab Drain Shortcut",x:73,y:102,requires:"maintenance-key"},{id:"maze-cart",name:"Maintenance Cart Shortcut",x:103,y:119,requires:"rivet-or-key"},
  {id:"blue-pump",name:"Blue Canal Pump Shortcut",x:202,y:108,requires:"blue-water-emblem"},{id:"red-lab",name:"Red Boiler Lab Shortcut",x:145,y:37,requires:"red-pressure-emblem"},
  {id:"center-ring",name:"Black-Pipe Center Shortcut",x:174,y:84,requires:"center-open"},{id:"garden-root",name:"Living Root Shortcut",x:184,y:20,requires:"green-root-emblem"},
  {id:"club-pipe",name:"Velvet Pipe Shortcut",x:205,y:35,requires:"membership"}
];
export const SEWER_TREASURES=[
  {id:"entrance-bottles",name:"Maintenance Desk Bottles",x:18,y:154,reward:{item:"empty-bottle",amount:2}},
  {id:"mushroom-cache",name:"Glowing Mushroom Cache",x:40,y:105,reward:{item:"strange-mushroom",amount:2}},
  {id:"coin-nook",name:"Fruit Coin Nook",x:126,y:55,reward:{coins:4}},{id:"old-toolbox",name:"Old Maintenance Toolbox",x:101,y:114,reward:{item:"maintenance-key",amount:1}},
  {id:"marker-locker",name:"Navigation Locker",x:106,y:124,reward:{item:"chalk-marker",amount:4}},{id:"red-boiler-vault",name:"Boiler Vault",x:139,y:51,reward:{research:8,item:"replacement-pump-fuse",amount:1}},
  {id:"blue-drain-cache",name:"Flooded Drain Cache",x:214,y:91,reward:{coins:3,item:"copper-wire",amount:1}},
  {id:"yellow-parts-bin",name:"Generator Parts Bin",x:176,y:121,reward:{item:"generator-gear",amount:1}},
  {id:"green-seed-nest",name:"Root-Wrapped Seed Nest",x:202,y:27,reward:{item:"rare-seed",amount:1}},
  {id:"ancient-crate",name:"Ancient Pipe Crate",x:159,y:43,reward:{research:8,item:"rare-seed",amount:1}},
  {id:"center-chest",name:"Black-Pipe Reward Chest",x:188,y:79,reward:{cash:150,coins:8,research:15,chips:12}},
  {id:"forgotten-vault",name:"Forgotten Research Vault",x:137,y:27,reward:{research:20,item:"forgotten-formula",amount:1}},
  {id:"garden-cache",name:"Pipe Orchard Basket",x:208,y:12,reward:{item:"mutant-seed",amount:2}},
  {id:"velvet-box",name:"Velvet-Rope Prize Box",x:220,y:43,reward:{chips:12,item:"plinko-prize-ticket",amount:1}}
];
export const SEWER_CHECKPOINTS=[{id:"front-bell",name:"Entrance Emergency Bell",x:17,y:161,section:"front-drain-entrance"},{id:"pump-bell",name:"Pump Station Bell",x:54,y:150,section:"central-pump-station"},{id:"maze-bell",name:"Maze Entrance Bell",x:118,y:113,section:"maze-entrance"},{id:"center-bell",name:"Center Maintenance Bell",x:184,y:83,section:"black-pipe-center"}];
export const SEWER_QUARTERS={
  red:{id:"red",name:"Red Pressure Quarter",emblem:"red-pressure-emblem",solution:[2,1,3],landmarks:["Triple Red Valve","Steam Clock","Melted Apple Sign","Broken Boiler","Red Pipe Bridge"]},
  blue:{id:"blue",name:"Blue Canal Quarter",emblem:"blue-water-emblem",solution:["high","middle","low"],landmarks:["Blue Waterfall","Three Drain Gates","Maintenance Boat","Blueberry Mosaic","Flood-Control Wheel"]},
  yellow:{id:"yellow",name:"Yellow Maintenance Quarter",emblem:"yellow-power-emblem",parts:["yellow-fuse","copper-wire","generator-gear"],landmarks:["Broken Generator","Yellow Fuse Wall","Maintenance Elevator","Lemon Warning Sign","Sparking Junction"]},
  green:{id:"green",name:"Green Root Quarter",emblem:"green-root-emblem",samples:["murky-green-water","filtered-sewer-water","glowing-green-water"],safe:"filtered-sewer-water",landmarks:["Giant Root Arch","Sewer Greenhouse","Glowing Mushroom Circle","Ancient Irrigation Wheel","Green Fruit Statue"]}
};
export const CHALK_SYMBOLS=["left","right","dead-end","important","treasure","exit","water","mafia"];

export const SEWER_CHARACTERS=[
  ["maintenance-worker","Mossy Max","Maintenance Worker","🧑‍🔧",52,149,"These pumps are older than Mayor Marigold's favorite hat."],
  ["sewer-researcher","Drip Drop Dahlia","Sewer Researcher","👩‍🔬",70,109,"Green water is scientifically weird—and weird is data."],
  ["lost-delivery-driver","Denny Detour","Lost Delivery Driver","🧑‍✈️",98,120,"I followed a crate marked SHORTCUT. It was not a shortcut."],
  ["mushroom-grower","Marnie Morel","Mushroom Grower","🧑‍🌾",202,14,"The mushrooms prefer compliments and low lighting."],
  ["fruit-mafia-bouncer","Big Fig","Fruit Mafia Bouncer","🕴️",207,36,"Password? No? Cash and good manners also work."],
  ["fruit-mafia-dealer","Cherry Chips","Club Chip Host","🍒",220,38,"These chips are pretend, the prizes are fruity, and the odds are posted."],
  ["prize-counter-worker","Perry Prize","Prize Counter Worker","🎁",226,44,"Tickets, trinkets, and absolutely no real-money value."],
  ["mysterious-plumber","P. Lumb","Mysterious Plumber","🪠",151,78,"Every pipe tells a story. Most of them say glub."],
  ["former-lab-scientist","Professor Pulp","Former Laboratory Scientist","🧑‍🔬",138,29,"The failed mixtures were only failures at being boring."],
  ["maze-explorer","Navi Nectar","Maze Explorer","🧭",121,107,"Study the entrance map. Inside, colored pipes and landmarks are your friends."]
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
