// Teste: "viagem pelas estrelas" (efeito 35) no fundo creme da seção de feedbacks, em dourado, champanhe e vinho
const fs = require("fs");
const f = __dirname + "/../../gloriafestas/index.html";
let s = fs.readFileSync(f, "utf8");
const rep = (a, b) => { if (!s.includes(a)) { console.error("NAO ACHEI:\n" + a.slice(0, 160)); process.exit(1); } s = s.replace(a, () => b); };

// CSS: tela atrás do conteúdo da seção
rep(`.rv-head{display:flex;`, `.estrelas{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0}
.reviews .wrap,.reviews .rv-hint{position:relative;z-index:1}
.reviews .rv-drag{z-index:1}
.rv-head{display:flex;`);

// JS
const js = `  /* ---------- 12. viagem pelas estrelas no fundo dos feedbacks (segure o clique para acelerar) ---------- */
  (() => {
    const sec = $('#feedbacks'); if (!sec) return;
    const cv = document.createElement('canvas');
    cv.className = 'estrelas'; cv.setAttribute('aria-hidden', 'true');
    sec.prepend(cv);
    const ctx = cv.getContext('2d');
    const CORES = [[184, 138, 59], [214, 181, 108], [201, 160, 88], [90, 30, 58]];   // dourado, champanhe, ouro velho, vinho
    let W = 1, H = 1, estrelas = [], vel = 1, alvoVel = 1, id = null, visivel = false, ultimo = 0;
    function medir() {
      const dpr = Math.min(1.5, devicePixelRatio || 1);
      W = Math.max(1, sec.clientWidth); H = Math.max(1, sec.clientHeight);
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    const fundo = () => Math.max(W, H);
    function nascerUma(e, longe) {                      // cada estrela tem uma profundidade (z) que diminui a cada quadro
      e.x = (Math.random() - .5) * W * 1.6; e.y = (Math.random() - .5) * H * 1.6;
      e.z = longe ? fundo() : Math.random() * fundo(); e.pz = e.z;
      e.c = CORES[Math.random() < .16 ? 3 : (Math.random() * 3) | 0];
      return e;
    }
    function nascer() { estrelas = []; const n = Math.round(Math.min(260, W * H / 5200)); for (let i = 0; i < n; i++) estrelas.push(nascerUma({}, false)); }
    function quadro(agora, parado) {
      const f = parado ? 1 : Math.min(3, (agora - (ultimo || agora)) / 16.667); ultimo = agora;
      vel += (alvoVel - vel) * (1 - Math.pow(1 - .08, f));
      ctx.globalCompositeOperation = 'destination-out';            // rastro leve: apaga um pouco, sem pintar por cima do creme
      ctx.fillStyle = parado ? '#000' : 'rgba(0,0,0,.35)';
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'source-over';
      const cx = W / 2, cy = H * .56, D = fundo(), foco = Math.min(W, H) * .5;
      for (const e of estrelas) {
        e.pz = e.z;
        if (!parado) e.z -= vel * 4 * f;
        if (e.z < 1) { nascerUma(e, true); continue; }
        const k = foco / e.z, ka = foco / e.pz;                   // dividir a posição pela profundidade cria a perspectiva
        const x = cx + e.x * k, y = cy + e.y * k, xa = cx + e.x * ka, ya = cy + e.y * ka;
        if (x < -30 || x > W + 30 || y < -30 || y > H + 30) { nascerUma(e, true); continue; }
        const brilho = Math.min(1, Math.max(.05, 1 - e.z / D));
        const [r, g, b] = e.c, a = (brilho * .75).toFixed(3);
        if (Math.abs(x - xa) + Math.abs(y - ya) < .6) { ctx.fillStyle = \`rgba(\${r},\${g},\${b},\${a})\`; ctx.beginPath(); ctx.arc(x, y, .5 + brilho * 1.3, 0, 6.2832); ctx.fill(); }
        else { ctx.strokeStyle = \`rgba(\${r},\${g},\${b},\${a})\`; ctx.lineWidth = .4 + brilho * 1.8; ctx.beginPath(); ctx.moveTo(xa, ya); ctx.lineTo(x, y); ctx.stroke(); }
      }
    }
    const rodar = agora => { quadro(agora, false); id = requestAnimationFrame(rodar); };
    const ligar = () => { if (id !== null || RM.matches || !visivel) return; ultimo = 0; id = requestAnimationFrame(rodar); };
    const desligar = () => { if (id === null) return; cancelAnimationFrame(id); id = null; };
    new IntersectionObserver(es => { visivel = es[0].isIntersecting; visivel ? ligar() : desligar(); }).observe(sec);   // só roda com a seção na tela
    new ResizeObserver(() => { medir(); nascer(); if (id === null) quadro(performance.now(), true); }).observe(sec);
    sec.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse' || e.button === 0) alvoVel = 7; });   // segurar acelera (arrastar os cartões também)
    addEventListener('pointerup', () => { alvoVel = 1; });
    addEventListener('pointercancel', () => { alvoVel = 1; });
    RM.addEventListener('change', e => { if (e.matches) { desligar(); quadro(performance.now(), true); } else ligar(); });
    medir(); nascer(); quadro(performance.now(), true);          // movimento reduzido: céu parado
  })();

  /* ---------- 6. dúvidas ---------- */`;
rep(`  /* ---------- 6. dúvidas ---------- */`, js);

fs.writeFileSync(f, s);
console.log("ok");
