/**
 * HINIS - COMPONENT LOADER
 *
 * Carrega componentes HTML reutilizáveis automaticamente
 * Funciona tanto com servidor local quanto abrindo arquivos diretamente
 */

(function() {
    'use strict';

    // Modo Debug (mudar para false em produção)
    const DEBUG_MODE = false;

    // Funções de log condicionais
    const log = (...args) => DEBUG_MODE && console.log(...args);
    const warn = (...args) => DEBUG_MODE && console.warn(...args);

    // Templates de componentes inline (fallback para file://)
    const COMPONENT_TEMPLATES = {
    'form-contato': `
        <form class="contato-rapido-form" id="contatoForm">
            <input type="text" name="nome" placeholder="Nome completo" required aria-label="Nome completo">
            <input type="email" name="email" placeholder="E-mail" required aria-label="E-mail">
            <input type="tel" name="telefone" placeholder="Telefone" class="telefone-mask" required aria-label="Telefone">

            <select name="programa" required aria-label="Programa de interesse">
                <option value="">Selecione um programa</option>
                <option value="Essentia">Essentia - Você, no seu tempo</option>
                <option value="Refugium">Refugium - De você, para você</option>
                <option value="Amicae">Amicae - De você para elas. Delas para você</option>
                <option value="Outro">Outro assunto</option>
            </select>

            <button type="submit" class="btn btn-primary">Enviar mensagem</button>
        </form>
    `
};

/**
 * Detecta se página está em subpasta (ex: programas/essencia.html)
 * e ajusta paths automaticamente
 */
function getBasePath() {
    const path = window.location.pathname;
    const isInSubfolder = path.includes('/programas/');
    return isInSubfolder ? '../' : '';
}

/**
 * Ajusta todos os paths relativos no HTML carregado
 */
function adjustPaths(html, basePath) {
    if (!basePath) return html; // Não precisa ajustar se estamos na raiz

    // Ajustar src de imagens
    html = html.replace(/src="assets\//g, `src="${basePath}assets/`);

    // Ajustar href de links (exceto âncoras #)
    html = html.replace(/href="(?!#|https?:\/\/|mailto:|tel:)([^"]*)"/g, (match, path) => {
        if (path.startsWith('programas/')) {
            // Se já começa com programas/ e estamos em subpasta,
            // extrair apenas o nome do arquivo
            const fileName = path.split('/').pop();
            return `href="${fileName}"`;
        }
        return `href="${basePath}${path}"`;
    });

    return html;
}

/**
 * Marca página ativa no menu baseado no atributo data-page
 */
function setActiveMenu() {
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 'index';

    // Remove todas as classes active existentes
    document.querySelectorAll('.nav-link, .dropdown-link').forEach(link => {
        link.classList.remove('active');
    });

    // Adiciona active ao link correspondente
    document.querySelectorAll('[data-page]').forEach(link => {
        const pageName = link.getAttribute('data-page');
        if (pageName === currentPage) {
            link.classList.add('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const basePath = getBasePath();

    // Busca todos os elementos que precisam carregar componentes
    const componentContainers = document.querySelectorAll('[data-component]');

    if (componentContainers.length === 0) {
        return; // Nenhum componente para carregar nesta página
    }

    // Carrega cada componente
    componentContainers.forEach(async (container) => {
        const componentName = container.getAttribute('data-component');
        const componentPath = `${basePath}components/${componentName}.html`;

        try {
            // Tenta carregar via fetch (funciona com servidor web)
            const response = await fetch(componentPath);

            if (!response.ok) {
                throw new Error(`Erro ao carregar componente: ${componentPath}`);
            }

            let html = await response.text();

            // Ajusta paths se necessário
            html = adjustPaths(html, basePath);

            container.innerHTML = html;

            // Se for header, marca página ativa no menu
            if (componentName === 'header') {
                setActiveMenu();
            }

            // Dispara evento personalizado quando componente é carregado
            const event = new CustomEvent('componentLoaded', {
                detail: { componentName, container }
            });
            document.dispatchEvent(event);

        } catch (erro) {
            warn(`Fetch falhou para ${componentName}, usando template inline:`, erro);

            // Fallback: usa template inline (funciona com file://)
            if (COMPONENT_TEMPLATES[componentName]) {
                let html = COMPONENT_TEMPLATES[componentName];
                html = adjustPaths(html, basePath);
                container.innerHTML = html;

                // Dispara evento personalizado
                const event = new CustomEvent('componentLoaded', {
                    detail: { componentName, container, fallback: true }
                });
                document.dispatchEvent(event);
            } else {
                // Se não houver template, mostra mensagem de erro apropriada
                if (componentName === 'header' || componentName === 'footer') {
                    warn(`Componente ${componentName} não pôde ser carregado. Página pode não funcionar corretamente.`);
                } else {
                    container.innerHTML = `
                        <div style="text-align: center; padding: 2rem; border: 1px solid #ddd; border-radius: 8px;">
                            <p>Não foi possível carregar o conteúdo.</p>
                            <a href="${basePath}contato.html" class="btn btn-primary">Ir para página de contato</a>
                        </div>
                    `;
                }
            }
        }
    });
});
})(); // Fim da IIFE
