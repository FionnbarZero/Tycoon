import test from "node:test";
import assert from "node:assert/strict";
import * as Config from "../src/config.js";
import {FruitopiaCore,createDefaultState,migrateSave,serializeState} from "../src/core.js";
import {MafiaGameEngine} from "../src/mafia-game.js";

const game=(random=()=>.5)=>new FruitopiaCore(createDefaultState(1_000_000),random);
const enrich=core=>{
  core.state.cash=1_000_000_000;core.state.fruitCoins=1_000_000;core.state.researchPoints=1_000_000;core.state.xp=100_000;core.state.level=18;
  core.state.basketCapacity=100_000;core.state.warehouseCapacity=100_000;
  for(const district of Config.DISTRICTS)core.state.districts[district.id].unlocked=true;
  for(const fruit of Config.FRUITS){core.state.discoveredFruit[fruit.id]=true;core.state.fruitInventory[fruit.id]=1_000;}
  for(const recipe of Config.RECIPES)core.state.productInventory[recipe.id]=1_000;
  core.recalculate();core.state.basketCapacity=100_000;core.state.warehouseCapacity=100_000;
  return core;
};

test("master configuration contains every required catalog",()=>{
  assert.equal(Config.FRUITS.length,28);assert.equal(Config.RECIPES.length,21);assert.equal(Config.HYBRIDS.length,11);
  assert.equal(Config.DISTRICTS.length,8);assert.equal(Config.DISTRICTS.flatMap(d=>d.upgrades).length,64);
  assert.equal(Config.BUILDINGS.length,106);assert.equal(Config.LABS.length,10);assert.equal(Config.PRODUCTION_LINES.length,10);
  assert.equal(Config.VEHICLES.length,12);assert.equal(Config.ROUTES.length,18);assert.equal(Config.WORKERS.length,14);
  assert.equal(Config.OFFICE_UPGRADES.length,44);assert.equal(Config.OFFICE_OBJECTS.length,17);assert.equal(Config.PHONE_APPS.length,13);
  assert.equal(Config.MINIGAMES.length,11);assert.equal(Config.EVENTS.length,20);assert.equal(Config.SECRETS.length,11);
});

test("new game starts with one dollar, six renewable apples, stand, office, basket, orchard, and Pip",()=>{
  const core=game();assert.equal(core.state.cash,1);assert.equal(core.state.trees.length,6);assert.ok(core.state.trees.every(tree=>tree.fruit==="apple"&&tree.status==="ripe"));
  assert.equal(core.state.basketCapacity,12);assert.ok(core.state.buildings["roadside-fruit-stand"]);assert.ok(core.state.buildings["tiny-office"]);assert.ok(core.state.buildings["orchard-shed"]);assert.ok(core.state.workers["pip-orchard"]);
});

test("manual harvest, tree care, renewal, quality, and capacity are safe",()=>{
  const core=game(()=>.9);assert.ok(core.careForTree("apple-tree-1","water").ok);core.state.cash=5;assert.ok(core.careForTree("apple-tree-1","fertilize").ok);
  const harvested=core.harvestTree("apple-tree-1");assert.ok(harvested.ok);assert.equal(harvested.quantity,2);assert.equal(core.state.fruitInventory.apple,2);assert.equal(core.state.trees[0].status,"growing");assert.ok(core.state.trees[0].readyAt>core.now);assert.ok(core.state.researchPoints>0);
  core.state.basketCapacity=2;core.state.trees[1].status="ripe";assert.equal(core.harvestTree("apple-tree-2").ok,false);assert.equal(core.state.fruitInventory.apple,2);
  core.state.trees[0].readyAt=core.now-1;core.refreshTrees();assert.equal(core.state.trees[0].status,"ripe");
});

test("atomic spending never makes resources negative",()=>{
  const core=game();const before=structuredClone(core.state);const result=core.spend({cash:2,coins:1,research:1});assert.equal(result.ok,false);assert.equal(core.state.cash,before.cash);assert.equal(core.state.fruitCoins,before.fruitCoins);assert.equal(core.state.researchPoints,before.researchPoints);
});

test("all district improvements work, unlock rules progress, crates are one-time, and teleporters activate",()=>{
  const core=enrich(game());for(const district of Config.DISTRICTS){for(let index=0;index<8;index++)assert.ok(core.buyDistrictUpgrade(district.id,index).ok,`${district.name} improvement ${index}`);assert.equal(core.districtCompletion(district.id),100);assert.equal(core.state.districts[district.id].teleporter,true);assert.ok(core.teleport(district.id).ok);assert.ok(core.collectDistrictCrate(district.id).ok);assert.equal(core.collectDistrictCrate(district.id).ok,false);}assert.equal(core.state.stats.improvements,64);
});

test("all 106 buildings construct once and upgrade through all visual states",()=>{
  const core=enrich(game());for(const building of Config.BUILDINGS){if(!core.state.buildings[building.id])assert.ok(core.buildBuilding(building.id).ok,building.name);assert.equal(core.buildBuilding(building.id).ok,false);while(core.state.buildings[building.id].level<3)assert.ok(core.upgradeBuilding(building.id).ok,building.name);assert.equal(core.state.buildings[building.id].level,3);assert.equal(core.upgradeBuilding(building.id).ok,false);}assert.equal(Object.keys(core.state.buildings).length,106);
});

