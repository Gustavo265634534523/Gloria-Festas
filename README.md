# Buffet Glória Festas

Site do Buffet Glória Festas, de Nilópolis (RJ), que realiza sonhos desde 2010.
Buffet infantil, buffet adulto, 15 anos e casamento, na casa do cliente ou no salão que ele escolher.

O site é uma página só, em HTML, CSS e JavaScript puros, sem nenhuma biblioteca.
A abertura é uma capa fixa, sem rolagem guiada: o título, os botões de orçamento e WhatsApp
e uma colagem com fotos reais das festas. Os fundos não se mexem.

## Como ver o site no computador

Dois cliques em **Ver o site (previa).bat**. Uma janela preta abre (deixe aberta) e o site
abre no navegador em `http://localhost:8080/?animacao`.

O `?animacao` liga as animações mesmo em computadores com os efeitos do sistema desligados,
e o navegador passa a lembrar dessa escolha. Para voltar à versão parada: `?animacao=0`.

## Como ver no celular, pela rede de casa

Dois cliques em **Ver o site no celular.bat**. A janela mostra o endereço para digitar no
celular (algo como `http://192.168.0.120:8085/?animacao`). O celular precisa estar na mesma
internet, e na primeira vez o Windows pede para permitir o Node.js na rede.

## O que tem em cada pasta

| Pasta | O que é |
| --- | --- |
| `gloriafestas/` | O site em si. É esta pasta que vai para o ar. |
| `gloriafestas/assets/` | Fotos, vídeos da tampa, ícone e imagem de compartilhamento. |
| `_trabalho/tools/` | Ferramentas de teste: fotos de tela, medições de velocidade, leitura dos textos. |
| `_trabalho/site-src/` | Os scripts que aplicaram cada mudança no site, um por etapa. |
| `_trabalho/render/` | A cena 3D da tampa dourada, que gerou os vídeos e as imagens. |

## Testes

Com a prévia ligada, dentro de `_trabalho/tools`:

- `node checks.mjs` confere larguras de tela, o formulário e erros.
- `node perf.mjs celular` mede velocidade e fluidez como o Lighthouse.
- `node audit2.mjs 390 844` confere se os textos da abertura continuam legíveis.
- `node flick.mjs 390 844` confere se nenhuma frase é pulada numa rolagem rápida.

## Publicação

O site está publicado pelo GitHub Pages: a cada envio para o `main`, a pasta `gloriafestas/`
vai para o ar automaticamente (veja `.github/workflows/pages.yml`).

Para o endereço próprio do buffet, na hospedagem, é preciso trocar as duas linhas marcadas
com `DEPLOY STEP` no `index.html` pelo domínio de verdade.

## Contato do buffet

WhatsApp (21) 96416-6784 · Instagram [@festasgloria](https://www.instagram.com/festasgloria/) · Nilópolis, Rio de Janeiro
