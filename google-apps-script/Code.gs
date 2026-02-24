/**
 * HINIS - GOOGLE APPS SCRIPT PARA FORMULÁRIO DE CONTATO
 *
 * Este script processa formulários de contato e:
 * 1. Salva os dados em uma planilha Google Sheets
 * 2. Envia e-mail de notificação para pedro@performartech.com.br
 * 3. Envia e-mail de confirmação para o usuário
 *
 * INSTRUÇÕES DE INSTALAÇÃO:
 * 1. Acesse: https://script.google.com/
 * 2. Crie novo projeto
 * 3. Cole este código
 * 4. Configure a planilha (ver instruções abaixo)
 * 5. Faça deploy como Web App
 */

// =========================================
// CONFIGURAÇÕES
// =========================================

// E-mail que receberá as notificações
const EMAIL_DESTINO = "pedro@performartech.com.br";

// ID da planilha onde os dados serão salvos
// Deixe vazio para criar automaticamente ou cole o ID da sua planilha
const SPREADSHEET_ID = "1spylp5dxRwP_vPAkMLFkMTzu4ebodxki7VIji00ZFls";

// Nome da aba onde os dados serão salvos
const SHEET_NAME = "Contatos";

// =========================================
// FUNÇÃO PRINCIPAL - PROCESSA O FORMULÁRIO
// =========================================

