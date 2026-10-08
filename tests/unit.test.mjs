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
  assert.equal(Config.OFFICE_UPGRADES.length,44);assert.equal(Config.OFFICE_OBJECTS.length,17);assert.equal(Config.PHONE_APPS.length,13);assert.equal(Config.PHONE_APPS_EXPANDED.length,26);assert.equal(Config.PHONE_FOLDERS.length,5);
  assert.equal(Config.MINIGAMES.length,11);assert.equal(Config.EVENTS.length,20);assert.equal(Config.SECRETS.length,11);
  assert.equal(Config.OUTSIDE_WORLD.worldWidth,4800);assert.equal(Config.OUTSIDE_WORLD.worldHeight,3400);assert.equal(Config.OUTSIDE_REGIONS.length,19);assert.ok(Config.OUTSIDE_PLOTS.length>=40);assert.equal(Config.CONSTRUCTION_MATERIALS.length,9);assert.equal(Config.MOUNTAIN_ROLES.length,10);assert.equal(Config.TRAIN_STATIONS.length,5);assert.equal(Config.CABLE_STATIONS.length,6);
  assert.equal(Config.UPGRADE_CATEGORIES.length,16);assert.equal(Config.ORCHARD_UPGRADES.length,24);assert.equal(Config.SEWER_UPGRADES.length,44);assert.equal(Config.MOUNTAIN_UPGRADE_INDEX.length,43);assert.equal(Config.PHONE_THEMES.length,10);assert.equal(Config.PHONE_NOTIFICATION_TYPES.length,21);
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

test("order files preserve requirements, negotiation history, custom-counteroffer locks, and completed status",()=>{
  const core=enrich(game(()=>0)),locked=core.generateOrder();assert.equal(core.negotiateOrder(locked.id,"custom").ok,false);core.state.office.upgrades.push("custom-counteroffers");assert.ok(core.negotiateOrder(locked.id,"custom").ok);assert.equal(locked.negotiationHistory.length,1);assert.ok(Number.isFinite(locked.reputationRequirement));const inventory=locked.kind==="fruit"?core.state.fruitInventory:core.state.productInventory;inventory[locked.item]=locked.quantity;assert.ok(core.supplyOrder(locked.id).ok);const payment=core.state.phone.payments.find(item=>item.orderId===locked.id);assert.ok(core.collectPayment(payment.id).ok);assert.equal(locked.status,"completed");
});

test("complete applicant flow interviews, trial shifts, offers, worker memories, training, and promotion",()=>{
  const core=enrich(game(()=>0));const applicant="mina-till";assert.ok(core.applicantAction(applicant,"info").ok);assert.ok(core.applicantAction(applicant,"reference").ok);assert.ok(core.applicantAction(applicant,"shortlist").ok);assert.ok(core.applicantAction(applicant,"interview").ok);for(let i=0;i<3;i++)assert.ok(core.applicantAction(applicant,"answer",{tone:"professional",good:true}).ok);assert.equal(core.state.applicants[applicant].status,"interviewed");assert.ok(core.applicantAction(applicant,"trial",{task:"Serving customers"}).ok);assert.ok(core.applicantAction(applicant,"offer",{salary:30,position:"Cashier",department:"Sunny Side Fruit Stand"}).ok);assert.ok(core.state.workers[applicant]);assert.ok(core.manageWorker(applicant,"train").ok);assert.ok(core.manageWorker(applicant,"equipment").ok);assert.ok(core.manageWorker(applicant,"talk").ok);assert.ok(core.manageWorker(applicant,"promote").ok);assert.ok(core.state.workers[applicant].memories.length>=3);assert.ok(core.state.workers[applicant].dialogue.length>=1);assert.equal(core.applicantAction(applicant,"offer",{}).ok,false);
});

test("office contains all levels, objects, upgrades, communication, and phone apps",()=>{
  const core=enrich(game());for(const upgrade of Config.OFFICE_UPGRADES){assert.ok(core.buyOfficeUpgrade(upgrade.id).ok,upgrade.name);assert.equal(core.buyOfficeUpgrade(upgrade.id).ok,false);}assert.equal(core.state.office.upgrades.length,44);assert.equal(core.state.office.level,5);assert.equal(core.state.phone.unlocked,true);assert.equal(Config.PHONE_APPS.length,13);
});

test("Master Upgrade Center indexes every canonical system without duplicate upgrade records",()=>{
  const core=game(),catalog=core.upgradeCatalog(),keys=catalog.map(item=>item.key);assert.equal(new Set(keys).size,keys.length);assert.equal(catalog.length,380);
  const grouped=id=>catalog.filter(item=>item.groups.includes(id));assert.equal(grouped("districts").length,64);assert.equal(grouped("company-buildings").length,106);assert.equal(grouped("office").length,44);assert.equal(grouped("orchard").length,24);assert.equal(grouped("production").length,10);assert.equal(grouped("vehicles").length,12);assert.equal(grouped("fruit-laboratories").length,10);assert.equal(grouped("sewer").length,44);assert.equal(grouped("mountain").length,43);assert.equal(grouped("entertainment").length,10);assert.equal(grouped("seasonal-bonuses").length,9);
  for(const entry of catalog){assert.ok(entry.name);assert.ok(entry.category);assert.ok(entry.region);assert.ok(Number.isFinite(entry.level));assert.ok(Number.isFinite(entry.maxLevel));assert.ok(entry.state!=="locked");if(entry.missing.length)assert.ok(entry.missing.every(reason=>reason&&reason!=="Locked"),entry.name);}
  assert.deepEqual(grouped("company-buildings").map(item=>item.id).sort(),Config.BUILDINGS.map(item=>item.id).sort());
});

