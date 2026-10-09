import {EXPANSION_MINIGAMES} from "./world-expansion-config.js";

export const SAVE_VERSION = 16;
export const SAVE_KEY = `fruitopia-tycoon-v${SAVE_VERSION}`;
export const LEGACY_SAVE_KEYS = ["fruitopia-tycoon-v15", "fruitopia-tycoon-v14", "fruitopia-tycoon-v13", "fruitopia-tycoon-v12", "fruitopia-tycoon-v11", "fruitopia-tycoon-v10", "fruitopia-tycoon-v9", "fruitopia-tycoon-v8", "fruitopia-tycoon-v7", "fruitopia-tycoon-v6", "fruitopia-tycoon-v5", "fruitopia-tycoon"];

export * from "./sewer-config.js";
export * from "./mafia-config.js";
export * from "./outside-config.js";
export * from "./world-expansion-config.js";
export * from "./upgrade-config.js";
export * from "./color-config.js";
export * from "./investor-config.js";

export const slug = value => String(value).toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const fruitRows = [
  ["Apple","🍎",2,1,30,"Common","Apple Grove Orchard"],
  ["Lemon","🍋",4,2,42,"Common","Sunny Side Fruit Stand"],
  ["Banana","🍌",6,3,48,"Common","Market Square"],
  ["Orange","🍊",7,3,50,"Common","Market Square"],
  ["Strawberry","🍓",9,4,55,"Uncommon","Market Square"],
  ["Blueberry","🫐",11,5,60,"Uncommon","Juice Lab"],
  ["Watermelon","🍉",14,6,75,"Uncommon","Juice Lab"],
  ["Pineapple","🍍",17,8,85,"Rare","Tropical Island"],
  ["Mango","🥭",19,8,90,"Rare","Tropical Island"],
  ["Kiwi","🥝",15,7,72,"Uncommon","Juice Lab"],
  ["Peach","🍑",16,7,78,"Uncommon","Market Square"],
  ["Coconut","🥥",21,9,95,"Rare","Tropical Island"],
  ["Dragon Fruit","🐉",28,11,110,"Epic","Tropical Island"],
  ["Starfruit","⭐",32,12,120,"Epic","Frozen Fruit Valley"],
  ["Frozen Berries","🧊",35,11,115,"Epic","Frozen Fruit Valley"],
  ["Golden Apple","🌟",55,14,150,"Legendary","Grand Fruit Festival"],
  ["Rainbow Fruit","🌈",70,15,170,"Legendary","Grand Fruit Festival"],
  ["Moon Melon","🌙",90,15,180,"Hybrid","Research"],
  ["Crystal Cherry","💎",95,15,180,"Hybrid","Research"],
  ["Fire Mango","🔥",105,15,190,"Hybrid","Research"],
  ["Galaxy Grape","🌌",115,16,200,"Cosmic","Research"],
  ["Candy Apple","🍭",100,15,185,"Hybrid","Research"],
  ["Ice Pineapple","❄️",110,16,195,"Hybrid","Research"],
  ["Golden Banana","✨",125,16,210,"Legendary","Research"],
  ["Rainbow Peach","🎨",130,17,220,"Legendary","Research"],
  ["Cloudberry","☁️",140,17,225,"Cosmic","Research"],
  ["Dragon Berry","🐲",150,17,235,"Cosmic","Research"],
  ["Electric Lime","⚡",165,18,245,"Cosmic","Research"]
];
export const FRUITS = fruitRows.map(([name,icon,value,level,growth,rarity,source]) => ({
  id:slug(name), name, icon, baseValue:value, unlockLevel:level, growthSeconds:growth, rarity, source,
  demand:Math.min(5,1 + Math.floor(value / 30)), qualityNames:["Everyday","Fresh","Premium","Prize","Golden"], research:`Study ${name} quality, flavor, yield, and resilience.`
}));
export const FRUIT_BY_ID = Object.fromEntries(FRUITS.map(fruit => [fruit.id, fruit]));

