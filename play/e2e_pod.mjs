// v3.1.1 e2e: fresh profile → New game → real held-W key events from the crash spawn → walk to the bunker airlock.
// usage: node --experimental-websocket play/e2e_pod.mjs [url]   (default local server on :8765)
import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
const URL = process.argv[2] || 'http://localhost:8765/index.html', SHOT = process.argv[3] || '';
const prof = mkdtempSync('/tmp/blpod-'), port = 9340 + Math.floor(Math.random() * 50);
const chrome = spawn('google-chrome', ['--headless=new', '--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--hide-scrollbars',
  '--window-size=1280,800', '--remote-debugging-port=' + port, '--user-data-dir=' + prof, 'about:blank'], { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms));
let ws, id = 0; const pend = new Map();
async function connect(){ for (let i = 0; i < 50; i++){ try { const l = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); const p = l.find(x => x.type === 'page'); if (p) return p.webSocketDebuggerUrl; } catch (e){} await sleep(200); } throw new Error('no chrome'); }
const send = (method, params = {}) => new Promise(res => { const i = ++id; pend.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true, userGesture: true }); if (r.result?.exceptionDetails) throw new Error(JSON.stringify(r.result.exceptionDetails).slice(0, 400)); return r.result?.result?.value; };
const key = (type) => send('Input.dispatchKeyEvent', { type, key: 'w', code: 'KeyW', windowsVirtualKeyCode: 87 });
const out = { url: URL };
try {
  ws = new WebSocket(await connect()); await new Promise(r => ws.onopen = r);
  ws.onmessage = m => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)){ pend.get(d.id)(d); pend.delete(d.id); } };
  await send('Page.enable'); await send('Runtime.enable');
  // headless Chrome has no real pointer lock: emulate the browser granting it (the game then runs exactly as when you click in)
  await send('Page.addScriptToEvaluateOnNewDocument', { source: `(() => { let el = null; Object.defineProperty(Document.prototype, 'pointerLockElement', { get(){ return el; }, configurable: true });
    Element.prototype.requestPointerLock = function(){ el = this; setTimeout(() => document.dispatchEvent(new Event('pointerlockchange')), 0); return Promise.resolve(); };
    Document.prototype.exitPointerLock = function(){ el = null; setTimeout(() => document.dispatchEvent(new Event('pointerlockchange')), 0); }; })();` });
  await send('Page.navigate', { url: URL + '?cb=' + Date.now() }); await sleep(4000);
  await ev(`localStorage.clear(); localStorage.setItem('breathless_seenIntro', '1'); true`);
  await send('Page.navigate', { url: URL + '?cb=' + Date.now() }); await sleep(5000);
  out.ver = await ev(`document.querySelector('.ver')?.textContent`);
  await ev(`(document.getElementById('btnNew')?.offsetParent ? document.getElementById('btnNew') : document.getElementById('start')).click(); true`);
  await sleep(1500);
  out.spawn = await ev(`(() => { const g = window.__breathless.game, P = g.player; return { x: +P.pos.x.toFixed(2), z: +P.pos.z.toFixed(2), hit: g.world.hit(P.pos.x, P.pos.z, window.__breathless.CFG.player.radius), obj: g.objective?.label, zone: g.zoneAt(P.pos) }; })()`);
  // hold W and steer toward the airlock door (as a player turning the mouse would)
  const t0 = Date.now(), path = []; out.path = path; let g0 = null, moved2s = null, reached = false, lastP = 0; await key('keyDown');
  while (Date.now() - t0 < 90000){
    const s = await ev(`(() => { const g = window.__breathless.game, P = g.player, al = g.airlock, tx = 0, tz = al.zMid; P.yaw = Math.atan2(-(tx - P.pos.x), -(tz - P.pos.z)); return { x: P.pos.x, z: P.pos.z, zone: g.zoneAt(P.pos), gt: g.time }; })()`);
    if (g0 == null) g0 = s.gt;
    if (moved2s == null && s.gt - g0 > 1) moved2s = +Math.hypot(s.x - out.spawn.x, s.z - out.spawn.z).toFixed(2);
    if (Date.now() - lastP > 3000){ lastP = Date.now(); path.push([+s.x.toFixed(2), +s.z.toFixed(2), s.gt]); }
    if (s.zone === 'airlock'){ reached = true; break; }
    await sleep(100);
  }
  await key('keyUp');
  out.movedIn1GameSec = moved2s; out.reachedAirlock = reached; out.secs = +((Date.now() - t0) / 1000).toFixed(1);
  out.end = await ev(`(() => { const P = window.__breathless.game.player; return { x: +P.pos.x.toFixed(2), z: +P.pos.z.toFixed(2), unstucks: P.unstucks || 0 }; })()`);
  if (SHOT){ const r = await send('Page.captureScreenshot', { format: 'png' }); writeFileSync(SHOT, Buffer.from(r.result.data, 'base64')); }
  out.SUCCESS = !out.spawn.hit && moved2s > .5 && reached;
} catch (e){ out.error = String(e?.stack || e); }
console.log(JSON.stringify(out));
chrome.kill('SIGKILL'); process.exit(0);
