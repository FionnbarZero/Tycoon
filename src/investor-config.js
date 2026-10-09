const slug=value=>String(value).toLowerCase().replace(/&/g,"and").replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");

export const CONSTRUCTION_STAGES=[
  {id:"empty-plot",name:"Empty Plot",icon:"🪧",description:"Preview, plot boundary, and purchase pad are visible."},
  {id:"site-preparation",name:"Site Preparation",icon:"🚧",description:"Workers clear the land, set survey flags, and deliver tools."},
  {id:"foundation",name:"Foundation",icon:"🧱",description:"The base, underground pipes, and utility connections are installed."},
  {id:"building-frame",name:"Building Frame",icon:"🏗️",description:"The frame rises with scaffolding and active construction workers."},
  {id:"exterior",name:"Exterior",icon:"🏠",description:"Walls, roof, windows, doors, and main colors are installed."},
  {id:"equipment",name:"Equipment & Landscaping",icon:"🛠️",description:"Machines, furniture, signs, paths, and landscaping appear."},
  {id:"open",name:"Open for Business",icon:"✨",description:"Lights turn on, workers enter, and income begins."}
];

export const CONSTRUCTION_TYPES={
  small:{id:"small",name:"Small upgrade",seconds:3,delivery:"Hand cart",celebration:"Sparkle"},
  medium:{id:"medium",name:"Medium building",seconds:10,delivery:"Delivery van",celebration:"Opening ribbon"},
  large:{id:"large",name:"Large building",seconds:24,delivery:"Truck or train",celebration:"Company opening"},
  landmark:{id:"landmark",name:"Landmark",seconds:35,delivery:"Regional freight convoy",celebration:"Fruitopia landmark celebration"}
};

export const INVESTOR_CENTER_STAGES=[
  {level:1,name:"Small Investor Desk",cost:350,seconds:5,effect:"Unlocks Ivy Venture, Pollen Penny, and income reports."},
  {level:2,name:"Fruitopia Investor Office",cost:1200,seconds:9,effect:"Unlocks production, market, and delivery investors."},
  {level:3,name:"Investment Lounge",cost:4200,seconds:15,effect:"Unlocks shipping, entertainment, meetings, and offline investor bonuses."},
  {level:4,name:"Financial Partnership Center",cost:14000,seconds:24,effect:"Unlocks research, mountain, and sewer partnerships."},
  {level:5,name:"Global Investor Headquarters",cost:48000,seconds:35,effect:"Unlocks Goldie Grove and advanced Rainbow and Cosmic stars."}
];

export const INVESTOR_STAR_LEVELS=[
  {level:0,name:"No Star",symbol:"☆☆☆☆☆",multiplier:1,color:"bronze-outline",requirement:null},
  {level:1,name:"One Star",symbol:"★☆☆☆☆",multiplier:1.10,color:"bronze",requirement:null},
  {level:2,name:"Two Stars",symbol:"★★☆☆☆",multiplier:1.25,color:"silver",requirement:null},
  {level:3,name:"Three Stars",symbol:"★★★☆☆",multiplier:1.50,color:"gold",requirement:null},
  {level:4,name:"Four Stars",symbol:"★★★★☆",multiplier:1.85,color:"purple-gold",requirement:null},
  {level:5,name:"Five Stars",symbol:"★★★★★",multiplier:2.25,color:"animated-gold",requirement:null},
  {level:6,name:"Gold Star",symbol:"★ GOLD",multiplier:2.75,color:"gold",requirement:"Reach Major Investor reputation and Investor Center level 5"},
  {level:7,name:"Rainbow Star",symbol:"★ RAINBOW",multiplier:3.50,color:"rainbow",requirement:"Reach Fruitopia Legend reputation and Empire Level 16"},
  {level:8,name:"Cosmic Star",symbol:"★ COSMIC",multiplier:5.00,color:"cosmic",requirement:"Reach Fruitopia Legend reputation, Empire Level 18, and Cosmic Summit"}
];