const recipeRows = [
  ["Orchard Crate",{"apple":3},8],["Sunshine Juice",{"apple":2,"orange":1},20],
  ["Banana Berry Smoothie",{"banana":2,"strawberry":1},30],["Blueberry Breakfast Bowl",{"blueberry":2,"banana":1},34],
  ["Melon Kiwi Cooler",{"watermelon":1,"kiwi":2},42],["Peach Preserve",{"peach":2,"apple":1},40],
  ["Tropical Gift Basket",{"pineapple":1,"mango":1,"coconut":1},82],["Coconut Cream Cup",{"coconut":1,"banana":2},48],
  ["Dragon Punch",{"dragon-fruit":1,"orange":2},68],["Star Sparkle",{"starfruit":1,"kiwi":2},76],
  ["Frosted Berry Bowl",{"frozen-berries":1,"blueberry":2},84],["Golden Orchard Pie",{"golden-apple":1,"peach":2},125],
  ["Rainbow Fruit Feast",{"rainbow-fruit":1,"dragon-fruit":1,"starfruit":1},240],["Sparkling Lemonade",{"lemon":3},18],
  ["Jewel Fruit Candy",{"strawberry":1,"lemon":1,"apple":1},28],["Berry Cloud Ice Cream",{"blueberry":1,"strawberry":1,"banana":1},42],
  ["Sunny Dried Fruit",{"apple":1,"banana":1,"orange":1},35],["Chocolate Fruit Box",{"strawberry":1,"banana":1,"coconut":1},58],
  ["Rainbow Fruit Pizza",{"peach":1,"kiwi":1,"pineapple":1,"strawberry":1},88],["Moon Melon Tart",{"moon-melon":1,"starfruit":1},165],
  ["Electric Lime Candy",{"electric-lime":1,"candy-apple":1},220]
];
const productIcons = ["📦","🧃","🥤","🥣","🍹","🫙","🎁","🍨","🥊","✨","🧊","🥧","🌈","🍋","🍬","🍦","☀️","🍫","🍕","🥧","⚡"];
export const RECIPES = recipeRows.map(([name,ingredients,value],index)=>({id:slug(name),name,ingredients,value,icon:productIcons[index],unlockLevel:Math.min(18,1+index),seconds:8+index*2}));
export const RECIPE_BY_ID = Object.fromEntries(RECIPES.map(recipe=>[recipe.id,recipe]));

export const HYBRIDS = [
  ["watermelon","starfruit","moon-melon"],["blueberry","peach","crystal-cherry"],["mango","dragon-fruit","fire-mango"],
  ["blueberry","starfruit","galaxy-grape"],["apple","strawberry","candy-apple"],["pineapple","frozen-berries","ice-pineapple"],
  ["banana","golden-apple","golden-banana"],["peach","rainbow-fruit","rainbow-peach"],["frozen-berries","starfruit","cloudberry"],
  ["dragon-fruit","blueberry","dragon-berry"],["lemon","starfruit","electric-lime"]
].map(([a,b,result])=>({id:`${a}+${b}`,parents:[a,b],result,fruitCost:2,researchCost:8,seconds:45}));

const districtRows = [
  ["Sunny Side Fruit Stand","🍎",1,null,["Better Sign","Striped Awning","Display Baskets","Larger Counter","Price Board","Cash Register","Friendly Cashier","Loyalty Club"],"The Big Ask","sale prices, tips, customers, and passive stand income"],
  ["Apple Grove Orchard","🌳",1,null,["Copper Watering Cans","Rich Compost","Busy Bee Hives","Stacked Crates","Rare Seed Shed","Rainbow Sprinklers","Picker Cottage","Glass Greenhouse"],"Basket Blitz","growth speed, harvest yield, storage, automation, and fruit quality"],
  ["Delivery Depot","🚚",2,null,["Loading Ramp","Crate Shelves","Route Radio","Covered Garage","Dispatch Map Desk","Cold Storage Bay","Mechanic Workshop","Dispatch Tower"],"Delivery Sort","delivery speed, payments, tips, storage, and vehicle support"],
  ["Market Square","🏪",4,{district:"delivery-depot",completion:50},["Canvas Stalls","Fruit Fountain","Market Lanterns","Pie Bakery","Jam & Preserve Shop","Busker Stage","Shopping Arcade","Golden Market Clock"],"Market Rush","recipes, sales, combinations, tips, and visitors"],
  ["Juice Lab","🧃",6,{district:"market-square",completion:50},["Citrus Press","Turbo Blender","Tasting Counter","Glass Chiller","Bottle Line","Flavor Scanner","Juice Maker Station","Rainbow Flavor Reactor"],"Perfect Blend","crafting speed, product value, storage, automation, and research"],
  ["Tropical Island","🏝️",8,{district:"juice-lab",completion:50},["Bamboo Dock","Coconut Palms","Mango Grove","Fruit Tiki Bar","Rope Bridges","Reef Market","Worker Villas","Sunfruit Temple"],"Coconut Splash","tropical fruit, boat routes, harvests, workers, and passive income"],
  ["Frozen Fruit Valley","🏔️",11,{district:"tropical-island",completion:50},["Snow Boots","Berry Tunnels","Fruit Sleigh","Flash Freezer","Cocoa Cabin","Crate Ski Lift","Cold Research Dome","Crystal Fruit Palace"],"Berry Slide","frozen fruit, deliveries, storage, research, and rare fruit"],
  ["Grand Fruit Festival","🎪",15,{district:"frozen-fruit-valley",completion:75},["Festival Gate","Carnival Games","Fruit Parade","Festival Kitchen","Orchard Sky Wheel","Golden Arena","Festival Crew Hall","Rainbow Fruit Crown"],"Golden Fruit Frenzy","tickets, crowds, crafting, championships, automation, and endgame progress"]
];
export const DISTRICTS = districtRows.map(([name,icon,level,requirement,upgrades,minigame,summary],index)=>({id:slug(name),name,icon,unlockLevel:level,requirement,upgrades,minigame:slug(minigame),summary,index,x:[92,118,184,226,294,424,126,215][index],y:[246,207,260,211,190,311,49,158][index]}));
export const DISTRICT_BY_ID = Object.fromEntries(DISTRICTS.map(district=>[district.id,district]));

