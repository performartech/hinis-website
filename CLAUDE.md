# CLAUDE.md — Hinis

Instruções para o Claude Code trabalhar neste projeto. Leia antes de qualquer tarefa.

---

## Projeto

Site institucional da Hinis (`hinis.com.br`), plataforma de autocuidado e autoestima feminina criada pela Dra. Hexandra Hertel. Deploy automático: push para `main` → Cloudflare Pages publica em produção automaticamente.

---

## Tom de voz

Documentos de brand em `docs/`. Ao escrever copy, consultar:
- `docs/tom-de-voz.md` — diretrizes de comunicação da marca (quando disponível)

---

## Regras da marca

- **Hinis é sempre feminino:** "a Hinis", "da Hinis", "na Hinis", "na Hinis", "pela Hinis" — nunca "o Hinis", "do Hinis", "no Hinis". A concordância verbal e adjetival também deve seguir o feminino: "a Hinis está comprometida" (não "comprometido"), "a Hinis nasceu" (não "o Hinis nasceu").
- **Tom:** acolhedor, direto, sem culpa, sem exageros, respeitoso com o tempo e o corpo de cada mulher
- **Público-alvo:** mulheres de 30–60 anos em alta sobrecarga familiar ou profissional

---

## Stack — restrições obrigatórias

- **HTML5 + CSS3 + JavaScript Vanilla apenas.** Sem frameworks, sem bundlers, sem build step, sem npm
- Dependências externas permitidas (apenas via CDN): Lucide Icons, Google Fonts, Cloudflare Turnstile
- Não sugerir React, Vue, TypeScript, Webpack, Vite ou qualquer gerenciador de pacotes

---

## Convenção de versão de cache

Ao modificar qualquer arquivo JS ou CSS, sempre bumpar o query string em **todas** as páginas que o referenciam:

```html
<!-- antes -->
<script src="js/script.js?v=2.0.0"></script>

<!-- depois -->
<script src="js/script.js?v=2.1.0"></script>
```

Atenção: páginas em `programas/` usam `../js/` — atualizar também nelas.

---

## Proteção de telefone

Nunca escrever números de telefone em plain text no HTML. Usar sempre `data-phone` com valor em Base64, decodificado por `js/phone-protection.js`:

```html
<!-- correto -->
<a href="https://wa.me/PHONE_PLACEHOLDER" data-phone="KzU1MjE5OTQwNDE2NDg=">WhatsApp</a>

<!-- errado — não replicar -->
<a href="https://wa.me/5521994041648">WhatsApp</a>
```

Números em uso:
| Uso | Número | Base64 |
|-----|--------|--------|
| WhatsApp principal (footer, contato) | +55 21 99404-1648 | `KzU1MjE5OTQwNDE2NDg=` |
| Telefone fixo | (21) 2244-2474 | — (exibido em plain text no rodapé e contato.html — aceitável) |

### ⚠️ WhatsApp temporariamente oculto (set/2026)

O canal de WhatsApp está fora do ar. **Todos os botões e links foram comentados, não removidos.** Ao criar página nova, **não adicionar botão de WhatsApp** até o canal voltar.

Marcador único para localizar tudo:

```bash
grep -rn "WHATSAPP TEMPORARIAMENTE OCULTO" --include="*.html" .
```

| Arquivo | Ocultado | Substituto colocado no lugar |
|---------|----------|------------------------------|
| `components/footer.html` | Ícone social WhatsApp | — (só Instagram) |
| `contato.html` | `.info-item` inteiro (título + texto + botão) | — |
| `faq.html` | `<li>` do WhatsApp | — |
| `politica-privacidade.html` | Linha "WhatsApp:" + o `<br>` anterior | — (e-mail e telefone seguem) |
| `checkout/essentia.html` | `<p class="ck-ajuda">` | `<p class="ck-ajuda">` com `mailto:` |
| `programas/essentia/bem-vinda.html` | Botão do CTA + frase do passo 3 | Botão "Falar por e-mail" + frase com o e-mail |
| `lp/essentia.html` | 2 botões in-card + flutuante | — |
| `lp/essentia-v2.html` | 2 botões in-card + flutuante | — |

Duas alterações **sem marcador** (não dá para comentar dentro de JSON/atributo) — reverter à mão:
- `contato.html` — `"https://wa.me/5521994041648"` removido do `sameAs` no Schema.org
- `contato.html` — `meta description` e `og:description`: "WhatsApp, email e telefone disponíveis" → "E-mail e telefone disponíveis"

As regras CSS (`.btn-whatsapp`, `.lp-btn-whatsapp`, `.lp-wa-float`) foram mantidas de propósito, para que restaurar seja só descomentar.

---

## Sistema de formulários

