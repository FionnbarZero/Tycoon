export const SEWER_WORLD={width:240,height:190,worldWidth:2400,worldHeight:1900,unitScale:10,layoutId:"fruitopia-sewer-fixed-v5-country-maze"};

export const SEWER_LAYOUT_POINTS={
  westEntrance:{x:35,y:20},centralEntrance:{x:120,y:20},eastEntrance:{x:205,y:20},overviewMap:{x:116,y:19},
  mafiaEntrance:{x:30,y:52},cardRoom:{x:120,y:52},machineRoom:{x:210,y:52},northPipeMaze:{x:120,y:76},
  deadEndD1:{x:45,y:85},greenWaterCave:{x:215,y:85},hiddenHub:{x:120,y:105},forgottenLab:{x:25,y:115},
  maintenance:{x:52,y:130},powerRoom:{x:25,y:130},gateTwo:{x:145,y:130},labLift:{x:215,y:130},
  blackCenter:{x:170,y:145},redRoom:{x:25,y:165},testLab:{x:215,y:160},garden:{x:205,y:174},
  mazeMap:{x:120,y:178},mazeStart:{x:120,y:170},mafiaGameRoom:{x:120,y:52}
};

// The entrance board and 3D passages share this one fixed topology. North is
// the top of the board (smaller y); the map never regenerates between visits.
export const SEWER_MAZE_PATHS=[
  [[120,178],[120,170],[100,170],[100,164],[80,164],[80,156],[55,156],[55,148],[25,148],[25,130]],
  [[25,130],[25,115],[42,115],[42,105],[24,105],[24,94],[45,94],[45,85]],
  [[45,85],[45,72],[30,72],[30,52]],
  [[30,52],[58,52],[58,60],[82,60],[82,52],[120,52]],
  [[120,52],[120,64],[104,64],[104,76],[136,76],[136,88],[120,88],[120,105]],
  [[120,105],[140,105],[140,118],[158,118],[158,145],[170,145]],
  [[170,145],[190,145],[190,130],[215,130]],
  [[215,130],[215,116],[204,116],[204,101],[215,101],[215,85]],
  [[215,85],[200,85],[200,72],[215,72],[215,52],[210,52]],
  [[210,52],[185,52],[185,60],[160,60],[160,52],[120,52]],
  [[120,178],[145,178],[145,166],[170,166],[170,145]],
  [[100,164],[120,164],[120,154],[145,154],[145,130]],
  [[55,148],[80,148],[80,138],[105,138],[105,124],[120,124],[120,105]],
  [[42,105],[70,105],[70,94],[45,94]],
  [[82,60],[82,68],[104,68]],
  [[136,88],[165,88],[165,76],[185,76],[185,60]],
  [[165,88],[185,88],[185,101],[204,101]],
  [[145,166],[145,150],[170,150]],
  [[25,148],[25,158],[14,158],[14,165],[25,165],[50,165],[50,156],[80,156]],
  [[25,130],[52,130],[52,122],[78,122],[78,112],[105,112]],
  [[170,166],[195,166],[195,174],[205,174]],
  [[215,130],[215,145],[215,160]]
];

export const SEWER_MAZE_MARKERS=[
  {code:"M",name:"Mafia Entrance",x:30,y:52,section:"mafia-entrance",tone:"mafia"},
  {code:"C",name:"Mafia Card Room",x:120,y:52,section:"fruit-mafia-club",tone:"mafia"},
  {code:"J",name:"Jackpot Machine Room",x:210,y:52,section:"underground-machine-room",tone:"mafia"},
  {code:"1",name:"Gate One Turnaround",x:45,y:85,section:"north-dead-end-d1",tone:"warning"},
  {code:"W",name:"Green-Water Cave",x:215,y:85,section:"green-water-canals",tone:"water"},
  {code:"H",name:"Hidden Root Hub",x:120,y:105,section:"green-root-quarter",tone:"root"},
  {code:"F",name:"Forgotten Fruit Laboratory",x:25,y:115,section:"forgotten-fruit-laboratory",tone:"secret"},
  {code:"P",name:"Power Quarter",x:25,y:130,section:"yellow-maintenance-quarter",tone:"power"},
  {code:"2",name:"Gate Two Turnaround",x:145,y:130,section:"north-pipe-maze",tone:"warning"},
  {code:"L",name:"Laboratory Lift",x:215,y:130,section:"lab-lift",tone:"lab"},
  {code:"X",name:"Black-Pipe Center",x:170,y:145,section:"black-pipe-center",tone:"center"},
  {code:"R",name:"Red Pressure Room",x:25,y:165,section:"red-pipe-quarter",tone:"pressure"},
  {code:"E",name:"Maze Entrance",x:120,y:178,section:"maze-entrance",tone:"entry"}
];

