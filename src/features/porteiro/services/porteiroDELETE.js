import { api } from "@/services/http/apiClient";

export async function softDeletePorteiro(id, reason) {
  await api.delete(`/porteiros/${encodeURIComponent(id)}`, {
    json: { deleted: true, deleteReason: reason },
    messages: {
      403: "Você não tem permissão para excluir porteiros.",
      404: "Porteiro não encontrado. Pode já ter sido removido.",
    },
  });
  return true;
}
