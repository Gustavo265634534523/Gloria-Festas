// Capa em pé (primeiro quadro do vídeo do celular), com alfa reto para virar webp
import { launch, navigate } from './cdp.mjs';
import { writeFileSync } from 'node:fs';
const c = await launch({ port: 9460 });
await navigate(c, 'file:///C:/Users/tvnn/Desktop/site%20minha%20mae/_trabalho/render/scene.html');
const url = await c.evaluate(`render(0, {w:720,h:1280,ss:2,fmt:'png',objOnly:true,creme:true,modo:5,glintAmt:0,fov:55,shift:[0,-0.3],over:{camA:[0,19,104],camB:[0,17,96],tgtA:[0,12,0],tgtB:[0,11,0],liftK:2.2}})`);
writeFileSync('C:/Users/tvnn/Desktop/site minha mae/_trabalho/review/hero-inicio-retrato.png', Buffer.from(url.split(',')[1], 'base64'));
c.close(); process.exit(0);