test("upgrade records expose building operations, worker management, laboratory history, and attraction metrics",()=>{
  const core=enrich(game());core.state.buildings["apple-genetics-lab"]={level:1,state:"open"};core.state.studies["apple-genetics-lab"]=[{id:"study-1",fruit:"apple",from:1,to:2,collected:true,at:core.now}];const catalog=core.upgradeCatalog(),building=catalog.find(item=>item.key==="building:roadside-fruit-stand"),worker=catalog.find(item=>item.key==="worker:pip-orchard"),lab=catalog.find(item=>item.key==="building:apple-genetics-lab"),attraction=catalog.find(item=>item.key==="building:fruit-museum");assert.ok(building.construction);assert.ok(building.interactiveAction);assert.equal(worker.worker.assignment,"Apple Grove Orchard");assert.ok(Array.isArray(worker.worker.certifications));assert.equal(lab.lab.studies.length,1);assert.ok(Array.isArray(lab.lab.researchers));assert.equal(attraction.entertainment.cooldown,60);
});

test("upgrade recommendations, pins, comparison, and exact requirements persist safely",()=>{
  const core=game(),catalog=core.upgradeCatalog(),locked=catalog.find(item=>item.key==="district:tropical-island:0");assert.ok(locked.missing.some(reason=>/reach|complete|unlock/i.test(reason)));
  const key="district:sunny-side-fruit-stand:0";assert.ok(core.togglePinnedUpgrade(key).ok);assert.ok(core.toggleComparedUpgrade(key).ok);assert.ok(core.toggleComparedUpgrade("office:basic-desk-phone").ok);assert.equal(core.state.upgradeCenter.compare.length,2);assert.ok(core.toggleComparedUpgrade("orchard:better-watering").ok);assert.equal(core.state.upgradeCenter.compare.length,2);assert.equal(core.state.upgradeCenter.compare.includes(key),false);assert.ok(core.recommendedUpgrades().some(item=>item.key===key));
  const restored=migrateSave(JSON.parse(serializeState(core.state)));assert.ok(restored.upgradeCenter.pinned.includes(key));assert.equal(restored.upgradeCenter.compare.length,2);
});

test("catalog purchases are atomic and orchard levels stop at their configured maximum",()=>{
  const core=game(),key="district:sunny-side-fruit-stand:0",before=core.state.cash;assert.equal(core.purchaseCatalogUpgrade(key).ok,false);assert.equal(core.state.cash,before);assert.equal(core.state.districts["sunny-side-fruit-stand"].upgrades.length,0);
  core.state.cash=1_000_000;assert.ok(core.purchaseCatalogUpgrade(key).ok);assert.equal(core.state.districts["sunny-side-fruit-stand"].upgrades.length,1);
  const orchard="orchard:better-watering",definition=Config.ORCHARD_UPGRADES.find(item=>item.id==="better-watering");for(let level=0;level<definition.maxLevel;level++)assert.ok(core.purchaseCatalogUpgrade(orchard).ok);assert.equal(core.state.orchardUpgrades[definition.id],definition.maxLevel);assert.equal(core.purchaseCatalogUpgrade(orchard).ok,false);
});

test("orchard upgrades change watering, treatment, yield, sales, and safe automation",()=>{
  const core=game(()=>.99),tree=core.state.trees[0];core.state.orchardUpgrades["better-watering"]=3;tree.status="growing";tree.readyAt=core.now+60000;assert.ok(core.careForTree(tree.id,"water").ok);assert.equal(tree.readyAt,core.now+36000);
  core.state.cash=0;core.state.orchardUpgrades["disease-treatment"]=3;tree.diseased=true;tree.status="diseased";assert.ok(core.careForTree(tree.id,"treat").ok);assert.equal(core.state.cash,0);
  core.state.cash=10;core.state.orchardUpgrades["stronger-fertilizer"]=3;tree.status="ripe";tree.readyAt=0;tree.fertilized=true;tree.watered=false;const harvested=core.harvestTree(tree.id);assert.ok(harvested.ok);assert.equal(harvested.quantity,5);
  core.state.discoveredFruit["rainbow-fruit"]=true;core.state.fruitInventory["rainbow-fruit"]=2;core.state.fruitQuality["rainbow-fruit"]=0;const normal=core.sellFruit("rainbow-fruit",1).payout;core.state.orchardUpgrades["premium-packing"]=1;const packed=core.sellFruit("rainbow-fruit",1).payout;assert.ok(packed>normal);
  core.state.orchardUpgrades["automatic-watering"]=1;core.state.orchardUpgrades["automatic-treatment"]=1;core.state.orchardUpgrades["automatic-pickers"]=1;core.state.trees[0].status="diseased";core.state.trees[0].diseased=true;core.state.trees[1].status="growing";core.state.trees[1].watered=false;core.state.trees[1].readyAt=core.now+50000;core.state.trees[2].status="ripe";core.state.trees[2].readyAt=0;const beforeHarvest=core.state.stats.harvested;core.processTimers(core.now+6000);assert.equal(core.state.trees[0].diseased,false);assert.ok(core.state.trees.some(item=>item.watered));assert.ok(core.state.stats.harvested>beforeHarvest);
});

test("smartphone notifications are deduplicated, routed, dismissible, themed, and saved",()=>{
  const core=game();core.state.phone.messages.unshift({id:"notice-test",from:"Pip Orchard",subject:"Basket ready",body:"The apples are waiting.",unread:true});core.syncPhoneNotifications();core.syncPhoneNotifications();const notes=core.state.phone.notifications.filter(note=>note.key==="message:notice-test");assert.equal(notes.length,1);assert.equal(notes[0].app,"messages");assert.equal(core.openPhoneNotification(notes[0].id).app,"messages");assert.equal(notes[0].read,true);
  const event=core.startEvent("fruit-rush");assert.ok(event.ok);assert.ok(core.state.phone.notifications.some(note=>note.type==="event"&&note.app==="events"));const dismiss=core.state.phone.notifications.find(note=>note.type==="event");assert.ok(core.dismissPhoneNotification(dismiss.id).ok);assert.ok(core.state.phone.dismissedNotifications.includes(dismiss.key));
  core.state.phone.theme="fruit-mafia-black-and-gold";const restored=migrateSave(JSON.parse(serializeState(core.state)));assert.equal(restored.phone.theme,"fruit-mafia-black-and-gold");assert.ok(restored.phone.notifications.some(note=>note.key==="message:notice-test"));
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
  const core=enrich(game());core.state.xp=100_000;core.state.goldenSeeds=10;core.state.discoveredFruit["moon-melon"]=true;core.state.researchNotebook.push({result:"moon-melon"});core.state.workers["pip-orchard"].loyalty=91;core.state.workers["pip-orchard"].memories.push("Saved the harvest.");core.state.phone.theme="cosmic-space";core.state.upgradeCenter.pinned=["seasonal:evergreen-customers"];assert.ok(core.buyPermanent("evergreen-customers").ok);const result=core.beginSeason();assert.ok(result.ok);assert.equal(core.state.season,2);assert.ok(core.state.goldenSeeds>0);assert.equal(core.state.permanent["evergreen-customers"],1);assert.equal(core.state.discoveredFruit["moon-melon"],true);assert.equal(core.state.workers["pip-orchard"].loyalty,91);assert.ok(core.state.workers["pip-orchard"].memories.includes("Saved the harvest."));assert.equal(core.state.phone.theme,"cosmic-space");assert.deepEqual(core.state.upgradeCenter.pinned,["seasonal:evergreen-customers"]);assert.equal(core.state.cash,1);
});