export const SEWER_ENTRANCES=[
  {id:"sunny-manhole",name:"Manhole A · West Sewer Tunnel",x:105,y:476,sewerX:35,sewerY:20,zone:"front-drain-entrance",unlock:"Discover a sewer clue, speak with Bruno Bramble, or inspect the Hidden Office Basement."},
  {id:"market-manhole",name:"Manhole B · Central Sewer Hub",x:360,y:476,sewerX:120,sewerY:20,zone:"central-pump-station",unlock:"Open it from inside the Yellow Maintenance Quarter."},
  {id:"depot-manhole",name:"Manhole C · East Sewer Tunnel",x:600,y:476,sewerX:205,sewerY:20,zone:"surface-exit-network",unlock:"Repair the first pump from underground."},
  {id:"juice-manhole",name:"Research Ridge Drain Manhole",x:372,y:255,sewerX:215,sewerY:160,zone:"sewer-test-laboratory",unlock:"Complete the first safe Green-Water experiment."},
  {id:"mafia-alley-manhole",name:"Golden Grape Manhole",x:132,y:330,sewerX:120,sewerY:52,zone:"fruit-mafia-club",unlock:"Become a permanent Fruit Mafia Club member.",undergroundOnly:true}
];
export const SEWER_ENTRANCE_BY_ID=Object.fromEntries(SEWER_ENTRANCES.map(item=>[item.id,item]));

