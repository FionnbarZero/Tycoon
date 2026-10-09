import {EXPANSION_REGIONS,EXPANSION_PATHS,EXPANSION_PLOTS,EXPANSION_NPCS} from "./world-expansion-config.js";

const key=value=>String(value).toLowerCase().replace(/&/g,"and").replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");

export const OUTSIDE_WORLD={width:720,height:720,worldWidth:7200,worldHeight:7200,unitScale:10,layoutId:"fruitopia-country-v4-north-south"};

// Stable region IDs preserve every save record. This table only moves and presents
// those records in the authoritative north-to-south country plan.
export const COUNTRY_REGION_LAYOUT={
  "summit-observatory":{x:360,y:24,w:84,h:28,name:"Summit Observatory",primary:true,elevation:4400},
  "cosmic-summit":{x:540,y:20,w:92,h:30},"starfruit-observatory-basin":{x:420,y:62,w:100,h:38},
  "cloud-orchard-plateau":{x:500,y:58,w:104,h:38},"frozen-peaks":{x:94,y:62,w:92,h:42},
  "frozen-fruit-valley":{x:150,y:104,w:100,h:44},"volcano-ridge":{x:574,y:78,w:88,h:42},
  "dragon-fruit-desert":{x:610,y:132,w:105,h:54},
  "mountain-laboratories":{x:270,y:112,w:112,h:52,name:"High Mountain Building Area",primary:true,elevation:2200},
  "alpine-pass":{x:450,y:126,w:110,h:50,primary:true,elevation:2000},"mountain-base-camp":{x:300,y:158,w:100,h:44},
  "berrywood-forest":{x:100,y:184,w:118,h:52,primary:true},"citrus-highlands":{x:360,y:184,w:112,h:52,primary:true,elevation:920},
  "apple-grove-hills":{x:105,y:246,w:112,h:50,name:"Apple Grove Orchard",primary:true},
  "juice-lab-ridge":{x:360,y:246,w:112,h:50,name:"Research Ridge",primary:true},
  "river-farms":{x:600,y:246,w:114,h:50,name:"River Farms",primary:true},"riverside-farms":{x:520,y:286,w:94,h:40},
  "peach-blossom-hills":{x:205,y:286,w:98,h:42},"melon-wetlands":{x:55,y:292,w:92,h:44},
  "old-fruitopia-town":{x:105,y:326,w:108,h:46,name:"Old Fruitopia",primary:true},
  "starter-valley":{x:105,y:422,w:116,h:54,primary:true},"sunny-side-stand":{x:112,y:400,w:72,h:34},
  "market-town":{x:360,y:422,w:112,h:52,primary:true},
  "delivery-industrial-road":{x:600,y:422,w:112,h:52,name:"Delivery District",primary:true},
  "grand-fruit-festival":{x:105,y:522,w:112,h:50,name:"Festival Grounds",primary:true},
  "industrial-district":{x:360,y:522,w:118,h:52},
  "railway-junction":{x:360,y:590,w:112,h:48,name:"Train Freight Yard",primary:true},
  "fruit-shipping-harbor":{x:600,y:590,w:124,h:52,name:"Shipping Harbor",primary:true},
  "container-port":{x:505,y:618,w:96,h:38},"international-pier":{x:455,y:660,w:94,h:36},
  "lemon-coast":{x:600,y:650,w:112,h:44,primary:true},"coconut-bay":{x:665,y:610,w:82,h:40},
  "tropical-coast":{x:650,y:660,w:84,h:38},"tropical-island":{x:648,y:694,w:70,h:34},
  "fruit-archipelago":{x:585,y:704,w:110,h:30,name:"Fruit Islands",primary:true},
  "pineapple-island":{x:520,y:695,w:48,h:28},"mango-island":{x:555,y:675,w:48,h:28},
  "coconut-island":{x:665,y:702,w:48,h:28},"starfruit-island":{x:705,y:676,w:28,h:28},"secret-island":{x:700,y:710,w:28,h:18}
};

