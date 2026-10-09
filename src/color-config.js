export const CORE_COLORS={
  fruitopiaGreen:"#43C96B",darkOrchardGreen:"#176B3A",cashGreen:"#35D07F",fruitCoinGold:"#FFD34E",
  xpPurple:"#9B7BFF",researchCyan:"#54D9E8",constructionBlue:"#3F8CFF",dangerRed:"#F2555F",
  warningOrange:"#FF9F43",lockedGray:"#70798C",secretPurple:"#7D4DCC",mafiaGold:"#E8B640"
};

export const PURCHASE_STATE_THEMES={
  available:{primary:"#43C96B",border:"#176B3A",text:"#FFFFFF",icon:"✓",label:"READY TO BUY",pattern:"pulse",beam:"#43C96B"},
  "too-expensive":{primary:"#F2555F",border:"#8E2830",text:"#FFFFFF",icon:"💲!",label:"NEED MORE",pattern:"stripes",beam:"#F2555F"},
  "missing-requirement":{primary:"#FFC247",border:"#9B6400",text:"#382400",icon:"🔒",label:"REQUIRES",pattern:"blink",beam:"#FFC247"},
  "under-construction":{primary:"#3F8CFF",border:"#164D9B",text:"#FFFFFF",icon:"🔨",label:"BUILDING",pattern:"progress",beam:"#3F8CFF"},
  "ready-to-collect":{primary:"#3F8CFF",border:"#164D9B",text:"#FFFFFF",icon:"📦",label:"READY TO OPEN",pattern:"progress",beam:"#3F8CFF"},
  special:{primary:"#FFD34E",border:"#9A6D00",text:"#332200",icon:"🪙",label:"SPECIAL CURRENCY",pattern:"sparkle",beam:"#FFD34E"},
  research:{primary:"#54D9E8",border:"#146D7A",text:"#07343B",icon:"⚗️",label:"RESEARCH",pattern:"bubbles",beam:"#54D9E8"},
  secret:{primary:"#7D4DCC",border:"#3D216C",text:"#FFFFFF",icon:"🔑",label:"SECRET",pattern:"mystery",beam:"#7D4DCC"},
  mafia:{primary:"#171717",border:"#E8B640",text:"#FFE49A",icon:"🍇",label:"FRUIT MAFIA",pattern:"chase",beam:"#E8B640"},
  mountain:{primary:"#E9F4FF",border:"#55748F",text:"#243847",icon:"🏔️",label:"MOUNTAIN PROJECT",pattern:"frost",beam:"#D9F5FF"},
  sewer:{primary:"#62C34D",border:"#183B22",text:"#102413",icon:"💧",label:"SEWER PROJECT",pattern:"bubbles",beam:"#62C34D"},
  shipping:{primary:"#377FA3",border:"#173F59",text:"#FFFFFF",icon:"⚓",label:"HARBOR PROJECT",pattern:"waves",beam:"#78D7E8"},
  gold:{primary:"#FFD34E",border:"#9A6D00",text:"#332200",icon:"★",label:"FRUITOPIA LANDMARK",pattern:"sparkle",beam:"#FFE49A"},
  completed:{primary:"#5E6878",border:"#303743",text:"#E8EDF5",icon:"✓",label:"COMPLETED",pattern:"complete",beam:"#AAB3C0"}
};

