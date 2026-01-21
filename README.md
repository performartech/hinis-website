# Hinis - Autoestima e Autocuidado Feminino

## 📋 Sobre o Projeto

Hinis é uma plataforma digital dedicada ao empoderamento feminino através do autocuidado e fortalecimento da autoestima. Criado pela Dra. Hexandra Hertel, cirurgiã plástica com mais de 15 anos de experiência, o projeto oferece uma abordagem integral que vai além da estética, focando no bem-estar emocional e físico das mulheres.

### Missão
Elevar a autoestima feminina respeitando o tempo, a história e o corpo de cada mulher, oferecendo caminhos práticos e acessíveis para o autocuidado integral.

## 🎯 Programas Oferecidos

### 1. **Essência** - Você, no seu tempo
- Foco: Autocuidado integrado à rotina diária
- Formato: Digital
- Benefícios:
  - Maior clareza diante do espelho
  - Paz com a própria imagem
  - Hábitos que cabem no tempo real

### 2. **Clímax** - De você, para você
- Foco: Experiência imersiva e sensorial
- Formato: Retiro presencial em pequenos grupos
- Benefícios:
  - Ampliação do autoconhecimento
  - Fortalecimento da autoestima
  - Conexão entre autocuidado físico e emocional

### 3. **BFF (Bela Força Feminina)** - De você para elas. Delas para você
- Foco: Comunidade e rede de apoio
- Formato: Encontros online e presenciais
- Benefícios:
  - Sensação de pertencimento
  - Apoio em momentos de baixa
  - Inspiração para manter a rotina de autocuidado

## 🛠️ Tecnologias Utilizadas

- **HTML5** - Estrutura semântica e acessível
- **CSS3** - Estilização moderna com variáveis CSS e flexbox/grid
- **JavaScript (Vanilla)** - Interatividade e funcionalidades dinâmicas
- **Google Fonts** - Tipografia: Playfair Display (serifada) + Montserrat (sans-serif)

## 📁 Estrutura do Projeto

```
Hinis/
├── index.html              # Página principal
├── programas.html          # Visão geral dos programas
├── quem-somos.html         # História e valores
├── contato.html            # Formulário de contato
├── politica-privacidade.html  # Política LGPD
├── programas/
│   ├── essencia.html       # Detalhes do programa Essência
│   ├── climax.html         # Detalhes do programa Clímax
│   └── bff.html            # Detalhes do programa BFF
├── css/
│   └── styles.css          # Estilos globais
├── js/
│   └── script.js           # Scripts de interatividade
├── assets/
│   ├── logo/               # Logotipos e favicons
│   └── img/                # Imagens do site
├── sitemap.xml             # Mapa do site para SEO
├── robots.txt              # Diretrizes para crawlers
└── README.md               # Este arquivo
```

## 🎨 Design System

### Cores
- **Primary**: `#8B7355` - Tom terroso, transmite confiança e naturalidade
- **Secondary**: `#D4A574` - Tom dourado suave
- **Accent**: `#C9A88A` - Neutro acolhedor
- **Dark**: `#3A3A3A` - Texto principal
- **Light**: `#F8F6F4` - Fundo claro e suave
- **Text Color**: `#5A5A5A` - Texto secundário
- **Text Light**: `#7B7B7B` - Texto terciário

### Tipografia
- **Títulos**: Playfair Display (serifada, elegante)
- **Corpo**: Montserrat (sans-serif, legível)
- **Pesos**: 300, 400, 500, 600, 700

### Espaçamentos (Adaptativos com Clamp)
- **XS**: clamp(0.5rem, 1vw, 0.75rem)
- **SM**: clamp(1rem, 2vw, 1.5rem)
- **MD**: clamp(1.5rem, 3vw, 2rem)
- **LG**: clamp(2.5rem, 5vw, 4rem)
- **XL**: clamp(3rem, 6vw, 6rem)

### Touch Targets
- **Mínimo**: 44px (WCAG 2.1 AAA)
- Aplicado a: botões, links, inputs, select, textarea

## 🚀 Funcionalidades

### Navegação
- Menu responsivo com dropdown para programas
- Menu hambúrguer para dispositivos móveis com animação fluida
- Navegação suave entre seções com scroll otimizado
- Links ativos indicando página atual
- Suporte a touch events em dispositivos móveis
- Fechamento do menu com tecla ESC (acessibilidade)

### Seções Principais (Home)
1. **Hero** - Frase de impacto centralizada com tipografia fluida
2. **Três Caminhos** - Cards horizontais com ícones e navegação
3. **Nossos Programas** - Resumo visual com alternância de layout
4. **Depoimentos** - Carrossel automático com suporte a swipe gestures
5. **Newsletter** - Captura de e-mail com validação
6. **Footer** - Layout 4 colunas (logo, menu, programas, redes sociais) com ano dinâmico

