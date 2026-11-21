import { api } from "@/services/http/apiClient";
import { ApiError } from "@/services/http/ApiError";

const texto = (v) => String(v ?? "").trim();

const erroValidacao = (mensagem) =>
  new ApiError(mensagem, { status: 400, code: "VALIDATION" });

export async function createVisitante({ nome, tipoVisita, idMoradia }) {
  const nomeLimpo = texto(nome);
  const moradia = Number(idMoradia);
  const tipoVisitaLimpo = texto(tipoVisita);

  if (!nomeLimpo) throw erroValidacao("Informe o nome do visitante.");
  if (!tipoVisitaLimpo) throw erroValidacao("Selecione o tipo de visita.");
  if (!Number.isInteger(moradia) || moradia <= 0) throw erroValidacao("Selecione a moradia.");

  return api.post(
    "/log-visita",
    {
      nome: nomeLimpo,
      tipoVisita: tipoVisitaLimpo,
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