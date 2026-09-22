// Seção de feedbacks: prints reais de clientes num carrossel de arrastar (efeito 11), no tema do site
const fs = require("fs");
const f = __dirname + "/../../gloriafestas/index.html";
let s = fs.readFileSync(f, "utf8");
const rep = (a, b) => { if (!s.includes(a)) { console.error("NAO ACHEI:\n" + a.slice(0, 160)); process.exit(1); } s = s.replace(a, () => b); };

// ícones novos no sprite
rep(`\n  </defs>\n</svg>\n\n<header`, `
    <symbol id="i-aspas" viewBox="0 0 24 24"><path fill="currentColor" d="M10.2 5.5C6.6 6.8 4.3 9.6 4.3 13.4V19h6.2v-6.2H7.3c.1-2.3 1.3-4 3.7-5.1l-.8-2.2Zm9.3 0c-3.6 1.3-5.9 4.1-5.9 7.9V19h6.2v-6.2h-3.2c.1-2.3 1.3-4 3.7-5.1l-.8-2.2Z"/></symbol>
    <symbol id="i-lupa" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5M10.5 8v5M8 10.5h5"/></g></symbol>
    <symbol id="i-fechar" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></g></symbol>
    <symbol id="i-arraste" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 12h17M7.5 8l-4 4 4 4M16.5 8l4 4-4 4"/></g></symbol>
  </defs>
</svg>

<header`);

// menu e rodapé
rep(`      <li><a href="#fotos">Fotos</a></li>
      <li><a href="#duvidas">Dúvidas</a></li>`, `      <li><a href="#fotos">Fotos</a></li>
      <li><a href="#feedbacks">Feedbacks</a></li>
      <li><a href="#duvidas">Dúvidas</a></li>`);
rep(`<a href="#fotos">Fotos</a><a href="#duvidas">Dúvidas</a>`, `<a href="#fotos">Fotos</a><a href="#feedbacks">Feedbacks</a><a href="#duvidas">Dúvidas</a>`);