test("version-13 migration repairs saves and installs physical purchase-pad state and settings",()=>{
  const migrated=migrateSave({version:7,cash:-10,fruitCoins:-2,xp:900,fruitInventory:{apple:-4,lemon:7},productInventory:{"orchard-crate":-1},settings:{sound:false,purchaseCountdown:"invalid"},trees:[],sewer:{maze:{shortcuts:{"lab-drain":true}}},phone:{theme:"invalid-theme"},upgradeCenter:{pinned:["district:sunny-side-fruit-stand:0","missing"]}},2_000_000);assert.equal(migrated.version,13);assert.equal(migrated.cash,0);assert.equal(migrated.fruitCoins,0);assert.equal(migrated.fruitInventory.apple,0);assert.equal(migrated.fruitInventory.lemon,7);assert.equal(migrated.productInventory["orchard-crate"],0);assert.equal(migrated.settings.sound,false);assert.equal(migrated.settings.walkOnPurchasing,true);assert.equal(migrated.settings.purchaseCountdown,"normal");assert.ok(migrated.purchasePads.purchased);assert.ok(migrated.purchasePads.revealed);assert.equal(migrated.trees.length,6);assert.equal(migrated.sewer.layoutId,Config.SEWER_WORLD.layoutId);assert.equal(migrated.sewer.maze.fixedLayout,Config.SEWER_WORLD.layoutId);assert.equal(migrated.sewer.maze.shortcuts["lab-drain"],true);assert.equal(migrated.outside.layoutId,Config.OUTSIDE_WORLD.layoutId);assert.equal(migrated.player.x,57);assert.equal(migrated.outside.plots["stand-corner"].buildingId,"roadside-fruit-stand");assert.ok(migrated.sewer.mafiaGame);assert.equal(migrated.phone.theme,"orchard-green");assert.deepEqual(Object.keys(migrated.orchardUpgrades).sort(),Config.ORCHARD_UPGRADES.map(item=>item.id).sort());assert.equal(JSON.parse(serializeState(migrated)).version,13);
});

test("physical pad catalog derives from canonical upgrades and reveals only useful local chains",()=>{
  const core=game(),pads=core.purchasePadCatalog("surface"),district=pads.find(item=>item.upgradeKey==="district:sunny-side-fruit-stand:0"),plot=pads.find(item=>item.id==="pad:plot:valley-storage"),hiring=pads.find(item=>item.kind==="hiring");assert.ok(district);assert.equal(district.cost.cash,core.districtUpgradeCost("sunny-side-fruit-stand",0).cash);assert.equal(district.status,"too-expensive");assert.ok(district.shortages.some(item=>item.id==="cash"));assert.equal(plot.action,"select");assert.ok(hiring);assert.ok(pads.length<80,"The map should not reveal hundreds of pads at once");assert.ok(pads.every(item=>core.state.purchasePads.revealed[item.id]));
});

test("physical pad purchases are atomic, recorded once, and reveal the next district pad",()=>{
  const core=game(),firstId="pad:district:sunny-side-fruit-stand:0",before=core.state.cash,failed=core.executePurchasePad(firstId);assert.equal(failed.ok,false);assert.equal(core.state.cash,before);assert.equal(core.state.districts["sunny-side-fruit-stand"].upgrades.length,0);core.state.cash=1000;const bought=core.executePurchasePad(firstId);assert.ok(bought.ok);assert.ok(core.state.purchasePads.purchased[firstId]);assert.equal(core.state.purchasePads.transactions.length,1);assert.equal(core.executePurchasePad(firstId).ok,false);const next=core.purchasePadCatalog("surface").find(item=>item.upgradeKey==="district:sunny-side-fruit-stand:1");assert.ok(next);assert.equal(core.state.districts["sunny-side-fruit-stand"].upgrades.length,1);
});

test("plot selection pads never buy the first building accidentally",()=>{
  const core=game(),before=core.state.cash,result=core.executePurchasePad("pad:plot:valley-storage");assert.ok(result.ok);assert.equal(result.selectionRequired,true);assert.equal(result.plotId,"valley-storage");assert.equal(core.state.outside.plots["valley-storage"].buildingId,null);assert.equal(core.state.cash,before);
});

test("multi-resource pad errors enumerate every missing material without partial deductions",()=>{
  const core=enrich(game());core.state.outside.regions["mountain-base-camp"].discovered=true;core.state.outside.regions["mountain-base-camp"].surveyed=true;core.state.outside.materials.timber=0;core.state.outside.materials.stone=0;core.state.outside.materials["metal-parts"]=0;const pad=core.purchasePadCatalog("surface").find(item=>item.id==="pad:region:mountain-base-camp:permit")||core.purchasePadCatalog("surface").find(item=>item.mountain&&Object.keys(item.cost.materials||{}).length);assert.ok(pad);if(Object.keys(pad.cost.materials||{}).length){const snapshot={cash:core.state.cash,materials:structuredClone(core.state.outside.materials)},result=core.executePurchasePad(pad.id);assert.equal(result.ok,false);assert.equal(core.state.cash,snapshot.cash);assert.deepEqual(core.state.outside.materials,snapshot.materials);assert.ok(result.shortages.length>=1);}
});