const investorRows=[
  ["Ivy Venture","📈","Fruit Stand Sales","Confident and focused on reliable customer growth.",1,1000,260,["fruit-stand-sales","customer-requests","phone-orders"]],
  ["Pollen Penny","🐝","Orchard and Harvest Income","Patient and devoted to healthy trees and excellent fruit.",1,1200,300,["orchard-harvesting","automatic-orchard-sales"]],
  ["Milo Mixer","🥤","Crafted Products and Production","Creative, curious, and always looking for a new recipe.",2,1800,420,["crafted-products","production-businesses"]],
  ["Dex Dispatch","🚚","Local Deliveries","Fast-moving and impressed by reliable delivery streaks.",2,2400,520,["local-deliveries","subscriptions"]],
  ["Marla Market","🏪","Market Stalls and Customer Orders","Social, observant, and delighted by product variety.",2,2600,560,["market-stalls"]],
  ["Captain Clement","⚓","Shipping Income","Adventurous and serious about safe harbor development.",3,5000,900,["shipping"]],
  ["Tina Ticket","🎟️","Entertainment and Minigames","Energetic, cheerful, and motivated by visitors and high scores.",3,4400,820,["entertainment-tickets","minigame-sponsorships","festival-income"]],
  ["Dr. Nova Nectar","🔬","Research Patents and Laboratories","Curious and happiest when Fruitopia discovers something new.",4,8000,1300,["research-patents","laboratory-studies"]],
  ["Monty Peak","🏔️","Mountain Businesses","Careful, practical, and committed to strong infrastructure.",4,11000,1650,["mountain-businesses"]],
  ["Gina Greenwater","🧪","Sewer Experiments","Mysterious, funny, and fascinated by rare underground samples.",4,12500,1800,["sewer-experiments","fruit-mafia-rewards"]],
  ["Goldie Grove","🌟","Golden, Cosmic, and Long-Term Income","Prestigious and interested in late-game growth that lasts.",5,30000,3500,["investments-dividends","offline-income","golden-cosmic-fruit"]]
];

export const INVESTORS=investorRows.map(([name,icon,specialty,personality,centerLevel,cost,baseStarCost,sources],index)=>({
  id:slug(name),name,icon,specialty,personality,centerLevel,cost,baseStarCost,sources,index,
  desk:{x:60+(index%4)*8,y:540+Math.floor(index/4)*7}
}));
export const INVESTOR_BY_ID=Object.fromEntries(INVESTORS.map(item=>[item.id,item]));

const incomeRows=[
  ["Fruit Stand Sales","ivy-venture",5,"Fruit sold from Sunny Side Fruit Stand"],
  ["Orchard Harvesting","pollen-penny",4,"Manual orchard fruit sales and harvest contracts"],
  ["Automatic Orchard Sales","pollen-penny",5,"Fruit sold automatically from orchard storage"],
  ["Crafted Products","milo-mixer",5,"Direct sales of crafted products"],
  ["Production Businesses","milo-mixer",5,"Passive income from production facilities"],
  ["Customer Requests","ivy-venture",30,"Completed customer requests"],
  ["Phone Orders","ivy-venture",30,"Payments collected from phone orders"],
  ["Market Stalls","marla-market",5,"Market stall and town-center income"],
  ["Local Deliveries","dex-dispatch",30,"Completed local delivery routes"],
  ["Subscriptions","dex-dispatch",60,"Subscription-service income"],
  ["Shipping","captain-clement",60,"Completed automatic shipping contracts"],
  ["Entertainment Tickets","tina-ticket",5,"Attraction and visitor ticket income"],
  ["Minigame Sponsorships","tina-ticket",45,"Cash rewards from original Fruitopia minigames"],
  ["Research Patents","dr-nova-nectar",30,"Patent and discovery royalties"],
  ["Laboratory Studies","dr-nova-nectar",30,"Completed laboratory studies"],
  ["Investments and Dividends","goldie-grove",60,"Fictional in-game fund dividends only"],
  ["Sewer Experiments","gina-greenwater",30,"Underground experiment products and studies"],
  ["Fruit Mafia Rewards","gina-greenwater",45,"Fictional club activity rewards"],
  ["Mountain Businesses","monty-peak",5,"High-altitude business income"],
  ["Festival Income","tina-ticket",5,"Grand Fruit Festival earnings"],
  ["Offline Income","goldie-grove",60,"Capped income earned while the player is away"],
  ["Golden and Cosmic Fruit","goldie-grove",10,"Sales of legendary, golden, and cosmic fruit"]
];
export const INCOME_SOURCES=incomeRows.map(([name,investorId,intervalSeconds,description],index)=>({id:slug(name),name,investorId,intervalSeconds,description,index}));
export const INCOME_SOURCE_BY_ID=Object.fromEntries(INCOME_SOURCES.map(item=>[item.id,item]));

