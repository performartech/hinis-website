/**
 * cta-tracker.js — v1.0.0
 *
 * Dispara eventos de clique dos CTAs no dataLayer, para o GTM encaminhar ao GA4:
 *
 *   cta_compreagora → botões que levam ao pagamento (pré-checkout, Hotmart)
 *   cta_whatsapp    → qualquer link de WhatsApp
 *
 * Usa delegação de evento no document: funciona também nos CTAs que entram na
 * página depois (footer carregado por load-components.js, modais, etc.).
 *
 * ⚠️ O push sozinho não gera dado no GA4 — é preciso ter, no GTM-WMKVWGKF, um
 * acionador de Evento Personalizado para cada nome e uma tag de evento do GA4.
 */
(function () {
    'use strict';

    /* Botões de compra. Cobre: links para /checkout/ (LP v3), botões do
       Lightbox Hotmart (LP v0/v2 e programas/essentia.html), o "Ir para
       pagamento" do pré-checkout e qualquer elemento marcado à mão. */
    var SELETOR_COMPRA = [
        'a[href*="/checkout/"]',
        'a[href*="pay.hotmart.com"]',
        '.hotmart__button-checkout',
        '.ck-btn-pagar',
        '[data-cta="compreagora"]'
    ].join(',');

    /* Links de WhatsApp. O PHONE_PLACEHOLDER cobre o clique que acontece antes
       de phone-protection.js (ou o decoder inline das LPs) trocar o número. */
    var SELETOR_WHATSAPP = [
        'a[href*="wa.me"]',
        'a[href*="api.whatsapp.com"]',
        'a[data-phone][href*="PHONE_PLACEHOLDER"]',
        '[data-cta="whatsapp"]'
    ].join(',');

    function texto(el) {
        var t = (el.textContent || '').replace(/\s+/g, ' ').trim();
        /* Botões só com ícone (WhatsApp flutuante) têm textContent em branco */
        return (t || el.getAttribute('aria-label') || '').slice(0, 100);
    }

    function enviar(evento, el) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: evento,
            cta_texto: texto(el),
            cta_destino: el.getAttribute('href') || '',
            cta_pagina: window.location.pathname
        });
    }

    /* Fase de captura (3º argumento true): o widget do Hotmart intercepta o
       clique no botão do Lightbox e interrompe a propagação, então um listener
       de bubbling no document nunca veria esses cliques. */
    document.addEventListener('click', function (e) {
        if (!e.target || !e.target.closest) return;

        var alvo = e.target.closest('a, button');
        if (!alvo) return;

        /* WhatsApp primeiro: nenhum CTA de compra é link de WhatsApp, e assim um
           elemento que casasse com os dois nunca gera evento duplicado. */
        if (alvo.matches(SELETOR_WHATSAPP)) {
            enviar('cta_whatsapp', alvo);
        } else if (alvo.matches(SELETOR_COMPRA)) {
            enviar('cta_compreagora', alvo);
        }
    }, true);
})();
