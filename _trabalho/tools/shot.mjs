// Captura uma página (arquivo ou URL): node shot.mjs url saida.png largura altura [esperaMs] [dpr]
import { launch, navigate } from './cdp.mjs';
import { writeFileSync } from 'node:fs';
const [url, out, w = 1280, h = 800, wait = 1500, dpr = 1] = process.argv.slice(2);
const c = await launch({ port: 9345 + Math.floor(Math.random() * 200) });
await c.send('Emulation.setDeviceMetricsOverride', { width: +w, height: +h, deviceScaleFactor: +dpr, mobile: false });
await navigate(c, url, +wait);
const r = await c.send('Page.captureScreenshot', { format: 'png' });
writeFileSync(out, Buffer.from(r.data, 'base64'));
c.close(); process.exit(0);