export const SEWER_SECTIONS=[
  ["front-drain-entrance","West Sewer Tunnel",35,20,50,24,"#68746d","#72e58b","💧","Slow dripping, road rumbles, and small green pools","Manhole A · Sample Pool · Maintenance Desk","Safe sample collection and first-tunnel tutorial","First bottles and a clear route east to the hub"],
  ["central-pump-station","Central Sewer Hub",120,20,50,24,"#4e6267","#77d6d1","⚙️","Rotating pumps, map-room hum, and checkpoint bell","Manhole B · Network Map · Four Great Pumps · Save Point","Restores routes, lights, and passive green water","Main junction for every underground branch"],
  ["surface-exit-network","East Sewer Tunnel",205,20,50,24,"#555e61","#e3a75c","🪜","Large pipeline rumbles and hidden-supply echoes","Manhole C · Large Pipelines · Supply Alcove","Persistent east-side exit and supply route","Direct access to the fixed northern maze rooms"],
  ["mafia-entrance","M · Mafia Entrance",30,52,24,16,"#29242c","#e8b640","M","Quiet pipes, a guarded door, and a velvet-rope click","Guarded Doorway · $100 Membership Pad · Golden Grape","One-time fictional-Cash membership checkpoint","Opens the Card Room and underground machines permanently"],
  ["fruit-mafia-club","C · Mafia Card Room",120,52,28,16,"#493554","#e9c45d","C","Muffled club music, cards, crate mechanisms, and table chatter","Card Tables · Mystery Crate · Spectator Rail","Original event-driven Fruit Mafia survival game","Club reputation, card collection, and game rewards"],
  ["underground-machine-room","J · Jackpot Machine Room",210,52,24,16,"#302b37","#e8b640","J","Jackpot bells, fruit reels, gears, and prize-counter chatter","Jackpot Machine · Fruit Slots · Reward Counter · Hidden Storage","Fictional Club Chip machines and one-time prize collection","Club Chips, prizes, history, and secret storage"],
  ["north-pipe-maze","North Pipe Maze",120,76,24,16,"#414a4d","#d6e2cf","🧭","Pipe knocks, distant water, and hollow northern echoes","Fixed Turns · Gate Two · Landmark Codes","Recognizable fixed labyrinth with multiple loops","Connects every coded room without regenerating"],
  ["north-dead-end-d1","1 · Gate One Turnaround",45,85,18,14,"#555d5a","#ff9f43","1","A dry echo and the rattle of a hidden supply box","Gate One Mark · Turnaround Cache · Chalk Arrow","Optional navigation landmark and one-time cache","Rewards careful exploration without hiding progression"],
  ["green-water-canals","W · Green-Water Cave",215,85,26,18,"#356b59","#68f08c","W","Cave drips, bubbling green water, and pipe echoes","Glow Pool · Sample Shelf · Mixing Materials","Container-based renewable sample collection","Supplies laboratory experiments and maze puzzles"],
  ["green-root-quarter","H · Hidden Root Hub",120,105,24,16,"#3c6747","#74e47c","H","Root creaks, insects, and soft glowing tones","Giant Root Arch · Mushroom Circle · Living Bridge","Water testing and irrigation puzzle","Green Emblem and Underground Garden"],
  ["forgotten-fruit-laboratory","F · Forgotten Fruit Laboratory",25,115,22,16,"#584f69","#cda2ff","F","Old tanks, glass chimes, and faint signal static","Hybrid Vault · Ghost Tank · Cosmic Receiver","Recover lost formula and secret research","Hybrid clue, decoration, and Lyra conversation"],
  ["yellow-maintenance-quarter","P · Power Quarter",25,130,22,16,"#736536","#ffe36e","P","Flickering current and generator clacks","Broken Generator · Fuse Wall · Sparking Junction","Parts and switchboard puzzle","Yellow Emblem, Test Lab power, and Manhole B"],
  ["abandoned-maintenance-wing","Abandoned Maintenance Wing",52,130,22,16,"#6d655d","#f5ba63","🧰","Loose chains and rolling maintenance carts","Rusted Lockers · Equipment Cage · Collapsed Hall","Repair puzzle and navigation equipment","Opens the deeper maze preparation room"],
  ["lab-lift","L · Laboratory Lift",215,130,20,16,"#315c66","#54d9e8","L","Lift cables, relays, and a laboratory arrival bell","Lift Platform · Power Relay · LAB Sign","Persistent shortcut between the cave and Test Lab","Fast access to Green-Water experiments"],
  ["black-pipe-center","X · Black-Pipe Center",170,145,24,18,"#2e3138","#e7bd57","X","Deep machinery and heartbeat-like pipes","Four-Color Door · Pressure Machine · Golden Grape","Insert four persistent emblems","Mafia access, reward chest, and permanent shortcut"],
  ["blue-canal-quarter","Blue Canal Maze",188,112,24,16,"#36586f","#64c6ff","🔵","Drips, waterfalls, and hollow canal echoes","Blue Waterfall · Drain Gates · Turning Bridge","Three-stage water-level puzzle","Blue Emblem and Green-Water Cave shortcut"],
  ["sewer-test-laboratory","Sewer Test Laboratory",215,160,28,18,"#536c75","#89f7c8","🧪","Electrical hum, bubbling, and warning beeps","Mixing Chamber · Observation Window · Plant Chamber","Timed experiments and recipe discovery","Connects Fruit Labs, workers, and the Research Ridge drain"],
  ["underground-fruit-garden","Underground Fruit Garden",205,174,28,14,"#426c50","#9cff95","🌱","Peaceful music, irrigation, and tiny insects","Mutant Plots · Pipe Orchard · Greenhouse Controls","Renewable sewer ingredient farming","Sewer recipes, rare plants, and worker requests"],
  ["red-pipe-quarter","R · Red Pressure Room",25,165,22,16,"#6f403d","#ff736a","R","Steam bursts and hot pipe knocks","Triple Red Valve · Steam Clock · Broken Boiler","Pressure puzzle and turning bridge route","Red Emblem and Forgotten Lab shortcut"],
  ["maze-entrance","E · Sewer Maze Entrance",120,178,26,16,"#5b625f","#efe0a0","E","Quiet echoes and Bruno's warning radio","Hand-Drawn Map · Supply Table · Start Line","Entrance-only full map and emergency preparation","Only complete navigational overview"]
].map(([id,name,x,y,w,h,color,accent,icon,sound,landmarks,system,reward])=>({id,name,x,y,w,h,color,accent,icon,sound,landmarks:landmarks.split(" · "),system,reward,description:`${system}. ${reward}.`,maze:["red-pipe-quarter","blue-canal-quarter","yellow-maintenance-quarter","green-root-quarter","black-pipe-center"].includes(id)}));
export const SEWER_SECTION_BY_ID=Object.fromEntries(SEWER_SECTIONS.map(item=>[item.id,item]));

