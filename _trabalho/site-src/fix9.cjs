// Abertura sem o fundo roxo: tampa com recorte (vídeo empilhado cor/alfa + compositor WebGL) sobre a viagem pelas estrelas, no creme
const fs = require("fs");
const f = __dirname + "/../../gloriafestas/index.html";
let s = fs.readFileSync(f, "utf8");
const rep = (a, b) => { if (!s.includes(a)) { console.error("NAO ACHEI:\n" + a.slice(0, 160)); process.exit(1); } s = s.replace(a, () => b); };
const repAll = (a, b, n) => { const c = s.split(a).length - 1; if (c !== n) { console.error(`esperava ${n}x, achei ${c}x:\n` + a.slice(0, 120)); process.exit(1); } s = s.split(a).join(b); };
// troca a linha inteira de CSS que começa com o seletor
const linha = (inicio, nova) => {
  const lines = s.split("\n"); const i = lines.findIndex(l => l.startsWith(inicio));
  if (i < 0) { console.error("LINHA NAO ACHADA: " + inicio); process.exit(1); }
  lines[i] = typeof nova === "function" ? nova(lines[i]) : nova; s = lines.join("\n");
};
const troca = (l, a, b) => { if (!l.includes(a)) { console.error("NA LINHA NAO ACHEI: " + a + "\n" + l.slice(0, 120)); process.exit(1); } return l.replace(a, b); };

