# Hinis - Amor próprio incondicional

## Sobre o Projeto

Hinis é uma plataforma digital dedicada ao empoderamento feminino através do autocuidado e fortalecimento da autoestima. Criada pela Dra. Hexandra Hertel, cirurgiã plástica com mais de 20 anos de experiência, o projeto oferece uma abordagem integral que vai além da estética, focando no bem-estar emocional e físico das mulheres.

**Site**: https://hinis.com.br

### Gênero da marca
**Hinis é sempre feminino** — use "a Hinis", "da Hinis", "na Hinis". Nunca "o Hinis" ou "do Hinis".

### Missão
Elevar a autoestima feminina respeitando o tempo, a história e o corpo de cada mulher, oferecendo caminhos práticos e acessíveis para o autocuidado integral.

## Programas Oferecidos

### 1. **Essentia** - Você, no seu tempo
- Foco: Autocuidado integrado à rotina diária
- Formato: Digital com mentoria
- Componentes: Vídeos curtos, exercícios práticos, planner físico, mentoria individualizada

### 2. **Refugium** - De você, para você
- Foco: Experiência imersiva e sensorial
- Formato: Retiro presencial (turmas anuais, grupos pequenos)
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
- **Web3Forms** - Envio de formulários via API REST
- **Cloudflare Turnstile** - Proteção contra spam (validação frontend)
- **Google Sheets** - Armazenamento de leads via Apps Script
- **Google Analytics 4** - Monitoramento de conversões
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
│   └── amicae.html             # Programa Amicae
├── components/
│   ├── header.html             # Navegação reutilizável
│   ├── footer.html             # Rodapé reutilizável
│   └── form-contato.html       # Formulário reutilizável
├── css/
│   └── styles.css              # Estilos globais
├── js/
│   ├── config.js               # Access key Web3Forms
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
- **Email**: Web3Forms API (REST, JSON)
- **Leads**: Google Sheets via Apps Script (envio paralelo)
- **Anti-spam**: Cloudflare Turnstile (validação frontend) + campo honeypot
- **Analytics**: Google Analytics 4 (eventos customizados)

### Tipos de formulário
- **Inline** — usado na homepage, contato e programas (componente `form-contato.html`)
- **Popup modal** — usado em Refugium e Amicae, com programa pré-selecionado

### Funcionalidades
- Envio para Web3Forms API (email) e Google Sheets (lead) em paralelo
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
A access key do Web3Forms está em `js/config.js`:
```javascript
const CONFIG = {
    WEB3FORMS_ACCESS_KEY: 'sua-access-key-aqui'
};
```

A URL do Google Sheets Apps Script está em `js/form-handler.js` na constante `GOOGLE_SHEETS_URL`.

## Componentes Reutilizáveis

O projeto usa **arquitetura baseada em componentes** carregados via `load-components.js`:

- **Header** - Navegação responsiva com menu hambúrguer e dropdown
- **Footer** - Contato, links institucionais, copyright
- **Formulário** - Componente inline usado em index, programas e contato
- **Modal popup** - Formulário em popup nas páginas Refugium e Amicae (com programa pré-selecionado)

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
- **Telefone**: (21) 2266-2474
- **WhatsApp**: +55 21 99404-1648
- **Instagram**: [@drahexandrahertel](https://www.instagram.com/drahexandrahertel/)

---

© 2026 Hinis. Todos os direitos reservados.
