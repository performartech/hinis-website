/**
 * HINIS - FORM HANDLER
 *
 * Gerencia o envio de TODOS os formulários de contato para o Google Apps Script
 * Suporta: contatoForm (contato.html) e contatoRapidoForm (index.html, programas.html)
 */

(function() {
    'use strict';

    // =========================================
    // CONFIGURAÇÃO
    // =========================================

    // Modo Debug (mudar para false em produção)
    const DEBUG_MODE = false;

    // Funções de log condicionais
    const log = (...args) => DEBUG_MODE && console.log(...args);
    const warn = (...args) => DEBUG_MODE && console.warn(...args);
    const error = (...args) => console.error(...args); // Erros sempre devem ser logados

    // URL do Google Apps Script (importada de config.js)
    const GOOGLE_SCRIPT_URL = (typeof window !== 'undefined' && window.CONFIG)
        ? window.CONFIG.GOOGLE_SCRIPT_URL
        : null;

// =========================================
// RATE LIMITING
// =========================================

// Configurações de Rate Limiting
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minuto
const RATE_LIMIT_MAX_ATTEMPTS = 2; // Máximo de 2 envios por minuto

// Storage para rastrear envios
let submissionAttempts = [];

/**
 * Verifica se o usuário excedeu o limite de envios
 * @returns {Object} { allowed: boolean, remainingTime: number }
 */
function checkRateLimit() {
    const now = Date.now();

    // Remove tentativas antigas (fora da janela de tempo)
    submissionAttempts = submissionAttempts.filter(
        timestamp => now - timestamp < RATE_LIMIT_WINDOW_MS
    );

    // Verifica se excedeu o limite
    if (submissionAttempts.length >= RATE_LIMIT_MAX_ATTEMPTS) {
        const oldestAttempt = Math.min(...submissionAttempts);
        const remainingTime = RATE_LIMIT_WINDOW_MS - (now - oldestAttempt);

        return {
            allowed: false,
            remainingTime: Math.ceil(remainingTime / 1000) // segundos
        };
    }

    return { allowed: true, remainingTime: 0 };
}

/**
 * Registra uma nova tentativa de envio
 */
function recordSubmissionAttempt() {
    submissionAttempts.push(Date.now());
}

// =========================================
// INICIALIZAÇÃO
// =========================================

// Função para inicializar o formulário
function initializeForm() {
    log('=== INICIALIZANDO FORM HANDLER ===');

    // Busca TODOS os formulários de contato no site (todos têm id="contatoForm")
    const contatoForm = document.getElementById('contatoForm');

    if (contatoForm) {
        log('✓ Formulário encontrado:', contatoForm);
        contatoForm.addEventListener('submit', handleFormSubmit);
    } else {
        log('ℹ️ Formulário não encontrado no DOM inicial (será carregado dinamicamente)');
    }

    // Inicializa máscara de telefone em todos os inputs
    initTelefoneMask();
}

// Aguarda o DOM carregar
document.addEventListener('DOMContentLoaded', function() {
    log('=== FORM HANDLER CARREGADO ===');

    // Tenta inicializar imediatamente (para páginas com formulário fixo como contato.html)
    initializeForm();
});

// Aguarda componentes dinâmicos carregarem (para index.html, programas.html)
document.addEventListener('componentLoaded', function(event) {
    log('=== COMPONENTE CARREGADO ===', event.detail.componentName);

    if (event.detail.componentName === 'form-contato') {
        log('✓ Formulário de contato carregado dinamicamente');
        // Re-inicializa para capturar o formulário recém-carregado
        initializeForm();
    }
});

// =========================================
// HANDLER DO FORMULÁRIO
// =========================================

async function handleFormSubmit(event) {
    log('=== FUNÇÃO handleFormSubmit CHAMADA ===');
    event.preventDefault();
    log('✓ preventDefault() executado - formulário NÃO será recarregado');

    const form = event.target;
    log('Formulário:', form);
    const submitButton = form.querySelector('button[type="submit"]');

    // Busca elemento de feedback (pode estar dentro ou após o formulário)
    let feedback = form.querySelector('.form-feedback');
    if (!feedback) {
        feedback = document.getElementById('formFeedback');
    }

    // Se não existir, cria dinamicamente
    if (!feedback) {
        feedback = document.createElement('div');
        feedback.className = 'form-feedback';
        feedback.style.cssText = 'display: none; padding: 1rem; border-radius: 8px; text-align: center; font-weight: 500; margin-top: 1rem;';
        submitButton.insertAdjacentElement('afterend', feedback);
    }

    try {
        // Verifica Rate Limiting ANTES de qualquer outra validação
        const rateLimitCheck = checkRateLimit();
        if (!rateLimitCheck.allowed) {
            showFeedback(
                `Você está enviando mensagens muito rapidamente. Por favor, aguarde ${rateLimitCheck.remainingTime} segundos antes de tentar novamente.`,
                'error',
                feedback
            );
            return;
        }

        // Valida URL do Google Script
        if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL === 'COLE_AQUI_A_URL_DO_SEU_WEB_APP') {
            showFeedback(
                'Erro de configuração. Por favor, entre em contato pelo WhatsApp.',
                'error',
                feedback
            );
            error('Google Apps Script URL não configurada');
            return;
        }

        // Desabilita botão e mostra loading
        submitButton.disabled = true;
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Enviando...';
        feedback.style.display = 'none';

        // Coleta dados do formulário
        const formData = new FormData(form);
        const dados = {
            nome: formData.get('nome')?.trim() || '',
            email: formData.get('email')?.trim() || '',
            telefone: formData.get('telefone')?.trim() || '',
            programa: formData.get('programa') || '',
            mensagem: '' // Campo removido do formulário
        };

        // Adiciona dados UTM se disponíveis
        if (typeof window.HinisUTM !== 'undefined') {
            const utmData = window.HinisUTM.format();
            Object.assign(dados, utmData);
            log('✓ Dados UTM adicionados ao envio:', utmData);
        }

        // Validação básica (nome, email, telefone e programa são obrigatórios)
        if (!dados.nome || !dados.email || !dados.telefone || !dados.programa) {
            showFeedback(
                'Por favor, preencha todos os campos obrigatórios.',
                'error',
                feedback
            );
            submitButton.disabled = false;
            submitButton.textContent = 'Enviar mensagem';
            return;
        }

        // Validação de formato de email
        if (!validarEmail(dados.email)) {
            showFeedback(
                'Por favor, insira um endereço de e-mail válido.',
                'error',
                feedback
            );
            submitButton.disabled = false;
            submitButton.textContent = 'Enviar mensagem';
            return;
        }

        // Validação de telefone (mínimo 10 dígitos)
        const telefoneSomenteNumeros = dados.telefone.replace(/\D/g, '');
        if (telefoneSomenteNumeros.length < 10) {
            showFeedback(
                'Por favor, insira um telefone válido com DDD.',
                'error',
                feedback
            );
            submitButton.disabled = false;
            submitButton.textContent = 'Enviar mensagem';
            return;
        }

        // Log dos dados que serão enviados (para debug)
        log('Enviando dados para Google Apps Script:', dados);
        log('URL:', GOOGLE_SCRIPT_URL);

        // Envia para o Google Apps Script
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Google Apps Script exige no-cors
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dados)
        });

        log('Resposta do fetch (no-cors mode):', response);

        // No-cors mode não retorna resposta, então assumimos sucesso
        // se não houve erro no fetch

        // Registra envio bem-sucedido para Rate Limiting
        recordSubmissionAttempt();

        showFeedback(
            'Mensagem enviada com sucesso! Retornaremos em breve.',
            'success',
            feedback
        );

        // Envia evento para Google Analytics
        if (typeof window.HinisUTM !== 'undefined') {
            window.HinisUTM.sendEvent('form_submission', {
                form_type: dados.programa ? 'contato_com_programa' : 'contato_rapido',
                programa_selecionado: dados.programa || 'não informado'
            });
        }

        // Limpa o formulário
        form.reset();

        // Reabilita o botão após sucesso
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;

        // Opcional: Redirecionar ou fazer outras ações após 3 segundos
        setTimeout(() => {
            // feedback.style.display = 'none';
            // window.location.href = 'index.html'; // Descomente para redirecionar
        }, 3000);

    } catch (erro) {
        error('Erro ao enviar formulário:', erro);

        showFeedback(
            'Erro ao enviar mensagem. Por favor, tente novamente ou entre em contato pelo WhatsApp.',
            'error',
            feedback
        );

        // Reabilita o botão após erro
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
    }
}