const buildingCategories = {
  "Starter Buildings":["Roadside Fruit Stand","Orchard Shed","Tiny Office","Fruit Coin Booth","Delivery Garage","Farmers Market"],
  "Food Production":["Juice Bar","Smoothie Shop","Jam Kitchen","Fruit Bakery","Candy Factory","Ice-Cream Parlor","Fruit-Drying House","Gift-Basket Workshop","Chocolate-Dipping Shop","Fruit Pizza Restaurant"],
  "Farming":["Seed Store","Greenhouse","Bee Garden","Water Tower","Compost Center","Tree Nursery","Weather Station","Rainbow Greenhouse","Underground Mushroom Farm","Golden Orchard Temple"],
  "Workers":["Hiring Center","Training Academy","Break Room","Worker Apartments","Management Office","Mechanic Workshop","Medical Clinic","Employee Clubhouse","Uniform Shop","Worker Awards Hall"],
  "Business":["Company Headquarters","Fruit Bank","Customer Call Center","Marketing Studio","Accounting Office","Research Laboratory","Contract Center","Fruit Exchange","Investor Lounge","Conference Center"],
  "Fruit Labs":["Apple Genetics Lab","Citrus Chemistry Lab","Berry Nutrition Lab","Tropical Botany Lab","Melon Hydration Lab","Seed Genome Center","Ripening Science Lab","Flavor Chemistry Wing","Cryo-Fruit Laboratory","Cosmic Botany Observatory"],
  "Delivery Service":["Neighborhood Courier Office","Branded Crate Workshop","Customer Ordering Hotline","Subscription Box Center","Cold-Chain Service Hub","Express Dispatch Center","Restaurant Service Desk","Regional Distribution Hub","Fleet Operations Center","National Fresh Network"],
  "Transportation":["Cargo-Bike Garage","Refrigerated Warehouse","Packing Factory","Train Station","Fruit Harbor","Airport Hangar","Boat Dock","Teleport Station","Drone Center","Rocket Launchpad"],
  "Entertainment":["Fruit Museum","Watermelon Water Park","Fruit Carnival","Banana Jungle Tour","Fruit Aquarium","Apple Maze","Smoothie Cinema","Fruit Stadium","Mascot Theater","Grand Festival Grounds"],
  "Secret":["Abandoned Juice Factory","Hidden Office Basement","Underground Fruit Vault","Mysterious Radio Tower","Secret Island Laboratory","Ancient Orchard Ruins","Sewer Greenhouse","Time Greenhouse","Alien Trading Post","Portal Building"],
  "Late Game":["Robot Factory","Fruit Corporation Tower","Weather-Control Center","Golden Bank","Floating Orchard","Underwater Farm","Volcano Greenhouse","Moon Orchard","Cosmic Fruit Station","Fruitopia Palace"]
};
const buildingIcons={"Starter Buildings":"🏠","Food Production":"🥤","Farming":"🌱","Workers":"🧑‍🌾","Business":"💼","Fruit Labs":"🔬","Delivery Service":"📦","Transportation":"🚚","Entertainment":"🎟️","Secret":"🔐","Late Game":"🚀"};
const buildingEffects={"Starter Buildings":"passiveIncome","Food Production":"productValue","Farming":"growthSpeed","Workers":"workerSpeed","Business":"reputation","Fruit Labs":"research","Delivery Service":"deliveryPay","Transportation":"deliverySpeed","Entertainment":"tickets","Secret":"fruitCoinChance","Late Game":"globalBonus"};
let buildingIndex=0;
export const BUILDINGS = Object.entries(buildingCategories).flatMap(([category,names],categoryIndex)=>names.map((name,index)=>{
  buildingIndex++;
  const late=categoryIndex>=9, level=Math.min(18,Math.max(1,categoryIndex*2+Math.floor(index/3)));
  return {id:slug(name),name,category,icon:buildingIcons[category],description:`A working ${name.toLowerCase()} that improves ${buildingEffects[category].replace(/([A-Z])/g," $1").toLowerCase()}.`,cashCost:Math.round((150+buildingIndex*175)*(late?1.8:1)),coinCost:late?5+index*2:(index>=7?Math.max(0,categoryIndex-2):0),unlockLevel:level,district:DISTRICTS[Math.min(7,Math.floor((buildingIndex-1)/14))].id,effect:{type:buildingEffects[category],value:1+categoryIndex*.3+index*.12},maxLevel:3,visualStates:["Construction site","Open for business","Expanded operation","Fruitopia landmark"]};
}));
export const BUILDING_BY_ID=Object.fromEntries(BUILDINGS.map(building=>[building.id,building]));

