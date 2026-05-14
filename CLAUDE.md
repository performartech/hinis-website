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

- **Hinis é sempre feminino:** "a Hinis", "da Hinis", "na Hinis" — nunca "o Hinis"
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
| Telefone fixo | (21) 2266-2474 | — (exibido em plain text no contato.html — aceitável) |

---

## Sistema de formulários

- Envio exclusivamente via **Google Sheets Apps Script** (Web3Forms foi removido)
- URL Google Sheets Apps Script: constante `GOOGLE_SHEETS_URL` em `js/form-handler.js`
- Envio usa `mode: 'no-cors'` — resposta é opaca; sucesso é tratado de forma otimista (erro de rede lança exception e exibe mensagem de erro)
- **Nunca remover a flag `turnstileRendered`** em `form-handler.js` — ela impede duplicação do widget Turnstile em componentes carregados dinamicamente
- Turnstile usa `render=explicit` com callback `onload=onTurnstileLoad` na tag de script
- Rate limiting em memória (2 envios/minuto) — não migrar para localStorage
- `js/config.js` está vazio — não referenciar mais nas páginas HTML

---

## Componentes e paths

- Componentes reutilizáveis em `components/`: `header.html`, `footer.html`, `form-contato.html`
- Carregados via `fetch()` por `js/load-components.js`; fallback inline apenas para `form-contato`
- Páginas em `programas/` usam `../` para assets e scripts — `getBasePath()` em `load-components.js` faz o ajuste automaticamente
- Ao criar nova página em `programas/`, verificar todos os paths (`../css/`, `../js/`, `../assets/`)

---

## CTAs por programa

| Programa | CTA | Mecanismo |
|----------|-----|-----------|
| Essentia | Botão → Hotmart | Link direto (sem formulário na página) |
| Refugium | Botão → modal popup | `data-open-modal="formModal"`, programa pré-selecionado no `<select>` |
| Amicae | Botão → modal popup | `data-open-modal="formModal"`, programa pré-selecionado no `<select>` |

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

1. `programas/amicae.html` — OG image aponta para `Amicae - retrato.png` (arquivo não existe); correto é `BFF - retrato.png`
2. `faq.html` — número WhatsApp exposto em plain text no `href` (fora do sistema `data-phone`)
3. `politica-privacidade.html` — usa número de telefone diferente do resto do site (+55 21 98860-2474 vs +55 21 99404-1648)
4. `politica-privacidade.html` — contém o placeholder `[Endereço da sede]` visível em produção
5. `assets/img/Hinis-home-retrato.png` — imagem existe mas não é referenciada em nenhuma página