// ---------------- CSS
linha(".nav{position:fixed;", l => troca(l, "color:var(--cream);", "color:var(--ink);"));
linha(".brand small{", l => troca(l, "color:var(--gold-light);", "color:var(--gold-ink);"));
linha(".nav .btn-gold{box-shadow:none}", ".nav .btn-gold{box-shadow:none;background:var(--wine);color:var(--cream)}\n.nav .btn-gold::after{border-color:rgba(225,202,139,.55)}\n.nav .btn-gold:hover{background:var(--wine-2)}");
linha(".hero{position:relative;", ".hero{position:relative;height:560vh;background:var(--canvas-2)}");
linha(".stage{position:sticky;", l => troca(l, "color:var(--cream)", "color:var(--ink)"));
linha(".poster{", ".poster{position:absolute;inset:0;background:transparent center/cover no-repeat;transition:opacity .9s var(--ease-out)}\n.stage.video-ready .poster{opacity:0}");
linha(".stage video{", ".stage video{position:absolute;left:0;top:0;width:2px;height:2px;opacity:0;pointer-events:none}");
linha(".stage.video-ready video{", ".ceu{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}\n.tampa-3d{position:absolute;inset:0;width:100%;height:100%;opacity:0;transition:opacity 1s var(--ease-out)}\n.stage.video-ready .tampa-3d{opacity:1}");
linha(".stage.video-failed video{", ".stage.video-failed .tampa-3d{display:none}");
linha(".scrim{", ".scrim{position:absolute;inset:0;pointer-events:none;background:linear-gradient(90deg,rgba(243,234,223,.8) 0%,rgba(243,234,223,.5) 30%,rgba(243,234,223,0) 56%)}");
linha(".band{position:absolute;", l => troca(l, "text-shadow:var(--tshadow);", "text-shadow:0 0 22px rgba(243,234,223,.95);"));
linha(".band::before{", `.band::before{content:"";position:absolute;inset:-34% -38% -34% -46%;z-index:-1;pointer-events:none;opacity:calc(.25 + .75*var(--k,1));background:radial-gradient(ellipse 62% 56% at 44% 50%,rgba(243,234,223,.8) 0%,rgba(243,234,223,.5) 46%,rgba(243,234,223,0) 76%)}`);
linha(".chip{", ".chip{display:inline-flex;align-items:center;gap:10px;padding:8px 14px;border-radius:10px;background:rgba(250,246,239,.78);border:1px solid rgba(184,138,59,.45);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);font:500 12px/1.3 var(--sans);letter-spacing:.24em;text-transform:uppercase;color:var(--gold-ink)}");
linha(".hd{margin:22px 0 0;", l => troca(l, "color:var(--cream)", "color:var(--ink)"));
linha(".hd em{", ".hd em{font-style:italic;font-weight:400;color:var(--wine)}");
linha(".hs{margin:22px 0 0;", l => troca(l, "color:rgba(242,230,207,.92);", "color:var(--text-2);"));
linha(".b1 .wi::after{", l => troca(troca(l, "color:#FFE9B0;", "color:#9C7430;"), "text-shadow:0 0 18px rgba(255,214,140,.55)", "text-shadow:0 0 16px rgba(214,181,108,.5)"));
linha(".b2 .slit{", l => troca(troca(l, "background:linear-gradient(90deg,rgba(255,225,160,0),#FFE3A6 30%,#FFE3A6 70%,rgba(255,225,160,0))", "background:linear-gradient(90deg,rgba(184,138,59,0),#B88A3B 30%,#B88A3B 70%,rgba(184,138,59,0))"), "box-shadow:0 0 18px 2px rgba(255,210,130,.55)", "box-shadow:0 0 14px 1px rgba(214,181,108,.6)"));
linha(".ctas .link-quiet{", ".ctas .link-quiet{color:var(--wine);font-size:16px}");
linha(".cue{position:absolute;", l => troca(troca(l, "color:var(--gold-light);", "color:var(--gold-ink);"), "text-shadow:0 1px 3px rgba(5,5,10,.9);", ""));
linha(".ring{", l => troca(l, "color:var(--gold-light);", "color:var(--gold-ink);"));
linha(".mono{position:absolute;", l => l.replace(/filter:[^}]*\}$/, "filter:drop-shadow(0 0 14px rgba(250,246,239,.9))}"));
linha(".static-hero{display:none;", l => troca(troca(l, "color:var(--cream);", "color:var(--ink);"), "background:#2b0c19", "background:var(--canvas-2)"));
linha(".static-hero .shot::after{", `.static-hero .shot::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(243,234,223,.85) 0%,rgba(243,234,223,.45) 40%,rgba(243,234,223,0) 60%)}`);
linha(".static-hero .hd{", l => troca(l, "text-shadow:var(--tshadow)", "text-shadow:0 0 22px rgba(243,234,223,.95)"));
linha(".static-hero .hs{", ".static-hero .hs{text-shadow:none}");
linha(".static-hero .ctas .link-quiet{", ".static-hero .ctas .link-quiet{text-shadow:none}");
repAll(`url('assets/hero-ending.jpg')`, `url('assets/hero-final.webp')`, 2);
repAll(`url('assets/hero-mobile.jpg')`, `url('assets/hero-mobile.webp')`, 3);
repAll(`background:linear-gradient(180deg,rgba(26,7,16,.5) 0%,rgba(26,7,16,.18) 40%,rgba(26,7,16,0) 58%,rgba(26,7,16,.22) 100%)`, `background:linear-gradient(180deg,rgba(243,234,223,.8) 0%,rgba(243,234,223,.4) 40%,rgba(243,234,223,0) 58%)`, 2);

// ---------------- HTML
rep(`      <div class="poster" id="poster" aria-hidden="true"></div>
      <video id="hero" preload="none" muted playsinline aria-hidden="true" tabindex="-1"></video>`, `      <canvas class="ceu" id="ceu-hero" aria-hidden="true"></canvas>
      <div class="poster" id="poster" aria-hidden="true"></div>
      <canvas class="tampa-3d" id="tampa-3d" aria-hidden="true"></canvas>
      <video id="hero" preload="none" muted playsinline aria-hidden="true" tabindex="-1"></video>`);
rep(`    <div class="static-hero" id="static-hero">
      <div class="shot" aria-hidden="true"></div>`, `    <div class="static-hero" id="static-hero">
      <canvas class="ceu" id="ceu-estatico" aria-hidden="true"></canvas>
      <div class="shot" aria-hidden="true"></div>`);
