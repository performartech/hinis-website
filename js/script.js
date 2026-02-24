// =========================================
// MENU MOBILE TOGGLE
// =========================================

document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle && navMenu) {
        // Otimização: usar touch events em dispositivos móveis
        const eventType = ('ontouchstart' in window) ? 'touchstart' : 'click';

        menuToggle.addEventListener(eventType, function(e) {
            // Prevenir comportamento padrão em touch
            if (eventType === 'touchstart') {
                e.preventDefault();
            }

            navMenu.classList.toggle('active');
            const isExpanded = navMenu.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', isExpanded);

            // Animação do ícone hambúrguer
            menuToggle.classList.toggle('active');

            // Prevenir scroll do body quando menu está aberto (mobile)
            if (isExpanded) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        }, { passive: eventType !== 'touchstart' });

        // Fechar menu ao clicar em um link (exceto se tiver dropdown)
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const parent = this.parentElement;

                // Se o link tem dropdown em mobile, toggle ao invés de fechar
                if (parent.classList.contains('nav-item-dropdown') && window.innerWidth <= 768) {
                    e.preventDefault();
                    parent.classList.toggle('active');
                } else if (!parent.classList.contains('nav-item-dropdown')) {
                    navMenu.classList.remove('active');
                    menuToggle.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });

        // Fechar menu ao clicar em link do dropdown
        const dropdownLinks = document.querySelectorAll('.dropdown-link');
        dropdownLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                // Fechar dropdown também
                document.querySelectorAll('.nav-item-dropdown').forEach(item => {
                    item.classList.remove('active');
                });
            });
        });

        // Fechar menu ao clicar fora
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navMenu.contains(event.target);
            const isClickOnToggle = menuToggle.contains(event.target);

            if (!isClickInsideNav && !isClickOnToggle && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = ''; // Restaurar scroll
            }
        });

        // Fechar menu ao pressionar ESC (acessibilidade)
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
                menuToggle.focus(); // Retornar foco ao botão
            }
        });
    }
});

// =========================================
// SMOOTH SCROLL PARA LINKS INTERNOS
// =========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');

        // Ignorar links com apenas "#"
        if (href === '#' || href === '#privacidade') {
            return;
        }

        const targetElement = document.querySelector(href);
        if (targetElement) {
            e.preventDefault();
            const header = document.querySelector('.header');
            const headerHeight = header ? header.offsetHeight : 70;
            const targetPosition = targetElement.offsetTop - headerHeight - 20;

            // Otimização: usar requestAnimationFrame para melhor performance
            window.requestAnimationFrame(() => {
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            });
        }
    });
});

// =========================================
// FAQ ACCORDION
// =========================================

const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');

    if (question) {
        question.addEventListener('click', function() {
            // Fechar outros itens abertos
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle do item atual
            item.classList.toggle('active');
            const isExpanded = item.classList.contains('active');
            question.setAttribute('aria-expanded', isExpanded);
        });
    }
});

// =========================================
// MÁSCARA DE TELEFONE
// =========================================

function phoneMask(value) {
    if (!value) return '';
    value = value.replace(/\D/g, '');

    if (value.length <= 10) {
        // Formato: (XX) XXXX-XXXX
        value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
        value = value.replace(/(\d)(\d{4})$/, '$1-$2');
    } else {
        // Formato: (XX) XXXXX-XXXX
        value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
        value = value.replace(/(\d)(\d{4})$/, '$1-$2');
    }

    return value;
}

// Aplicar máscara em todos os campos de telefone
document.addEventListener('DOMContentLoaded', function() {
    const telefoneInputs = document.querySelectorAll('input[type="tel"], .telefone-mask');

    telefoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            e.target.value = phoneMask(e.target.value);
        });
    });
});

// =========================================
// CONTATO RÁPIDO FORM SUBMISSION
// =========================================

const contatoRapidoForm = document.getElementById('contatoRapidoForm');

if (contatoRapidoForm) {
    contatoRapidoForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const nome = this.querySelector('input[name="nome"]').value;
        const email = this.querySelector('input[name="email"]').value;
        const telefone = this.querySelector('input[name="telefone"]').value;
        const mensagem = this.querySelector('textarea[name="mensagem"]').value;

        // Validação de e-mail
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Por favor, insira um e-mail válido.');
            return;
        }

        // Aqui você integraria com seu backend ou serviço de e-mail
        alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
        this.reset();
    });
}

// =========================================
// CONTACT FORM SUBMISSION
// =========================================

const contatoForm = document.getElementById('contatoForm');

if (contatoForm) {
    contatoForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Validação básica
        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
        const assunto = document.getElementById('assunto').value;
        const mensagem = document.getElementById('mensagem').value.trim();
        const privacidade = document.getElementById('privacidade').checked;

        if (!nome || !email || !assunto || !mensagem) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        if (!privacidade) {
            alert('Por favor, aceite a Política de Privacidade para continuar.');
            return;
        }

        // Validação de e-mail
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Por favor, insira um e-mail válido.');
            return;
        }

        // Aqui você integraria com seu backend ou serviço de e-mail
        // Por enquanto, apenas mostrar uma mensagem de sucesso

        alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
        this.reset();
    });
}

