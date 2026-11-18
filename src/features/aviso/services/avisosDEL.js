import { api } from "@/services/http/apiClient";

export async function deleteAviso(id) {
  await api.delete(`/avisos/${encodeURIComponent(id)}`, {
    messages: {
      403: "Você não tem permissão para excluir avisos.",
      404: "Aviso não encontrado. Ele pode já ter sido removido.",
    },
  });
  return true;
}
