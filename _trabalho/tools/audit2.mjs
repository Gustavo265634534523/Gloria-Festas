// (as estrelas ficam de fora: são riscos finos que passam; o que importa é a tampa e o brilho)
// Legibilidade da abertura (texto escuro sobre creme): esconde o texto, captura o quadro e acha o fundo mais ESCURO
// sob cada linha (a tampa dourada passando por trás é o pior caso). uso: node audit2.mjs [largura] [altura]
import { launch, navigate } from './cdp.mjs';
import { writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const W = +(process.argv[2] || 1440), H = +(process.argv[3] || 900), MOB = W < 800;
const c = await launch({ port: 9850 + Math.floor(Math.random() * 100) });
await c.send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: MOB });
if (MOB) await c.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
await c.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
await navigate(c, 'http://localhost:8080/', 3500);
const lum = ([r, g, b]) => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const TEXT = { hd: [42, 12, 27], hs: [110, 85, 96] };          // --ink e --text-2
const MIN = { hd: 3, hs: 4.5 };                                  // título grande 3:1, texto corrido 4,5:1
const plan = [[0, [0.02, 0.10, 0.17]], [1, [0.26, 0.33, 0.40]], [2, [0.49, 0.53, 0.56, 0.60, 0.63]], [3, [0.76, 0.88, 1.0]]];
const tmp = 'C:/Users/tvnn/AppData/Local/Temp/aud2.png';
let falhas = 0;
for (const [bi, ps] of plan) {
  let worst = 99, where = '';
  for (const p of ps) {
    await c.evaluate(`(() => { const h = document.getElementById('inicio'); window.scrollTo({top: h.offsetTop + ${p} * (h.offsetHeight - innerHeight), behavior: 'instant'}); })()`);
    await new Promise(r => setTimeout(r, 1400));
    const rects = await c.evaluate(`(() => { const band = document.querySelectorAll('.band')[${bi}]; if (+getComputedStyle(band).opacity < .9) return [];
      const out = []; band.querySelectorAll('.hd .w').forEach(w => { const r = w.getBoundingClientRect(); out.push({k:'hd', cor:getComputedStyle(w).color, t:w.textContent, x:Math.round(r.left), y:Math.round(r.top), w:Math.round(r.width), h:Math.round(r.height)}); });
      band.querySelectorAll('.hs').forEach(e => { const r = e.getBoundingClientRect(); if (+getComputedStyle(e).opacity > .9) out.push({k:'hs', cor:getComputedStyle(e).color, t:e.textContent.slice(0, 24), x:Math.round(r.left), y:Math.round(r.top), w:Math.round(r.width), h:Math.round(r.height)}); });
      return out; })()`);
    if (!rects.length) continue;
    await c.evaluate(`(() => { const s = document.createElement('style'); s.id = 'aud'; s.textContent = '.band .hd, .band .hs, .band .chip, .band .ctas, #ceu-hero{visibility:hidden!important}'; document.head.appendChild(s); })()`);
    await new Promise(r => setTimeout(r, 200));
    const shot = await c.send('Page.captureScreenshot', { format: 'png' });
    await c.evaluate(`document.getElementById('aud').remove()`);
    writeFileSync(tmp, Buffer.from(shot.data, 'base64'));
    const raw = execFileSync('ffmpeg', ['-v', 'error', '-i', tmp, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], { maxBuffer: 1e8 });
    for (const R of rects) {
      const Ls = [];                                   // sem as estrelas; ignora 1% de pixels soltos (bordas, grão)
      for (let y = Math.max(0, R.y); y < Math.min(H, R.y + R.h); y += 2) for (let x = Math.max(0, R.x); x < Math.min(W, R.x + R.w); x += 2) {
        const i = (y * W + x) * 3; Ls.push(lum([raw[i], raw[i + 1], raw[i + 2]]));
      }
      Ls.sort((a, b) => a - b);
      const minL = Ls[Math.floor(Ls.length * .01)] ?? 1;
      const cor = (R.cor.match(/\d+/g) || []).slice(0, 3).map(Number);   // a cor de verdade de cada texto
      const cr = (minL + 0.05) / (lum(cor.length === 3 ? cor : TEXT[R.k]) + 0.05);
      if (cr / MIN[R.k] < worst) { worst = cr / MIN[R.k]; where = `p=${p} ${R.k} "${R.t}" ${cr.toFixed(2)}:1`; }
    }
  }
  const ok = worst >= 1;
  if (!ok) falhas++;
  console.log(`faixa ${bi + 1}: ${ok ? 'ok' : 'BAIXO'} (pior: ${where})`);
}
console.log(falhas ? `${falhas} faixa(s) com contraste baixo` : 'todas as faixas legíveis');
c.close(); process.exit(0);
