import {connect,expect} from "./cdp.mjs";

const browser=await connect();
const{command,evaluate,wait}=browser;

try{
  await command("Network.enable");
  const registrationReady=await evaluate("navigator.serviceWorker.getRegistration().then(Boolean)");
  expect(registrationReady,"Fruitopia must install its offline service worker before an offline reload");
  await command("Network.emulateNetworkConditions",{offline:true,latency:0,downloadThroughput:0,uploadThroughput:0});
  await command("Page.reload",{ignoreCache:true});
  await wait(350);
  for(let attempt=0;attempt<120;attempt++){if(await evaluate("Boolean(window.__FRUITOPIA__?.world)"))break;await wait(100);}
  const offline=await evaluate(`({
    title:document.title,
    game:Boolean(window.__FRUITOPIA__),
    canvas:Boolean(document.querySelector('#world')),
    cash:document.querySelector('#cashValue')?.textContent,
    status:document.querySelector('#connectionStatus')?.textContent
  })`);
  expect(offline.title==="Fruitopia Tycoon","Offline navigation did not return the Fruitopia app shell");
  expect(offline.game&&offline.canvas,"Fruitopia did not initialize from its offline cache");
  expect(offline.cash,"Offline reload lost the game HUD");
  expect(offline.status?.includes("Offline mode"),"Offline status was not explained to the player");
  console.log(JSON.stringify({ok:true,offline},null,2));
}finally{
  await command("Network.emulateNetworkConditions",{offline:false,latency:0,downloadThroughput:-1,uploadThroughput:-1}).catch(()=>{});
  browser.close();
}
