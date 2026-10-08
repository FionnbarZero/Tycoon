export const MAFIA_GAME={
  id:"fruit-mafia-mystery-crate",name:"Fruit Mafia: The Mystery Crate",host:"Don Durian",entryCost:4,
  minOpponents:3,maxOpponents:9,maxRebounds:5,
  description:"An original Fruitopia survival game where a mysterious crate creates each danger and the last fruit sitting wins."
};

const card=(id,name,icon,alignment,activation,duration,description)=>({id,name,icon,alignment,activation,duration,description});
export const MAFIA_CARDS=[
  card("rebound","Rebound","↩️","Positive","Reaction",0,"Redirect a crate blaster to the living player on your left or right."),
  card("ricochet-grape","Ricochet Grape","🍇","Positive","Automatic",0,"A blaster shot automatically bounces to a random opponent."),
  card("peel-shield","Peel Shield","🍌","Positive","Automatic",0,"Block the next attack, then discard this shield."),
  card("safety-crate","Safety Crate","🛡️","Positive","Passive",4,"Blocks one dangerous crate event while active."),
  card("banana-dodge","Banana Dodge","💨","Positive","Reaction",0,"Dodge a blaster, spring knife, buzz saw, or boxing-glove event."),
  card("choose-anyone","Choose Anyone","👆","Positive","Passive",4,"During a Spring Knife event, expand the legal targets beyond the adjacent chairs."),
  card("rebound-blade","Rebound Blade","↪️","Positive","Reaction",0,"Send a Spring Knife back toward the player who selected you."),
  card("side-step","Side Step","🪑","Neutral","Reaction",0,"Move a Spring Knife to the next living chair instead of taking the hit."),
  card("spare-them","Spare Them","🕊️","Positive","Reaction",0,"Cancel your Spring Knife attack and gain Fruit Mafia reputation."),
  card("bodyguard-berry","Bodyguard Berry","🫐","Positive","Manual",2,"Choose another character to intercept danger for two turns."),
  card("second-serving","Second Serving","🍽️","Positive","Automatic",0,"Return to the table once after an elimination."),
  card("night-vision-lime","Night-Vision Lime","🍋","Positive","Passive",5,"See the attacker and target during Lights Out."),
  card("fruit-vision","Fruit Vision","👁️","Positive","Manual",0,"Reveal one card belonging to every opponent."),
  card("pickpocket-monkey","Pickpocket Monkey","🐒","Positive","Manual",0,"Steal one random card from another living player."),
  card("magnetic-melon","Magnetic Melon","🧲","Neutral","Manual",2,"Force the Mystery Crate to choose you for the next event."),
  card("golden-bounty","Golden Bounty","🌟","Neutral","Passive",4,"Others gain a bonus for eliminating you; survive its timer to claim it yourself."),
  card("sticky-banana","Sticky Banana","🍌","Negative","Passive",3,"You cannot pass or redirect the next dangerous object."),
  card("sour-lemon","Sour Lemon","🍋","Negative","Passive",3,"Your next information card gives an uncertain answer."),
  card("marked-fruit","Marked Fruit","🎯","Negative","Passive",4,"The host is more likely to select you for dangerous events."),
  card("empty-peel","Empty Peel","🟨","Negative","Passive",3,"Occupies a card slot without providing a benefit."),
  card("chained-grapes","Chained Grapes","⛓️","Neutral","Passive",4,"Link to another player; elimination may tug the partner out too."),
  card("mafia-revenge","Mafia Revenge","🕶️","Positive","Automatic",4,"After surviving an opponent's attack, immediately send danger back."),
  card("secret-partner","Secret Partner","🤝","Neutral","Passive",6,"A secret ally shares a smaller reward if either partner wins.")
];
export const MAFIA_CARD_BY_ID=Object.fromEntries(MAFIA_CARDS.map(item=>[item.id,item]));

