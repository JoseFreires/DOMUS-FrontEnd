import { api } from "@/services/http/apiClient";
import { ApiError } from "@/services/http/ApiError";

const texto = (v) => String(v ?? "").trim();
const apenasDigitos = (v) => String(v ?? "").replace(/\D/g, "");

const erroValidacao = (mensagem) =>
  new ApiError(mensagem, { status: 400, code: "VALIDATION" });

export async function updateSindico(id, {
  // pessoa
  nomeCompleto,
  cpf,
  email,
  telefone,
  dataNascimento,
  // login (opcionais na edição)
  username,
  senha,
  // foto
  foto,
}) {
  if (id === undefined || id === null || id === "") {
    throw erroValidacao("Não foi possível identificar o síndico a ser atualizado.");
  }

  const cpfLimpo = apenasDigitos(cpf);
  const emailLimpo = texto(email).toLowerCase();

  if (!texto(nomeCompleto)) throw erroValidacao("Informe o nome completo.");
  if (cpfLimpo && cpfLimpo.length !== 11) throw erroValidacao("O CPF deve ter 11 dígitos.");
  if (emailLimpo && !/^\S+@\S+\.\S+$/.test(emailLimpo)) throw erroValidacao("Informe um e-mail válido.");

  const formData = new FormData();
  const append = (key, value) => {
    if (value !== undefined && value !== null) formData.append(key, value);
  };

  append("nomeCompleto", texto(nomeCompleto));
  append("cpf", cpfLimpo);
  append("email", emailLimpo);
  append("telefone", apenasDigitos(telefone));
  append("dataNascimento", dataNascimento);

  // Login: só envia se preenchido
  if (username) append("login.username", texto(username).toLowerCase());
  if (senha) append("login.senha", senha);

  if (foto instanceof Blob) {
    formData.append("foto", foto, foto.name || `foto-${Date.now()}.jpg`);
  }

  await api.putForm(`/sindicos/${encodeURIComponent(id)}`, formData, {
    messages: {
      400: "Revise os dados do síndico e tente novamente.",
      403: "Você não tem permissão para editar síndicos.",
      404: "Síndico não encontrado. Ele pode ter sido removido.",
      409: "Já existe um síndico ou usuário com este CPF ou e-mail.",
      413: "A foto é muito grande. Escolha um arquivo menor.",
      415: "Formato de imagem não suportado.",
      422: "Alguns dados são inválidos. Confira CPF, e-mail e datas.",
    },
  });
  return true;
}
