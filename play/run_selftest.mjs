// CDP selftest runner (real time, fresh profile). usage: node --experimental-websocket play/run_selftest.mjs [query] [outjson]
import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
const Q = process.argv[2] || 'selftest', OUT = process.argv[3] || '/tmp/st.json', PORTW = process.env.PORT || 8766;
const prof = mkdtempSync('/tmp/blst-'), port = 9400 + Math.floor(Math.random() * 50);
const chrome = spawn('google-chrome', ['--headless=new', '--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--window-size=800,450',
  '--remote-debugging-port=' + port, '--user-data-dir=' + prof, 'about:blank'], { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms));
let ws, id = 0; const pend = new Map(), errs = [];
async function connect(){ for (let i = 0; i < 100; i++){ try { const l = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); const p = l.find(x => x.type === 'page'); if (p) return p.webSocketDebuggerUrl; } catch (e){} await sleep(200); } throw new Error('no chrome'); }
const send = (method, params = {}) => new Promise(res => { const i = ++id; pend.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (e) => (await send('Runtime.evaluate', { expression: e, returnByValue: true })).result?.result?.value;
let code = 1;
try {
  ws = new WebSocket(await connect()); await new Promise(r => ws.onopen = r);
  ws.onmessage = m => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)){ pend.get(d.id)(d); pend.delete(d.id); }
    if (d.method === 'Runtime.exceptionThrown') errs.push(JSON.stringify(d.params.exceptionDetails).slice(0, 300)); };
  await send('Runtime.enable');
  await send('Page.navigate', { url: `http://localhost:${PORTW}/index.html?${Q}&cb=${Date.now()}` });
  const t0 = Date.now(); let txt = null;
  while (Date.now() - t0 < (+process.env.TMO || 900) * 1000){ txt = await ev(`document.getElementById('selftest')?.textContent || null`); if (txt) break; await sleep(2000); }
  if (!txt) throw new Error('timeout; errs=' + errs.join('|'));
  writeFileSync(OUT, txt); const d = JSON.parse(txt); delete d.trace;
  const sum = {}; for (const [k, v] of Object.entries(d)) sum[k] = (v && typeof v === 'object') ? (v.SUCCESS ?? v.ok ?? '-') : v;
  console.log(JSON.stringify(sum), 'secs', Math.round((Date.now() - t0) / 1000), errs.length ? 'ERRS ' + errs.join('|') : '');
  code = Object.values(sum).some(v => v === false) ? 2 : 0;
} catch (e){ console.log('FAIL', e.message); }
try { ws?.close(); } catch (e){} chrome.kill('SIGKILL'); await sleep(300); try { rmSync(prof, { recursive: true, force: true }); } catch (e){}
process.exit(code);