test("all ten laboratories improve relevant fruit without exceeding Golden quality",()=>{
  const core=enrich(game());for(const lab of Config.LABS){core.state.buildings[lab.id]={level:3,state:"landmark"};for(const fruit of lab.specialties)core.state.fruitQuality[fruit]=0;const result=core.runLabStudy(lab.id);assert.ok(result.ok,lab.name);assert.equal(core.state.studies[lab.id].length,1);const improved=core.state.studies[lab.id][0].fruit;assert.ok(core.state.fruitQuality[improved]<=4);}assert.equal(core.state.stats.studies,10);
});

test("all 21 recipes consume ingredients, respect warehouse capacity, and never duplicate",()=>{
  const core=enrich(game());core.state.warehouseCapacity=100_000;for(const recipe of Config.RECIPES){const before=Object.fromEntries(Object.keys(recipe.ingredients).map(key=>[key,core.state.fruitInventory[key]]));const prior=core.state.productInventory[recipe.id];assert.ok(core.craft(recipe.id,1).ok,recipe.name);assert.equal(core.state.productInventory[recipe.id],prior+1);for(const [fruit,amount] of Object.entries(recipe.ingredients))assert.equal(core.state.fruitInventory[fruit],before[fruit]-amount);}
});

test("all ten production lines use inventory and collect completed products once",()=>{
  const core=enrich(game());core.state.warehouseCapacity=100_000;for(const line of Config.PRODUCTION_LINES){core.state.buildings[line.building]={level:1,state:"open"};const started=core.startProduction(line.id,1);assert.ok(started.ok,line.name);started.job.readyAt=core.now-1;const before=core.state.productInventory[started.job.recipe];assert.ok(core.collectProduction(started.job.id).ok);assert.equal(core.state.productInventory[started.job.recipe],before+1);assert.equal(core.collectProduction(started.job.id).ok,false);}
});

test("all hybrid combinations cost resources, continue on timers, patent once, and plant renewable trees",()=>{
  const core=enrich(game(()=>0));for(const hybrid of Config.HYBRIDS){const started=core.startHybrid(...hybrid.parents);assert.ok(started.ok,hybrid.id);started.job.readyAt=core.now-1;assert.ok(core.resolveResearch(started.job.id).ok);assert.equal(core.resolveResearch(started.job.id).ok,false);assert.ok(core.state.patents.includes(hybrid.result));assert.equal(core.state.discoveredFruit[hybrid.result],true);assert.ok(core.state.trees.some(tree=>tree.fruit===hybrid.result));assert.equal(core.startHybrid(...hybrid.parents).ok,false);}assert.equal(core.state.patents.length,11);
});

test("all 12 vehicles and 18 automatic routes support product/subscription cargo and pay once",()=>{
  const core=enrich(game(()=>0));for(const vehicle of Config.VEHICLES)assert.ok(core.purchaseVehicle(vehicle.id).ok,vehicle.name);core.state.completedContracts=100;core.updateServiceTier();assert.equal(core.state.serviceTier,7);
  for(const route of Config.ROUTES){for(const [fruit,amount] of Object.entries(route.fruit))core.state.fruitInventory[fruit]=amount+10;for(const [product,amount] of Object.entries(route.products))core.state.productInventory[product]=amount+10;const dispatched=core.dispatchRoute(route.id);assert.ok(dispatched.ok,route.name);for(const [fruit,amount] of Object.entries(route.fruit))assert.equal(core.state.fruitInventory[fruit],10);for(const [product,amount] of Object.entries(route.products))assert.equal(core.state.productInventory[product],10);dispatched.delivery.readyAt=core.now-1;const cash=core.state.cash;assert.ok(core.completeDelivery(dispatched.delivery.id).ok);assert.ok(core.state.cash>cash);const paid=core.state.cash;assert.equal(core.completeDelivery(dispatched.delivery.id).ok,false);assert.equal(core.state.cash,paid);}
  assert.ok(core.state.deliverySubscribers>0);assert.equal(core.state.deliveryHistory.length,18);assert.ok(core.state.deliveryReputation>0);
});

test("phone negotiation, inventory supply, and customer payment are one-time",()=>{
  const core=enrich(game(()=>0));const order=core.generateOrder();assert.ok(core.negotiateOrder(order.id,"more-25").ok);const item=order.item,inventory=order.kind==="fruit"?core.state.fruitInventory:core.state.productInventory;inventory[item]=100;assert.ok(core.supplyOrder(order.id).ok);assert.equal(core.supplyOrder(order.id).ok,false);const payment=core.state.phone.payments.at(-1),before=core.state.cash;assert.ok(core.collectPayment(payment.id).ok);assert.ok(core.state.cash>before);const after=core.state.cash;assert.equal(core.collectPayment(payment.id).ok,false);assert.equal(core.state.cash,after);
});