export const PRODUCTION_LINES = [
  ["Juice Bar","Sunshine Juice"],["Smoothie Shop","Banana Berry Smoothie"],["Jam Kitchen","Peach Preserve"],["Fruit Bakery","Golden Orchard Pie"],["Candy Factory","Jewel Fruit Candy"],
  ["Ice-Cream Parlor","Berry Cloud Ice Cream"],["Fruit-Drying House","Sunny Dried Fruit"],["Gift-Basket Workshop","Tropical Gift Basket"],["Chocolate-Dipping Shop","Chocolate Fruit Box"],["Fruit Pizza Restaurant","Rainbow Fruit Pizza"]
].map(([building,recipe])=>({id:slug(building),building:slug(building),name:building,recipe:slug(recipe)}));

export const LABS = [
  ["Apple Genetics Lab",["apple","golden-apple","candy-apple"]],["Citrus Chemistry Lab",["lemon","orange","electric-lime"]],
  ["Berry Nutrition Lab",["strawberry","blueberry","frozen-berries","cloudberry","dragon-berry"]],["Tropical Botany Lab",["pineapple","mango","coconut","dragon-fruit"]],
  ["Melon Hydration Lab",["watermelon","moon-melon"]],["Seed Genome Center",["apple","peach","starfruit"]],
  ["Ripening Science Lab",["banana","kiwi","peach"]],["Flavor Chemistry Wing",["strawberry","mango","rainbow-fruit"]],
  ["Cryo-Fruit Laboratory",["frozen-berries","ice-pineapple","cloudberry"]],["Cosmic Botany Observatory",["moon-melon","galaxy-grape","electric-lime","dragon-berry"]]
].map(([name,specialties])=>({id:slug(name),name,specialties,cashCost:250,researchCost:10}));

