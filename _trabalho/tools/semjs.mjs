import { launch, navigate } from './cdp.mjs';
import { writeFileSync } from 'node:fs';
const c = await launch({ port: 9650 + Math.floor(Math.random() * 40) });
await c.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
await c.send('Emulation.setScriptExecutionDisabled', { value: true });
await navigate(c, 'http://localhost:8080/', 1500);
const r = await c.send('Page.captureScreenshot', { format: 'jpeg', quality: 80 });
writeFileSync('C:/Users/tvnn/Desktop/site minha mae/_trabalho/review/site/semjs-topo.jpg', Buffer.from(r.data, 'base64'));
c.close(); process.exit(0);