// =========================================
// ANIMAÇÃO DE ENTRADA DOS ELEMENTOS
// =========================================

// Intersection Observer para animações ao scroll - otimizado para mobile
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Usar requestAnimationFrame para melhor performance
            requestAnimationFrame(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            });
            // Parar de observar após animação (performance)
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Elementos para animar
const animateElements = document.querySelectorAll(`
    .caminho-card,
    .programa-box,
    .depoimento-card,
    .programa-detalhe,
    .componente-item,
    .para-quem-card,
    .estrutura-item,
    .outro-programa-card,
    .historia-item,
    .licao-card,
    .valor-item,
    .faq-item
`);

// Definir estado inicial e observar
animateElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
});

// =========================================
// LOADING DE IMAGENS (Lazy Loading Manual)
// =========================================

// Para navegadores que não suportam loading="lazy" nativamente
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// =========================================
// PERFORMANCE: Debounce para eventos de scroll
// =========================================

function debounce(func, wait = 10, immediate = true) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Aplicar debounce ao scroll do header com throttle para melhor performance
let ticking = false;
const handleScroll = function() {
    if (!ticking) {
        window.requestAnimationFrame(function() {
            const header = document.querySelector('.header');
            if (header) {
                if (window.scrollY > 50) {
                    header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
                } else {
                    header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
                }
            }
            ticking = false;
        });
        ticking = true;
    }
};

// Usar passive listener para melhor performance de scroll
window.addEventListener('scroll', handleScroll, { passive: true });

// =========================================
// ACESSIBILIDADE: Navegação por teclado
// =========================================

// Trap focus dentro do menu mobile quando aberto
document.addEventListener('keydown', function(e) {
    const navMenu = document.querySelector('.nav-menu');

    if (navMenu && navMenu.classList.contains('active')) {
        const focusableElements = navMenu.querySelectorAll('a, button');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        // Tab
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }

        // Escape para fechar
        if (e.key === 'Escape') {
            navMenu.classList.remove('active');
            document.querySelector('.menu-toggle').classList.remove('active');
            document.querySelector('.menu-toggle').setAttribute('aria-expanded', 'false');
            document.querySelector('.menu-toggle').focus();
        }
    }
});

// =========================================
// ANO ATUAL NO FOOTER
// =========================================

// Atualizar ano automaticamente
const currentYearElement = document.getElementById('currentYear');
if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
}

// =========================================
// CONSOLE MESSAGE
// =========================================

console.log('%c🌸 Hinis - Autoestima e Autocuidado Feminino', 'font-size: 16px; font-weight: bold; color: #8B7355;');
console.log('%cEleve sua autoestima respeitando seu tempo, sua história e seu corpo.', 'font-size: 12px; color: #6B6B6B;');

// =========================================
// OTIMIZAÇÕES MOBILE
// =========================================

// Detectar orientação e ajustar viewport
function handleOrientationChange() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Executar na carga e em mudanças de orientação
window.addEventListener('load', handleOrientationChange);
window.addEventListener('resize', debounce(handleOrientationChange, 200));
window.addEventListener('orientationchange', handleOrientationChange);

