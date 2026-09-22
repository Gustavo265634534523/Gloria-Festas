// Mudanças pedidas: (1) link de prévia com animação (?animacao) para quem tem animação desligada no Windows;
// (2) aviso de áreas de risco em destaque no formulário de orçamento.
const fs = require("fs");
const f = __dirname + "/../../gloriafestas/index.html";
let s = fs.readFileSync(f, "utf8");
const rep = (a, b) => { if (!s.includes(a)) { console.error("NAO ACHEI:\n" + a.slice(0, 140)); process.exit(1); } s = s.replace(a, b); };

// ---------- (1) prévia com animação ----------
// classe aplicada antes da primeira pintura
rep(`<meta charset="utf-8">`, `<meta charset="utf-8">
<script>if(/[?&]animacao\\b/.test(location.search))document.documentElement.classList.add('forcar-movimento')</script>`);

// portões do hero estático: os quatro de aparelho continuam iguais; o de movimento reduzido ganha a exceção da prévia
const gateOpen = `@media (max-width: 720px), (orientation: portrait) and (max-width: 1024px), (orientation: portrait) and (pointer: coarse), (orientation: landscape) and (pointer: coarse) and (max-height: 560px), (prefers-reduced-motion: reduce){`;
const start = s.indexOf(gateOpen);
if (start < 0) { console.error("portão não encontrado"); process.exit(1); }
const bodyStart = start + gateOpen.length;
const end = s.indexOf(`\n}\n@media (max-height:560px){.cue{display:none}}`, bodyStart);
const body = s.slice(bodyStart, end); // regras internas (inclui o @media de retrato aninhado)
const P = `html:not(.forcar-movimento) `;
const prefixed = body.split("\n").map(line => {
  const m = line.match(/^(\s*)(\.[^{]+)\{(.*)$/);
  if (!m) return line;
  return m[1] + m[2].split(",").map(sel => P + sel.trim()).join(",") + "{" + m[3];
}).join("\n");
const deviceGates = `@media (max-width: 720px), (orientation: portrait) and (max-width: 1024px), (orientation: portrait) and (pointer: coarse), (orientation: landscape) and (pointer: coarse) and (max-height: 560px){`;
s = s.slice(0, start) + deviceGates + body + `\n}\n@media (prefers-reduced-motion: reduce){` + prefixed + s.slice(end);

// bloco global de movimento reduzido: vale para todos, menos na prévia
rep(`@media (prefers-reduced-motion:reduce){
  html{scroll-behavior:auto}
  *,*::before,*::after{animation:none!important;transition:none!important;transition-delay:0s!important}
  .reveal .r{opacity:1;transform:none}
}`, `@media (prefers-reduced-motion:reduce){
  html:not(.forcar-movimento){scroll-behavior:auto}
  html:not(.forcar-movimento) *,html:not(.forcar-movimento) *::before,html:not(.forcar-movimento) *::after{animation:none!important;transition:none!important;transition-delay:0s!important}
  html:not(.forcar-movimento) .reveal .r{opacity:1;transform:none}
}`);

// JS: mesma regra do CSS
rep(`  const RM = matchMedia('(prefers-reduced-motion: reduce)');`,
    `  const FORCE = document.documentElement.classList.contains('forcar-movimento');
  const RM = FORCE ? { matches: false, addEventListener() {} } : matchMedia('(prefers-reduced-motion: reduce)');`);
rep(`    '(orientation: landscape) and (pointer: coarse) and (max-height: 560px)',
    '(prefers-reduced-motion: reduce)'
  ];`, `    '(orientation: landscape) and (pointer: coarse) and (max-height: 560px)',
    '(prefers-reduced-motion: reduce)'
  ].filter(q => !(FORCE && q === '(prefers-reduced-motion: reduce)'));`);

// ---------- (2) aviso de áreas de risco no orçamento ----------
rep(`        <form id="form" novalidate>
          <div class="fields">`, `        <form id="form" novalidate>
          <div class="aviso" role="note">
            <svg aria-hidden="true"><use href="#i-escudo"/></svg>
            <p><strong>Aviso importante:</strong> por segurança da nossa equipe, não entramos em áreas de risco. Atendemos Nilópolis e região.</p>
          </div>
          <div class="fields">`);
rep(`.fields{display:grid;`, `.aviso{position:relative;display:flex;gap:14px;align-items:flex-start;margin:0 0 30px;padding:16px 18px;border-radius:14px;background:#F7EDEA;border:1px solid rgba(90,30,58,.18);border-left:4px solid var(--wine)}
.aviso svg{width:24px;height:24px;flex:none;color:var(--wine);margin-top:1px}
.aviso p{margin:0;font-size:16.5px;line-height:1.5;color:var(--ink)}
.aviso strong{font-weight:500;color:var(--wine)}
.aviso::after{content:"";position:absolute;inset:-1px;border-radius:inherit;box-shadow:0 0 0 4px rgba(90,30,58,.22);opacity:0;pointer-events:none}
.quote.in .aviso::after{animation:avisoPulse 1.7s var(--ease-out) 1.1s 2}
@keyframes avisoPulse{0%{opacity:0}30%{opacity:1}100%{opacity:0}}
.fields{display:grid;`);

fs.writeFileSync(f, s);
console.log("ok");
