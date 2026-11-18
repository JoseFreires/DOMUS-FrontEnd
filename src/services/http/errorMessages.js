// services/http/errorMessages.js
export const MENSAGENS_PADRAO = {
  400: "Dados inválidos. Revise as informações e tente novamente.",
  401: "Sua sessão expirou. Faça login novamente.",
  403: "Você não tem permissão para realizar esta ação.",
  404: "Registro não encontrado.",
  409: "Já existe um registro com esses dados.",
  413: "O arquivo enviado é muito grande.",
  415: "Formato de arquivo não suportado.",
  422: "Alguns dados não atendem aos requisitos.",
  429: "Muitas tentativas. Aguarde alguns instantes.",
  500: "Erro interno do servidor. Tente novamente em instantes.",
  503: "Serviço temporariamente indisponível. Tente novamente em instantes.",
};