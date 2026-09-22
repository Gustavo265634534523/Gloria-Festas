const fs = require("fs");
let s = fs.readFileSync(__dirname + "/index.template.html", "utf8");
const rep = (a, b, all) => {
  if (!s.includes(a)) { console.error("NAO ACHEI:\n" + a.slice(0, 160)); process.exit(1); }
  s = all ? s.split(a).join(b) : s.replace(a, b);
};
// monograma: conteúdo interno do logo, escalado e centrado
const monoInner = `<g transform="translate(120 122) scale(.62) translate(-300 -304)"><use href="#tampa-logo" width="600" height="600"/><use href="#louros" width="600" height="600"/><text x="300" y="338" text-anchor="middle" font-family="'Bodoni Moda',Didot,Georgia,serif" font-style="italic" font-weight="500" font-size="124" letter-spacing="-2" fill="#F6E9CF">GF</text><path d="M254 370H346" stroke="#E1CA8B" stroke-width="2.4" stroke-dasharray="1.5 3.5"/></g>`;
rep(`        <g class="gf">
          <use href="#tampa-logo" x="-180" y="-178" width="600" height="600" transform="scale(1)"/>
          <use href="#louros" x="-180" y="-160" width="600" height="600"/>
          <text x="120" y="158" text-anchor="middle" font-family="'Bodoni Moda',Didot,Georgia,serif" font-style="italic" font-weight="500" font-size="104" letter-spacing="-2" fill="#F6E9CF">GF</text>
          <path d="M82 184H158" stroke="#E1CA8B" stroke-width="1.8" stroke-dasharray="1.4 3.4"/>
        </g>`, `        <g class="gf">${monoInner}</g>`);
rep(`        <use href="#tampa-logo" x="-180" y="-178" width="600" height="600"/>
        <use href="#louros" x="-180" y="-160" width="600" height="600"/>
        <text x="120" y="158" text-anchor="middle" font-family="'Bodoni Moda',Didot,Georgia,serif" font-style="italic" font-weight="500" font-size="104" letter-spacing="-2" fill="#F6E9CF">GF</text>
        <path d="M82 184H158" stroke="#E1CA8B" stroke-width="1.8" stroke-dasharray="1.4 3.4"/>`, `        ${monoInner}`);
// h1 também no hero estático
rep(`        <p class="chip"><svg aria-hidden="true"><use href="#i-estrela"/></svg>Buffet Glória Festas · Nilópolis, RJ</p>`,
    `        <h1 class="chip"><svg aria-hidden="true"><use href="#i-estrela"/></svg>Buffet Glória Festas · Nilópolis, RJ</h1>`);
// emblema: anéis num símbolo próprio para girar no rodapé
rep(`      <g class="spin"><g fill="none" stroke="#B88A3B"><circle cx="300" cy="300" r="244" stroke-width="7" stroke-dasharray="1.3 3.2"/><circle cx="300" cy="300" r="231" stroke-width="1.6" stroke-dasharray="0.1 3.6" stroke-linecap="round"/></g></g>
`, ``);
rep(`    <symbol id="emblema" viewBox="0 0 600 600">`,
    `    <symbol id="aneis" viewBox="0 0 600 600"><g fill="none" stroke="#B88A3B"><circle cx="300" cy="300" r="244" stroke-width="7" stroke-dasharray="1.3 3.2"/><circle cx="300" cy="300" r="231" stroke-width="1.6" stroke-dasharray="0.1 3.6" stroke-linecap="round"/></g></symbol>
    <symbol id="emblema" viewBox="0 0 600 600">`);
rep(`<div class="emb r"><svg viewBox="0 0 600 600" role="img" aria-label="Emblema do Buffet Glória Festas"><use href="#emblema"/></svg></div>`,
    `<div class="emb r"><svg viewBox="0 0 600 600" role="img" aria-label="Emblema do Buffet Glória Festas"><g class="spin"><use href="#aneis" width="600" height="600"/></g><use href="#emblema" width="600" height="600"/></svg></div>`);
rep(`.live .foot .emb .spin,.foot.live .emb .spin{animation:spin 90s linear infinite;transform-origin:300px 300px}`,
    `.foot .emb .spin{transform-origin:300px 300px}.foot.live .emb .spin{animation:spin 110s linear infinite}`);
// linhas do selo sem distorcer os pontinhos
rep(`<path d="M0 1H260" stroke="currentColor" stroke-width="2" stroke-dasharray="0.1 6" stroke-linecap="round"/>`,
    `<path d="M0 1H260" stroke="currentColor" stroke-width="2" stroke-dasharray="0.1 6" stroke-linecap="round" vector-effect="non-scaling-stroke"/>`, true);