const event=(id,name,icon,kind,description)=>({id,name,icon,kind,description});
export const MAFIA_EVENTS=[
  event("cartoon-blaster","Cartoon Blaster","🔫","danger","The crate may fire, jam, spray confetti, or reveal a prize."),
  event("spring-knife","Spring Knife","🍌","decision","The chosen player must aim left or right before the spring snaps back."),
  event("buzz-saw-pass","Buzz Saw Pass","🍕","danger","A whirring pizza cutter circles the table and stops without warning."),
  event("rotten-fruit-bomb","Rotten Fruit Bomb","💣","decision","Pass a ticking rotten fruit left or right before the hidden timer ends."),
  event("target-card","Target Card","🎯","decision","Find the named target before the launcher turns around."),
  event("choose-a-card","Choose a Card","🃏","reward","Inspect three cards and keep exactly one."),
  event("dangerous-card-pile","Dangerous Card Pile","🗂️","risk","Five facedown choices hide cards, prizes, jams, and danger."),
  event("risk-for-a-card","Risk for a Card","⚖️","risk","Accept a powerful card with a chance of immediate crate trouble."),
  event("split-or-snatch","Split or Snatch","🍰","social","Two players secretly choose to share or snatch a card reward."),
  event("sewer-rat","Sewer Rat","🐀","chaos","A mechanical rat swaps hands, steals cards, drops chips, or restarts the crate."),
  event("mafia-vote","Mafia Vote","🗳️","vote","Everyone votes; the selected fruit faces a crate test."),
  event("lights-out","Lights Out","💡","danger","The room goes dark and only Night-Vision Lime reveals the danger."),
  event("hostage-crate","Hostage Crate","🔒","social","Contribute cards to open the security gate and rescue a trapped player."),
  event("mafia-duel","Mafia Duel","🤠","danger","Two fruit launchers face off; either one may fire or jam."),
  event("green-water-panic","Green-Water Panic","🟢","decision","A burst pipe forces everyone to choose a safe chair quickly."),
  event("jackpot-crate","Jackpot Crate","🎁","risk","The shining compartment may contain a prize, rare card, or disguised trap.")
];
export const MAFIA_EVENT_BY_ID=Object.fromEntries(MAFIA_EVENTS.map(item=>[item.id,item]));

export const MAFIA_OPPONENTS=[
  {id:"don-durian",name:"Don Durian",avatar:"🥭",personality:"Dramatic mastermind",risk:.64,bluff:.72,preferred:["mafia-revenge","golden-bounty"],targeting:"leader",dialogue:"The crate has impeccable timing. Usually."},
  {id:"bella-banana",name:"Bella Banana",avatar:"🍌",personality:"Cautious planner",risk:.24,bluff:.25,preferred:["peel-shield","banana-dodge"],targeting:"grudge",dialogue:"A saved shield is a future smile."},
  {id:"tommy-tomato",name:"Tommy Tomato",avatar:"🍅",personality:"Fearless hotshot",risk:.88,bluff:.42,preferred:["rebound","mafia-revenge"],targeting:"strong",dialogue:"Crate, pick me! I am almost ready!"},
  {id:"vinny-vine",name:"Vinny Vine",avatar:"🍇",personality:"Mischievous trickster",risk:.58,bluff:.9,preferred:["pickpocket-monkey","ricochet-grape"],targeting:"cards",dialogue:"I never bluff. That sentence was a bluff."},
  {id:"lola-lemon",name:"Lola Lemon",avatar:"🍋",personality:"Loyal diplomat",risk:.36,bluff:.2,preferred:["bodyguard-berry","secret-partner"],targeting:"grudge",dialogue:"Sour face, sweet alliance."},
  {id:"benny-blueberry",name:"Benny Blueberry",avatar:"🫐",personality:"Patient analyst",risk:.31,bluff:.33,preferred:["fruit-vision","night-vision-lime"],targeting:"leader",dialogue:"I have calculated three likely surprises."},
  {id:"marco-melon",name:"Marco Melon",avatar:"🍉",personality:"Competitive showman",risk:.7,bluff:.6,preferred:["magnetic-melon","golden-bounty"],targeting:"leader",dialogue:"Last fruit sitting? Save the chair for me."},
  {id:"ruby-raspberry",name:"Ruby Raspberry",avatar:"🫐",personality:"Vengeful tactician",risk:.53,bluff:.47,preferred:["mafia-revenge","rebound"],targeting:"grudge",dialogue:"I keep receipts—and rebound chains."},
  {id:"frankie-fig",name:"Frankie Fig",avatar:"🟣",personality:"Nervous negotiator",risk:.18,bluff:.65,preferred:["safety-crate","second-serving"],targeting:"weak",dialogue:"Could we vote for the crate instead?"}
];
export const MAFIA_OPPONENT_BY_ID=Object.fromEntries(MAFIA_OPPONENTS.map(item=>[item.id,item]));

export const MAFIA_FAMILY_LABELS={
  blaster:"Fruit Launcher",knife:"Spring Banana",saw:"Spinning Pizza Cutter",bomb:"Giant Juice Splash",hit:"cartoon fruit burst"
};
