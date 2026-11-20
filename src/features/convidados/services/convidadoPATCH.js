import { api, request } from "@/services/http/apiClient";
import { ApiError } from "@/services/http/ApiError";

function validarId(id) {
  if (id === undefined || id === null || id === "") {
    throw new ApiError("Não foi possível identificar o convidado.", { status: 400, code: "VALIDATION" });
  }
  return encodeURIComponent(id);
}

// Inativar (soft delete)
export async function inativarConvidado(id) {
  await request(`/convidados/${validarId(id)}/inativar`, {
    method: "PATCH",
    messages: {
      403: "Você não tem permissão para inativar convidados.",
      404: "Convidado não encontrado.",
    },
  });
  return true;
}

// Reativar
export async function ativarConvidado(id) {
  await request(`/convidados/${validarId(id)}/ativar`, {
    method: "PATCH",
    messages: {
      403: "Você não tem permissão para ativar convidados.",
      404: "Convidado não encontrado.",
    },
  });
  return true;
}