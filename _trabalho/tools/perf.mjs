// Velocidade e fluidez, do jeito do Lighthouse: node perf.mjs [celular|pc] [porta]
// celular: 390x844, 4G lento (150 ms, 1,6 Mbps), processador 4x mais lento | pc: 1440x900, sem freio
// Mede: FCP, LCP, CLS, tarefas longas, bytes, e os quadros durante uma rolagem da página inteira (por seção)
import { launch, navigate } from './cdp.mjs';
const perfil = process.argv[2] || 'celular';
const PORT = +(process.argv[3] || 8091);
const P = perfil === 'pc'
  ? { w: 1440, h: 900, mob: false, cpu: 1, net: null, espera: 5000 }
  : { w: 390, h: 844, mob: true, cpu: 4, net: { latency: 150, downloadThroughput: 1.6e6 / 8, uploadThroughput: 750e3 / 8 }, espera: 14000 };
const c = await launch({ port: 9920 + Math.floor(Math.random() * 60) });
await c.send('Network.enable');
await c.send('Network.setCacheDisabled', { cacheDisabled: true });
await c.send('Emulation.setDeviceMetricsOverride', { width: P.w, height: P.h, deviceScaleFactor: P.mob ? 2 : 1, mobile: P.mob });
if (P.mob) await c.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
await c.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
if (P.cpu > 1) await c.send('Emulation.setCPUThrottlingRate', { rate: P.cpu });
if (P.net) await c.send('Network.emulateNetworkConditions', { offline: false, ...P.net });
await c.send('Page.addScriptToEvaluateOnNewDocument', { source: `
  window.__m = { fcp: 0, lcp: 0, cls: 0, longs: [] };
  new PerformanceObserver(l => l.getEntries().forEach(e => { if (e.name === 'first-contentful-paint') __m.fcp = e.startTime; })).observe({ type: 'paint', buffered: true });
  new PerformanceObserver(l => l.getEntries().forEach(e => { __m.lcp = e.startTime; __m.lcpEl = e.element ? (e.element.id || e.element.className || e.element.tagName) + '' : e.url; })).observe({ type: 'largest-contentful-paint', buffered: true });
  new PerformanceObserver(l => l.getEntries().forEach(e => { if (!e.hadRecentInput) __m.cls += e.value; })).observe({ type: 'layout-shift', buffered: true });
  new PerformanceObserver(l => l.getEntries().forEach(e => __m.longs.push([Math.round(e.startTime), Math.round(e.duration)]))).observe({ type: 'longtask', buffered: true });
  document.addEventListener('DOMContentLoaded', () => { __m.dcl = performance.now(); const st = document.getElementById('stage');
    new MutationObserver(() => { if (!__m.video && st.classList.contains('video-ready')) __m.video = performance.now(); }).observe(st, { attributes: true }); });
  addEventListener('load', () => { __m.load = performance.now(); });
` });
let bytes = 0; const porTipo = {}; const tipos = new Map();
c.on(m => {
  if (m.method === 'Network.responseReceived') tipos.set(m.params.requestId, m.params.type);
  if (m.method === 'Network.loadingFinished') { bytes += m.params.encodedDataLength; const t = tipos.get(m.params.requestId) || '?'; porTipo[t] = (porTipo[t] || 0) + m.params.encodedDataLength; }
});
await navigate(c, `http://localhost:${PORT}/`, 0);
await new Promise(r => setTimeout(r, P.espera));
const m = JSON.parse(await c.evaluate(`JSON.stringify(__m)`));
const kb = x => Math.round(x / 1024) + ' KB';
console.log(`\n== ${perfil} ==`);
console.log(`primeira pintura ${Math.round(m.fcp)} ms | maior pintura ${Math.round(m.lcp)} ms (${m.lcpEl}) | DOM pronto ${Math.round(m.dcl)} ms | load ${Math.round(m.load)} ms | vídeo da abertura pronto ${m.video ? Math.round(m.video) + ' ms' : 'não'}`);
console.log(`mudança de layout (CLS) ${m.cls.toFixed(3)} | tarefas longas no carregamento: ${m.longs.length} (maior ${Math.max(0, ...m.longs.map(l => l[1]))} ms, soma ${m.longs.reduce((a, l) => a + l[1], 0)} ms)`);
console.log(`transferido ${kb(bytes)} → ` + Object.entries(porTipo).sort((a, b) => b[1] - a[1]).map(([t, b]) => `${t} ${kb(b)}`).join(', '));

// rolagem da página inteira: quadros por seção
await c.evaluate(`(() => { window.__m.longs = []; window.__f = []; (function laco(t) { __f.push([t, scrollY]); requestAnimationFrame(laco); })(performance.now()); })()`);
const H = await c.evaluate('document.documentElement.scrollHeight');
const PASSO = 700;
for (let y = 0; y < H; y += PASSO) {
  await c.send('Input.synthesizeScrollGesture', { x: Math.round(P.w / 2), y: Math.round(P.h / 2), yDistance: -PASSO, speed: 1400, gestureSourceType: 'mouse' });
}
const r = JSON.parse(await c.evaluate(`JSON.stringify((() => {
  const secs = [['abertura', document.getElementById('inicio')], ...['festas','como-funciona','fotos','feedbacks','duvidas','orcamento','rodape'].map(i => [i, document.getElementById(i)])]
    .map(([n, el]) => [n, el.getBoundingClientRect().top + scrollY]);
  const sec = y => { let n = secs[0][0]; for (const [k, t] of secs) if (y + innerHeight * .5 >= t) n = k; return n; };
  const por = {};
  for (let i = 1; i < __f.length; i++) { const d = __f[i][0] - __f[i - 1][0], s = sec(__f[i][1]); (por[s] = por[s] || []).push(d); }
  const out = {};
  for (const [s, d] of Object.entries(por)) { d.sort((a, b) => a - b); out[s] = { quadros: d.length, mediana: +d[d.length >> 1].toFixed(1), p95: +d[Math.floor(d.length * .95)].toFixed(1), lentos: d.filter(x => x > 25).length }; }
  return { out, longs: window.__m.longs };
})())`));
console.log('rolagem (ms por quadro; "lentos" = quadros acima de 25 ms):');
for (const [s, v] of Object.entries(r.out)) console.log(`  ${s.padEnd(14)} quadros ${String(v.quadros).padStart(4)} | mediana ${v.mediana} | p95 ${v.p95} | lentos ${v.lentos} (${Math.round(v.lentos / v.quadros * 100)}%)`);
console.log(`  tarefas longas durante a rolagem: ${r.longs.length} (soma ${r.longs.reduce((a, l) => a + l[1], 0)} ms, maior ${Math.max(0, ...r.longs.map(l => l[1]))} ms)`);
c.close(); process.exit(0);
