import { launch, navigate } from './cdp.mjs';
const c = await launch({ port: 9990 });
await c.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
await c.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
await c.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
await navigate(c, 'http://localhost:8091/', 3000);
for (const tipo of ['touch', 'mouse', 'default']) {
  const antes = await c.evaluate('scrollY');
  await c.send('Input.synthesizeScrollGesture', { x: 195, y: 500, yDistance: -700, speed: 1400, gestureSourceType: tipo });
  await new Promise(r => setTimeout(r, 600));
  console.log(tipo, antes, '->', await c.evaluate('scrollY'));
}
c.close(); process.exit(0);