test("complete applicant flow interviews, trial shifts, offers, worker memories, training, and promotion",()=>{
  const core=enrich(game(()=>0));const applicant="mina-till";assert.ok(core.applicantAction(applicant,"info").ok);assert.ok(core.applicantAction(applicant,"reference").ok);assert.ok(core.applicantAction(applicant,"shortlist").ok);assert.ok(core.applicantAction(applicant,"interview").ok);for(let i=0;i<3;i++)assert.ok(core.applicantAction(applicant,"answer",{tone:"professional",good:true}).ok);assert.equal(core.state.applicants[applicant].status,"interviewed");assert.ok(core.applicantAction(applicant,"trial",{task:"Serving customers"}).ok);assert.ok(core.applicantAction(applicant,"offer",{salary:30,position:"Cashier",department:"Sunny Side Fruit Stand"}).ok);assert.ok(core.state.workers[applicant]);assert.ok(core.manageWorker(applicant,"train").ok);assert.ok(core.manageWorker(applicant,"equipment").ok);assert.ok(core.manageWorker(applicant,"talk").ok);assert.ok(core.manageWorker(applicant,"promote").ok);assert.ok(core.state.workers[applicant].memories.length>=3);assert.ok(core.state.workers[applicant].dialogue.length>=1);assert.equal(core.applicantAction(applicant,"offer",{}).ok,false);
});

test("office contains all levels, objects, upgrades, communication, and phone apps",()=>{
  const core=enrich(game());for(const upgrade of Config.OFFICE_UPGRADES){assert.ok(core.buyOfficeUpgrade(upgrade.id).ok,upgrade.name);assert.equal(core.buyOfficeUpgrade(upgrade.id).ok,false);}assert.equal(core.state.office.upgrades.length,44);assert.equal(core.state.office.level,5);assert.equal(core.state.phone.unlocked,true);assert.equal(Config.PHONE_APPS.length,13);
});

test("every minigame creates a timed run and rewards it exactly once",()=>{
  const core=enrich(game());for(const district of Config.DISTRICTS)core.state.districts[district.id].upgrades=[0,1,2,3];for(const minigame of Config.MINIGAMES){const started=core.startMinigame(minigame.id);assert.ok(started.ok,minigame.name);started.run.score=500;started.run.finished=true;assert.ok(core.rewardMinigame(started.run).ok);const cash=core.state.cash;assert.equal(core.rewardMinigame(started.run).ok,false);assert.equal(core.state.cash,cash);}assert.equal(Object.keys(core.state.minigames.highScores).length,11);
});

test("all 20 events produce timed world and phone state",()=>{
  const core=enrich(game());for(const event of Config.EVENTS){core.state.event.active=null;const messages=core.state.phone.messages.length;assert.ok(core.startEvent(event.id).ok);assert.equal(core.state.event.active,event.id);assert.equal(core.state.phone.messages.length,messages+1);assert.ok(core.state.event.endsAt>core.now);}assert.equal(core.state.event.history.length,20);
});

test("events change economy state, progression plants fruit, market combos pay, and worker visits resolve once",()=>{
  const core=game(()=>0);core.state.xp=500;core.state.districts["market-square"].unlocked=true;core.recalculate();assert.equal(core.state.discoveredFruit.lemon,true);assert.equal(core.state.discoveredFruit.banana,true);assert.ok(core.state.trees.some(tree=>tree.fruit==="lemon"));
  core.state.featured.endsAt=0;assert.ok(core.startEvent("fruit-rush").ok);assert.ok(core.state.featured.endsAt>core.now);core.state.event.active=null;core.state.trees[0].status="growing";assert.ok(core.startEvent("double-harvest").ok);assert.ok(["ripe","golden"].includes(core.state.trees[0].status));
  core.state.discoveredFruit.apple=true;core.state.discoveredFruit.lemon=true;core.state.discoveredFruit.banana=true;assert.ok(core.assignMarketStall("fruit","apple").ok);assert.ok(core.assignMarketStall("fruit","lemon").ok);assert.ok(core.assignMarketStall("fruit","banana").ok);core.state.stats.harvested=1;assert.ok(core.passiveIncomePerMinute()>=3);
  const visit=core.generateWorkerVisit();assert.ok(visit);core.state.cash=100;assert.ok(core.respondWorkerVisit(visit.id,"support").ok);assert.equal(core.respondWorkerVisit(visit.id,"support").ok,false);assert.ok(core.state.workers[visit.workerId].memories.some(memory=>memory.includes("office visit")));
});

test("pending production reserves warehouse space before deducting a second batch",()=>{
  const core=enrich(game());core.state.productInventory=Object.fromEntries(Config.RECIPES.map(recipe=>[recipe.id,0]));core.state.warehouseCapacity=1;const line=Config.PRODUCTION_LINES[0],recipe=Config.RECIPE_BY_ID[line.recipe];core.state.buildings[line.building]={level:1,state:"open"};for(const fruit of Object.keys(recipe.ingredients))core.state.fruitInventory[fruit]=100;assert.ok(core.startProduction(line.id,1).ok);const before=structuredClone(core.state.fruitInventory);assert.equal(core.startProduction(line.id,1).ok,false);assert.deepEqual(core.state.fruitInventory,before);
});

