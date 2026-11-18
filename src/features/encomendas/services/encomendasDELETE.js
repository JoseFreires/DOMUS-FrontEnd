import { api } from "@/services/http/apiClient";

export async function softDeleteEncomenda(id, reason) {
  await api.delete(`/encomendas/${encodeURIComponent(id)}`, {
    json: { deleted: true, deleteReason: reason },
    messages: {
      403: "Você não tem permissão para excluir encomendas.",
      404: "Encomenda não encontrada. Ela pode já ter sido removida.",
    },
  });
  return true;
}
