import { api } from "@/services/http/apiClient";

export async function logout() {
  try {
    await api.post("/auth/sair", undefined, { skipAuthRedirect: true });
    return true;
  } catch (error) {
    console.error("Erro ao encerrar sessão:", error);
    return false;
  }
}