export const COUNTRY_LANDMARKS=[
  {id:"alpine-fruit-farm",name:"Alpine Fruit Farm",icon:"🍐",x:455,y:112,kind:"farm",style:"mountain",description:"A 2,000 m fruit farm reached by the mountain road."},
  {id:"highland-waterfall",name:"Waterfall",icon:"💦",x:606,y:184,kind:"waterfall",style:"mountain",description:"The highland falls feed River Farms below."},
  {id:"investor-plaza",name:"Investor Plaza",icon:"⭐",x:360,y:326,kind:"investor",style:"professional",description:"Investor offices, income reports, and star upgrades."},
  {id:"hiring-center",name:"Job and Hiring Center",icon:"📋",x:600,y:326,kind:"hiring",style:"professional",description:"Applications, interviews, trial shifts, and worker training."},
  {id:"office-headquarters",name:"Office Headquarters",icon:"🏢",x:360,y:370,kind:"office",style:"professional",description:"Manager office, conversations, smartphone, messages, and orders."},
  {id:"packing-factory-landmark",name:"Packing Factory",icon:"📦",x:360,y:510,kind:"factory",style:"industrial",description:"Washing, sorting, crates, boxes, and quality control."},
  {id:"shipping-center",name:"Shipping Center",icon:"📑",x:600,y:510,kind:"shipping",style:"harbor",description:"Export contracts, cargo scheduling, and order management."},
  {id:"open-expansion-land",name:"Open Expansion Land",icon:"🏗️",x:105,y:590,kind:"plots",style:"directional",description:"Large reserved plots for future company buildings."}
];

const regionRows=[
  ["Starter Valley","🌻",56,278,92,58,"#a9dc6e","#f7d76b","Valley Floor",120,1,"The welcoming valley where six apple trees, the stand, office, river, and first building sites begin."],
  ["Sunny Side Stand","🍎",92,246,58,42,"#f3c967","#f28a50","Valley Floor",135,1,"A lively roadside shop with a customer lane, featured display, and nearby sewer cover."],
  ["Apple Grove Hills","🌳",118,207,82,55,"#85c665","#df574d","Lower Slopes",360,1,"Terraced orchard rows, research plots, an old tree, and a concealed mountain tunnel."],
  ["Delivery Industrial Road","🚚",184,260,76,50,"#9fb8aa","#f5a64e","Valley Floor",145,2,"Loading bays, fleet garages, charging points, rail sidings, and the dispatch tower."],
  ["Market Town","🏪",226,211,82,55,"#f5cf70","#e87555","Lower Slopes",410,4,"A walkable town square for stalls, applicants, entertainment, banking, and special events."],
  ["Juice Lab Ridge","🧃",294,190,77,53,"#91d6aa","#ad61d8","Lower Slopes",690,6,"A raised research and production ridge overlooking the coast, market, and depot."],
  ["River Farms","🍓",78,314,112,38,"#79cb7d","#65afd7","Valley Floor",105,3,"Berry beds, melon fields, irrigation wheels, nurseries, and farming plots beside the river."],
  ["Tropical Coast","🏖️",342,276,104,54,"#f5dc82","#42b9c5","Valley Floor",25,8,"A palm-lined coast with a harbor, lighthouse, warehouses, ferry, and tropical delivery road."],
  ["Tropical Island","🏝️",424,311,74,48,"#72d4a0","#ffe16e","Valley Floor",45,8,"An island of coconut palms, mango terraces, rope bridges, villas, and the Sunfruit Temple."],
  ["Secret Island","🗝️",463,326,30,21,"#5fae8a","#e6bb4e","Valley Floor",30,15,"A misty late-game island revealed by clues, research, and a repaired hidden boat route."],
  ["Grand Fruit Festival","🎪",215,158,105,52,"#e6a5ca","#ffd65c","Lower Slopes",780,10,"Festival grounds and the public gateway to Fruitopia's mountain development program."],
  ["Mountain Base Camp","🏗️",216,119,92,46,"#a9a682","#ffbf55","Lower Slopes",1120,12,"Survey offices, material yards, worker cabins, road equipment, and the lower cable station."],
  ["Alpine Pass","🌲",196,82,105,48,"#74a58d","#bde9ed","Alpine Pass",1800,13,"Switchback roads, waterfalls, pine slopes, cable engineering, and high-altitude construction land."],
  ["Frozen Fruit Valley","❄️",126,49,104,50,"#b8dcec","#78bceb","Snow Line",2350,11,"The established frozen district, now linked by snow road, train tunnel, and cable-car junction."],
  ["Mountain Laboratories","🔬",288,72,100,56,"#a2c7c1","#70e5d1","Snow Line",2280,14,"Four staggered research terraces connected by glass paths, lifts, dormitories, and drone pads."],
  ["Volcano Ridge","🌋",376,58,77,49,"#744f55","#ff7755","Snow Line",2180,15,"A fantasy geothermal ridge for Fire Mango science, warm greenhouses, and thermal deliveries."],
  ["Cloud Orchard Plateau","☁️",255,30,112,42,"#cee9e8","#da8ff2","Cloud Plateau",3250,16,"A magical plateau with cloudberry fields, floating orchards, wind power, and sky logistics."],
  ["Summit Observatory","🔭",246,8,78,29,"#a8cde2","#f6e992","Summit",4100,17,"The highest normal mountain site, with cosmic instruments, a moon greenhouse, and rare weather."],
  ["Cosmic Summit","🚀",409,12,94,32,"#4d4c88","#ef9cff","Cosmic Elevation",5000,18,"Fruitopia's final outdoor frontier: rockets, portals, moon orchards, and the cosmic corporation."],
];

