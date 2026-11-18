import { api } from "@/services/http/apiClient";
import { ApiError } from "@/services/http/ApiError";

const texto = (v) => String(v ?? "").trim();
const apenasDigitos = (v) => String(v ?? "").replace(/\D/g, "");

const erroValidacao = (mensagem) =>
  new ApiError(mensagem, { status: 400, code: "VALIDATION" });

export async function updateConvidado(id, {
  nome,
  email,
  telefone,
  cpf,
  dataNascimento,
  dataVisita,
  horaEntrada,
  horaSaida,
}) {
  if (id === undefined || id === null || id === "") {
    throw erroValidacao("Não foi possível identificar o convidado a ser atualizado.");
  }

  const nomeLimpo = texto(nome);
  const emailLimpo = texto(email).toLowerCase();
  const cpfLimpo = apenasDigitos(cpf);

  if (!nomeLimpo) throw erroValidacao("Informe o nome do convidado.");
  if (emailLimpo && !/^\S+@\S+\.\S+$/.test(emailLimpo)) throw erroValidacao("Informe um e-mail válido.");
  if (cpfLimpo && cpfLimpo.length !== 11) throw erroValidacao("O CPF deve ter 11 dígitos.");
  if (horaEntrada && horaSaida && horaSaida <= horaEntrada) {
    throw erroValidacao("A hora de saída deve ser depois da hora de entrada.");
  }

  await api.put(
    `/convidados/${encodeURIComponent(id)}`,
    {
      nome: nomeLimpo,
      email: emailLimpo,
      telefone: apenasDigitos(telefone),
      cpf: cpfLimpo,
      dataNascimento,
      dataVisita,
      horaEntrada,
      horaSaida,
    },
    {
      messages: {
        400: "Revise os dados do convidado e tente novamente.",
        403: "Você não tem permissão para editar convidados.",
        404: "Convidado não encontrado. Ele pode ter sido removido.",
        409: "Já existe um convidado com este CPF ou e-mail.",
        422: "Alguns dados do convidado são inválidos. Confira CPF, datas e horários.",
      },
    }
  );
  return true;
}