function doPost(e) {
  try {
    // Log de recebimento
    console.log("=== RECEBENDO REQUISIÇÃO ===");
    console.log("Tipo de conteúdo:", e.postData?.type);
    console.log("Conteúdo bruto:", e.postData?.contents);

    // Parseia os dados recebidos
    const dados = JSON.parse(e.postData.contents);
    console.log("Dados parseados:", JSON.stringify(dados));

    // Valida os dados obrigatórios
    if (!dados.nome || !dados.email) {
      console.log("ERRO: Dados obrigatórios faltando");
      return criarResposta(false, "Nome e e-mail são obrigatórios");
    }

    // Valida formato do e-mail
    if (!validarEmail(dados.email)) {
      console.log("ERRO: E-mail inválido:", dados.email);
      return criarResposta(false, "E-mail inválido");
    }

    // Salva na planilha
    console.log("Salvando na planilha...");
    salvarNaPlanilha(dados);
    console.log("✓ Salvo na planilha");

    // Envia e-mail de notificação para Hinis
    console.log("Enviando e-mail de notificação...");
    enviarEmailNotificacao(dados);
    console.log("✓ E-mail de notificação enviado");

    // Envia e-mail de confirmação para o usuário
    console.log("Enviando e-mail de confirmação...");
    enviarEmailConfirmacao(dados);
    console.log("✓ E-mail de confirmação enviado");

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
// SALVAR DADOS NA PLANILHA
// =========================================

function salvarNaPlanilha(dados) {
  try {
    // Obtém ou cria a planilha
    let planilha;

    if (SPREADSHEET_ID) {
      planilha = SpreadsheetApp.openById(SPREADSHEET_ID);
    } else {
      // Cria nova planilha se não existir
      planilha = SpreadsheetApp.create("Hinis - Contatos");
      console.log("Planilha criada com ID:", planilha.getId());
      console.log("Acesse em:", planilha.getUrl());
    }

    // Obtém ou cria a aba
    let aba = planilha.getSheetByName(SHEET_NAME);
    if (!aba) {
      aba = planilha.insertSheet(SHEET_NAME);

      // Adiciona cabeçalhos
      aba.appendRow([
        "Data/Hora",
        "Nome",
        "E-mail",
        "Telefone",
        "Programa",
        "Mensagem",
        "UTM Source",
        "UTM Medium",
        "UTM Campaign",
        "UTM Term",
        "UTM Content",
        "Landing Page",
        "Referrer",
        "Status"
      ]);

      // Formata cabeçalhos
      const cabecalho = aba.getRange(1, 1, 1, 14);
      cabecalho.setFontWeight("bold");
      cabecalho.setBackground("#BB9476");
      cabecalho.setFontColor("#FFFFFF");
    }

    // Adiciona nova linha com os dados
    aba.appendRow([
      new Date(),
      dados.nome || "",
      dados.email || "",
      dados.telefone || "",
      dados.programa || "Não especificado",
      dados.mensagem || "",
      dados.utm_source || "não informado",
      dados.utm_medium || "não informado",
      dados.utm_campaign || "não informado",
      dados.utm_term || "não informado",
      dados.utm_content || "não informado",
      dados.landing_page || "não informado",
      dados.referrer || "direct",
      "Novo"
    ]);

    // Auto-ajusta largura das colunas
    aba.autoResizeColumns(1, 14);

  } catch (erro) {
    console.error("Erro ao salvar na planilha:", erro);
    throw erro;
  }
}

// =========================================
// ENVIAR E-MAIL DE NOTIFICAÇÃO (PARA HINIS)
// =========================================

function enviarEmailNotificacao(dados) {
  try {
    const assunto = `[HINIS] Novo contato: ${dados.nome}`;

    const corpo = `
      <div style="font-family: 'Montserrat', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #F5F5F5;">

        <!-- Header -->
        <div style="background-color: #BB9476; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: #FFFFFF; margin: 0; font-size: 24px; font-family: 'Playfair Display', serif;">
            Novo Contato Recebido
          </h1>
        </div>

        <!-- Body -->
        <div style="background-color: #FFFFFF; padding: 30px; border-radius: 0 0 8px 8px;">

          <p style="color: #444444; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
            Você recebeu um novo contato através do formulário do site Hinis:
          </p>

          <!-- Dados do Contato -->
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

            ${dados.mensagem ? `
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #E0E0E0;">
              <strong style="color: #BB9476; display: block; margin-bottom: 10px;">Mensagem:</strong>
              <p style="color: #444444; line-height: 1.8; margin: 0;">
                ${dados.mensagem.replace(/\n/g, '<br>')}
              </p>
            </div>
            ` : ''}

          </div>

          <!-- Dados de Rastreamento (UTM) -->
          ${(dados.utm_source && dados.utm_source !== "não informado") ? `
          <div style="background-color: #FFF9F5; padding: 20px; border-radius: 8px; margin-top: 20px; border-left: 3px solid #BB9476;">
            <h3 style="color: #BB9476; font-size: 14px; margin: 0 0 15px 0; font-weight: 600;">
              📊 Origem do Lead
            </h3>

            <div style="margin-bottom: 10px;">
              <strong style="color: #7B7B7B; display: inline-block; min-width: 100px; font-size: 13px;">Origem:</strong>
              <span style="color: #444444; font-size: 13px;">${dados.utm_source}</span>
            </div>

            <div style="margin-bottom: 10px;">
              <strong style="color: #7B7B7B; display: inline-block; min-width: 100px; font-size: 13px;">Canal:</strong>
              <span style="color: #444444; font-size: 13px;">${dados.utm_medium}</span>
            </div>

            <div style="margin-bottom: 10px;">
              <strong style="color: #7B7B7B; display: inline-block; min-width: 100px; font-size: 13px;">Campanha:</strong>
              <span style="color: #444444; font-size: 13px;">${dados.utm_campaign}</span>
            </div>

            ${(dados.utm_term && dados.utm_term !== "não informado") ? `
            <div style="margin-bottom: 10px;">
              <strong style="color: #7B7B7B; display: inline-block; min-width: 100px; font-size: 13px;">Termo:</strong>
              <span style="color: #444444; font-size: 13px;">${dados.utm_term}</span>
            </div>
            ` : ''}

            ${(dados.utm_content && dados.utm_content !== "não informado") ? `
            <div style="margin-bottom: 10px;">
              <strong style="color: #7B7B7B; display: inline-block; min-width: 100px; font-size: 13px;">Conteúdo:</strong>
              <span style="color: #444444; font-size: 13px;">${dados.utm_content}</span>
            </div>
            ` : ''}

            <div style="margin-bottom: 10px;">
              <strong style="color: #7B7B7B; display: inline-block; min-width: 100px; font-size: 13px;">Primeira Página:</strong>
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

          <!-- CTA Button -->
          <div style="text-align: center; margin-top: 30px;">
            <a href="mailto:${dados.email}"
               style="display: inline-block; background-color: #BB9476; color: #FFFFFF;
                      padding: 15px 40px; text-decoration: none; border-radius: 8px;
                      font-weight: 600; font-size: 16px;">
              Responder Contato
            </a>
          </div>

        </div>

        <!-- Footer -->
        <div style="text-align: center; margin-top: 20px; padding: 20px;">
          <p style="color: #7B7B7B; font-size: 14px; margin: 0;">
            Este e-mail foi gerado automaticamente pelo formulário de contato do site Hinis.
          </p>
          <p style="color: #7B7B7B; font-size: 12px; margin-top: 10px;">
            <a href="https://www.hinis.com.br" style="color: #BB9476; text-decoration: none;">
              www.hinis.com.br
            </a>
          </p>
        </div>

      </div>
    `;

    // Envia o e-mail
    MailApp.sendEmail({
      to: EMAIL_DESTINO,
      subject: assunto,
      htmlBody: corpo,
      name: "Hinis Website"
    });

  } catch (erro) {
    console.error("Erro ao enviar e-mail de notificação:", erro);
    throw erro;
  }
}

// =========================================
// ENVIAR E-MAIL DE CONFIRMAÇÃO (PARA USUÁRIO)
// =========================================

function enviarEmailConfirmacao(dados) {
  try {
    const assunto = "Recebemos sua mensagem - Hinis";

    const corpo = `
      <div style="font-family: 'Montserrat', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #F5F5F5;">

        <!-- Header -->
        <div style="background-color: #BB9476; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: #FFFFFF; margin: 0; font-size: 24px; font-family: 'Playfair Display', serif;">
            Obrigada por entrar em contato!
          </h1>
        </div>

        <!-- Body -->
        <div style="background-color: #FFFFFF; padding: 30px; border-radius: 0 0 8px 8px;">

          <p style="color: #444444; font-size: 16px; line-height: 1.8; margin-bottom: 20px;">
            Olá, <strong style="color: #BB9476;">${dados.nome}</strong>!
          </p>

          <p style="color: #444444; font-size: 16px; line-height: 1.8; margin-bottom: 20px;">
            Recebemos sua mensagem e ficamos muito felizes com seu interesse em cuidar de si.
          </p>

          <p style="color: #444444; font-size: 16px; line-height: 1.8; margin-bottom: 20px;">
            Entraremos em contato em breve para conversarmos sobre como a Hinis pode fazer parte
            da sua jornada de autocuidado e fortalecimento da autoestima.
          </p>

          ${dados.programa && dados.programa !== "Outro" ? `
          <div style="background-color: #F5F5F5; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 3px solid #BB9476;">
            <p style="color: #444444; font-size: 14px; line-height: 1.6; margin: 0;">
              <strong style="color: #BB9476;">Programa de interesse:</strong> ${dados.programa}
            </p>
          </div>
          ` : ''}

          <!-- Programas -->
          <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid #E0E0E0;">
            <h2 style="color: #BB9476; font-size: 18px; margin-bottom: 15px; font-family: 'Playfair Display', serif;">
              Enquanto aguarda, conheça nossos programas:
            </h2>

            <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="margin-bottom: 12px;">
                <a href="https://www.hinis.com.br/programas/essencia.html"
                   style="color: #BB9476; text-decoration: none; font-weight: 500;">
                  ◇ Essência
                </a>
                <span style="color: #7B7B7B; font-size: 14px;"> - Você, no seu tempo</span>
              </li>

              <li style="margin-bottom: 12px;">
                <a href="https://www.hinis.com.br/programas/climax.html"
                   style="color: #BB9476; text-decoration: none; font-weight: 500;">
                  ◆ Clímax
                </a>
                <span style="color: #7B7B7B; font-size: 14px;"> - De você, para você</span>
              </li>

              <li style="margin-bottom: 12px;">
                <a href="https://www.hinis.com.br/programas/bff.html"
                   style="color: #BB9476; text-decoration: none; font-weight: 500;">
                  ❖ BFF
                </a>
                <span style="color: #7B7B7B; font-size: 14px;"> - De você para elas. Delas para você</span>
              </li>
            </ul>
          </div>

          <!-- Redes Sociais -->
          <div style="text-align: center; margin-top: 30px; padding-top: 30px; border-top: 1px solid #E0E0E0;">
            <p style="color: #7B7B7B; font-size: 14px; margin-bottom: 15px;">
              Nos acompanhe nas redes sociais:
            </p>

            <div style="margin-bottom: 20px;">
              <a href="https://www.instagram.com/drahexandrahertel/"
                 style="display: inline-block; margin: 0 10px; color: #BB9476; text-decoration: none; font-weight: 500;">
                Instagram
              </a>

              <a href="https://api.whatsapp.com/send?phone=5521988602474"
                 style="display: inline-block; margin: 0 10px; color: #BB9476; text-decoration: none; font-weight: 500;">
                WhatsApp
              </a>
            </div>
          </div>

        </div>

        <!-- Footer -->
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

    // Envia o e-mail
    MailApp.sendEmail({
      to: dados.email,
      subject: assunto,
      htmlBody: corpo,
      name: "Hinis - Autoestima e Autocuidado"
    });

  } catch (erro) {
    console.error("Erro ao enviar e-mail de confirmação:", erro);
    // Não lança erro aqui para não impedir o resto do fluxo
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
      mensagem: mensagem
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// =========================================
// FUNÇÃO PARA TESTAR O SCRIPT
// =========================================

function testarScript() {
  const dadosTeste = {
    nome: "Maria Silva",
    email: "teste@exemplo.com",
    telefone: "(21) 98765-4321",
    programa: "Essência",
    mensagem: "Gostaria de saber mais sobre o programa Essência."
  };

  try {
    salvarNaPlanilha(dadosTeste);
    enviarEmailNotificacao(dadosTeste);
    enviarEmailConfirmacao(dadosTeste);

    console.log("✓ Teste executado com sucesso!");
    console.log("Verifique:");
    console.log("1. Planilha com os dados salvos");
    console.log("2. E-mail de notificação em", EMAIL_DESTINO);
    console.log("3. E-mail de confirmação em", dadosTeste.email);

  } catch (erro) {
    console.error("✗ Erro no teste:", erro);
  }
}