// botões da abertura em vinho (no creme); a barra do celular continua dourada no fundo escuro
const ctaOuro = `<a class="btn btn-gold" href="#orcamento"><svg aria-hidden="true"><use href="#i-tampa"/></svg>Solicite um orçamento</a>`;
for (let k = 0; k < 2; k++) { const i = s.indexOf(ctaOuro); s = s.slice(0, i) + ctaOuro.replace("btn-gold", "btn-wine") + s.slice(i + ctaOuro.length); }
// monogramas da abertura: GF vinho e anéis dourados (legíveis no creme)
for (const id of ['id="mono"', 'id="mono-static"']) {
  const a = s.indexOf(`<svg class="mono" ${id}`), b = s.indexOf("</svg>", a) + 6;
  let bloco = s.slice(a, b);
  bloco = bloco.split('fill="#F6E9CF"').join('fill="#5A1E3A"').split('stroke="#E1CA8B"').join('stroke="#B88A3B"');
  s = s.slice(0, a) + bloco + s.slice(b);
}

// ---------------- JS
const bytes = fs.statSync(__dirname + "/../../gloriafestas/assets/hero-scrub.mp4").size;
s = s.replace(/const VIDEO_BYTES = \d+;/, `const VIDEO_BYTES = ${bytes};`);
repAll(`'assets/hero-poster.jpg'`, `'assets/hero-inicio.webp'`, 2);
rep(`  video.addEventListener('seeked', () => {
    seekBusy = false;`, `  video.addEventListener('seeked', () => {
    desenharQuadro();
    seekBusy = false;`);
rep(`    video.addEventListener('canplay', () => {
      videoOk = true;
      requestSeek(heroProgress() * video.duration);
      stage.classList.add('video-ready');`, `    video.addEventListener('canplay', () => {
      if (!iniciarCompositor()) { failVideo(); return; }
      medirCompositor();
      videoOk = true;
      desenharQuadro();
      requestSeek(heroProgress() * video.duration);
      stage.classList.add('video-ready');`);
rep(`    placeMono(mono, stage.clientWidth, stage.clientHeight);`, `    placeMono(mono, stage.clientWidth, stage.clientHeight);
    if (comp) { medirCompositor(); desenharQuadro(); }`);
rep(`  function onScroll() {
    target = heroProgress();`, `  let ultimoY = scrollY;
  function onScroll() {
    target = heroProgress();
    if (ceuHero) ceuHero.empurrar(Math.abs(scrollY - ultimoY));   // rolar a página acelera a viagem pelas estrelas
    ultimoY = scrollY;`);
rep(`  // carregador de Blob transmitido com anel honesto`, `  // compositor da tampa: o vídeo traz a cor em cima e o recorte (alfa) embaixo; a placa de vídeo junta os dois
  const tampaCv = $('#tampa-3d');
  let comp = null, cob = [0, 0, 1, 1];
  let ceuHero = null;
  function iniciarCompositor() {
    if (comp) return comp;
    const g = tampaCv.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false });
    if (!g) return null;
    const sh = (tipo, src) => { const x = g.createShader(tipo); g.shaderSource(x, src); g.compileShader(x); return g.getShaderParameter(x, g.COMPILE_STATUS) ? x : null; };
    const vs = sh(g.VERTEX_SHADER, 'attribute vec2 p;varying vec2 uv;void main(){uv=p*.5+.5;gl_Position=vec4(p,0.,1.);}');
    const fs = sh(g.FRAGMENT_SHADER, 'precision mediump float;varying vec2 uv;uniform sampler2D tex;uniform vec4 cob;uniform float lim;' +
      'void main(){vec2 f=cob.xy+uv*cob.zw;' +
      'vec3 c=texture2D(tex,vec2(f.x,clamp(.5+f.y*.5,.5+lim,1.))).rgb;' +
      'float a=texture2D(tex,vec2(f.x,clamp(f.y*.5,0.,.5-lim))).r;' +
      'gl_FragColor=vec4(c,a);}');
    if (!vs || !fs) return null;
    const prog = g.createProgram(); g.attachShader(prog, vs); g.attachShader(prog, fs); g.linkProgram(prog);
    if (!g.getProgramParameter(prog, g.LINK_STATUS)) return null;
    g.useProgram(prog);
    const buf = g.createBuffer(); g.bindBuffer(g.ARRAY_BUFFER, buf);
    g.bufferData(g.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), g.STATIC_DRAW);
    const loc = g.getAttribLocation(prog, 'p'); g.enableVertexAttribArray(loc); g.vertexAttribPointer(loc, 2, g.FLOAT, false, 0, 0);
    const tex = g.createTexture(); g.bindTexture(g.TEXTURE_2D, tex);
    g.pixelStorei(g.UNPACK_FLIP_Y_WEBGL, true);
    [[g.TEXTURE_MIN_FILTER, g.LINEAR], [g.TEXTURE_MAG_FILTER, g.LINEAR], [g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE], [g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE]].forEach(([k, v]) => g.texParameteri(g.TEXTURE_2D, k, v));
    comp = { g, uCob: g.getUniformLocation(prog, 'cob'), uLim: g.getUniformLocation(prog, 'lim') };
    return comp;
  }
  function medirCompositor() {
    const dpr = Math.min(2, devicePixelRatio || 1), W = stage.clientWidth, H = stage.clientHeight;
    tampaCv.width = Math.max(1, Math.round(W * dpr)); tampaCv.height = Math.max(1, Math.round(H * dpr));
    const k = Math.max(W / FRAME_W, H / FRAME_H), fw = (W / k) / FRAME_W, fh = (H / k) / FRAME_H;   // mesmo corte do "cover"
    cob = [.5 - fw / 2, .5 - fh / 2, fw, fh];
  }
  function desenharQuadro() {
    if (!comp || video.readyState < 2) return;
    const g = comp.g;
    g.viewport(0, 0, tampaCv.width, tampaCv.height);
    g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, g.RGBA, g.UNSIGNED_BYTE, video);
    g.uniform4f(comp.uCob, cob[0], cob[1], cob[2], cob[3]);
    g.uniform1f(comp.uLim, .5 / (FRAME_H * 2));
    g.clearColor(0, 0, 0, 0); g.clear(g.COLOR_BUFFER_BIT);
    g.drawArrays(g.TRIANGLE_STRIP, 0, 4);
  }

  // carregador de Blob transmitido com anel honesto`);

