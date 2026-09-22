// Gera o molde do anel 3D: campo de distância (SDF) de "GLÓRIA FESTAS ✦" em tons de cinza
// uso: node nomesdf.mjs [peso] [opsz] [espaçamento]   ex.: node nomesdf.mjs 700 14 .08
import { launch, navigate } from './cdp.mjs';
import { writeFileSync, readFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const PESO = +(process.argv[2] || 700), OPSZ = +(process.argv[3] || 14), LS = +(process.argv[4] || .08);
const FS = 320;          // tamanho da fonte na captura (alta resolução)
const RED = 2;           // o molde final tem metade da resolução da captura
const S = 20;            // alcance do campo, em pixels do molde final
const SH = S * RED;      // o mesmo alcance em pixels da captura
const pasta = 'C:/Users/tvnn/Desktop/site minha mae/_trabalho/render/nome';
const destino = process.argv[5] || 'C:/Users/tvnn/Desktop/site minha mae/gloriafestas/assets/nome-3d.png';
mkdirSync(pasta, { recursive: true });

// 1) a fonte do site desenha o texto branco no preto e o Edge fotografa
const c = await launch({ port: 9800 + Math.floor(Math.random() * 150) });
await c.send('Emulation.setDeviceMetricsOverride', { width: 4400, height: 900, deviceScaleFactor: 1, mobile: false });
await navigate(c, `file:///C:/Users/tvnn/Desktop/site%20minha%20mae/_trabalho/render/nome-texto.html?w=${PESO}&o=${OPSZ}&ls=${LS}&fs=${FS}`, 400);
const m = await c.evaluate('medidas()');
if (!m.fonteOk) console.error('ATENCAO: a fonte Bodoni Moda nao carregou');
const clip = { x: Math.floor(m.x), y: Math.floor(m.y), width: Math.ceil(m.w) + 2, height: Math.ceil(m.h) + 2, scale: 1 };
const shot = await c.send('Page.captureScreenshot', { format: 'png', clip, captureBeyondViewport: true });
c.close();
writeFileSync(pasta + '/texto.png', Buffer.from(shot.data, 'base64'));
const [tw, th] = execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', pasta + '/texto.png']).toString().trim().split(',').map(Number);
execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', pasta + '/texto.png', '-f', 'rawvideo', '-pix_fmt', 'gray', pasta + '/texto.raw']);
const img = readFileSync(pasta + '/texto.raw');
const tinta = (x, y) => img[y * tw + x] >= 128;

// 2) medidas da tinta: caixa do texto e altura das maiúsculas pelo F (topo e pé retos)
let x0 = tw, x1 = -1, y0 = th, y1 = -1;
for (let y = 0; y < th; y++) for (let x = 0; x < tw; x++) if (tinta(x, y)) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
const F = m.letras.find(l => l.c === 'F');
const fx0 = Math.round(F.x - clip.x + F.w * .25), fx1 = Math.round(F.x - clip.x + F.w * .55);
let capTopo = th, base = -1;
for (let y = 0; y < th; y++) for (let x = fx0; x <= fx1; x++) if (tinta(x, y)) { if (y < capTopo) capTopo = y; if (y > base) base = y; }
base += 1;                                   // a linha de base fica logo abaixo do último pixel do F
const cap = base - capTopo;
console.log(`texto ${x1 - x0 + 1}x${y1 - y0 + 1}px, maiúscula ${cap}px, acento sobe ${capTopo - y0}px`);

// 3) monta um período do anel: [meio vão] GLÓRIA FESTAS [vão] ✦ [meio vão]
const rs = Math.round(cap * .36);            // raio da estrelinha de 4 pontas do logo
const vao = Math.round(cap * .62);
let P = (x1 - x0 + 1) + 2 * vao + 2 * rs;
P = Math.ceil(P / RED) * RED;
const topo = y0 - SH - 8, fundo = y1 + SH + 8;
let Hh = fundo - topo; Hh = Math.ceil(Hh / RED) * RED;
const mask = new Uint8Array(P * Hh);
const dx = Math.round(vao / 2) - x0, dy = -topo;
for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (tinta(x, y)) mask[(y + dy) * P + (x + dx)] = 1;
// estrelinha: curvas quadráticas iguais às do site, achatadas num polígono
const ecx = Math.round(vao / 2) + (x1 - x0 + 1) + vao + rs, ecy = base - cap / 2 + dy;
const pts = [];
const quad = (ax, ay, bx, by, cx2, cy2) => { for (let i = 1; i <= 32; i++) { const t = i / 32, u = 1 - t; pts.push([u * u * ax + 2 * u * t * bx + t * t * cx2, u * u * ay + 2 * u * t * by + t * t * cy2]); } };
const t = rs, k = .14;
quad(0, -t, k * t, -k * t, t, 0); quad(t, 0, k * t, k * t, 0, t); quad(0, t, -k * t, k * t, -t, 0); quad(-t, 0, -k * t, -k * t, 0, -t);
const dentro = (px, py) => { let d = false; for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) { const [xi, yi] = pts[i], [xj, yj] = pts[j]; if ((yi > py) !== (yj > py) && px < (xj - xi) * (py - yi) / (yj - yi) + xi) d = !d; } return d; };
for (let y = Math.floor(ecy - t - 2); y <= Math.ceil(ecy + t + 2); y++) for (let x = Math.floor(ecx - t - 2); x <= Math.ceil(ecx + t + 2); x++)
  if (dentro(x + .5 - ecx, y + .5 - ecy)) mask[y * P + x] = 1;

