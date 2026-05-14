/**
 * HINIS - FORM HANDLER
 *
 * Gerencia o envio de TODOS os formulários de contato via Google Sheets Apps Script
 * Suporta: contatoForm (contato.html, index.html, programas.html, refugium.html, amicae.html)
 */

(function() {
    'use strict';

    // =========================================
    // CONFIGURAÇÃO
    // =========================================

    const DEBUG_MODE = false;

    const log = (...args) => DEBUG_MODE && console.log(...args);
    const warn = (...args) => DEBUG_MODE && console.warn(...args);
    const error = (...args) => console.error(...args);

    const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbw347vHEbcZaXUXjBGb9RQgOK-Dbq6sS0uzcizjmq5UJRRjukxc4KuQ_iPWiR_DQRNM/exec';


    // =========================================
    // RATE LIMITING
    // =========================================

    const RATE_LIMIT_WINDOW_MS = 60 * 1000;
    const RATE_LIMIT_MAX_ATTEMPTS = 2;

    let submissionAttempts = [];

    function checkRateLimit() {
        const now = Date.now();
        submissionAttempts = submissionAttempts.filter(
            timestamp => now - timestamp < RATE_LIMIT_WINDOW_MS
        );

        if (submissionAttempts.length >= RATE_LIMIT_MAX_ATTEMPTS) {
            const oldestAttempt = Math.min(...submissionAttempts);
            const remainingTime = RATE_LIMIT_WINDOW_MS - (now - oldestAttempt);
            return {
                allowed: false,
                remainingTime: Math.ceil(remainingTime / 1000)
            };
        }

        return { allowed: true, remainingTime: 0 };
    }

    function recordSubmissionAttempt() {
        submissionAttempts.push(Date.now());
    }

    // =========================================
    // CLOUDFLARE TURNSTILE
    // =========================================

    const TURNSTILE_SITEKEY = '0x4AAAAAADFwO33Z_LmcjVsV';
    let turnstileWidgetId = null;
    let turnstileRendered = false;

    function renderTurnstile() {
        if (turnstileRendered) return;

        const container = document.querySelector('#contatoForm .cf-turnstile');
        if (!container) return;

        if (typeof turnstile === 'undefined') return;

        try {
            turnstileRendered = true;
            turnstileWidgetId = turnstile.render(container, {
                sitekey: TURNSTILE_SITEKEY,
                theme: 'light'
            });
            log('✓ Turnstile renderizado, widgetId:', turnstileWidgetId);
        } catch (e) {
            turnstileRendered = false;
            log('Turnstile render error:', e);
        }
    }

    // Callback global quando a API do Turnstile carrega
    window.onTurnstileLoad = function() {
        log('✓ Turnstile API carregada');
        renderTurnstile();
    };

    // =========================================
    // INICIALIZAÇÃO
    // =========================================

    function initializeForm() {
        log('=== INICIALIZANDO FORM HANDLER ===');

        const contatoForm = document.getElementById('contatoForm');

        if (contatoForm) {
            log('✓ Formulário encontrado:', contatoForm);
            contatoForm.addEventListener('submit', handleFormSubmit);

            // Renderiza Turnstile (se API já carregou)
            renderTurnstile();
        } else {
            log('ℹ️ Formulário não encontrado no DOM inicial (será carregado dinamicamente)');
        }

        initTelefoneMask();
    }

    document.addEventListener('DOMContentLoaded', function() {
        log('=== FORM HANDLER CARREGADO ===');
        initializeForm();
    });

    document.addEventListener('componentLoaded', function(event) {
        log('=== COMPONENTE CARREGADO ===', event.detail.componentName);
        if (event.detail.componentName === 'form-contato') {
            log('✓ Formulário de contato carregado dinamicamente');
            initializeForm();
        }
    });

    // =========================================
    // HANDLER DO FORMULÁRIO
    // =========================================

    async function handleFormSubmit(event) {
        log('=== FUNÇÃO handleFormSubmit CHAMADA ===');
        event.preventDefault();

        const form = event.target;
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton ? submitButton.textContent : 'Enviar mensagem';

        // Busca ou cria elemento de feedback
        let feedback = form.querySelector('.form-feedback');
        if (!feedback) {
            feedback = document.getElementById('formFeedback');
        }
        if (!feedback) {
            feedback = document.createElement('div');
            feedback.className = 'form-feedback';
            feedback.style.cssText = 'display: none; padding: 1rem; border-radius: 8px; text-align: center; font-weight: 500; margin-top: 1rem;';
            submitButton.insertAdjacentElement('afterend', feedback);
        }

        try {
            // Verifica Rate Limiting
            const rateLimitCheck = checkRateLimit();
            if (!rateLimitCheck.allowed) {
                showFeedback(
                    `Você está enviando mensagens muito rapidamente. Por favor, aguarde ${rateLimitCheck.remainingTime} segundos antes de tentar novamente.`,
                    'error',
                    feedback
                );
                return;
            }

            // Valida Turnstile
            let turnstileToken = '';
            if (typeof turnstile !== 'undefined' && turnstileWidgetId !== null) {
                turnstileToken = turnstile.getResponse(turnstileWidgetId);
            }
            if (!turnstileToken) {
                showFeedback(
                    'Por favor, aguarde a verificação de segurança.',
                    'error',
                    feedback
                );
                return;
            }

            // Desabilita botão e mostra loading
            submitButton.disabled = true;
            submitButton.textContent = 'Enviando...';
            feedback.style.display = 'none';

            // Coleta dados do formulário
            const formData = new FormData(form);
            const dados = {
                nome: formData.get('nome')?.trim() || '',
                email: formData.get('email')?.trim() || '',
                telefone: formData.get('telefone')?.trim() || '',
                programa: formData.get('programa') || ''
            };

            // Validação básica
            if (!dados.nome || !dados.email || !dados.telefone || !dados.programa) {
                showFeedback(
                    'Por favor, preencha todos os campos obrigatórios.',
                    'error',
                    feedback
                );
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
                return;
            }

            // Validação de email
            if (!validarEmail(dados.email)) {
                showFeedback(
                    'Por favor, insira um endereço de e-mail válido.',
                    'error',
                    feedback
                );
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
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
                submitButton.textContent = originalButtonText;
                return;
            }

            // Monta payload para Google Sheets
            const utmData = (typeof window.HinisUTM !== 'undefined') ? window.HinisUTM.format() : {};
            const sheetsPayload = {
                data_hora: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
                nome: dados.nome,
                email: dados.email,
                telefone: dados.telefone,
                programa: dados.programa,
                landing_page: window.location.href,
                referrer: utmData.referrer || document.referrer || 'direct',
                utm_source: utmData.utm_source || '',
                utm_medium: utmData.utm_medium || '',
                utm_campaign: utmData.utm_campaign || '',
                utm_term: utmData.utm_term || '',
                utm_content: utmData.utm_content || '',
                gclid: utmData.gclid || '',
                fbclid: utmData.fbclid || ''
            };

            log('Enviando dados para Google Sheets:', sheetsPayload);

            // Envia para Google Sheets (no-cors — resposta opaca, tratamos como sucesso se não houver erro de rede)
            await fetch(GOOGLE_SHEETS_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sheetsPayload)
            });

            log('✓ Dados enviados para Google Sheets');

            // Registra envio para Rate Limiting
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

            // Push para GTM dataLayer — Conversões Otimizadas (Google Ads Enhanced Conversions + Meta Advanced Matching)
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                event: 'generate_lead',
                user_data: {
                    email_address: dados.email.toLowerCase().trim(),
                    phone_number: '+55' + telefoneSomenteNumeros,
                    first_name: dados.nome.split(' ')[0].toLowerCase().trim(),
                    last_name: dados.nome.split(' ').slice(1).join(' ').toLowerCase().trim()
                },
                lead_data: {
                    programa: dados.programa,
                    landing_page: window.location.href,
                    utm_source: utmData.utm_source || '',
                    utm_medium: utmData.utm_medium || '',
                    utm_campaign: utmData.utm_campaign || '',
                    utm_term: utmData.utm_term || '',
                    utm_content: utmData.utm_content || '',
                    gclid: utmData.gclid || '',
                    fbclid: utmData.fbclid || ''
                }
            });

            form.reset();

            // Reseta Turnstile após envio
            if (typeof turnstile !== 'undefined' && turnstileWidgetId !== null) {
                turnstile.reset(turnstileWidgetId);
            }

            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;

        } catch (erro) {
            error('Erro ao enviar formulário:', erro);

            showFeedback(
                'Erro ao enviar mensagem. Por favor, tente novamente ou entre em contato pelo WhatsApp.',
                'error',
                feedback
            );

            submitButton.disabled = false;
            submitButton.textContent = originalButtonText || 'Enviar mensagem';
        }
    }

    // =========================================
    // FEEDBACK VISUAL
    // =========================================

    function showFeedback(mensagem, tipo, elemento) {
        if (!elemento) return;

        elemento.textContent = mensagem;
        elemento.style.display = 'block';

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

                if (value.length > 11) {
                    value = value.slice(0, 11);
                }

                if (value.length <= 10) {
                    value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
                } else {
                    value = value.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3');
                }

                e.target.value = value;
            });

            input.addEventListener('copy', function(e) {
                e.preventDefault();
                const value = e.target.value.replace(/\D/g, '');
                e.clipboardData.setData('text/plain', value);
            });
        });
    }

    // =========================================
    // VALIDAÇÃO DE E-MAIL
    // =========================================

    function validarEmail(email) {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!regex.test(email)) return false;
        if (email.includes('..')) return false;

        const [local, domain] = email.split('@');
        if (local.startsWith('.') || local.endsWith('.')) return false;
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
})();
