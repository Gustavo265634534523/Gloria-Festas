// Auditoria de legibilidade do pior quadro: esconde o texto, captura a página composta e mede o pixel mais claro sob cada linha
import { launch, navigate } from './cdp.mjs';
import { writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const W = 1440, H = 900;
const c = await launch({ port: 9800 + Math.floor(Math.random() * 100) });
await c.send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false });
await c.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
await navigate(c, 'http://localhost:8080/', 3000);
const lum = ([r, g, b]) => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const TEXT = { hd: [242, 230, 207], hs: [242, 230, 207], chip: [225, 202, 139] };
const plan = [[0, [0.02, 0.10, 0.17]], [1, [0.26, 0.33, 0.40]], [2, [0.49, 0.56, 0.63]], [3, [0.76, 0.88, 1.0]]];
for (const [bi, ps] of plan) {
  let worst = 99, where = '';
  for (const p of ps) {
    await c.evaluate(`(() => { const h = document.getElementById('inicio'); const top = h.getBoundingClientRect().top + scrollY; window.scrollTo({top: top + ${p} * (h.offsetHeight - innerHeight), behavior: 'instant'}); })()`);
    await new Promise(r => setTimeout(r, 1300));
    const rects = await c.evaluate(`(() => { const band = document.querySelectorAll('.band')[${bi}]; const out = []; band.querySelectorAll('.hd .w').forEach(w => { const r = w.getBoundingClientRect(); out.push({k:'hd', t:w.textContent, x:Math.max(0,Math.round(r.left)), y:Math.max(0,Math.round(r.top + r.height*0.12)), w:Math.round(r.width), h:Math.round(r.height*0.8)}); }); band.querySelectorAll('.hs').forEach(p => { const rg = document.createRange(); rg.selectNodeContents(p); [...rg.getClientRects()].forEach(r => out.push({k:'hs', t:'linha', x:Math.max(0,Math.round(r.left)), y:Math.max(0,Math.round(r.top)), w:Math.round(r.width), h:Math.round(r.height)})); }); return out; })()`);
    await c.evaluate(`(() => { const s = document.createElement('style'); s.id = 'aud'; s.textContent = '.band .hd, .band .hs, .band .chip{visibility:hidden!important}'; document.head.appendChild(s); })()`);
    await new Promise(r => setTimeout(r, 200));
    const shot = await c.send('Page.captureScreenshot', { format: 'png' });
    await c.evaluate(`document.getElementById('aud').remove()`);
    writeFileSync('C:/Users/tvnn/AppData/Local/Temp/aud.png', Buffer.from(shot.data, 'base64'));
    const raw = execFileSync('ffmpeg', ['-v', 'error', '-i', 'C:/Users/tvnn/AppData/Local/Temp/aud.png', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], { maxBuffer: 1e8 });
    for (const R of rects) {
      if (R.k === 'chip') continue; // o chip tem fundo próprio desfocado
      let maxL = 0;
      for (let y = R.y; y < Math.min(H, R.y + R.h); y += 2) for (let x = R.x; x < Math.min(W, R.x + R.w); x += 2) {
        const i = (y * W + x) * 3; const L = lum([raw[i], raw[i + 1], raw[i + 2]]); if (L > maxL) maxL = L;
      }
      const lt = lum(TEXT[R.k]);
      const cr = (Math.max(lt, maxL) + 0.05) / (Math.min(lt, maxL) + 0.05);
      if (cr < worst) { worst = cr; where = `p=${p} ${R.k} "${R.t}"`; }
    }
  }
  console.log(`faixa ${bi + 1}: pior contraste ${worst.toFixed(2)}:1 (${where})`);
}
c.close(); process.exit(0);