const regionRequirements={
  "starter-valley":{},"sunny-side-stand":{},"apple-grove-hills":{},"delivery-industrial-road":{level:2,road:"valley-east-road"},
  "market-town":{level:4,district:"delivery-depot",completion:50,road:"market-road"},"juice-lab-ridge":{level:6,district:"market-square",completion:50,road:"ridge-road"},
  "river-farms":{level:3,road:"river-bridge"},"tropical-coast":{level:8,district:"juice-lab",completion:50,road:"coastal-road"},
  "tropical-island":{level:8,shortcut:"tropical-ferry"},"secret-island":{level:15,secret:"secret-island-boat-route"},
  "grand-fruit-festival":{level:10,district:"market-square",completion:50,road:"festival-road"},
  "mountain-base-camp":{level:12,district:"grand-fruit-festival",completion:50,survey:true,road:"mountain-access-road"},
  "alpine-pass":{level:13,region:"mountain-base-camp",completion:60,road:"lower-mountain-road"},
  "frozen-fruit-valley":{level:11,district:"tropical-island",completion:50,region:"alpine-pass",regionCompletion:50},
  "mountain-laboratories":{level:14,region:"alpine-pass",completion:50,road:"lab-terrace-road"},
  "volcano-ridge":{level:15,fruit:"fire-mango",region:"mountain-laboratories",completion:45},
  "cloud-orchard-plateau":{level:16,region:"frozen-fruit-valley",completion:50,shortcut:"cloud-plateau-lift"},
  "summit-observatory":{level:17,fruit:"galaxy-grape",region:"cloud-orchard-plateau",completion:60,shortcut:"summit-teleporter"},
  "cosmic-summit":{level:18,secret:"cosmic-signal-tower",region:"summit-observatory",completion:75}
};

const RAW_OUTSIDE_REGIONS=[...regionRows.map(([name,icon,x,y,w,h,color,accent,elevationBand,elevation,level,description],index)=>({id:key(name),name,icon,x,y,w,h,color,accent,elevationBand,elevation,unlockLevel:level,description,index,requirements:regionRequirements[key(name)]||{},terrain:`${elevationBand} Fruitopia terrain`,fruits:[],buildings:[],activities:[],music:`${name} Theme`,sounds:"Local wildlife, workers, and transportation",quest:`Develop ${name}.`,specialInteraction:"Inspect the regional landmark.",revisitReason:"Construction, quests, harvests, and local rewards continue here."})),...EXPANSION_REGIONS].map((item,index)=>({...item,index}));
const RAW_REGION_BY_ID=Object.fromEntries(RAW_OUTSIDE_REGIONS.map(region=>[region.id,region]));
export const OUTSIDE_REGIONS=RAW_OUTSIDE_REGIONS.map(region=>({...region,...COUNTRY_REGION_LAYOUT[region.id],mapRole:COUNTRY_REGION_LAYOUT[region.id]?.primary?"primary":"supporting"}));
export const OUTSIDE_REGION_BY_ID=Object.fromEntries(OUTSIDE_REGIONS.map(region=>[region.id,region]));

