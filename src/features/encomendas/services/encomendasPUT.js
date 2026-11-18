import { api } from "@/services/http/apiClient";
import { ApiError } from "@/services/http/ApiError";

const texto = (v) => String(v ?? "").trim();

const erroValidacao = (mensagem) =>
  new ApiError(mensagem, { status: 400, code: "VALIDATION" });

export async function updateEncomenda(id, {
  nomePacote,
  status,
  observacao,
  idDestinatario,
  emailDestinatario,
  foto,
}) {
  if (id === undefined || id === null || id === "") {
    throw erroValidacao("Não foi possível identificar a encomenda a ser atualizada.");
  }

  const idDest = Number(idDestinatario);
  const email = texto(emailDestinatario).toLowerCase();

  if (!texto(nomePacote)) throw erroValidacao("Informe o nome do pacote.");
  if (!Number.isInteger(idDest) || idDest <= 0) throw erroValidacao("Selecione o destinatário da encomenda.");
  if (!/^\S+@\S+\.\S+$/.test(email)) throw erroValidacao("Informe um e-mail válido para o destinatário.");

  const formData = new FormData();
  // No PUT só ignoramos undefined/null: string vazia significa "limpar o campo"
  const append = (key, value) => {
    if (value !== undefined && value !== null) formData.append(key, value);
  };

  append("nomePacote", texto(nomePacote));
  append("status", status);
  append("emailDestinatario", email);
  append("idDestinatario", idDest);
  append("observacao", texto(observacao));

  // Só envia a foto se o usuário escolheu uma nova (preserva a existente)
  if (foto instanceof Blob) {
    formData.append("foto", foto, foto.name || `foto-${Date.now()}.jpg`);
  }

  await api.putForm(`/encomendas/${encodeURIComponent(id)}`, formData, {
    messages: {
      400: "Revise os dados da encomenda e tente novamente.",
      403: "Você não tem permissão para editar encomendas.",
      404: "Encomenda ou destinatário não encontrado.",
      409: "Esta encomenda não pode mais ser alterada.",
      413: "A foto é muito grande. Escolha um arquivo menor.",
      415: "Formato de imagem não suportado.",
    },
  });
  return true;
}
