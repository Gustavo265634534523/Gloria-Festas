import { launch, navigate } from './cdp.mjs';
import { writeFileSync } from 'node:fs';
const c = await launch({ port: 9380 });
await navigate(c, 'file:///C:/Users/tvnn/Desktop/site%20minha%20mae/_trabalho/render/scene.html');
const out = 'C:/Users/tvnn/Desktop/site minha mae/_trabalho/review/';
const jobs = [
  ['hero-inicio', `render(0, {w:1920,h:1080,ss:2,fmt:'png',objOnly:true,creme:true,modo:5,glintAmt:0})`],
  ['hero-final', `render(1, {w:1920,h:1080,ss:2,fmt:'png',objOnly:true,creme:true,modo:5})`],
  ['hero-mobile', `render(0.5, {w:1080,h:2160,ss:2,fmt:'png',objOnly:true,creme:true,modo:5,shift:[0,-0.60],fov:50,over:{camPos:[0,19,96],camTgt:[0,12,0]}})`],
];
for (const [n, js] of jobs) { const url = await c.evaluate(js); writeFileSync(out + n + '.png', Buffer.from(url.split(',')[1], 'base64')); console.log(n); }
c.close(); process.exit(0);