### Interatividade
- Hover effects nos cards e botões
- Animações suaves de transição com GPU acceleration
- Formulários validados (HTML5 + JavaScript)
- Scroll suave para âncoras com requestAnimationFrame
- Carrossel de depoimentos com:
  - Autoplay (5 segundos)
  - Navegação por indicadores
  - Swipe gestures em touch
  - Navegação por teclado (setas)
  - Pausa automática em hover/focus
- Feedback tátil em botões mobile
- Prevenção de zoom duplo-toque em iOS

## 📱 Responsividade & Mobile

O site é totalmente responsivo com breakpoints para:
- **Desktop**: > 1024px
- **Tablet**: 768px - 1023px
- **Mobile**: < 767px
- **Mobile Pequeno**: < 380px
- **Landscape Mobile**: < 896px (orientação paisagem)

### Otimizações Mobile Implementadas
- **Tipografia Fluida**: Uso de `clamp()` para textos que se adaptam ao viewport
- **Touch Targets**: Mínimo de 44x44px (padrão Apple/Google WCAG 2.1 AAA)
- **GPU Acceleration**: Transform 3D para animações 60fps
- **Viewport Height Dinâmico**: Solução para problema de barra flutuante mobile
- **Touch Events Otimizados**: Detecção nativa de dispositivos touch
- **Scroll Performance**: RequestAnimationFrame com throttling
- **Lazy Loading**: Intersection Observer para imagens
- **Redução de Movimento**: Respeita preferência `prefers-reduced-motion`
- **Alto Contraste**: Suporte a `prefers-contrast: high`
- **Economia de Dados**: Suporte a `prefers-reduced-data`

## 🔍 SEO & Acessibilidade

### SEO
- Meta tags otimizadas (description, keywords, author)
- Open Graph tags para redes sociais
- Twitter Cards
- Structured Data (Schema.org)
- Sitemap.xml
- Robots.txt
- Links canônicos
- Hierarquia semântica de headings (H1-H6)

### Acessibilidade
- Atributos ARIA em elementos interativos
- Labels descritivos em formulários
- Contraste de cores adequado (WCAG AA)
- Navegação por teclado
- Textos alternativos em imagens (quando implementadas)

## 🔒 Privacidade & LGPD

O site está em conformidade com a LGPD (Lei Geral de Proteção de Dados), incluindo:
- Política de Privacidade detalhada
- Consentimento explícito para newsletters
- Transparência no uso de dados
- Direitos do titular claramente descritos

## 📊 Performance

### Otimizações Implementadas
- **Fonts**: Preconnect para Google Fonts com `font-display: swap`
- **CSS**: Organizado com variáveis, sem código redundante
- **JavaScript**: Vanilla (sem dependências externas), ~16KB
- **Scroll**: RequestAnimationFrame + throttling para 60fps
- **Animações**: GPU acceleration com `transform` e `will-change`
- **Imagens**: Lazy loading com Intersection Observer
- **Events**: Passive listeners onde apropriado
- **Mobile**: Detecção de hardware e ajuste de performance
- **Debounce/Throttle**: Em eventos frequentes (scroll, resize)

### Métricas Esperadas
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Lighthouse Mobile**: > 90
- **Scroll**: 60fps consistente

## 🎯 Públicos-Alvo

1. **Mulheres 35-60 anos** - Principais usuárias
2. **Profissionais ocupadas** - Buscam autocuidado prático
3. **Mulheres em transição** - Envelhecimento, mudanças de vida
4. **Comunidade feminina** - Apoio mútuo e solidariedade

## 📞 Contato

- **Website**: https://www.hinis.com.br
- **E-mail**: contato@hinis.com.br
- **Telefone**: (21) 98860-2474
- **WhatsApp**: (21) 98860-2474
- **Instagram**: [@drahexandrahertel](https://www.instagram.com/drahexandrahertel/)

## 👥 Equipe

**Fundadora e Criadora**: Dra. Hexandra Hertel
- Cirurgiã Plástica
- 15+ anos de experiência
- Especialista em autoestima feminina

## 📄 Licença

© 2025 Hinis. Todos os direitos reservados.

## 🔄 Versão & Changelog

**Versão atual**: 1.1.0 (Janeiro 2025)

### v1.1.0 - Janeiro 2025
- Otimizações mobile completas (touch targets, GPU acceleration, viewport dinâmico)
- Carrossel de depoimentos com autoplay e swipe gestures
- Footer redesenhado com 4 colunas e ano dinâmico
- Hero title otimizado para desktop
- Link Instagram atualizado em quem-somos
- Performance: scroll 60fps, lazy loading, passive events
- Acessibilidade: navegação por teclado, ARIA labels, preferências do usuário

### v1.0.0 - Dezembro 2024
- Lançamento inicial do website

---

**Desenvolvido com dedicação para empoderar mulheres através do autocuidado integral.**
