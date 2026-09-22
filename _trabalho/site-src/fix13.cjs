// Orçamento: todos os campos passam a ser obrigatórios; sem tudo preenchido, o botão não abre o WhatsApp
const fs = require("fs");
const f = __dirname + "/../../gloriafestas/index.html";
let s = fs.readFileSync(f, "utf8");
const rep = (a, b) => { if (!s.includes(a)) { console.error("NAO ACHEI:\n" + a.slice(0, 160)); process.exit(1); } s = s.replace(a, () => b); };
const req = t => `<span>${t} <span class="req" aria-hidden="true">*</span></span>`;

// HTML: asterisco, required e mensagem de erro em cada campo que era opcional
rep(`<label for="f-data">Data prevista</label>
              <input id="f-data" name="data" type="date">`,
    `<label for="f-data">${req('Data prevista')}</label>
              <input id="f-data" name="data" type="date" required aria-describedby="e-data">
              <span class="err" id="e-data">Escolha a data da festa.</span>`);
rep(`<label for="f-conv">Número de convidados</label>
              <input id="f-conv" name="conv" type="text" inputmode="numeric" placeholder="Ex.: 60">`,
    `<label for="f-conv">${req('Número de convidados')}</label>
              <input id="f-conv" name="conv" type="text" inputmode="numeric" placeholder="Ex.: 60" required aria-describedby="e-conv">`);
rep(`<button type="button" aria-pressed="false">150+</button></span>
            </div>`,
    `<button type="button" aria-pressed="false">150+</button></span>
              <span class="err" id="e-conv">Coloque quantos convidados, mais ou menos.</span>
            </div>`);
rep(`<label for="f-local">Local da festa</label>
              <input id="f-local" name="local" type="text" autocomplete="address-level2" placeholder="Bairro e cidade" aria-describedby="h-local">`,
    `<label for="f-local">${req('Local da festa')}</label>
              <input id="f-local" name="local" type="text" autocomplete="address-level2" placeholder="Bairro e cidade" required aria-describedby="e-local h-local">
              <span class="err" id="e-local">Escreva o bairro e a cidade da festa.</span>`);
rep(`<label for="f-msg">Mensagem ou observações</label>
              <textarea id="f-msg" name="msg" placeholder="Conte o que imagina: horário, tema, preferências..."></textarea>`,
    `<label for="f-msg">${req('Mensagem ou observações')}</label>
              <textarea id="f-msg" name="msg" placeholder="Conte o que imagina: horário, tema, preferências..." required aria-describedby="e-msg"></textarea>
              <span class="err" id="e-msg">Conte um pouco da festa: horário, tema ou preferências.</span>`);
// aviso logo abaixo do quadro de áreas de risco
rep(`não entramos em áreas de risco. Atendemos Nilópolis e região.</p>
          </div>`,
    `não entramos em áreas de risco. Atendemos Nilópolis e região.</p>
          </div>
          <p class="obrig"><span class="req" aria-hidden="true">*</span> Todos os campos são obrigatórios.</p>`);

// CSS: a moldura vermelha também na caixa de mensagem; a linha "todos obrigatórios"
rep(`.fld.bad input,.fld.bad select{`, `.fld.bad input,.fld.bad select,.fld.bad textarea{`);
rep(`.fld .err{display:none;font-size:14px;color:#A3203F}`,
    `.fld .err{display:none;font-size:14px;color:#A3203F}
.obrig{margin:-12px 0 22px;font-size:14px;color:var(--text-2)}
.obrig .req{color:var(--wine)}`);

// JS: todos os campos validados, ao digitar e ao enviar
rep(`  [fNome, fWhats, fTipo].forEach(i => i.addEventListener(i.tagName === 'SELECT' ? 'change' : 'input', () => { if (i.closest('.fld').classList.contains('bad')) validate(i); }));
  function validate(i) {
    let good = true;
    if (i === fNome) good = fNome.value.trim().length >= 2;
    if (i === fWhats) good = fWhats.value.replace(/\\D/g, '').length >= 10;
    if (i === fTipo) good = !!fTipo.value;
    mark(i, good);
    return good;
  }`,
`  const campos = [fNome, fWhats, fTipo, fData, fConv, fLocal, fMsg];   // todos obrigatórios
  campos.forEach(i => ['input', 'change'].forEach(ev => i.addEventListener(ev, () => { if (i.closest('.fld').classList.contains('bad')) validate(i); })));
  const hoje = () => { const d = new Date(); return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10); };
  fData.min = hoje();                                   // o calendário já começa em hoje
  const eData = $('#e-data');
  function validate(i) {
    let good = true;
    if (i === fNome) good = fNome.value.trim().length >= 2;
    if (i === fWhats) good = fWhats.value.replace(/\\D/g, '').length >= 10;
    if (i === fTipo) good = !!fTipo.value;
    if (i === fData) { good = !!fData.value && fData.value >= hoje(); eData.textContent = fData.value ? 'Escolha uma data a partir de hoje.' : 'Escolha a data da festa.'; }
    if (i === fConv) good = +((fConv.value.match(/\\d+/) || [0])[0]) > 0;
    if (i === fLocal) good = fLocal.value.trim().length >= 3;
    if (i === fMsg) good = fMsg.value.trim().length >= 3;
    mark(i, good);
    return good;
  }`);
rep(`    fConv.value = b.textContent === '150+' ? '150 ou mais' : b.textContent;
  }));`,
`    fConv.value = b.textContent === '150+' ? '150 ou mais' : b.textContent;
    if (fConv.closest('.fld').classList.contains('bad')) validate(fConv);
  }));`);
rep(`    const bad = [fNome, fWhats, fTipo].filter(i => !validate(i));
    if (bad.length) { e.preventDefault(); bad[0].focus(); return; }`,
`    const bad = campos.filter(i => !validate(i));
    if (bad.length) {                  // falta algo: não abre o WhatsApp e leva a pessoa ao primeiro campo vazio
      e.preventDefault();
      bad[0].scrollIntoView({ block: 'center', behavior: RM.matches ? 'auto' : 'smooth' });
      bad[0].focus({ preventScroll: true });
      return;
    }`);
rep(`  form.addEventListener('submit', e => { e.preventDefault(); enviar.click(); });`,
`  enviar.addEventListener('auxclick', e => { if (campos.filter(i => !validate(i)).length) e.preventDefault(); });   // botão do meio também respeita
  form.addEventListener('submit', e => { e.preventDefault(); enviar.click(); });`);

fs.writeFileSync(f, s);
console.log("ok");
