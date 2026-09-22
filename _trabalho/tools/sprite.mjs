import { launch, navigate } from './cdp.mjs';
import { writeFileSync } from 'node:fs';
const c = await launch({ port: 9344 });
await navigate(c, 'file:///C:/Users/tvnn/Desktop/site%20minha%20mae/_trabalho/render/scene.html');
const url = await c.evaluate(`render(0, {w:1000,h:800,ss:2,fmt:'png',sprite:true,fov:24,shift:[0,0],coreInt:0,glintAmt:0,
  over:{camPos:[0,52,86], camTgt:[0,7.5,0]}})`);
writeFileSync('C:/Users/tvnn/Desktop/site minha mae/_trabalho/review/tampa-lado.png', Buffer.from(url.split(',')[1], 'base64'));
c.close(); process.exit(0);