// Fixed hub-and-branch graph. The recognizable macro layout mirrors the three
// surface manholes while the detailed maze retains loops, quarters, and shortcuts.
export const SEWER_PATHS=[[[35,20],[75,20],[120,20],[165,20],[205,20]],[[35,20],[35,35],[30,52]],[[120,20],[120,35],[120,52]],[[205,20],[205,35],[210,52]],...SEWER_MAZE_PATHS];

export const SEWER_ROOMS=[
  ["west-tunnel-room",35,20,46,20],["central-hub-room",120,20,46,20],["east-tunnel-room",205,20,46,20],
  ["mafia-entry-room",30,52,20,12],["card-room",120,52,24,12],["machine-room",210,52,20,12],
  ["gate-one-room",45,85,14,10],["green-water-cave-room",215,85,22,14],["hidden-hub-room",120,105,20,12],
  ["forgotten-lab-room",25,115,18,12],["power-room",25,130,18,12],["maintenance-room",52,130,18,12],
  ["lab-lift-room",215,130,16,12],["center-room",170,145,20,14],["test-lab-room",215,160,24,14],
  ["red-boiler-room",25,165,18,12],["maze-prep-room",120,178,22,12],["garden-room",205,174,24,10]
].map(([id,x,y,w,h])=>({id,x,y,w,h}));

export const SEWER_LANDMARKS=[
  ["sewer-overview-board","Underground Network Map","🗺️",116,19,"central-pump-station"],["four-pumps","Four Great Pumps","⚙️",128,26,"central-pump-station"],
  ["west-sample-pool","West Sample Pool","💧",27,24,"front-drain-entrance"],["east-supply-alcove","Hidden Supply Alcove","📦",216,24,"surface-exit-network"],
  ["velvet-desk","M · Guarded Velvet Door","M",30,52,"mafia-entrance"],["north-layout-board","Fixed Country Maze Plan","🧭",112,176,"maze-entrance"],["glow-pool","W · Glowing Pool","W",215,85,"green-water-canals"],
  ["mystery-crate-table","C · Mystery Crate Table","C",120,52,"fruit-mafia-club"],["d1-wall-mark","1 · Gate One Marker","1",45,85,"north-dead-end-d1"],
  ["gate-two-mark","2 · Gate Two Marker","2",145,130,"north-pipe-maze"],["hidden-hub-mark","H · Hidden Root Hub","H",120,105,"green-root-quarter"],
  ["mixing-machine","Mixing Machine","🧪",215,160,"sewer-test-laboratory"],["rusted-lockers","Rusted Lockers","🗄️",52,130,"abandoned-maintenance-wing"],["maze-board","E · Maze Entrance Board","E",120,178,"maze-entrance"],
  ["triple-red-valve","R · Triple Red Valve","R",25,165,"red-pipe-quarter"],["steam-clock","Steam Clock","🕰️",20,162,"red-pipe-quarter"],
  ["blue-waterfall","Blue Waterfall","🌊",188,112,"blue-canal-quarter"],["maintenance-boat","Turning Bridge","🌉",185,101,"blue-canal-quarter"],
  ["broken-generator","P · Broken Generator","P",25,130,"yellow-maintenance-quarter"],["yellow-fuse-wall","Yellow Fuse Wall","🔌",30,133,"yellow-maintenance-quarter"],
  ["giant-root-arch","H · Giant Root Arch","H",120,105,"green-root-quarter"],["mushroom-circle","Glowing Mushroom Circle","🍄",125,108,"green-root-quarter"],
  ["four-color-door","X · Four-Color Valve Door","X",170,145,"black-pipe-center"],["golden-grape","Golden Grape Symbol","🍇",174,148,"black-pipe-center"],
  ["ghost-tank","F · Ghost Fruit Tank","F",25,115,"forgotten-fruit-laboratory"],["pipe-orchard","Pipe Orchard","🌳",205,174,"underground-fruit-garden"],
  ["jackpot-pipe","J · Jackpot Machine","J",206,52,"underground-machine-room"],["hidden-prize-storage","Hidden Prize Storage","🎁",214,55,"underground-machine-room"]
].map(([id,name,icon,x,y,section])=>({id,name,icon,x,y,section}));

