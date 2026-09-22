// Renderiza a sequência completa e manda os quadros PNG direto para o ffmpeg (sem encher o disco)
import { launch, navigate } from './cdp.mjs';
import { spawn } from 'node:child_process';
const N = +(process.argv[2] || 180), W = +(process.argv[3] || 1920), H = +(process.argv[4] || 1080);
const out = process.argv[5] || 'C:/Users/tvnn/Desktop/site minha mae/_trabalho/review/hero-master.mp4';
const extra = process.argv[6] || '{}';
const ff = spawn('ffmpeg', ['-v','error','-y','-f','image2pipe','-framerate','30','-c:v','png','-i','-',
  '-c:v','libx264','-crf','10','-preset','slow','-pix_fmt','yuv420p','-g','30', out], { stdio: ['pipe','inherit','inherit'] });
const c = await launch({ port: 9343 });
await navigate(c, 'file:///C:/Users/tvnn/Desktop/site%20minha%20mae/_trabalho/render/scene.html');
const t0 = Date.now();
for (let i = 0; i < N; i++) {
  const t = i / (N - 1);
  const url = await c.evaluate(`render(${t}, Object.assign({w:${W},h:${H},ss:2,fmt:'png'}, ${extra}))`);
  const buf = Buffer.from(url.slice(url.indexOf(',') + 1), 'base64');
  if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  if (i % 30 === 0) console.log(`quadro ${i}/${N}  ${((Date.now()-t0)/1000).toFixed(0)}s`);
}
ff.stdin.end();
await new Promise(r => ff.on('close', r));
c.close();
console.log('pronto em', ((Date.now()-t0)/1000).toFixed(0)+'s', out);
process.exit(0);
