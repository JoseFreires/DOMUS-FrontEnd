import { api } from "@/services/http/apiClient";
import { ApiError } from "@/services/http/ApiError";

export async function createReserva({ idEspacoCondominial, dataReserva, quantidadeConvidados }) {
  const id = Number(idEspacoCondominial);
  const qtd = Number(quantidadeConvidados);

  if (!Number.isInteger(id) || id <= 0) {
    throw new ApiError("Selecione um espaço para reservar.", { status: 400, code: "VALIDATION" });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(dataReserva ?? ""))) {
    throw new ApiError("Selecione uma data válida.", { status: 400, code: "VALIDATION" });
  }
  if (!Number.isInteger(qtd) || qtd < 0) {
    throw new ApiError("Informe a quantidade de convidados.", { status: 400, code: "VALIDATION" });
  }

  return api.post(
    `/reservas/disponiveis/${id}?data=${encodeURIComponent(dataReserva)}`,
    { quantidadeConvidados: qtd },
    {
      messages: {
        400: "Revise os dados da reserva e tente novamente.",
        403: "Você não tem permissão para solicitar reservas.",
        404: "Espaço não encontrado.",
        409: "Este espaço já foi reservado para essa data. Escolha outra data ou outro espaço.",
      },
    }
  );
}