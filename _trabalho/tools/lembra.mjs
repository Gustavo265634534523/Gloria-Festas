// A prévia lembra a escolha: abre com ?animacao, depois sem nada, depois com ?animacao=0
import { launch, navigate } from './cdp.mjs';
const c = await launch({ port: 9770 + Math.floor(Math.random() * 40) });
await c.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
await c.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });   // como no PC do usuário
const estado = async () => { await new Promise(r => setTimeout(r, 1500)); return c.evaluate(`[document.documentElement.className || '(sem classe)', getComputedStyle(document.getElementById('stage')).display, localStorage.getItem('animacao')]`); };
await navigate(c, 'http://localhost:8080/?animacao', 800); console.log('com ?animacao  ', await estado());
await navigate(c, 'http://localhost:8080/', 800);           console.log('sem nada       ', await estado());
await navigate(c, 'http://localhost:8080/?animacao=0', 800);console.log('com ?animacao=0', await estado());
await navigate(c, 'http://localhost:8080/', 800);           console.log('sem nada       ', await estado());
c.close(); process.exit(0);
