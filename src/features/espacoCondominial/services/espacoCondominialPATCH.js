import { request } from "@/services/http/apiClient";


export async function patchEspacoCondominial(id) {
  await request(`/espacos/inativos/reativar/${encodeURIComponent(id)}`, {
    method: "PATCH",
    json: { deleted: true }, 
    messages: {
      403: "Você não tem permissão para ativar espaços condominiais.",
      404: "Espaço condominial não encontrado.",
    },
  });
  return true;
}