test("all 11 secrets require clues and can only be discovered once",()=>{
  const core=enrich(game());for(const secret of Config.SECRETS){assert.ok(core.investigateSecret(secret.id,"clue").ok);assert.ok(core.investigateSecret(secret.id,"clue").ok);assert.ok(core.investigateSecret(secret.id,"investigate").ok);assert.equal(core.state.secrets[secret.id].discovered,true);assert.equal(core.investigateSecret(secret.id,"investigate").ok,false);}
});

test("quests, milestones, and achievements prevent duplicate claims",()=>{
  const core=enrich(game());core.state.stats.harvested=100;core.state.stats.cashEarned=1000;core.state.stats.sold=100;core.state.stats.crafted=100;core.state.stats.deliveries=100;core.state.stats.minigames=100;core.state.stats.improvements=64;core.state.stats.orders=100;core.state.stats.fruitCoinsEarned=100;core.state.stats.buildings=106;core.state.stats.highScore=2000;core.state.stats.level=18;core.checkQuestProgress();for(const quest of core.state.quests){assert.ok(core.claimQuest(quest.id).ok);assert.equal(core.claimQuest(quest.id).ok,false);}for(const milestone of Config.MILESTONES){assert.ok(core.claimMilestone(milestone.id).ok,milestone.name);assert.equal(core.claimMilestone(milestone.id).ok,false);}core.updateAchievements();assert.equal(Object.keys(core.state.achievements).length,7);const coins=core.state.fruitCoins;core.updateAchievements();assert.equal(core.state.fruitCoins,coins);
});

test("season prestige preserves legacy data and permanent Golden Seed upgrades",()=>{
  const core=enrich(game());core.state.xp=100_000;core.state.goldenSeeds=10;core.state.discoveredFruit["moon-melon"]=true;core.state.researchNotebook.push({result:"moon-melon"});core.state.workers["pip-orchard"].loyalty=91;core.state.workers["pip-orchard"].memories.push("Saved the harvest.");assert.ok(core.buyPermanent("evergreen-customers").ok);const result=core.beginSeason();assert.ok(result.ok);assert.equal(core.state.season,2);assert.ok(core.state.goldenSeeds>0);assert.equal(core.state.permanent["evergreen-customers"],1);assert.equal(core.state.discoveredFruit["moon-melon"],true);assert.equal(core.state.workers["pip-orchard"].loyalty,91);assert.ok(core.state.workers["pip-orchard"].memories.includes("Saved the harvest."));assert.equal(core.state.cash,1);
});

test("version-9 migration repairs corrupted saves, preserves older progress, and adds Mystery Crate data",()=>{
  const migrated=migrateSave({version:7,cash:-10,fruitCoins:-2,xp:900,fruitInventory:{apple:-4,lemon:7},productInventory:{"orchard-crate":-1},settings:{sound:false},trees:[]},2_000_000);assert.equal(migrated.version,9);assert.equal(migrated.cash,0);assert.equal(migrated.fruitCoins,0);assert.equal(migrated.fruitInventory.apple,0);assert.equal(migrated.fruitInventory.lemon,7);assert.equal(migrated.productInventory["orchard-crate"],0);assert.equal(migrated.settings.sound,false);assert.equal(migrated.trees.length,6);assert.ok(migrated.sewer.mafiaGame);assert.equal(migrated.sewer.mafiaGame.status,"idle");assert.equal(migrated.sewer.futureGame.playable,true);assert.equal(migrated.sewer.futureGame.locked,true);assert.equal(JSON.parse(serializeState(migrated)).version,9);
});

test("offline progress is capped, completes timers, restores energy, and does not duplicate delivery rewards",()=>{
  const core=enrich(game(()=>0));core.state.districts["sunny-side-fruit-stand"].upgrades=[0,1,2];core.state.lastTick=core.now-24*3600*1000;core.state.production.push({id:"job",recipe:"orchard-crate",quantity:1,readyAt:core.now-1000,status:"running",collected:false});core.state.researchJobs.push({id:"research",result:"moon-melon",readyAt:core.now-1000,status:"running",resolved:false,success:true});core.state.vehicles.bicycle={id:"bicycle",busy:true};core.state.activeDeliveries.push({id:"delivery",routeId:"cottage-lane",vehicleId:"bicycle",startedAt:core.now-10000,readyAt:core.now-1000,status:"traveling",paid:false});core.state.workers["pip-orchard"].energy=10;const before=core.state.cash,report=core.applyOfflineProgress(core.now);assert.ok(report.ok);assert.equal(report.elapsed,8*3600);assert.ok(core.state.cash>before);assert.equal(core.state.production[0].status,"complete");assert.equal(core.state.researchJobs[0].status,"ready");assert.equal(core.state.activeDeliveries[0].paid,true);assert.ok(core.state.workers["pip-orchard"].energy>10);const cash=core.state.cash;core.applyOfflineProgress(core.now);assert.equal(core.state.cash,cash);
});