test("Fruit Mafia membership pad holds for confirmation and charges the permanent fee once",()=>{
  const core=game();core.state.sewer.active=true;core.state.sewer.maze.centerOpen=true;core.state.sewer.maze.mafiaSymbol=true;core.state.sewer.mafia.invitation=true;core.state.cash=100;const pad=core.purchasePadCatalog("sewer").find(item=>item.id==="pad:mafia-membership");assert.ok(pad);const requested=core.executePurchasePad(pad.id,{world:"sewer"});assert.equal(requested.confirmationRequired,true);assert.equal(core.state.cash,100);const joined=core.executePurchasePad(pad.id,{world:"sewer",confirmed:true});assert.ok(joined.ok);assert.equal(core.state.cash,0);assert.equal(core.state.sewer.mafia.membership,true);assert.equal(core.executePurchasePad(pad.id,{world:"sewer",confirmed:true}).ok,false);
});

const supplyMountain=core=>{for(const material of Config.CONSTRUCTION_MATERIALS)core.state.outside.materials[material.id]=1_000;return core;};
const prepareBaseCamp=core=>{core.state.districts["grand-fruit-festival"].unlocked=true;core.state.districts["grand-fruit-festival"].upgrades=[0,1,2,3];assert.ok(core.surveyOutsideRegion("mountain-base-camp").ok);assert.ok(core.buyOutsidePermit("mountain-base-camp").ok);assert.ok(core.clearOutsideRegion("mountain-base-camp").ok);assert.ok(core.buildOutsideAccess("mountain-base-camp").ok);assert.ok(core.installOutsideUtility("mountain-base-camp","water").ok);assert.ok(core.installOutsideUtility("mountain-base-camp","electricity").ok);assert.ok(core.unlockOutsidePlots("mountain-base-camp").ok);return core;};

test("outside country preserves all eight districts, fixed regions, roads, manholes, and starter plots",()=>{
  const core=game();assert.equal(core.state.outside.layoutId,"fruitopia-country-v1");assert.equal(Config.DISTRICTS.length,8);assert.ok(Config.DISTRICTS.every(district=>district.x>0&&district.x<Config.OUTSIDE_WORLD.width&&district.y>0&&district.y<Config.OUTSIDE_WORLD.height));assert.ok(Config.SEWER_ENTRANCES.every(entry=>entry.x>0&&entry.x<Config.OUTSIDE_WORLD.width&&entry.y>0&&entry.y<Config.OUTSIDE_WORLD.height));assert.equal(Config.OUTSIDE_PLOTS.filter(plot=>plot.region==="starter-valley").length,6);assert.equal(core.state.outside.plots["stand-corner"].buildingId,"roadside-fruit-stand");assert.equal(core.state.outside.plots["orchard-shed-yard"].buildingId,"orchard-shed");assert.equal(core.state.outside.plots["office-clearing"].buildingId,"tiny-office");assert.equal(new Set(Config.OUTSIDE_PLOTS.map(plot=>`${plot.x},${plot.y}`)).size,Config.OUTSIDE_PLOTS.length);assert.ok(Config.OUTSIDE_PATHS.some(path=>path.type==="rail"));assert.ok(Config.OUTSIDE_PATHS.some(path=>path.type==="cable"));
});

test("mountain survey, permit, clearing, access, utilities, and plot unlock form a persistent sequence",()=>{
  const core=supplyMountain(enrich(game()));core.state.districts["grand-fruit-festival"].upgrades=[0,1,2,3];const base=core.state.outside.regions["mountain-base-camp"];assert.equal(base.surveyed,false);assert.ok(core.surveyOutsideRegion("mountain-base-camp").ok);assert.equal(core.surveyOutsideRegion("mountain-base-camp").ok,false);assert.ok(core.buyOutsidePermit("mountain-base-camp").ok);assert.ok(core.clearOutsideRegion("mountain-base-camp").ok);assert.ok(core.buildOutsideAccess("mountain-base-camp").ok);assert.equal(core.unlockOutsidePlots("mountain-base-camp").ok,false);assert.ok(core.installOutsideUtility("mountain-base-camp","water").ok);assert.ok(core.installOutsideUtility("mountain-base-camp","electricity").ok);assert.ok(core.unlockOutsidePlots("mountain-base-camp").ok);assert.equal(base.unlocked,true);assert.ok(Config.OUTSIDE_PLOTS.filter(plot=>plot.region==="mountain-base-camp").every(plot=>core.state.outside.plots[plot.id].unlocked));const saved=migrateSave(JSON.parse(serializeState(core.state)),core.now);assert.equal(saved.outside.regions["mountain-base-camp"].plotsUnlocked,true);
});

test("construction costs are atomic across Cash and materials",()=>{
  const core=enrich(game());core.state.outside.regions["mountain-base-camp"].surveyed=true;core.state.outside.regions["mountain-base-camp"].permitted=true;core.state.outside.materials.timber=1;core.state.outside.materials.stone=0;const cash=core.state.cash,timber=core.state.outside.materials.timber;const failed=core.clearOutsideRegion("mountain-base-camp");assert.equal(failed.ok,false);assert.equal(core.state.cash,cash);assert.equal(core.state.outside.materials.timber,timber);assert.equal(core.state.outside.materials.stone,0);
});

test("visible plot construction runs on a timer, completes once, and upgrades through landmark stage",()=>{
  const core=prepareBaseCamp(supplyMountain(enrich(game()))),plot="base-survey-yard";const options=core.plotBuildingOptions(plot);assert.ok(options.some(building=>building.id==="mountain-construction-office"));const started=core.startPlotConstruction(plot,"mountain-construction-office");assert.ok(started.ok);assert.equal(core.startPlotConstruction(plot,"survey-station").ok,false);assert.equal(core.state.outside.plots[plot].state,"construction");started.job.readyAt=core.now-1;core.processTimers();assert.equal(started.job.status,"ready");assert.ok(core.collectPlotConstruction(started.job.id).ok);assert.equal(core.collectPlotConstruction(started.job.id).ok,false);assert.ok(core.upgradePlotBuilding(plot).ok);assert.ok(core.upgradePlotBuilding(plot).ok);assert.equal(core.state.outside.plots[plot].level,3);assert.equal(core.upgradePlotBuilding(plot).ok,false);
});

