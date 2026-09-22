import { launch, navigate } from './cdp.mjs';
import { writeFileSync } from 'node:fs';
const c = await launch({ port: 9700 + Math.floor(Math.random() * 90) });
await c.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
await c.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
await navigate(c, 'http://localhost:8080/', 1500);
await c.evaluate(`document.getElementById('fotos').scrollIntoView({behavior:'instant', block:'start'})`);
await new Promise(r => setTimeout(r, 1200));
for (const [x, y, n] of [[260, 330, 'esq'], [1180, 330, 'dir']]) {
  for (let i = 0; i < 12; i++) { await c.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: x + i, y }); await new Promise(r => setTimeout(r, 120)); }
  const r = await c.send('Page.captureScreenshot', { format: 'jpeg', quality: 80 });
  writeFileSync(`C:/Users/tvnn/Desktop/site minha mae/_trabalho/review/site/luz-${n}.jpg`, Buffer.from(r.data, 'base64'));
}
c.close(); process.exit(0);