export const SEWER_CONTAINERS=[
  {id:"empty-bottle",name:"Empty Bottle",icon:"🍼",capacity:1,rank:1},{id:"sample-jar",name:"Sample Jar",icon:"🫙",capacity:1,rank:2},
  {id:"reinforced-flask",name:"Reinforced Flask",icon:"⚗️",capacity:1,rank:3},{id:"laboratory-container",name:"Laboratory Container",icon:"🧪",capacity:1,rank:4},
  {id:"large-sample-tank",name:"Large Sample Tank",icon:"🛢️",capacity:3,rank:5}
];
export const SEWER_CONTAINER_BY_ID=Object.fromEntries(SEWER_CONTAINERS.map(item=>[item.id,item]));
export const WATER_POINTS=[
  {id:"entrance-drip",name:"West Tunnel Sample Pool",water:"murky-green-water",quality:"Murky Green Water",x:27,y:24,cooldown:35,requiredContainer:"empty-bottle",available:1,depth:"shallow"},
  {id:"shallow-canal",name:"W Cave Sample Shelf",water:"murky-green-water",quality:"Murky Green Water",x:207,y:85,cooldown:45,requiredContainer:"empty-bottle",available:2,depth:"shallow"},
  {id:"pump-reservoir",name:"Central Hub Pump Reservoir",water:"filtered-sewer-water",quality:"Filtered Green Water",x:134,y:26,cooldown:60,requiredContainer:"sample-jar",available:2,depth:"shallow",requires:"pumps-full"},
  {id:"glow-channel",name:"W Cave Glow Pool",water:"glowing-green-water",quality:"Glowing Green Water",x:218,y:85,cooldown:70,requiredContainer:"reinforced-flask",available:1,depth:"deep"},
  {id:"purifier-outlet",name:"Laboratory Purifier",water:"filtered-sewer-water",quality:"Filtered Green Water",x:218,y:160,cooldown:55,requiredContainer:"sample-jar",available:2,depth:"shallow",requires:"lab-electricity"},
  {id:"warning-pipe",name:"R Pressure Warning Pipe",water:"radioactive-looking-fruit-water",quality:"Radioactive-Looking Fruit Water",x:22,y:165,cooldown:80,requiredContainer:"reinforced-flask",available:1,depth:"shallow"},
  {id:"blue-vault-pool",name:"Blue Maze Vault Pool",water:"glowing-green-water",quality:"Glowing Green Water",x:190,y:112,cooldown:90,requiredContainer:"reinforced-flask",available:1,depth:"deep",requires:"blue-water-emblem"},
  {id:"ancient-pipe",name:"H Root Pipe Spring",water:"ancient-pipe-water",quality:"Ancient Pipe Water",x:124,y:106,cooldown:110,requiredContainer:"laboratory-container",available:1,depth:"deep"},
  {id:"cosmic-seep",name:"Garden Cosmic Drain",water:"cosmic-green-water",quality:"Cosmic Green Water",x:210,y:174,cooldown:180,requiredContainer:"large-sample-tank",available:1,depth:"deep",requires:"cosmic-age"}
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
  {id:"waterfall-valve",name:"W Cave Waterfall Valve",x:215,y:92,order:0,effect:"Redirects cave water and reveals the blue-vault walkway."}
];
export const SEWER_GATES=[
  {id:"channel-gate",name:"West-to-Hub Gate",x:78,y:20,requires:"entrance-valve",hint:"Turn the West Tunnel Brass Valve."},
  {id:"pressure-gate",name:"E · Sewer Maze Gate",x:120,y:170,requires:"pump-and-repair",hint:"Restore all four pumps and repair the collapsed Maintenance Wing route."},
  {id:"charged-gate",name:"2 · Charged Inner Grate",x:145,y:130,requires:"charged-sewer-sample",hint:"Insert a Charged Sewer Sample."},
  {id:"center-door",name:"X · Four-Color Valve Door",x:170,y:145,requires:"four-emblems",hint:"Collect and insert all four quarter emblems."},
  {id:"forgotten-lab-door",name:"F · Forgotten Laboratory Door",x:42,y:115,requires:"center-open",hint:"Activate Black-Pipe Center."},
  {id:"mafia-gate",name:"M · Fruit Mafia Guarded Door",x:30,y:65,requires:"center-open",hint:"Open Black-Pipe Center and inspect the Golden Grape symbol."}
];
export const SEWER_SHORTCUTS=[
  {id:"lab-drain",name:"Test Lab Drain Shortcut",x:205,y:160,requires:"maintenance-key"},
  {id:"lab-lift",name:"L · Cave-to-Lab Lift",x:215,y:130,requires:"maintenance-key",destination:"sewer-test-laboratory"},
  {id:"maze-cart",name:"Maintenance Cart Shortcut",x:52,y:130,requires:"rivet-or-key"},
  {id:"blue-pump",name:"W Cave Pump Shortcut",x:204,y:101,requires:"blue-water-emblem"},{id:"red-lab",name:"R-to-F Laboratory Shortcut",x:25,y:150,requires:"red-pressure-emblem"},
  {id:"center-ring",name:"X Center Ring Shortcut",x:180,y:145,requires:"center-open"},{id:"garden-root",name:"Living Root Shortcut",x:195,y:166,requires:"green-root-emblem"},
  {id:"club-pipe",name:"C · Velvet Pipe Shortcut",x:120,y:64,requires:"membership"}
];
export const SEWER_TREASURES=[
  {id:"entrance-bottles",name:"West Tunnel Bottle Shelf",x:26,y:20,reward:{item:"empty-bottle",amount:2}},
  {id:"mushroom-cache",name:"W Cave Mushroom Cache",x:208,y:88,reward:{item:"strange-mushroom",amount:2}},
  {id:"d1-cache",name:"Gate One Turnaround Cache",x:45,y:85,reward:{cash:35,item:"chalk-marker",amount:2}},
  {id:"coin-nook",name:"R Room Fruit Coin Nook",x:20,y:168,reward:{coins:4}},{id:"old-toolbox",name:"Old Maintenance Toolbox",x:52,y:130,reward:{item:"maintenance-key",amount:1}},
  {id:"marker-locker",name:"E Maze Navigation Locker",x:114,y:178,reward:{item:"chalk-marker",amount:4}},{id:"red-boiler-vault",name:"R Boiler Vault",x:29,y:165,reward:{research:8,item:"replacement-pump-fuse",amount:1}},
  {id:"blue-drain-cache",name:"Blue Flooded Drain Cache",x:188,y:112,reward:{coins:3,item:"copper-wire",amount:1}},
  {id:"yellow-parts-bin",name:"P Generator Parts Bin",x:30,y:130,reward:{item:"generator-gear",amount:1}},
  {id:"green-seed-nest",name:"H Root-Wrapped Seed Nest",x:124,y:108,reward:{item:"rare-seed",amount:1}},
  {id:"ancient-crate",name:"H Ancient Pipe Crate",x:116,y:108,reward:{research:8,item:"rare-seed",amount:1}},
  {id:"center-chest",name:"X Black-Pipe Reward Chest",x:174,y:148,reward:{cash:150,coins:8,research:15,chips:12}},
  {id:"forgotten-vault",name:"F Forgotten Research Vault",x:28,y:115,reward:{research:20,item:"forgotten-formula",amount:1}},
  {id:"garden-cache",name:"Pipe Orchard Basket",x:208,y:174,reward:{item:"mutant-seed",amount:2}},
  {id:"velvet-box",name:"J Hidden Prize Box",x:214,y:55,reward:{chips:12,item:"plinko-prize-ticket",amount:1}}
];
export const SEWER_CHECKPOINTS=[{id:"front-bell",name:"West Tunnel Emergency Bell",x:25,y:20,section:"front-drain-entrance"},{id:"pump-bell",name:"Central Hub Save Bell",x:120,y:16,section:"central-pump-station"},{id:"maze-bell",name:"E · Maze Entrance Bell",x:120,y:178,section:"maze-entrance"},{id:"center-bell",name:"X · Center Maintenance Bell",x:170,y:145,section:"black-pipe-center"}];
export const SEWER_QUARTERS={
  red:{id:"red",name:"Red Pressure Quarter",emblem:"red-pressure-emblem",solution:[2,1,3],landmarks:["Triple Red Valve","Steam Clock","Melted Apple Sign","Broken Boiler","Red Pipe Bridge"]},
  blue:{id:"blue",name:"Blue Canal Quarter",emblem:"blue-water-emblem",solution:["high","middle","low"],landmarks:["Blue Waterfall","Three Drain Gates","Maintenance Boat","Blueberry Mosaic","Flood-Control Wheel"]},
  yellow:{id:"yellow",name:"Yellow Maintenance Quarter",emblem:"yellow-power-emblem",parts:["yellow-fuse","copper-wire","generator-gear"],landmarks:["Broken Generator","Yellow Fuse Wall","Maintenance Elevator","Lemon Warning Sign","Sparking Junction"]},
  green:{id:"green",name:"Green Root Quarter",emblem:"green-root-emblem",samples:["murky-green-water","filtered-sewer-water","glowing-green-water"],safe:"filtered-sewer-water",landmarks:["Giant Root Arch","Sewer Greenhouse","Glowing Mushroom Circle","Ancient Irrigation Wheel","Green Fruit Statue"]}
};
export const CHALK_SYMBOLS=["left","right","dead-end","important","treasure","exit","water","mafia"];

