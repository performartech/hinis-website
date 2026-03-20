/**
 * HINIS - CONFIGURAÇÃO
 *
 * ATENÇÃO: Este arquivo contém informações sensíveis e NÃO deve ser commitado no Git
 * Adicione este arquivo ao .gitignore
 */

// =========================================
// WEB3FORMS
// =========================================

// Access Key do Web3Forms
// Substitua pela sua access key obtida em https://web3forms.com
const CONFIG = {
    WEB3FORMS_ACCESS_KEY: 'a0d7c4f9-29cd-4805-a930-ea8293826937'
};

// Exporta a configuração
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
}
