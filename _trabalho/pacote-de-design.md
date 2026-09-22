# Pacote de design: Buffet Glória Festas (Nível 1, enxuto)

Abertura desenhada em código (sem Higgsfield): cena 3D renderizada por nós, 180 quadros, 6 s, scrub por rolagem. Aprovada pelo usuário na 2ª versão (menos faíscas e brilho).

## 1. Premissa da marca

**Servir.** A tampa de servir é a promessa da Glória Festas: debaixo dela está tudo pronto, farto e quentinho, na hora certa. O site ensina e vende essa ideia. A abertura levanta a tampa, o momento interativo deixa o visitante levantar outra, e o formulário é o pedido para servir a festa dele. O buffet vai até a casa ou o salão do cliente; o cliente só recebe os convidados.

## 2. Paleta (amostrada do logo e da filmagem)

```css
:root{
  --canvas:#FAF6EF;        /* creme do logo */
  --canvas-2:#F3EADF;      /* creme quente, seções alternadas */
  --panel:#FFFCF8;         /* cartão do formulário */
  --wine:#5A1E3A;          /* vinho do logo: CTA em fundo claro */
  --wine-deep:#3A1025;     /* seções escuras */
  --ink:#2A0C1B;           /* texto principal */
  --text-2:#6E5560;        /* texto secundário */
  --gold:#B88A3B;          /* dourado do logo: linhas e ícones */
  --gold-light:#E1CA8B;    /* dourado sobre fundo escuro */
  --gold-cta:#D6B56C;      /* CTA sobre fundo escuro (acento raro) */
  --gold-ink:#7E5A1E;      /* dourado para texto pequeno sobre creme */
  --cream:#F2E6CF;         /* creme do GF: texto sobre vinho */
}
```

Desvio declarado: creme + serifa está na lista de visuais "de IA", mas aqui é o mundo material da marca (o logo é vinho, dourado e creme com serifa). Merecido com: tons amostrados do logo e da filmagem, assinatura própria (a tampa), layouts fora do molde.

## 3. Fontes

- Display: **Bodoni Moda** 500 e 600, itálico 400 e 500 (o "GF" do logo é uma serifa itálica de alto contraste).
- Texto: **Jost** 400 e 500.
- Rótulos pequenos: Jost 500 em caixa alta com espaçamento. Desvio declarado: sem mono, porque numa marca de festa a mono soaria técnica.

## 4. Mapa de faixas (hero de 520vh; pontos de partida, validar no teste de flick)

| Faixa | Intervalo | Momento da filmagem | Texto (ao pé da letra) | Entrada |
|---|---|---|---|---|
| 1 | 0.00 a 0.20 | tampa fechada, um brilho corre pela cúpula | kicker "Buffet Glória Festas · desde 2010" / título "Debaixo desta tampa, uma festa inteira." / dica "Role para servir" | abre assentada (rampa de carregamento); um brilho dourado passa pelas palavras junto com o brilho da cúpula |
| 2 | 0.23 a 0.43 | a tampa abre uma fresta, a luz escapa rente à bandeja, vapor | "Farta e quentinha, do primeiro ao último convidado." / "Festa boa é aquela em que ninguém ouve a palavra acabou." | fresta de luz: uma linha dourada cresce do centro e as palavras sobem de trás dela |
| 3 | 0.46 a 0.66 | a tampa sobe e sai do quadro, a luz se espalha | "A gente leva a festa até você." / "Na sua casa ou no salão que você escolher." | as palavras sobem com a tampa, do desfocado para o nítido |
| 4 | 0.70 a 1.00 | repouso: bandeja com luz quente, pontinhos dourados caindo | monograma GF sobre a bandeja / "Realizando sonhos desde 2010." / "Buffet infantil, adulto, 15 anos e casamento em Nilópolis e região." / botão "Solicite um orçamento" / "ou chame no WhatsApp (21) 96416-6784" | assentamento em etapas: palavras descem até o lugar (eco dos pontinhos caindo), depois o subtítulo, depois o botão; o monograma se desenha |

Texto sempre na coluna esquerda; a ação (tampa) vive à direita (65% da largura). Monograma no ponto (65%, 40%) do quadro final.

## 5. Hero estático (celular, movimento reduzido)

Imagem: `hero-mobile.jpg` (retrato, tampa no ar com luz) no celular; `hero-ending.jpg` + monograma no desktop com movimento reduzido.
- kicker: "Buffet Glória Festas · Nilópolis, RJ"
- título: "Realizando sonhos desde 2010."
- subtítulo: "Buffet infantil, adulto, 15 anos e casamento. A gente leva a festa até você."
- CTA: "Solicite um orçamento" / "ou chame no WhatsApp"

## 6. Abaixo da dobra (tudo afunila para #orcamento)

**#festas (creme, quatro arcos em forma de cúpula)**
- kicker "O que servimos" / título "Quatro festas, o mesmo capricho." / lede "Cada festa tem o seu jeito. O cuidado com a comida e com os seus convidados é sempre o mesmo."
- Buffet Infantil: "Criança feliz, pais tranquilos e mesa sempre cheia."
- Buffet Adulto: "Aniversários, bodas e encontros de família, com comida boa para a conversa render."
- 15 Anos: "A noite dela merece uma mesa à altura do vestido."
- Casamento: "Vocês cuidam do sim. A gente cuida dos convidados."
- link em cada arco: "Pedir orçamento" (já escolhe o tipo de festa no formulário)

