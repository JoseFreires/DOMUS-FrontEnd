import { api } from "@/services/http/apiClient";

export async function softDeleteMorador(id, reason) {
  await api.delete(`/moradores/${encodeURIComponent(id)}`, {
    json: { deleted: true, deleteReason: reason },
    messages: {
      403: "Você não tem permissão para excluir moradores.",
      404: "Morador não encontrado. Pode já ter sido removido.",
    },
  });
  return true;
}
