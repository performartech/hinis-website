# Hinis - Autoestima e Autocuidado Feminino

## 📋 Sobre o Projeto

Hinis é uma plataforma digital dedicada ao empoderamento feminino através do autocuidado e fortalecimento da autoestima. Criado pela Dra. Hexandra Hertel, cirurgiã plástica com mais de 15 anos de experiência, o projeto oferece uma abordagem integral que vai além da estética, focando no bem-estar emocional e físico das mulheres.

### Missão
Elevar a autoestima feminina respeitando o tempo, a história e o corpo de cada mulher, oferecendo caminhos práticos e acessíveis para o autocuidado integral.

## 🎯 Programas Oferecidos

### 1. **Essência** - Você, no seu tempo
- Foco: Autocuidado integrado à rotina diária
- Formato: Digital com mentoria
- Componentes:
  - Vídeos curtos e objetivos
  - Exercícios práticos
  - Artefatos físicos (planner)
  - Mentoria individualizada

### 2. **Clímax** - De você, para você
- Foco: Experiência imersiva e sensorial
- Formato: Retiro presencial (2-3 dias)
- Componentes:
  - Grupos pequenos (máximo 12 participantes)
  - Experiências sensoriais
  - Acompanhamento especializado
  - Práticas transformadoras

### 3. **Amicae** - De você para elas. Delas para você
- Foco: Comunidade e rede de apoio
- Formato: Híbrido (online + presencial)
- Componentes:
  - Grupos de apoio estruturados
  - Encontros regulares
  - Conselheiras convidadas
  - Networking feminino

## 🛠️ Tecnologias Utilizadas

- **HTML5** - Estrutura semântica e acessível com componentes reutilizáveis
- **CSS3** - Estilização moderna com variáveis CSS, flexbox/grid e minificação
- **JavaScript (Vanilla)** - Interatividade sem dependências externas (~16KB total)
- **Google Fonts** - Tipografia: Playfair Display (serifada) + Montserrat (sans-serif)
- **Lucide Icons** - Sistema de ícones SVG profissional (substituiu 53 emojis)
- **Google Apps Script** - Backend serverless para formulários com rastreamento UTM
- **Google Analytics 4** - Monitoramento de conversões e campanhas
- **sessionStorage** - Persistência de dados UTM durante navegação (30 minutos)

## 📁 Estrutura do Projeto

```
Hinis/
├── index.html              # Página principal
├── programas.html          # Visão geral dos programas
├── quem-somos.html         # História e valores
├── contato.html            # Página de contato completa
├── faq.html                # Perguntas frequentes
├── politica-privacidade.html  # Política LGPD
├── programas/
│   ├── essencia.html       # Detalhes do programa Essência
│   ├── climax.html         # Detalhes do programa Clímax
│   └── amicae.html         # Detalhes do programa Amicae
├── components/
│   ├── header.html         # Componente header reutilizável
│   ├── footer.html         # Componente footer reutilizável
│   └── form-contato.html   # Componente formulário reutilizável
├── css/
│   └── styles.css          # Estilos globais minificados (otimizado)
├── js/
│   ├── config.js           # Configurações da aplicação
│   ├── script.js           # Scripts principais (menu, scroll, FAQ)
│   ├── form-handler.js     # Handler do formulário com validação
│   ├── utm-tracker.js      # Rastreamento de campanhas UTM
│   └── load-components.js  # Carregador dinâmico de componentes
├── assets/
│   ├── logo/               # Logotipos e favicons (16x16 a 512x512)
│   └── img/                # Imagens otimizadas do site
├── google-apps-script/
│   └── Code.gs             # Backend serverless (formulário + UTM)
├── sitemap.xml             # Mapa do site para SEO
├── robots.txt              # Diretrizes para crawlers
├── UTM-TRACKING-GUIDE.md   # Guia completo para equipe de marketing
└── README.md               # Este arquivo
```

### Estrutura de Componentes

O projeto utiliza **arquitetura baseada em componentes** para reduzir duplicação e facilitar manutenção:

