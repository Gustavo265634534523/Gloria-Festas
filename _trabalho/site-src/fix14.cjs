// Celular (em pé) com a mesma abertura do computador: a tampa abre e fecha com a rolagem.
// Em pé usa um vídeo próprio (texto em cima, tampa embaixo, cor e recorte lado a lado); deitado segue o de antes.
const fs = require("fs");
const f = __dirname + "/../../gloriafestas/index.html";
let s = fs.readFileSync(f, "utf8");
const rep = (a, b) => { if (!s.includes(a)) { console.error("NAO ACHEI:\n" + a.slice(0, 160)); process.exit(1); } s = s.replace(a, () => b); };

// ---------- CSS: o hero estático fica só para celular deitado (e movimento reduzido, no bloco próprio)
rep(`@media (max-width: 720px), (orientation: portrait) and (max-width: 1024px), (orientation: portrait) and (pointer: coarse), (orientation: landscape) and (pointer: coarse) and (max-height: 560px){
  .hero{height:auto}
  .stage{display:none}
  .static-hero{display:block}
  .static-hero .shot{background-image:url('assets/hero-final.webp');background-position:center}
  .static-hero .inner{justify-content:center;max-width:720px}
  .static-hero .ctas{margin-top:34px}
  .static-hero .mono{display:block}
  @media (orientation:portrait){
    .static-hero .shot{background-image:url('assets/hero-mobile.webp');background-position:center bottom}
    .static-hero .shot::after{background:linear-gradient(180deg,rgba(243,234,223,.8) 0%,rgba(243,234,223,.4) 40%,rgba(243,234,223,0) 58%)}
    .static-hero .inner{justify-content:flex-start;max-width:none;min-height:max(100svh,850px,160vw)}
    .static-hero .ctas{margin-top:30px}
    .static-hero .mono{display:none}
  }
}`,
`@media (orientation: landscape) and (pointer: coarse) and (max-height: 560px){
  .hero{height:auto}
  .stage{display:none}
  .static-hero{display:block}
  .static-hero .shot{background-image:url('assets/hero-final.webp');background-position:center}
  .static-hero .inner{justify-content:center;max-width:720px}
  .static-hero .ctas{margin-top:34px}
  .static-hero .mono{display:block}
}
/* hero estático em pé (sem JavaScript): a mesma composição de antes */
@media (orientation:portrait){
  .static-hero .shot{background-image:url('assets/hero-mobile.webp');background-position:center bottom}
  .static-hero .shot::after{background:linear-gradient(180deg,rgba(243,234,223,.8) 0%,rgba(243,234,223,.4) 40%,rgba(243,234,223,0) 58%)}
  .static-hero .inner{justify-content:flex-start;max-width:none;min-height:max(100svh,850px,160vw)}
  .static-hero .ctas{margin-top:30px}
}
/* abertura animada em pé (celular e tablet): texto em cima, tampa embaixo */
@media (orientation:portrait){
  .scrim{background:linear-gradient(180deg,rgba(243,234,223,.86) 0%,rgba(243,234,223,.6) 26%,rgba(243,234,223,0) 50%)}
  .band{left:var(--gut);right:var(--gut);top:calc(var(--nav-h) + clamp(14px,3.2vh,44px));transform:none;width:auto;max-width:600px}
  .band::before{inset:-24% -12% -30% -12%;background:radial-gradient(ellipse 70% 62% at 42% 46%,rgba(243,234,223,.82) 0%,rgba(243,234,223,.5) 48%,rgba(243,234,223,0) 78%)}
  .stage .chip{letter-spacing:.16em}
  .stage .hd{font-size:clamp(33px,9.2vw,60px)}
  .stage .hs{font-size:clamp(16.5px,4.3vw,20px);max-width:32ch}
  .stage .ctas{margin-top:24px;gap:12px 22px}
  .stage .mono{display:none}
}
@media (orientation:portrait) and (max-height:700px){
  .stage .hd{font-size:clamp(29px,8.2vw,44px)}
  .stage .hs{font-size:16px;margin-top:14px}
}`);

