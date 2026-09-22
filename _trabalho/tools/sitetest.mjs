// Teste do site no Edge headless: node sitetest.mjs [largura] [altura] [prefixo] [opções JSON]
// opções: {mobile:true, touch:true, reduce:true, block:true, heroPs:[...], sections:true, full:true}
import { launch, navigate } from './cdp.mjs';
import { writeFileSync, mkdirSync } from 'node:fs';
const W = +(process.argv[2] || 1440), H = +(process.argv[3] || 900), prefix = process.argv[4] || 'd';
const opt = JSON.parse(process.argv[5] || '{}');
const out = 'C:/Users/tvnn/Desktop/site minha mae/_trabalho/review/site';
mkdirSync(out, { recursive: true });
const c = await launch({ port: 9500 + Math.floor(Math.random() * 300) });
const logs = [];
c.on(m => {
  if (m.method === 'Runtime.consoleAPICalled' && ['error', 'warning'].includes(m.params.type)) logs.push(m.params.type + ': ' + m.params.args.map(a => a.value ?? a.description).join(' '));
  if (m.method === 'Runtime.exceptionThrown') logs.push('EXCEPTION: ' + (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text));
  if (m.method === 'Log.entryAdded' && m.params.entry.level === 'error') logs.push('LOG: ' + m.params.entry.text + ' ' + (m.params.entry.url || ''));
});
await c.send('Log.enable');
await c.send('Network.enable');
if (opt.block) await c.send('Network.setBlockedURLs', { urls: ['*hero-scrub.mp4'] });
await c.send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: opt.dpr || 1, mobile: !!opt.mobile });
if (opt.touch) await c.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
await c.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: opt.reduce ? 'reduce' : 'no-preference' }] });
const reqs = [];
c.on(m => { if (m.method === 'Network.requestWillBeSent') reqs.push(m.params.request.url); });
await navigate(c, 'http://localhost:8080/' + (opt.path || ''), 1200);
const sleep = ms => new Promise(r => setTimeout(r, ms));
// espera o vídeo (ou desiste em 12 s)
let state = '';
for (let i = 0; i < 60; i++) {
  state = await c.evaluate(`document.getElementById('stage').className + ' | static:' + (getComputedStyle(document.getElementById('static-hero')).display)`);
  if (/video-ready|video-failed/.test(state) || /static:block/.test(state)) break;
  await sleep(200);
}
console.log('estado:', state);
const shot = async name => {
  const r = await c.send('Page.captureScreenshot', { format: 'jpeg', quality: 82 });
  writeFileSync(`${out}/${prefix}-${name}.jpg`, Buffer.from(r.data, 'base64'));
};
if (opt.heroPs) {
  for (const p of opt.heroPs) {
    await c.evaluate(`(() => { const h = document.getElementById('inicio'); const top = h.getBoundingClientRect().top + scrollY; const range = h.offsetHeight - innerHeight; window.scrollTo({top: top + ${p} * range, behavior: 'instant'}); })()`);
    await sleep(1400);
    await shot('hero-' + String(p).replace('.', '_'));
  }
}
if (opt.sections) {
  for (const id of ['festas', 'como-funciona', 'fotos', 'duvidas', 'orcamento', 'rodape']) {
    await c.evaluate(`document.getElementById('${id}').scrollIntoView({behavior:'instant', block:'start'})`);
    await sleep(1600);
    await shot(id);
  }
}
if (opt.full) {
  const h = await c.evaluate('document.documentElement.scrollHeight');
  console.log('altura total', h);
}
if (opt.steps) {
  for (const st of opt.steps) {
    if (st.scroll) await c.evaluate(`document.querySelector(${JSON.stringify(st.scroll)}).scrollIntoView({behavior:"instant", block:${JSON.stringify(st.block||"center")}})`);
    if (st.y !== undefined) await c.evaluate(`window.scrollTo({top:${st.y}, behavior:"instant"})`);
    if (st.mouse) {
      const box = await c.evaluate(`(()=>{const r=document.querySelector(${JSON.stringify(st.sel)}).getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2}})()`);
      await c.send("Input.dispatchMouseEvent", { type: st.mouse === "down" ? "mousePressed" : st.mouse === "up" ? "mouseReleased" : "mouseMoved", x: box.x, y: box.y, button: "left", clickCount: 1 });
    }
    if (st.click) { const box = await c.evaluate(`(()=>{const r=document.querySelector(${JSON.stringify(st.click)}).getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2}})()`);
      for (const type of ["mousePressed","mouseReleased"]) await c.send("Input.dispatchMouseEvent", { type, x: box.x, y: box.y, button: "left", clickCount: 1 }); }
    if (st.type) { await c.evaluate(`document.querySelector(${JSON.stringify(st.type)}).focus()`); await c.send("Input.insertText", { text: st.text }); }
    if (st.js) console.log("js:", JSON.stringify(await c.evaluate(st.js)));
    if (st.wait) await sleep(st.wait);
    if (st.shot) await shot(st.shot);
  }
}
if (opt.eval) console.log('eval:', JSON.stringify(await c.evaluate(opt.eval)));
console.log('requisicoes de video/poster:', reqs.filter(u => /hero-(scrub|poster|ending|mobile)/.test(u)).map(u => u.split('/').pop()).join(', ') || 'nenhuma');
console.log('console:', logs.length ? '\n' + logs.join('\n') : 'limpo');
c.close();
process.exit(0);
