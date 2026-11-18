import { api } from "@/services/http/apiClient";

// "Excluir" aqui é desativar (soft delete)
export async function softDeleteEspacoCondominial(id) {
  await api.delete(`/espacos/${encodeURIComponent(id)}`, {
    json: { deleted: true },
    messages: {
      403: "Você não tem permissão para desativar espaços condominiais.",
      404: "Espaço condominial não encontrado.",
      409: "Este espaço possui reservas pendentes e não pode ser desativado.",
    },
  });
  return true;
}
