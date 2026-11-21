import { api } from "@/services/http/apiClient";

export function listLogConvidados() {
  return api.get("/log-convidado", {
    messages: {
      403: "Você não tem permissão para consultar os registros de convidados.",
    },
  });
}