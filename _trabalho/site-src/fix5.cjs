// Envio do orçamento à prova de bloqueio: o botão vira um link de verdade para o wa.me (nunca bloqueado),
// em vez de window.open (janela criada por código, que os navegadores podem bloquear).
const fs = require("fs");
const f = __dirname + "/../../gloriafestas/index.html";
let s = fs.readFileSync(f, "utf8");
const rep = (a, b) => { if (!s.includes(a)) { console.error("NAO ACHEI:\n" + a.slice(0, 160)); process.exit(1); } s = s.replace(a, b); };

// HTML: link com cara de botão + botão invisível para o Enter continuar funcionando
rep(`            <button class="btn btn-wine" type="submit"><svg aria-hidden="true"><use href="#i-enviar"/></svg>Solicitar orçamento</button>`,
`            <a class="btn btn-wine" id="enviar" href="https://wa.me/5521964166784" target="_blank" rel="noopener" role="button"><svg aria-hidden="true"><use href="#i-enviar"/></svg>Solicitar orçamento</a>
            <button type="submit" class="sr-only" tabindex="-1" aria-hidden="true">Enviar</button>`);

// JS: validação e montagem da mensagem no clique do link
rep(`  form.addEventListener('submit', e => {
    e.preventDefault();
    const bad = [fNome, fWhats, fTipo].filter(i => !validate(i));
    if (bad.length) { bad[0].focus(); return; }
    const linhas = [`, `  const enviar = $('#enviar');
  const WA_BASE = 'https://wa.me/' + WA;
  function montarUrl() {
    const linhas = [`);
rep(`    const url = \`https://wa.me/\${WA}?text=\${encodeURIComponent(linhas.join('\\n'))}\`;
    okLink.href = url;
    window.open(url, '_blank', 'noopener');
    card.classList.add('sent');
    ok.focus({ preventScroll: true });
    mostrarSucesso();
  });`, `    return \`\${WA_BASE}?text=\${encodeURIComponent(linhas.join('\\n'))}\`;
  }
  enviar.addEventListener('click', e => {
    const bad = [fNome, fWhats, fTipo].filter(i => !validate(i));
    if (bad.length) { e.preventDefault(); bad[0].focus(); return; }
    const url = montarUrl();
    enviar.href = url;                 // o próprio clique abre o WhatsApp: é um link de verdade, o navegador não bloqueia
    okLink.href = url;
    setTimeout(() => {                 // depois que o navegador seguiu o link, mostra o recado e comemora
      card.classList.add('sent');
      ok.focus({ preventScroll: true });
      mostrarSucesso();
    }, 0);
  });
  form.addEventListener('submit', e => { e.preventDefault(); enviar.click(); });   // Enter num campo também envia`);
rep(`  $('#again').addEventListener('click', () => { card.classList.remove('sent'); form.reset();`,
    `  $('#again').addEventListener('click', () => { card.classList.remove('sent'); form.reset(); enviar.href = WA_BASE;`);

fs.writeFileSync(f, s);
console.log("ok");