// ---------- JS: os dois vídeos
rep(`  const VIDEO_URL = 'assets/hero-scrub.mp4';
  const VIDEO_BYTES = 1862349;
  const FRAME_W = 1920, FRAME_H = 1080, MONO_X = 0.65, MONO_Y = 0.405, MONO_S = 0.30;`,
`  const FRAME_W = 1920, FRAME_H = 1080, MONO_X = 0.65, MONO_Y = 0.405, MONO_S = 0.30;
  // em pé (celular, tablet) a abertura usa um vídeo próprio: texto em cima, tampa embaixo, cor e recorte lado a lado
  const RETRATO = matchMedia('(orientation: portrait)');
  const VIDEOS = {
    paisagem: { url: 'assets/hero-scrub.mp4', bytes: 1862349, fw: 1920, fh: 1080, lado: 0, capa: 'assets/hero-inicio.webp' },
    retrato: { url: 'assets/hero-scrub-retrato.mp4', bytes: 928270, fw: 720, fh: 1280, lado: 1, capa: 'assets/hero-inicio-retrato.webp' }
  };
  const formato = () => RETRATO.matches ? 'retrato' : 'paisagem';
  let vidFmt = null, pedindo = null, trocando = false;   // o vídeo que está no <video>, o que está a caminho, a troca em curso`);
rep(`    placeMono(mono, stage.clientWidth, stage.clientHeight);
    if (comp) { medirCompositor(); desenharQuadro(); }`,
`    placeMono(mono, stage.clientWidth, stage.clientHeight);
    medirCapa();
    if (comp) { medirCompositor(); desenharQuadro(); }`);

// compositor: sabe ler os dois arranjos (em cima/embaixo e lado a lado)
rep(`    const fs = sh(g.FRAGMENT_SHADER, 'precision mediump float;varying vec2 uv;uniform sampler2D tex;uniform vec4 cob;uniform float lim;' +
      'void main(){vec2 f=cob.xy+uv*cob.zw;' +
      'vec3 c=texture2D(tex,vec2(f.x,clamp(.5+f.y*.5,.5+lim,1.))).rgb;' +
      'float a=texture2D(tex,vec2(f.x,clamp(f.y*.5,0.,.5-lim))).r;' +
      'gl_FragColor=vec4(c,a);}');`,
`    const fs = sh(g.FRAGMENT_SHADER, 'precision mediump float;varying vec2 uv;uniform sampler2D tex;uniform vec4 cob;uniform float lim,lado;' +
      'void main(){vec2 f=cob.xy+uv*cob.zw;vec3 c;float a;' +
      'if(lado>.5){c=texture2D(tex,vec2(clamp(f.x*.5,0.,.5-lim),f.y)).rgb;a=texture2D(tex,vec2(clamp(.5+f.x*.5,.5+lim,1.),f.y)).r;}' +   // em pé: cor à esquerda, recorte à direita
      'else{c=texture2D(tex,vec2(f.x,clamp(.5+f.y*.5,.5+lim,1.))).rgb;a=texture2D(tex,vec2(f.x,clamp(f.y*.5,0.,.5-lim))).r;}' +
      'gl_FragColor=vec4(c,a);}');`);
rep(`    comp = { g, uCob: g.getUniformLocation(prog, 'cob'), uLim: g.getUniformLocation(prog, 'lim') };`,
    `    comp = { g, uCob: g.getUniformLocation(prog, 'cob'), uLim: g.getUniformLocation(prog, 'lim'), uLado: g.getUniformLocation(prog, 'lado') };`);
