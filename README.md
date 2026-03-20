# Hinis - Autoestima e Autocuidado Feminino

## Sobre o Projeto

Hinis é uma plataforma digital dedicada ao empoderamento feminino através do autocuidado e fortalecimento da autoestima. Criado pela Dra. Hexandra Hertel, cirurgiã plástica com mais de 20 anos de experiência, o projeto oferece uma abordagem integral que vai além da estética, focando no bem-estar emocional e físico das mulheres.

**Site**: https://hinis.com.br

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
│   ├── script.js               # Menu, scroll, FAQ, carrossel
│   ├── form-handler.js         # Envio e validação do formulário
│   ├── load-components.js      # Carregador dinâmico de componentes
│   ├── utm-tracker.js          # Rastreamento UTM
│   └── phone-protection.js     # Proteção de telefones (Base64)
├── assets/
│   ├── logo/                   # Logotipos e favicons
│   └── img/                    # Imagens do site
├── sitemap.xml                 # Mapa do site para SEO
├── robots.txt                  # Diretrizes para crawlers
└── UTM-TRACKING-GUIDE.md       # Guia de marketing UTM
```

## Sistema de Formulários

### Arquitetura
- **Frontend**: HTML5 + JavaScript (form-handler.js)
- **Backend**: Web3Forms API (REST, JSON)
- **Honeypot**: Campo `botcheck` oculto para proteção contra spam
- **Analytics**: Google Analytics 4 (eventos customizados)

### Funcionalidades
- Envio via Web3Forms API (`https://api.web3forms.com/submit`)
- Validação de e-mail (RFC 5322), telefone (mínimo 10 dígitos) e campos obrigatórios
- Máscara automática de telefone (XX) XXXXX-XXXX
- Rate limiting (2 envios por minuto)
- Feedback visual de sucesso/erro com scroll automático
- Integração com UTM tracking

### Campos
| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| Nome | text | Sim |
| E-mail | email | Sim |
| Telefone | tel | Sim |
| Programa | select | Sim |

### Configuração
A access key do Web3Forms está em `js/config.js`:
```javascript
const CONFIG = {
    WEB3FORMS_ACCESS_KEY: 'sua-access-key-aqui'
};
```

## Componentes Reutilizáveis

O projeto usa **arquitetura baseada em componentes** carregados via `load-components.js`:

- **Header** - Navegação responsiva com menu hambúrguer e dropdown
- **Footer** - Contato, links institucionais, copyright
- **Formulário** - Componente único usado em index, programas e contato

Os componentes são carregados via `fetch()` assíncrono. Um fallback inline existe para protocolo `file://`.

## SEO

- Meta tags (description, keywords, author, robots, canonical) em todas as páginas
- Open Graph e Twitter Cards
- Schema.org structured data (ItemList, Person, FAQPage, Course)
- DNS-prefetch e preconnect para CDNs
- sitemap.xml e robots.txt

## Rastreamento UTM

O `utm-tracker.js` captura automaticamente parâmetros UTM da URL, persiste em `sessionStorage` por 30 minutos e injeta nos envios do formulário.

Parâmetros: `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `landing_page`, `referrer`.

Guia completo para marketing: [UTM-TRACKING-GUIDE.md](UTM-TRACKING-GUIDE.md)

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
- **WhatsApp**: +55 21 99404-1648
- **Instagram**: [@drahexandrahertel](https://www.instagram.com/drahexandrahertel/)

---

© 2026 Hinis. Todos os direitos reservados.