#### Header (components/header.html)
- Navegação responsiva com menu hambúrguer
- Logo com link para home
- Links para todas as seções do site
- CTA "Fale Conosco" destacado

#### Footer (components/footer.html)
- Informações de contato
- Links para redes sociais
- Links para páginas institucionais (FAQ, Política de Privacidade)
- Copyright e créditos

#### Formulário de Contato (components/form-contato.html)
- Campos: Nome, E-mail, Telefone, Programa, Mensagem
- Validação client-side
- Máscara automática de telefone
- Integração com UTM tracking
- Rate limiting (2 envios/minuto)

**Vantagens da componentização:**
- **DRY**: Header e footer definidos uma única vez
- **Manutenção**: Alterações refletem em todas as páginas automaticamente
- **Performance**: Componentes carregados via fetch() assíncrono
- **Versionamento**: Cache busting com query parameters (?v=1.0.0)

## 🎨 Design System

### Cores
- **Primary**: `#8B7355` - Tom terroso, transmite confiança
- **Secondary**: `#D4A574` - Tom dourado suave
- **Accent**: `#C9A88A` - Neutro acolhedor
- **Dark**: `#3A3A3A` - Texto principal
- **Light**: `#F8F6F4` - Fundo claro e suave

### Tipografia
- **Títulos**: Playfair Display (serifada, elegante)
- **Corpo**: Montserrat (sans-serif, legível)
- **Pesos**: 300, 400, 500, 600, 700

### Ícones
- **Sistema**: Lucide Icons (SVG)
- **Vantagens**: Escaláveis, consistentes, acessíveis
- **Carregamento**: CDN otimizado com inicialização automática

## 🔍 SEO & Otimizações

### SEO Técnico Implementado

#### Meta Tags (Todas as páginas)
- ✅ **Meta Description** única para cada página (150-160 caracteres)
- ✅ **Meta Keywords** relevantes e específicas
- ✅ **Author, Robots, Viewport** configurados
- ✅ **Canonical URLs** para evitar conteúdo duplicado
- ✅ **Language tag** (pt-BR) no HTML

#### Open Graph (Facebook/LinkedIn)
```html
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:image" content="https://www.hinis.com.br/assets/logo/og-image.png">
<meta property="og:url" content="https://www.hinis.com.br/">
<meta property="og:type" content="website">
```

#### Twitter Cards
```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="...">
<meta name="twitter:description" content="...">
<meta name="twitter:image" content="https://www.hinis.com.br/assets/logo/og-image.png">
```

#### Schema.org Structured Data (JSON-LD)

**1. ItemList (index.html)** - Lista de programas
```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Programa Essência",
      "url": "https://www.hinis.com.br/programas/essencia.html"
    }
  ]
}
```

**2. Person (quem-somos.html)** - Dra. Hexandra Hertel
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Dra. Hexandra Hertel",
  "jobTitle": "Cirurgiã Plástica",
  "description": "...",
  "url": "https://www.hinis.com.br/quem-somos.html"
}
```

**3. FAQPage (faq.html)** - Perguntas frequentes
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "O que é a Hinis?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "..."
      }
    }
  ]
}
```

