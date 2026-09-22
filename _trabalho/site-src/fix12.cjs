// Fundo do site (depois da abertura): sai a viagem pelas estrelas, entra o Grainient (React Bits) em JS puro,
// com as cores do site. A abertura (primeira página) não muda nada: ela tem fundo creme próprio e cobre o fundo fixo.
const fs = require("fs");
const f = __dirname + "/../../gloriafestas/index.html";
let s = fs.readFileSync(f, "utf8");
const rep = (a, b) => { if (!s.includes(a)) { console.error("NAO ACHEI:\n" + a.slice(0, 160)); process.exit(1); } s = s.replace(a, () => b); };

// CSS: a tela do Grainient no fundo fixo; com ela ligada, saem os brilhos e o granulado antigos (o Grainient tem o seu)
rep(`.ambient{position:fixed;inset:0;z-index:-1;pointer-events:none;overflow:hidden;background:var(--canvas-2)}`,
    `.ambient{position:fixed;inset:0;z-index:-1;pointer-events:none;overflow:hidden;background:var(--canvas-2)}
.ambient .grao{position:absolute;left:0;top:0;width:100%;height:100vh;height:100lvh;display:block;opacity:0;transition:opacity .9s var(--ease-out)}
.ambient .grao.on{opacity:1}
.ambient.com-grao i,.ambient.com-grao::after{display:none}
#festas::before{content:"";position:absolute;left:0;right:0;top:0;height:min(34vh,300px);background:linear-gradient(180deg,var(--canvas-2),rgba(243,234,223,0));pointer-events:none;z-index:-1}`);

// JS: variáveis e o gancho da rolagem (o fundo só anima quando aparece na tela)
rep(`  let ceuHero = null, ceuSite = null;`, `  let ceuHero = null, grao = null;`);
rep(`  let ultimoYSite = scrollY;
`, `  const fotosSec = $('#fotos'), rodape = $('#rodape');
  const cobreTudo = el => { if (!el) return false; const r = el.getBoundingClientRect(); return r.top <= 0 && r.bottom >= innerHeight; };
`);
rep(`      if (ceuSite) { ceuSite.ativar(heroEnd < innerHeight - 1); ceuSite.empurrar(Math.abs(scrollY - ultimoYSite)); }
      ultimoYSite = scrollY;
`, `      if (grao) grao.ativar(heroEnd < innerHeight - 1 && !cobreTudo(fotosSec) && !cobreTudo(rodape));   // parado atrás da abertura e das seções escuras
`);