const goalTemplates={
  "ivy-venture":[["stand-sales-50","Complete 50 stand sales","sold",50],["loyalty-club","Improve Loyalty Club","standUpgrades",8],["feature-products","Feature three products","features",3],["sale-streak","Reach a sale streak","saleStreak",10]],
  "pollen-penny":[["harvest-100","Harvest 100 fruit","harvested",100],["apple-quality","Raise Apple quality","appleQuality",3],["bee-garden","Build Bee Garden","beeGarden",1],["healthy-trees","Keep every tree healthy","healthyTrees",6]],
  "dex-dispatch":[["deliveries-10","Complete ten deliveries","deliveries",10],["delivery-streak","Maintain a delivery streak","deliveryStreak",5],["subscribers","Gain 25 subscribers","subscribers",25],["dispatch-tower","Upgrade Dispatch Tower","dispatchTower",1]],
  "captain-clement":[["repair-harbor","Repair the harbor","harborLevel",1],["shipping-5","Complete five shipping contracts","shipments",5],["cold-cargo","Preserve refrigerated cargo","coldCargo",1],["international-pier","Unlock International Pier","harborLevel",12]]
};
export const INVESTOR_GOALS=INVESTORS.flatMap(investor=>{
  const rows=goalTemplates[investor.id]||[
    [`${investor.id}-income`,`Earn $1,000 from ${investor.specialty}`,"sourceIncome",1000],
    [`${investor.id}-star`,`Purchase two ${investor.name} stars`,"stars",2],
    [`${investor.id}-partner`,`Reach Trusted Partner reputation`,"reputation",2]
  ];
  return rows.map(([suffix,name,stat,target],index)=>({id:`${investor.id}:${suffix}`,investorId:investor.id,name,stat,target,reward:{reputation:10+index*3,cash:100+investor.index*40,coins:index===rows.length-1?1:0}}));
});

export const INVESTOR_RELATIONSHIPS=[
  {level:0,name:"Interested",points:0},
  {level:1,name:"Partner",points:25},
  {level:2,name:"Trusted Partner",points:70},
  {level:3,name:"Major Investor",points:140},
  {level:4,name:"Fruitopia Legend",points:240}
];

export const INVESTOR_MEETINGS=[
  {id:"stand-space",investorId:"ivy-venture",question:"The stand is busy, but the display is too small. Where should our fictional Fruitopia Cash go?",choices:[{id:"storage",label:"Improve storage",effect:"storage"},{id:"advertising",label:"Improve advertising",effect:"temporary"},{id:"save",label:"Save the money",effect:"reputation"}]},
  {id:"harvest-health",investorId:"pollen-penny",question:"Should the orchard prioritize faster harvests or healthier trees?",choices:[{id:"health",label:"Healthy trees",effect:"reputation"},{id:"speed",label:"Faster harvests",effect:"temporary"}]},
  {id:"shipping-route",investorId:"captain-clement",question:"A new route is windy but promising. How should the harbor prepare?",choices:[{id:"crew",label:"Train the crew",effect:"reputation"},{id:"equipment",label:"Upgrade equipment",effect:"temporary"},{id:"wait",label:"Wait for calm seas",effect:"discount"}]}
];

export const INVESTOR_CENTER_POSITION={x:72,y:548};