- Envio exclusivamente via **Google Sheets Apps Script** (Web3Forms foi removido)
- URL Google Sheets Apps Script: constante `GOOGLE_SHEETS_URL` em `js/form-handler.js`
- Envio usa `mode: 'no-cors'` — resposta é opaca; sucesso é tratado de forma otimista (erro de rede lança exception e exibe mensagem de erro)
- Após envio bem-sucedido, dispara `event: 'generate_lead'` no dataLayer com `user_data` (email/telefone/nome normalizados em lowercase + E.164) e `lead_data` (UTMs, programa, landing page) — base para Enhanced Conversions (Google Ads) e Advanced Matching (Meta)
- **Nunca remover a flag `turnstileRendered`** em `form-handler.js` — ela impede duplicação do widget Turnstile em componentes carregados dinamicamente
- Turnstile usa `render=explicit` com callback `onload=onTurnstileLoad` na tag de script
- Rate limiting em memória (2 envios/minuto) — não migrar para localStorage
- `js/config.js` está vazio — não referenciar nas páginas HTML

### Backend do formulário — Apps Script

- Projeto: **"Hinis - Formulário"** (`178RVIxQ6PVQ2NtJfEMORq5fKVnMT2aqo75E6ZfjNyC4XzracWrh6Nask`), conta `pedro@performartech.com.br`
- Planilha de destino: **"[Hinis] Leads formulário site"** (`1TzWjN44C6_z42Lm6yVvmI3eYub0MazY1n1vserJYM2s`), **primeira aba**. A planilha pertence a `pedro@waah.com.br` — a conta que implanta precisa de acesso de edição nela, ou os leads param de gravar
- ⚠️ **Não existe planilha "Hinis - Contatos".** Ela existe no Drive, tem cabeçalho parecido e **não é usada** — foi origem de diagnóstico errado antes
- Código-fonte versionado em `apps-script/Codigo.gs`. **Manter em sincronia manualmente** — o Google não versiona junto com o repo
- ⚠️ **Editar o código não muda nada em produção.** É preciso criar nova versão de implantação (`Implantar → Gerenciar implantações → ✏️ → Versão: Nova versão`). A URL `/exec` não muda. Já houve meses de divergência entre o editor e o que estava no ar por causa disso
- Para saber o que está implantado, abrir a URL `/exec` no navegador: o `doGet` responde com a constante `VERSAO`
- `ENVIAR_CONFIRMACAO` está em `false` — o lead não recebe e-mail. Ligar é decisão de produto, não de deploy

---

## Componentes e paths

- Componentes reutilizáveis em `components/`: `header.html`, `footer.html`, `form-contato.html`
- Carregados via `fetch()` por `js/load-components.js`; fallback inline apenas para `form-contato`
- `getBasePath()` calcula profundidade pelos segmentos do pathname — retorna `'../'.repeat(depth)`, funciona em qualquer nível (ex: `programas/essentia/bem-vinda.html` → `../../`)
- `adjustPaths()` prefixa `basePath` em todos os paths relativos do HTML carregado — não fazer tratamento especial por subpasta
- Ao criar nova página em `programas/` ou subpastas, verificar todos os paths (`../../css/`, `../../js/`, `../../assets/`)
- `footer.html` contém disclaimer legal obrigatório e dados da empresa (Razão Social, CNPJ, endereço, e-mail, telefone) — não remover nem alterar sem revisão jurídica

---

## CTAs por programa

| Programa | CTA | Mecanismo |
|----------|-----|-----------|
| Essentia | Botão → Hotmart Lightbox | Widget `widget.min.js` de `static.hotmart.com`; classes `hotmart-fb hotmart__button-checkout`; `checkoutMode=2` na URL. **Nunca carregar `hotmart-fb.min.css`** — sobrescreve estilos Hinis. **Exceção:** `lp/essentia.html` (v3) não usa mais o Lightbox — seus CTAs vão para `/checkout/essentia` (ver seção Pré-checkout) |
| Refugium | Botão → modal popup | `data-open-modal="formModal"`, programa pré-selecionado no `<select>` |
| Amicae | Botão → modal popup | `data-open-modal="formModal"`, programa pré-selecionado no `<select>` |

Nas 3 páginas de programa, o badge do hero é um link (`<a href="#cta" class="programa-badge-link">`) que faz scroll até a seção de conversão. O `.cta-final` de cada página tem `id="cta"` — não remover sem atualizar o `href` do badge.

### Landing pages de vendas — Essentia

