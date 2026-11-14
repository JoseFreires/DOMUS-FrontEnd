// services/httpError.js
const MENSAGENS_PADRAO = {
  400: "Dados inválidos. Revise as informações e tente novamente.",
  401: "Credenciais inválidas.",
  403: "Você não tem permissão para realizar esta ação.",
  404: "Recurso não encontrado.",
  409: "Esta operação conflita com o estado atual do registro.",
  422: "Alguns dados não atendem aos requisitos.",
  429: "Muitas tentativas. Aguarde alguns instantes e tente novamente.",
  500: "Erro interno do servidor. Tente novamente em instantes.",
  502: "Servidor indisponível. Tente novamente em instantes.",
  503: "Serviço temporariamente indisponível. Tente novamente em instantes.",
};

// Lê o corpo UMA vez e tenta interpretá-lo como JSON
export async function lerCorpo(response) {
  const rawText = await response.text().catch(() => "");
  if (!rawText) return null;
  try {
    return JSON.parse(rawText);
  } catch {
    return { _raw: rawText };
  }
}

// Só aceita texto do servidor se parecer uma mensagem de verdade
function mensagemDoServidor(data) {
  const msg = data?.message ?? data?.error ?? data?.detail;
  if (typeof msg !== "string") return null;
  const texto = msg.trim();
  if (!texto || texto.length > 200 || texto.startsWith("<")) return null;
  return texto;
}

export function criarErroHttp(response, data, overrides = {}) {
  const mensagem =
    mensagemDoServidor(data) ||
    overrides[response.status] ||
    MENSAGENS_PADRAO[response.status] ||
    (response.status >= 500
      ? MENSAGENS_PADRAO[500]
      : "Não foi possível concluir a operação.");

  const err = new Error(mensagem);
  err.status = response.status;
  err.fieldErrors = data?.errors ?? data?.fieldErrors ?? null; // erros por campo, se o back enviar
  return err;
}

// Converte falhas de rede em mensagem amigável
export function tratarFalhaDeRede(error) {
  if (error instanceof TypeError) {
    const err = new Error(
      "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente."
    );
    err.status = 0;
    err.isNetworkError = true;
    return err;
  }
  return error;
}