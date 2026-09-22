import { launch, navigate } from './cdp.mjs';
const c = await launch({ port: 9600 + Math.floor(Math.random() * 200) });
const FW = +(process.argv[2] || 1440), FH = +(process.argv[3] || 900), MOB = FW < 800;
await c.send('Emulation.setDeviceMetricsOverride', { width: FW, height: FH, deviceScaleFactor: 1, mobile: MOB });
if (MOB) await c.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
await c.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
await navigate(c, 'http://localhost:8080/', 2500);
for (const step of [120, 240, 360]) {
  const res = await c.evaluate(`(async () => {
    window.scrollTo({top:0, behavior:'instant'}); await new Promise(r => setTimeout(r, 900));
    const hero = document.getElementById('inicio'); const end = hero.offsetTop + hero.offsetHeight - innerHeight;
    const bands = [...document.querySelectorAll('.band')];
    const full = bands.map(() => 0), run = bands.map(() => 0), best = bands.map(() => 0);
    let n = 0;
    while (scrollY < end + ${step}) {
      window.scrollBy(0, ${step}); n++;
      await new Promise(r => setTimeout(r, 400));
      bands.forEach((b, i) => { const o = +getComputedStyle(b).opacity; if (o > 0.97) { full[i]++; run[i]++; best[i] = Math.max(best[i], run[i]); } else run[i] = 0; });
      if (n > 200) break;
    }
    return { passos: n, cheio: full, seguidos: best };
  })()`);
  console.log('flick ' + step + 'px:', JSON.stringify(res));
}
c.close(); process.exit(0);