rep(`  function medirCompositor() {
    const dpr = Math.min(2, devicePixelRatio || 1), W = stage.clientWidth, H = stage.clientHeight;
    tampaCv.width = Math.max(1, Math.round(W * dpr)); tampaCv.height = Math.max(1, Math.round(H * dpr));
    const k = Math.max(W / FRAME_W, H / FRAME_H), fw = (W / k) / FRAME_W, fh = (H / k) / FRAME_H;   // mesmo corte do "cover"
    cob = [.5 - fw / 2, .5 - fh / 2, fw, fh];
  }`,
`  function recorte(V, W, H) {                          // o mesmo corte do "cover", com o foco puxado para a tampa
    const k = Math.max(W / V.fw, H / V.fh), fw = (W / k) / V.fw, fh = (H / k) / V.fh, asp = W / H;
    const fx = V.lado ? .5 : (asp >= 1.25 ? .5 : .5 + (1.25 - asp) * .4);   // janela quase quadrada: não corta a tampa
    const fy = V.lado ? .6 : .5;                       // tablet em pé: o corte guarda a bandeja, que fica embaixo
    return { k, fw, fh, x0: clamp(fx - fw / 2, 0, 1 - fw), y0: clamp(fy - fh / 2, 0, 1 - fh) };
  }
  function medirCompositor() {
    const dpr = Math.min(2, devicePixelRatio || 1), W = stage.clientWidth, H = stage.clientHeight;
    tampaCv.width = Math.max(1, Math.round(W * dpr)); tampaCv.height = Math.max(1, Math.round(H * dpr));
    const r = recorte(VIDEOS[vidFmt || formato()], W, H);
    cob = [r.x0, 1 - r.y0 - r.fh, r.fw, r.fh];         // na textura o y cresce de baixo para cima
  }
  function medirCapa() {                               // a capa (antes do vídeo chegar) no mesmo corte do vídeo
    const V = VIDEOS[formato()], W = stage.clientWidth, H = stage.clientHeight;
    if (!W || !H) return;
    const r = recorte(V, W, H);
    posterLayer.style.backgroundSize = \`\${(V.fw * r.k).toFixed(1)}px \${(V.fh * r.k).toFixed(1)}px\`;
    posterLayer.style.backgroundPosition = \`\${(-r.x0 * V.fw * r.k).toFixed(1)}px \${(-r.y0 * V.fh * r.k).toFixed(1)}px\`;
  }`);
rep(`    if (!comp || video.readyState < 2) return;`, `    if (!comp || trocando || video.readyState < 2) return;`);
rep(`    g.uniform1f(comp.uLim, .5 / (FRAME_H * 2));`,
`    const V = VIDEOS[vidFmt || 'paisagem'];
    g.uniform1f(comp.uLim, V.lado ? .5 / (V.fw * 2) : .5 / (V.fh * 2));
    g.uniform1f(comp.uLado, V.lado);`);

// carregador: o vídeo do formato da tela; se a tela girar, troca pelo outro
rep(`  let started = false, initDone = false, videoOk = false;
  function startBlobFetch() {
    if (started) return;
    started = true;
    loadHeroBlob().catch(failVideo);
  }
  async function loadHeroBlob() {
    const ctrl = new AbortController();
    let watchdog = setTimeout(() => ctrl.abort(), 20000);
    const res = await fetch(VIDEO_URL, { priority: 'low', signal: ctrl.signal });
    if (!res.ok) throw new Error('video ' + res.status);
    const total = Number(res.headers.get('Content-Length')) || VIDEO_BYTES;`,
`  let started = false, initDone = false, videoOk = false, urlAtual = null;
  function startBlobFetch() {
    if (started) return;
    started = true;
    carregarVideo(formato());
  }
  function carregarVideo(fmt) {                        // se a tela girar no meio do caminho, o último pedido vence
    pedindo = fmt;
    loadHeroBlob(fmt).catch(() => { if (pedindo === fmt) pedindo = null; if (!videoOk) failVideo(); });
  }
  async function loadHeroBlob(fmt) {
    const V = VIDEOS[fmt];
    const ctrl = new AbortController();
    let watchdog = setTimeout(() => ctrl.abort(), 20000);
    const res = await fetch(V.url, { priority: 'low', signal: ctrl.signal });
    if (!res.ok) throw new Error('video ' + res.status);
    const total = Number(res.headers.get('Content-Length')) || V.bytes;`);