test("phone construction controls pause offline timers and assign a real worker safely",()=>{
  const core=prepareBaseCamp(supplyMountain(enrich(game()))),started=core.startPlotConstruction("base-survey-yard","mountain-construction-office");assert.ok(started.ok);const originalReady=started.job.readyAt;assert.ok(core.pauseConstruction(started.job.id).ok);assert.equal(started.job.paused,true);started.job.readyAt=core.now-1;core.state.lastTick=core.now-10_000;const report=core.applyOfflineProgress(core.now);assert.equal(report.construction,0);assert.equal(started.job.status,"paused");started.job.readyAt=originalReady;assert.ok(core.pauseConstruction(started.job.id).ok);assert.equal(started.job.paused,false);assert.ok(core.assignConstructionWorker(started.job.id,"pip-orchard").ok);assert.deepEqual(started.job.workerIds,["pip-orchard"]);assert.equal(core.assignConstructionWorker(started.job.id,"pip-orchard").ok,false);const restored=migrateSave(JSON.parse(serializeState(core.state)),core.now);assert.deepEqual(restored.outside.constructionJobs[0].workerIds,["pip-orchard"]);
});

test("all three lower mountain road repairs open the switchback and persist",()=>{
  const core=supplyMountain(enrich(game()));for(const repair of Config.LOWER_MOUNTAIN_REPAIRS){assert.ok(core.repairLowerMountainRoad(repair.id).ok,repair.name);assert.equal(core.repairLowerMountainRoad(repair.id).ok,false);}assert.equal(core.state.outside.roads["lower-mountain-road"].repaired,true);assert.equal(core.state.outside.cable.lineRepaired,true);const reloaded=migrateSave(JSON.parse(serializeState(core.state)),core.now);assert.ok(Object.values(reloaded.outside.lowerMountainRepairs).every(Boolean));
});

test("bridges, tunnels, lifts, and teleport shortcuts unlock once and stay open",()=>{
  const core=supplyMountain(enrich(game()));for(const shortcut of Config.OUTSIDE_SHORTCUTS){if(!core.state.outside.shortcuts[shortcut.id])assert.ok(core.unlockOutsideShortcut(shortcut.id).ok,shortcut.name);assert.equal(core.unlockOutsideShortcut(shortcut.id).ok,false);}assert.equal(Object.values(core.state.outside.shortcuts).filter(Boolean).length,Config.OUTSIDE_SHORTCUTS.length);assert.equal(migrateSave(JSON.parse(serializeState(core.state)),core.now).outside.shortcuts["summit-teleporter"],true);
});

test("train stations, tracks, cable stations, and player travel work across developed regions",()=>{
  const core=supplyMountain(enrich(game()));for(const progress of Object.values(core.state.outside.regions)){progress.unlocked=true;progress.discovered=true;}assert.ok(core.buildTrainStation("delivery-depot").ok);assert.ok(core.buildTrainStation("market-square").ok);assert.ok(core.repairTrainTrack("train-track-main").ok);assert.ok(core.travelTrain("market-square").ok);assert.equal(core.state.outside.currentRegion,"market-town");for(const repair of Config.LOWER_MOUNTAIN_REPAIRS)assert.ok(core.repairLowerMountainRoad(repair.id).ok);assert.ok(core.buildCableStation("grand-fruit-festival").ok);assert.ok(core.buildCableStation("mountain-base-camp").ok);assert.ok(core.travelCableCar("mountain-base-camp").ok);assert.equal(core.state.outside.currentRegion,"mountain-base-camp");assert.equal(core.state.outside.cable.journeys,1);
});

test("mountain progression catalog reaches Alpine, Frozen, labs, volcano, cloud, summit, and cosmic regions",()=>{
  const ids=Config.OUTSIDE_REGIONS.map(region=>region.id);for(const required of ["mountain-base-camp","alpine-pass","frozen-fruit-valley","mountain-laboratories","volcano-ridge","cloud-orchard-plateau","summit-observatory","cosmic-summit"])assert.ok(ids.includes(required),required);assert.ok(Config.OUTSIDE_PLOTS.some(plot=>plot.id==="lower-lab-terrace"));assert.ok(Config.OUTSIDE_PLOTS.some(plot=>plot.id==="summit-lab-terrace"));assert.ok(Config.MOUNTAIN_BUILDINGS.some(building=>building.id==="weather-control-center"));assert.ok(Config.MOUNTAIN_BUILDINGS.some(building=>building.id==="moon-fruit-research-station"));assert.equal(Config.SURFACE_SECRETS.length,12);
});

test("all mountain weather patterns are timed, persistent, and delay rather than destroy unprotected construction",()=>{
  const core=prepareBaseCamp(supplyMountain(enrich(game())));for(const weather of Config.MOUNTAIN_WEATHER){core.state.outside.weather.active=null;assert.ok(core.startMountainWeather(weather.id).ok,weather.name);}assert.equal(core.state.outside.weather.history.length,Config.MOUNTAIN_WEATHER.length);core.state.outside.weather.active="heavy-rain";const started=core.startPlotConstruction("base-survey-yard","mountain-construction-office");assert.ok(started.ok);assert.ok(started.job.weatherDelay>0);assert.equal(core.state.outside.plots["base-survey-yard"].state,"construction");assert.ok(core.state.buildings["roadside-fruit-stand"]);
});

test("offline progress marks mountain construction ready without collecting it twice",()=>{
  const core=prepareBaseCamp(supplyMountain(enrich(game()))),started=core.startPlotConstruction("base-survey-yard","mountain-construction-office");started.job.readyAt=core.now-1;core.state.lastTick=core.now-10_000;const report=core.applyOfflineProgress(core.now);assert.equal(report.construction,1);assert.equal(started.job.collected,false);assert.equal(started.job.status,"ready");assert.ok(core.collectPlotConstruction(started.job.id).ok);assert.equal(core.collectPlotConstruction(started.job.id).ok,false);
});

