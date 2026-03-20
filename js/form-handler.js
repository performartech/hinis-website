/**
 * HINIS - FORM HANDLER
 *
 * Gerencia o envio de TODOS os formulários de contato via Web3Forms API
 * Suporta: contatoForm (contato.html, index.html, programas.html)
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

    // Web3Forms API
    const WEB3FORMS_URL = 'https://api.web3forms.com/submit';
    const WEB3FORMS_ACCESS_KEY = (typeof window !== 'undefined' && window.CONFIG)
        ? window.CONFIG.WEB3FORMS_ACCESS_KEY
        : null;

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
    // INICIALIZAÇÃO
    // =========================================

    function initializeForm() {
        log('=== INICIALIZANDO FORM HANDLER (Web3Forms) ===');

        const contatoForm = document.getElementById('contatoForm');

        if (contatoForm) {
            log('✓ Formulário encontrado:', contatoForm);
            contatoForm.addEventListener('submit', handleFormSubmit);

            // Injeta a access key no campo hidden
            const keyField = contatoForm.querySelector('#web3formsKey');
            if (keyField && WEB3FORMS_ACCESS_KEY) {
                keyField.value = WEB3FORMS_ACCESS_KEY;
            }
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

            // Valida access key
            if (!WEB3FORMS_ACCESS_KEY || WEB3FORMS_ACCESS_KEY === 'YOUR_ACCESS_KEY_HERE') {
                showFeedback(
                    'Erro de configuração. Por favor, entre em contato pelo WhatsApp.',
                    'error',
                    feedback
                );
                error('Web3Forms access key não configurada');
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
                submitButton.textContent = 'Enviar mensagem';
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

            // Monta payload para Web3Forms
            const payload = {
                access_key: WEB3FORMS_ACCESS_KEY,
                subject: 'Novo contato via site Hinis',
                from_name: 'Site Hinis',
                nome: dados.nome,
                email: dados.email,
                telefone: dados.telefone,
                programa: dados.programa,
                botcheck: ''
            };

            // Adiciona dados UTM se disponíveis
            if (typeof window.HinisUTM !== 'undefined') {
                const utmData = window.HinisUTM.format();
                Object.assign(payload, utmData);
                log('✓ Dados UTM adicionados ao envio:', utmData);
            }

            log('Enviando dados para Web3Forms:', payload);

            // Envia para Web3Forms API
            const response = await fetch(WEB3FORMS_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            log('Resposta Web3Forms:', result);

            if (result.success) {
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

                form.reset();

                // Reinjeta a access key após reset
                const keyField = form.querySelector('#web3formsKey');
                if (keyField) {
                    keyField.value = WEB3FORMS_ACCESS_KEY;
                }
            } else {
                showFeedback(
                    result.message || 'Erro ao enviar mensagem. Tente novamente ou entre em contato pelo WhatsApp.',
                    'error',
                    feedback
                );
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