export const DISTRICT_THEMES={
  "sunny-side-fruit-stand":{primary:"#FFCA63",secondary:"#FF8B54",accent:"#FFF2C7",pattern:"sunburst",mood:"Warm roadside sunshine"},
  "apple-grove-orchard":{primary:"#8FD25B",secondary:"#4CA95F",accent:"#DDF5B3",pattern:"leaves",mood:"Fresh, healthy orchard"},
  "delivery-depot":{primary:"#7EC8FF",secondary:"#3E7ECB",accent:"#E0F2FF",pattern:"route-lines",mood:"Fast organized delivery"},
  "market-square":{primary:"#FF9E80",secondary:"#E95F76",accent:"#FFE2B8",pattern:"awning",mood:"Busy social market"},
  "juice-lab":{primary:"#BC8CFF",secondary:"#7254C9",accent:"#E9D8FF",pattern:"molecules",mood:"Magical fruit science"},
  "tropical-island":{primary:"#42D5B5",secondary:"#168C91",accent:"#FFE37A",pattern:"waves",mood:"Tropical adventure"},
  "frozen-fruit-valley":{primary:"#B8E8FF",secondary:"#718CCB",accent:"#F4FCFF",pattern:"crystals",mood:"Premium frozen calm"},
  "grand-fruit-festival":{primary:"#FFDC51",secondary:"#F05D86",accent:"#8C5BFF",pattern:"confetti",mood:"Rainbow championship"}
};

export const EXPANSION_THEMES={
  "starter-valley":{primary:"#78C95A",secondary:"#76CDE8",accent:"#B77945",pattern:"apple-grid"},
  "mountain-base-camp":{primary:"#7A8491",secondary:"#3F8CFF",accent:"#FF9F43",pattern:"chevrons"},
  "alpine-pass":{primary:"#6687A6",secondary:"#176B3A",accent:"#A981D6",pattern:"peaks"},
  "frozen-mountain":{primary:"#B8E8FF",secondary:"#172D55",accent:"#59E0B2",pattern:"snowflakes"},
  "volcano-ridge":{primary:"#343238",secondary:"#FF782E",accent:"#FFD34E",pattern:"heat"},
  "cloud-orchard-plateau":{primary:"#F4FCFF",secondary:"#54D9E8",accent:"#9B7BFF",pattern:"clouds"},
  "cosmic-summit":{primary:"#131B45",secondary:"#7D4DCC",accent:"#54D9E8",pattern:"stars"},
  "sewer-entrance":{primary:"#805942",secondary:"#587C43",accent:"#D38A42",pattern:"bricks"},
  "green-water-canals":{primary:"#173D27",secondary:"#62C34D",accent:"#54D9E8",pattern:"bubbles"},
  "sewer-test-lab":{primary:"#54D9E8",secondary:"#62C34D",accent:"#FF9F43",pattern:"molecules"},
  "red-pipe-quarter":{primary:"#B63F48",secondary:"#FFF7EF",accent:"#FF9F43",pattern:"steam"},
  "blue-canal-quarter":{primary:"#214F91",secondary:"#54D9E8",accent:"#E1F7FF",pattern:"waves"},
  "yellow-maintenance-quarter":{primary:"#FFD34E",secondary:"#171717",accent:"#FF9F43",pattern:"warning-stripes"},
  "green-root-quarter":{primary:"#176B3A",secondary:"#7D4DCC",accent:"#8FD25B",pattern:"roots"},
  "black-pipe-center":{primary:"#171717",secondary:"#4A1725",accent:"#E8B640",pattern:"rings"},
  "fruit-mafia-club":{primary:"#171717",secondary:"#4A1725",accent:"#E8B640",highlight:"#FFE49A",pattern:"gold-chase"}
  ,"berrywood-forest":{primary:"#315C3C",secondary:"#A855B8",accent:"#F15F6B",pattern:"berry-leaves"}
  ,"melon-wetlands":{primary:"#72A84C",secondary:"#4FC4BB",accent:"#D6E86B",pattern:"lily-pads"}
  ,"peach-blossom-hills":{primary:"#EF9EB5",secondary:"#91BD66",accent:"#FFD0B5",pattern:"blossoms"}
  ,"citrus-highlands":{primary:"#F2C84B",secondary:"#F18B35",accent:"#FFF4C0",pattern:"terraces"}
  ,"old-fruitopia-town":{primary:"#B76850",secondary:"#E3C27A",accent:"#F5E3C3",pattern:"brick"}
  ,"railway-junction":{primary:"#4B79A8",secondary:"#8FC8E8",accent:"#F3B857",pattern:"rails"}
  ,"industrial-district":{primary:"#69948F",secondary:"#F39452",accent:"#DDECE6",pattern:"conveyors"}
  ,"lemon-coast":{primary:"#F2D35C",secondary:"#78C8DD",accent:"#FFF7C9",pattern:"cliffs"}
  ,"coconut-bay":{primary:"#31B9B1",secondary:"#F1DF72",accent:"#E7FFF5",pattern:"palms"}
  ,"dragon-fruit-desert":{primary:"#BD584E",secondary:"#9A50BE",accent:"#F6BE67",pattern:"cactus"}
  ,"starfruit-observatory-basin":{primary:"#334A92",secondary:"#73DDDC",accent:"#F1DC66",pattern:"constellations"}
  ,"fruit-shipping-harbor":{primary:"#377FA3",secondary:"#F2B84B",accent:"#E9F7FF",pattern:"shipping-lanes"}
  ,"container-port":{primary:"#5C7896",secondary:"#ED9152",accent:"#E7EEF5",pattern:"containers"}
  ,"international-pier":{primary:"#334C78",secondary:"#F3CD55",accent:"#F4F7FF",pattern:"flags"}
  ,"fruit-archipelago":{primary:"#32B6C2",secondary:"#FFD567",accent:"#E8FFEA",pattern:"islands"}
  ,"riverside-farms":{primary:"#76BD58",secondary:"#5FAEE3",accent:"#EAF6C7",pattern:"river-fields"}
  ,"frozen-peaks":{primary:"#D8F3FF",secondary:"#6F83C2",accent:"#8DE8C4",pattern:"aurora-peaks"}
  ,"pineapple-island":{primary:"#8BBF55",secondary:"#EFCF46",accent:"#FFF0A8",pattern:"terraces"}
  ,"mango-island":{primary:"#E28C45",secondary:"#83C96A",accent:"#FFE0A5",pattern:"mango-grove"}
  ,"coconut-island":{primary:"#3A9D78",secondary:"#F1DF83",accent:"#E9FFF4",pattern:"coconut-canopy"}
  ,"starfruit-island":{primary:"#4A62A3",secondary:"#F4DC65",accent:"#A9F1E8",pattern:"night-stars"}
};

