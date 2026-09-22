import { launch, navigate } from './cdp.mjs';
const PORT = 9471;
const c = await launch({ port: PORT });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const errs = [];
c.on(m => { if (m.method === 'Runtime.exceptionThrown') errs.push(m.params.exceptionDetails.exception?.description); });
await c.send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
await navigate(c, 'http://localhost:8080/', 1500);
const abas = async () => (await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()).filter(t => t.type === 'page').map(t => t.url);
const clicar = async sel => {
  await c.evaluate(`document.querySelector(${JSON.stringify(sel)}).scrollIntoView({block:'center',behavior:'instant'})`);
  await sleep(400);
  const b = await c.evaluate(`(() => { const r = document.querySelector(${JSON.stringify(sel)}).getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()`);
  for (const type of ['mousePressed', 'mouseReleased']) await c.send('Input.dispatchMouseEvent', { type, x: b.x, y: b.y, button: 'left', clickCount: 1 });
};
// 1. vazio
await clicar('#enviar'); await sleep(1200);
console.log('1. vazio -> abas:', (await abas()).length, '| erros visiveis:', await c.evaluate(`[...document.querySelectorAll('.fld.bad')].map(e => e.dataset.f).join(',')`));
// 2. preenchido + clique
await c.evaluate(`(() => { document.getElementById('f-nome').value = 'Teste Link'; document.getElementById('f-whats').value = '(21) 98765-4321'; document.getElementById('f-tipo').value = '15 Anos'; ['f-nome','f-whats','f-tipo'].forEach(id => document.getElementById(id).dispatchEvent(new Event('input'))); })()`);
await clicar('#enviar'); await sleep(2500);
const a2 = await abas();
console.log('2. clique -> abas:', a2.length, '| nova aba:', (a2.find(u => /wa\.me|whatsapp/.test(u)) || 'nenhuma').slice(0, 120));
console.log('   recado "pedido pronto":', await c.evaluate(`document.getElementById('card').classList.contains('sent')`));
// 3. Enter num campo (outro pedido)
await c.evaluate(`document.getElementById('again').click()`);
await sleep(300);
await c.evaluate(`(() => { document.getElementById('f-nome').value = 'Teste Enter'; document.getElementById('f-whats').value = '(21) 91234-5678'; document.getElementById('f-tipo').value = 'Casamento'; document.getElementById('f-local').focus(); })()`);
for (const type of ['keyDown', 'keyUp']) await c.send('Input.dispatchKeyEvent', { type, key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, text: type === 'keyDown' ? '\r' : undefined });
await sleep(2500);
const a3 = await abas();
console.log('3. Enter -> abas:', a3.length, '| abas do WhatsApp:', a3.filter(u => /wa\.me|whatsapp/.test(u)).length);
console.log('erros JS:', errs.length ? errs.join(' / ') : 'nenhum');
c.close(); process.exit(0);
