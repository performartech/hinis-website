/**
 * HINIS - UTM TRACKER
 *
 * Sistema de rastreamento de parâmetros UTM para análise de campanhas de marketing
 * Captura, armazena e envia dados de origem do tráfego
 *
 * @version 1.1.0
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
    // ARMAZENAMENTO
    // =========================================

    /**
     * Escolhe onde guardar os dados.
     *
     * localStorage vem primeiro porque o sessionStorage é isolado por aba:
     * se a pessoa abre a landing page e o checkout em abas diferentes, ou
     * volta ao site depois, os UTMs se perdiam. O prazo de 30 minutos
     * continua valendo — quem controla a janela de atribuição é o
     * SESSION_DURATION, não o tipo de armazenamento.
     *
     * @returns {Storage|null} Storage disponível ou null (modo restrito)
     */
    let _storage;
    function getStorage() {
        if (_storage !== undefined) return _storage;

        const candidatos = [
            function() { return window.localStorage; },
            function() { return window.sessionStorage; }
        ];

        for (let i = 0; i < candidatos.length; i++) {
            try {
                const s = candidatos[i]();
                const teste = '__hinis_test__';
                s.setItem(teste, '1');
                s.removeItem(teste);
                _storage = s;
                return _storage;
            } catch (error) {
                // Storage bloqueado (navegação privada, cookies desativados) — tenta o próximo
            }
        }

        _storage = null;
        return _storage;
    }

    // =========================================
    // CAPTURA DE PARÂMETROS UTM
    // =========================================

    /**
     * Extrai os parâmetros UTM de uma query string
     * @param {string} search - Query string (ex: "?utm_source=meta")
     * @returns {Object|null} Parâmetros encontrados ou null
     */
    function extrairUTM(search) {
        const urlParams = new URLSearchParams(search || '');
        const utmData = {};
        let hasUTM = false;

        UTM_PARAMS.forEach(param => {
            const value = urlParams.get(param);
            if (value) {
                utmData[param] = value;
                hasUTM = true;
            }
        });

        return hasUTM ? utmData : null;
    }

    /**
     * Extrai parâmetros UTM da URL atual
     * @returns {Object} Objeto com parâmetros UTM encontrados
     */
    function captureUTMParameters() {
        const utmData = extrairUTM(window.location.search);

        // Adiciona timestamp e página de entrada
        if (utmData) {
            utmData.timestamp = Date.now();
            utmData.landing_page = window.location.pathname;
            utmData.referrer = document.referrer || 'direct';
        }

        return utmData;
    }

    /**
     * Recupera os UTMs a partir da página anterior, quando ela é do próprio site.
     *
     * Rede de segurança para o caso em que o armazenamento não sobreviveu à
     * navegação (aba nova, storage bloqueado, sessão expirada por pouco):
     * se a pessoa veio de /lp/essentia?utm_source=..., os UTMs ainda estão
     * no document.referrer. Só vale para referrer do mesmo domínio — UTMs
     * na URL de um site externo são da campanha dele, não da Hinis.
     *
     * @returns {Object|null} Dados UTM recuperados do referrer ou null
     */
    function captureFromReferrer() {
        if (!document.referrer) return null;

        try {
            const ref = new URL(document.referrer);
            if (ref.origin !== window.location.origin) return null;

            const utmData = extrairUTM(ref.search);
            if (!utmData) return null;

            utmData.timestamp = Date.now();
            utmData.landing_page = ref.pathname;
            utmData.referrer = document.referrer;

            return utmData;
        } catch (error) {
            return null;
        }
    }

    /**
     * Salva dados UTM no armazenamento
     * @param {Object} utmData - Dados UTM para armazenar
     */
    function saveUTMData(utmData) {
        if (!utmData) return;

        const s = getStorage();
        if (!s) return;

        try {
            s.setItem(STORAGE_KEY, JSON.stringify(utmData));
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
        const s = getStorage();
        if (!s) return null;

        try {
            const stored = s.getItem(STORAGE_KEY);
            if (!stored) return null;

            const utmData = JSON.parse(stored);

            // Verifica se a sessão expirou
            const now = Date.now();
            if (now - utmData.timestamp > SESSION_DURATION) {
                s.removeItem(STORAGE_KEY);
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
        const s = getStorage();
        if (s) s.removeItem(STORAGE_KEY);
    }

    // =========================================
    // FORMATAÇÃO PARA ENVIO
    // =========================================

    /**
     * Formata dados UTM para envio no formulário
     * @returns {Object} Objeto com campos formatados
     */
    function formatUTMForSubmission() {
        // Se o armazenamento falhou, ainda tenta a URL atual e o referrer —
        // é melhor enviar a atribuição do que perdê-la por não conseguir gravar.
        const utmData = getUTMData() || captureUTMParameters() || captureFromReferrer();
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
        } else if (!getUTMData()) {
            // Sem UTMs na URL e sem nada guardado: tenta recuperar da página
            // anterior antes de dar a visita como direta
            const doReferrer = captureFromReferrer();
            if (doReferrer) {
                saveUTMData(doReferrer);
                console.log('↩ UTMs recuperados do referrer:', document.referrer);
            }
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
