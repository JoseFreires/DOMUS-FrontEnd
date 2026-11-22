import { request } from "@/services/http/apiClient";
import { ApiError } from "@/services/http/ApiError";

export function validarIdReserva(id) {
  const n = Number(id);
  if (!Number.isInteger(n) || n <= 0) {
    throw new ApiError("Não foi possível identificar a reserva.", { status: 400, code: "VALIDATION" });
  }
  return n;
}

// Aprovar
export async function confirmarReserva(id) {
  const n = validarIdReserva(id);
  await request(`/reservas/${n}/confirmar`, {
    method: "PATCH",
    messages: {
      403: "Você não tem permissão para aprovar reservas.",
      404: "Reserva não encontrada.",
      409: "Esta reserva já foi decidida ou não pode mais ser confirmada.",
    },
  });
  return true;
}

// Reprovar
export async function cancelarReserva(id, justificativa) {
  const n = validarIdReserva(id);
  const texto = String(justificativa ?? "").trim();

  await request(`/reservas/${n}/negar`, {
    method: "PUT",
    // só envia corpo se houver justificativa (ver observação abaixo)
    ...(texto && { json: { justificativa: texto } }),
    messages: {
      403: "Você não tem permissão para reprovar reservas.",
      404: "Reserva não encontrada.",
      409: "Esta reserva já foi decidida ou não pode mais ser cancelada.",
    },
  });
  return true;
}