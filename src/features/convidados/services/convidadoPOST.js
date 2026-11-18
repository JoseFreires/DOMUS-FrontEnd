import { api } from "@/services/http/apiClient";

const apenasDigitos = (v) => String(v ?? "").replace(/\D/g, "");
const texto = (v) => String(v ?? "").trim();

export function createConvidado({
  nome,
  email,
  telefone,
  cpf,
  dataNascimento,
  dataVisita,
  horaEntrada,
  horaSaida,
}) {
  return api.post(
    "/convidados",
    {
      nome: texto(nome),
      email: texto(email).toLowerCase(),
      telefone: apenasDigitos(telefone),
      cpf: apenasDigitos(cpf),
      dataNascimento,
      dataVisita,
      horaEntrada,
      horaSaida,
    },
    {
      messages: {
        400: "Revise os dados do convidado e tente novamente.",
        403: "Você não tem permissão para cadastrar convidados.",
        409: "Já existe um convidado com este CPF ou e-mail.",
        422: "Alguns dados do convidado são inválidos. Confira CPF, datas e horários.",
      },
    }
  );
}