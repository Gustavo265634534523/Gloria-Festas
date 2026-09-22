// Confete (efeito 29 enviado pelo usuário) quando o pedido de orçamento fica pronto, nas cores da marca
const fs = require("fs");
const f = __dirname + "/../../gloriafestas/index.html";
let s = fs.readFileSync(f, "utf8");
const rep = (a, b) => { if (!s.includes(a)) { console.error("NAO ACHEI:\n" + a.slice(0, 140)); process.exit(1); } s = s.replace(a, b); };

// CSS: tela de confete por cima de tudo, sem bloquear cliques
rep(`/* abas escondidas pausam tudo */`, `/* confete do pedido pronto */
.confete{position:fixed;inset:0;width:100%;height:100%;z-index:95;pointer-events:none;display:none}

/* abas escondidas pausam tudo */`);

// JS: o efeito
const js = `
  /* ---------- 10. confete quando o pedido fica pronto ---------- */
  const confete = (() => {
    const cv = document.createElement('canvas');
    cv.className = 'confete'; cv.setAttribute('aria-hidden', 'true');
    document.body.appendChild(cv);
    const ctx = cv.getContext('2d');
    // [frente, verso] de cada papel: dourado, dourado velho, champanhe, vinho, vinho rosado
    const CORES = [['#D6B56C', '#A8863F'], ['#B88A3B', '#8A6424'], ['#F0D9A4', '#C9AE74'], ['#5A1E3A', '#3A1025'], ['#8C3A5E', '#62243F'], ['#E7C77F', '#B89A55']];
    let papeis = [], id = null, ultimo = 0, W = 0, H = 0;
    function medir() {
      const dpr = Math.min(2, devicePixelRatio || 1);
      W = innerWidth; H = innerHeight;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    addEventListener('resize', () => { if (id !== null) medir(); }, { passive: true });
    function estrela(r) {                       // a estrelinha de 4 pontas do logo
      ctx.beginPath();
      ctx.moveTo(0, -r); ctx.quadraticCurveTo(r * .14, -r * .14, r, 0); ctx.quadraticCurveTo(r * .14, r * .14, 0, r);
      ctx.quadraticCurveTo(-r * .14, r * .14, -r, 0); ctx.quadraticCurveTo(-r * .14, -r * .14, 0, -r);
      ctx.fill();
    }
    function soltar(ox, oy) {
      for (let i = 0; i < 150; i++) {
        const ang = -Math.PI / 2 + (Math.random() - .5) * 2.4;   // leque para cima
        const vel = 6 + Math.random() * 10;
        const star = i % 9 === 0;
        const c = CORES[(Math.random() * CORES.length) | 0];
        papeis.push({
          x: ox + (Math.random() - .5) * 30, y: oy + (Math.random() - .5) * 20,
          vx: Math.cos(ang) * vel, vy: Math.sin(ang) * vel - 2,
          giro: Math.random() * 6.28, dGiro: (Math.random() - .5) * .25,
          vira: Math.random() * 6.28, dVira: .08 + Math.random() * .16,
          fase: Math.random() * 6.28,
          cor: star ? '#F0D9A4' : c[0], verso: star ? '#D6B56C' : c[1],
          l: 5 + Math.random() * 5, a: 8 + Math.random() * 8, star
        });
      }
    }
    function rodar(agora) {
      const f = Math.min(3, (agora - (ultimo || agora)) / 16.667); ultimo = agora;   // mesma velocidade em 60 ou 120 Hz
      ctx.clearRect(0, 0, W, H);
      let vivos = 0;
      const arrasto = Math.pow(.99, f);
      for (const p of papeis) {
        p.vy = Math.min(p.vy + .28 * f, 4.2 + p.a * .12);        // gravidade com limite: o papel cai flutuando
        p.vx *= arrasto;                                          // resistência do ar
        if (p.vy > 0) p.x += Math.sin(agora * .003 + p.fase) * .7 * f;   // balanço na descida
        p.x += p.vx * f; p.y += p.vy * f;
        p.giro += p.dGiro * f; p.vira += p.dVira * f;
        if (p.y > H + 40) continue;
        vivos++;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.giro);
        if (p.star) { ctx.globalAlpha = .75 + .25 * Math.sin(p.vira * 2); ctx.fillStyle = p.cor; estrela(p.l * .9); ctx.globalAlpha = 1; }
        else { const k = Math.cos(p.vira); ctx.scale(k, 1); ctx.fillStyle = k > 0 ? p.cor : p.verso; ctx.fillRect(-p.l / 2, -p.a / 2, p.l, p.a); }
        ctx.restore();
      }
      if (vivos) id = requestAnimationFrame(rodar);
      else { id = null; ultimo = 0; papeis = []; ctx.clearRect(0, 0, W, H); cv.style.display = 'none'; }   // todos saíram: o laço para sozinho
    }
    return function disparar(el) {
      if (RM.matches) return;                   // movimento reduzido: sem confete
      requestAnimationFrame(() => {             // mede quando a tela está visível (a pessoa pode ter ido ao WhatsApp)
        cv.style.display = 'block';
        medir();
        const r = el.getBoundingClientRect();
        soltar(r.left + r.width / 2, r.top + r.height / 2);
        if (id === null) { ultimo = 0; id = requestAnimationFrame(rodar); }
      });
    };
  })();
  // leva o recado de "pedido pronto" para o meio da tela e comemora quando a rolagem assenta
  function mostrarSucesso() {
    const alvo = $('.badge', ok);
    const r = card.getBoundingClientRect();
    if (r.top < 80 || r.bottom > innerHeight) card.scrollIntoView({ block: 'center', behavior: RM.matches ? 'auto' : 'smooth' });
    let feito = false, t = null, tMax = null;
    const pronto = () => { if (feito) return; feito = true; removeEventListener('scroll', mexeu); clearTimeout(t); clearTimeout(tMax); confete(alvo); };
    const mexeu = () => { clearTimeout(t); t = setTimeout(pronto, 150); };
    addEventListener('scroll', mexeu, { passive: true });
    t = setTimeout(pronto, 320);
    tMax = setTimeout(pronto, 1400);
  }
`;
rep(`  /* ---------- 7. formulário que monta o pedido no WhatsApp ---------- */`, js + `
  /* ---------- 7. formulário que monta o pedido no WhatsApp ---------- */`);

// dispara no fim do envio
rep(`    card.classList.add('sent');
    ok.focus({ preventScroll: true });
  });`, `    card.classList.add('sent');
    ok.focus({ preventScroll: true });
    mostrarSucesso();
  });`);

fs.writeFileSync(f, s);
console.log("ok");