test("offline progress is capped, completes timers, restores energy, and does not duplicate delivery rewards",()=>{
  const core=enrich(game(()=>0));core.state.districts["sunny-side-fruit-stand"].upgrades=[0,1,2];core.state.lastTick=core.now-24*3600*1000;core.state.production.push({id:"job",recipe:"orchard-crate",quantity:1,readyAt:core.now-1000,status:"running",collected:false});core.state.researchJobs.push({id:"research",result:"moon-melon",readyAt:core.now-1000,status:"running",resolved:false,success:true});core.state.vehicles.bicycle={id:"bicycle",busy:true};core.state.activeDeliveries.push({id:"delivery",routeId:"cottage-lane",vehicleId:"bicycle",startedAt:core.now-10000,readyAt:core.now-1000,status:"traveling",paid:false});core.state.workers["pip-orchard"].energy=10;const before=core.state.cash,report=core.applyOfflineProgress(core.now);assert.ok(report.ok);assert.equal(report.elapsed,8*3600);assert.ok(core.state.cash>before);assert.equal(core.state.production[0].status,"complete");assert.equal(core.state.researchJobs[0].status,"ready");assert.equal(core.state.activeDeliveries[0].paid,true);assert.ok(core.state.workers["pip-orchard"].energy>10);const cash=core.state.cash;core.applyOfflineProgress(core.now);assert.equal(core.state.cash,cash);
});

test("sewer configuration includes entrances, labs, club machines, and the separate playable Mystery Crate game",()=>{
  assert.equal(Config.SEWER_WORLD.worldWidth,2400);assert.equal(Config.SEWER_WORLD.worldHeight,1800);assert.equal(Config.SEWER_ENTRANCES.length,5);assert.equal(Config.SEWER_SECTIONS.length,15);assert.ok(Config.SEWER_PATHS.length>=20);assert.ok(Config.WATER_POINTS.length>=8);assert.equal(Config.SEWER_RECIPES.length,8);assert.equal(Config.SEWER_CHARACTERS.length,10);assert.ok(Config.SEWER_QUESTS.length>=20);assert.equal(Config.SEWER_SECRETS.length,6);assert.equal(Object.keys(Config.SEWER_QUARTERS).length,4);assert.equal(Config.PLINKO_SLOTS[3].id,"jackpot");assert.equal(Config.FUTURE_MAFIA_GAME.playable,true);assert.equal(Config.MAFIA_CARDS.length,23);assert.equal(Config.MAFIA_EVENTS.length,16);assert.equal(Config.MAFIA_OPPONENTS.length,9);assert.equal(Config.MINIGAMES.length,11);
});

test("manholes unlock through clues and support entering and leaving the persistent sewer world",()=>{
  const core=game();assert.equal(core.inspectManhole("sunny-manhole","open").ok,false);assert.ok(core.inspectManhole("sunny-manhole","inspect").ok);assert.ok(core.inspectManhole("sunny-manhole","listen").ok);assert.ok(core.inspectManhole("sunny-manhole","symbol").ok);assert.ok(core.inspectManhole("sunny-manhole","open").ok);assert.equal(core.state.sewer.inventory["empty-bottle"],1);assert.ok(core.enterSewer("sunny-manhole").ok);assert.equal(core.state.sewer.active,true);assert.equal(core.state.sewer.player.section,"front-drain-entrance");assert.ok(core.leaveSewer().ok);assert.equal(core.state.sewer.active,false);assert.equal(core.state.sewer.entrances["sunny-manhole"].status,"permanently-unlocked");
});

test("Green Sewer Water needs a free owned container and respects respawn cooldown",()=>{
  const core=game();assert.equal(core.collectGreenWater("entrance-drip","empty-bottle").ok,false);core.state.sewer.inventory["empty-bottle"]=1;const first=core.collectGreenWater("entrance-drip","empty-bottle");assert.ok(first.ok);assert.equal(core.state.sewer.samples.length,1);assert.equal(core.collectGreenWater("entrance-drip","empty-bottle").ok,false);core.state.sewer.samples[0].consumed=true;assert.equal(core.collectGreenWater("entrance-drip","empty-bottle").ok,false);core.state.sewer.collectionPoints["entrance-drip"].readyAt=core.now-1;assert.ok(core.collectGreenWater("entrance-drip","empty-bottle").ok);
});

test("sewer experiments deduct inputs, finish on timers, discover recipes, and collect once",()=>{
  const core=game(()=>0);Object.assign(core.state.sewer.lab,{discovered:true,electricity:true,fuseInstalled:true,machineRepaired:true});core.state.sewer.inventory["sample-jar"]=1;core.state.fruitInventory.apple=2;const sample=core.collectGreenWater("entrance-drip","sample-jar").sample,before=core.state.fruitInventory.apple;const started=core.startSewerExperiment({sampleId:sample.id,ingredient:"apple",intensity:"gentle",duration:"quick"});assert.ok(started.ok);assert.equal(core.state.fruitInventory.apple,before-1);assert.equal(core.state.sewer.samples.find(item=>item.id===sample.id).consumed,true);assert.equal(core.startSewerExperiment({sampleId:sample.id,ingredient:"apple"}).ok,false);started.experiment.readyAt=core.now-1;const collected=core.collectSewerExperiment(started.experiment.id);assert.ok(collected.ok);assert.equal(core.state.sewer.inventory["glowing-apple"],1);assert.ok(core.state.sewer.lab.recipes["glowing-apple"]);assert.equal(core.state.sewer.lab.restored,true);assert.equal(core.state.sewer.entrances["juice-manhole"].permanent,true);assert.equal(core.collectSewerExperiment(started.experiment.id).ok,false);
});

test("the complete sewer maze map is restricted to the entrance",()=>{
  const core=game();core.state.sewer.active=true;core.state.sewer.player={x:20,y:160,section:"front-drain-entrance"};assert.equal(core.canViewMazeMap(),false);assert.equal(core.studyMazeMap().ok,false);core.state.sewer.player={x:120,y:105,section:"maze-entrance"};core.state.sewer.maze.crossedStartLine=false;core.updateSewerLocation();assert.equal(core.canViewMazeMap(),true);assert.ok(core.studyMazeMap().ok);core.state.sewer.player={x:140,y:89,section:"red-pipe-quarter"};core.updateSewerLocation();assert.equal(core.state.sewer.maze.crossedStartLine,true);assert.equal(core.canViewMazeMap(),false);
});

