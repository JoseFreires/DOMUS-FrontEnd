import { api } from "@/services/http/apiClient";
import { ApiError } from "@/services/http/ApiError";

const texto = (v) => String(v ?? "").trim();

const erroValidacao = (mensagem) =>
  new ApiError(mensagem, { status: 400, code: "VALIDATION" });

export async function createVisitante({ nome, idTipoVisita, idMoradia }) {
  const nomeLimpo = texto(nome);
  const tipo = Number(idTipoVisita);
  const moradia = Number(idMoradia);

  if (!nomeLimpo) throw erroValidacao("Informe o nome do visitante.");
  if (!Number.isInteger(tipo) || tipo <= 0) throw erroValidacao("Selecione o tipo de visita.");
  if (!Number.isInteger(moradia) || moradia <= 0) throw erroValidacao("Selecione a moradia.");

  return api.post(
    "/visitantes",
    {
      nome: nomeLimpo,
      idTipoVisita: tipo,
      idMoradia: moradia,
    },
    {
      messages: {
        400: "Revise os dados do visitante e tente novamente.",
        403: "Você não tem permissão para cadastrar visitantes.",
        404: "Moradia ou tipo de visita não encontrado. Verifique a seleção.",
        409: "Este visitante já está cadastrado.",
        422: "Alguns dados do visitante são inválidos.",
      },
    }
  );
}