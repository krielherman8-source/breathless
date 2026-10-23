// CDP screenshot runner (real time, fresh profile, one Chrome). usage: node --experimental-websocket play/run_shots.mjs prefix name1 name2 ...  -> play/<prefix>_<name>.png
import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
const [PREFIX, ...NAMES] = process.argv.slice(2), PORTW = process.env.PORT || 8766, WAIT = +process.env.WAIT || 6000;
const prof = mkdtempSync('/tmp/blst-'), port = 9450 + Math.floor(Math.random() * 40);
const chrome = spawn('google-chrome', ['--headless=new', '--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--hide-scrollbars', '--window-size=1280,800',
  '--remote-debugging-port=' + port, '--user-data-dir=' + prof, 'about:blank'], { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms));
let ws, id = 0; const pend = new Map();
async function connect(){ for (let i = 0; i < 100; i++){ try { const l = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); const p = l.find(x => x.type === 'page'); if (p) return p.webSocketDebuggerUrl; } catch (e){} await sleep(200); } throw new Error('no chrome'); }
const send = (method, params = {}) => new Promise(res => { const i = ++id; pend.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
try {
  ws = new WebSocket(await connect()); await new Promise(r => ws.onopen = r);
  ws.onmessage = m => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)){ pend.get(d.id)(d); pend.delete(d.id); } };
  for (const n of NAMES){
    await send('Page.navigate', { url: `http://localhost:${PORTW}/index.html?shot=${n}&cb=${Date.now()}` }); await sleep(WAIT);
    const r = await send('Page.captureScreenshot', { format: 'png' }); const f = `play/${PREFIX}_${n}.png`;
    writeFileSync(f, Buffer.from(r.result.data, 'base64')); console.log(f, r.result.data.length);
  }
} catch (e){ console.log('FAIL', e.message); }
try { ws?.close(); } catch (e){} chrome.kill('SIGKILL'); await sleep(300); try { rmSync(prof, { recursive: true, force: true }); } catch (e){}
process.exit(0);