**#como-funciona (creme quente, foto com moldura dourada deslocada + passos)**
- kicker "Como funciona" / título "Você escolhe o lugar. A gente leva a festa." / lede itálico "Desde 2010, a Glória Festas monta buffet em casas e salões de Nilópolis e região."
- 01 "Peça o orçamento": "Conte a data, o tipo de festa e quantos convidados vêm."
- 02 "Receba a proposta": "A gente responde pelo WhatsApp com uma proposta feita para a sua festa."
- 03 "Reserve a data": "Tudo combinado, a data fica guardada para você."
- 04 "Aproveite a festa": "No dia, a equipe chega, monta e serve. Você só recebe os convidados."
- aviso: "Atendemos Nilópolis e região. Por segurança da nossa equipe, não entramos em áreas de risco."
- legenda da foto: "Festa real, direto do nosso Instagram"

**#fotos (vinho escuro; o momento interativo)**
- kicker "Direto das nossas festas" / título "Festa de verdade, comida de verdade." / lede "Nada de foto de banco de imagem. Tudo o que você vê aqui saiu das nossas festas."
- interação: tampa sobre o prato; "Segure para servir"; ao completar: "Servido." e a galeria acende em sequência
- link "Veja mais no Instagram @festasgloria"

**#duvidas (creme; título à esquerda, sanfona à direita)**
- kicker "Dúvidas" / título "O que todo mundo pergunta antes de fechar."
- "Vocês atendem na minha região?" / "Atendemos Nilópolis e região. Por segurança da equipe, não entramos em áreas de risco. Mande o endereço da festa no pedido de orçamento que a gente confirma para você."
- "Vocês vão até a minha casa?" / "Vamos. A gente leva o buffet até a sua casa ou até o salão que você escolher."
- "Com quanto tempo de antecedência eu peço?" / "Quanto antes, melhor, principalmente para sábados e datas concorridas. Mande a data que a gente confirma se ela está livre."
- "Como eu sei o que está incluído?" / "Cada festa é montada do seu jeito. No orçamento você recebe tudo o que está incluído, por escrito, sem surpresa no dia."
- "Quanto custa?" / "Depende do tipo de festa, do número de convidados e do cardápio. O orçamento é rápido e não tem compromisso."
- cartão lateral: "Não achou sua dúvida?" / "Chame no WhatsApp" (21) 96416-6784

**#orcamento (formulário igual ao exemplo)**
- título "Solicite seu orçamento" (sublinhado dourado que se desenha) / "Preencha os dados abaixo. A gente responde rápido pelo WhatsApp com uma proposta feita para a sua festa."
- Nome completo * (Ex.: Ana Paula Souza) / WhatsApp com DDD * ((21) 90000-0000) / Tipo de festa * (Buffet Infantil, Buffet Adulto, 15 Anos, Casamento, Outra festa) / Data prevista / Número de convidados (atalhos 30, 50, 80, 100, 150+) / Local da festa (Bairro e cidade; dica "Não entramos em áreas de risco.") / Mensagem ou observações (Conte o que imagina: horário, tema, preferências...)
- privacidade: "Seus dados vão direto para o nosso WhatsApp e são usados só para o seu orçamento."
- botão: "Solicitar orçamento"
- destino: link wa.me para 55 21 96416-6784 com a mensagem montada (o visitante toca em enviar no WhatsApp dele)
- sucesso: "Pedido pronto!" / "Abrimos o WhatsApp com o seu pedido já escrito. É só tocar em enviar que a gente responde por lá." / "Não abriu? Toque aqui" / "Fazer outro pedido"
- erros: "Escreva seu nome." / "Coloque um WhatsApp com DDD." / "Escolha o tipo de festa."
- abaixo: "Prefere conversar direto? Chame no WhatsApp (21) 96416-6784"

**Rodapé (vinho):** emblema, "Buffet Glória Festas", "Realizando sonhos desde 2010.", WhatsApp, Instagram @festasgloria, "Nilópolis, Rio de Janeiro", "Não entramos em áreas de risco.", "© 2026 Buffet Glória Festas".

## 7. Camada vetorial

Emblema redesenhado em SVG (sem o contorno pontilhado preto do PDF); marca simplificada (disco vinho + GF) para navegação e selo; ícones em linha dourada (balão, taças, tiara, alianças, passos, local, cadeado, enviar, WhatsApp, Instagram); ramos de louro do logo como ornamento; linhas pontilhadas douradas que se traçam no scroll; estrelinhas de 4 pontas (do logo) piscando em nível de sussurro. Camada fixa de ambiente: grão + brilhos vinho e dourado derivando devagar (80 s). Tudo honra movimento reduzido.

## 8. Engenharia

Blob transmitido com anel, interpolação normalizada por dt que descansa, seeks travados, escritas de DOM só na mudança, faixas com smoothstep e --k, legibilidade em 4 camadas (scrim global, scrim por faixa ancorado na coluna do texto, sombra de texto, chip), cinco portões iguais em CSS e JS com listeners vivos, completo sem vídeo, movimento reduzido ao vivo nas duas direções, piso de qualidade.

## 9. Gate de texto

Cada linha acima embarca ao pé da letra. Antes de mostrar: zero travessões, zero palavras de estoque, varredura de sinais de IA. Dispositivos de marca deliberados ("Infantil. Adulto." não usado; "Você escolhe o lugar. A gente leva a festa.") ficam.
