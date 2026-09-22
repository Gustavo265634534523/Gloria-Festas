// Feedbacks: 2 prints trocados (saíram o dos comentários e o da conversa da festa de 1 ano) e 1 novo; total 7
const fs = require("fs");
const f = __dirname + "/../../gloriafestas/index.html";
let s = fs.readFileSync(f, "utf8");
const rep = (a, b) => { if (!s.includes(a)) { console.error("NAO ACHEI:\n" + a.slice(0, 160)); process.exit(1); } s = s.replace(a, () => b); };

const cards = [
  { w: 420, h: 495, q: 'A qualidade se manteve do início ao fim.', tag: 'Aniversário',
    alt: 'Print de mensagem de cliente no WhatsApp: “Bom dia. Gostaria de agradecer o serviço prestado e a equipe enviada para o aniversário da minha filha. Se eu for enumerar os elogios de forma simples e objetiva seriam: Funcionários: 1, pontuais; 2, educados; 3, simpáticos; 4, organizados; 5, atenciosos. Sobre o buffet: variados, frescos e saborosos. A qualidade se manteve do início ao fim…”' },
  { w: 446, h: 479, q: 'Tudo uma delícia, quentinho, saboroso!', tag: 'Mensagem de cliente',
    alt: 'Print de mensagem de cliente no WhatsApp: “Oh Glória, eu quero agradecer por tudo, não tenho absolutamente nada pra reclamar, somente elogios! Foi como te falei ontem, as minhas festas vão ser sempre feitas por vocês! Nós amamos, nossos convidados também! Muito obrigada pelo carinho, pela atenção dos seus funcionários, todos muito alegres e simpáticos e extremamente atenciosos! Tudo uma delícia, quentinho, saboroso! Muito obrigada mesmo, de coração! Que o Senhor continue abençoando rica e abundantemente a sua empresa e que seja próspera em tudo! Um beijo e um forte abraço!”' },
  { w: 394, h: 279, q: 'Todo mundo pedindo o seu contato.', tag: 'Mensagem de cliente',
    alt: 'Print de resposta de cliente a um status do WhatsApp: “Qualidade do serviço de vocês é excepcional, funcionários educados, maravilhosos e a comida muito boa… Todo mundo pedindo o seu contato e fazendo elogios. Vocês entregam tudo e não decepcionam em nada.”' },
  { w: 430, h: 341, q: 'Todos saíram muito satisfeitos.', tag: 'Casamento',
    alt: 'Print de mensagem de cliente no WhatsApp: “Oi Glória, boa tarde, passando para agradecer pelo bom atendimento do seu buffet no casamento da minha filha… Foi tudo de bom, muito bem servido, toda equipe bem equipada e de uma simpatia enorme com os meus convidados. Todos saíram muito satisfeitos pela boa recepção e atendimento. Super indico a todos que vierem me perguntar. Foi tudo de bom, gratidão por tudo. Deus abençoe toda equipe Glória Buffet.”' },
  { w: 435, h: 264, q: 'Buffet maravilhoso como sempre.', tag: 'Mensagem de cliente',
    alt: 'Print de mensagem de cliente no WhatsApp: “Oi Glória, bom dia! Passando aqui para agradecer pelo buffet maravilhoso como sempre, o pessoal do trabalho maravilhosos também como sempre, muito simpáticos, cuidadosos e atenciosos, como sempre um trabalho de excelência. Obrigada mais uma vez!”' },
  { w: 425, h: 343, q: 'A sua equipe nota 1000.', tag: 'Mensagem de cliente',
    alt: 'Print de mensagem de cliente no WhatsApp: “Oi Glória, boa noite! Desculpa a demora, mas não posso deixar de agradecer, a sua equipe nota 1000, as meninas são maravilhosas, muito organizadas e simpáticas. As comidas estavam uma delícia, não tinha uma coisa pra falar de ruim. Muito obrigada!”' },
  { w: 414, h: 125, q: 'Foi só elogios aqui na festa.', tag: 'Mensagem de cliente',
    alt: 'Print de mensagem de cliente no WhatsApp: “Glória, sua equipe foi ótima, muito atenciosa, muito obrigada por fazer parte desse momento, foi só elogios aqui na festa sobre o buffet.”' },
];
const cardHtml = cards.map((c, i) => `        <figure class="rv-card" role="group" aria-roledescription="cartão" aria-label="Feedback ${i + 1} de ${cards.length}">
          <figcaption class="rv-top"><svg class="q" aria-hidden="true"><use href="#i-aspas"/></svg><span class="rv-quote">${c.q}</span></figcaption>
          <button class="rv-print" type="button" aria-label="Ampliar o print: ${c.q}"><img src="assets/feedback-${i + 1}.jpg" width="${c.w}" height="${c.h}" loading="lazy" decoding="async" draggable="false" alt="${c.alt}"><span class="zoom" aria-hidden="true"><svg><use href="#i-lupa"/></svg></span></button>
          <span class="rv-tag"><svg aria-hidden="true"><use href="#i-estrela"/></svg>${c.tag}</span>
        </figure>`).join("\n");

// troca todo o conteúdo da fita
const ini = `      <div class="rv-fita" id="rv-fita">\n`;
const fim = `\n      </div>\n    </div>\n    <p class="rv-hint`;
const a = s.indexOf(ini), b = s.indexOf(fim, a);
if (a < 0 || b < 0) { console.error("fita não encontrada"); process.exit(1); }
s = s.slice(0, a + ini.length) + cardHtml + s.slice(b);

// agora são todos prints de WhatsApp
rep(`Prints reais de mensagens e comentários de clientes, do jeito que chegaram para a gente.`, `Prints reais de mensagens de clientes, do jeito que chegaram para a gente.`);

fs.writeFileSync(f, s);
console.log("ok,", cards.length, "cartões");
