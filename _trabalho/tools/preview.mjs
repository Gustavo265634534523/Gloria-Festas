// Renderiza quadros de prévia da cena: node preview.mjs "0,0.3,0.5" 960 540 1 [prefixo] [jsonOverrides]
import { launch, navigate } from './cdp.mjs';
import { writeFileSync, mkdirSync } from 'node:fs';
const ts = (process.argv[2] || '0,0.25,0.45,0.6,0.8,1').split(',').map(Number);
const w = +(process.argv[3] || 960), h = +(process.argv[4] || 540), ss = +(process.argv[5] || 1);
const prefix = process.argv[6] || 'prev';
const extra = process.argv[7] || '{}';
const out = 'C:/Users/tvnn/Desktop/site minha mae/_trabalho/review';
mkdirSync(out, { recursive: true });
const c = await launch({ port: 9341 });
await navigate(c, 'file:///C:/Users/tvnn/Desktop/site%20minha%20mae/_trabalho/render/scene.html');
const ok = await c.evaluate('window.ready === true');
if (!ok) { console.log('pagina nao ficou pronta'); c.close(); process.exit(1); }
for (const t of ts) {
  const t0 = Date.now();
  const url = await c.evaluate(`render(${t}, Object.assign({w:${w},h:${h},ss:${ss},fmt:'jpeg'}, ${extra}))`);
  const b = Buffer.from(url.split(',')[1], 'base64');
  const f = `${out}/${prefix}-${String(t).replace('.', '_')}.jpg`;
  writeFileSync(f, b);
  console.log(f, (Date.now() - t0) + 'ms');
}
c.close();
process.exit(0);
