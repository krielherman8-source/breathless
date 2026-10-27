// v0.3.7 death-screen flow in a real page (fresh profile): die -> click -> reload -> title Continue restores the last save;
// New game wipes it. usage: node --experimental-websocket play/run_deathflow.mjs [outjson]
import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
const OUT = process.argv[2] || '/tmp/death.json', PORTW = process.env.PORT || 8766;
const prof = mkdtempSync('/tmp/blst-'), port = 9450 + Math.floor(Math.random() * 40);
const chrome = spawn('google-chrome', ['--headless=new', '--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--window-size=800,450',
  '--remote-debugging-port=' + port, '--user-data-dir=' + prof, 'about:blank'], { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms));
let ws, id = 0; const pend = new Map(), errs = [];
async function connect(){ for (let i = 0; i < 100; i++){ try { const l = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); const p = l.find(x => x.type === 'page'); if (p) return p.webSocketDebuggerUrl; } catch (e){} await sleep(200); } throw new Error('no chrome'); }
const send = (method, params = {}) => new Promise(res => { const i = ++id; pend.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (e) => { const r = await send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true }); if (r.result?.exceptionDetails) throw new Error('eval: ' + JSON.stringify(r.result.exceptionDetails).slice(0, 300)); return r.result?.result?.value; };
const until = async (e, ms = 30000) => { const t0 = Date.now(); while (Date.now() - t0 < ms){ try { if (await ev(e)) return true; } catch (x){} await sleep(250); } return false; };
const out = {}; let code = 1;
try {
  ws = new WebSocket(await connect()); await new Promise(r => ws.onopen = r);
  ws.onmessage = m => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)){ pend.get(d.id)(d); pend.delete(d.id); }
    if (d.method === 'Runtime.exceptionThrown') errs.push(JSON.stringify(d.params.exceptionDetails).slice(0, 300)); };
  await send('Runtime.enable');
  await send('Page.navigate', { url: `http://localhost:${PORTW}/index.html?cb=${Date.now()}` });
  await until(`!!window.__breathless?.game`, 60000);
  // A: fresh title -> start -> play a little -> save (marker scrap 37) -> die on the surface
  out.A = await ev(`(async () => { const B = window.__breathless, g = B.game, SV = B.save; B.introMarkSeen?.();
    const noSave = document.getElementById('savebox').style.display !== 'flex'; document.getElementById('start').click(); await new Promise(r => setTimeout(r, 1500));
    g.scrap = 37; const sv = SV.saveNow('test'); await new Promise(r => setTimeout(r, 300));
    const al = g.airlock; g.player.pos.set(0, 0, al.zOuter + 6); g.player.suit = 0; g.player.breath = .5;
    return { noSave, started: !document.body.classList.contains('pregame'), saved: !!sv && sv.ok !== false }; })()`);
  await ev(`(() => { const g = window.__breathless.game; for (let t = 0; t < 300 && !g.over; t += .1){ g.player.pos.set(0, 0, g.airlock.zOuter + 6); g.player.suit = 0; g.step(.1, { keys: {} }); } return true; })()`);   // headless has no pointer lock, so drive the sim by hand
  out.A.died = await until(`window.__breathless.game.over === true`, 5000);
  await sleep(2500);   // autosave window after death: must not overwrite
  out.A.screen = await ev(`({ shown: document.getElementById('over').style.display, hint: document.getElementById('overhint').textContent, saveScrap: window.__breathless.save.saveRead().snap?.d?.scrap, dead: window.__breathless.save.SAVE_RT.dead })`);
  await ev(`document.getElementById('over').click(), true`); await sleep(1500);
  await until(`!!window.__breathless?.game && document.readyState === 'complete'`, 60000); await sleep(1500);
  // B: after the reload the title offers Continue; Continue = the saved run, alive
  out.B = await ev(`(async () => { const B = window.__breathless, g = B.game; const box = document.getElementById('savebox').style.display;
    document.getElementById('btnContinue').click(); await new Promise(r => setTimeout(r, 1500));
    return { box, scrap: g.scrap, over: g.over, dead: !!g.player.dead, suit: Math.round(g.player.suit), playing: !document.body.classList.contains('pregame'), obj: g.objective?.id, objDone: !!g.objective?.done }; })()`);
  // C: die again with no further save -> click -> title -> New game wipes the save and starts fresh at the pod
  await ev(`(() => { const g = window.__breathless.game; for (let t = 0; t < 300 && !g.over; t += .1){ g.player.pos.set(0, 0, g.airlock.zOuter + 6); g.player.suit = 0; g.step(.1, { keys: {} }); } return true; })()`);
  out.C = { died: await until(`window.__breathless.game.over === true`, 5000) };
  await ev(`document.getElementById('over').click(), true`); await sleep(1500);
  await until(`!!window.__breathless?.game && document.readyState === 'complete'`, 60000); await sleep(1500);
  out.C.box = await ev(`document.getElementById('savebox').style.display`);
  await ev(`document.getElementById('btnNew').click(), true`); await sleep(1500);
  await until(`!!window.__breathless?.game && document.readyState === 'complete'`, 60000); await sleep(1500);
  out.C.after = await ev(`({ box: document.getElementById('savebox').style.display, save: !!window.__breathless.save.saveRead().ok, scrap: window.__breathless.game.scrap, obj: window.__breathless.game.objective?.id, objDone: !!window.__breathless.game.objective?.done })`);
  await ev(`document.getElementById('start').click(), true`); await sleep(1500);
  out.C.fresh = await ev(`({ playing: !document.body.classList.contains('pregame'), over: window.__breathless.game.over, obj: window.__breathless.game.objective?.id, nearPod: window.__breathless.slice?.pod ? Math.round(window.__breathless.game.player.pos.distanceTo(window.__breathless.slice.pod.pos)) : null })`);
  out.errs = errs;
  out.ok = !!(out.A.noSave && out.A.started && out.A.died && out.A.screen.shown === 'flex' && /continue/i.test(out.A.screen.hint) && out.A.screen.saveScrap === 37
    && out.B.box === 'flex' && out.B.scrap === 37 && !out.B.over && !out.B.dead && out.B.playing && out.B.obj === 'shelter' && !out.B.objDone
    && out.C.died && out.C.box === 'flex' && out.C.after.box !== 'flex' && !out.C.after.save && out.C.after.scrap !== 37 && out.C.after.obj === 'shelter' && !out.C.after.objDone && out.C.fresh.playing && !out.C.fresh.over && !errs.length);
  console.log(JSON.stringify(out)); code = out.ok ? 0 : 2;
} catch (e){ out.fail = e.message; console.log('FAIL', e.message, JSON.stringify(out)); }
writeFileSync(OUT, JSON.stringify(out));
try { ws?.close(); } catch (e){} chrome.kill('SIGKILL'); await sleep(300); try { rmSync(prof, { recursive: true, force: true }); } catch (e){}
process.exit(code);