test("maze valves, gates, shortcuts, and treasures persist and cannot reward twice",()=>{
  const core=game();assert.ok(core.turnSewerValve("entrance-valve").ok);assert.equal(core.state.sewer.maze.gates["channel-gate"],true);core.state.sewer.inventory["charged-sewer-sample"]=1;assert.ok(core.unlockSewerGate("charged-gate").ok);assert.equal(core.state.sewer.inventory["charged-sewer-sample"],0);core.state.sewer.inventory["maintenance-key"]=1;assert.ok(core.openSewerShortcut("lab-drain").ok);assert.equal(core.openSewerShortcut("lab-drain").ok,false);const coins=core.state.fruitCoins;assert.ok(core.collectSewerTreasure("coin-nook").ok);assert.ok(core.state.fruitCoins>coins);const after=core.state.fruitCoins;assert.equal(core.collectSewerTreasure("coin-nook").ok,false);assert.equal(core.state.fruitCoins,after);
});

test("pump hub, maintenance wing, and every surface manhole unlock persistently",()=>{
  const core=game();core.state.sewer.inventory["copper-wire"]=1;core.state.sewer.inventory["generator-gear"]=1;assert.ok(core.repairSewerPump("red-pump").ok);assert.equal(core.state.sewer.entrances["depot-manhole"].openedFromUnderground,true);assert.ok(core.repairSewerPump("blue-pump").ok);assert.ok(core.repairSewerPump("yellow-pump").ok);assert.equal(core.state.sewer.pumps.fullyRepaired,true);assert.ok(core.recoverMaintenanceEquipment().ok);assert.ok(core.solveMaintenancePuzzle().ok);assert.equal(core.state.sewer.maze.gates["pressure-gate"],true);assert.ok(core.unlockManholeFromUnderground("market-manhole").ok);assert.ok(core.unlockManholeFromUnderground("juice-manhole").ok);assert.ok(core.unlockManholeFromUnderground("mafia-alley-manhole").ok);for(const entrance of Config.SEWER_ENTRANCES){const progress=core.state.sewer.entrances[entrance.id];if(entrance.id==="sunny-manhole"){core.inspectManhole(entrance.id,"inspect");core.inspectManhole(entrance.id,"open");}assert.equal(progress.open,true,entrance.name);assert.equal(progress.permanent,true,entrance.name);}
});

test("all four fixed maze quarter puzzles award emblems and open Black-Pipe Center",()=>{
  const core=game();assert.ok(core.adjustRedPressure(1).ok);assert.ok(core.adjustRedPressure(2).ok);assert.ok(core.adjustRedPressure(2).ok);assert.equal(core.state.sewer.maze.emblems.red,true);for(const level of ["high","middle","low"])assert.ok(core.setBlueWaterLevel(level).ok);assert.equal(core.state.sewer.maze.emblems.blue,true);for(const part of Config.SEWER_QUARTERS.yellow.parts)core.state.sewer.inventory[part]=1;for(const part of Config.SEWER_QUARTERS.yellow.parts)assert.ok(core.installYellowPart(part).ok);assert.ok(core.routeYellowPower("lab").ok);assert.equal(core.state.sewer.maze.emblems.yellow,true);core.state.sewer.samples.push({id:"safe-water",pointId:"purifier-outlet",waterId:"filtered-sewer-water",quality:"Filtered Sewer Water",containerId:"sample-jar",consumed:false});assert.ok(core.testGreenSample("safe-water").ok);assert.ok(core.redirectGreenIrrigation().ok);assert.equal(core.state.sewer.maze.emblems.green,true);assert.ok(core.insertMazeEmblems().ok);assert.equal(core.state.sewer.maze.centerOpen,true);assert.equal(core.state.sewer.maze.gates["forgotten-lab-door"],true);assert.equal(core.state.sewer.maze.shortcuts["center-ring"],true);assert.equal(core.insertMazeEmblems().ok,false);
});

test("Test Lab restoration, Forgotten Lab, and Underground Garden form the complete sewer journey",()=>{
  const core=game(()=>0);core.state.sewer.maze.yellow.completed=true;core.state.sewer.lab.discovered=true;core.state.sewer.inventory["replacement-pump-fuse"]=1;core.state.sewer.inventory["maintenance-key"]=1;assert.ok(core.restoreSewerLab("electricity").ok);assert.ok(core.restoreSewerLab("fuse").ok);assert.ok(core.restoreSewerLab("repair").ok);core.state.sewer.inventory["sample-jar"]=1;core.state.fruitInventory.apple=1;const sample=core.collectGreenWater("entrance-drip","sample-jar").sample,started=core.startSewerExperiment({sampleId:sample.id,ingredient:"apple",duration:"quick"});started.experiment.readyAt=core.now-1;assert.ok(core.collectSewerExperiment(started.experiment.id).ok);assert.equal(core.state.sewer.lab.restored,true);core.state.sewer.maze.emblems.red=true;assert.ok(core.discoverForgottenLab().ok);assert.equal(core.state.secrets["forgotten-fruit-laboratory"].discovered,true);core.state.sewer.garden.unlocked=true;core.state.sewer.maze.green.completed=true;assert.ok(core.restoreUndergroundGarden().ok);core.state.sewer.inventory["mutant-seed"]=1;assert.ok(core.plantSewerGarden("mutant-seed").ok);assert.equal(core.state.sewer.garden.plots["mutant-seed"].planted,1);
});

