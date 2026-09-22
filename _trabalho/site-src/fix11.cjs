// O nome GLÓRIA FESTAS em 3D no fundo do site inteiro: um anel com o nome (como no logo) que gira com a rolagem
const fs = require("fs");
const f = __dirname + "/../../gloriafestas/index.html";
let s = fs.readFileSync(f, "utf8");
const rep = (a, b) => { if (!s.includes(a)) { console.error("NAO ACHEI:\n" + a.slice(0, 160)); process.exit(1); } s = s.replace(a, () => b); };

// HTML: o anel fica numa tela própria no fundo; brilhos, estrelas e granulado vão para uma camada "extra"
rep(`<div class="ambient" aria-hidden="true"><i></i><i></i></div>`,
    `<div class="ambient" aria-hidden="true"><canvas class="nome3d"></canvas><div class="extra"><i></i><i></i></div></div>`);

// CSS
rep(`.ambient{position:fixed;inset:0;z-index:-1;pointer-events:none;overflow:hidden;background:var(--canvas-2)}`,
    `.ambient{position:fixed;inset:0;z-index:-1;pointer-events:none;overflow:hidden;background:var(--canvas-2)}
.ambient .extra{position:absolute;inset:0}
.ambient .nome3d{position:absolute;left:0;top:0;width:100%;height:100vh;height:100lvh;opacity:0;transition:opacity 1.6s var(--ease-out)}
.ambient .nome3d.pronto{opacity:1}
.com-nome .hero,.com-nome .static-hero{background:none}
@media (prefers-contrast:more){.ambient .nome3d{display:none}}`);
rep(`.ambient::after{`, `.ambient .extra::after{`);

// JS: variáveis
rep(`  let ceuHero = null, ceuSite = null;`, `  let ceuHero = null, ceuSite = null, nome3d = null;`);
rep(`  let ultimoYSite = scrollY;`, `  let ultimoYSite = scrollY, corteExtra = -1;
  const extraAmb = $('.ambient .extra');`);
// a rolagem gira o anel; brilhos e estrelas do site só aparecem abaixo da abertura (como antes)
rep(`      ultimoYSite = scrollY;
`, `      ultimoYSite = scrollY;
      const cobre = Math.max(0, Math.min(innerHeight, Math.round(heroEnd)));   // quanto da tela a abertura ainda cobre
      if (cobre !== corteExtra) { corteExtra = cobre; extraAmb.style.clipPath = cobre ? \`inset(\${cobre}px 0 0 0)\` : ''; }
      if (nome3d) nome3d.rolar(scrollY);
`);
rep(`cv.className = 'ceu'; cv.setAttribute('aria-hidden', 'true'); amb.appendChild(cv);`,
    `cv.className = 'ceu'; cv.setAttribute('aria-hidden', 'true'); $('.ambient .extra').appendChild(cv);`);