// os cartões
const cards = [
  { img: 1, w: 520, h: 734, q: 'Era um prato atrás do outro.', tag: 'Festa de 1 ano',
    alt: 'Print de mensagem de cliente: “O melhor buffet da vida! Fiz a festa de 1 ano da minha filha com ela e eu amei muito! Teve convidados que não conseguiram nem jantar de tanto que já tinham comido. Quando eu cheguei na festa, as pessoas falando que era coisa de louco, que era um prato atrás do outro.” “Sem contar que ela e toda equipe são maravilhosas!” “Eu não tive nenhuma indicação dela quando fechei, foi um tiro no escuro que dei devido o valor ser muito em conta! Confiei nos comentários das pessoas…”' },
  { img: 2, w: 518, h: 726, q: 'Indico de olhos fechados.', tag: 'Comentários de clientes',
    alt: 'Print de comentários de clientes. Luuh Nunes: “Indico de olhos fechados.” Isis Carvalho: “Me surpreendi muito. Perfeito!” Vanessa Silva Olyver: “Super indico, buffet nota 1.000.” Cindy Monique: “Já fui e amei. Portanto que fechei. Super indico.” Ivania Barboza: “Super indico, muito bom. Sempre faço com ela.” Cristiane Araújo: “Buffet de ótima qualidade… Recomendo! Equipe nota 1000!”' },
  { img: 3, w: 446, h: 479, q: 'Tudo uma delícia, quentinho, saboroso!', tag: 'Mensagem de cliente',
    alt: 'Print de mensagem de cliente no WhatsApp: “Oh Glória, eu quero agradecer por tudo, não tenho absolutamente nada pra reclamar, somente elogios! Foi como te falei ontem, as minhas festas vão ser sempre feitas por vocês! Nós amamos, nossos convidados também! Muito obrigada pelo carinho, pela atenção dos seus funcionários, todos muito alegres e simpáticos e extremamente atenciosos! Tudo uma delícia, quentinho, saboroso! Muito obrigada mesmo, de coração! Que o Senhor continue abençoando rica e abundantemente a sua empresa e que seja próspera em tudo! Um beijo e um forte abraço!”' },
  { img: 4, w: 430, h: 341, q: 'Todos saíram muito satisfeitos.', tag: 'Casamento',
    alt: 'Print de mensagem de cliente no WhatsApp: “Oi Glória, boa tarde, passando para agradecer pelo bom atendimento do seu buffet no casamento da minha filha… Foi tudo de bom, muito bem servido, toda equipe bem equipada e de uma simpatia enorme com os meus convidados. Todos saíram muito satisfeitos pela boa recepção e atendimento. Super indico a todos que vierem me perguntar. Foi tudo de bom, gratidão por tudo. Deus abençoe toda equipe Glória Buffet.”' },
  { img: 5, w: 425, h: 343, q: 'A sua equipe nota 1000.', tag: 'Mensagem de cliente',
    alt: 'Print de mensagem de cliente no WhatsApp: “Oi Glória, boa noite! Desculpa a demora, mas não posso deixar de agradecer, a sua equipe nota 1000, as meninas são maravilhosas, muito organizadas e simpáticas. As comidas estavam uma delícia, não tinha uma coisa pra falar de ruim. Muito obrigada!”' },
  { img: 6, w: 414, h: 125, q: 'Foi só elogios aqui na festa.', tag: 'Mensagem de cliente',
    alt: 'Print de mensagem de cliente no WhatsApp: “Glória, sua equipe foi ótima, muito atenciosa, muito obrigada por fazer parte desse momento, foi só elogios aqui na festa sobre o buffet.”' },
];
const cardHtml = cards.map((c, i) => `        <figure class="rv-card" role="group" aria-roledescription="cartão" aria-label="Feedback ${i + 1} de ${cards.length}">
          <figcaption class="rv-top"><svg class="q" aria-hidden="true"><use href="#i-aspas"/></svg><span class="rv-quote">${c.q}</span></figcaption>
          <button class="rv-print" type="button" aria-label="Ampliar o print: ${c.q}"><img src="assets/feedback-${c.img}.jpg" width="${c.w}" height="${c.h}" loading="lazy" decoding="async" draggable="false" alt="${c.alt}"><span class="zoom" aria-hidden="true"><svg><use href="#i-lupa"/></svg></span></button>
          <span class="rv-tag"><svg aria-hidden="true"><use href="#i-estrela"/></svg>${c.tag}</span>
        </figure>`).join("\n");

rep(`  <section class="section faq reveal" id="duvidas"`, `  <section class="section reviews reveal" id="feedbacks" aria-labelledby="fb-t">
    <div class="wrap">
      <div class="rv-head">
        <div>
          <p class="kicker r"><svg aria-hidden="true"><use href="#i-estrela"/></svg>Feedbacks</p>
          <h2 class="h2 r" id="fb-t" style="--d:1">Quem prova, <em>indica.</em></h2>
          <p class="lede r" style="--d:2">Prints reais de mensagens e comentários de clientes, do jeito que chegaram para a gente.</p>
        </div>
        <div class="rv-ctrl r" style="--d:3">
          <button class="rv-btn rv-prev" id="rv-prev" type="button" aria-label="Feedback anterior" disabled><svg aria-hidden="true"><use href="#i-seta"/></svg></button>
          <button class="rv-btn" id="rv-next" type="button" aria-label="Próximo feedback"><svg aria-hidden="true"><use href="#i-seta"/></svg></button>
        </div>
      </div>
    </div>
    <div class="rv-drag r" id="rv-drag" style="--d:3" tabindex="0" role="region" aria-roledescription="carrossel" aria-label="Feedbacks de clientes. Use as setas do teclado para navegar.">
      <div class="rv-fita" id="rv-fita">
${cardHtml}
      </div>
    </div>
    <p class="rv-hint r" style="--d:4"><svg aria-hidden="true"><use href="#i-arraste"/></svg>Arraste para o lado · Toque no print para ampliar</p>
  </section>

  <section class="section faq reveal" id="duvidas"`);

// janela para ampliar o print
rep(`<div class="dock" id="dock">`, `<div class="lb" id="lb" role="dialog" aria-modal="true" aria-label="Print ampliado" hidden>
  <button class="lb-x" type="button" aria-label="Fechar"><svg aria-hidden="true"><use href="#i-fechar"/></svg></button>
  <img alt="">
</div>

<div class="dock" id="dock">`);