// Otimização: Lazy loading de imagens (fallback para navegadores sem suporte nativo)
if ('loading' in HTMLImageElement.prototype) {
    // Navegador suporta lazy loading nativo
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        if (img.dataset.src) {
            img.src = img.dataset.src;
        }
    });
} else {
    // Fallback com Intersection Observer
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Prevenir zoom duplo-toque em iOS (melhor UX)
let lastTouchEnd = 0;
document.addEventListener('touchend', function(event) {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, { passive: false });

// Performance: Reduzir animações em dispositivos de baixa performance
if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
    document.documentElement.style.setProperty('--transition', 'all 0.15s ease');
}

// Feedback tátil para botões em dispositivos móveis
const buttons = document.querySelectorAll('button, .btn, a[role="button"]');
buttons.forEach(button => {
    button.addEventListener('touchstart', function() {
        this.style.opacity = '0.8';
    }, { passive: true });

    button.addEventListener('touchend', function() {
        setTimeout(() => {
            this.style.opacity = '';
        }, 150);
    }, { passive: true });
});

// =========================================
// CARROSSEL DE DEPOIMENTOS
// =========================================

const depoimentosCarousel = document.getElementById('depoimentosCarousel');
const carouselIndicators = document.querySelectorAll('.carousel-indicator');

if (depoimentosCarousel && carouselIndicators.length > 0) {
    let currentIndex = 0;
    let autoplayInterval;
    const totalDepoimentos = carouselIndicators.length;
    const autoplayDelay = 5000; // 5 segundos

    // Função para atualizar a posição do carrossel
    function updateCarousel(index, smooth = true) {
        currentIndex = index;

        // Detectar se está em mobile (768px ou menos)
        const isMobile = window.innerWidth <= 768;

        // Calcular offset:
        // - Desktop: cada card ocupa 50%, então movemos 50% por card
        //   Adicionamos 25% para centralizar (mostra metade do anterior, card completo no centro, metade do próximo)
        // - Mobile: cada card ocupa 100% (mostra 1 por vez)
        let offset;
        if (isMobile) {
            offset = -100 * currentIndex;
        } else {
            // Desktop: mover 50% por card, começando com +25% para mostrar layout correto
            offset = -50 * currentIndex + 25;
        }

        depoimentosCarousel.style.transition = smooth ? 'transform 0.6s ease-in-out' : 'none';
        depoimentosCarousel.style.transform = `translateX(${offset}%)`;

        // Atualizar indicadores
        carouselIndicators.forEach((indicator, i) => {
            if (i === currentIndex) {
                indicator.classList.add('active');
                indicator.setAttribute('aria-current', 'true');
            } else {
                indicator.classList.remove('active');
                indicator.removeAttribute('aria-current');
            }
        });
    }

    // Função para ir ao próximo depoimento
    function nextDepoimento() {
        const nextIndex = (currentIndex + 1) % totalDepoimentos;
        updateCarousel(nextIndex);
    }

    // Função para ir ao depoimento anterior
    function prevDepoimento() {
        const prevIndex = (currentIndex - 1 + totalDepoimentos) % totalDepoimentos;
        updateCarousel(prevIndex);
    }

    // Iniciar autoplay
    function startAutoplay() {
        stopAutoplay(); // Limpar intervalo anterior se existir
        autoplayInterval = setInterval(nextDepoimento, autoplayDelay);
    }

    // Parar autoplay
    function stopAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
        }
    }

    // Event listeners para indicadores
    carouselIndicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            stopAutoplay();
            updateCarousel(index);
            startAutoplay(); // Reiniciar autoplay após interação
        });
    });

    // Suporte para gestos de swipe em dispositivos touch
    let touchStartX = 0;
    let touchEndX = 0;

    depoimentosCarousel.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    depoimentosCarousel.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50; // pixels mínimos para considerar swipe

        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe para esquerda - próximo
            stopAutoplay();
            nextDepoimento();
            startAutoplay();
        }

        if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe para direita - anterior
            stopAutoplay();
            prevDepoimento();
            startAutoplay();
        }
    }

    // Pausar autoplay quando o usuário estiver visualizando (hover/focus)
    depoimentosCarousel.addEventListener('mouseenter', stopAutoplay);
    depoimentosCarousel.addEventListener('mouseleave', startAutoplay);
    depoimentosCarousel.addEventListener('focusin', stopAutoplay);
    depoimentosCarousel.addEventListener('focusout', startAutoplay);

    // Pausar autoplay quando a aba não estiver visível
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            stopAutoplay();
        } else {
            startAutoplay();
        }
    });

    // Iniciar autoplay ao carregar
    startAutoplay();

    // Suporte para navegação por teclado
    document.addEventListener('keydown', function(e) {
        // Verificar se o carrossel está visível na viewport
        const carouselRect = depoimentosCarousel.getBoundingClientRect();
        const isVisible = carouselRect.top < window.innerHeight && carouselRect.bottom > 0;

        if (isVisible) {
            if (e.key === 'ArrowLeft') {
                stopAutoplay();
                prevDepoimento();
                startAutoplay();
            } else if (e.key === 'ArrowRight') {
                stopAutoplay();
                nextDepoimento();
                startAutoplay();
            }
        }
    });

    // Recalcular posição ao redimensionar (com debounce para performance)
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateCarousel(currentIndex, false); // false = sem animação
        }, 250);
    });
}

// =========================================
// LUCIDE ICONS INITIALIZATION
// =========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('=== LUCIDE DEBUG ===');
    console.log('1. Lucide disponível?', typeof lucide !== 'undefined');
    console.log('2. Lucide object:', typeof lucide !== 'undefined' ? lucide : 'undefined');

    const iconsBeforeInit = document.querySelectorAll('[data-lucide]');
    console.log('3. Ícones encontrados antes de inicializar:', iconsBeforeInit.length);
    iconsBeforeInit.forEach((icon, idx) => {
        console.log(`   - Ícone ${idx + 1}:`, icon.getAttribute('data-lucide'), 'classes:', icon.className);
    });

    if (typeof lucide !== 'undefined') {
        try {
            lucide.createIcons();
            console.log('4. ✓ Ícones Lucide inicializados com sucesso');

            // Verificar se os ícones foram realmente renderizados
            setTimeout(() => {
                const iconsAfterInit = document.querySelectorAll('[data-lucide]');
                console.log('5. Verificando renderização após 100ms:');
                iconsAfterInit.forEach((icon, idx) => {
                    const hasSvg = icon.querySelector('svg') !== null;
                    console.log(`   - Ícone ${idx + 1}:`, icon.getAttribute('data-lucide'), 'tem SVG?', hasSvg);
                    if (!hasSvg) {
                        console.error(`   ✗ Ícone ${icon.getAttribute('data-lucide')} NÃO foi renderizado!`);
                    }
                });
            }, 100);
        } catch (erro) {
            console.error('4. ✗ Erro ao criar ícones:', erro);
        }
    } else {
        console.error('4. ✗ Lucide não está disponível!');
    }
});
