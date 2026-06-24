# Hinis - Amor próprio incondicional

## Sobre o Projeto

Hinis é uma plataforma digital dedicada ao empoderamento feminino através do autocuidado e fortalecimento da autoestima. Criada pela Dra. Hexandra Hertel, cirurgiã plástica com mais de 20 anos de experiência, o projeto oferece uma abordagem integral que vai além da estética, focando no bem-estar emocional e físico das mulheres.

**Site**: https://hinis.com.br

### Gênero da marca
**Hinis é sempre feminino** — use "a Hinis", "da Hinis", "na Hinis", "pela Hinis". Nunca "o Hinis", "do Hinis" ou "no Hinis". A concordância verbal e adjetival também deve ser feminina: "a Hinis está comprometida" (não "comprometido"), "a Hinis nasceu" (não "o Hinis nasceu").

### Missão
Elevar a autoestima feminina respeitando o tempo, a história e o corpo de cada mulher, oferecendo caminhos práticos e acessíveis para o autocuidado integral.

## Programas Oferecidos

### 1. **Essentia** - Você, no seu tempo
- Foco: Autocuidado integrado à rotina diária
- Formato: Digital (acesso vitalício, duração sugerida de 8 semanas)
- Componentes: Conteúdos em vídeo, exercícios versáteis, book digital
- Venda: Hotmart Lightbox (checkout transparente embutido no site via widget)
- Produto Hotmart: `M104765364P`
- Pós-compra: redireciona para `/programas/essentia/bem-vinda` com evento `purchase` no dataLayer

### 2. **Refugium** - De você, para você
- Foco: Experiência imersiva e sensorial
- Formato: Retiro presencial (turmas semestrais, grupos pequenos)
- Componentes: Experiências sensoriais, acompanhamento especializado, práticas transformadoras

### 3. **Amicae** - De você para elas. Delas para você
- Foco: Comunidade e rede de apoio
- Formato: Híbrido (online + presencial)
- Componentes: Grupos de apoio, encontros regulares, conselheiras convidadas, networking feminino

## Tecnologias

- **HTML5** - Estrutura semântica com componentes reutilizáveis
- **CSS3** - Variáveis CSS, flexbox/grid, design responsivo
- **JavaScript (Vanilla)** - Interatividade sem dependências externas
- **Google Fonts** - Playfair Display + Montserrat
- **Lucide Icons** - Ícones SVG via CDN
- **Cloudflare Turnstile** - Proteção contra spam (validação frontend)
- **Google Sheets** - Armazenamento de leads via Apps Script
- **Google Tag Manager** - Gerenciamento de tags (GTM-WMKVWGKF)
- **Google Analytics 4** - Monitoramento de tráfego e conversões (G-QEBQDXDXLV)
- **Hotmart** - Plataforma de venda do programa Essentia (Lightbox embutido)
- **Cloudflare Pages** - Hospedagem e CDN

## Estrutura do Projeto

```
Hinis/
├── index.html                  # Homepage
├── programas.html              # Visão geral dos programas
├── quem-somos.html             # História e valores
├── contato.html                # Página de contato
├── faq.html                    # Perguntas frequentes
├── politica-privacidade.html   # Política LGPD
├── programas/
│   ├── essentia.html           # Programa Essentia
│   ├── refugium.html           # Programa Refugium
│   ├── amicae.html             # Programa Amicae
│   └── essentia/
│       └── bem-vinda.html      # Página de obrigado pós-compra (noindex)
├── lp/
│   ├── essentia.html           # LP principal (v3) — hero em 2 colunas com card de preço à direita
│   ├── essentia-v2.html        # LP v2 — otimizada para conversão, CTAs âncora para #investimento
│   └── essentia-v0.html        # LP v0 (original, legado)
├── components/
│   ├── header.html             # Navegação reutilizável
│   ├── footer.html             # Rodapé reutilizável
│   └── form-contato.html       # Formulário reutilizável
├── css/
│   └── styles.css              # Estilos globais
├── js/
│   ├── config.js               # Arquivo vazio (não referenciar nas páginas HTML)
│   ├── script.js               # Menu, scroll, FAQ, carrossel, modal popup
│   ├── form-handler.js         # Envio e validação do formulário
│   ├── load-components.js      # Carregador dinâmico de componentes
│   ├── utm-tracker.js          # Rastreamento UTM, gclid e fbclid
│   └── phone-protection.js     # Proteção de telefones (Base64)
├── assets/
│   ├── logo/                   # Logotipos e favicons
│   └── img/                    # Imagens do site
├── sitemap.xml                 # Mapa do site para SEO
└── robots.txt                  # Diretrizes para crawlers
```

## Sistema de Formulários

### Arquitetura
- **Frontend**: HTML5 + JavaScript (form-handler.js)
- **Leads**: Google Sheets via Apps Script (único destino de envio)
- **Anti-spam**: Cloudflare Turnstile (validação frontend)
- **Analytics**: Google Analytics 4 + GTM (eventos customizados, Enhanced Conversions e Meta Advanced Matching via dataLayer)