test("sewer configuration includes entrances, labs, club machines, and the separate playable Mystery Crate game",()=>{
  assert.equal(Config.SEWER_ENTRANCES.length,6);assert.equal(Config.SEWER_SECTIONS.length,5);assert.equal(Config.WATER_POINTS.length,6);assert.equal(Config.SEWER_RECIPES.length,8);assert.equal(Config.SEWER_CHARACTERS.length,10);assert.equal(Config.SEWER_QUESTS.length,17);assert.equal(Config.SEWER_SECRETS.length,6);assert.equal(Config.PLINKO_SLOTS[3].id,"jackpot");assert.equal(Config.FUTURE_MAFIA_GAME.playable,true);assert.equal(Config.MAFIA_CARDS.length,23);assert.equal(Config.MAFIA_EVENTS.length,16);assert.equal(Config.MAFIA_OPPONENTS.length,9);assert.equal(Config.MINIGAMES.length,11);
});

test("manholes unlock through clues and support entering and leaving the persistent sewer world",()=>{
  const core=game();assert.equal(core.inspectManhole("sunny-manhole","open").ok,false);assert.ok(core.inspectManhole("sunny-manhole","inspect").ok);assert.ok(core.inspectManhole("sunny-manhole","listen").ok);assert.ok(core.inspectManhole("sunny-manhole","symbol").ok);assert.ok(core.inspectManhole("sunny-manhole","open").ok);assert.equal(core.state.sewer.inventory["empty-bottle"],1);assert.ok(core.enterSewer("sunny-manhole").ok);assert.equal(core.state.sewer.active,true);assert.equal(core.state.sewer.player.section,"drainage-entrance");assert.ok(core.leaveSewer().ok);assert.equal(core.state.sewer.active,false);assert.equal(core.state.sewer.entrances["sunny-manhole"].open,true);
});

test("Green Sewer Water needs a free owned container and respects respawn cooldown",()=>{
  const core=game();assert.equal(core.collectGreenWater("entrance-drip","empty-bottle").ok,false);core.state.sewer.inventory["empty-bottle"]=1;const first=core.collectGreenWater("entrance-drip","empty-bottle");assert.ok(first.ok);assert.equal(core.state.sewer.samples.length,1);assert.equal(core.collectGreenWater("entrance-drip","empty-bottle").ok,false);core.state.sewer.samples[0].consumed=true;assert.equal(core.collectGreenWater("entrance-drip","empty-bottle").ok,false);core.state.sewer.collectionPoints["entrance-drip"].readyAt=core.now-1;assert.ok(core.collectGreenWater("entrance-drip","empty-bottle").ok);
});

test("sewer experiments deduct inputs, finish on timers, discover recipes, and collect once",()=>{
  const core=game(()=>0);core.state.sewer.lab.discovered=true;core.state.sewer.inventory["sample-jar"]=1;core.state.fruitInventory.apple=2;const sample=core.collectGreenWater("entrance-drip","sample-jar").sample,before=core.state.fruitInventory.apple;const started=core.startSewerExperiment({sampleId:sample.id,ingredient:"apple",intensity:"gentle",duration:"quick"});assert.ok(started.ok);assert.equal(core.state.fruitInventory.apple,before-1);assert.equal(core.state.sewer.samples.find(item=>item.id===sample.id).consumed,true);assert.equal(core.startSewerExperiment({sampleId:sample.id,ingredient:"apple"}).ok,false);started.experiment.readyAt=core.now-1;const collected=core.collectSewerExperiment(started.experiment.id);assert.ok(collected.ok);assert.equal(core.state.sewer.inventory["glowing-apple"],1);assert.ok(core.state.sewer.lab.recipes["glowing-apple"]);assert.equal(core.collectSewerExperiment(started.experiment.id).ok,false);
});

test("the complete sewer maze map is restricted to the entrance",()=>{
  const core=game();core.state.sewer.active=true;core.state.sewer.player={x:8,y:76,section:"drainage-entrance"};assert.equal(core.canViewMazeMap(),false);assert.equal(core.studyMazeMap().ok,false);core.state.sewer.player={x:52,y:48,section:"sewer-maze"};core.updateSewerLocation();assert.equal(core.canViewMazeMap(),true);assert.ok(core.studyMazeMap().ok);assert.equal(core.state.sewer.maze.mapStudied,true);core.state.sewer.player.x=70;assert.equal(core.canViewMazeMap(),false);
});