const path=(id,name,type,points,requirement="",description="")=>({id,name,type,points,requirement,description});
const RAW_OUTSIDE_PATHS=[
  path("starter-loop","Starter Valley Loop","dirt",[[24,290],[55,278],[91,263],[119,247],[160,259],[184,260]],"","The first walkable dirt road."),
  path("valley-east-road","Valley East Road","paved",[[91,263],[137,270],[184,260]],"","Connects the stand to the depot."),
  path("orchard-road","Apple Grove Road","dirt",[[56,278],[71,239],[118,207]],"","Climbs from Starter Valley into Apple Grove."),
  path("market-road","Market Road","town",[[184,260],[204,237],[226,211]],"delivery-depot:50","Depot-to-market link."),
  path("ridge-road","Juice Ridge Road","paved",[[226,211],[260,208],[294,190]],"market-square:50","Curved climb to the laboratory ridge."),
  path("river-bridge","Starter Valley River Bridge","bridge",[[49,286],[60,303],[78,314]],"level:3","Repairs the route into River Farms."),
  path("coastal-road","Tropical Coastal Road","coastal",[[184,260],[257,272],[342,276]],"juice-lab:50","A palm-lined freight road."),
  path("island-ferry-line","Tropical Ferry","ferry",[[376,291],[424,311]],"tropical-ferry","Carries players and crates across the bay."),
  path("festival-road","Festival Parade Road","town",[[118,207],[168,179],[215,158],[226,211]],"market-square:50","Connects the orchard and market to the festival."),
  path("mountain-access-road","Mountain Access Road","mountain",[[215,158],[216,119]],"mountain-survey","Closed until the survey and repairs are complete."),
  path("lower-mountain-road","Lower Mountain Switchback","mountain",[[216,119],[184,111],[229,101],[172,92],[196,82]],"three-road-repairs","Broken Bridge, Rockslide, and Washed-Out Turn."),
  path("snow-road","Frozen Valley Snow Road","snow",[[196,82],[163,66],[126,49]],"alpine-pass:50","A protected road beyond the snow line."),
  path("lab-terrace-road","Laboratory Terrace Road","mountain",[[196,82],[240,79],[288,72]],"alpine-pass:50","Serves four staggered laboratory terraces."),
  path("volcano-road","Geothermal Spur","mountain",[[288,72],[330,66],[376,58]],"fire-mango","Heat-shielded fantasy fruit road."),
  path("cloud-lift-line","Cloud Plateau Lift","cable",[[196,82],[230,54],[255,30]],"cloud-plateau-lift","A visible lift rising through the clouds."),
  path("summit-line","Summit Cable","cable",[[255,30],[246,8]],"summit-teleporter","Final normal-elevation cable section."),
  path("cosmic-route","Cosmic Skyway","portal",[[246,8],[330,9],[409,12]],"cosmic-signal-tower","A late-game portal route beyond the summit."),
  path("river","Fruitopia River","water",[[0,302],[55,301],[112,313],[168,322],[230,327],[300,319],[342,296],[480,292]],"","A broad boundary and irrigation source."),
  path("rail-main","Fruit Train Main Line","rail",[[184,265],[226,217],[215,164],[216,125],[178,87],[126,55]],"train-track-main","Depot, Market, Base Camp, and Frozen Valley line."),
  path("rail-harbor","Fruit Harbor Branch","rail",[[184,265],[265,279],[342,281]],"train-track-harbor","Connects the freight network to Fruit Harbor."),
  ...EXPANSION_PATHS
];
const remapCountryPoint=([x,y])=>{const nearest=RAW_OUTSIDE_REGIONS.toSorted((a,b)=>Math.hypot(x-a.x,y-a.y)-Math.hypot(x-b.x,y-b.y))[0],target=OUTSIDE_REGION_BY_ID[nearest.id];return[target.x+(x-nearest.x)*.62,target.y+(y-nearest.y)*.62];};
const PATH_OVERRIDES={
  "starter-loop":[[68,438],[105,422],[180,422],[270,422],[360,422],[480,422],[600,422]],
  "valley-east-road":[[105,422],[360,422],[600,422]],"orchard-road":[[105,422],[105,365],[105,326],[105,246]],
  "market-road":[[600,422],[480,422],[360,422]],"ridge-road":[[360,422],[360,370],[360,326],[360,246]],
  "river-bridge":[[105,422],[160,390],[250,350],[360,326],[480,286],[600,246]],
  "festival-road":[[105,422],[105,474],[105,522]],"mountain-access-road":[[105,522],[105,470],[105,326],[105,246],[170,200],[300,158]],
  "lower-mountain-road":[[300,158],[330,146],[295,136],[380,132],[450,126]],
  "lab-terrace-road":[[450,126],[360,120],[270,112]],"summit-line":[[500,58],[420,40],[360,24]],
  "citrus-cliff-road":[[360,246],[360,220],[360,184]],"old-town-road":[[360,422],[360,370],[300,346],[105,326]],
  "junction-spur":[[600,422],[520,474],[430,530],[360,590]],"industrial-freight-road":[[600,422],[480,470],[360,522]],
  "riverside-farm-road":[[600,246],[560,266],[520,286]],"lemon-coast-road":[[600,590],[600,620],[600,650]],
  "harbor-coast-road":[[600,510],[600,550],[600,590]],"container-port-road":[[600,590],[550,606],[505,618]],
  "archipelago-ferry":[[600,650],[615,676],[585,704]],"harbor-rail":[[360,590],[480,590],[600,590]]
};
export const COUNTRY_MAIN_ROADS=[
  path("upper-main-road","Upper Main Road","paved",[[35,286],[685,286]],"","Wide east-west road between the farms and civic districts."),
  path("office-plaza-road","Office Plaza Road","town",[[105,326],[360,326],[600,326]],"","Connects Old Fruitopia, Investor Plaza, and the Hiring Center."),
  path("headquarters-walk","Headquarters Walking Plaza","town",[[360,326],[360,370],[360,422]],"","Broad pedestrian plaza linking the office to Market Town."),
  path("grand-central-road","Grand Central Road","paved",[[35,470],[685,470]],"","The major southern road serving the festival, factory, and shipping center."),
  path("festival-service-road","Festival Service Road","town",[[105,470],[105,522],[105,590]],"","Festival access and future expansion land."),
  path("freight-service-road","Freight Road","industrial",[[360,470],[360,522],[360,590]],"","Packing Factory to Train Freight Yard."),
  path("shipping-center-road","Harbor Road","industrial",[[600,470],[600,510],[600,590]],"","Shipping Center to the harbor docks."),
  path("waterfall-river","Waterfall and Farm River","water",[[606,184],[606,215],[600,246],[520,286],[360,300],[105,300]],"","Highland water feeds River Farms and the valley."),
  path("island-sea-route","Fruit Islands Sea Route","ferry",[[600,590],[600,650],[585,704]],"","Harbor ships call at Lemon Coast and the Fruit Islands.")
].map(route=>({...route,alwaysOpen:true}));
export const OUTSIDE_PATHS=[...RAW_OUTSIDE_PATHS.map(route=>({...route,points:PATH_OVERRIDES[route.id]||route.points.map(remapCountryPoint)})),...COUNTRY_MAIN_ROADS];
export const OUTSIDE_PATH_BY_ID=Object.fromEntries(OUTSIDE_PATHS.map(item=>[item.id,item]));