// CSS
rep(`/* dúvidas */`, `/* feedbacks: carrossel de arrastar com os prints */
.reviews{background:linear-gradient(180deg,rgba(243,234,223,0),var(--canvas-2) 16%,var(--canvas-2) 84%,rgba(243,234,223,0))}
.rv-head{display:flex;align-items:flex-end;justify-content:space-between;gap:28px 40px;flex-wrap:wrap}
.rv-head .lede{max-width:40ch}
.rv-ctrl{display:flex;gap:12px}
.rv-btn{display:grid;place-items:center;width:54px;height:54px;border-radius:50%;border:1px solid var(--line-strong);background:rgba(255,252,248,.75);color:var(--wine);cursor:pointer;transition:background-color .45s var(--ease-out),color .45s var(--ease-out),transform .45s var(--ease-out),opacity .45s var(--ease-out)}
.rv-btn svg{width:22px;height:22px}
.rv-btn:hover{background:var(--wine);color:var(--cream);transform:translateY(-2px)}
.rv-btn[disabled],.rv-btn[disabled]:hover{opacity:.35;cursor:default;transform:none;background:rgba(255,252,248,.75);color:var(--wine)}
.rv-prev svg{transform:scaleX(-1)}
.rv-drag{position:relative;width:100%;overflow:hidden;cursor:grab;-webkit-user-select:none;user-select:none;touch-action:pan-y;margin-top:clamp(40px,5vw,62px);padding:16px 0 34px;outline:none}
.rv-drag:focus-visible{outline:2px solid var(--gold-cta);outline-offset:-2px}
.rv-drag.pegando{cursor:grabbing}
.rv-fita{display:flex;gap:clamp(16px,2vw,26px);width:max-content;padding-inline:max(var(--gut),calc((100% - 1200px) / 2));will-change:transform}
.rv-card{position:relative;flex:none;display:flex;flex-direction:column;width:clamp(280px,29vw,372px);margin:0;padding:24px 20px 20px;border-radius:24px;background:linear-gradient(165deg,#4d1732 0%,#34101f 55%,#240912 100%);border:1px solid rgba(225,202,139,.28);box-shadow:0 34px 60px -38px rgba(58,16,37,.7);color:var(--cream);transition:transform .6s var(--ease-out),box-shadow .6s var(--ease-out)}
.rv-card::before{content:"";position:absolute;inset:7px;border-radius:18px;border:1px dashed rgba(225,202,139,.26);pointer-events:none}
.rv-card:hover{transform:translateY(-6px);box-shadow:0 42px 70px -40px rgba(58,16,37,.8)}
.rv-drag.pegando .rv-card{transform:none}
.rv-top{display:flex;gap:12px;align-items:flex-start;margin:0 4px 18px;min-height:2.6em}
.rv-top .q{width:28px;height:28px;flex:none;color:var(--gold-light);margin-top:-3px}
.rv-quote{font-family:var(--display);font-style:italic;font-size:clamp(19px,1.6vw,22px);line-height:1.28;color:#F6E9CF}
.rv-print{position:relative;display:grid;place-items:center;height:clamp(290px,28vw,350px);padding:12px;border:0;border-radius:16px;background:rgba(250,246,239,.06);box-shadow:inset 0 0 0 1px rgba(225,202,139,.12);cursor:zoom-in;overflow:hidden}
.rv-drag.pegando .rv-print{cursor:grabbing}
.rv-print img{max-width:100%;max-height:100%;width:auto;height:auto;border-radius:10px;box-shadow:0 14px 30px -14px rgba(0,0,0,.7);pointer-events:none;-webkit-user-drag:none}
.rv-print .zoom{position:absolute;right:10px;bottom:10px;display:grid;place-items:center;width:34px;height:34px;border-radius:50%;background:rgba(36,9,18,.75);color:var(--gold-light);opacity:0;transform:scale(.85);transition:opacity .4s var(--ease-out),transform .4s var(--ease-out)}
.rv-print .zoom svg{width:16px;height:16px}
.rv-card:hover .zoom,.rv-print:focus-visible .zoom{opacity:1;transform:none}
.rv-tag{display:inline-flex;align-items:center;gap:8px;align-self:flex-start;margin:18px 4px 0;font:500 11.5px/1 var(--sans);letter-spacing:.2em;text-transform:uppercase;color:var(--gold-light)}
.rv-tag svg{width:11px;height:11px}
.rv-hint{display:flex;align-items:center;justify-content:center;gap:10px;margin:4px var(--gut) 0;text-align:center;font:500 12px/1.4 var(--sans);letter-spacing:.2em;text-transform:uppercase;color:var(--gold-ink)}
.rv-hint svg{width:18px;height:18px;flex:none}
.live .rv-hint svg{animation:nudgeX 2.6s var(--ease-io) -1s infinite}
@keyframes nudgeX{0%,100%{transform:translateX(-3px)}50%{transform:translateX(4px)}}
@media (pointer:coarse){.rv-print .zoom{opacity:1;transform:none}}
@media (max-width:720px){.rv-card{width:84vw}.rv-print{height:min(118vw,440px)}.rv-ctrl{display:none}}
.lb{position:fixed;inset:0;z-index:120;display:grid;place-items:center;padding:clamp(16px,4vw,48px);background:rgba(26,6,14,.84);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);opacity:0;transition:opacity .45s var(--ease-out);touch-action:none}
.lb[hidden]{display:none}
.lb.on{opacity:1}
.lb img{max-width:min(92vw,560px);max-height:82vh;width:auto;height:auto;border-radius:14px;box-shadow:0 40px 80px -30px rgba(0,0,0,.8);transform:scale(.94);transition:transform .55s var(--ease-out)}
.lb.on img{transform:none}
.lb-x{position:absolute;top:calc(14px + env(safe-area-inset-top));right:14px;display:grid;place-items:center;width:48px;height:48px;border-radius:50%;border:1px solid rgba(225,202,139,.45);background:rgba(36,9,18,.75);color:var(--cream);cursor:pointer;transition:background-color .4s var(--ease-out)}
.lb-x:hover{background:var(--wine)}
.lb-x svg{width:22px;height:22px}

/* dúvidas */`);

