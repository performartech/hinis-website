/**
 * HINIS — GOOGLE APPS SCRIPT DO FORMULÁRIO
 *
 * Recebe os envios do site (formulário de contato e pré-checkout) e:
 * 1. Salva os dados na planilha "[Hinis] Leads formulário site"
 * 2. Envia e-mail de notificação para a equipe        (ENVIAR_NOTIFICACAO)
 * 3. Envia e-mail de confirmação para a pessoa        (ENVIAR_CONFIRMACAO)
 *    — nunca no fluxo de checkout, onde quem comunica a compra é a Hotmart
 *
 * ⚠️ DEPLOY: editar este código NÃO altera nada em produção.
 * É preciso criar uma nova versão de implantação:
 *   Implantar → Gerenciar implantações → ✏️ editar → Versão: Nova versão → Implantar
 * A URL /exec permanece a mesma.
 *
 * Para conferir qual versão está no ar, abra a URL /exec no navegador:
 * o doGet responde com a constante VERSAO abaixo.
 *
 * Cópia versionada em: apps-script/Codigo.gs no repositório do site.
 */

// =========================================
// CONFIGURAÇÕES
// =========================================

// Bumpar a cada alteração — é o que permite verificar o que está implantado
const VERSAO = "2.0.0";

// Planilha "[Hinis] Leads formulário site" (conta pedro@waah.com.br).
// A conta que implanta o script precisa ter permissão de edição nela.
const SPREADSHEET_ID = "1TzWjN44C6_z42Lm6yVvmI3eYub0MazY1n1vserJYM2s";

// Aba de destino. Vazio = primeira aba da planilha (o gid=0 em uso hoje).
// Nunca cria aba nova: se um nome for informado e não existir, cai na primeira.
const SHEET_NAME = "";

// E-mail que recebe as notificações
const EMAIL_DESTINO = "pedro@performartech.com.br";

// WhatsApp oficial da Hinis
const WHATSAPP = "5521994041648";

// Interruptores dos e-mails.
// ENVIAR_CONFIRMACAO nasce desligado de propósito: hoje o lead não recebe
// nenhum e-mail, e ligar isso é uma mudança visível para quem preenche o
// formulário — decisão de produto, não de deploy. Ligue quando o texto do
// e-mail estiver aprovado.
const ENVIAR_NOTIFICACAO = true;
const ENVIAR_CONFIRMACAO = false;

// Cabeçalho da aba — reflete exatamente as 14 colunas já existentes,
// na mesma ordem, para não desalinhar o histórico.
// "Origem" (15) é a única adição, sempre no fim.
const COLUNAS = [
  "Data/Hora",
  "Nome",
  "Email",
  "Telefone",
  "Programa",
  "Landing Page",
  "Referrer",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
  "Origem"
];

// =========================================
// ENTRADA — POST (envio do formulário)
// =========================================

function doPost(e) {
  try {
    console.log("=== RECEBENDO REQUISIÇÃO ===");
    console.log("Tipo de conteúdo:", e && e.postData ? e.postData.type : "(sem postData)");

    if (!e || !e.postData || !e.postData.contents) {
      console.log("ERRO: requisição sem corpo");
      return criarResposta(false, "Requisição sem dados");
    }

    console.log("Conteúdo bruto:", e.postData.contents);

    let dados;
    try {
      dados = JSON.parse(e.postData.contents);
    } catch (erroParse) {
      console.log("ERRO: corpo não é JSON válido");
      return criarResposta(false, "Formato de dados inválido");
    }

    console.log("Dados parseados:", JSON.stringify(dados));

    if (!dados.nome || !dados.email) {
      console.log("ERRO: dados obrigatórios faltando");
      return criarResposta(false, "Nome e e-mail são obrigatórios");
    }

    if (!validarEmail(dados.email)) {
      console.log("ERRO: e-mail inválido:", dados.email);
      return criarResposta(false, "E-mail inválido");
    }

    // Gravar na planilha é a única etapa crítica: se falhar, o lead se perde.
    // Por isso é a primeira, e é a única que interrompe o fluxo.
    salvarNaPlanilha(dados);
    console.log("✓ Salvo na planilha");

    const origem = identificarOrigem(dados);

    // E-mails são secundários — uma falha aqui (cota do MailApp, por exemplo)
    // não pode transformar um lead já salvo em "erro de formulário".
    if (ENVIAR_NOTIFICACAO) {
      enviarEmailNotificacao(dados, origem);
    }

    // Confirmação para a pessoa: só no formulário de contato. No checkout,
    // dizer "entraremos em contato em breve" para quem está indo pagar
    // seria enganoso — a comunicação da compra é da Hotmart.
    if (ENVIAR_CONFIRMACAO && origem !== "checkout") {
      enviarEmailConfirmacao(dados);
    } else if (origem === "checkout") {
      console.log("Origem checkout — e-mail de confirmação não enviado");
    }

    console.log("=== SUCESSO ===");
    return criarResposta(true, "Mensagem enviada com sucesso!");

  } catch (erro) {
    console.error("=== ERRO ===");
    console.error("Tipo:", erro.name);
    console.error("Mensagem:", erro.message);
    console.error("Stack:", erro.stack);
    return criarResposta(false, "Erro ao processar formulário: " + erro.message);
  }
}

