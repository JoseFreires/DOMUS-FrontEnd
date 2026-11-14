import { api } from "@/services/http/apiClient";

export function aceitarTermosDeUso() {
  return api.put("/auth/aceitar-termos", undefined, {
    messages: {
      401: "Sua sessão expirou. Faça login novamente.",
      403: "Você não tem permissão para realizar esta ação.",
      404: "Usuário não encontrado.",
    },
  });
}