// 4) transformada de distância exata (Felzenszwalb) por dentro e por fora
const INF = 1e20;
function edt(feat) {                          // feat[i] = 1 onde está a característica → distância² até ela
  const g = new Float64Array(P * Hh);
  for (let i = 0; i < g.length; i++) g[i] = feat[i] ? 0 : INF;
  const n = Math.max(P, Hh), f = new Float64Array(n), d = new Float64Array(n), v = new Int32Array(n), z = new Float64Array(n + 1);
  const passo1d = len => {
    let kk = 0; v[0] = 0; z[0] = -INF; z[1] = INF;
    for (let q = 1; q < len; q++) {
      let s = ((f[q] + q * q) - (f[v[kk]] + v[kk] * v[kk])) / (2 * q - 2 * v[kk]);
      while (s <= z[kk]) { kk--; s = ((f[q] + q * q) - (f[v[kk]] + v[kk] * v[kk])) / (2 * q - 2 * v[kk]); }
      kk++; v[kk] = q; z[kk] = s; z[kk + 1] = INF;
    }
    kk = 0;
    for (let q = 0; q < len; q++) { while (z[kk + 1] < q) kk++; d[q] = (q - v[kk]) * (q - v[kk]) + f[v[kk]]; }
  };
  for (let x = 0; x < P; x++) { for (let y = 0; y < Hh; y++) f[y] = g[y * P + x]; passo1d(Hh); for (let y = 0; y < Hh; y++) g[y * P + x] = d[y]; }
  for (let y = 0; y < Hh; y++) { for (let x = 0; x < P; x++) f[x] = g[y * P + x]; passo1d(P); for (let x = 0; x < P; x++) g[y * P + x] = d[x]; }
  return g;
}
const fora = edt(mask), inv = new Uint8Array(P * Hh);
for (let i = 0; i < inv.length; i++) inv[i] = mask[i] ? 0 : 1;
const dentroD = edt(inv);
const sd = new Float32Array(P * Hh);          // positivo fora, negativo dentro (pixels da captura)
for (let i = 0; i < sd.length; i++) sd[i] = mask[i] ? -(Math.sqrt(dentroD[i]) - .5) : (Math.sqrt(fora[i]) - .5);

// 5) reduz 2x, limita ao alcance e grava em 8 bits (128 = borda, claro = dentro)
const Pf = P / RED, Hf = Hh / RED, outb = Buffer.alloc(Pf * Hf);
for (let y = 0; y < Hf; y++) for (let x = 0; x < Pf; x++) {
  let s = 0; for (let j = 0; j < RED; j++) for (let i = 0; i < RED; i++) s += sd[(y * RED + j) * P + x * RED + i];
  const dd = Math.max(-S, Math.min(S, s / (RED * RED) / RED));
  outb[y * Pf + x] = Math.round((.5 - dd / (2 * S)) * 255);
}
writeFileSync(pasta + '/molde.raw', outb);
execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'gray', '-s', `${Pf}x${Hf}`, '-i', pasta + '/molde.raw', '-pix_fmt', 'gray', destino]);
const info = { largura: Pf, altura: Hf, maiuscula: cap / RED, base: (base + dy) / RED, alcance: S, centro: (Math.round(vao / 2) + (x1 - x0 + 1) / 2) / RED, peso: PESO, opsz: OPSZ, espacamento: LS };
writeFileSync(pasta + '/molde.json', JSON.stringify(info, null, 1));
console.log(JSON.stringify(info));
