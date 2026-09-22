// Renderizador: estúdio claro (creme) para a tampa sobre fundo creme, e sombra suave de contato sob a bandeja
const fs = require("fs");
const f = __dirname + "/scene.html";
let s = fs.readFileSync(f, "utf8");
const rep = (a, b) => { if (!s.includes(a)) { console.error("NAO ACHEI:\n" + a.slice(0, 140)); process.exit(1); } s = s.replace(a, () => b); };

rep(`uniform float uObjOnly;`, `uniform float uObjOnly;
uniform float uCreme;      // 1 = estúdio claro: a tampa reflete um ambiente creme`);

// ambiente creme: gradiente quente, faixas escuras laterais para dar desenho ao metal, e as mesmas softboxes
rep(`vec3 env(vec3 d, float rough){
  float s = 0.02 + rough*0.5;`, `vec3 envCreme(vec3 d, float rough){
  float s = 0.03 + rough*0.5;
  vec3 col = mix(vec3(.46,.37,.30), vec3(.96,.90,.82), smoothstep(-.35, .85, d.y));
  float az = atan(d.x, -d.z);
  float faixa = smoothstep(.34, .10, abs(abs(az) - 1.15)) * smoothstep(-.1, .35, d.y);
  col *= 1. - .78*faixa;                                   // "bandeiras" escuras do estúdio
  col *= 1. - .35*smoothstep(.2, -.6, d.y);                // chão creme mais escuro embaixo
  col += softbox(d, normalize(vec3(-0.78,0.34,0.52)), vec2(0.085,0.80), s, 3.2, vec3(1.0,0.96,0.90));
  col += softbox(d, normalize(vec3(-0.15,1.0,0.22)), vec2(0.75,0.42), s*1.5, 1.1, vec3(1.0,0.95,0.88));
  col += softbox(d, normalize(vec3(0.92,0.26,-0.30)), vec2(0.050,0.95), s, 2.4, vec3(1.0,0.92,0.80));
  if (uGlintAmt > 0.001) col += softbox(d, normalize(vec3(sin(uGlint),0.28,cos(uGlint))), vec2(0.03,1.1), s, 5.0*uGlintAmt, vec3(1.,0.97,0.9));
  return col;
}
vec3 env(vec3 d, float rough){
  if (uCreme > 0.5) return envCreme(d, rough);
  float s = 0.02 + rough*0.5;`);

// sombra de contato no chão invisível: só escurece o que estiver atrás (alfa sem cor)
rep(`  } else if (uSprite > 0.5 || uObjOnly > 0.5){
    col = vec3(0); alpha = 0.0;
  } else if (rd.y < 0. && (ro.y/-rd.y) < 2000.){`, `  } else if (uSprite > 0.5 || uObjOnly > 0.5){
    col = vec3(0); alpha = 0.0;
    if (uCreme > 0.5 && rd.y < 0.){
      float tf = -ro.y/rd.y; vec3 p = ro + rd*tf;
      float r = length(p.xz - vec2(0., 1.5));
      float ao = calcAO(p, vec3(0,1,0), 3.0);
      alpha = (1. - ao) * .55 + .16 * exp(-pow(r/24., 2.)) * smoothstep(40., 16., r);
      alpha = clamp(alpha, 0., .6);
    }
  } else if (rd.y < 0. && (ro.y/-rd.y) < 2000.){`);

rep(`  gl.uniform1f(U(P_SCENE,'uObjOnly'), opts.objOnly ? 1 : 0);`, `  gl.uniform1f(U(P_SCENE,'uObjOnly'), opts.objOnly ? 1 : 0);
  gl.uniform1f(U(P_SCENE,'uCreme'), opts.creme ? 1 : 0);`);

fs.writeFileSync(f, s);
console.log("ok");
