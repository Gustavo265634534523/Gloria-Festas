// Shader de fundo (veludo vinho com brilho dourado) na seção de fotos, adaptado do efeito 31 enviado pelo usuário
const fs = require("fs");
const f = __dirname + "/../../gloriafestas/index.html";
let s = fs.readFileSync(f, "utf8");
const rep = (a, b) => { if (!s.includes(a)) { console.error("NAO ACHEI:\n" + a.slice(0, 140)); process.exit(1); } s = s.replace(a, b); };

// HTML: o canvas fica atrás de tudo na seção
rep(`  <section class="section served reveal" id="fotos" aria-labelledby="fotos-t">
    <div class="motes" aria-hidden="true">`,
`  <section class="section served reveal" id="fotos" aria-labelledby="fotos-t">
    <canvas class="velvet" aria-hidden="true"></canvas>
    <div class="motes" aria-hidden="true">`);

// CSS: canvas atrás, conteúdo acima; o degradê do CSS fica como reserva
rep(`.motes{position:absolute;inset:0;pointer-events:none}`,
`.velvet{position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none;opacity:0;transition:opacity 1.4s var(--ease-out)}
.velvet.on{opacity:1}
.served .wrap{position:relative;z-index:1}
.motes{position:absolute;inset:0;pointer-events:none}`);

// JS: o efeito, com o laço que só roda com a seção na tela
const js = `
  /* ---------- 9. fundo de veludo com shader (seção de fotos) ---------- */
  (() => {
    const sec = $('#fotos'), cv = $('.velvet', sec);
    if (!cv) return;
    const gl = cv.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' }) || cv.getContext('experimental-webgl');
    if (!gl) return;                                   // placa antiga: fica o degradê do CSS
    const vertice = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
    const pixel = [
      'precision highp float;',
      'uniform vec2 tela; uniform float t; uniform vec2 mouse; uniform float forca;',
      /* ondas somadas em escalas diferentes: a receita de nuvem, aqui virando veludo */
      'float onda(vec2 p){ return sin(p.x*1.7+t*.45)*cos(p.y*1.3-t*.35); }',
      'float ruido(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453); }',
      'void main(){',
      '  vec2 uv = gl_FragCoord.xy / tela;',
      '  vec2 asp = vec2(tela.x / tela.y, 1.);',
      '  vec2 q = uv * asp * 2.4;',
      '  float f = onda(q) + .5*onda(q*2.1+t*.25) + .25*onda(q*4.3-t*.18);',
      '  float luz = exp(-distance(uv*asp, mouse*asp) * 3.6) * forca;',
      '  vec3 noite = vec3(.118,.031,.063);',        /* vinho quase noite */
      '  vec3 vinho = vec3(.318,.098,.196);',        /* o vinho do logo */
      '  vec3 ouro  = vec3(.722,.541,.231);',        /* o dourado do logo */
      '  vec3 c = mix(noite, vinho, smoothstep(-.9, 1.35, f));',
      '  c = mix(c, ouro, smoothstep(1.15, 1.7, f) * .30);',   /* brilho dourado raro nas cristas */
      '  c += ouro * luz * .40;',                              /* a luz dourada segue o mouse */
      '  float borda = smoothstep(0., .16, uv.y) * smoothstep(1., .84, uv.y);',
      '  c = mix(noite, c, .6 + .4 * borda);',
      '  c += (ruido(gl_FragCoord.xy + fract(t)) - .5) / 255.;', /* grão fino contra faixas */
      '  gl_FragColor = vec4(c, 1.);',
      '}'
    ].join('\\n');
    const compilar = (tipo, fonte) => { const sh = gl.createShader(tipo); gl.shaderSource(sh, fonte); gl.compileShader(sh); return gl.getShaderParameter(sh, gl.COMPILE_STATUS) ? sh : null; };
    const vs = compilar(gl.VERTEX_SHADER, vertice), fs = compilar(gl.FRAGMENT_SHADER, pixel);
    if (!vs || !fs) return;
    const prog = gl.createProgram();
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    const buf = gl.createBuffer();                     // dois triângulos cobrindo a área toda
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const pLoc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(pLoc);
    gl.vertexAttribPointer(pLoc, 2, gl.FLOAT, false, 0, 0);
    const uTela = gl.getUniformLocation(prog, 'tela'), uT = gl.getUniformLocation(prog, 't');
    const uMouse = gl.getUniformLocation(prog, 'mouse'), uForca = gl.getUniformLocation(prog, 'forca');
    const ESCALA = 0.6;                                // o veludo é suave: meia resolução basta
    let W = 1, H = 1;
    function medir() {
      const r = cv.getBoundingClientRect(), d = Math.min(2, devicePixelRatio || 1) * ESCALA;
      W = Math.max(1, Math.round(r.width * d)); H = Math.max(1, Math.round(r.height * d));
      if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; }
      gl.viewport(0, 0, W, H);
    }
    let mx = .5, my = .55, tx = .5, ty = .55, forca = .5, ultimoMov = -1e9, ultimo = 0;
    sec.addEventListener('pointermove', e => {
      const r = cv.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width; ty = 1 - (e.clientY - r.top) / r.height;
      ultimoMov = performance.now();
    }, { passive: true });
    sec.addEventListener('pointerleave', () => { ultimoMov = -1e9; });
    const t0 = performance.now();
    function desenhar(agora, parado) {
      const dt = Math.min(64, agora - (ultimo || agora)); ultimo = agora;
      const t = parado ? 14 : (agora - t0) / 1000 * 0.6;
      const solto = agora - ultimoMov > 2500;
      if (solto) { tx = .5 + .3 * Math.sin(t * .37); ty = .55 + .2 * Math.sin(t * .29 + 1.3); }  // sem mouse, a luz passeia sozinha
      const k = 1 - Math.pow(1 - .06, dt / 16.667);
      mx += (tx - mx) * k; my += (ty - my) * k;
      forca += ((solto ? .6 : 1) - forca) * k;
      gl.uniform2f(uTela, W, H); gl.uniform1f(uT, t);
      gl.uniform2f(uMouse, parado ? .5 : mx, parado ? .55 : my); gl.uniform1f(uForca, parado ? .6 : forca);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    let id = null, vivo = false, visivel = false;
    const rodar = agora => { desenhar(agora, false); id = requestAnimationFrame(rodar); };
    const ligar = () => { if (vivo || RM.matches) return; vivo = true; ultimo = 0; id = requestAnimationFrame(rodar); };
    const desligar = () => { if (!vivo) return; vivo = false; cancelAnimationFrame(id); };
    new ResizeObserver(() => { medir(); if (!vivo) desenhar(performance.now(), RM.matches); }).observe(cv);
    new IntersectionObserver(es => { visivel = es[0].isIntersecting; visivel ? ligar() : desligar(); }).observe(sec);
    RM.addEventListener('change', e => { if (e.matches) { desligar(); desenhar(performance.now(), true); } else if (visivel) ligar(); });
    medir();
    desenhar(performance.now(), RM.matches);          // movimento reduzido: um quadro parado, bonito
    cv.classList.add('on');
  })();
`;
rep(`  /* ---------- partida ---------- */`, js + `
  /* ---------- partida ---------- */`);

fs.writeFileSync(f, s);
console.log("ok");