export const CONSTRUCTION_MATERIALS=[
  ["Timber","🪵",8],["Stone","🪨",7],["Metal Parts","⚙️",12],["Glass Panels","🪟",15],["Heating Units","♨️",22],
  ["Electrical Components","🔌",18],["Water Pipes","🚰",14],["Research Equipment","🔬",30],["Delivery Crates","📦",10]
].map(([name,icon,value])=>({id:key(name),name,icon,value,description:`A fictional mountain construction supply worth about $${value}.`}));
export const CONSTRUCTION_MATERIAL_BY_ID=Object.fromEntries(CONSTRUCTION_MATERIALS.map(item=>[item.id,item]));

export const MOUNTAIN_ROLES=["Surveyor","Road Worker","Bridge Builder","Electrician","Plumber","Cable-Car Engineer","Snowplow Driver","Mountain Mechanic","Construction Manager","Safety Inspector"];
export const MOUNTAIN_PREPARATION_STEPS=["Survey","Permit","Clear Land","Build Access","Install Utilities","Unlock Plots","Construct Buildings","Upgrade Region"];
export const PLOT_SIZES=["Small","Medium","Large","Landmark"];

const plotRows=[
  ["Stand Corner","starter-valley","Small",64,270,"Starter Buildings","roadside-fruit-stand"],["Orchard Shed Yard","starter-valley","Small",44,273,"Starter Buildings","orchard-shed"],
  ["Office Clearing","starter-valley","Small",53,286,"Starter Buildings","tiny-office"],["Coin Booth Bend","starter-valley","Small",75,282,"Starter Buildings","fruit-coin-booth"],
  ["Valley Storage","starter-valley","Small",32,288,"Starter Buildings",""],["Farmers Market Extension","starter-valley","Medium",83,294,"Starter Buildings",""],
  ["River West Field","river-farms","Medium",38,319,"Farming",""],["River Irrigation Plot","river-farms","Medium",81,324,"Farming",""],["Nursery Bank","river-farms","Medium",121,319,"Farming",""],
  ["Depot Freight Plot","delivery-industrial-road","Large",171,271,"Transportation,Delivery Service",""],["Depot Workshop Plot","delivery-industrial-road","Medium",194,250,"Workers,Transportation",""],
  ["Market Civic Plot","market-town","Large",218,220,"Business,Entertainment",""],["Market Shop Plot","market-town","Small",243,207,"Food Production,Business",""],
  ["Ridge Lower Lab","juice-lab-ridge","Medium",278,200,"Fruit Labs,Food Production",""],["Ridge Upper Lab","juice-lab-ridge","Medium",306,178,"Fruit Labs",""],
  ["Coast Harbor Plot","tropical-coast","Large",343,286,"Transportation,Delivery Service","fruit-harbor"],["Coast Warehouse","tropical-coast","Medium",366,270,"Transportation",""],
  ["Island Terrace One","tropical-island","Medium",412,305,"Farming,Food Production",""],["Island Temple Plot","tropical-island","Landmark",441,317,"Entertainment,Late Game",""],
  ["Festival Attraction Plot","grand-fruit-festival","Large",191,161,"Entertainment","grand-festival-grounds"],["Festival Gateway Plot","grand-fruit-festival","Medium",230,151,"Business,Transportation",""],
  ["Base Survey Yard","mountain-base-camp","Large",195,125,"Access","mountain-construction-office"],["Base Supply Yard","mountain-base-camp","Large",225,126,"Access,Delivery","supply-warehouse"],
  ["Base Worker Plot","mountain-base-camp","Medium",237,109,"Worker","mountain-worker-lodge"],["Base Cable Plot","mountain-base-camp","Large",205,108,"Access,Delivery","cable-car-station"],
  ["Alpine Orchard Terrace","alpine-pass","Large",170,80,"Farming","alpine-orchard"],["Alpine Lodge Terrace","alpine-pass","Medium",199,91,"Worker,Business","mountain-worker-lodge"],
  ["Alpine Utility Terrace","alpine-pass","Medium",222,78,"Access,Farming","hydroelectric-station"],["Alpine Cargo Terrace","alpine-pass","Large",187,68,"Delivery,Access","ski-lift-cargo-station"],
  ["Frozen Research Plot","frozen-fruit-valley","Large",115,42,"Research","cold-research-dome"],["Frozen Lodge Plot","frozen-fruit-valley","Medium",139,58,"Worker,Delivery","cold-storage-lodge"],
  ["Lower Lab Terrace","mountain-laboratories","Large",270,86,"Research","apple-genetics-lab"],["Middle Lab Terrace","mountain-laboratories","Large",294,73,"Research","berry-nutrition-lab"],
  ["Upper Lab Terrace","mountain-laboratories","Large",316,57,"Research","cryo-fruit-laboratory"],["Summit Lab Terrace","mountain-laboratories","Landmark",325,39,"Research","cosmic-botany-observatory"],
  ["Volcano Farm Plot","volcano-ridge","Large",365,65,"Farming,Research","volcano-greenhouse"],["Volcano Power Plot","volcano-ridge","Medium",395,51,"Access","geothermal-station"],
  ["Cloud Orchard Plot","cloud-orchard-plateau","Landmark",238,31,"Farming,Late Game","floating-orchard"],["Cloud Logistics Plot","cloud-orchard-plateau","Large",272,34,"Delivery,Transportation","helicopter-hangar"],
  ["Cloud Hotel Plot","cloud-orchard-plateau","Large",291,21,"Business","cloudtop-hotel"],["Observatory Crown","summit-observatory","Landmark",246,10,"Research","cosmic-botany-observatory"],
  ["Summit Greenhouse","summit-observatory","Large",263,16,"Research,Farming","moon-fruit-research-station"],
  ["Cosmic Launch Plot","cosmic-summit","Landmark",388,13,"Delivery,Late Game","rocket-launchpad"],["Moon Orchard Plot","cosmic-summit","Landmark",412,7,"Farming,Late Game","moon-orchard"],
  ["Cosmic Station Plot","cosmic-summit","Landmark",435,15,"Research,Late Game","cosmic-fruit-station"],["Fruitopia Palace Plot","cosmic-summit","Landmark",458,8,"Business,Late Game","fruitopia-palace"]
];
const RAW_OUTSIDE_PLOTS=[...plotRows.map(([name,region,size,x,y,categories,defaultBuilding])=>({id:key(name),name,region,size,x,y,terrain:OUTSIDE_REGION_BY_ID[region]?.elevationBand||"Valley Floor",allowedCategories:categories.split(","),defaultBuilding,utilities:size==="Small"?["road"]:size==="Medium"?["road","water"]:["road","water","electricity"],description:`A ${size.toLowerCase()} ${OUTSIDE_REGION_BY_ID[region]?.elevationBand.toLowerCase()||"valley"} construction site.`})),...EXPANSION_PLOTS];
const COUNTRY_PLOT_OVERRIDES={
  "stand-corner":{x:91,y:420},"orchard-shed-yard":{x:76,y:438},"office-clearing":{x:360,y:370},
  "coin-booth-bend":{x:132,y:438},"valley-storage":{x:55,y:405},"farmers-market-extension":{x:142,y:405},
  "market-civic-plot":{x:340,y:432},"market-shop-plot":{x:384,y:410},
  "depot-freight-plot":{x:575,y:434},"depot-workshop-plot":{x:625,y:408},
  "ridge-lower-lab":{x:338,y:256},"ridge-upper-lab":{x:382,y:232},
  "festival-attraction-plot":{x:82,y:530},"festival-gateway-plot":{x:132,y:510},
  "fruit-shipping-harbor-operations-plot":{x:575,y:598},"fruit-shipping-harbor-specialist-plot":{x:625,y:580}
};
const remapPlot=plot=>{const oldRegion=RAW_REGION_BY_ID[plot.region],newRegion=OUTSIDE_REGION_BY_ID[plot.region],override=COUNTRY_PLOT_OVERRIDES[plot.id];if(override)return{...plot,...override};if(!oldRegion||!newRegion)return plot;return{...plot,x:newRegion.x+(plot.x-oldRegion.x)*.6,y:newRegion.y+(plot.y-oldRegion.y)*.6};};
export const OUTSIDE_PLOTS=RAW_OUTSIDE_PLOTS.map(remapPlot);
export const OUTSIDE_PLOT_BY_ID=Object.fromEntries(OUTSIDE_PLOTS.map(plot=>[plot.id,plot]));