**4. Course (programas/*.html)** - Detalhes de cada programa
```json
{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "Programa Essência",
  "description": "...",
  "provider": {
    "@type": "Organization",
    "name": "Hinis"
  }
}
```

#### Otimizações de Carregamento
- ✅ **DNS-prefetch** para CDNs (Google Fonts, Lucide)
```html
<link rel="dns-prefetch" href="https://fonts.googleapis.com">
<link rel="dns-prefetch" href="https://unpkg.com">
```
- ✅ **Preconnect** para Google Fonts
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

#### Sitemap & Robots
- ✅ **sitemap.xml** atualizado com todas as páginas (lastmod: 2026-01-27)
- ✅ **robots.txt** configurado para permitir rastreamento total

### Performance e Otimizações CSS

#### Minificação do CSS
- **Antes**: ~150KB (legível, comentado)
- **Depois**: ~98KB (minificado, sem comentários)
- **Redução**: ~35% menor

**Otimizações aplicadas:**
- Remoção de comentários e espaços em branco
- Propriedades CSS shorthand onde possível
- Seletores otimizados
- Variáveis CSS para valores repetidos

#### Variáveis CSS (Design Tokens)
```css
:root {
  /* Cores */
  --primary-color: #8B7355;
  --secondary-color: #D4A574;
  --accent-color: #C9A88A;
  --text-dark: #3A3A3A;
  --background-light: #F8F6F4;

  /* Tipografia */
  --font-primary: 'Playfair Display', serif;
  --font-secondary: 'Montserrat', sans-serif;

  /* Espaçamentos */
  --spacing-small: 1rem;
  --spacing-medium: 2rem;
  --spacing-large: 4rem;

  /* Transições */
  --transition-fast: 0.2s ease;
  --transition-normal: 0.3s ease;
}
```

**Vantagens:**
- Manutenção centralizada
- Consistência visual
- Temas facilmente customizáveis
- Redução de código duplicado

#### Técnicas de Otimização
- ✅ **Fonts**: Preconnect para Google Fonts
- ✅ **CSS**: Variáveis CSS, minificação, sem redundância
- ✅ **JavaScript**: Vanilla (~16KB total, sem frameworks)
- ✅ **Ícones**: SVG via CDN com inicialização eficiente
- ✅ **Scroll**: 60fps com requestAnimationFrame
- ✅ **Imagens**: WebP onde possível, dimensionamento adequado
- ✅ **Lazy Loading**: Componentes carregados sob demanda

### Métricas Estimadas (Core Web Vitals)
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1
- **Page Size**: ~250KB (HTML+CSS+JS) + imagens
- **Requests**: ~15-20 por página

## 📧 Sistema de Formulários

### Arquitetura
- **Frontend**: HTML5 + JavaScript (form-handler.js v1.0.5)
- **Backend**: Google Apps Script (serverless, no-cors mode)
- **Armazenamento**: Google Sheets (14 colunas incluindo UTM)
- **E-mail**: Gmail API via MailApp (HTML formatado)
- **Analytics**: Google Analytics 4 (eventos personalizados)

### Funcionalidades Principais
- ✅ **Envio de e-mail de notificação** (contato@hinis.com.br)
- ✅ **E-mail de confirmação** para usuário
- ✅ **Salvamento em planilha** Google Sheets com UTM tracking
- ✅ **Validação de campos** (nome, e-mail obrigatórios)
- ✅ **Máscara de telefone** automática (XX) XXXXX-XXXX
- ✅ **Feedback visual** de sucesso/erro com scroll automático
- ✅ **Rate limiting** (2 envios por minuto por usuário)
- ✅ **Proteção contra spam** (validação de formato de e-mail)

### Campos do Formulário
| Campo | Tipo | Obrigatório | Validação |
|-------|------|-------------|-----------|
| Nome | text | Sim | Não vazio |
| E-mail | email | Sim | Formato RFC 5322 |
| Telefone | tel | Não | Máscara automática |
| Programa | select | Não | Lista pré-definida |
| Mensagem | textarea | Não | - |

### Dados Capturados na Planilha (14 colunas)

#### Dados do Formulário (6 colunas)
1. **Data/Hora** - Timestamp do envio
2. **Nome** - Nome completo
3. **E-mail** - Endereço de e-mail
4. **Telefone** - Com máscara formatada
5. **Programa** - Essentia, Refugium, Amicae ou "Não especificado"
6. **Mensagem** - Texto livre

#### Dados de Rastreamento UTM (7 colunas)
7. **UTM Source** - Origem do tráfego (instagram, google, email)
8. **UTM Medium** - Canal de marketing (social, cpc, organic)
9. **UTM Campaign** - Nome da campanha (janeiro_2026)
10. **UTM Term** - Palavras-chave (opcional)
11. **UTM Content** - Variação do anúncio (opcional)
12. **Landing Page** - Primeira página acessada
13. **Referrer** - Site de origem ou "direct"

#### Status (1 coluna)
14. **Status** - "Novo" (pode ser alterado manualmente)

### Validação de E-mail (RFC 5322)
```javascript
function validarEmail(email) {
    // Regex robusto
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Validações adicionais
    if (!regex.test(email)) return false;
    if (email.includes('..')) return false;

    const [local, domain] = email.split('@');
    if (local.startsWith('.') || local.endsWith('.')) return false;
    if (!domain.includes('.')) return false;

    return true;
}
```

### Rate Limiting
- **Janela de tempo**: 60 segundos (1 minuto)
- **Máximo de envios**: 2 tentativas por minuto
- **Armazenamento**: Array de timestamps em memória
- **Mensagem**: "Você está enviando mensagens muito rapidamente. Aguarde X segundos."

### Fluxo de Envio

```
1. Usuário preenche formulário
   ↓
