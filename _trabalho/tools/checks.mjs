import { launch, navigate } from './cdp.mjs';
const c = await launch({ port: 9900 + Math.floor(Math.random() * 90) });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const errs = [];
c.on(m => { if (m.method === 'Runtime.exceptionThrown') errs.push(m.params.exceptionDetails.exception?.description); });
await c.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
// 1. transbordo lateral em várias larguras
for (const [w, h, mob] of [[320, 640, 1], [375, 667, 1], [390, 844, 1], [768, 1024, 1], [1024, 768, 0], [1280, 800, 0], [1440, 900, 0], [1920, 1080, 0]]) {
  await c.send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: !!mob });
  await c.send('Emulation.setTouchEmulationEnabled', { enabled: !!mob, maxTouchPoints: 5 });
  await navigate(c, 'http://localhost:8080/', 900);
  const r = await c.evaluate(`(() => { const d = document.documentElement; let wide = []; document.querySelectorAll('body *').forEach(e => { const b = e.getBoundingClientRect(); if (b.right > innerWidth + 1 && getComputedStyle(e).position !== 'fixed' && !e.closest('.ambient,.stage,.served,.foot,.static-hero')) wide.push(e.tagName + '.' + (e.className.baseVal ?? e.className)); }); return {sw: d.scrollWidth, cw: d.clientWidth, modo: getComputedStyle(document.getElementById('static-hero')).display === 'block' ? 'estático' : 'scrub', wide: wide.slice(0, 4)}; })()`);
  console.log(`${w}x${h}: scrollWidth ${r.sw} / ${r.cw} ${r.sw > r.cw ? 'TRANSBORDA' : 'ok'} | hero ${r.modo}${r.wide.length ? ' | largos: ' + r.wide.join(', ') : ''}`);
}
// 2. formulário: validação e mensagem do WhatsApp
await c.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
await c.send('Emulation.setTouchEmulationEnabled', { enabled: false, maxTouchPoints: 5 });
await navigate(c, 'http://localhost:8080/', 900);
const f = await c.evaluate(`(async () => {
  let aberto = null; window.open = (u) => { aberto = u; return null; };
  const form = document.getElementById('form');
  form.requestSubmit();
  await new Promise(r => setTimeout(r, 100));
  const erros = [...document.querySelectorAll('.fld.bad')].map(e => e.dataset.f);
  const nome = document.getElementById('f-nome'); nome.value = 'Maria Teste'; nome.dispatchEvent(new Event('input'));
  const w = document.getElementById('f-whats'); w.value = '21987654321'; w.dispatchEvent(new Event('input'));
  document.querySelector('[data-tipo="15 Anos"]').click();
  form.requestSubmit();                                   // só 3 campos: não pode enviar
  await new Promise(r => setTimeout(r, 150));
  const parcial = { enviado: document.getElementById('card').classList.contains('sent'), faltando: [...document.querySelectorAll('.fld.bad')].map(e => e.dataset.f) };
  const fd = document.getElementById('f-data'); fd.value = '2020-01-01'; fd.dispatchEvent(new Event('change'));
  parcial.dataPassadaRecusada = document.querySelector('[data-f="data"]').classList.contains('bad');
  window.__parcial = parcial;
  fd.value = new Date(Date.now() + 60 * 864e5).toISOString().slice(0, 10); fd.dispatchEvent(new Event('change'));
  [...document.querySelectorAll('.chips button')].find(b => b.textContent === '100').click();
  document.getElementById('f-local').value = 'Centro, Nilópolis';
  document.getElementById('f-msg').value = 'Festa à noite, tema dourado.';
  form.requestSubmit();
  await new Promise(r => setTimeout(r, 200));
  return { parcial: window.__parcial, mensagem: decodeURIComponent(document.getElementById('enviar').href.split('text=')[1] || ''), errosVazio: erros, whatsFormatado: w.value, tipo: document.getElementById('f-tipo').value, enviado: document.getElementById('card').classList.contains('sent'), url: aberto && decodeURIComponent(aberto) };
})()`);
console.log('\nformulário:', JSON.stringify(f, null, 1));
// 3. movimento reduzido ligado e desligado com a página aberta
await navigate(c, 'http://localhost:8080/', 1500);
const antes = await c.evaluate(`({hero: getComputedStyle(document.getElementById('stage')).display, fio: document.querySelector('.thread path').style.strokeDashoffset, tampa: document.getElementById('serve').className})`);
await c.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
await sleep(400);
const durante = await c.evaluate(`({hero: getComputedStyle(document.getElementById('stage')).display, estatico: getComputedStyle(document.getElementById('static-hero')).display, fio: document.querySelector('.thread path').style.strokeDashoffset, sublinhado: document.querySelector('.quote .ul path').style.strokeDashoffset, tampa: document.getElementById('serve').className, revelados: document.querySelectorAll('.reveal:not(.in)').length})`);
await c.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
await sleep(600);
const depois = await c.evaluate(`({hero: getComputedStyle(document.getElementById('stage')).display, fio: document.querySelector('.thread path').style.strokeDashoffset, tampa: document.getElementById('serve').className, faixa1: document.querySelector('.b1').style.opacity})`);
console.log('\nmovimento reduzido: antes', JSON.stringify(antes), '\n durante', JSON.stringify(durante), '\n depois', JSON.stringify(depois));
// 4. atrasos de escalonamento aposentados (hover no 3º arco sem atraso)
await c.evaluate(`document.getElementById('festas').scrollIntoView({behavior:'instant'})`);
await sleep(2600);
const delay = await c.evaluate(`[...document.querySelectorAll('.arch')].map(a => getComputedStyle(a).transitionDelay.split(',')[0])`);
console.log('\natrasos dos arcos depois da entrada:', delay.join(' | '));
console.log('\nerros JS:', errs.length ? errs.join('\n') : 'nenhum');
c.close(); process.exit(0);