// JS: o anel 3D (raymarching de um campo de distância do nome, desenhado só quando a rolagem muda)
rep(`    onPageScroll();
  })();
`, `    onPageScroll();
  })();

  /* ---------- 5c. o nome em 3D no fundo: GLÓRIA FESTAS num anel que gira com a rolagem ---------- */
  nome3d = (() => {
    const cv = $('.ambient .nome3d');
    const gl = cv && cv.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false, powerPreference: 'low-power' });
    if (!gl) return null;
    const hp = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
    if (!hp || hp.precision < 16) return null;
    // medidas do molde assets/nome-3d.png, em pixels do molde (gerado por _trabalho/tools/nomesdf.mjs)
    const M = { largura: 1700, altura: 211, maiuscula: 121, base: 185.5, alcance: 20, centro: 769 };
    const A = { voltas: 2, fov: 30, camY: -.8, giroPx: .00042, forca: .85 };
    const PER = M.largura / M.maiuscula, R = A.voltas * PER / (2 * Math.PI), LENTE = Math.tan(A.fov * Math.PI / 360);
    const GIRO0 = M.centro / M.maiuscula / R;          // no topo da página o nome aparece inteiro, de frente
    const n = x => x.toFixed(5);
    const VS = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
    const FS = \`precision highp float;
uniform vec2 uRes,uFade;uniform sampler2D uMolde;uniform float uGiro,uLente,uForca;uniform vec3 uCam,uMira;
const float R=\${n(R)},PER=\${n(PER)},ALC=\${n(2 * M.alcance / M.maiuscula)},BASE=\${n(M.base / M.altura)},CAP=\${n(M.maiuscula / M.altura)};
const float H=.15,BW=.07,BD=.035,Y0=-.6,Y1=.9;
float molde(vec2 q){return (.5-texture2D(uMolde,vec2(fract(q.x/PER),BASE-(q.y+.5)*CAP)).r)*ALC;}
float mapa(vec3 p){
  float s=molde(vec2((atan(p.x,p.z)+uGiro)*R,p.y));
  float x=clamp(1.+s/BW,0.,1.);
  vec2 q=vec2(s,abs(length(p.xz)-R)-H+BD*x*x);
  return min(max(q.x,q.y),0.)+length(max(q,0.));
}
vec3 normal(vec3 p){
  const vec2 k=vec2(1.,-1.);const float e=.01;
  return normalize(k.xyy*mapa(p+k.xyy*e)+k.yyx*mapa(p+k.yyx*e)+k.yxy*mapa(p+k.yxy*e)+k.xxx*mapa(p+k.xxx*e));
}
void main(){
  vec2 c=(2.*gl_FragCoord.xy-uRes)/uRes.y;
  vec3 fw=normalize(uMira-uCam),rt=normalize(cross(fw,vec3(0.,1.,0.))),up=cross(rt,fw);
  vec3 ro=uCam,rd=normalize(fw+(c.x*rt+c.y*up)*uLente);
  float a=dot(rd.xz,rd.xz),b=dot(ro.xz,rd.xz),k=dot(ro.xz,ro.xz);
  float de=b*b-a*(k-(R+H+.03)*(R+H+.03));
  if(de<=0.){gl_FragColor=vec4(0.);return;}
  float t0=(-b-sqrt(de))/a,t1=(-b+sqrt(de))/a;
  float di=b*b-a*(k-(R-H-.03)*(R-H-.03));
  if(di>0.)t1=min(t1,(-b-sqrt(di))/a);
  float ry=abs(rd.y)<1e-5?1e-5:rd.y,ya=(Y0-ro.y)/ry,yb=(Y1-ro.y)/ry;
  t0=max(max(t0,min(ya,yb)),0.);t1=min(t1,max(ya,yb));
  if(t1<=t0){gl_FragColor=vec4(0.);return;}
  float px=2.*uLente/uRes.y,t=t0,dm=1e9,tm=t0;bool ok=false;
  for(int i=0;i<90;i++){
    float d=mapa(ro+rd*t),dp=d/(t*px);
    if(dp<dm){dm=dp;tm=t;}
    if(d<.0004*t){ok=true;break;}
    t+=max(d*.8,.001*t);
    if(t>t1)break;
  }
  float cob=ok?1.:clamp(1.-dm,0.,1.);
  if(cob<=0.){gl_FragColor=vec4(0.);return;}
  vec3 p=ro+rd*(ok?t:tm),nn=normal(p),v=-rd;
  vec3 L1=normalize(vec3(-.6,.8,.55)),L2=normalize(vec3(.9,.1,.3));
  float luz=.83+.25*max(dot(nn,L1),0.)+.035*max(dot(nn,L2),0.);
  vec3 col=vec3(.953,.918,.875)*luz;
  col+=vec3(1.,.86,.55)*(pow(max(dot(nn,normalize(L1+v)),0.),40.)*.35+pow(1.-max(dot(nn,v),0.),4.)*.12);
  float al=uForca*cob*smoothstep(uFade.x,uFade.y,p.z/length(p.xz));
  gl_FragColor=vec4(min(col,1.)*al,al);
}\`;
    let W = 1, H = 1, giro = GIRO0, alvo = GIRO0, id = null, ultimo = 0, pronto = false, U = {};
    const img = new Image();
    function iniciar() {
      try {
        const sh = (tipo, src) => { const o = gl.createShader(tipo); gl.shaderSource(o, src); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o)); return o; };
        const pr = gl.createProgram();
        gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(pr);
        if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(pr));
        gl.useProgram(pr);
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);   // um triângulo cobre a tela
        const lp = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(lp); gl.vertexAttribPointer(lp, 2, gl.FLOAT, false, 0, 0);
        gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
        gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, gl.LUMINANCE, gl.UNSIGNED_BYTE, img);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        ['uRes', 'uFade', 'uMolde', 'uGiro', 'uLente', 'uForca', 'uCam', 'uMira'].forEach(k => { U[k] = gl.getUniformLocation(pr, k); });
        gl.uniform1i(U.uMolde, 0); gl.uniform1f(U.uLente, LENTE); gl.uniform1f(U.uForca, A.forca);
        gl.clearColor(0, 0, 0, 0);
        return true;
      } catch (e) { console.warn('nome 3D desligado:', e.message); return false; }
    }
    function medir() {
      W = Math.max(1, cv.clientWidth); H = Math.max(1, cv.clientHeight);
      let dpr = Math.min(1.5, devicePixelRatio || 1);
      if (W * H * dpr * dpr > 2.2e6) dpr = Math.sqrt(2.2e6 / (W * H));   // telas enormes: menos pixels, o fundo é suave
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      gl.viewport(0, 0, cv.width, cv.height);
    }
    function desenhar() {
      if (!pronto) return;
      const asp = W / H, cobre = asp >= 1 ? 1.12 : 1.12 + (1 - asp) * 1.5;   // no celular o anel passa das bordas
      const D = Math.max(R + 2.2, R / (cobre * asp * LENTE));
      gl.uniform2f(U.uRes, cv.width, cv.height);
      gl.uniform2f(U.uFade, R / D + .03, R / D + .4);
      gl.uniform1f(U.uGiro, giro);
      gl.uniform3f(U.uCam, 0, A.camY, D);
      gl.uniform3f(U.uMira, 0, 0, R);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    const passo = agora => {
      const f = Math.min(3, (agora - (ultimo || agora)) / 16.667); ultimo = agora;
      giro += (alvo - giro) * (1 - Math.pow(.9, f));                  // desliza até o alvo, igual em 60 ou 120 Hz
      if (Math.abs(alvo - giro) < 2e-5) giro = alvo;
      desenhar();
      id = giro === alvo ? null : requestAnimationFrame(passo);
    };
    function rolar(y) {
      alvo = GIRO0 + (RM.matches ? 0 : y * A.giroPx);
      if (!pronto) { giro = alvo; return; }
      if (RM.matches) { if (id !== null) { cancelAnimationFrame(id); id = null; } if (giro !== alvo) { giro = alvo; desenhar(); } return; }
      if (id === null && alvo !== giro) { ultimo = 0; id = requestAnimationFrame(passo); }
    }
    cv.addEventListener('webglcontextlost', e => { e.preventDefault(); pronto = false; if (id !== null) { cancelAnimationFrame(id); id = null; } });
    cv.addEventListener('webglcontextrestored', () => { if (iniciar()) { pronto = true; medir(); desenhar(); } });
    new ResizeObserver(() => { if (pronto) { medir(); desenhar(); } }).observe(cv);
    RM.addEventListener('change', () => rolar(scrollY));
    img.onload = () => {
      if (!iniciar()) return;
      pronto = true; medir(); alvo = giro = GIRO0 + (RM.matches ? 0 : scrollY * A.giroPx); desenhar();
      cv.classList.add('pronto'); document.documentElement.classList.add('com-nome');
    };
    img.src = 'assets/nome-3d.png';
    return { rolar };
  })();
`);

fs.writeFileSync(f, s);
console.log("ok");