Todas as LPs do Essentia compartilham:
- Caminho em `lp/` (1 nível — usa `../` para todos os paths)
- `noindex, nofollow` — tráfego pago, não indexar
- **Sem header/footer de componentes** — layout autônomo para manter foco na conversão
- Header mínimo (logo apenas) + footer mínimo inline (disclaimer legal + dados da empresa)
- Estilos em bloco `<style>` inline na própria página — não adicionar ao `styles.css`
- Inclui `utm-tracker.js` e `script.js` (FAQ); não inclui `load-components.js` nem `phone-protection.js`
- **Proteção de telefone em LPs:** como `phone-protection.js` não é carregado, usar decodificador inline ao final do `<body>`:
  ```javascript
  document.querySelectorAll('a[data-phone]').forEach(function(el) {
      try { var num = atob(el.getAttribute('data-phone')).replace(/\D/g,''); el.href = el.href.replace('PHONE_PLACEHOLDER', num); } catch(e) {}
  });
  ```
  Links com `href="https://wa.me/PHONE_PLACEHOLDER"` e `data-phone="KzU1MjE5OTQwNDE2NDg="`

#### `lp/essentia-v0.html` — v0 (original, legado)
- 3 CTAs Hotmart Lightbox (hero, seção intermediária, CTA final com `id="cta"`)
- Depoimentos reais (sem nomes dos autores)

#### `lp/essentia-v2.html` — v2 (otimizada para conversão)
- Framework AIDA: problema → transformação → autoridade → mecanismo → value stack → temas → para quem → depoimentos → **preço → FAQ → CTA final**
- **Padrão de CTA:** todos os botões são âncoras para `#investimento` — **apenas o botão dentro da seção `#investimento` abre o Hotmart Lightbox**
- Seção `#investimento` posicionada após depoimentos (prova social) e antes do FAQ (última objeção)
- Sticky CTA mobile (aparece após rolar além do hero)
- Numbers bar (dark background com 4 métricas)

#### `lp/essentia.html` — v3 (versão principal atual)
- **Não abre o Hotmart.** Os 2 botões "Começar agora" (card do hero e seção `#investimento`) são links para `../checkout/essentia.html`; os demais CTAs continuam ancorando em `#investimento`. A página não carrega `widget.min.js` nem tem modal de checkout em iframe — isso vive agora na página de pré-checkout
- Classe `.lp-btn-checkout` (antes `hotmart__button-checkout`) é o que dá `width: 100%` aos botões dentro do `.lp-preco-box`
- Idêntica à v2 com uma diferença estrutural no hero: **layout em 2 colunas**
  - Esquerda (`1fr`): texto do hero
  - Direita (`minmax(320px, 460px)`): card de investimento com botão de checkout
- O card do hero usa os mesmos estilos base `.lp-preco-*` do card da seção `#investimento`
- **⚠️ Atenção CSS:** usar `.lp-hero-content p` (não `.lp-hero p`) para estilos de texto do hero — evita vazamento de `color` e `font-size` para dentro do card
- `.lp-hero-card` sobrescreve **apenas cores** (herdadas do contexto escuro do hero); métricas de espaçamento e tipografia vêm dos estilos base
- **Tamanho único de botões:** regra `.btn, .btn-large { padding: 0.75rem 1.75rem; font-size: 0.95rem; }` no `<style>` inline padroniza todos os botões da página
- **Botões WhatsApp:** flutuante (`.lp-wa-float`, `position: fixed`, bottom-right) + in-card nos dois `.lp-preco-box`; usa decodificador inline (ver padrão acima)

#### Componente de preço `.lp-preco-box` (v2 e v3)
Card reutilizável compartilhado por todas as ocorrências nas LPs. Ao editar a aparência, editar os estilos base `.lp-preco-*` — não criar overrides por seção. Estrutura:
- `.lp-preco-inclui` + `.lp-preco-inclui-list` — lista de itens inclusos (bullets centralizados com `width: fit-content; margin: 0 auto`)
- `.lp-preco-parcela` — preço em destaque (fonte `4.5rem`, família secondary)
- `.lp-preco-parcela-info` — parcelamento
- `.lp-preco-avista` — valor à vista
- `.lp-preco-comparacao` — comparação de valor (`0.6rem`)
- `.lp-preco-garantia` — linha de garantia com ícone

### Pré-checkout — `checkout/essentia.html`

Etapa intermediária entre a LP e o pagamento: captura o lead **antes** do Hotmart, para que quem abandona o pagamento continue recuperável.

Fluxo: `/lp/essentia` → `/checkout/essentia` → pagamento Hotmart (iframe) → `/programas/essentia/bem-vinda`

