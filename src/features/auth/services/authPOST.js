import { api } from "@/services/http/apiClient";

export function login(username, senha) {
  return api.post(
    "/auth/entrar",
    { username, senha },
    {
      skipAuthRedirect: true,
      messages: {
        400: "Informe e-mail e senha.",
        401: "E-mail ou senha incorretos.",
        403: "Sua conta está desativada ou sem acesso. Contate o síndico.",
        429: "Muitas tentativas de login. Aguarde alguns minutos.",
      },
    }
  );
}

export function solicitarRedefinicaoSenha(email) {
  return api.post(
    "/auth/esqueci-minha-senha",
    { email: String(email ?? "").trim().toLowerCase() },
    {
      skipAuthRedirect: true,
      messages: {
        400: "Informe um e-mail válido.",
        429: "Você já solicitou a redefinição recentemente. Aguarde alguns minutos.",
      },
    }
  );
}

export async function redefinirSenha({ token, novaSenha, confirmarSenha } = {}) {
  const path = token
    ? `/auth/redefinir-senha?token=${encodeURIComponent(token)}`
    : "/auth/redefinir-senha";

  const payload = { novaSenha };
  if (confirmarSenha !== undefined) payload.confirmarSenha = confirmarSenha;

  await api.put(path, payload, {
    skipAuthRedirect: true,
    messages: {
      400: "O link de recuperação é inválido. Solicite uma nova redefinição de senha.",
      409: "Este link de recuperação já foi utilizado. Solicite uma nova redefinição de senha.",
      410: "O link de recuperação expirou. Solicite uma nova redefinição de senha.",
      422: "A nova senha não atende aos requisitos de segurança.",
    },
  });
  return true;
}
