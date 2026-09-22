import { launch, navigate } from './cdp.mjs';
import { writeFileSync } from 'node:fs';
const W = +(process.argv[2] || 1440), out = process.argv[3];
const c = await launch({ port: 9990 + Math.floor(Math.random() * 9) });
await c.send('Emulation.setDeviceMetricsOverride', { width: W, height: 900, deviceScaleFactor: 1, mobile: W < 700 });
await c.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
await navigate(c, 'http://localhost:8080/', 1500);
// passa por toda a página para disparar as entradas e desenhar as linhas
const H = await c.evaluate('document.documentElement.scrollHeight');
for (let y = 0; y < H; y += 700) { await c.evaluate(`window.scrollTo({top:${y},behavior:'instant'})`); await new Promise(r => setTimeout(r, 260)); }
await new Promise(r => setTimeout(r, 1500));
const top = await c.evaluate(`Math.round(document.getElementById('festas').getBoundingClientRect().top + scrollY - 60)`);
await c.evaluate(`window.scrollTo({top:${top},behavior:'instant'})`);
await new Promise(r => setTimeout(r, 800));
const r = await c.send('Page.captureScreenshot', { format: 'jpeg', quality: 80, captureBeyondViewport: true, clip: { x: 0, y: top, width: W, height: H - top, scale: 0.5 } });
writeFileSync(out, Buffer.from(r.data, 'base64'));
console.log('altura', H, 'recorte a partir de', top);
c.close(); process.exit(0);