test("maze valves, gates, shortcuts, and treasures persist and cannot reward twice",()=>{
  const core=game();assert.ok(core.turnSewerValve("entrance-valve").ok);assert.equal(core.state.sewer.maze.valves["entrance-valve"],true);assert.equal(core.state.sewer.maze.gates["channel-gate"],true);assert.ok(core.turnSewerValve("red-valve").ok);assert.ok(core.turnSewerValve("blue-valve").ok);assert.ok(core.turnSewerValve("yellow-valve").ok);assert.equal(core.state.sewer.maze.gates["pressure-gate"],true);core.state.sewer.inventory["charged-sewer-sample"]=1;assert.ok(core.unlockSewerGate("charged-gate").ok);assert.equal(core.state.sewer.inventory["charged-sewer-sample"],0);core.state.sewer.inventory["maintenance-key"]=1;assert.ok(core.openSewerShortcut("lab-drain").ok);assert.equal(core.openSewerShortcut("lab-drain").ok,false);const coins=core.state.fruitCoins;assert.ok(core.collectSewerTreasure("coin-nook").ok);assert.ok(core.state.fruitCoins>coins);const after=core.state.fruitCoins;assert.equal(core.collectSewerTreasure("coin-nook").ok,false);assert.equal(core.state.fruitCoins,after);
});

test("sewer characters become remembered phone contacts and can unlock route clues",()=>{
  const core=game();assert.ok(core.talkSewerCharacter("lost-delivery-driver").ok);assert.equal(core.state.sewer.characters["lost-delivery-driver"].met,true);assert.ok(core.state.phone.contacts["lost-delivery-driver"]);assert.equal(core.state.sewer.quests["help-a-lost-worker"].completed,true);const messages=core.state.phone.messages.length;assert.ok(core.talkSewerCharacter("lost-delivery-driver").ok);assert.equal(core.state.phone.messages.length,messages);
});

test("all new sewer secrets require clues and award discovery only once",()=>{
  const core=enrich(game());for(const secret of Config.SEWER_SECRETS){while(core.state.sewer.secrets[secret.id].clues<secret.clueTarget)assert.ok(core.investigateSewerSecret(secret.id,"clue").ok);assert.ok(core.investigateSewerSecret(secret.id,"investigate").ok);const coins=core.state.fruitCoins;assert.equal(core.investigateSewerSecret(secret.id,"investigate").ok,false);assert.equal(core.state.fruitCoins,coins);}
});

test("Fruit Mafia membership requires an atomic one-time $100 fictional Cash payment",()=>{
  const core=game();core.state.sewer.mafia.invitation=true;core.state.cash=99;assert.equal(core.buyMafiaMembership().ok,false);assert.equal(core.state.cash,99);assert.equal(core.state.sewer.mafia.membership,false);core.state.cash=100;assert.ok(core.buyMafiaMembership().ok);assert.equal(core.state.cash,0);assert.equal(core.state.sewer.mafia.membership,true);assert.equal(core.state.sewer.inventory["club-membership-card"],1);assert.equal(core.buyMafiaMembership().ok,false);assert.equal(core.state.cash,0);
});

test("Club Chip spending is safe and Plinko's favored center result matches its visual slot and pays once",()=>{
  const core=game(()=>0);core.state.sewer.mafia.membership=true;assert.equal(core.spendClubChips(1).ok,false);assert.equal(core.state.sewer.mafia.clubChips,0);const started=core.startPlinko(3);assert.ok(started.ok);assert.equal(started.run.cost,0);assert.equal(started.run.slotIndex,3);assert.equal(started.run.visualSlot,3);started.run.readyAt=core.now-1;const reward=core.collectPlinko(started.run.id);assert.ok(reward.ok);assert.equal(reward.slotId,"jackpot");const chips=core.state.sewer.mafia.clubChips,cash=core.state.cash;assert.equal(core.collectPlinko(started.run.id).ok,false);assert.equal(core.state.sewer.mafia.clubChips,chips);assert.equal(core.state.cash,cash);
});

test("fruit slot reels match their stored outcome, use Club Chips, and pay once",()=>{
  const core=game(()=>0);core.state.sewer.mafia.membership=true;core.state.sewer.mafia.clubChips=4;const started=core.startFruitSlots();assert.ok(started.ok);assert.deepEqual(started.spin.reels,started.spin.visualReels);assert.deepEqual(started.spin.reels,["🍎","🍎","🍎"]);assert.equal(core.state.sewer.mafia.clubChips,0);started.spin.readyAt=core.now-1;assert.ok(core.collectFruitSlots(started.spin.id).ok);const chips=core.state.sewer.mafia.clubChips;assert.equal(core.collectFruitSlots(started.spin.id).ok,false);assert.equal(core.state.sewer.mafia.clubChips,chips);assert.equal(typeof core.startFutureMafiaGame,"undefined");
});

test("offline progress completes but does not collect a sewer experiment reward",()=>{
  const core=game(()=>0);core.state.sewer.lab.discovered=true;core.state.sewer.inventory["sample-jar"]=1;core.state.fruitInventory.lemon=1;const sample=core.collectGreenWater("entrance-drip","sample-jar").sample,started=core.startSewerExperiment({sampleId:sample.id,ingredient:"lemon",duration:"quick"});started.experiment.readyAt=core.now-1000;core.state.lastTick=core.now-4000;const report=core.applyOfflineProgress(core.now);assert.equal(report.sewerExperiments,1);assert.equal(started.experiment.status,"ready");assert.equal(core.state.sewer.inventory["sewer-lemonade"],0);assert.equal(started.experiment.collected,false);assert.ok(core.collectSewerExperiment(started.experiment.id).ok);assert.equal(core.state.sewer.inventory["sewer-lemonade"],1);
});

