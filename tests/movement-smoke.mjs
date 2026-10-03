const endpoint = process.env.TYCOON_CDP_ENDPOINT || "http://127.0.0.1:9246";
const gameUrl = process.env.TYCOON_GAME_URL || "http://127.0.0.1:8080";
const pages = await fetch(`${endpoint}/json/list`).then(response => response.json());
const page = pages.find(entry => entry.type === "page" && entry.url.startsWith(gameUrl));
if (!page) throw new Error("Amusement Park Tycoon page not found");

const socket = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});
let id = 0;
const pending = new Map();
const exceptions = [];
socket.addEventListener("message", event => {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) {
    const request = pending.get(message.id); pending.delete(message.id);
    message.error ? request.reject(new Error(message.error.message)) : request.resolve(message.result);
  }
  if (message.method === "Runtime.exceptionThrown") exceptions.push(message.params.exceptionDetails.exception?.description || message.params.exceptionDetails.text);
});
const command = (method, params = {}) => {
  const requestId = ++id;
  socket.send(JSON.stringify({ id: requestId, method, params }));
  return new Promise((resolve, reject) => pending.set(requestId, { resolve, reject }));
};
const evaluate = async expression => {
  const response = await command("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (response.exceptionDetails) throw new Error(response.exceptionDetails.exception?.description || response.exceptionDetails.text);
  return response.result.value;
};
const wait = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));
const expect = (condition, message) => { if (!condition) throw new Error(message); };

await command("Runtime.enable");
await command("Page.enable");
await command("Page.bringToFront");
const scenario = { version: 1, profile: "Mover", registered: true, toolkit: true, cash: 50500, speed: 0, player: { x: 8, y: 12, z: 0 } };
const preload = await command("Page.addScriptToEvaluateOnNewDocument", {
  source: `localStorage.setItem('amusement-park-tycoon-v1', ${JSON.stringify(JSON.stringify(scenario))});`
});
await command("Page.reload", { ignoreCache: true });
await wait(700);
await command("Page.removeScriptToEvaluateOnNewDocument", { identifier: preload.identifier });
await evaluate("document.querySelector('#enterGame').click(); true");
await wait(100);
await evaluate("window.__movementKeys=[]; window.addEventListener('keydown', event => window.__movementKeys.push(event.key)); true");

const readPlayer = async () => {
  await evaluate("window.dispatchEvent(new Event('beforeunload')); true");
  return evaluate("JSON.parse(localStorage.getItem('amusement-park-tycoon-v1')).player");
};

const start = await readPlayer();
await command("Input.dispatchKeyEvent", { type: "keyDown", key: "w", code: "KeyW", windowsVirtualKeyCode: 87 });
await wait(650);
await command("Input.dispatchKeyEvent", { type: "keyUp", key: "w", code: "KeyW", windowsVirtualKeyCode: 87 });
await wait(50);
const afterW = await readPlayer();
const receivedKeys = await evaluate("window.__movementKeys");
const visibility = await evaluate("document.visibilityState");
expect(afterW.y < start.y - .3, `W did not move the player: ${start.y} -> ${afterW.y}; received ${JSON.stringify(receivedKeys)}; visibility ${visibility}; exceptions ${JSON.stringify(exceptions)}`);

await command("Input.dispatchKeyEvent", { type: "keyDown", key: "ArrowRight", code: "ArrowRight", windowsVirtualKeyCode: 39 });
await wait(650);
await command("Input.dispatchKeyEvent", { type: "keyUp", key: "ArrowRight", code: "ArrowRight", windowsVirtualKeyCode: 39 });
await wait(50);
const afterArrow = await readPlayer();
expect(afterArrow.x > afterW.x + .3, `ArrowRight did not move the player: ${afterW.x} -> ${afterArrow.x}`);
expect(exceptions.length === 0, `Runtime exceptions: ${exceptions.join("\n")}`);

const clickScenario = { version: 1, profile: "", registered: false, toolkit: false, cash: 0, speed: 0, player: { x: 8, y: 12, z: 0 } };
const clickPreload = await command("Page.addScriptToEvaluateOnNewDocument", {
  source: `localStorage.setItem('amusement-park-tycoon-v1', ${JSON.stringify(JSON.stringify(clickScenario))});`
});
await command("Page.reload", { ignoreCache: true });
await wait(700);
await command("Page.removeScriptToEvaluateOnNewDocument", { identifier: clickPreload.identifier });
await evaluate("document.querySelector('#enterGame').click(); true");
const jobShackPoint = await evaluate(`(() => {
  const canvas = document.querySelector('#world');
  const rect = canvas.getBoundingClientRect();
  const x = rect.left + rect.width * .38 + (3.5 - 10.5) * 32;
  const y = rect.top + 58 + (3.5 + 10.5) * 16;
  const element = document.elementFromPoint(x, y);
  return { x, y, element: element?.id || element?.className || element?.tagName };
})()`);
await command("Input.dispatchMouseEvent", { type: "mousePressed", button: "left", clickCount: 1, x: jobShackPoint.x, y: jobShackPoint.y });
await command("Input.dispatchMouseEvent", { type: "mouseReleased", button: "left", clickCount: 1, x: jobShackPoint.x, y: jobShackPoint.y });
await wait(5000);
const clickResult = await evaluate(`(() => {
  window.dispatchEvent(new Event('beforeunload'));
  return {
    registrationOpen: document.querySelector('#modal').textContent.includes('Register your operator profile'),
    player: JSON.parse(localStorage.getItem('amusement-park-tycoon-v1')).player,
    destination: document.querySelector('#worldMessage').textContent,
    clickedElement: ${JSON.stringify(jobShackPoint.element)}
  };
})()`);
expect(clickResult.registrationOpen, `Click-to-walk did not open Job Shack registration: ${JSON.stringify(clickResult)}`);

socket.close();
console.log(JSON.stringify({ ok: true, start, afterW, afterArrow, clickResult }, null, 2));