const vehicleRows=[
  ["Bicycle","🚲",25,0,1,1],["Cargo Bicycle","🚴",100,0,1,2],["Scooter","🛵",400,0,2,3],["Delivery Van","🚐",1500,0,3,4],
  ["Delivery Drone","🛸",3500,5,5,5],["Refrigerated Truck","🚛",7000,5,7,6],["Fruit Train","🚂",14000,8,9,7],["Fruit Boat","⛵",12000,7,8,7],
  ["Cargo Boat","🚢",22000,10,10,8],["Fruit Plane","✈️",45000,15,12,9],["Fruit Helicopter","🚁",60000,18,14,10],["Fruit Rocket","🚀",150000,30,17,12]
];
export const VEHICLES=vehicleRows.map(([name,icon,cashCost,coinCost,unlockLevel,capability])=>({id:slug(name),name,icon,cashCost,coinCost,unlockLevel,capability,speed:.8+capability*.18}));
export const VEHICLE_BY_ID=Object.fromEntries(VEHICLES.map(vehicle=>[vehicle.id,vehicle]));
const routeRows=[
  ["Cottage Lane","bicycle",{"apple":3},{},1,22,16,false],["Neighborhood Fruit Box","cargo-bicycle",{"apple":2,"lemon":2},{"orchard-crate":1},1,55,28,true],
  ["Sunbeam School","cargo-bicycle",{"apple":3,"banana":2},{},1,65,30,false],["Lemonade Office Drop","scooter",{"lemon":3},{"sparkling-lemonade":1},2,95,45,false],
  ["Market Café","scooter",{"orange":2,"strawberry":2},{},2,110,48,false],["Smoothie Subscription Club","delivery-van",{"banana":2,"strawberry":2},{"banana-berry-smoothie":1},3,180,75,true],
  ["Juice Bar Row","delivery-van",{"blueberry":2,"watermelon":1,"kiwi":2},{},3,220,90,false],["Innovation Campus","delivery-drone",{"lemon":2,"kiwi":2,"strawberry":2},{},3,270,100,false],
  ["Restaurant Dessert Express","refrigerated-truck",{"frozen-berries":2},{"berry-cloud-ice-cream":1},4,390,125,false],["Snowcap Lodge","refrigerated-truck",{"frozen-berries":3,"peach":2},{},4,420,130,false],
  ["Cross-Valley Grocers","fruit-train",{"apple":5,"orange":4,"watermelon":2},{},4,650,180,false],["Island Resort","fruit-boat",{"pineapple":3,"mango":3,"coconut":2},{},4,720,200,false],
  ["Executive Gift Service","cargo-boat",{"pineapple":2,"mango":2},{"tropical-gift-basket":2},5,980,260,true],["Grand Harbor Export","cargo-boat",{"pineapple":4,"coconut":4,"mango":4},{},5,1050,280,false],
  ["Continental Air Market","fruit-plane",{"dragon-fruit":3,"starfruit":3,"rainbow-fruit":1},{},5,1600,360,false],["Cloudtop Gala","fruit-helicopter",{"starfruit":3,"dragon-fruit":2,"golden-apple":2},{},5,1900,400,false],
  ["Cosmic Research Courier","fruit-rocket",{"moon-melon":2,"galaxy-grape":2,"electric-lime":2},{"electric-lime-candy":1},6,4200,800,false],["Moon Orchard Station","fruit-rocket",{"moon-melon":3,"galaxy-grape":3,"electric-lime":3},{},6,5000,900,false]
];
export const ROUTES=routeRows.map(([name,vehicle,fruit,products,tier,payment,xp,subscription],index)=>({id:slug(name),name,vehicle,fruit,products,tier,payment,xp,subscription,seconds:20+index*4,tipChance:.12+index*.01}));
export const DELIVERY_TIERS=["Farm Stand Runs","Neighborhood Courier","Town Delivery Service","Regional Fresh Fleet","Premium Cold Chain","National Fruit Network","Fruitopia Express"];

const workerRows=[
  ["Pip Orchard","Fruit Picker","Optimistic and observant","Apple","Quick Harvest","Gets distracted by ladybugs","Bumper Crop","🧑‍🌾"],
  ["Mina Till","Cashier","Quick-witted and friendly","Strawberry","Customer charm","Hates messy shelves","Golden Greeting","👩‍💼"],
  ["Dash Clementine","Delivery Driver","Calm under pressure","Orange","Route timing","Too cautious","Express Return","🧑‍✈️"],
  ["Juniper Zest","Juice Maker","Inventive and excitable","Lemon","Flavor invention","Overcomplicates recipes","Perfect Blend","👩‍🍳"],
  ["Bea Crumble","Baker","Patient and practical","Peach","Batch quality","Slow starter","Warm Oven","🧑‍🍳"],
  ["Rivet Berry","Mechanic","Direct and dependable","Blueberry","Repairs","Blunt feedback","Instant Tune-Up","🧑‍🔧"],
  ["Dr. Lyra Lime","Scientist","Curious and mysterious","Electric Lime","Research","Secretive notes","Eureka","👩‍🔬"],
  ["Cal Ledger","Accountant","Cautious and dryly funny","Apple","Forecasting","Risk averse","Balanced Books","🧑‍💼"],
  ["Sunny Peel","Marketing Manager","Bold and sociable","Banana","Campaigns","Overpromises","Fruit Rush","👩‍🎤"],
  ["Tess Pomelo","Office Assistant","Organized and kind","Dragon Fruit","Scheduling","Avoids conflict","Clear Calendar","👩‍💻"],
  ["Marco Melon","Market Seller","Charming and competitive","Watermelon","Sales","Turns everything into a contest","Closing Pitch","🧔"],
  ["Faye Firework","Festival Manager","Energetic and theatrical","Rainbow Fruit","Events","Exhausts the crew","Grand Finale","👩‍🎨"],
  ["Bruno Bramble","Security Worker","Quiet and loyal","Blackberry","Patrols","Rarely explains himself","Crate Finder","🧑‍🚒"],
  ["Avery Appleby","District Manager","Strategic and diplomatic","Golden Apple","Leadership","Perfectionist","District Focus","🧑‍💼"]
];
export const WORKERS=workerRows.map(([name,role,personality,favoriteFruit,strength,weakness,specialAbility,avatar],index)=>({id:slug(name),name,role,personality,favoriteFruit,strength,weakness,specialAbility,avatar,rank:index<4?"Common":index<9?"Skilled":index<13?"Expert":"Legendary",expectedSalary:8+index*3,preferredSchedule:index%3===0?"Morning":index%3===1?"Flexible":"Evening",experience:1+Math.floor(index/2),education:index>5?"Fruitopia vocational certificate":"Hands-on local experience",reference:`Reference ${index+1}: reliable and eager to improve.`,personalStatement:`I want to help Fruitopia grow through ${strength.toLowerCase()}.` }));
export const WORKER_BY_ID=Object.fromEntries(WORKERS.map(worker=>[worker.id,worker]));