// estrelas: uma receita só, usada nos feedbacks, na abertura e na abertura do celular
const a12 = s.indexOf(`  /* ---------- 12. viagem pelas estrelas`), b12 = s.indexOf(`  /* ---------- 6. dúvidas ---------- */`);
if (a12 < 0 || b12 < 0) { console.error("bloco 12 não encontrado"); process.exit(1); }
s = s.slice(0, a12) + `  /* ---------- 12. viagem pelas estrelas (feedbacks e abertura): segure o clique para acelerar ---------- */
  function criarViagem(host, cv, o = {}) {
    if (!host || !cv) return null;
    const ctx = cv.getContext('2d');
    const CORES = [[184, 138, 59], [214, 181, 108], [201, 160, 88], [90, 30, 58]];   // dourado, champanhe, ouro velho, vinho
    const CX = o.cx ?? .5, CY = o.cy ?? .56, BASE = 1.8;
    let W = 1, H = 1, estrelas = [], vel = BASE, alvoVel = BASE, extra = 0, id = null, visivel = false, ultimo = 0;
    function medir() {
      const dpr = Math.min(1.5, devicePixelRatio || 1);
      W = Math.max(1, host.clientWidth); H = Math.max(1, host.clientHeight);
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    const fundo = () => Math.max(W, H);
    function nascerUma(e, longe) {                      // cada estrela tem uma profundidade (z) que diminui a cada quadro
      e.x = (Math.random() - .5) * W * 1.6; e.y = (Math.random() - .5) * H * 1.6;
      e.z = longe ? fundo() : Math.random() * fundo(); e.pz = e.z;
      e.c = CORES[Math.random() < .16 ? 3 : (Math.random() * 3) | 0];
      e.s = Math.random() < .17; e.g = Math.random() * 6.28;   // algumas viram a estrelinha de 4 pontas do logo
      return e;
    }
    function nascer() { estrelas = []; const n = Math.round(Math.min(260, W * H / 5200)); for (let i = 0; i < n; i++) estrelas.push(nascerUma({}, false)); }
    function quadro(agora, parado) {
      const f = parado ? 1 : Math.min(3, (agora - (ultimo || agora)) / 16.667); ultimo = agora;
      vel += (alvoVel - vel) * (1 - Math.pow(1 - .08, f));
      extra *= Math.pow(.9, f);
      const v = vel + extra;
      ctx.globalCompositeOperation = 'destination-out';            // rastro leve: apaga um pouco, sem pintar por cima do creme
      ctx.fillStyle = parado ? '#000' : 'rgba(0,0,0,.3)';
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'source-over';
      const cx = W * CX, cy = H * CY, D = fundo(), foco = Math.min(W, H) * .5;
      for (const e of estrelas) {
        e.pz = e.z;
        if (!parado) e.z -= v * 4 * f;
        if (e.z < 1) { nascerUma(e, true); continue; }
        const k = foco / e.z, ka = foco / e.pz;                   // dividir a posição pela profundidade cria a perspectiva
        const x = cx + e.x * k, y = cy + e.y * k, xa = cx + e.x * ka, ya = cy + e.y * ka;
        if (x < -30 || x > W + 30 || y < -30 || y > H + 30) { nascerUma(e, true); continue; }
        const brilho = Math.min(1, Math.max(.05, 1 - e.z / D));
        const [r, g, b] = e.c, a = Math.max(.14, Math.pow(brilho, .7) * .9).toFixed(3);
        if (Math.abs(x - xa) + Math.abs(y - ya) < .6) { ctx.fillStyle = \`rgba(\${r},\${g},\${b},\${a})\`; ctx.beginPath(); ctx.arc(x, y, .5 + brilho * 1.3, 0, 6.2832); ctx.fill(); }
        else { ctx.strokeStyle = \`rgba(\${r},\${g},\${b},\${a})\`; ctx.lineWidth = .6 + brilho * 2; ctx.beginPath(); ctx.moveTo(xa, ya); ctx.lineTo(x, y); ctx.stroke(); }
        if (e.s && brilho > .25) {                                  // a cabeça vira uma estrelinha de 4 pontas
          const t = 1.2 + brilho * 5.5; e.g += .01 * f;
          ctx.save(); ctx.translate(x, y); ctx.rotate(e.g); ctx.fillStyle = \`rgba(\${r},\${g},\${b},\${a})\`;
          ctx.beginPath(); ctx.moveTo(0, -t); ctx.quadraticCurveTo(t * .14, -t * .14, t, 0); ctx.quadraticCurveTo(t * .14, t * .14, 0, t); ctx.quadraticCurveTo(-t * .14, t * .14, -t, 0); ctx.quadraticCurveTo(-t * .14, -t * .14, 0, -t); ctx.fill(); ctx.restore();
        }
      }
    }
    const rodar = agora => { quadro(agora, false); id = requestAnimationFrame(rodar); };
    const ligar = () => { if (id !== null || RM.matches || !visivel) return; ultimo = 0; id = requestAnimationFrame(rodar); };
    const desligar = () => { if (id === null) return; cancelAnimationFrame(id); id = null; };
    new IntersectionObserver(es => { visivel = es[0].isIntersecting; visivel ? ligar() : desligar(); }).observe(host);   // só roda com a área na tela
    new ResizeObserver(() => { medir(); nascer(); if (id === null) quadro(performance.now(), true); }).observe(host);
    host.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse' || e.button === 0) alvoVel = 7; });   // segurar acelera
    addEventListener('pointerup', () => { alvoVel = BASE; });
    addEventListener('pointercancel', () => { alvoVel = BASE; });
    RM.addEventListener('change', e => { if (e.matches) { desligar(); quadro(performance.now(), true); } else ligar(); });
    medir(); nascer(); quadro(performance.now(), true);          // movimento reduzido: céu parado
    return { empurrar(px) { if (!RM.matches) extra = Math.min(9, extra + px / 45); } };
  }
  (() => {
    const sec = $('#feedbacks');
    if (sec) { const cv = document.createElement('canvas'); cv.className = 'estrelas'; cv.setAttribute('aria-hidden', 'true'); sec.prepend(cv); criarViagem(sec, cv, { cx: .5, cy: .56 }); }
    ceuHero = criarViagem(stage, $('#ceu-hero'), { cx: .64, cy: .56 });
    criarViagem($('#static-hero'), $('#ceu-estatico'), { cx: .5, cy: .74 });
  })();

` + s.slice(b12);

fs.writeFileSync(f, s);
console.log("ok; vídeo", bytes, "bytes");