### Tipos de formulário
- **Inline** — usado na homepage, contato e programas (componente `form-contato.html`)
- **Popup modal** — usado em Refugium e Amicae, com programa pré-selecionado

### Funcionalidades
- Envio para Google Sheets via Apps Script
- Cloudflare Turnstile como validação anti-bot no frontend
- Validação de e-mail, telefone (mínimo 10 dígitos) e campos obrigatórios
- Máscara automática de telefone (XX) XXXXX-XXXX
- Rate limiting (2 envios por minuto)
- Feedback visual de sucesso/erro com scroll automático
- Captura automática de UTMs, gclid, fbclid, landing page e referrer

### Campos
| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| Nome | text | Sim |
| E-mail | email | Sim |
| Telefone | tel | Sim |
| Programa | select | Sim |

### Dados salvos na planilha
| Coluna | Origem |
|--------|--------|
| Data/Hora | Gerada no envio (fuso São Paulo) |
| Nome, Email, Telefone, Programa | Campos do formulário |
| Landing Page | URL completa da página de conversão |
| Referrer | Página anterior ou "direct" |
| utm_source/medium/campaign/term/content | Parâmetros UTM da URL |
| gclid | Google Ads click ID |
| fbclid | Facebook/Meta click ID |

### Configuração
A URL do Google Sheets Apps Script está em `js/form-handler.js` na constante `GOOGLE_SHEETS_URL`.

## Componentes Reutilizáveis

O projeto usa **arquitetura baseada em componentes** carregados via `load-components.js`:

- **Header** - Navegação responsiva com menu hambúrguer e dropdown
- **Footer** - Links institucionais, redes sociais, disclaimer legal, dados empresariais (Razão Social, CNPJ, endereço), copyright
- **Formulário** - Componente inline usado em index, programas e contato
- **Modal popup** - Formulário em popup nas páginas Refugium e Amicae (com programa pré-selecionado)
- **Badge do hero clicável** - Nas 3 páginas de programa, o badge no topo da hero leva diretamente à seção de conversão (`#cta`)

Os componentes são carregados via `fetch()` assíncrono. Um fallback inline existe para protocolo `file://`.

## SEO

- Meta tags (description, keywords, author, robots, canonical) em todas as páginas
- Open Graph e Twitter Cards
- Schema.org structured data (ItemList, Person, FAQPage, Course)
- DNS-prefetch e preconnect para CDNs
- sitemap.xml e robots.txt

## Rastreamento UTM

O `utm-tracker.js` captura automaticamente parâmetros de marketing da URL, persiste em `sessionStorage` por 30 minutos e injeta nos envios do formulário.

Parâmetros capturados: `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `gclid`, `fbclid`, `landing_page`, `referrer`.


## Responsividade

- **Desktop**: > 1024px | **Tablet**: 768-1023px | **Mobile**: < 767px
- Touch targets mínimo 44x44px (WCAG)
- Tipografia fluida com `clamp()`
- Menu hambúrguer com suporte a gestos
- Swipe no carrossel de depoimentos

## Hospedagem

- **Repositório**: GitHub (performartech/hinis-website)
- **Deploy**: Cloudflare Pages (integração automática com GitHub)
- **Domínio**: hinis.com.br (DNS no Cloudflare)
- **SSL**: Automático via Cloudflare

## Como Desenvolver

1. Clone o repositório:
```bash
git clone https://github.com/performartech/hinis-website.git
cd hinis-website
```

2. Inicie um servidor local:
```bash
# VS Code: extensão Live Server
# Python: python -m http.server 8000
# Node: npx http-server -p 8000
```

3. Acesse `http://localhost:8000`

4. Para deploy: push para `main` — Cloudflare Pages faz o build automaticamente.

## Contato

- **Website**: https://hinis.com.br
- **E-mail**: contato@hinis.com.br
- **Telefone**: (21) 2244-2474
- **WhatsApp**: +55 21 99404-1648
- **Instagram**: [@drahexandrahertel](https://www.instagram.com/drahexandrahertel/)

## Pendências conhecidas

- **Número de telefone inconsistente**: `politica-privacidade.html` usa +55 21 98860-2474 (ofuscado em Base64 `KzU1MjE5ODg2MDI0NzQ=`) enquanto o restante do site usa +55 21 99404-1648. Verificar qual é o correto.
- **Telefone exposto no FAQ**: `faq.html` tem o número WhatsApp hardcoded no href (`wa.me/5521994041648`) sem usar o sistema de proteção Base64 (`data-phone` + `phone-protection.js`).
- **Imagem órfã**: `assets/img/Hinis-home-retrato.png` existe mas não é referenciada em nenhuma página.

---

© 2026 Hinis. Todos os direitos reservados.