const mountainBuildingGroups={
  Access:["Mountain Construction Office","Survey Station","Road Repair Depot","Cable-Car Station","Mountain Elevator","Tunnel Entrance","Bridge Workshop","Snowplow Garage","Supply Warehouse","Hydroelectric Station","Geothermal Station","Road Shelter","Retaining Wall","Heated Tunnel"],
  Worker:["Mountain Worker Lodge","Heated Break Room","Alpine Medical Station","Mountain Training Center","Equipment Rental Shop","Rescue Station"],
  Farming:["Alpine Orchard","Mountain Greenhouse","Berry Tunnel","Cloud Orchard","Heated Nursery","Snow Irrigation Station","High-Altitude Bee Garden"],
  Business:["Mountain Fruit Market","Scenic Fruit Café","Mountain Gift Shop","Alpine Resort","Cloudtop Hotel","Summit Restaurant"],
  Delivery:["Mountain Courier Office","Cold Storage Lodge","Ski-Lift Cargo Station","Train Tunnel","Helicopter Hangar","Drone Relay Station","Rocket Supply Depot"],
  Research:["Cold Research Dome","Weather-Control Center","Cosmic Botany Observatory","Fire Mango Laboratory","Cloudberry Laboratory","Moon Fruit Research Station"]
};
const buildingIcons={Access:"🚧",Worker:"👷",Farming:"🌱",Business:"🏪",Delivery:"📦",Research:"🔬"};
let mountainIndex=0;
export const MOUNTAIN_BUILDINGS=Object.entries(mountainBuildingGroups).flatMap(([category,names])=>names.map((name,index)=>{
  mountainIndex++;const size=index%8===7?"Landmark":index%3===0?"Large":index%2===0?"Medium":"Small";
  return{id:key(name),name,category,icon:buildingIcons[category],size,cashCost:900+mountainIndex*260,coinCost:mountainIndex>30?3+Math.floor(mountainIndex/6):0,seconds:18+mountainIndex,materials:{timber:1+mountainIndex%3,stone:1+mountainIndex%2,"metal-parts":Math.ceil(mountainIndex/12)},effect:{type:{Access:"constructionSpeed",Worker:"workerSafety",Farming:"harvestYield",Business:"passiveIncome",Delivery:"deliverySpeed",Research:"research"}[category],value:1+mountainIndex*.08},maxLevel:3,visualStates:["Construction site","Open for business","Expanded operation","Fruitopia landmark"],description:`A functional mountain ${category.toLowerCase()} building that improves ${category==="Access"?"construction and safe travel":category==="Worker"?"worker safety and happiness":category==="Farming"?"high-altitude harvests":category==="Business"?"visitors and income":category==="Delivery"?"cargo access and speed":"fruit studies and research"}.`};
}));
export const MOUNTAIN_BUILDING_BY_ID=Object.fromEntries(MOUNTAIN_BUILDINGS.map(building=>[building.id,building]));

