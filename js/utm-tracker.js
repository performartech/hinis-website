/**
 * HINIS - UTM TRACKER
 *
 * Sistema de rastreamento de parâmetros UTM para análise de campanhas de marketing
 * Captura, armazena e envia dados de origem do tráfego
 *
 * @version 1.0.0
 * @author Hinis
 */

(function() {
    'use strict';

    // =========================================
    // CONFIGURAÇÃO
    // =========================================

    const UTM_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'];
    const STORAGE_KEY = 'hinis_utm_data';
    const SESSION_DURATION = 30 * 60 * 1000; // 30 minutos

    // =========================================
    // CAPTURA DE PARÂMETROS UTM
    // =========================================

    /**
     * Extrai parâmetros UTM da URL atual
     * @returns {Object} Objeto com parâmetros UTM encontrados
     */
    function captureUTMParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        const utmData = {};
        let hasUTM = false;

        UTM_PARAMS.forEach(param => {
            const value = urlParams.get(param);
            if (value) {
                utmData[param] = value;
                hasUTM = true;
            }
        });

        // Adiciona timestamp e página de entrada
        if (hasUTM) {
            utmData.timestamp = Date.now();
            utmData.landing_page = window.location.pathname;
            utmData.referrer = document.referrer || 'direct';
        }

        return hasUTM ? utmData : null;
    }

    /**
     * Salva dados UTM no sessionStorage
     * @param {Object} utmData - Dados UTM para armazenar
     */
    function saveUTMData(utmData) {
        if (!utmData) return;

        try {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(utmData));
            console.log('✓ UTM parameters captured:', utmData);
        } catch (error) {
            console.error('Erro ao salvar dados UTM:', error);
        }
    }

    /**
     * Recupera dados UTM armazenados
     * @returns {Object|null} Dados UTM ou null se não existirem/expiraram
     */
    function getUTMData() {
        try {
            const stored = sessionStorage.getItem(STORAGE_KEY);
            if (!stored) return null;

            const utmData = JSON.parse(stored);

            // Verifica se a sessão expirou
            const now = Date.now();
            if (now - utmData.timestamp > SESSION_DURATION) {
                sessionStorage.removeItem(STORAGE_KEY);
                return null;
            }

            return utmData;
        } catch (error) {
            console.error('Erro ao recuperar dados UTM:', error);
            return null;
        }
    }

    /**
     * Limpa dados UTM armazenados
     */
    function clearUTMData() {
        sessionStorage.removeItem(STORAGE_KEY);
    }

    // =========================================
    // FORMATAÇÃO PARA ENVIO
    // =========================================

    /**
     * Formata dados UTM para envio no formulário
     * @returns {Object} Objeto com campos formatados
     */
    function formatUTMForSubmission() {
        const utmData = getUTMData();
        if (!utmData) return {};

        const formatted = {
            utm_source: utmData.utm_source || '',
            utm_medium: utmData.utm_medium || '',
            utm_campaign: utmData.utm_campaign || '',
            utm_term: utmData.utm_term || '',
            utm_content: utmData.utm_content || '',
            gclid: utmData.gclid || '',
            fbclid: utmData.fbclid || '',
            landing_page: utmData.landing_page || window.location.pathname,
            referrer: utmData.referrer || 'direct'
        };

        return formatted;
    }

    /**
     * Gera string descritiva dos dados UTM para visualização
     * @returns {string} String formatada com dados UTM
     */
    function getUTMSummary() {
        const utmData = getUTMData();
        if (!utmData) return 'Acesso direto (sem UTM)';

        const parts = [];

        if (utmData.utm_source) parts.push(`Origem: ${utmData.utm_source}`);
        if (utmData.utm_medium) parts.push(`Mídia: ${utmData.utm_medium}`);
        if (utmData.utm_campaign) parts.push(`Campanha: ${utmData.utm_campaign}`);
        if (utmData.utm_term) parts.push(`Termo: ${utmData.utm_term}`);
        if (utmData.utm_content) parts.push(`Conteúdo: ${utmData.utm_content}`);

        return parts.join(' | ');
    }

    // =========================================
    // INTEGRAÇÃO COM GOOGLE ANALYTICS 4
    // =========================================

    /**
     * Envia evento customizado para Google Analytics 4
     * @param {string} eventName - Nome do evento
     * @param {Object} eventParams - Parâmetros do evento
     */
    function sendGAEvent(eventName, eventParams = {}) {
        if (typeof gtag === 'undefined') {
            console.warn('Google Analytics não está carregado. Evento não enviado:', eventName);
            return;
        }

        const utmData = getUTMData();
        const gaParams = {
            ...eventParams,
            ...(utmData && {
                campaign_source: utmData.utm_source,
                campaign_medium: utmData.utm_medium,
                campaign_name: utmData.utm_campaign,
                campaign_term: utmData.utm_term,
                campaign_content: utmData.utm_content,
                landing_page: utmData.landing_page,
                referrer: utmData.referrer
            })
        };

        gtag('event', eventName, gaParams);
        console.log('✓ GA4 event sent:', eventName, gaParams);
    }

    /**
     * Rastreia visualização de página com UTM
     */
    function trackPageView() {
        const utmData = getUTMData();

        if (utmData) {
            sendGAEvent('page_view_with_utm', {
                page_path: window.location.pathname,
                page_title: document.title
            });
        }
    }

    // =========================================
    // INICIALIZAÇÃO
    // =========================================

    function init() {
        // Captura novos parâmetros UTM da URL
        const newUTMData = captureUTMParameters();

        if (newUTMData) {
            // Se há novos UTMs, atualiza o armazenamento
            saveUTMData(newUTMData);

            // Envia evento de nova campanha
            sendGAEvent('utm_campaign_start', {
                campaign_type: 'new_session'
            });
        }

        // Rastreia visualização de página
        trackPageView();

        // Debug: mostra dados UTM no console
        const currentUTM = getUTMData();
        if (currentUTM) {
            console.log('📊 Sessão UTM ativa:', getUTMSummary());
        }
    }

    // =========================================
    // API PÚBLICA
    // =========================================

    window.HinisUTM = {
        capture: captureUTMParameters,
        get: getUTMData,
        clear: clearUTMData,
        format: formatUTMForSubmission,
        summary: getUTMSummary,
        sendEvent: sendGAEvent
    };

    // Inicializa quando DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
