import { api } from "@/services/http/apiClient";
import { ApiError } from "@/services/http/ApiError";

const texto = (v) => String(v ?? "").trim();
const apenasDigitos = (v) => String(v ?? "").replace(/\D/g, "");

const erroValidacao = (mensagem) =>
  new ApiError(mensagem, { status: 400, code: "VALIDATION" });

export async function updateProfile({ nomeCompleto, email, telefone, foto }) {
  const emailLimpo = texto(email).toLowerCase();

  if (!texto(nomeCompleto)) throw erroValidacao("Informe o nome completo.");
  if (!/^\S+@\S+\.\S+$/.test(emailLimpo)) throw erroValidacao("Informe um e-mail válido.");

  const formData = new FormData();
  formData.append("nomeCompleto", texto(nomeCompleto));
  formData.append("email", emailLimpo);
  formData.append("telefone", apenasDigitos(telefone));

  // Só envia a foto se o usuário escolheu uma nova
  if (foto instanceof Blob) {
    formData.append("foto", foto, foto.name || `foto-${Date.now()}.jpg`);
  }

  await api.putForm("/auth/eu/perfil", formData, {
    messages: {
      400: "Revise os dados do perfil e tente novamente.",
      403: "Você não tem permissão para alterar este perfil.",
      409: "Este e-mail já está em uso por outra conta.",
      413: "A foto é muito grande. Escolha um arquivo menor.",
      415: "Formato de imagem não suportado.",
    },
  });
  return true;
}