const mysteryGame=(random=()=>.5)=>{const core=game(random);core.state.sewer.mafia.membership=true;core.state.sewer.futureGame.locked=false;core.state.sewer.mafia.clubChips=100;return{core,engine:new MafiaGameEngine(core)};};

test("Mystery Crate membership, Club Chip entry, opponent limits, starting hands, and family mode are safe",()=>{
  const locked=game();locked.state.sewer.mafia.clubChips=100;assert.equal(new MafiaGameEngine(locked).startRound(3,true).ok,false);
  const{core,engine}=mysteryGame(()=>.2),before=core.state.sewer.mafia.clubChips;assert.equal(engine.startRound(2,true).ok,false);assert.equal(core.state.sewer.mafia.clubChips,before);const started=engine.startRound(9,true);assert.ok(started.ok);assert.equal(core.state.sewer.mafia.clubChips,before-Config.MAFIA_GAME.entryCost);assert.equal(engine.state.participants.length,10);assert.ok(engine.state.participants.every(player=>player.hand.length===2));assert.equal(new Set(engine.state.participants.flatMap(player=>player.hand.map(card=>card.instanceId))).size,20);assert.equal(engine.state.familyFriendly,true);assert.equal(engine.weapon("blaster"),"Fruit Launcher");assert.equal(typeof engine.attackPlayer,"undefined");
});

test("all Mystery Crate cards have both classifications and all 16 original events can be produced",()=>{
  for(const card of Config.MAFIA_CARDS){assert.ok(["Positive","Neutral","Negative"].includes(card.alignment),card.name);assert.ok(["Automatic","Passive","Manual","Reaction"].includes(card.activation),card.name);assert.ok(card.description.length>20);}
  for(const event of Config.MAFIA_EVENTS){const{engine}=mysteryGame(()=>.5);assert.ok(engine.startRound(3,true).ok);const result=engine.advanceTurn(event.id);assert.ok(result.ok,event.name);assert.equal(engine.state.event.id,event.id);}
});

test("one-hit elimination moves a character to spectators while Second Serving rescues exactly once",()=>{
  const{engine}=mysteryGame(()=>.9);engine.startRound(3,true);for(const player of engine.state.participants)player.hand=[];const target=engine.state.participants[1];engine.drawCard(target,"second-serving");engine.eliminate(target,"test fruit burst","player");assert.equal(target.alive,true);assert.equal(target.secondServingUsed,true);engine.eliminate(target,"test fruit burst","player");assert.equal(target.alive,false);assert.equal(target.spectator,true);assert.ok(engine.state.history.some(item=>item.message.includes("spectator rail")));
});

test("Rebound opens a reaction window, redirects only left or right, logs the chain, and stops at protection",()=>{
  const{engine}=mysteryGame(()=>.4);engine.startRound(3,true);for(const player of engine.state.participants)player.hand=[];const human=engine.player(),right=engine.adjacent(human,"right");engine.drawCard(human,"rebound");engine.drawCard(right,"peel-shield");engine.state.event={id:"cartoon-blaster",name:"Cartoon Blaster",status:"active"};engine.launchAttack(human,{source:"Cartoon Blaster",type:"blaster",attackerId:"host",allowRebound:true,chain:[]});assert.equal(engine.state.pending.type,"reaction");assert.ok(engine.useReaction("rebound-right").ok);assert.equal(human.alive,true);assert.equal(right.alive,true);assert.equal(engine.hasCard(right,"peel-shield"),undefined);assert.ok(engine.state.history.some(item=>item.message.includes("Rebound right")));assert.ok(engine.state.history.some(item=>item.message.includes("Peel Shield")));
});

test("Spring Knife targeting rejects non-adjacent characters and restores the required decision",()=>{
  const{engine}=mysteryGame();engine.startRound(4,true);const human=engine.player(),left=engine.adjacent(human,"left"),right=engine.adjacent(human,"right"),outside=engine.state.participants.find(item=>![human.id,left.id,right.id].includes(item.id));engine.state.pending={type:"knife-target",prompt:"Choose left or right",actorId:human.id,leftId:left.id,rightId:right.id,targets:[left.id,right.id],options:["left","right"]};const invalid=engine.decide("outside",outside.id);assert.equal(invalid.ok,false);assert.equal(engine.state.pending.type,"knife-target");assert.ok(engine.decide("left",left.id).ok);
});

