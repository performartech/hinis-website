/**
 * HINIS - PHONE PROTECTION
 *
 * Proteção contra scraping de números de telefone
 * Decodifica números ofuscados no HTML
 */

// =========================================
// DECODIFICAÇÃO DE TELEFONES
// =========================================

document.addEventListener('DOMContentLoaded', function() {
    // Busca todos os elementos com telefones ofuscados
    const phoneElements = document.querySelectorAll('[data-phone]');

    phoneElements.forEach(element => {
        const encodedPhone = element.getAttribute('data-phone');

        // Decodifica o número (Base64 reverso)
        const decodedPhone = atob(encodedPhone);

        // Atualiza o elemento
        if (element.tagName === 'A') {
            // Para links (WhatsApp, tel:)
            element.href = element.href.replace('PHONE_PLACEHOLDER', decodedPhone);
            if (element.textContent.includes('PHONE_DISPLAY')) {
                element.textContent = formatPhoneDisplay(decodedPhone);
            }
        } else {
            // Para texto simples
            element.textContent = formatPhoneDisplay(decodedPhone);
        }
    });
});

// =========================================
// FORMATAÇÃO DE TELEFONE PARA EXIBIÇÃO
// =========================================

function formatPhoneDisplay(phone) {
    // Remove caracteres não numéricos
    const digits = phone.replace(/\D/g, '');

    // Formata: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
    if (digits.length === 11) {
        return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    } else if (digits.length === 10) {
        return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    }

    // Retorna o número sem formatação se não corresponder
    return phone;
}

// =========================================
// HELPER: ENCODE PHONE (para uso no console)
// =========================================

// Use esta função no console do navegador para gerar o código Base64 de um telefone
// Exemplo: encodePhone('+5521988602474')
function encodePhone(phone) {
    return btoa(phone);
}

// Expõe a função para uso no console (apenas desenvolvimento)
if (typeof window !== 'undefined') {
    window.encodePhone = encodePhone;
}
