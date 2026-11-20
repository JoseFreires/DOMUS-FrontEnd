import { api } from "@/services/http/apiClient";
import { ApiError } from "@/services/http/ApiError";

const texto = (v) => String(v ?? "").trim();
const apenasDigitos = (v) => String(v ?? "").replace(/\D/g, "");

const erroValidacao = (mensagem) =>
  new ApiError(mensagem, { status: 400, code: "VALIDATION" });

export function validarSindico({ nomeCompleto, email, cpf }) {
  const nome = texto(nomeCompleto);
  const emailLimpo = texto(email).toLowerCase();
  const cpfLimpo = apenasDigitos(cpf);

  if (!nome) throw erroValidacao("Informe o nome completo.");
  if (cpfLimpo.length !== 11) throw erroValidacao("O CPF deve ter 11 dígitos.");
  if (!/^\S+@\S+\.\S+$/.test(emailLimpo)) throw erroValidacao("Informe um e-mail válido.");
}

export async function createSindico({
  nomeCompleto,
  email,
  cpf,
  telefone,
  dataNascimento,
  foto,
}) {
  validarSindico({ nomeCompleto, email, cpf });

  const nome = texto(nomeCompleto);
  const emailLimpo = texto(email).toLowerCase();
  const cpfLimpo = apenasDigitos(cpf);
  const telefoneLimpo = apenasDigitos(telefone);

  const formData = new FormData();
  const append = (key, value) => {
    if (value !== undefined && value !== null && value !== "") {
      formData.append(key, value);
    }
  };

  // Pessoa
  append("pessoa.nomeCompleto", nome);
  append("pessoa.email", emailLimpo);
  append("pessoa.cpf", cpfLimpo);
  append("pessoa.telefone", telefoneLimpo);
  append("pessoa.dataNascimento", dataNascimento);

  // Login
  append("login.username", emailLimpo);
  append("login.senha", "123456");

  if (foto instanceof Blob) {
    formData.append("foto", foto, foto.name || `foto-${Date.now()}.jpg`);
  }

  return api.postForm("/sindicos", formData, {
    messages: {
      400: "Revise os dados do síndico e tente novamente.",
      403: "Você não tem permissão para cadastrar síndicos.",
      409: "Já existe um síndico ou usuário com este CPF ou e-mail.",
      413: "A foto é muito grande. Escolha um arquivo menor.",
      415: "Formato de imagem não suportado.",
      422: "Alguns dados são inválidos. Confira CPF, e-mail e datas.",
    },
  });
}