test("crate decisions receive real deadlines and a Spring Knife timeout turns safely toward its holder",()=>{
  const{engine}=mysteryGame(()=>.5);engine.startRound(3,true);for(const player of engine.state.participants)player.hand=[];const human=engine.player(),left=engine.adjacent(human,"left"),right=engine.adjacent(human,"right");engine.state.pending={type:"knife-target",prompt:"Choose",actorId:human.id,leftId:left.id,rightId:right.id,targets:[left.id,right.id],options:["left","right"]};engine.armPending(1);assert.ok(engine.state.pending.deadline>Date.now());assert.equal(engine.handleTimeout(engine.state.pending.deadline+1),true);assert.equal(human.alive,false);assert.equal(human.spectator,true);assert.ok(engine.state.history.some(item=>item.message.includes("timer expired")));
});

test("Spring Knife special cards expand targets, send danger back, step aside, or spare an opponent",()=>{
  const{core,engine}=mysteryGame(()=>.5);engine.startRound(4,true);for(const player of engine.state.participants)player.hand=[];const human=engine.player(),left=engine.adjacent(human,"left"),right=engine.adjacent(human,"right"),outside=engine.state.participants.find(item=>![human.id,left.id,right.id].includes(item.id));engine.drawCard(human,"choose-anyone");engine.state.pending={type:"knife-target",prompt:"Choose",actorId:human.id,leftId:left.id,rightId:right.id,targets:[left.id,right.id,outside.id],options:["left","right",outside.id],anyTarget:true};assert.ok(engine.decide(outside.id,outside.id).ok);assert.equal(outside.alive,false);assert.equal(engine.hasCard(human,"choose-anyone"),undefined);
  core.state.sewer.mafiaGame.status="active";outside.alive=true;outside.spectator=false;engine.state.event={id:"spring-knife",status:"active"};engine.drawCard(human,"rebound-blade");engine.launchAttack(human,{source:"Spring Knife",type:"knife",attackerId:outside.id,allowRebound:false,chain:[]});assert.equal(engine.state.pending.type,"reaction");assert.ok(engine.useReaction("blade-back").ok);assert.equal(human.alive,true);assert.equal(outside.alive,false);
  core.state.sewer.mafiaGame.status="active";right.alive=true;right.spectator=false;engine.state.event={id:"spring-knife",status:"active"};engine.drawCard(human,"side-step");engine.launchAttack(human,{source:"Spring Knife",type:"knife",attackerId:right.id,allowRebound:false,chain:[]});assert.ok(engine.useReaction("side-step").ok);assert.equal(human.alive,true);
  core.state.sewer.mafiaGame.status="active";const spare=engine.drawCard(human,"spare-them"),reputation=core.state.sewer.mafia.reputation;engine.state.pending={type:"knife-target",prompt:"Choose",actorId:human.id,leftId:left.id,rightId:right.id,targets:[left.id,right.id],options:["left","right","spare"]};assert.ok(engine.decide("spare").ok);assert.equal(human.hand.some(item=>item.instanceId===spare.instanceId),false);assert.equal(core.state.sewer.mafia.reputation,reputation+2);
});

test("manual cards use explicit targets, passive timers expire, and AI strategy remembers attackers",()=>{
  const{engine}=mysteryGame(()=>.5);engine.startRound(3,true);for(const player of engine.state.participants)player.hand=[];const human=engine.player(),first=engine.state.participants[1],second=engine.state.participants[2];const guard=engine.drawCard(human,"bodyguard-berry");assert.ok(engine.playCard(guard.instanceId,first.id).ok);assert.equal(human.bodyguardId,first.id);assert.equal(human.bodyguardTurns,2);const thief=engine.drawCard(human,"pickpocket-monkey");engine.drawCard(second,"peel-shield");const handBefore=human.hand.length;assert.ok(engine.playCard(thief.instanceId,second.id).ok);assert.equal(human.hand.length,handBefore);const sticky=engine.drawCard(human,"sticky-banana");assert.equal(sticky.remainingTurns,3);engine.tickCards();engine.tickCards();engine.tickCards();assert.equal(engine.hasCard(human,"sticky-banana"),undefined);first.memory.attackedBy[second.id]=10;assert.equal(engine.chooseTarget(first,[human,second]).id,second.id);
});

test("Mystery Crate declares the last survivor, persists round state, and pays each reward exactly once",()=>{
  const{core,engine}=mysteryGame(()=>.7);engine.startRound(3,true);for(const player of engine.state.participants)player.hand=[];for(const npc of engine.state.participants.filter(item=>!item.human))engine.eliminate(npc,"test crate","player");assert.equal(engine.state.status,"finished");assert.equal(engine.state.winnerId,"player");assert.equal(engine.state.reward.won,true);const migrated=migrateSave(JSON.parse(serializeState(core.state)),Date.now());assert.equal(migrated.sewer.mafiaGame.status,"finished");assert.equal(migrated.sewer.mafiaGame.winnerId,"player");const chips=core.state.sewer.mafia.clubChips,cash=core.state.cash;assert.ok(engine.collectReward().ok);assert.ok(core.state.sewer.mafia.clubChips>chips);assert.ok(core.state.cash>cash);const paidChips=core.state.sewer.mafia.clubChips,paidCash=core.state.cash;assert.equal(engine.collectReward().ok,false);assert.equal(core.state.sewer.mafia.clubChips,paidChips);assert.equal(core.state.cash,paidCash);
});