// =========================================
// FEEDBACK VISUAL
// =========================================

function showFeedback(mensagem, tipo, elemento) {
    if (!elemento) return;

    elemento.textContent = mensagem;
    elemento.style.display = 'block';

    // Define cores baseadas no tipo
    if (tipo === 'success') {
        elemento.style.backgroundColor = '#d4edda';
        elemento.style.color = '#155724';
        elemento.style.border = '1px solid #c3e6cb';
    } else if (tipo === 'error') {
        elemento.style.backgroundColor = '#f8d7da';
        elemento.style.color = '#721c24';
        elemento.style.border = '1px solid #f5c6cb';
    } else {
        elemento.style.backgroundColor = '#d1ecf1';
        elemento.style.color = '#0c5460';
        elemento.style.border = '1px solid #bee5eb';
    }

    // Scroll suave até o feedback
    elemento.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// =========================================
// MÁSCARA DE TELEFONE
// =========================================

function initTelefoneMask() {
    const telefoneInputs = document.querySelectorAll('.telefone-mask');

    telefoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');

            // Limita a 11 dígitos (celular com DDD)
            if (value.length > 11) {
                value = value.slice(0, 11);
            }

            // Aplica máscara
            if (value.length <= 10) {
                // Formato: (XX) XXXX-XXXX
                value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
            } else {
                // Formato: (XX) XXXXX-XXXX
                value = value.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3');
            }

            e.target.value = value;
        });

        // Remove máscara ao copiar
        input.addEventListener('copy', function(e) {
            e.preventDefault();
            const value = e.target.value.replace(/\D/g, '');
            e.clipboardData.setData('text/plain', value);
        });
    });
}

// =========================================
// VALIDAÇÃO DE E-MAIL (AUXILIAR)
// =========================================

function validarEmail(email) {
    // Regex robusto seguindo RFC 5322 (simplificado)
    // Valida:
    // - Parte local: letras, números, pontos, hífens, underscores
    // - @ obrigatório
    // - Domínio: letras, números, hífens
    // - TLD: mínimo 2 caracteres
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Validações adicionais
    if (!regex.test(email)) return false;

    // Não permite múltiplos pontos consecutivos
    if (email.includes('..')) return false;

    // Não permite ponto no início ou fim da parte local
    const [local, domain] = email.split('@');
    if (local.startsWith('.') || local.endsWith('.')) return false;

    // Domínio deve ter pelo menos um ponto
    if (!domain.includes('.')) return false;

    return true;
}

// =========================================
// FALLBACK PARA ERROS GLOBAIS
// =========================================

window.addEventListener('unhandledrejection', function(event) {
    console.error('Erro não tratado:', event.reason);

    const feedback = document.getElementById('formFeedback');
    if (feedback) {
        showFeedback(
            'Ocorreu um erro inesperado. Por favor, entre em contato pelo WhatsApp.',
            'error',
            feedback
        );
    }
});
})(); // Fim da IIFE
