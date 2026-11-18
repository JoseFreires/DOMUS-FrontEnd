import { api } from "@/services/http/apiClient";

export async function softDeleteSindico(id, reason) {
  await api.delete(`/sindicos/${encodeURIComponent(id)}`, {
    json: { deleted: true, deleteReason: reason },
    messages: {
      403: "Você não tem permissão para excluir síndicos.",
      404: "Síndico não encontrado. Pode já ter sido removido.",
    },
  });
  return true;
}
