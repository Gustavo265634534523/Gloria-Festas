import { launch, navigate } from './cdp.mjs';
import { writeFileSync } from 'node:fs';
const [W, H, mob] = [+(process.argv[2] || 1440), +(process.argv[3] || 900), process.argv[4] === 'm'];
const c = await launch({ port: 9600 + Math.floor(Math.random() * 90) });
const errs = [];
c.on(m => { if (m.method === 'Runtime.exceptionThrown') errs.push(m.params.exceptionDetails.exception?.description); });
await c.send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: mob ? 2 : 1, mobile: mob });
if (mob) await c.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
await c.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
await navigate(c, 'http://localhost:8080/', 1500);
await c.evaluate(`(() => {
  window.open = u => { window.__aberto = u; return null; };
  document.getElementById('f-nome').value = 'Maria Teste';
  document.getElementById('f-whats').value = '(21) 98765-4321';
  document.getElementById('f-tipo').value = 'Casamento';
  document.querySelector('#form button[type=submit]').scrollIntoView({ behavior: 'instant', block: 'center' });
})()`);
await new Promise(r => setTimeout(r, 1500));
const b = await c.evaluate(`(() => { const r = document.querySelector('#form button[type=submit]').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()`);
const t0 = Date.now();
if (mob) { for (const type of ['touchStart', 'touchEnd']) await c.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x: b.x, y: b.y }] }); }
else for (const type of ['mousePressed', 'mouseReleased']) await c.send('Input.dispatchMouseEvent', { type, x: b.x, y: b.y, button: 'left', clickCount: 1 });
for (const ms of [700, 1150, 1700, 2600, 5200]) {
  await new Promise(r => setTimeout(r, Math.max(0, ms - (Date.now() - t0))));
  const r = await c.send('Page.captureScreenshot', { format: 'jpeg', quality: 80 });
  writeFileSync(`C:/Users/tvnn/Desktop/site minha mae/_trabalho/review/site/conf-${mob ? 'm' : 'd'}-${ms}.jpg`, Buffer.from(r.data, 'base64'));
}
const st = await c.evaluate(`({ enviado: document.getElementById('card').classList.contains('sent'), whatsapp: !!window.__aberto, confeteVisivel: getComputedStyle(document.querySelector('.confete')).display })`);
console.log(JSON.stringify(st), '| erros:', errs.length ? errs.join(' / ') : 'nenhum');
c.close(); process.exit(0);