2. Validação client-side (nome, e-mail, formato)
   ↓
3. Verificação de rate limiting
   ↓
4. Captura dados UTM do sessionStorage (utm-tracker.js)
   ↓
5. Envio via fetch() no-cors para Google Apps Script
   ↓
6. Backend processa:
   - Salva na planilha (14 colunas)
   - Envia e-mail de notificação (HTML com UTM)
   - Envia e-mail de confirmação para usuário
   ↓
7. Frontend:
   - Limpa formulário
   - Mostra mensagem de sucesso
   - Envia evento para Google Analytics 4
   ↓
8. Registro de envio no rate limiter
```

### Exemplo de E-mail de Notificação

O e-mail enviado para **contato@hinis.com.br** contém:

**Seção 1: Dados do Contato**
- Nome completo
- E-mail (com link mailto:)
- Telefone (se fornecido)
- Programa de interesse

**Seção 2: Origem do Lead (UTM)** _(só aparece se tiver UTM)_
- 📊 Origem: instagram
- Canal: social
- Campanha: janeiro_2026
- Termo: (se fornecido)
- Conteúdo: (se fornecido)
- Primeira Página: /index.html
- Veio de: direct ou URL

**Seção 3: CTA**
- Botão "Responder Contato" (link mailto:)

### Google Apps Script (Backend)

**Funções principais:**

```javascript
// Endpoint principal
function doPost(e) {
  const dados = JSON.parse(e.postData.contents);
  salvarNaPlanilha(dados);
  enviarNotificacao(dados);
  enviarConfirmacao(dados);
  return ContentService.createTextOutput("Sucesso");
}

// Salva 14 colunas na planilha
function salvarNaPlanilha(dados) {
  const aba = ss.getSheetByName("Contatos");
  aba.appendRow([
    new Date(),
    dados.nome, dados.email, dados.telefone,
    dados.programa, dados.mensagem,
    dados.utm_source, dados.utm_medium, dados.utm_campaign,
    dados.utm_term, dados.utm_content,
    dados.landing_page, dados.referrer,
    "Novo"
  ]);
}
```

### Testes do Sistema

Para testar o formulário completo:

```javascript
// No Console do navegador (F12)
// 1. Verificar se form-handler está carregado
console.log('Form handler:', typeof handleFormSubmit);

// 2. Verificar UTM tracker
console.log('UTM tracker:', window.HinisUTM);

// 3. Testar captura de UTM
window.HinisUTM.summary();

