// Folha de contato do enquadramento em pé (celular): node retrato.mjs '<opções JSON>' [prefixo]
// Linha vermelha: o que um celular 390x844 mostra da largura; linha azul: até onde vão os textos (45% da altura)
import { launch, navigate } from './cdp.mjs';
import { writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const opts = process.argv[2] || '{}';
const pre = process.argv[3] || 'ret';
const out = 'C:/Users/tvnn/Desktop/site minha mae/_trabalho/review/retrato/';
mkdirSync(out, { recursive: true });
const T = [0, 0.25, 0.45, 0.55, 0.62, 0.7, 0.85, 1];
const c = await launch({ port: 9390 + Math.floor(Math.random() * 60) });
await navigate(c, 'file:///C:/Users/tvnn/Desktop/site%20minha%20mae/_trabalho/render/scene.html');
for (const t of T) {
  const url = await c.evaluate(`render(${t}, Object.assign({w:360,h:640,ss:1,fmt:'png',objOnly:true,creme:true,modo:5}, ${opts}))`);
  writeFileSync(`${out}${pre}-${t}.png`, Buffer.from(url.split(',')[1], 'base64'));
}
c.close();
const vis = Math.round(360 * (390 / 844) / (360 / 640));      // largura visível num celular 390x844
const x0 = Math.round((360 - vis) / 2);
const ins = T.flatMap(t => ['-i', `${out}${pre}-${t}.png`]);
let f = `[0]split=${T.length}` + T.map((_, i) => `[b${i}]`).join('') + ';';
f += T.map((_, i) => `[b${i}][${i + 1}]overlay,drawbox=x=${x0}:y=0:w=${vis}:h=640:color=red@0.5:t=1,drawbox=x=0:y=288:w=360:h=1:color=blue@0.5:t=1[o${i}]`).join(';') + ';';
f += T.map((_, i) => `[o${i}]`).join('') + `hstack=inputs=${T.length}`;
execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'lavfi', '-i', 'color=c=0xF3EADF:s=360x640:d=1', ...ins, '-filter_complex', f, '-frames:v', '1', `${out}${pre}-folha.jpg`]);
console.log('folha:', `${out}${pre}-folha.jpg`);
process.exit(0);