export const LOWER_MOUNTAIN_REPAIRS=[
  {id:"broken-bridge",name:"Broken Bridge",icon:"🌉",cashCost:650,materials:{timber:3,stone:2,"metal-parts":2},description:"Rebuild the first switchback bridge so workers and vans can climb."},
  {id:"rockslide",name:"Rockslide",icon:"🪨",cashCost:820,materials:{stone:3,"metal-parts":2},description:"Clear fallen rock and install a retaining wall."},
  {id:"washed-out-turn",name:"Washed-Out Turn",icon:"🌧️",cashCost:960,materials:{stone:3,"water-pipes":2,timber:2},description:"Drain and repave the highest hairpin bend."}
];

export const OUTSIDE_SHORTCUTS=[
  ["Starter Valley River Bridge","bridge","river-farms"],["Orchard Root Tunnel","tunnel","mountain-base-camp"],["Market-to-Festival Stairway","stairway","grand-fruit-festival"],
  ["Juice Ridge Elevator","elevator","juice-lab-ridge"],["Tropical Ferry","ferry","tropical-island"],["Mountain Base Tunnel","tunnel","alpine-pass"],
  ["Alpine Rope Bridge","bridge","frozen-fruit-valley"],["Frozen Valley Train Tunnel","rail","frozen-fruit-valley"],["Cloud Plateau Lift","lift","cloud-orchard-plateau"],
  ["Summit Teleporter","teleporter","summit-observatory"],["Sewer Exit Manholes","manhole","starter-valley"]
].map(([name,type,region],index)=>({id:key(name),name,type,region,cashCost:120+index*260,materials:index<3?{timber:2,stone:1}:{"metal-parts":2,"electrical-components":index>7?2:0},description:`A permanent ${type} shortcut to ${OUTSIDE_REGION_BY_ID[region]?.name||"another area"}.`}));