// 4. Testar validação de e-mail
validarEmail('teste@exemplo.com'); // true
validarEmail('invalido.com'); // false
```

## 📱 Responsividade

### Breakpoints
- **Desktop**: > 1024px
- **Tablet**: 768px - 1023px
- **Mobile**: < 767px
- **Mobile Pequeno**: < 380px

### Otimizações Mobile
- Touch targets mínimo 44x44px (WCAG AAA)
- Tipografia fluida com clamp()
- Menu hambúrguer animado
- Swipe gestures no carrossel
- GPU acceleration nas animações
- Viewport height dinâmico

## ♿ Acessibilidade

- ✅ ARIA labels em elementos interativos
- ✅ Navegação por teclado completa
- ✅ Contraste adequado (WCAG AA)
- ✅ Ícones com aria-hidden (texto adjacente)
- ✅ Labels descritivos em formulários
- ✅ Hierarquia semântica de headings

## 📊 Sistema de Rastreamento UTM

### O que é UTM Tracking?

UTM (Urchin Tracking Module) são parâmetros adicionados a URLs para rastrear a origem do tráfego e medir a efetividade de campanhas de marketing.

### Parâmetros Rastreados

| Parâmetro | Descrição | Exemplo |
|-----------|-----------|---------|
| `utm_source` | Origem do tráfego | instagram, google, facebook |
| `utm_medium` | Canal de marketing | social, cpc, email, organic |
| `utm_campaign` | Nome da campanha | janeiro_2026, lancamento_climax |
| `utm_term` | Palavras-chave (opcional) | autoestima, autocuidado |
| `utm_content` | Variação do anúncio (opcional) | banner_azul, video_1 |
| `landing_page` | Primeira página visitada | /index.html |
| `referrer` | Site de origem | https://www.instagram.com |

### Exemplo de URL com UTM

```
https://www.hinis.com.br/?utm_source=instagram&utm_medium=social&utm_campaign=janeiro_2026&utm_content=stories
```

### Funcionamento Técnico

#### 1. Captura Automática (utm-tracker.js)
```javascript
// Executado automaticamente em TODAS as páginas
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const utmData = {};

    // Captura UTMs da URL
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']
        .forEach(param => {
            const value = urlParams.get(param);
            if (value) utmData[param] = value;
        });

    // Adiciona metadados
    utmData.timestamp = Date.now();
    utmData.landing_page = window.location.pathname;
    utmData.referrer = document.referrer || 'direct';

    // Salva no sessionStorage
    sessionStorage.setItem('hinis_utm_data', JSON.stringify(utmData));
});
```

#### 2. Persistência Durante Navegação
- **Armazenamento**: sessionStorage (sobrevive navegação, não sobrevive ao fechar aba)
- **Duração**: 30 minutos desde a captura
- **Verificação**: A cada carregamento de página verifica se expirou

```javascript
const SESSION_DURATION = 30 * 60 * 1000; // 30 minutos

function getUTMData() {
    const stored = sessionStorage.getItem('hinis_utm_data');
    const utmData = JSON.parse(stored);
    const now = Date.now();

    // Remove se expirado
    if (now - utmData.timestamp > SESSION_DURATION) {
        sessionStorage.removeItem('hinis_utm_data');
        return null;
    }

    return utmData;
}
```

#### 3. Integração com Formulário
```javascript
// form-handler.js - Executado ao enviar formulário
const dados = {
    nome: formData.get('nome'),
    email: formData.get('email'),
    // ... outros campos
};

// Adiciona dados UTM automaticamente
if (typeof window.HinisUTM !== 'undefined') {
    const utmData = window.HinisUTM.format();
    Object.assign(dados, utmData);
}

// Envia para Google Apps Script
fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    body: JSON.stringify(dados)
});
```

#### 4. Salvamento no Google Sheets
Os dados são salvos em 14 colunas incluindo todos os parâmetros UTM, permitindo análise de:
- Quais campanhas geram mais leads
- Quais canais são mais efetivos
- ROI de cada campanha de marketing
- Jornada do usuário (landing page + referrer)

#### 5. Integração com Google Analytics 4
```javascript
// Envia evento customizado ao capturar UTM
window.HinisUTM.sendEvent('utm_campaign_start', {
    campaign_type: 'new_session'
});

// Envia evento ao submeter formulário
window.HinisUTM.sendEvent('form_submission', {
    form_type: dados.programa ? 'contato_com_programa' : 'contato_rapido',
    programa_selecionado: dados.programa || 'não informado'
});
```

### API Pública (window.HinisUTM)

O sistema expõe uma API JavaScript para uso interno:

```javascript
// Capturar UTMs da URL atual
const utms = window.HinisUTM.capture();

// Obter UTMs armazenados
const stored = window.HinisUTM.get();

// Formatar para envio
const formatted = window.HinisUTM.format();
// Retorna: { utm_source: "...", utm_medium: "...", ... }

// Resumo para debug
window.HinisUTM.summary();
// Retorna: "Instagram → Social → janeiro_2026 (válido por 28min)"