export const MINIGAME_DIFFICULTIES={
  easy:{id:"easy",name:"Easy",timer:1.25,speed:.82,reward:.75,icon:"🌱",description:"Longer timer and gentler hazards."},
  normal:{id:"normal",name:"Normal",timer:1,speed:1,reward:1,icon:"🍎",description:"Standard Fruitopia rules and rewards."},
  hard:{id:"hard",name:"Hard",timer:.86,speed:1.22,reward:1.35,icon:"🔥",description:"Faster play, more pressure, and better rewards."},
  champion:{id:"champion",name:"Champion",timer:.72,speed:1.42,reward:1.75,icon:"🏆",description:"High-score rules and the best rewards."}
};

export const MINIGAME_CATEGORY_META={
  district:{name:"District Games",icon:"🏘️",description:"Signature games from Fruitopia's eight districts."},
  attraction:{name:"Attraction Games",icon:"🎡",description:"Games unlocked by entertainment and business attractions."},
  sewer:{name:"Sewer Games",icon:"🕳️",description:"Pressure, experiments, and cleanup below Fruitopia."},
  mountain:{name:"Mountain Games",icon:"🏔️",description:"Construction and cargo challenges at high elevation."},
  mafia:{name:"Fruit Mafia Games",icon:"🍇",description:"Fictional Club Chip activities played inside the hidden club."}
  ,regional:{name:"Regional Games",icon:"🗺️",description:"Distinct activities from Fruitopia's forests, wetlands, hills, railways, and desert."}
  ,shipping:{name:"Shipping Games",icon:"⚓",description:"Harbor loading, navigation, refrigeration, and lighthouse challenges."}
};

