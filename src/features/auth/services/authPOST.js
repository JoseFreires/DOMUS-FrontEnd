import { lerCorpo, criarErroHttp, tratarFalhaDeRede } from "./httpError.js";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function login(username, senha) {
  try {
    const response = await fetch(`${API_URL}/auth/entrar`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ senha, username }),
    });

    const data = await lerCorpo(response);

    if (!response.ok) {
      throw criarErroHttp(response, data, {
        400: "Informe e-mail e senha.",
        401: "E-mail ou senha incorretos.",
        403: "Sua conta está desativada ou sem acesso. Contate o síndico.",
      });
    }

    return data;
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    throw tratarFalhaDeRede(error);
  }
}

export async function solicitarRedefinicaoSenha(email) {
  try {
    const response = await fetch(`${API_URL}/auth/esqueci-minha-senha`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: String(email ?? "").trim() }),
    });

    const data = await lerCorpo(response);

    if (!response.ok) {
      throw criarErroHttp(response, data, {
        400: "Informe um e-mail válido.",
        429: "Você já solicitou a redefinição recentemente. Aguarde alguns minutos.",
      });
    }

    return data;
  } catch (error) {
    console.error("Erro ao solicitar redefinição de senha:", error);
    throw tratarFalhaDeRede(error);
  }
}

export async function redefinirSenha({ token, novaSenha, confirmarSenha } = {}) {
  try {
    const baseUrl = `${API_URL}/auth/redefinir-senha`;
    const url = token ? `${baseUrl}?token=${encodeURIComponent(token)}` : baseUrl;

    const payload = { novaSenha };
    if (confirmarSenha !== undefined) payload.confirmarSenha = confirmarSenha;

    const response = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) return true;

    const data = await lerCorpo(response);

    throw criarErroHttp(response, data, {
      400: "O link de recuperação é inválido. Solicite uma nova redefinição de senha.",
      409: "Este link de recuperação já foi utilizado. Solicite uma nova redefinição de senha.",
      410: "O link de recuperação expirou. Solicite uma nova redefinição de senha.",
      422: "A nova senha não atende aos requisitos de segurança.",
    });
  } catch (error) {
    console.error("Erro ao redefinir senha:", error);
    throw tratarFalhaDeRede(error);
  }
}