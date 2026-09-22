// Teste A/B da rolagem da abertura no computador: node perf-hero.mjs [variante] [porta]
// variantes: base | sem-estrelas | sem-video | sem-tudo
import { launch, navigate } from './cdp.mjs';
const V = process.argv[2] || 'base', PORT = +(process.argv[3] || 8091);
const W = +(process.argv[4] || 1440), H = +(process.argv[5] || 900);
const c = await launch({ port: 9900 + Math.floor(Math.random() * 20) });
await c.send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: W < 800 });
await c.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
await navigate(c, `http://localhost:${PORT}/`, 1500);
for (let i = 0; i < 50; i++) { if (/video-ready/.test(await c.evaluate(`document.getElementById('stage').className`))) break; await new Promise(r => setTimeout(r, 200)); }
if (V === 'sem-estrelas' || V === 'sem-tudo') await c.evaluate(`document.getElementById('ceu-hero').style.display = 'none'`);
if (V === 'sem-video' || V === 'sem-tudo') await c.evaluate(`(() => { const v = document.getElementById('hero'); Object.defineProperty(v, 'currentTime', { set() {}, get() { return 0; } }); })()`);
if (V === 'sem-upload') await c.evaluate(`(() => { const o = WebGLRenderingContext.prototype.texImage2D; WebGLRenderingContext.prototype.texImage2D = function (...a) { if (a[a.length - 1] instanceof HTMLVideoElement) return; return o.apply(this, a); }; })()`);
await new Promise(r => setTimeout(r, 500));
await c.evaluate(`(() => { window.__f = []; (function laco(t) { __f.push(t); requestAnimationFrame(laco); })(performance.now()); })()`);
const fimHero = await c.evaluate(`(() => { const h = document.getElementById('inicio'); return h.offsetHeight - innerHeight; })()`);
for (let y = 0; y < fimHero; y += 400) await c.send('Input.synthesizeScrollGesture', { x: W >> 1, y: H >> 1, yDistance: -400, speed: 1400, gestureSourceType: 'mouse' });
for (let y = fimHero; y > 0; y -= 400) await c.send('Input.synthesizeScrollGesture', { x: W >> 1, y: H >> 1, yDistance: 400, speed: 1400, gestureSourceType: 'mouse' });
const r = await c.evaluate(`(() => { const d = []; for (let i = 1; i < __f.length; i++) d.push(__f[i] - __f[i - 1]); d.sort((a, b) => a - b);
  return { quadros: d.length, p50: +d[d.length >> 1].toFixed(1), p95: +d[Math.floor(d.length * .95)].toFixed(1), p99: +d[Math.floor(d.length * .99)].toFixed(1), lentos: d.filter(x => x > 25).length }; })()`);
console.log(`${V.padEnd(13)} quadros ${r.quadros} | p50 ${r.p50} | p95 ${r.p95} | p99 ${r.p99} | lentos ${r.lentos} (${(r.lentos / r.quadros * 100).toFixed(1)}%)`);
c.close(); process.exit(0);