// JS
const js = `  /* ---------- 11. feedbacks: arrastar para deslizar, com inércia de objeto de verdade ---------- */
  (() => {
    const area = $('#rv-drag'), fita = $('#rv-fita');
    if (!area) return;
    const cards = $$('.rv-card', fita), bPrev = $('#rv-prev'), bNext = $('#rv-next');
    let x = 0, vel = 0, alvo = null, pegando = false, capturou = false, inicioX = 0, ultimoX = 0, ultimoT = 0, arrastou = 0, id = null, ultimo = 0, estado = '';
    const limite = () => Math.min(0, area.clientWidth - fita.scrollWidth);
    const passoCard = () => cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : area.clientWidth;
    function aplicar() {
      fita.style.transform = \`translate3d(\${x.toFixed(2)}px,0,0)\`;
      const lo = limite(), est = (x >= -1 ? 'i' : '') + (x <= lo + 1 ? 'f' : '');
      if (est !== estado) { estado = est; bPrev.disabled = x >= -1; bNext.disabled = x <= lo + 1; }
    }
    function passo(agora) {
      const f = Math.min(3, (agora - (ultimo || agora)) / 16.667); ultimo = agora;
      const lo = limite();
      if (!pegando) {
        if (alvo !== null) { x += (alvo - x) * (1 - Math.pow(1 - .15, f)); if (Math.abs(alvo - x) < .4) { x = alvo; alvo = null; } }
        else {
          vel *= Math.pow(.93, f);                                   // atrito: perde velocidade aos poucos
          x += vel * f;
          if (x > 0) { x += (0 - x) * (1 - Math.pow(1 - .22, f)); vel *= .5; }        // borda elástica
          else if (x < lo) { x += (lo - x) * (1 - Math.pow(1 - .22, f)); vel *= .5; }
        }
      }
      aplicar();
      const quieto = !pegando && alvo === null && Math.abs(vel) < .04 && x <= .5 && x >= lo - .5;
      if (quieto) { x = Math.min(0, Math.max(lo, x)); aplicar(); id = null; ultimo = 0; }   // parado: o laço descansa
      else id = requestAnimationFrame(passo);
    }
    const acordar = () => { if (id === null) id = requestAnimationFrame(passo); };
    area.addEventListener('pointerdown', e => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      pegando = true; capturou = false; vel = 0; alvo = null; arrastou = 0;
      inicioX = ultimoX = e.clientX; ultimoT = performance.now();
      acordar();
    });
    area.addEventListener('pointermove', e => {
      if (!pegando) return;
      const agora = performance.now(), dx = e.clientX - ultimoX, dt = Math.max(1, agora - ultimoT);
      ultimoX = e.clientX; ultimoT = agora; arrastou += Math.abs(dx);
      if (!capturou && Math.abs(e.clientX - inicioX) > 6) { capturou = true; try { area.setPointerCapture(e.pointerId); } catch {} area.classList.add('pegando'); }
      if (!capturou) return;
      const lo = limite();
      x += (x > 0 || x < lo) ? dx * .35 : dx;                       // resistência além da borda
      vel = dx / dt * 16.667;
      aplicar();
    });
    const soltar = () => { if (!pegando) return; pegando = false; area.classList.remove('pegando'); if (RM.matches) vel = 0; acordar(); };
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(t => area.addEventListener(t, soltar));
    area.addEventListener('click', e => { if (arrastou > 6) { e.preventDefault(); e.stopPropagation(); } arrastou = 0; }, true);   // arrastar não abre o print
    area.addEventListener('dragstart', e => e.preventDefault());
    function irPara(dir) {
      const step = passoCard(), lo = limite(), atual = alvo !== null ? alvo : x;
      alvo = Math.max(lo, Math.min(0, -(Math.round(-atual / step) + dir) * step));
      vel = 0;
      if (RM.matches) { x = alvo; alvo = null; aplicar(); } else acordar();
    }
    bPrev.addEventListener('click', () => irPara(-1));
    bNext.addEventListener('click', () => irPara(1));
    area.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { e.preventDefault(); irPara(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); irPara(-1); }
    });
    fita.addEventListener('focusin', e => {                          // teclado: traz o cartão focado para a vista
      const card = e.target.closest('.rv-card'); if (!card) return;
      area.scrollLeft = 0;
      const left = card.offsetLeft + x, right = left + card.offsetWidth;
      if (left < 0 || right > area.clientWidth) {
        alvo = Math.max(limite(), Math.min(0, -(card.offsetLeft - (area.clientWidth - card.offsetWidth) / 2)));
        if (RM.matches) { x = alvo; alvo = null; aplicar(); } else acordar();
      }
    });
    addEventListener('resize', () => { const lo = limite(); if (x < lo) x = lo; aplicar(); }, { passive: true });
    aplicar();

    // ampliar o print
    const lb = $('#lb'), lbImg = $('#lb img'), lbX = $('#lb .lb-x');
    let origem = null;
    function abrir(btn) {
      const img = $('img', btn);
      origem = btn;
      lbImg.src = img.currentSrc || img.src; lbImg.alt = img.alt;
      lb.hidden = false;
      requestAnimationFrame(() => requestAnimationFrame(() => lb.classList.add('on')));
      lbX.focus();
    }
    function fechar() {
      if (lb.hidden) return;
      lb.classList.remove('on');
      setTimeout(() => { lb.hidden = true; lbImg.removeAttribute('src'); }, RM.matches ? 0 : 450);
      if (origem) origem.focus({ preventScroll: true });
    }
    $$('.rv-print', fita).forEach(btn => btn.addEventListener('click', () => abrir(btn)));
    lbX.addEventListener('click', fechar);
    lb.addEventListener('click', e => { if (e.target === lb) fechar(); });
    lb.addEventListener('wheel', e => e.preventDefault(), { passive: false });
    document.addEventListener('keydown', e => {
      if (lb.hidden) return;
      if (e.key === 'Escape') fechar();
      else if (e.key === 'Tab') { e.preventDefault(); lbX.focus(); }   // o foco fica dentro da janela
    });
  })();

  /* ---------- 6. dúvidas ---------- */`;
rep(`  /* ---------- 6. dúvidas ---------- */`, js);

fs.writeFileSync(f, s);
console.log("ok");
