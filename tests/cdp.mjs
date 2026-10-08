export async function connect({endpoint=process.env.TYCOON_CDP_ENDPOINT||"http://127.0.0.1:9246",gameUrl=process.env.TYCOON_GAME_URL||"http://127.0.0.1:8080"}={}){
  const pages=await fetch(`${endpoint}/json/list`).then(response=>response.json());
  const page=pages.find(entry=>entry.type==="page"&&entry.url.startsWith(gameUrl));
  if(!page)throw new Error(`Fruitopia Tycoon page not found at ${gameUrl}`);
  const socket=new WebSocket(page.webSocketDebuggerUrl);await new Promise((resolve,reject)=>{socket.addEventListener("open",resolve,{once:true});socket.addEventListener("error",reject,{once:true});});
  let id=0;const pending=new Map(),exceptions=[],consoleErrors=[];
  socket.addEventListener("message",event=>{const message=JSON.parse(event.data);if(message.id&&pending.has(message.id)){const request=pending.get(message.id);pending.delete(message.id);message.error?request.reject(new Error(message.error.message)):request.resolve(message.result);}if(message.method==="Runtime.exceptionThrown")exceptions.push(message.params.exceptionDetails.exception?.description||message.params.exceptionDetails.text);if(message.method==="Runtime.consoleAPICalled"&&message.params.type==="error")consoleErrors.push(message.params.args.map(arg=>arg.value||arg.description||"").join(" "));});
  const command=(method,params={})=>{const requestId=++id;socket.send(JSON.stringify({id:requestId,method,params}));return new Promise((resolve,reject)=>pending.set(requestId,{resolve,reject}));};
  const evaluate=async expression=>{const response=await command("Runtime.evaluate",{expression,awaitPromise:true,returnByValue:true});if(response.exceptionDetails)throw new Error(response.exceptionDetails.exception?.description||response.exceptionDetails.text);return response.result.value;};
  const wait=milliseconds=>new Promise(resolve=>setTimeout(resolve,milliseconds));
  await command("Runtime.enable");await command("Page.enable");await command("Page.bringToFront");
  return{socket,command,evaluate,wait,exceptions,consoleErrors,close:()=>socket.close()};
}

export const expect=(condition,message)=>{if(!condition)throw new Error(message);};