export const JOB_ROLES=["Fruit Picker","Tree Caretaker","Irrigation Worker","Orchard Supervisor","Seed Specialist","Pest-Control Specialist","Harvest Manager","Cashier","Salesperson","Stock Clerk","Customer Service Worker","Stand Manager","Market Seller","Juice Maker","Smoothie Maker","Baker","Candy Maker","Ice-Cream Maker","Quality Inspector","Production Supervisor","Bicycle Courier","Van Driver","Delivery Dispatcher","Route Planner","Vehicle Mechanic","Subscription Manager","Fleet Supervisor","Drone Operator","Cold-Chain Specialist","Lab Assistant","Fruit Researcher","Genetics Scientist","Flavor Chemist","Nutrition Researcher","Laboratory Safety Officer","Head Scientist","Receptionist","Accountant","Human Resources Worker","Marketing Worker","Phone Support Worker","Business Manager","Operations Manager","Personal Assistant","Festival Worker","Tour Guide","Minigame Host","Mascot Performer","Museum Guide","Event Manager","Surveyor","Road Worker","Bridge Builder","Electrician","Plumber","Cable-Car Engineer","Snowplow Driver","Mountain Mechanic","Construction Manager","Safety Inspector"];

const officeGroups={
  Communication:["Basic Desk Phone","Fruitopia Smartphone","Group Messages","Customer Database","Custom Counteroffers","Priority Notifications","Remote Management"],
  Finance:["Office Cash Register","Company Safe","Accountant Desk","Automatic Invoices","Investment Dashboard","Profit Forecasting","Golden Ledger"],
  Workers:["Hiring Board","Break Area","Training Room","Employee Benefits","Worker Transportation","Manager Offices","Employee Board"],
  Technology:["Office Computer","Faster Computer","Business Server","Fruit Analytics","Automated Scheduling","Orchard Intelligence Assistant","Research Board"],
  Marketing:["Hand-Painted Posters","Radio Advertisements","Fruit Friends Campaign","Television Advertisement","Champion Fruit Sponsorship","Global Brand Campaign"],
  Office:["Better Desk","Comfortable Chair","Filing Cabinet","Fruitopia Wall Map","Meeting Table","Trophy Cabinet","Second Office Floor","Conference Room","Executive Office","Command Center Floor"]
};
let officeIndex=0;
export const OFFICE_UPGRADES=Object.entries(officeGroups).flatMap(([category,names])=>names.map(name=>{officeIndex++;return{id:slug(name),name,category,cashCost:100+officeIndex*90,coinCost:officeIndex>30?2:0,level:Math.min(18,1+Math.floor(officeIndex/3)),description:`Adds ${name.toLowerCase()} to the walkable office and unlocks useful ${category.toLowerCase()} options.`};}));
export const OFFICE_OBJECTS=["Player Desk","Chair","Filing Cabinet","Wall Map","Meeting Table","Employee Board","Trophy Cabinet","Company Safe","Phone Charger","Computer","Accountant Desk","Assistant Desk","Research Board","Break Area","Conference Room","Executive Office","Elevator"].map((name,index)=>({id:slug(name),name,icon:["🪑","🪑","🗄️","🗺️","🪵","📋","🏆","🔐","🔌","💻","🧮","📝","🔬","☕","🤝","👑","🛗"][index]}));
export const OFFICE_LEVELS=["Wooden Shed Office","Small Business Office","Modern Fruit Headquarters","Fruit Corporation Tower","Fruitopia Command Center"];

// Kept as the original 13-app compatibility list. The expanded device uses
// PHONE_APPS_EXPANDED, and both lists route into the same game systems.
export const PHONE_APPS=["Messages","Contacts","Orders","Workers","Delivery Tracker","Fruit Market","Company Bank","Quests","Achievements","Research","World Map","Settings","Secrets"].map((name,index)=>({id:slug(name),name,icon:["💬","👥","🧾","🧑‍🌾","🚚","📈","🏦","📌","🏆","🔬","🗺️","⚙️","🔐"][index]}));
export const CONTACTS=["Mayor Marigold","Chef Sorrel","Nora North","Ivy Venture","Festival Committee","Professor Pome","Rowan Rind","Unknown Orchard"];
export const COMPANY_FUNDS=["Orchard Equipment Fund","Market Expansion Fund","Fruit Research Fund"].map((name,index)=>({id:slug(name),name,rate:[.05,.08,.12][index],seconds:[60,90,120][index]}));