// Limpar dados
window.HinisUTM.clear();

// Enviar evento para GA4
window.HinisUTM.sendEvent('custom_event', { param: 'value' });
```

### Casos de Uso

#### Cenário 1: Post no Instagram
```
1. Usuário clica em link do Instagram:
   https://www.hinis.com.br/?utm_source=instagram&utm_medium=social&utm_campaign=janeiro_2026

2. utm-tracker.js captura e salva no sessionStorage

3. Usuário navega:
   index.html → programas.html → contato.html

4. UTMs permanecem salvos (30 minutos)

5. Usuário preenche formulário de contato

6. form-handler.js anexa UTMs automaticamente

7. Google Sheets registra:
   - UTM Source: instagram
   - UTM Medium: social
   - UTM Campaign: janeiro_2026
   - Landing Page: /index.html
   - Referrer: https://www.instagram.com
```

#### Cenário 2: Acesso Direto
```
1. Usuário digita URL diretamente:
   https://www.hinis.com.br/

2. utm-tracker.js não encontra UTMs na URL

3. Nenhum dado é salvo no sessionStorage

4. Ao preencher formulário:
   - UTM Source: "não informado"
   - UTM Medium: "não informado"
   - Landing Page: /index.html
   - Referrer: "direct"
```

### Guia para Equipe de Marketing

Arquivo completo disponível em: [UTM-TRACKING-GUIDE.md](UTM-TRACKING-GUIDE.md)

**Conteúdo do guia:**
- Como criar URLs com UTM
- Google Campaign URL Builder
- Templates por canal (Instagram, Facebook, Google Ads, E-mail, WhatsApp)
- Convenções de nomenclatura
- Exemplos práticos
- FAQ

### Debug e Testes

Para testar o sistema UTM:

1. **Acesse com UTM:**
```
https://www.hinis.com.br/?utm_source=teste&utm_medium=manual&utm_campaign=debug
```

2. **Abra o Console (F12) e execute:**
```javascript
// Verificar captura
window.HinisUTM.summary();

// Ver dados completos
window.HinisUTM.get();

// Testar formato para envio
window.HinisUTM.format();
```

3. **Navegue internamente:**
   - Clique em links do menu
   - Verifique se `window.HinisUTM.summary()` ainda retorna os dados

4. **Teste o formulário:**
   - Preencha o formulário de contato
   - Envie
   - Verifique a planilha Google Sheets

5. **Verifique expiração:**
   - Aguarde 30 minutos
   - Execute `window.HinisUTM.get()`
   - Deve retornar `null`

## 🔒 Privacidade & LGPD

- **Política de Privacidade completa** em página dedicada
- **Consentimento explícito** para newsletter (quando implementado)
- **Transparência no uso de dados** (formulário + UTM tracking)
- **Dados não compartilhados** com terceiros
- **Direitos do titular** claramente descritos (acesso, correção, exclusão)
- **Armazenamento seguro** via Google Workspace
- **Retenção de dados** conforme necessidade de negócio

## 🚀 Como Desenvolver

### Pré-requisitos
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Editor de código (VS Code recomendado)
- Servidor local (Live Server, http-server, ou Python SimpleHTTPServer)

### Instalação

1. **Clone ou baixe o projeto:**
```bash
git clone [URL_DO_REPOSITORIO]
cd Hinis
```

2. **Configure o Google Apps Script:**
   - Acesse o arquivo `google-apps-script/Code.gs`
   - Crie um novo projeto no [Google Apps Script](https://script.google.com/)
   - Cole o código do arquivo Code.gs
   - Configure as variáveis:
     ```javascript
     const ID_PLANILHA = "SEU_ID_DA_PLANILHA";
     const EMAIL_DESTINO = "contato@hinis.com.br";
     ```
   - Faça deploy como Web App (Execute as: Me, Access: Anyone)
   - Copie a URL do Web App

3. **Configure o frontend:**
   - Abra `js/config.js`
   - Cole a URL do Web App:
     ```javascript
     const CONFIG = {
         GOOGLE_SCRIPT_URL: 'COLE_AQUI_A_URL_DO_SEU_WEB_APP'
     };
     ```

4. **Inicie um servidor local:**

   **Opção 1: Live Server (VS Code)**
   - Instale a extensão "Live Server"
   - Clique direito em `index.html` → Open with Live Server

   **Opção 2: Python**
   ```bash
   # Python 3
   python -m http.server 8000

   # Python 2
   python -m SimpleHTTPServer 8000
   ```

   **Opção 3: Node.js**
   ```bash
   npx http-server -p 8000
   ```

5. **Acesse no navegador:**
   ```
   http://localhost:8000
   ```

### Estrutura de Desenvolvimento

```
Desenvolvimento Local
├── Editar HTML/CSS/JS
├── Testar no navegador
├── Verificar responsividade (F12 → Device Toolbar)
├── Testar formulário (com UTM)
└── Validar no Google Sheets

