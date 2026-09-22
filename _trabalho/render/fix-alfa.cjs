// Renderizador: modo "só a tampa" (objetos + luz, fundo transparente) e saída empilhada cor/alfa para vídeo
const fs = require("fs");
const f = __dirname + "/scene.html";
let s = fs.readFileSync(f, "utf8");
const rep = (a, b) => { if (!s.includes(a)) { console.error("NAO ACHEI:\n" + a.slice(0, 140)); process.exit(1); } s = s.replace(a, () => b); };

rep(`uniform float uHaze;\n`, `uniform float uHaze;\nuniform float uObjOnly;    // 1 = só tampa, bandeja e luz; sem sala nem mesa\n`);
rep(`  } else if (rd.y < 0. && uSprite < 0.5){
    float tf = -ro.y/rd.y; vec3 p = ro + rd*tf; tHit = tf;
    col = floorBase(p);`, `  } else if (rd.y < 0. && uSprite < 0.5 && uObjOnly < 0.5){
    float tf = -ro.y/rd.y; vec3 p = ro + rd*tf; tHit = tf;
    col = floorBase(p);`);
rep(`  } else if (uSprite > 0.5){
    col = vec3(0); alpha = 0.0;
  } else if (rd.y < 0. && (ro.y/-rd.y) < 2000.){`, `  } else if (uSprite > 0.5 || uObjOnly > 0.5){
    col = vec3(0); alpha = 0.0;
  } else if (rd.y < 0. && (ro.y/-rd.y) < 2000.){`);
rep(`  if (uSprite < 0.5){
    col += volume(ro, rd, tHit, jit, 64, true);
    col += sparkles(ro, fw, rt, up, th, aspect, ndc, h.x > 0. ? h.x : -1., rd);
  }
  fragColor = vec4(col*alpha, alpha);`, `  vec3 luz = vec3(0);
  if (uSprite < 0.5){
    luz = volume(ro, rd, tHit, jit, 64, true) + sparkles(ro, fw, rt, up, th, aspect, ndc, h.x > 0. ? h.x : -1., rd);
  }
  // só a tampa: cor pré-multiplicada, a luz soma por cima mesmo onde o fundo é transparente
  fragColor = uObjOnly > 0.5 ? vec4(col*alpha + luz, alpha) : vec4((col + luz)*alpha, alpha);`);

// composição: modos 2 (cor pré-multiplicada, opaca) e 3 (alfa em cinza)
rep(`uniform float uExposure, uBloomStr, uSeed, uSprite, uVignette, uGrain;`, `uniform float uExposure, uBloomStr, uSeed, uSprite, uVignette, uGrain, uModo;`);
rep(`  if (uSprite > 0.5){
    vec3 c = a > 0.0001 ? hdr / a : vec3(0);`, `  if (uModo > 1.5){
    if (uModo > 2.5){ fragColor = vec4(vec3(a), 1.); return; }
    vec3 c = aces((hdr + texture(uBloom, vUv).rgb*uBloomStr)*uExposure);
    fragColor = vec4(pow(max(c,0.), vec3(1./2.2)), 1.);
    return;
  }
  if (uSprite > 0.5){
    vec3 c = a > 0.0001 ? hdr / a : vec3(0);`);

// JS: opções objOnly e stack
rep(`  gl.uniform1f(U(P_SCENE,'uHaze'), C.haze);`, `  gl.uniform1f(U(P_SCENE,'uHaze'), C.haze);
  gl.uniform1f(U(P_SCENE,'uObjOnly'), opts.objOnly ? 1 : 0);`);
rep(`  cv.width = outW; cv.height = outH;`, `  cv.width = outW; cv.height = opts.stack ? outH * 2 : outH;`);
rep(`  // ---- composição final
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.viewport(0,0,outW,outH);
  gl.useProgram(P_COMP);`, `  // ---- composição final
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.viewport(0, opts.stack ? outH : 0, outW, outH);
  gl.useProgram(P_COMP);`);
rep(`  gl.uniform2f(U(P_COMP,'uOut'), outW, outH);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  gl.finish();`, `  gl.uniform2f(U(P_COMP,'uOut'), outW, outH);
  gl.uniform1f(U(P_COMP,'uModo'), opts.stack ? 2 : (opts.modo || 0));
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  if (opts.stack) {                       // metade de baixo: o alfa, para o site recortar a tampa
    gl.viewport(0, 0, outW, outH);
    gl.uniform1f(U(P_COMP,'uModo'), 3);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  gl.finish();`);

fs.writeFileSync(f, s);
console.log("ok");