const minigameRows=[
  ["The Big Ask","Sunny Side Fruit Stand","Read each customer and choose a friendly, fair, bold, or custom price.","💬",45,1,"district",0,"Price each request before patience runs out.","Complete five fair sales"],
  ["Basket Blitz","Apple Grove Orchard","Move the basket, catch ripe fruit, and avoid rocks, bugs, rotten fruit, and disease clouds.","🧺",35,1,"district",0,"Move beneath fruit; icons and shapes identify every hazard.","Catch 20 fruit"],
  ["Delivery Sort","Delivery Depot","Sort fruit crates into labeled Orchard, Beach, Market, Mountain, and Cosmic route bins.","📦",40,2,"district",1,"Match the fruit icon to a named route bin.","Sort ten crates without a mistake"],
  ["Market Rush","Market Square","Select each shopping-list fruit or crafted product in the exact displayed order.","🛒",40,4,"district",2,"Read left to right; a wrong item resets the order.","Complete three orders"],
  ["Perfect Blend","Juice Lab","Watch, remember, and reproduce an expanding laboratory fruit sequence.","🧃",45,6,"district",3,"Wait through WATCH and REMEMBER, then select during BLEND.","Reach a sequence of six"],
  ["Coconut Splash","Tropical Island","Catch tropical fruit along the beach while dodging coconuts, crabs, waves, driftwood, and seaweed.","🥥",38,8,"district",4,"Move the beach basket; hazard icons reset the streak.","Dodge five hazards"],
  ["Berry Slide","Frozen Fruit Valley","Guide each sliding berry into a basket with the same icon, pattern, and shape.","🫐",42,11,"district",5,"Match icons rather than relying on lane color.","Match ten berries"],
  ["Watermelon Bowling","Watermelon Water Park","Stop the aim marker in the labeled sweet spot and knock down fruit pins.","🍉",42,6,"attraction",6,"Click, tap, Space, or gamepad A to roll.","Score a strike"],
  ["Fruit Auction","Fruit Exchange","Buy valuable fictional fruit lots below estimate and pass overpriced lots.","🔨",46,8,"attraction",7,"Inspect value, rival interest, and the score-only current bid.","Make three profitable purchases"],
  ["Monkey Trouble","Banana Jungle Tour","Catch banana-stealing monkeys before they escape from the grove.","🐒",40,9,"attraction",8,"Tap each distinct monkey icon before its escape timer ends.","Stop ten monkeys"],
  ["Golden Fruit Frenzy","Grand Fruit Festival","Catch requested festival fruit, avoid icon-marked hazards, and build a championship combo.","🏆",50,15,"district",9,"Follow the written CATCH callout for the largest bonus.","Catch five callout fruit"],
  ["Pipe Pressure","Red Pipe Quarter","Turn linked valves until every labeled gauge rests inside its SAFE zone.","🔴",45,7,"sewer",3,"Each valve changes two gauges; stabilize all three together.","Stabilize all pressure gauges"],
  ["Green-Water Mix","Sewer Test Laboratory","Choose a sample and fruit, then control heat and pressure for a stable experiment.","🧪",45,8,"sewer",4,"Ingredients are simulated here; story experiments use the real inventory machine.","Create a stable sewer experiment"],
  ["Canal Cleanup","Blue Canal Quarter","Sort floating samples and rubbish while avoiding contaminated objects.","🛶",40,8,"sewer",4,"Use written SAMPLE, RUBBISH, and CONTAMINATED labels.","Clean ten canal objects"],
  ["Construction Rush","Mountain Base Camp","Match timber, metal, glass, and pipes to the correct construction project.","🏗️",42,12,"mountain",5,"Minigame materials are practice cargo and never consume inventory.","Match every construction material"],
  ["Cable-Car Cargo","Mountain Cable-Car Station","Balance heavy cargo across a moving cable car while wind shifts the load.","🚠",45,13,"mountain",6,"Move crates left or right and keep the balance meter in SAFE.","Balance every cable-car crate"]
];
export const MINIGAMES=[...minigameRows.map(([name,location,description,icon,duration,unlockLevel,category,cost,instruction,quest])=>({id:slug(name),name,location,description,icon,duration,unlockLevel,category,cost,instructions:[instruction,"Build a streak, watch the timer, then collect the completed run reward exactly once."],quest,controls:["Keyboard","Mouse","Touch","Gamepad"],rewards:["Cash","Empire XP","Fruit Coins"],physicalTravel:false})),...EXPANSION_MINIGAMES];

