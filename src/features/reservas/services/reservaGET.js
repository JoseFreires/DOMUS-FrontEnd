import { api } from "@/services/http/apiClient";
import { ApiError } from "@/services/http/ApiError";

const DATA_ISO = /^\d{4}-\d{2}-\d{2}$/;

export function listReservasDisponiveis(data) {
  if (!DATA_ISO.test(String(data ?? ""))) {
    throw new ApiError("Informe uma data válida.", { status: 400, code: "VALIDATION" });
  }

  return api.get(`/reservas/disponiveis?data=${encodeURIComponent(data)}`, {
    messages: {
      400: "Data inválida. Escolha outra data.",
      403: "Você não tem permissão para consultar reservas.",
    },
  });
}


export function listMinhasReservas() {
  return api.get("/reservas/minhas", {
    messages: {
      403: "Você não tem permissão para consultar reservas.",
    },
  });
}

export function listReservasDoDia(data) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(data ?? ""))) {
    throw new ApiError("Informe uma data válida.", { status: 400, code: "VALIDATION" });
  }
  return api.get(`/reservas?data=${encodeURIComponent(data)}`, {
    messages: {
      400: "Data inválida. Escolha outra data.",
      403: "Você não tem permissão para consultar as reservas.",
    },
  });
}

export function listSolicitacoesReservas() {
  return api.get("/reservas/solicitacoes", {
    messages: {
      403: "Você não tem permissão para consultar as solicitações.",
    },
  });
}