rep(`    clearTimeout(watchdog);
    ring.style.setProperty('--ld', 0);
    video.src = URL.createObjectURL(new Blob(chunks, { type: 'video/mp4' }));
    video.load();
    video.addEventListener('canplay', () => {
      if (!iniciarCompositor()) { failVideo(); return; }
      medirCompositor();
      videoOk = true;
      desenharQuadro();
      requestSeek(heroProgress() * video.duration);
      stage.classList.add('video-ready');
      setTimeout(() => ring.classList.add('done'), 500);
    }, { once: true });
  }`,
`    clearTimeout(watchdog);
    ring.style.setProperty('--ld', 0);
    if (pedindo !== fmt) return;                       // a tela girou de novo antes do fim: este vídeo já não serve
    const url = URL.createObjectURL(new Blob(chunks, { type: 'video/mp4' }));
    trocando = true; seekBusy = false; pendingTime = null;
    video.addEventListener('canplay', () => {
      trocando = false;
      video.pause();
      if (!iniciarCompositor()) { failVideo(); return; }
      if (urlAtual) URL.revokeObjectURL(urlAtual);
      urlAtual = url; vidFmt = fmt;
      if (pedindo === fmt) pedindo = null;
      medirCompositor();
      videoOk = true;
      desenharQuadro();
      requestSeek(heroProgress() * video.duration);
      stage.classList.add('video-ready');
      setTimeout(() => ring.classList.add('done'), 500);
      if (formato() !== vidFmt && pedindo === null) { stage.classList.remove('video-ready'); carregarVideo(formato()); }   // girou durante a troca
    }, { once: true });
    video.preload = 'auto';
    video.src = url;
    video.load();
    const p = video.play();                            // alguns celulares só preparam os quadros depois de um play (mudo e invisível)
    if (p && p.catch) p.catch(() => {});
  }`);
rep(`    posterLayer.style.backgroundImage = "url('assets/hero-inicio.webp')";
    const img = new Image();
    img.onload = startBlobFetch; img.onerror = startBlobFetch;
    img.src = 'assets/hero-inicio.webp';
    setTimeout(startBlobFetch, 4000);
  }`,
`    const capa = VIDEOS[formato()].capa;
    posterLayer.style.backgroundImage = \`url('\${capa}')\`;
    medirCapa();
    const img = new Image();
    img.onload = startBlobFetch; img.onerror = startBlobFetch;
    img.src = capa;
    setTimeout(startBlobFetch, 4000);
  }
  RETRATO.addEventListener('change', () => {           // girou o tablet ou mudou a janela: troca pelo vídeo do formato novo
    if (!initDone) return;
    const fmt = formato();
    posterLayer.style.backgroundImage = \`url('\${VIDEOS[fmt].capa}')\`;
    if (fmt !== vidFmt) { if (fmt !== pedindo && started) { stage.classList.remove('video-ready'); carregarVideo(fmt); } }
    else if (pedindo) { pedindo = null; if (!trocando) stage.classList.add('video-ready'); }
    measure();
  });`);

// portões: sai a trava de telas pequenas e em pé; ficam celular deitado e movimento reduzido
rep(`  // os cinco portões do hero estático, idênticos aos do CSS e vivos
  const GATES = [
    '(max-width: 720px)',
    '(orientation: portrait) and (max-width: 1024px)',
    '(orientation: portrait) and (pointer: coarse)',
    '(orientation: landscape) and (pointer: coarse) and (max-height: 560px)',`,
`  // os portões do hero estático (celular deitado e movimento reduzido), idênticos aos do CSS e vivos
  const GATES = [
    '(orientation: landscape) and (pointer: coarse) and (max-height: 560px)',`);

// estrelas da abertura: em pé o centro fica atrás da tampa, que está embaixo
rep(`      const cx = W * CX, cy = H * CY, D = fundo(), foco = Math.min(W, H) * .5;`,
    `      const cx = W * (typeof CX === 'function' ? CX() : CX), cy = H * (typeof CY === 'function' ? CY() : CY), D = fundo(), foco = Math.min(W, H) * .5;`);
rep(`    ceuHero = criarViagem(stage, $('#ceu-hero'), { cx: .64, cy: .56 });`,
    `    ceuHero = criarViagem(stage, $('#ceu-hero'), { cx: () => RETRATO.matches ? .5 : .64, cy: () => RETRATO.matches ? .7 : .56 });`);

fs.writeFileSync(f, s);
console.log("ok");