export const EVENTS=["Fruit Rush","Double Harvest","Heavy Rain","Heat Wave","Golden Customer","Celebrity Visit","Giant Fruit","Fruit Coin Shower","Delivery Traffic","Machine Breakdown","Monkey Invasion","Market Festival","Rare Seed Merchant","Investor Visit","Surprise Inspection","Worker Birthday","Power Outage","Rainbow Weather","Meteor Fruit","Mysterious Phone Call"].map((name,index)=>({id:slug(name),name,icon:["📈","🍎","🌧️","☀️","🌟","📸","🍉","🪙","🚧","🔧","🐒","🎪","🌱","💼","📋","🎂","🔌","🌈","☄️","☎️"][index],duration:90,effect:index%5===0?"sale":index%5===1?"harvest":index%5===2?"growth":index%5===3?"delivery":"research"}));
export const SECRETS=["Hidden Office Basement","Underground Fruit Tunnels","The Locked Contact","Secret Island","The Wandering Golden Tree","The Orchard Investor","Forgotten Fruit Laboratory","Midnight Ghost Fruit","The Six-Peel Code","The Cosmic Signal","Secret Championship"].map((name,index)=>({id:slug(name),name,clue:`Clue ${index+1}: ${index%2?"a worker remembers an unusual route":"an old Fruitopia record mentions this mystery"}.`,cashCost:100+index*150,researchCost:2+index,unlock:`Secret reward ${index+1}`}));

export const MILESTONES=[
  ["First Pick","Harvest 1 fruit","harvested",1,2],["Fresh Paint","Buy 1 improvement","improvements",1,3],["On the Road","Complete 1 delivery","deliveries",1,4],["Full Baskets","Harvest 20 fruit","harvested",20,5],
  ["Recipe Regular","Craft 10 products","crafted",10,5],["Route Master","Complete 10 deliveries","deliveries",10,8],["Arcade Orchardist","Play 5 minigames","minigames",5,6],["Neighborhood Hero","Complete 15 orders","orders",15,10]
].map(([name,description,stat,target,reward])=>({id:slug(name),name,description,stat,target,reward}));
export const ACHIEVEMENTS=[
  ["Apple a Day","harvested",25,4],["Pocketful of Sunshine","fruitCoinsEarned",25,6],["Market Maven","sold",100,8],["Road Trip","deliveries",18,9],["Fruit Architect","buildings",25,10],["High Scorer","highScore",1000,12],["Fruitopia Tycoon","level",18,20]
].map(([name,stat,target,reward])=>({id:slug(name),name,stat,target,reward}));

export const GOLDEN_SEED_UPGRADES=[
  ["Evergreen Customers","salePrice",.05],["Heirloom Seeds","growthSpeed",.05],["Golden Luck","fruitCoinChance",.01],["Bottomless Baskets","storage",5],["Skilled Alumni","workerSpeed",.05],
  ["Seasoned Fleet","deliverySpeed",.05],["Moonlit Operations","offlineIncome",.08],["Trusted Brand","customerBudget",.05],["Tip Top Service","tipChance",.02]
].map(([name,effect,value])=>({id:slug(name),name,effect,value,description:`Permanent ${name.toLowerCase()} bonus.`}));
export const EVOLUTION_AGES=["Apple Age","Tropical Age","Frozen Age","Rainbow Age","Golden Age","Cosmic Fruit Age"];
export const LEVEL_TITLES=[[1,"Stand Starter"],[3,"Orchard Keeper"],[5,"Fruit Merchant"],[7,"Juice Innovator"],[9,"Island Grower"],[12,"Valley Magnate"],[15,"Fruitopia Tycoon"],[18,"Golden Legend"]];

export const DEFAULT_QUESTS=[
  {id:"harvest",name:"Harvest fruit",icon:"🍎",stat:"harvested",target:6,reward:{cash:12,xp:20}},
  {id:"earn",name:"Earn Cash",icon:"💵",stat:"cashEarned",target:25,reward:{coins:1,xp:20}},
  {id:"sell",name:"Sell items",icon:"🧺",stat:"sold",target:5,reward:{cash:15,xp:25}}
];

export const CUSTOMERS=["Ruby Radish","Ollie Oat","Penny Pear","Sam Sprout","Casey Corn","Lulu Lettuce"];
export const QUALITY_NAMES=["Everyday","Fresh","Premium","Prize","Golden"];
