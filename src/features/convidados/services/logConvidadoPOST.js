import { api } from "@/services/http/apiClient";
import { ApiError } from "@/services/http/ApiError";

function idValido(valor, mensagem) {
  const n = Number(valor);
  if (!Number.isInteger(n) || n <= 0) {
    throw new ApiError(mensagem, { status: 400, code: "VALIDATION" });
  }
  return n;
}

export function registrarChegadaConvidado({ idMorador, idConvidado }) {
  const moradorId = idValido(idMorador, "Não foi possível identificar o morador.");
  const convidadoId = idValido(idConvidado, "Não foi possível identificar o convidado.");

  return api.post(
    `/log-convidado/morador/${moradorId}/convidados/${convidadoId}`,
    undefined, 
    {
      messages: {
        400: "Não foi possível registrar a chegada. Revise os dados.",
        403: "Você não tem permissão para registrar chegadas.",
        404: "Morador ou convidado não encontrado.",
        409: "A chegada deste convidado já foi registrada.",
        422: "Este convidado não pode ser registrado agora (inativo ou fora da data da visita).",
      },
    }
  );
}