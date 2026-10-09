const slug=value=>String(value).toLowerCase().replace(/&/g,"and").replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");

export const UPGRADE_CATEGORIES=[
  ["recommended","Recommended","✨"],["districts","Districts","🏘️"],["company-buildings","Company Buildings","🏗️"],
  ["office","Office","🏡"],["orchard","Orchard","🌳"],["production","Production","🥤"],["workers","Workers","🧑‍🌾"],
  ["delivery","Delivery","📦"],["vehicles","Vehicles","🚚"],["fruit-laboratories","Fruit Laboratories","🔬"],
  ["sewer","Sewer","🕳️"],["mountain","Mountain","🏔️"],["entertainment","Entertainment","🎟️"],
  ["secrets","Secrets","🔐"],["seasonal-bonuses","Seasonal Bonuses","🌟"],["completed","Completed","✅"]
].map(([id,name,icon])=>({id,name,icon}));

const orchardGroups={
  "Tree Care":["Better Watering","Stronger Fertilizer","Disease Treatment","Golden-Tree Care","Automatic Watering","Automatic Treatment"],
  Harvesting:["Larger Baskets","Better Picking Tools","Harvest Cart","Automatic Pickers","Quality Inspection","Premium Packing"],
  Irrigation:["Watering Cans","Irrigation Channels","Sprinklers","Rainbow Sprinklers","Water Tower","Weather-Control Irrigation"],
  Seeds:["Common Seeds","Rare Seed Shed","Hybrid Seed Storage","Mutant Sewer Seeds","Mountain Seeds","Cosmic Seeds"]
};
const orchardEffects={
  "Tree Care":["Watering lasts longer","Fertilizer adds yield","Treat disease more cheaply","Golden trees give better rewards","Trees water automatically","Disease is treated automatically"],
  Harvesting:["Fruit basket capacity +4","5% chance of +1 manual fruit","Growth time -5%","Workers pick one ripe tree every 5 seconds","Fruit quality chance +4%","Fruit sale value +5%"],
  Irrigation:["Growth time -3%","Growth time -4%","Growth time -5%","Rare-tree chance +2%","Watering acceleration +10%","Bad-weather growth penalty protection"],
  Seeds:["Fruit unlock progress +1 level","Rare-fruit unlock progress +1 level","Two additional active hybrid experiments","Mutant sewer crops grow 20% faster","Mountain fruit growth +5%","Hybrid success chance +10%"]
};
export const ORCHARD_UPGRADES=Object.entries(orchardGroups).flatMap(([group,names],groupIndex)=>names.map((name,index)=>({
  id:slug(name),name,group,icon:["💧","🧺","🌈","🌱"][groupIndex],description:`${name} improves renewable orchard operations without replacing manual care.`,
  maxLevel:index<3?3:1,cashCost:40+groupIndex*90+index*55,coinCost:index===5?2:0,unlockLevel:Math.min(18,1+groupIndex*2+index),
  previous:index?slug(names[index-1]):null,effect:orchardEffects[group][index],region:"apple-grove-hills"
})));

export const WORKER_TRAINING=["Customer Service Basics","Advanced Fruit Picking","Orchard Safety","Smoothie Training","Delivery Driving","Drone Certification","Laboratory Safety","Fruit Genetics","Management Training","Conflict Resolution","Sales and Negotiation","Emergency First Aid","Equipment Maintenance","Mountain Safety","Sewer Safety"].map((name,index)=>({
  id:slug(name),name,icon:["🤝","🍎","🦺","🥤","🚐","🛸","🥽","🧬","📋","🕊️","💬","🩹","🔧","🏔️","🕳️"][index],
  cashCost:35+index*15,unlockLevel:1+Math.floor(index/2),effect:`Certification: ${name}`
}));

const sewerGroups={
  Access:["First Manhole Key","Delivery Depot Manhole","Market Alley Manhole","Juice Lab Drain","Fruit Mafia Exit","Emergency Return Bell"],
  "Sample Equipment":["Empty Bottle","Sample Jar","Reinforced Flask","Large Sample Tank","Water Scanner","Portable Purifier"],
  "Test Lab":["Restore Electricity","Repair Mixing Machine","Sample Storage","Water Purifier","Experiment Timer","Improved Result Chamber","Research Computer","Sewer Greenhouse","Automatic Sample Pump"],
  "Maze Equipment":["Chalk Markers","Improved Marker Kit","Valve Wrench","Maintenance Key","Emergency Return Token","Sewer Safety Boots","Green-Water Protection","Landmark Notebook"],
  "Maze Progress":["Red Pressure Emblem","Blue Water Emblem","Yellow Power Emblem","Green Root Emblem","Black-Pipe Center","Forgotten Fruit Laboratory","Underground Fruit Garden","Fruit Mafia Gate"],
  "Fruit Mafia":["Club Membership","Club Chip Wallet","Plinko Free Drop","Plinko Prize Upgrade","Fruit Slot Upgrade","Mafia Card Collection","Private Game Room Access"]
};
export const SEWER_UPGRADES=Object.entries(sewerGroups).flatMap(([group,names],groupIndex)=>names.map((name,index)=>({
  id:slug(name),name,group,icon:["🕳️","🧪","⚗️","🧰","🛞","🍇"][groupIndex],description:`${name} advances ${group.toLowerCase()} in the persistent Fruitopia sewer.`,
  cashCost:[0,12,45,18,0,0][groupIndex]+index*10,coinCost:groupIndex===5&&index>1?1:0,unlockLevel:Math.min(18,1+groupIndex+Math.floor(index/2)),
  effect:groupIndex===4?"Persistent maze milestone":groupIndex===5?"Fruit Mafia club benefit":"Sewer exploration capability"
})));