test("discovery, chalk marks, emergency returns, and one-time center treasure survive reload",()=>{
  const core=enrich(game());core.state.sewer.active=true;for(const section of Config.SEWER_SECTIONS)core.discoverSewerSection(section.id);assert.equal(core.state.sewer.discovery.sewerPercent,100);core.state.sewer.inventory["chalk-marker"]=2;assert.ok(core.placeChalkMarker("left",150,80).ok);assert.ok(core.placeChalkMarker("treasure",151,80).ok);assert.equal(core.placeChalkMarker("invalid").ok,false);core.state.sewer.inventory["emergency-return-token"]=1;core.state.sewer.maze.emblems.red=true;assert.ok(core.useEmergencyReturn().ok);assert.equal(core.state.sewer.player.section,"maze-entrance");assert.equal(core.state.sewer.maze.emblems.red,true);assert.ok(core.collectSewerTreasure("center-chest").ok);const restored=migrateSave(JSON.parse(serializeState(core.state)));assert.equal(restored.sewer.discovery.sewerPercent,100);assert.equal(restored.sewer.maze.treasures["center-chest"],true);assert.equal(restored.sewer.maze.fixedLayout,Config.SEWER_WORLD.layoutId);assert.equal(restored.sewer.maze.emblems.red,true);
});

test("restored Underground Garden crops finish offline and harvest renewably without duplicate collection",()=>{
  const core=game();core.state.sewer.garden.unlocked=true;core.state.sewer.maze.green.completed=true;core.restoreUndergroundGarden();core.state.sewer.inventory["mutant-seed"]=1;assert.ok(core.plantSewerGarden("mutant-seed").ok);core.state.sewer.garden.plots["mutant-seed"].readyAt=core.now-1;const before=core.state.sewer.inventory["mutant-seed"];assert.ok(core.harvestSewerGarden("mutant-seed").ok);assert.equal(core.state.sewer.inventory["mutant-seed"],before+2);assert.equal(core.harvestSewerGarden("mutant-seed").ok,false);assert.ok(core.plantSewerGarden("mutant-seed").ok);
});

test("sewer characters become remembered phone contacts and can unlock route clues",()=>{
  const core=game();assert.ok(core.talkSewerCharacter("lost-delivery-driver").ok);assert.equal(core.state.sewer.characters["lost-delivery-driver"].met,true);assert.ok(core.state.phone.contacts["lost-delivery-driver"]);assert.equal(core.state.sewer.quests["help-a-lost-worker"].completed,true);const messages=core.state.phone.messages.length;assert.ok(core.talkSewerCharacter("lost-delivery-driver").ok);assert.equal(core.state.phone.messages.length,messages);
});

test("all new sewer secrets require clues and award discovery only once",()=>{
  const core=enrich(game());for(const secret of Config.SEWER_SECRETS){while(core.state.sewer.secrets[secret.id].clues<secret.clueTarget)assert.ok(core.investigateSewerSecret(secret.id,"clue").ok);assert.ok(core.investigateSewerSecret(secret.id,"investigate").ok);const coins=core.state.fruitCoins;assert.equal(core.investigateSewerSecret(secret.id,"investigate").ok,false);assert.equal(core.state.fruitCoins,coins);}
});

test("Fruit Mafia membership requires an atomic one-time $100 fictional Cash payment",()=>{
  const core=game();core.state.sewer.mafia.invitation=true;core.state.sewer.maze.centerOpen=true;core.state.sewer.maze.mafiaSymbol=true;core.state.cash=99;assert.equal(core.buyMafiaMembership().ok,false);assert.equal(core.state.cash,99);assert.equal(core.state.sewer.mafia.membership,false);core.state.cash=100;assert.ok(core.buyMafiaMembership().ok);assert.equal(core.state.cash,0);assert.equal(core.state.sewer.mafia.membership,true);assert.equal(core.state.sewer.inventory["club-membership-card"],1);assert.equal(core.state.sewer.entrances["mafia-alley-manhole"].permanent,true);assert.equal(core.buyMafiaMembership().ok,false);assert.equal(core.state.cash,0);
});

test("Club Chip spending is safe and Plinko's favored center result matches its visual slot and pays once",()=>{
  const core=game(()=>0);core.state.sewer.mafia.membership=true;assert.equal(core.spendClubChips(1).ok,false);assert.equal(core.state.sewer.mafia.clubChips,0);const started=core.startPlinko(3);assert.ok(started.ok);assert.equal(started.run.cost,0);assert.equal(started.run.slotIndex,3);assert.equal(started.run.visualSlot,3);started.run.readyAt=core.now-1;const reward=core.collectPlinko(started.run.id);assert.ok(reward.ok);assert.equal(reward.slotId,"jackpot");const chips=core.state.sewer.mafia.clubChips,cash=core.state.cash;assert.equal(core.collectPlinko(started.run.id).ok,false);assert.equal(core.state.sewer.mafia.clubChips,chips);assert.equal(core.state.cash,cash);
});

test("fruit slot reels match their stored outcome, use Club Chips, and pay once",()=>{
  const core=game(()=>0);core.state.sewer.mafia.membership=true;core.state.sewer.mafia.clubChips=4;const started=core.startFruitSlots();assert.ok(started.ok);assert.deepEqual(started.spin.reels,started.spin.visualReels);assert.deepEqual(started.spin.reels,["🍎","🍎","🍎"]);assert.equal(core.state.sewer.mafia.clubChips,0);started.spin.readyAt=core.now-1;assert.ok(core.collectFruitSlots(started.spin.id).ok);const chips=core.state.sewer.mafia.clubChips;assert.equal(core.collectFruitSlots(started.spin.id).ok,false);assert.equal(core.state.sewer.mafia.clubChips,chips);assert.equal(typeof core.startFutureMafiaGame,"undefined");
});

test("offline progress completes but does not collect a sewer experiment reward",()=>{
  const core=game(()=>0);Object.assign(core.state.sewer.lab,{discovered:true,electricity:true,fuseInstalled:true,machineRepaired:true});core.state.sewer.inventory["sample-jar"]=1;core.state.fruitInventory.lemon=1;const sample=core.collectGreenWater("entrance-drip","sample-jar").sample,started=core.startSewerExperiment({sampleId:sample.id,ingredient:"lemon",duration:"quick"});started.experiment.readyAt=core.now-1000;core.state.lastTick=core.now-4000;const report=core.applyOfflineProgress(core.now);assert.equal(report.sewerExperiments,1);assert.equal(started.experiment.status,"ready");assert.equal(core.state.sewer.inventory["sewer-lemonade"],0);assert.equal(started.experiment.collected,false);assert.ok(core.collectSewerExperiment(started.experiment.id).ok);assert.equal(core.state.sewer.inventory["sewer-lemonade"],1);
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
