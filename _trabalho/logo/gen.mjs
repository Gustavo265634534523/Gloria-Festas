// Gera o emblema da Glória Festas em SVG limpo (redesenho fiel do logo do PDF)
import { writeFileSync } from 'node:fs';
const r2 = v => Math.round(v * 100) / 100;
const quad = (p0, p1, p2, t) => [0, 1].map(i => (1 - t) ** 2 * p0[i] + 2 * (1 - t) * t * p1[i] + t * t * p2[i]);
const quadD = (p0, p1, p2, t) => [0, 1].map(i => 2 * (1 - t) * (p1[i] - p0[i]) + 2 * t * (p2[i] - p1[i]));
function leaf(L, W) { // folha amendoada apontando para +x, base na origem
  return `M0 0C${r2(L*.28)} ${r2(-W)} ${r2(L*.72)} ${r2(-W*.95)} ${r2(L)} 0C${r2(L*.72)} ${r2(W*.95)} ${r2(L*.28)} ${r2(W)} 0 0Z`;
}
function branch(mirror) {
  const P0 = [276, 446], P1 = [168, 430], P2 = [160, 292];
  const m = p => mirror ? [600 - p[0], p[1]] : p;
  const parts = [];
  const [s0, s1, s2] = [m(P0), m(P1), m(P2)];
  parts.push(`<path d="M${r2(s0[0])} ${r2(s0[1])}Q${r2(s1[0])} ${r2(s1[1])} ${r2(s2[0])} ${r2(s2[1])}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="0.1 4.2" opacity=".9"/>`);
  const n = 7;
  for (let i = 0; i < n; i++) {
    const t = 0.10 + i * 0.125;
    const p = m(quad(P0, P1, P2, t));
    let d = quadD(P0, P1, P2, t); if (mirror) d = [-d[0], d[1]];
    const ang = Math.atan2(d[1], d[0]) * 180 / Math.PI;
    const L = 23 - i * 1.3, W = 6.6 - i * 0.28;
    for (const side of [-1, 1]) {
      const a = ang + side * 38 * (mirror ? -1 : 1);
      parts.push(`<path d="${leaf(L, W)}" transform="translate(${r2(p[0])} ${r2(p[1])}) rotate(${r2(a)})"/>`);
    }
  }
  const pt = m(P2); let dt = quadD(P0, P1, P2, 1); if (mirror) dt = [-dt[0], dt[1]];
  parts.push(`<path d="${leaf(21, 6)}" transform="translate(${r2(pt[0])} ${r2(pt[1])}) rotate(${r2(Math.atan2(dt[1], dt[0]) * 180 / Math.PI)})"/>`);
  return parts.join('');
}
const star = (x, y, s) => `<path transform="translate(${x} ${y}) scale(${s})" d="M0-11C1.4-3.2 3.2-1.4 11 0 3.2 1.4 1.4 3.2 0 11-1.4 3.2-3.2 1.4-11 0-3.2-1.4-1.4-3.2 0-11Z"/>`;

const emblem = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" role="img" aria-label="Buffet Glória Festas">
<defs>
<path id="gf-arc-top" d="M112 300A188 188 0 0 1 488 300"/>
<path id="gf-arc-bot" d="M93 300A207 207 0 0 0 507 300"/>
</defs>
<g fill="none" stroke="#B88A3B">
<circle cx="300" cy="300" r="244" stroke-width="7" stroke-dasharray="1.3 3.2"/>
<circle cx="300" cy="300" r="231" stroke-width="1.6" stroke-dasharray="0.1 3.6" stroke-linecap="round"/>
</g>
<g fill="#B88A3B">${star(84, 300, 1.05)}${star(516, 300, 1.05)}</g>
<text font-family="'Bodoni Moda',Didot,'Playfair Display',Georgia,serif" font-weight="700" font-size="40" letter-spacing="7" fill="#5A1E3A"><textPath href="#gf-arc-top" startOffset="50%" text-anchor="middle">GLORIA FESTAS</textPath></text>
<circle cx="300" cy="300" r="174" fill="#5A1E3A"/>
<circle cx="300" cy="300" r="163" fill="none" stroke="#B88A3B" stroke-width="1.4" stroke-dasharray="4 4" opacity=".75"/>
<g fill="none" stroke="#C99A48" stroke-width="3.2" stroke-linecap="round">
<path d="M273 206A27 27 0 0 1 327 206"/><path d="M266 209H334"/><path d="M272 215H328" stroke-width="2.4"/>
<circle cx="300" cy="176" r="3.6" stroke-width="2.6"/>
<path d="M300 165V158M288 169l-4-5M312 169l4-5" stroke-width="2.4"/>
</g>
<g fill="#B88A3B" color="#B88A3B">${branch(false)}${branch(true)}</g>
<text x="300" y="338" text-anchor="middle" font-family="'Bodoni Moda',Didot,Georgia,serif" font-style="italic" font-weight="500" font-size="124" letter-spacing="-2" fill="#F2E6CF">GF</text>
<path d="M254 370H346" stroke="#B88A3B" stroke-width="2" stroke-dasharray="1.5 3.5"/>
<text font-family="'Bodoni Moda',Didot,Georgia,serif" font-weight="700" font-size="22" letter-spacing="10" fill="#B88A3B"><textPath href="#gf-arc-bot" startOffset="50%" text-anchor="middle">BUFFET</textPath></text>
</svg>`;
writeFileSync('emblema.svg', emblem);
// página de prova para inspecionar o emblema renderizado com as fontes reais
writeFileSync('prova.html', `<!doctype html><meta charset="utf-8"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,500;0,6..96,700;1,6..96,500&family=Jost:wght@500;600&display=block" rel="stylesheet"><style>body{margin:0;background:#FAF6EF;display:grid;place-items:center;height:100vh}svg{width:600px;height:600px}</style>${emblem}`);
console.log('ok', emblem.length, 'bytes');