export const SEWER_CHARACTERS=[
  ["maintenance-worker","Mossy Max","Maintenance Worker","🧑‍🔧",112,26,"These hub pumps are older than Mayor Marigold's favorite hat."],
  ["sewer-researcher","Drip Drop Dahlia","Sewer Researcher","👩‍🔬",211,160,"Green water is scientifically weird—and weird is data."],
  ["lost-delivery-driver","Denny Detour","Lost Delivery Driver","🧑‍✈️",45,88,"I followed the wall marked 1. It was definitely a turnaround."],
  ["mushroom-grower","Marnie Morel","Mushroom Grower","🧑‍🌾",201,174,"The mushrooms prefer compliments and low lighting."],
  ["fruit-mafia-bouncer","Big Fig","Fruit Mafia Bouncer","🕴️",30,56,"Password? No? Cash and good manners also work."],
  ["fruit-mafia-dealer","Cherry Chips","Club Chip Host","🍒",116,54,"The Mystery Crate uses strategy and luck—not real money."],
  ["prize-counter-worker","Perry Prize","Prize Counter Worker","🎁",212,54,"Tickets, trinkets, and absolutely no real-money value."],
  ["mysterious-plumber","P. Lumb","Mysterious Plumber","🪠",166,142,"Every pipe tells a story. Most of them say glub."],
  ["former-lab-scientist","Professor Pulp","Former Laboratory Scientist","🧑‍🔬",25,118,"The failed mixtures were only failures at being boring."],
  ["maze-explorer","Navi Nectar","Maze Explorer","🧭",116,178,"Study the entrance map. Inside, coded letters and landmark colors are your friends."]
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
