// slice 29 e2e: real Chrome profile → play → F5 save → reload → Continue card → state restored → New game wipes.
// usage: node --experimental-websocket play/e2e_save.mjs   (server on :8765)
import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
const prof = mkdtempSync('/tmp/bl29-');
const chrome = spawn('google-chrome', ['--headless=new', '--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--hide-scrollbars',
  '--window-size=1280,800', '--remote-debugging-port=9333', '--user-data-dir=' + prof, 'about:blank'], { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms));
let ws, id = 0; const pend = new Map();
async function connect(){
  for (let i = 0; i < 50; i++){ try { const l = await (await fetch('http://127.0.0.1:9333/json')).json(); const p = l.find(x => x.type === 'page'); if (p) return p.webSocketDebuggerUrl; } catch (e){} await sleep(200); }
  throw new Error('no chrome');
}
const send = (method, params = {}) => new Promise(res => { const i = ++id; pend.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true, userGesture: true }); if (r.result?.exceptionDetails) throw new Error(JSON.stringify(r.result.exceptionDetails).slice(0, 400)); return r.result?.result?.value; };
const shot = async (path) => { const r = await send('Page.captureScreenshot', { format: 'png' }); writeFileSync(path, Buffer.from(r.result.data, 'base64')); };
const go = async (url) => { await send('Page.navigate', { url }); await sleep(3500); };
const out = {};
try {
  ws = new WebSocket(await connect());
  await new Promise(r => ws.onopen = r);
  ws.onmessage = m => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)){ pend.get(d.id)(d); pend.delete(d.id); } };
  await send('Page.enable'); await send('Runtime.enable');
  const URL = 'http://localhost:8765/index.html';
  await go(URL);
  await ev(`localStorage.clear(); localStorage.setItem('breathless_seenIntro', '1'); true`);
  await go(URL);
  out.fresh = await ev(`({ savebox: getComputedStyle(document.getElementById('savebox')).display, ver: document.querySelector('.ver').textContent })`);
  // start, build a little, F5
  out.play = await ev(`(() => {
    document.getElementById('start').click();
    const B = window.__breathless, g = B.game; g.freeBuild = true;
    let gen = null; for (let cx = -3; cx <= 3 && !gen; cx += .5) for (let cz = -2.5; cz <= 3.5 && !gen; cz += .5){ const c = g.builder.deviceCandidate('generator', cx, cz, 0); if (c.valid) gen = g.builder.placeDevice(c, { fuel: 555 }); }
    g.freeBuild = false;
    g.scrap = 31; g.giveItem('cable', 5); g.unlockRecipe('battery', 'e2e'); B.slice.table.setTier(2);
    g.player.pos.set(-1.5, 0, 2.2); g.player.yaw = .7;
    return { gen: !!gen, genAt: gen && gen.cells[0].join(','), gens: g.generators.length, inv: JSON.stringify(g.inv), scrap: g.scrap, tier: g.tables[0].tier };
  })()`);
  await sleep(300);
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'F5', code: 'F5', windowsVirtualKeyCode: 116 });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'F5', code: 'F5', windowsVirtualKeyCode: 116 });
  await sleep(500);
  out.afterF5 = await ev(`({ toast: document.getElementById('msg').textContent, has: !!localStorage.getItem('breathless_save_v1'), size: (localStorage.getItem('breathless_save_v1') || '').length, url: location.href })`);
  // reload (as a player would): title shows Continue
  await go(URL);
  out.reload = await ev(`(() => { const g = window.__breathless.game; return { savebox: getComputedStyle(document.getElementById('savebox')).display, info: document.getElementById('saveinfo').textContent,
    gens: g.generators.length, genFuel: g.generators.map(e => Math.round(e.fuel)), genAt: g.generators.map(e => e.cells[0].join(',')), inv: JSON.stringify(g.inv), scrap: g.scrap, battery: g.recipeUnlocked('battery'), tier: g.tables[0].tier,
    pos: [g.player.pos.x, g.player.pos.z].map(v => +v.toFixed(2)), warn: window.__breathless.save.SAVE_RT.loaded?.warn }; })()`);
  await shot('/workspace/breathless/play/slice29_continue.png');
  // Continue → gameplay, no intro
  out.cont = await ev(`(() => { document.getElementById('btnContinue').click(); return { start: getComputedStyle(document.getElementById('start')).display, intro: window.__breathless.intro.active }; })()`);
  await sleep(800);
  await ev(`document.getElementById('resume').style.display = 'none'; window.__breathless.game.ui.toast('Saved.', 4000); true`);
  await sleep(200);
  await shot('/workspace/breathless/play/slice29_loaded.png');
  // corrupt → fallback
  await ev(`window.__breathless.save.SAVE_RT.off = true; localStorage.setItem('breathless_save_v1', 'BLZ1:garbage!!'); localStorage.removeItem('breathless_save_v1_prev'); true`);
  await go(URL);
  out.corrupt = await ev(`({ savebox: getComputedStyle(document.getElementById('savebox')).display, note: document.getElementById('savenote').textContent, kept: !!localStorage.getItem('breathless_save_v1_corrupt'), gens: window.__breathless.game.generators.length })`);
  await shot('/workspace/breathless/play/slice29_corrupt.png');
  // save again, reload, New game wipes
  await ev(`(() => { document.getElementById('start').click(); window.__breathless.game.scrap = 77; window.__breathless.save.saveNow('manual'); return true; })()`);
  await go(URL);
  out.beforeNew = await ev(`({ savebox: getComputedStyle(document.getElementById('savebox')).display, scrap: window.__breathless.game.scrap })`);
  await ev(`document.getElementById('btnNew').click(); true`);
  await sleep(3500);
  out.afterNew = await ev(`({ has: !!localStorage.getItem('breathless_save_v1'), savebox: getComputedStyle(document.getElementById('savebox')).display, scrap: window.__breathless.game.scrap, gens: window.__breathless.game.generators.length })`);
  out.SUCCESS = out.play.gen && out.afterF5.has && /Saved/.test(out.afterF5.toast) && out.reload.savebox === 'flex' && out.reload.gens === out.play.gens
    && out.reload.genAt.includes(out.play.genAt) && out.reload.inv === out.play.inv && out.reload.scrap === 31 && out.reload.battery && out.reload.tier === 2
    && out.cont.start === 'none' && !out.cont.intro && out.corrupt.savebox === 'none' && out.corrupt.kept && /unreadable/.test(out.corrupt.note)
    && out.beforeNew.scrap === 77 && !out.afterNew.has && out.afterNew.savebox === 'none' && out.afterNew.scrap !== 77;
} catch (e){ out.error = String(e?.stack || e); }
console.log(JSON.stringify(out, null, 1));
chrome.kill('SIGKILL'); process.exit(0);