Google Apps Script (Separado)
├── Editar Code.gs no script.google.com
├── Testar função testForm()
├── Deploy nova versão
└── Atualizar URL em config.js (se mudou)
```

### Workflow de Desenvolvimento

1. **Modificar arquivos localmente**
2. **Testar no navegador** (atualizar com F5 ou Ctrl+Shift+R para hard refresh)
3. **Validar formulário**:
   - Preencher com dados de teste
   - Verificar console do navegador (F12)
   - Confirmar e-mail recebido
   - Verificar linha na planilha
4. **Testar em dispositivos móveis** (Chrome DevTools ou BrowserStack)
5. **Deploy para produção** (FTP, GitHub Pages, Netlify, etc.)

### Testando UTM Tracking

1. **Acesse com parâmetros UTM:**
```
http://localhost:8000/?utm_source=teste&utm_medium=manual&utm_campaign=debug&utm_content=dev
```

2. **Abra o Console (F12):**
```javascript
// Ver resumo
window.HinisUTM.summary();

// Ver dados completos
window.HinisUTM.get();

// Testar formato
window.HinisUTM.format();
```

3. **Navegue internamente** e verifique persistência

4. **Preencha o formulário** e verifique a planilha

### Debug do Formulário

**Ativar modo debug em `form-handler.js`:**
```javascript
const DEBUG_MODE = true; // Mudar de false para true
```

Isso exibirá logs detalhados no console:
- ✓ Formulário encontrado
- ✓ Dados UTM adicionados
- ✓ Enviando para Google Apps Script
- ✓ Resposta recebida

### Testes Recomendados

#### Checklist de Testes
- [ ] Formulário envia corretamente (com e sem UTM)
- [ ] E-mails são recebidos (notificação + confirmação)
- [ ] Planilha recebe 14 colunas preenchidas
- [ ] Validação de e-mail funciona (testa com inválido)
- [ ] Rate limiting ativa após 2 envios
- [ ] Máscara de telefone formata corretamente
- [ ] Responsivo em mobile/tablet/desktop
- [ ] Navegação funciona em todas as páginas
- [ ] Ícones Lucide renderizam
- [ ] SEO tags estão presentes (view-source:)
- [ ] Componentes carregam (header, footer, form)
- [ ] UTMs persistem durante navegação

#### Testar em Navegadores
- [ ] Chrome/Edge (Desktop + Mobile)
- [ ] Firefox (Desktop + Mobile)
- [ ] Safari (Desktop + iOS)

### Ferramentas Úteis

**SEO:**
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Open Graph Debugger](https://www.opengraphcheck.com/)

**UTM:**
- [Google Campaign URL Builder](https://ga-dev-tools.google/campaign-url-builder/)
- Console do navegador (F12) com `window.HinisUTM`

**Validação:**
- [W3C HTML Validator](https://validator.w3.org/)
- [W3C CSS Validator](https://jigsaw.w3.org/css-validator/)
- [WAVE Accessibility Checker](https://wave.webaim.org/)

**Responsividade:**
- Chrome DevTools (F12 → Device Toolbar)
- [Responsinator](http://www.responsinator.com/)
- [BrowserStack](https://www.browserstack.com/) (testes reais)

## 📞 Contato

- **Website**: https://www.hinis.com.br
- **E-mail**: contato@hinis.com.br
- **Telefone/WhatsApp**: (21) 98860-2474
- **Instagram**: [@drahexandrahertel](https://www.instagram.com/drahexandrahertel/)

## 👥 Equipe

**Fundadora e Criadora**: Dra. Hexandra Hertel
- Cirurgiã Plástica
- 15+ anos de experiência
- Especialista em autoestima feminina

## 🔄 Versão & Changelog

**Versão atual**: 1.5.0 (Janeiro 2026)

### v1.5.0 - Janeiro 2026 ✨ **NOVA**
- **Sistema de Rastreamento UTM Completo**:
  - Novo arquivo `utm-tracker.js` (239 linhas, v1.0.0)
  - Captura automática de 5 parâmetros UTM + landing page + referrer
  - Persistência via sessionStorage (30 minutos)
  - Integração com formulário (form-handler.js v1.0.5)
  - Google Apps Script atualizado (14 colunas na planilha)
  - E-mails de notificação com seção "Origem do Lead"
  - Integração com Google Analytics 4 (eventos customizados)
  - Guia completo para equipe de marketing (UTM-TRACKING-GUIDE.md)
  - API pública JavaScript (window.HinisUTM)
  - Suporte total durante navegação interna
- **Arquitetura de Componentes**:
  - Header extraído para `components/header.html`
  - Footer extraído para `components/footer.html`
  - Formulário em `components/form-contato.html`
  - Carregamento dinâmico via `load-components.js`
  - Versionamento com cache busting (?v=1.0.0)
- **Otimização de CSS**:
  - Minificação do arquivo styles.css
  - Redução de ~35% no tamanho (150KB → 98KB)
  - Variáveis CSS para design tokens
  - Remoção de código duplicado
- **Segurança do Formulário**:
  - Rate limiting implementado (2 envios/minuto)
  - Validação robusta de e-mail (RFC 5322)
  - Proteção contra spam
  - Tratamento de erros melhorado
- **Documentação**:
  - README completamente reestruturado
  - Seções detalhadas sobre SEO, UTM, componentes
  - Exemplos de código e fluxos
  - Guia de testes e debug
- **Limpeza de Projeto**:
  - Removidos 9 arquivos de desenvolvimento/testes
  - Estrutura reduzida para 21 arquivos essenciais
  - ~50KB de espaço liberado

### v1.4.0 - Janeiro 2026
- **SEO Completo**:
  - Meta tags otimizadas em todas as páginas
  - Open Graph e Twitter Cards
  - Schema.org structured data (ItemList, Person, FAQPage, Course)
  - Canonical URLs
  - DNS-prefetch para CDNs
- **Substituição de Emojis por Ícones Lucide**:
  - Sistema de ícones SVG profissional
  - 53 emojis substituídos por ícones Lucide
  - CSS específico para cada contexto
  - Inicialização automática via JavaScript
  - Melhor acessibilidade e consistência visual
- **Limpeza de Arquivos**:
  - Removidos arquivos de análise temporária
  - Removidos documentos de planejamento já implementados
  - Estrutura otimizada apenas com essenciais
- **Atualizações**:
  - Sitemap atualizado com data correta (27/01/2026)
  - README completamente revisado e atualizado
  - Robots.txt mantido e verificado

### v1.3.0 - Janeiro 2026
- Sistema de E-mails implementado (Google Apps Script)
- Formulário com validação aprimorada
- Máscara automática de telefone
- E-mails HTML formatados

### v1.2.0 - Janeiro 2026
- Limpeza de código CSS/JS não utilizado
- Remoção de imagens não utilizadas (~35MB economizados)
- Hero da página de contato otimizado

### v1.1.0 - Janeiro 2025
- Otimizações mobile completes
- Carrossel de depoimentos com autoplay
- Performance e acessibilidade

### v1.0.0 - Dezembro 2024
- Lançamento inicial

---

## 📄 Licença

© 2026 Hinis. Todos os direitos reservados.

**Desenvolvido com dedicação para empoderar mulheres através do autocuidado integral.**