// JS: sai o céu do site inteiro (as estrelas da abertura ficam)
rep(`    const amb = $('.ambient'), cv = document.createElement('canvas');   // o fundo do site inteiro
    cv.className = 'ceu'; cv.setAttribute('aria-hidden', 'true'); amb.appendChild(cv);
    ceuSite = criarViagem(amb, cv, { cx: .5, cy: .5, gatilho: document,
      filtro: e => !e.target.closest('a,input,select,textarea,label,.qa button,.rv-btn,.serve,.btn,.lb') });
    onPageScroll();
  })();
`, `    onPageScroll();
  })();

  /* ---------- 5c. fundo Grainient (React Bits) nas seções depois da abertura, em JS puro e nas cores do site ---------- */
  grao = (() => {
    const amb = $('.ambient'), cv = document.createElement('canvas');
    cv.className = 'grao'; cv.setAttribute('aria-hidden', 'true');
    const op = { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: 'low-power' };
    const gl = cv.getContext('webgl2', op) || cv.getContext('webgl', op);
    if (!gl) return null;                                  // sem WebGL: fica o fundo creme com os brilhos de antes
    const hp = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
    if (!hp || hp.precision < 16) return null;
    // ajustes do componente (os mesmos nomes das props); cores: creme, champanhe dourado e o rosé do vinho
    const P = { color1: '#FBF6EE', color2: '#E9D2A2', color3: '#E6C6CD', timeSpeed: .25, colorBalance: 0, warpStrength: 1, warpFrequency: 5,
      warpSpeed: 2, warpAmplitude: 50, blendAngle: 0, blendSoftness: .05, rotationAmount: 500, noiseScale: 2, grainAmount: .08, grainScale: 2,
      contrast: 1, gamma: 1, saturation: 1, centerX: 0, centerY: 0, zoom: .9 };
    const n = x => (+x).toFixed(4), rgb = h => h.slice(1).match(/../g).map(x => n(parseInt(x, 16) / 255)).join(',');
    const VS = 'attribute vec2 position;void main(){gl_Position=vec4(position,0.,1.);}';
    const FS = \`precision highp float;
uniform vec2 iResolution;uniform float iTime;
const float uTimeSpeed=\${n(P.timeSpeed)},uColorBalance=\${n(P.colorBalance)},uWarpStrength=\${n(P.warpStrength)},uWarpFrequency=\${n(P.warpFrequency)},uWarpSpeed=\${n(P.warpSpeed)},uWarpAmplitude=\${n(P.warpAmplitude)};
const float uBlendAngle=\${n(P.blendAngle)},uBlendSoftness=\${n(P.blendSoftness)},uRotationAmount=\${n(P.rotationAmount)},uNoiseScale=\${n(P.noiseScale)},uGrainAmount=\${n(P.grainAmount)},uGrainScale=\${n(P.grainScale)};
const float uContrast=\${n(P.contrast)},uGamma=\${n(P.gamma)},uSaturation=\${n(P.saturation)},uZoom=\${n(P.zoom)};
const vec2 uCenterOffset=vec2(\${n(P.centerX)},\${n(P.centerY)});
const vec3 uColor1=vec3(\${rgb(P.color1)}),uColor2=vec3(\${rgb(P.color2)}),uColor3=vec3(\${rgb(P.color3)});
#define S(a,b,t) smoothstep(a,b,t)
mat2 Rot(float a){float s=sin(a),c=cos(a);return mat2(c,-s,s,c);}
vec2 hash(vec2 p){p=vec2(dot(p,vec2(2127.1,81.17)),dot(p,vec2(1269.5,283.37)));return fract(sin(p)*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.0-2.0*f);float n=mix(mix(dot(-1.0+2.0*hash(i+vec2(0.0,0.0)),f-vec2(0.0,0.0)),dot(-1.0+2.0*hash(i+vec2(1.0,0.0)),f-vec2(1.0,0.0)),u.x),mix(dot(-1.0+2.0*hash(i+vec2(0.0,1.0)),f-vec2(0.0,1.0)),dot(-1.0+2.0*hash(i+vec2(1.0,1.0)),f-vec2(1.0,1.0)),u.x),u.y);return 0.5+0.5*n;}
void main(){
  float t=iTime*uTimeSpeed;
  vec2 uv=gl_FragCoord.xy/iResolution.xy;
  float ratio=iResolution.x/iResolution.y;
  vec2 tuv=uv-0.5+uCenterOffset;
  tuv/=max(uZoom,0.001);
  float degree=noise(vec2(t*0.1,tuv.x*tuv.y)*uNoiseScale);
  tuv.y*=1.0/ratio;
  tuv*=Rot(radians((degree-0.5)*uRotationAmount+180.0));
  tuv.y*=ratio;
  float amplitude=uWarpAmplitude/max(uWarpStrength,0.001);
  float warpTime=t*uWarpSpeed;
  tuv.x+=sin(tuv.y*uWarpFrequency+warpTime)/amplitude;
  tuv.y+=sin(tuv.x*(uWarpFrequency*1.5)+warpTime)/(amplitude*0.5);
  float b=uColorBalance,s=max(uBlendSoftness,0.0);
  float blendX=(tuv*Rot(radians(uBlendAngle))).x;
  float edge0=-0.3-b-s,edge1=0.2-b+s,v0=0.5-b+s,v1=-0.3-b-s;
  vec3 layer1=mix(uColor3,uColor2,S(edge0,edge1,blendX));
  vec3 layer2=mix(uColor2,uColor1,S(edge0,edge1,blendX));
  vec3 col=mix(layer1,layer2,1.0-S(v1,v0,tuv.y));
  float grain=fract(sin(dot(uv*max(uGrainScale,0.001),vec2(12.9898,78.233)))*43758.5453);
  col+=(grain-0.5)*uGrainAmount;
  col=(col-0.5)*uContrast+0.5;
  col=mix(vec3(dot(col,vec3(0.2126,0.7152,0.0722))),col,uSaturation);
  col=pow(max(col,0.0),vec3(1.0/max(uGamma,0.001)));
  gl_FragColor=vec4(clamp(col,0.0,1.0),1.0);
}\`;
    let uRes = null, uTime = null;
    function iniciar() {
      const sh = (tipo, src) => { const o = gl.createShader(tipo); gl.shaderSource(o, src); gl.compileShader(o); return gl.getShaderParameter(o, gl.COMPILE_STATUS) ? o : null; };
      const vs = sh(gl.VERTEX_SHADER, VS), fs = sh(gl.FRAGMENT_SHADER, FS);
      if (!vs || !fs) return false;
      const pr = gl.createProgram();
      gl.attachShader(pr, vs); gl.attachShader(pr, fs); gl.linkProgram(pr);
      if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return false;
      gl.useProgram(pr);
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);   // um triângulo cobre a tela
      const lp = gl.getAttribLocation(pr, 'position'); gl.enableVertexAttribArray(lp); gl.vertexAttribPointer(lp, 2, gl.FLOAT, false, 0, 0);
      uRes = gl.getUniformLocation(pr, 'iResolution'); uTime = gl.getUniformLocation(pr, 'iTime');
      return true;
    }
    if (!iniciar()) return null;
    let t = 0, ultimo = 0, id = null, ativo = false;
    function medir() {
      const w = Math.max(1, cv.clientWidth), h = Math.max(1, cv.clientHeight);
      let d = Math.min(1.5, devicePixelRatio || 1);
      if (w * h * d * d > 2e6) d = Math.sqrt(2e6 / (w * h));   // telas enormes: menos pixels, o degradê é macio
      cv.width = Math.round(w * d); cv.height = Math.round(h * d);
      gl.viewport(0, 0, cv.width, cv.height);
    }
    function desenhar() { gl.uniform2f(uRes, cv.width, cv.height); gl.uniform1f(uTime, t); gl.drawArrays(gl.TRIANGLES, 0, 3); }
    const rodar = agora => {
      id = requestAnimationFrame(rodar);
      if (!ultimo) { ultimo = agora; return; }
      if (agora - ultimo < 32) return;                    // 30 quadros por segundo bastam para um degradê lento
      t += Math.min(agora - ultimo, 100) / 1000; ultimo = agora;   // o tempo só anda com o fundo à vista: nada pula ao voltar
      desenhar();
    };
    const ligar = () => { if (id !== null || !ativo || RM.matches) return; ultimo = 0; id = requestAnimationFrame(rodar); };
    const desligar = () => { if (id === null) return; cancelAnimationFrame(id); id = null; };
    amb.appendChild(cv);
    medir(); desenhar();
    amb.classList.add('com-grao'); cv.classList.add('on');
    new ResizeObserver(() => { medir(); desenhar(); }).observe(cv);
    RM.addEventListener('change', e => { if (e.matches) { desligar(); desenhar(); } else ligar(); });   // movimento reduzido: quadro parado
    cv.addEventListener('webglcontextlost', e => { e.preventDefault(); desligar(); amb.classList.remove('com-grao'); });
    cv.addEventListener('webglcontextrestored', () => { if (iniciar()) { medir(); desenhar(); amb.classList.add('com-grao'); ligar(); } });
    return { ativar(v) { if (v === ativo) return; ativo = v; v ? ligar() : desligar(); } };
  })();
`);

fs.writeFileSync(f, s);
console.log("ok");