export const MINIGAME_THEMES={
  "the-big-ask":{primary:"#FFCA63",secondary:"#FF8B54",accent:"#43C96B",pattern:"customer-moods"},
  "basket-blitz":{primary:"#8FD25B",secondary:"#D7473F",accent:"#8B5B36",pattern:"fruit-vs-hazard"},
  "delivery-sort":{primary:"#7EC8FF",secondary:"#FFFFFF",accent:"#3E7ECB",pattern:"route-labels"},
  "market-rush":{primary:"#FF9E80",secondary:"#E95F76",accent:"#FFD34E",pattern:"lanterns"},
  "perfect-blend":{primary:"#BC8CFF",secondary:"#54D9E8",accent:"#FFFFFF",pattern:"lab-glow"},
  "coconut-splash":{primary:"#42D5B5",secondary:"#2388C7",accent:"#FFE37A",pattern:"waves"},
  "berry-slide":{primary:"#B8E8FF",secondary:"#FFFFFF",accent:"#4B62C4",pattern:"ice-lanes"},
  "watermelon-bowling":{primary:"#4CA95F",secondary:"#F05D66",accent:"#E3B75A",pattern:"sweet-spot"},
  "fruit-auction":{primary:"#18345E",secondary:"#E8B640",accent:"#4A1725",pattern:"auction-paddles"},
  "monkey-trouble":{primary:"#176B3A",secondary:"#FFD34E",accent:"#8B5B36",pattern:"jungle"},
  "golden-fruit-frenzy":{primary:"#FFD34E",secondary:"#F05D86",accent:"#8C5BFF",pattern:"rainbow"},
  "pipe-pressure":{primary:"#B63F48",secondary:"#FFF7EF",accent:"#FF9F43",pattern:"gauges"},
  "green-water-mix":{primary:"#62C34D",secondary:"#54D9E8",accent:"#777F82",pattern:"bubbles"},
  "canal-cleanup":{primary:"#214F91",secondary:"#62C34D",accent:"#54D9E8",pattern:"water-sort"},
  "construction-rush":{primary:"#3F8CFF",secondary:"#FF9F43",accent:"#70798C",pattern:"chevrons"},
  "cable-car-cargo":{primary:"#F4FCFF",secondary:"#C8454D",accent:"#7EC8FF",pattern:"balance"},
  plinko:{primary:"#171717",secondary:"#E8B640",accent:"#43C96B",pattern:"pegs"},
  "fruit-slots":{primary:"#171717",secondary:"#E8B640",accent:"#4A1725",pattern:"reels"},
  "mystery-crate":{primary:"#25252A",secondary:"#4A1725",accent:"#E8B640",pattern:"target-arrows"}
  ,"berry-trail":{primary:"#315C3C",secondary:"#A855B8",accent:"#F15F6B",pattern:"berry-signs"}
  ,"melon-raft":{primary:"#72A84C",secondary:"#4FC4BB",accent:"#D6E86B",pattern:"channels"}
  ,"peach-parade":{primary:"#EF9EB5",secondary:"#91BD66",accent:"#FFD0B5",pattern:"parade-carts"}
  ,"citrus-press":{primary:"#F2C84B",secondary:"#F18B35",accent:"#FFF4C0",pattern:"bottles"}
  ,"railway-sort":{primary:"#4B79A8",secondary:"#8FC8E8",accent:"#F3B857",pattern:"tracks"}
  ,"desert-irrigation":{primary:"#BD584E",secondary:"#9A50BE",accent:"#F6BE67",pattern:"pipes"}
  ,"container-stack":{primary:"#377FA3",secondary:"#F2B84B",accent:"#E9F7FF",pattern:"containers"}
  ,"crane-catch":{primary:"#5C7896",secondary:"#ED9152",accent:"#E7EEF5",pattern:"crane"}
  ,"harbor-route":{primary:"#32B6C2",secondary:"#334C78",accent:"#FFD567",pattern:"shipping-lanes"}
  ,"cold-chain-check":{primary:"#B8E8FF",secondary:"#377FA3",accent:"#F2555F",pattern:"thermometers"}
  ,"lighthouse-signal":{primary:"#F2D35C",secondary:"#334C78",accent:"#FFFFFF",pattern:"light-beams"}
};