// fio dos passos fora da <ol> (HTML válido)
rep(`        <ol class="steps">
          <svg class="thread" viewBox="0 0 2 100" preserveAspectRatio="none" aria-hidden="true"><path d="M1 0V100" pathLength="1" stroke="currentColor" stroke-width="2" stroke-dasharray="1" data-draw style="stroke-dashoffset:1"/></svg>`,
`        <div class="steps-wrap">
        <svg class="thread" viewBox="0 0 2 100" preserveAspectRatio="none" aria-hidden="true"><path d="M1 0V100" pathLength="1" stroke="currentColor" stroke-width="2" stroke-dasharray="1" data-draw style="stroke-dashoffset:1"/></svg>
        <ol class="steps">`);
rep(`Você só recebe os convidados.</p></div></li>
        </ol>`, `Você só recebe os convidados.</p></div></li>
        </ol>
        </div>`);
rep(`.steps{position:relative;margin:44px 0 0;padding:0;list-style:none}
.steps .thread{position:absolute;left:25px;top:14px;bottom:14px;width:2px;height:calc(100% - 28px);color:var(--gold);overflow:visible}`,
`.steps-wrap{position:relative;margin:44px 0 0}
.steps{position:relative;margin:0;padding:0;list-style:none}
.thread{position:absolute;left:25px;top:40px;width:2px;height:calc(100% - 80px);color:var(--gold);overflow:visible}`);
// tampa interativa: rola a página no celular, sem menu de "salvar imagem"
rep(`cursor:pointer;touch-action:none;`, `cursor:pointer;touch-action:pan-y;`);
rep(`.serve .plate img{width:100%;height:100%;object-fit:cover}`, `.serve .plate img{width:100%;height:100%;object-fit:cover}
.serve img{pointer-events:none;-webkit-user-drag:none}`);
rep(`  .serve .lid{transform:none}
}`, `}`);
// teclado e leitor de tela: um clique abre na hora
rep(`  serve.addEventListener('keydown', e => {
    if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); startHold(); }
    else if (e.key === ' ' || e.key === 'Enter') e.preventDefault();
  });
  serve.addEventListener('keyup', e => { if (e.key === ' ' || e.key === 'Enter') endHold(); });
`, ``);
// linhas da mensagem: null = campo vazio (sai), '' = linha em branco (fica)
rep("      fData.value && `*Data prevista:* ${fmtData(fData.value)}`,\n      fConv.value.trim() && `*Convidados:* ${fConv.value.trim()}`,\n      fLocal.value.trim() && `*Local da festa:* ${fLocal.value.trim()}`,\n      fMsg.value.trim() && `*Observações:* ${fMsg.value.trim()}`,\n      '', '(Pedido enviado pelo site)'\n    ].filter(l => l !== false && l !== '' || l === '');",
    "      fData.value ? `*Data prevista:* ${fmtData(fData.value)}` : null,\n      fConv.value.trim() ? `*Convidados:* ${fConv.value.trim()}` : null,\n      fLocal.value.trim() ? `*Local da festa:* ${fLocal.value.trim()}` : null,\n      fMsg.value.trim() ? `*Observações:* ${fMsg.value.trim()}` : null,\n      '', '(Pedido enviado pelo site)'\n    ].filter(l => l !== null);");
// movimento reduzido: tampa aberta automaticamente e desfeita quando o movimento volta
rep(`    if (!opened) openServe(true);`, `    if (!opened) { serveWrap.dataset.auto = '1'; openServe(true); }`);
rep(`    else { unpinFinalStates(); if (opened && serveWrap.dataset.auto === '1') resetServe(); applyHeroMode(); }`,
    `    else { unpinFinalStates(); if (opened && serveWrap.dataset.auto === '1') { resetServe(); delete serveWrap.dataset.auto; } applyHeroMode(); }`);
rep(`  if (RM.matches) { serveWrap.dataset.auto = '1'; pinToFinalStates(); }`, `  if (RM.matches) pinToFinalStates();`);
rep(`      if (i === 0) { k = Math.max(k, loadK); op = Math.max(op * 1, 0) }`, `      if (i === 0) k = Math.max(k, loadK);`);
// rodapé com respiro para a barra do celular
rep(`@media (max-width:900px){.foot .grid{grid-template-columns:1fr;justify-items:start}}`,
    `@media (max-width:900px){.foot .grid{grid-template-columns:1fr;justify-items:start}}
@media (max-width:720px){.foot{padding-bottom:110px}}`);
fs.writeFileSync(__dirname + "/index.template.html", s);
console.log("template ok");
