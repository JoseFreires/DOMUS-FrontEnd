import { api } from "@/services/http/apiClient";
import { ApiError } from "@/services/http/ApiError";

const texto = (v) => String(v ?? "").trim();

const erroValidacao = (mensagem) =>
  new ApiError(mensagem, { status: 400, code: "VALIDATION" });

export async function updateEspacoCondominial(id, {
  nomeEspaco,
  descricao,
  capacidadeMaxima,
  valorReserva,
  restricao,
  fotoEspaco,
}) {
  if (id === undefined || id === null || id === "") {
    throw erroValidacao("Não foi possível identificar o espaço a ser atualizado.");
  }

  const nome = texto(nomeEspaco);
  const capacidade = Number(capacidadeMaxima);
  const valor = Number(valorReserva);

  if (!nome) throw erroValidacao("Informe o nome do espaço.");
  if (!Number.isInteger(capacidade) || capacidade < 1) {
    throw erroValidacao("A capacidade deve ser um número maior que zero.");
  }
  if (!Number.isFinite(valor) || valor <= 0) {
    throw erroValidacao("Informe um valor de reserva maior que zero.");
  }

  const formData = new FormData();

  const append = (key, value) => {
    if (value !== undefined && value !== null) formData.append(key, value);
  };

  append("nomeEspaco", nome);
  append("descricao", texto(descricao));
  append("capacidadeMaxima", capacidade);
  append("valorReserva", valor);
  append("restricao", texto(restricao));

 
  if (fotoEspaco instanceof Blob) {
    formData.append("foto", fotoEspaco, fotoEspaco.name || `foto-${Date.now()}.jpg`);
  }

  await api.putForm(`/espacos/${encodeURIComponent(id)}`, formData, {
    messages: {
      400: "Revise os dados do espaço e tente novamente.",
      403: "Você não tem permissão para editar espaços condominiais.",
      404: "Espaço condominial não encontrado. Ele pode ter sido removido.",
      409: "Já existe um espaço com esse nome.",
      413: "A foto é muito grande. Escolha um arquivo menor.",
      415: "Formato de imagem não suportado.",
    },
  });
  return true;
}