// =========================================
// ENTRADA — GET (verificação de saúde)
// =========================================

/**
 * Abrir a URL /exec no navegador mostra qual versão está implantada.
 * Existe para tornar impossível repetir o problema de editar o código
 * e esquecer de criar a nova versão de implantação.
 */
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({
      sucesso: true,
      servico: "Hinis — formulário",
      versao: VERSAO,
      planilha: SPREADSHEET_ID,
      aba: SHEET_NAME || "(primeira aba)"
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// =========================================
// PLANILHA
// =========================================

function identificarOrigem(dados) {
  if (dados.origem) return String(dados.origem).toLowerCase();
  // Fallback: deduz pela URL de conversão
  if (String(dados.landing_page || "").indexOf("/checkout/") !== -1) return "checkout";
  return "contato";
}

/**
 * Devolve a aba de destino. Nunca cria aba nova — criar uma por engano
 * partiria o histórico de leads em dois lugares sem ninguém perceber.
 */
function obterAba(planilha) {
  if (SHEET_NAME) {
    const porNome = planilha.getSheetByName(SHEET_NAME);
    if (porNome) return porNome;
    console.log("Aba '" + SHEET_NAME + "' não encontrada — usando a primeira aba");
  }
  return planilha.getSheets()[0];
}

/**
 * Acrescenta apenas os cabeçalhos que faltam, à direita dos existentes.
 * Não reescreve, não reordena e não reformata as colunas já em uso.
 */
function garantirCabecalho(aba) {
  if (aba.getLastRow() === 0) {
    aba.getRange(1, 1, 1, COLUNAS.length).setValues([COLUNAS]);
    aba.setFrozenRows(1);
    console.log("Cabeçalho criado");
    return;
  }

  const ultima = aba.getLastColumn();
  if (ultima < COLUNAS.length) {
    const faltantes = COLUNAS.slice(ultima);
    aba.getRange(1, ultima + 1, 1, faltantes.length).setValues([faltantes]);
    console.log("Colunas adicionadas:", faltantes.join(", "));
  }
}

function salvarNaPlanilha(dados) {
  const planilha = SpreadsheetApp.openById(SPREADSHEET_ID);
  const aba = obterAba(planilha);

  garantirCabecalho(aba);

  // Usa o data_hora enviado pelo site para manter o formato uniforme com o
  // histórico da coluna. Se vier vazio, gera no fuso de São Paulo.
  const dataHora = dados.data_hora ||
    Utilities.formatDate(new Date(), "America/Sao_Paulo", "dd/MM/yyyy, HH:mm:ss");

  aba.appendRow([
    dataHora,
    dados.nome || "",
    dados.email || "",
    dados.telefone || "",
    dados.programa || "",
    dados.landing_page || "",
    dados.referrer || "direct",
    dados.utm_source || "",
    dados.utm_medium || "",
    dados.utm_campaign || "",
    dados.utm_term || "",
    dados.utm_content || "",
    dados.gclid || "",
    dados.fbclid || "",
    identificarOrigem(dados)
  ]);
}

/** Utilitário manual — deliberadamente fora do fluxo de envio. */
function ajustarColunas() {
  const aba = obterAba(SpreadsheetApp.openById(SPREADSHEET_ID));
  aba.autoResizeColumns(1, COLUNAS.length);
}

// =========================================
// E-MAIL DE NOTIFICAÇÃO (PARA A EQUIPE)
// =========================================

function enviarEmailNotificacao(dados, origem) {
  try {
    const assunto = origem === "checkout"
      ? `[HINIS] Checkout iniciado: ${dados.nome}`
      : `[HINIS] Novo contato: ${dados.nome}`;

    const temUTM = !!(dados.utm_source || dados.gclid || dados.fbclid);

    const corpo = `
      <div style="font-family: 'Montserrat', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #F5F5F5;">

        <div style="background-color: #BB9476; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: #FFFFFF; margin: 0; font-size: 24px; font-family: 'Playfair Display', serif;">
            ${origem === "checkout" ? "Checkout Iniciado" : "Novo Contato Recebido"}
          </h1>
        </div>

        <div style="background-color: #FFFFFF; padding: 30px; border-radius: 0 0 8px 8px;">

          <p style="color: #444444; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
            ${origem === "checkout"
              ? "Alguém preencheu os dados no pré-checkout e seguiu para o pagamento:"
              : "Você recebeu um novo contato através do formulário do site Hinis:"}
          </p>

          <div style="background-color: #F5F5F5; padding: 20px; border-radius: 8px; margin-bottom: 20px;">

            <div style="margin-bottom: 15px;">
              <strong style="color: #BB9476; display: inline-block; min-width: 120px;">Nome:</strong>
              <span style="color: #444444;">${dados.nome}</span>
            </div>

            <div style="margin-bottom: 15px;">
              <strong style="color: #BB9476; display: inline-block; min-width: 120px;">E-mail:</strong>
              <span style="color: #444444;">
                <a href="mailto:${dados.email}" style="color: #BB9476; text-decoration: none;">${dados.email}</a>
              </span>
            </div>

            ${dados.telefone ? `
            <div style="margin-bottom: 15px;">
              <strong style="color: #BB9476; display: inline-block; min-width: 120px;">Telefone:</strong>
              <span style="color: #444444;">
                <a href="tel:${dados.telefone}" style="color: #BB9476; text-decoration: none;">${dados.telefone}</a>
              </span>
            </div>
            ` : ''}

            <div style="margin-bottom: 15px;">
              <strong style="color: #BB9476; display: inline-block; min-width: 120px;">Programa:</strong>
              <span style="color: #444444;">${dados.programa || "Não especificado"}</span>
            </div>

            <div style="margin-bottom: 0;">
              <strong style="color: #BB9476; display: inline-block; min-width: 120px;">Origem:</strong>
              <span style="color: #444444;">${origem}</span>
            </div>

          </div>

          ${temUTM ? `
          <div style="background-color: #FFF9F5; padding: 20px; border-radius: 8px; margin-top: 20px; border-left: 3px solid #BB9476;">
            <h3 style="color: #BB9476; font-size: 14px; margin: 0 0 15px 0; font-weight: 600;">
              Origem do Lead
            </h3>

            ${dados.utm_source ? `
            <div style="margin-bottom: 10px;">
              <strong style="color: #7B7B7B; display: inline-block; min-width: 100px; font-size: 13px;">Origem:</strong>
              <span style="color: #444444; font-size: 13px;">${dados.utm_source}</span>
            </div>
            ` : ''}

            ${dados.utm_medium ? `
            <div style="margin-bottom: 10px;">
              <strong style="color: #7B7B7B; display: inline-block; min-width: 100px; font-size: 13px;">Canal:</strong>
              <span style="color: #444444; font-size: 13px;">${dados.utm_medium}</span>
            </div>
            ` : ''}

            ${dados.utm_campaign ? `
            <div style="margin-bottom: 10px;">
              <strong style="color: #7B7B7B; display: inline-block; min-width: 100px; font-size: 13px;">Campanha:</strong>
              <span style="color: #444444; font-size: 13px;">${dados.utm_campaign}</span>
            </div>
            ` : ''}

            ${dados.utm_term ? `
            <div style="margin-bottom: 10px;">
              <strong style="color: #7B7B7B; display: inline-block; min-width: 100px; font-size: 13px;">Termo:</strong>
              <span style="color: #444444; font-size: 13px;">${dados.utm_term}</span>
            </div>
            ` : ''}

            ${dados.utm_content ? `
            <div style="margin-bottom: 10px;">
              <strong style="color: #7B7B7B; display: inline-block; min-width: 100px; font-size: 13px;">Conteúdo:</strong>
              <span style="color: #444444; font-size: 13px;">${dados.utm_content}</span>
            </div>
            ` : ''}

            ${dados.gclid ? `
            <div style="margin-bottom: 10px;">
              <strong style="color: #7B7B7B; display: inline-block; min-width: 100px; font-size: 13px;">gclid:</strong>
              <span style="color: #444444; font-size: 13px;">${dados.gclid}</span>
            </div>
            ` : ''}

            ${dados.fbclid ? `
            <div style="margin-bottom: 10px;">
              <strong style="color: #7B7B7B; display: inline-block; min-width: 100px; font-size: 13px;">fbclid:</strong>
              <span style="color: #444444; font-size: 13px;">${dados.fbclid}</span>
            </div>
            ` : ''}

            <div style="margin-bottom: 10px;">
              <strong style="color: #7B7B7B; display: inline-block; min-width: 100px; font-size: 13px;">Página:</strong>
              <span style="color: #444444; font-size: 13px;">${dados.landing_page || "não informado"}</span>
            </div>

            ${(dados.referrer && dados.referrer !== "direct") ? `
            <div style="margin-bottom: 0;">
              <strong style="color: #7B7B7B; display: inline-block; min-width: 100px; font-size: 13px;">Veio de:</strong>
              <span style="color: #444444; font-size: 13px;">${dados.referrer}</span>
            </div>
            ` : ''}

          </div>
          ` : ''}

          <div style="text-align: center; margin-top: 30px;">
            <a href="mailto:${dados.email}"
               style="display: inline-block; background-color: #BB9476; color: #FFFFFF;
                      padding: 15px 40px; text-decoration: none; border-radius: 8px;
                      font-weight: 600; font-size: 16px;">
              Responder Contato
            </a>
          </div>

        </div>

        <div style="text-align: center; margin-top: 20px; padding: 20px;">
          <p style="color: #7B7B7B; font-size: 14px; margin: 0;">
            Este e-mail foi gerado automaticamente pelo formulário do site Hinis.
          </p>
          <p style="color: #7B7B7B; font-size: 12px; margin-top: 10px;">
            <a href="https://www.hinis.com.br" style="color: #BB9476; text-decoration: none;">
              www.hinis.com.br
            </a>
          </p>
        </div>

      </div>
    `;

    MailApp.sendEmail({
      to: EMAIL_DESTINO,
      subject: assunto,
      htmlBody: corpo,
      name: "Hinis Website"
    });

    console.log("✓ E-mail de notificação enviado");

  } catch (erro) {
    // Não relança: o lead já está na planilha. Uma falha de e-mail não pode
    // virar "erro ao enviar formulário" para quem preencheu.
    console.error("Erro ao enviar e-mail de notificação:", erro);
  }
}

// =========================================
// E-MAIL DE CONFIRMAÇÃO (PARA A PESSOA)
// =========================================

function enviarEmailConfirmacao(dados) {
  try {
    const assunto = "Recebemos sua mensagem - Hinis";

    const corpo = `
      <div style="font-family: 'Montserrat', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #F5F5F5;">

        <div style="background-color: #BB9476; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: #FFFFFF; margin: 0; font-size: 24px; font-family: 'Playfair Display', serif;">
            Obrigada por entrar em contato
          </h1>
        </div>

        <div style="background-color: #FFFFFF; padding: 30px; border-radius: 0 0 8px 8px;">

          <p style="color: #444444; font-size: 16px; line-height: 1.8; margin-bottom: 20px;">
            Olá, <strong style="color: #BB9476;">${dados.nome}</strong>.
          </p>

          <p style="color: #444444; font-size: 16px; line-height: 1.8; margin-bottom: 20px;">
            Recebemos sua mensagem. Entraremos em contato em breve para conversarmos sobre
            como a Hinis pode fazer parte da sua jornada de autocuidado.
          </p>

          ${(dados.programa && dados.programa !== "Outro") ? `
          <div style="background-color: #F5F5F5; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 3px solid #BB9476;">
            <p style="color: #444444; font-size: 14px; line-height: 1.6; margin: 0;">
              <strong style="color: #BB9476;">Programa de interesse:</strong> ${dados.programa}
            </p>
          </div>
          ` : ''}

          <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid #E0E0E0;">
            <h2 style="color: #BB9476; font-size: 18px; margin-bottom: 15px; font-family: 'Playfair Display', serif;">
              Enquanto aguarda, conheça os programas:
            </h2>

            <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="margin-bottom: 12px;">
                <a href="https://www.hinis.com.br/programas/essentia.html"
                   style="color: #BB9476; text-decoration: none; font-weight: 500;">
                  Essentia
                </a>
                <span style="color: #7B7B7B; font-size: 14px;"> — Você, no seu tempo</span>
              </li>

              <li style="margin-bottom: 12px;">
                <a href="https://www.hinis.com.br/programas/refugium.html"
                   style="color: #BB9476; text-decoration: none; font-weight: 500;">
                  Refugium
                </a>
                <span style="color: #7B7B7B; font-size: 14px;"> — De você, para você</span>
              </li>

              <li style="margin-bottom: 12px;">
                <a href="https://www.hinis.com.br/programas/amicae.html"
                   style="color: #BB9476; text-decoration: none; font-weight: 500;">
                  Amicae
                </a>
                <span style="color: #7B7B7B; font-size: 14px;"> — De você para elas. Delas para você</span>
              </li>
            </ul>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 30px; border-top: 1px solid #E0E0E0;">
            <p style="color: #7B7B7B; font-size: 14px; margin-bottom: 15px;">
              Nos acompanhe nas redes sociais:
            </p>

            <div style="margin-bottom: 20px;">
              <a href="https://www.instagram.com/drahexandrahertel/"
                 style="display: inline-block; margin: 0 10px; color: #BB9476; text-decoration: none; font-weight: 500;">
                Instagram
              </a>

              <a href="https://api.whatsapp.com/send?phone=${WHATSAPP}"
                 style="display: inline-block; margin: 0 10px; color: #BB9476; text-decoration: none; font-weight: 500;">
                WhatsApp
              </a>
            </div>
          </div>

        </div>

        <div style="text-align: center; margin-top: 20px; padding: 20px;">
          <p style="color: #7B7B7B; font-size: 14px; margin: 0;">
            Com carinho,<br>
            <strong style="color: #BB9476;">Dra. Hexandra Hertel e equipe Hinis</strong>
          </p>
          <p style="color: #7B7B7B; font-size: 12px; margin-top: 10px;">
            <a href="https://www.hinis.com.br" style="color: #BB9476; text-decoration: none;">
              www.hinis.com.br
            </a>
          </p>
        </div>

      </div>
    `;

    MailApp.sendEmail({
      to: dados.email,
      subject: assunto,
      htmlBody: corpo,
      name: "Hinis - Autoestima e Autocuidado"
    });

    console.log("✓ E-mail de confirmação enviado");

  } catch (erro) {
    console.error("Erro ao enviar e-mail de confirmação:", erro);
  }
}

// =========================================
// FUNÇÕES AUXILIARES
// =========================================

function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function criarResposta(sucesso, mensagem) {
  return ContentService
    .createTextOutput(JSON.stringify({
      sucesso: sucesso,
      mensagem: mensagem,
      versao: VERSAO
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// =========================================
// TESTES MANUAIS
// =========================================

/** Fluxo do formulário de contato: grava a linha e envia os dois e-mails. */
function testarContato() {
  const dados = {
    data_hora: Utilities.formatDate(new Date(), "America/Sao_Paulo", "dd/MM/yyyy, HH:mm:ss"),
    nome: "Teste Contato",
    email: EMAIL_DESTINO,
    telefone: "(21) 99404-1648",
    programa: "Essentia",
    landing_page: "https://www.hinis.com.br/contato.html",
    referrer: "direct",
    utm_source: "teste",
    utm_medium: "manual",
    utm_campaign: "validacao-deploy",
    origem: "contato"
  };

  salvarNaPlanilha(dados);
  if (ENVIAR_NOTIFICACAO) enviarEmailNotificacao(dados, "contato");
  if (ENVIAR_CONFIRMACAO) enviarEmailConfirmacao(dados);
  console.log("✓ Teste de contato concluído — confira a planilha e a caixa de entrada");
}

/** Fluxo do pré-checkout: grava a linha e notifica, sem e-mail de confirmação. */
function testarCheckout() {
  const dados = {
    data_hora: Utilities.formatDate(new Date(), "America/Sao_Paulo", "dd/MM/yyyy, HH:mm:ss"),
    nome: "Teste Checkout",
    email: EMAIL_DESTINO,
    telefone: "(21) 99404-1648",
    programa: "Essentia",
    landing_page: "https://www.hinis.com.br/checkout/essentia",
    referrer: "https://www.hinis.com.br/lp/essentia",
    utm_source: "meta",
    utm_medium: "cpc",
    utm_campaign: "essentia-conversao",
    fbclid: "TESTE_FBCLID",
    origem: "checkout"
  };

  salvarNaPlanilha(dados);
  if (ENVIAR_NOTIFICACAO) enviarEmailNotificacao(dados, "checkout");
  console.log("✓ Teste de checkout concluído — não envia e-mail de confirmação");
}
