// Viagem pelas estrelas como fundo do site inteiro (só o fundo muda; conteúdo igual)
const fs = require("fs");
const f = __dirname + "/../../gloriafestas/index.html";
let s = fs.readFileSync(f, "utf8");
const rep = (a, b) => { if (!s.includes(a)) { console.error("NAO ACHEI:\n" + a.slice(0, 160)); process.exit(1); } s = s.replace(a, () => b); };

// CSS: fundo único creme (o mesmo da abertura) e seções creme transparentes para o céu aparecer
rep(`.ambient{position:fixed;inset:0;z-index:-1;pointer-events:none;overflow:hidden;background:var(--canvas)}`,
    `.ambient{position:fixed;inset:0;z-index:-1;pointer-events:none;overflow:hidden;background:var(--canvas-2)}`);
rep(`.how{background:linear-gradient(180deg,rgba(243,234,223,0),var(--canvas-2) 14%,var(--canvas-2) 86%,rgba(243,234,223,0))}`, `.how{background:none}`);
rep(`.reviews{background:linear-gradient(180deg,rgba(243,234,223,0),var(--canvas-2) 16%,var(--canvas-2) 84%,rgba(243,234,223,0))}`, `.reviews{background:none}`);
rep(`.quote{z-index:0;background:linear-gradient(180deg,rgba(243,234,223,0),var(--canvas-2) 18%);`, `.quote{z-index:0;background:none;`);

// JS: a receita das estrelas ganha "ligar/desligar por fora", gatilho e filtro do clique
rep(`let W = 1, H = 1, estrelas = [], vel = BASE, alvoVel = BASE, extra = 0, id = null, visivel = false, ultimo = 0;`,
    `let W = 1, H = 1, estrelas = [], vel = BASE, alvoVel = BASE, extra = 0, id = null, visivel = false, ultimo = 0, ativo = true;`);
rep(`    const ligar = () => { if (id !== null || RM.matches || !visivel) return; ultimo = 0; id = requestAnimationFrame(rodar); };`,
    `    const ligar = () => { if (id !== null || RM.matches || !visivel || !ativo) return; ultimo = 0; id = requestAnimationFrame(rodar); };`);
rep(`    host.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse' || e.button === 0) alvoVel = 7; });   // segurar acelera`,
    `    (o.gatilho || host).addEventListener('pointerdown', e => { if (o.filtro && !o.filtro(e)) return; if (e.pointerType !== 'mouse' || e.button === 0) alvoVel = 7; });   // segurar acelera`);
rep(`    return { empurrar(px) { if (!RM.matches) extra = Math.min(9, extra + px / 45); } };`,
    `    return {
      empurrar(px) { if (!RM.matches) extra = Math.min(9, extra + px / 45); },
      ativar(v) { if (v === ativo) return; ativo = v; v ? ligar() : desligar(); }
    };`);
// instâncias: sai a tela própria dos feedbacks (agora o céu é do site todo) e entra o fundo global
rep(`    const sec = $('#feedbacks');
    if (sec) { const cv = document.createElement('canvas'); cv.className = 'estrelas'; cv.setAttribute('aria-hidden', 'true'); sec.prepend(cv); criarViagem(sec, cv, { cx: .5, cy: .56 }); }
    ceuHero = criarViagem(stage, $('#ceu-hero'), { cx: .64, cy: .56 });
    criarViagem($('#static-hero'), $('#ceu-estatico'), { cx: .5, cy: .74 });`,
`    ceuHero = criarViagem(stage, $('#ceu-hero'), { cx: .64, cy: .56 });
    criarViagem($('#static-hero'), $('#ceu-estatico'), { cx: .5, cy: .74 });
    const amb = $('.ambient'), cv = document.createElement('canvas');   // o fundo do site inteiro
    cv.className = 'ceu'; cv.setAttribute('aria-hidden', 'true'); amb.appendChild(cv);
    ceuSite = criarViagem(amb, cv, { cx: .5, cy: .5, gatilho: document,
      filtro: e => !e.target.closest('a,input,select,textarea,label,.qa button,.rv-btn,.serve,.btn,.lb') });
    onPageScroll();`);
rep(`  let ceuHero = null;`, `  let ceuHero = null, ceuSite = null;`);
// a rolagem acelera o céu; ele descansa enquanto a abertura cobre a tela
rep(`  function onPageScroll() {
    if (scrollQueued) return;`, `  let ultimoYSite = scrollY;
  function onPageScroll() {
    if (scrollQueued) return;`);
rep(`      const heroEnd = hero.getBoundingClientRect().bottom;
      const solid = heroEnd < 90;`, `      const heroEnd = hero.getBoundingClientRect().bottom;
      if (ceuSite) { ceuSite.ativar(heroEnd < innerHeight - 1); ceuSite.empurrar(Math.abs(scrollY - ultimoYSite)); }
      ultimoYSite = scrollY;
      const solid = heroEnd < 90;`);

fs.writeFileSync(f, s);
console.log("ok");
