import { api } from "@/services/http/apiClient";
import { ApiError } from "@/services/http/ApiError";

export async function deliverEncomenda(id, tipoRetirada) {
  if (id === undefined || id === null || id === "") {
    throw new ApiError("Não foi possível identificar a encomenda.", {
      status: 400,
      code: "VALIDATION",
    });
  }

  return api.put(
    `/encomendas/${encodeURIComponent(id)}/entrega`,
    { idEncomenda: id, tipoRetirada },
    {
      messages: {
        400: "Não foi possível registrar a entrega. Revise os dados.",
        403: "Você não tem permissão para registrar entregas.",
        404: "Encomenda não encontrada.",
        409: "Esta encomenda já foi entregue.",
      },
    }
  );
}