export const TRAIN_STATIONS=["Delivery Depot","Market Square","Mountain Base Camp","Frozen Fruit Valley","Fruit Harbor"].map((name,index)=>({id:key(name),name,x:[600,360,300,150,600][index],y:[432,432,158,104,590][index],region:["delivery-industrial-road","market-town","mountain-base-camp","frozen-fruit-valley","fruit-shipping-harbor"][index],cost:900+index*700}));
export const CABLE_STATIONS=["Grand Fruit Festival","Mountain Base Camp","Alpine Pass","Frozen Valley Junction","Cloud Orchard Plateau","Summit Observatory"].map((name,index)=>({id:key(name),name,x:[105,300,450,150,500,360][index],y:[510,158,126,104,58,24][index],region:["grand-fruit-festival","mountain-base-camp","alpine-pass","frozen-fruit-valley","cloud-orchard-plateau","summit-observatory"][index],cost:750+index*900}));

export const SURFACE_SECRETS=["Old Orchard Tunnel","Hidden Waterfall Cave","Abandoned Mountain Cabin","Golden Tree Clearing","Secret Island Boat Route","Frozen Crystal Cave","Volcano Fruit Chamber","Cloud Bridge","Cosmic Signal Tower","Hidden Summit Flag","Underground Fruit Tunnel Entrance","Fruit Mafia Surface Exit"].map((name,index)=>({id:key(name),name,region:["apple-grove-hills","alpine-pass","alpine-pass","apple-grove-hills","tropical-island","frozen-fruit-valley","volcano-ridge","cloud-orchard-plateau","summit-observatory","summit-observatory","apple-grove-hills","market-town"][index],icon:["🌳","💦","🏚️","🌟","⛵","💎","🔥","🌉","📡","🚩","🕳️","🍇"][index],reward:{xp:25+index*5,coins:index%3===0?1:0}}));

const BASE_OUTSIDE_NPCS=[
  ["Mara Measure","Surveyor","mountain-base-camp","Explains terrain surveys and safer plots.","📐"],["Bo Bridge","Bridge Builder","mountain-base-camp","Organizes timber and bridge repairs.","👷"],
  ["Elle Current","Electrician","alpine-pass","Connects utilities and repairs switchboards.","⚡"],["Snowy Sprout","Snowplow Driver","frozen-fruit-valley","Keeps the snow road open.","🚜"],
  ["Cliff Clementine","Mountain Climber","alpine-pass","Shares weather advice and hidden-path clues.","🧗"],["Professor Cirrus","Cloud Researcher","cloud-orchard-plateau","Studies Cloudberries and weather.","🧑‍🔬"],
  ["Harbor Holly","Ferry Captain","tropical-coast","Runs the island ferry and secret boat clues.","🧑‍✈️"],["Permit Pear","Safety Inspector","grand-fruit-festival","Issues fictional mountain building permits.","🦺"]
].map(([name,role,region,dialogue,icon],index)=>({id:key(name),name,role,region,dialogue,icon,routeRadius:4+index%3}));
export const OUTSIDE_NPCS=[...BASE_OUTSIDE_NPCS,...EXPANSION_NPCS];

export const MOUNTAIN_WEATHER=["Heavy Rain","Thick Fog","Snowstorm","Strong Wind","Rockslide","Frozen Road","Heat Vent","Aurora","Meteor Shower","Rainbow Weather"].map((name,index)=>({id:key(name),name,icon:["🌧️","🌫️","🌨️","💨","🪨","🧊","♨️","🌌","☄️","🌈"][index],effect:index<7?"Slows unprotected construction and transportation.":"Improves rare fruit or research rewards.",protection:["Weather Station","Road Shelter","Snowplow Garage","Retaining Wall","Heated Tunnel","Worker Rescue Station","Weather-Control Center"][Math.min(6,index)]}));

export const ELEVATION_BANDS=[
  {name:"Valley Floor",min:0,max:500,color:"#74c86a"},{name:"Lower Slopes",min:500,max:1400,color:"#75ad7a"},{name:"Alpine Pass",min:1400,max:2200,color:"#76998d"},
  {name:"Snow Line",min:2200,max:3000,color:"#b8dbe2"},{name:"Cloud Plateau",min:3000,max:3800,color:"#d7e9eb"},{name:"Summit",min:3800,max:4600,color:"#9fc2d9"},{name:"Cosmic Elevation",min:4600,max:9999,color:"#54518c"}
];