- Caminho `checkout/` (1 nível — usa `../` para todos os paths). **Um arquivo por produto**: `checkout/essentia.html`, e no futuro `checkout/<programa>.html`
- Segue as mesmas convenções das LPs: `noindex, nofollow`, layout autônomo, estilos inline, sem `load-components.js` nem `phone-protection.js` (usa o decodificador inline de `data-phone`)
- Não está no `sitemap.xml` nem no `robots.txt` — depende só da meta `robots`, igual às LPs
- Prefixo de classes: `.ck-*`
- Duas seções: **1. Informações pessoais** (nome, telefone, e-mail + campo `produto` readonly com "Hinis Essentia") e **2. Pagamento** (aviso sobre a Hotmart + botão "Ir para pagamento" + link "O que é Hotmart?" que abre o popup `#ck-hotmart-modal`). Um `aside.ck-resumo` sticky mostra o resumo do pedido
- A página tem **dois modais independentes**: `#ck-pagamento-modal` (iframe do Hotmart, `z-index: 9999`) e `#ck-hotmart-modal` (popup explicativo, `z-index: 9998`). Um único handler de `Escape` fecha o que estiver aberto, dando prioridade ao de pagamento
- **Sem Turnstile** — decisão deliberada para não criar atrito no meio do funil de compra. Também sem rate limiting
- **Não usa `widget.min.js`.** O pagamento abre em `#ck-pagamento-modal`, um iframe próprio apontando para `pay.hotmart.com/M104765364P?checkoutMode=2` — em desktop e mobile. O iframe permite montar a URL dinamicamente com os dados já preenchidos
- Hotmart recebe `name`, `email` e `phonenumber` (`55` + dígitos) por query string, além de `src` com o `utm_source` quando existir
- Lead vai para o mesmo `GOOGLE_SHEETS_URL` do `form-handler.js` (constante duplicada no script inline), com `programa: 'Essentia'` para manter a planilha consistente com o resto do site. O payload envia `origem: 'checkout'`, que vai para a coluna `Origem` — o Apps Script também deduz pela presença de `/checkout/` no `landing_page` caso o campo não venha
- **Falha no envio do lead nunca bloqueia a compra** — o `fetch` tem `.catch()` e o modal de pagamento abre de qualquer forma
- Eventos no dataLayer: `begin_checkout` (no `<head>`, antes do GTM processar a fila), `generate_lead` + `add_payment_info` (no submit). Fecha o funil com o `purchase` de `bem-vinda.html`

### Página de obrigado — Essentia

- Caminho: `programas/essentia/bem-vinda.html` (2 níveis — usa `../../` para todos os paths)
- `noindex, nofollow` — não indexar no Google
- Dispara `event: 'purchase'` no dataLayer no `<head>`, antes do GTM processar a fila
- `transaction_id` lido via `URLSearchParams` a partir do parâmetro `?transaction=` gerado pelo Hotmart
- Configurar no painel Hotmart: Produto → Página de agradecimento → `https://www.hinis.com.br/programas/essentia/bem-vinda`

---

## SEO — checklist por página

Toda página deve ter:
- `<meta name="description">`, `keywords`, `author`, `robots`, `canonical`
- Open Graph (`og:type`, `og:url`, `og:title`, `og:description`, `og:image`)
- Twitter Cards
- Schema.org via `<script type="application/ld+json">`

Tipos de Schema por página:
- `index.html` → `Organization`
- `programas/essentia.html`, `refugium.html`, `amicae.html` → `Course`
- `quem-somos.html` → `Person`
- `faq.html` → `FAQPage`
- `contato.html` → `ContactPage`

CSP via `<meta http-equiv="Content-Security-Policy">` apenas nas páginas com formulário de contato (`index.html`, `contato.html`, `programas.html`, `programas/refugium.html`, `programas/amicae.html`).

---

## Bugs conhecidos em produção

Não replicar esses padrões. Estão registrados para correção futura:

1. `faq.html` — número WhatsApp exposto em plain text no `href` (fora do sistema `data-phone`)
2. `politica-privacidade.html` — usa número de telefone diferente do resto do site (+55 21 98860-2474 vs +55 21 99404-1648)
3. `assets/img/Hinis-home-retrato.png` — imagem existe mas não é referenciada em nenhuma página
4. **Apps Script v2.0.0 ainda não implantado** — `apps-script/Codigo.gs` está corrigido no repo, mas a `/exec` continua servindo o código antigo (responde `{"status":"ok"}` em vez de `"versao":"2.0.0"`)
5. **Máscara de telefone trata DDI como DDD** — quem digita `5521…` vira `(55) 21…` em `initTelefoneMask()` (`form-handler.js`) e no script inline do checkout. Suja a planilha e gera E.164 errado no `generate_lead`
6. **Falhas de envio são silenciosas** — `mode: 'no-cors'` torna a resposta opaca e o front assume sucesso. O Apps Script devolve `Access-Control-Allow-Origin: *`, então dá para trocar por `Content-Type: text/plain;charset=UTF-8` sem `no-cors` e ler o `{sucesso, mensagem}` de verdade
7. **Pré-preenchimento do Hotmart não validado** — `name`, `email` e `phonenumber` na query string de `pay.hotmart.com` nunca foram conferidos contra o checkout real
