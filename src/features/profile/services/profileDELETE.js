import { api } from "@/services/http/apiClient";

// Exclui o cadastro do próprio usuário logado
export async function deleteProfile() {
  await api.delete("/auth/eu/perfil", {
    messages: {
      403: "Você não tem permissão para excluir este cadastro.",
      404: "Cadastro não encontrado.",
      409: "Não foi possível excluir o cadastro: existem pendências vinculadas a ele.",
    },
  });
  return true;
}