const mountainGroups={
  "Land Access":["Mountain Survey","Construction Permit","Base Camp","Lower Mountain Road","Broken Bridge Repair","Rockslide Clearing","Washed-Out Turn Repair","Alpine Pass Permit","Snow-Line Permit","Summit Permit","Cosmic Summit Permit"],
  Utilities:["Mountain Electricity","Water Pipeline","Heating System","Drainage","Worker Transportation","Supply Warehouse","Mountain Delivery Access","Emergency Rescue Station"],
  Transportation:["Cable-Car Lower Station","Cable-Car Midstation","Frozen Valley Junction","Cloud Plateau Station","Summit Station","Mountain Train Tunnel","Mountain Elevator","Summit Teleporter"],
  "Construction Support":["Survey Station","Road Repair Depot","Bridge Workshop","Snowplow Garage","Mountain Worker Lodge","Construction Manager Office","Equipment Garage","Safety Inspection Office"],
  "Land Development":["Lower Mountain Plots","Alpine Plots","Frozen Plots","Laboratory Terraces","Volcano Ridge Plots","Cloud Plateau Plots","Summit Landmark Plot","Cosmic Plots"]
};
export const MOUNTAIN_UPGRADE_INDEX=Object.entries(mountainGroups).flatMap(([group,names],groupIndex)=>names.map((name,index)=>({
  id:slug(name),name,group,icon:["🗺️","🔌","🚠","🦺","🏗️"][groupIndex],description:`${name} is part of the saved mountain development network.`,
  unlockLevel:Math.min(18,10+groupIndex+Math.floor(index/3)),effect:groupIndex===4?"Unlocks visible fixed construction plots":groupIndex===2?"Unlocks mountain fast travel":"Advances mountain access"
})));

export const PHONE_FOLDERS=[
  ["company","Company",["messages","contacts","orders","workers","applicants","construction","upgrade-planner","investors"]],
  ["operations","Operations",["deliveries","shipping","production","fruit-market","company-bank","research","laboratories"]],
  ["world","World",["surface-map","mountain-map","sewer-journal","quests","achievements","secrets"]],
  ["entertainment","Entertainment",["arcade","fruit-mafia-club","high-scores","events"]],
  ["system","System",["settings","save","help"]]
].map(([id,name,apps])=>({id,name,apps}));

const appRows=[
  ["Messages","💬"],["Contacts","👥"],["Orders","🧾"],["Workers","🧑‍🌾"],["Applicants","📋"],["Construction","🏗️"],["Upgrade Planner","✨"],["Investors","📊"],
  ["Deliveries","🚚"],["Shipping","⚓"],["Production","🥤"],["Fruit Market","📈"],["Company Bank","🏦"],["Research","🧬"],["Laboratories","🔬"],
  ["Surface Map","🗺️"],["Mountain Map","🏔️"],["Sewer Journal","🕳️"],["Quests","📌"],["Achievements","🏆"],["Secrets","🔐"],
  ["Arcade","🎮"],["Fruit Mafia Club","🍇"],["High Scores","🥇"],["Events","🎉"],["Settings","⚙️"],["Save","💾"],["Help","❓"]
];
export const PHONE_APPS_EXPANDED=appRows.map(([name,icon])=>({id:slug(name),name,icon,folder:PHONE_FOLDERS.find(folder=>folder.apps.includes(slug(name)))?.id||"system"}));

export const PHONE_THEMES=[
  ["Orchard Green","#315d38","#9bd45e"],["Lemon Yellow","#685514","#ffd84f"],["Berry Purple","#50315f","#ba76d0"],["Tropical Blue","#155c6d","#55cfe5"],["Frozen Crystal","#315d78","#b7edff"],
  ["Festival Rainbow","#713f67","#ff7f6b"],["Sewer Green","#233f35","#79d56d"],["Fruit Mafia Black and Gold","#231d28","#d6b24b"],["Mountain Snow","#48616c","#e8f5f3"],["Cosmic Space","#231d56","#9d78e8"]
].map(([name,base,accent])=>({id:slug(name),name,base,accent}));

export const PHONE_NOTIFICATION_TYPES=[
  ["message","New message","messages",2],["order","New customer order","orders",2],["payment","Payment ready","messages",3],["application","New job application","applicants",2],
  ["interview","Interview beginning","applicants",3],["worker-meeting","Worker wants a meeting","workers",3],["raise","Worker requests a raise","workers",3],["training","Worker training complete","workers",2],
  ["delivery","Delivery returned","deliveries",3],["subscriber","Subscriber gained","deliveries",1],["production","Product batch complete","production",3],["research","Research complete","research",3],
  ["lab","Lab study available","laboratories",1],["construction","Building construction complete","construction",3],["mountain-plot","Mountain plot unlocked","construction",2],
  ["sewer-sample","Sewer sample respawned","sewer-journal",1],["maze-clue","Maze clue discovered","sewer-journal",2],["mafia-reward","Fruit Mafia reward ready","fruit-mafia-club",2],
  ["quest","Quest completed","quests",2],["achievement","Achievement unlocked","achievements",2],["event","Event started","events",2],
  ["investor","Investor update","investors",2],["investor-meeting","Investor meeting ready","investors",3]
].map(([id,name,app,priority])=>({id,name,app,priority}));
