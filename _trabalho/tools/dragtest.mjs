import { launch, navigate } from './cdp.mjs';
import { writeFileSync } from 'node:fs';
const [W, H, mob] = [+(process.argv[2] || 1440), +(process.argv[3] || 900), process.argv[4] === 'm'];
const c = await launch({ port: 9300 + Math.floor(Math.random() * 90) });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const errs = [];
c.on(m => { if (m.method === 'Runtime.exceptionThrown') errs.push(m.params.exceptionDetails.exception?.description); });
await c.send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: mob });
if (mob) await c.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
await c.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
await navigate(c, 'http://localhost:8080/', 1500);
await c.evaluate(`document.getElementById('rv-drag').scrollIntoView({behavior:'instant', block:'center'})`);
await sleep(1600);
const shot = async n => { const r = await c.send('Page.captureScreenshot', { format: 'jpeg', quality: 80 }); writeFileSync(`C:/Users/tvnn/Desktop/site minha mae/_trabalho/review/site/drag-${mob ? 'm' : 'd'}-${n}.jpg`, Buffer.from(r.data, 'base64')); };
const pos = () => c.evaluate(`Math.round(new DOMMatrix(getComputedStyle(document.getElementById('rv-fita')).transform).m41)`);
await shot('0');
const box = await c.evaluate(`(() => { const r = document.getElementById('rv-drag').getBoundingClientRect(); return { x: r.left + r.width * .7, y: r.top + r.height / 2 }; })()`);
// arrasto rápido para a esquerda e solta (deve continuar andando)
if (mob) {
  await c.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: box.x, y: box.y }] });
  for (let i = 1; i <= 8; i++) { await c.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: box.x - i * 30, y: box.y }] }); await sleep(16); }
  await c.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
} else {
  await c.send('Input.dispatchMouseEvent', { type: 'mousePressed', x: box.x, y: box.y, button: 'left', clickCount: 1 });
  for (let i = 1; i <= 8; i++) { await c.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: box.x - i * 30, y: box.y, button: 'left', buttons: 1 }); await sleep(16); }
  await c.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: box.x - 240, y: box.y, button: 'left', clickCount: 1 });
}
const p0 = await pos(); await sleep(150); await shot('1'); const p1 = await pos(); await sleep(1200); const p2 = await pos();
console.log(`arrasto: ao soltar ${p0}px -> depois de 150ms ${p1}px -> parado em ${p2}px (inércia: ${p1 < p0 ? 'sim' : 'não'})`);
console.log('lightbox aberto depois do arrasto?', await c.evaluate(`!document.getElementById('lb').hidden`));
await shot('2');
if (!mob) {
  await c.evaluate(`document.getElementById('rv-next').click()`); await sleep(900);
  console.log('botão próximo ->', await pos(), 'px');
}
// toque simples num print abre o ampliado
const pb = await c.evaluate(`(() => { const all = [...document.querySelectorAll('.rv-print')]; const vis = all.sort((a, b) => Math.abs(a.getBoundingClientRect().left + a.offsetWidth / 2 - innerWidth / 2) - Math.abs(b.getBoundingClientRect().left + b.offsetWidth / 2 - innerWidth / 2))[0]; const r = vis.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()`);
if (mob) { await c.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: pb.x, y: pb.y }] }); await c.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); }
else for (const type of ['mousePressed', 'mouseReleased']) await c.send('Input.dispatchMouseEvent', { type, x: pb.x, y: pb.y, button: 'left', clickCount: 1 });
await sleep(900);
console.log('toque no print abre o ampliado?', await c.evaluate(`!document.getElementById('lb').hidden`));
await shot('3');
await c.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
await sleep(700);
console.log('Esc fecha?', await c.evaluate(`document.getElementById('lb').hidden`));
console.log('erros JS:', errs.length ? errs.join(' / ') : 'nenhum');
c.close(); process.exit(0);
