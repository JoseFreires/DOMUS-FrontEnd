import { api } from "@/services/http/apiClient";
import { ApiError } from "@/services/http/ApiError";

const texto = (v) => String(v ?? "").trim();
const apenasDigitos = (v) => String(v ?? "").replace(/\D/g, "");

const erroValidacao = (mensagem) =>
  new ApiError(mensagem, { status: 400, code: "VALIDATION" });

export async function updateMorador(id, {
  nomeCompleto,
  telefone,
  dataNascimento,
  moradiaIdMoradia,
  dataChegada,
  dataSaida,
  foto,
}) {
  if (id === undefined || id === null || id === "") {
    throw erroValidacao("Não foi possível identificar o morador a ser atualizado.");
  }
  if (!texto(nomeCompleto)) throw erroValidacao("Informe o nome completo.");

  const formData = new FormData();
  // No PUT só ignoramos undefined/null: string vazia limpa o campo
  const append = (key, value) => {
    if (value !== undefined && value !== null) formData.append(key, value);
  };

  append("nomeCompleto", texto(nomeCompleto));
  append("telefone", apenasDigitos(telefone));
  append("dataNascimento", dataNascimento);
  append("dataChegada", dataChegada);

  const moradia = Number(moradiaIdMoradia);
  if (Number.isInteger(moradia) && moradia > 0) {
    append("moradiaIdMoradia", moradia);
  }

  if (dataSaida) append("dataSaida", dataSaida);

  if (foto instanceof Blob) {
    formData.append("foto", foto, foto.name || `morador-${Date.now()}.jpg`);
  }

  await api.putForm(`/moradores/${encodeURIComponent(id)}`, formData, {
    messages: {
      400: "Revise os dados do morador e tente novamente.",
      403: "Você não tem permissão para editar moradores.",
      404: "Morador ou moradia não encontrado.",
      409: "Já existe um morador com estes dados.",
      413: "A foto é muito grande. Escolha um arquivo menor.",
      415: "Formato de imagem não suportado.",
      422: "Alguns dados são inválidos. Confira telefone e datas.",
    },
  });
  return true;
}
