import { api } from "@/services/http/apiClient";
import { ApiError } from "@/services/http/ApiError";

const texto = (v) => String(v ?? "").trim();

export async function createEspacoCondominial({
  nomeEspaco,
  descricao,
  capacidadeMaxima,
  fotoEspaco,
  valorReserva,
  restricao,
}) {
  const nome = texto(nomeEspaco);
  const capacidade = Number(capacidadeMaxima);
  const valor = Number(valorReserva);

  if (!nome) {
    throw new ApiError("Informe o nome do espaço.", { status: 400, code: "VALIDATION" });
  }
  if (!Number.isInteger(capacidade) || capacidade < 1) {
    throw new ApiError("A capacidade deve ser um número maior que zero.", {
      status: 400,
      code: "VALIDATION",
    });
  }
  if (!Number.isFinite(valor) || valor <= 0) {
    throw new ApiError("Informe um valor de reserva maior que zero.", {
      status: 400,
      code: "VALIDATION",
    });
  }

  const formData = new FormData();
  const append = (key, value) => {
    if (value !== undefined && value !== null && value !== "") {
      formData.append(key, value);
    }
  };

  append("nomeEspaco", nome);
  append("descricao", texto(descricao));
  append("capacidadeMaxima", capacidade);
  append("valorReserva", valor);
  append("restricao", texto(restricao));

  if (fotoEspaco instanceof Blob) {
    formData.append(
      "fotoEspaco", // ver observação abaixo sobre o nome da parte
      fotoEspaco,
      fotoEspaco.name || `fotoEspacoCondominial-${Date.now()}.jpg`
    );
  }

  return api.postForm("/espacos", formData, {
    messages: {
      400: "Revise os dados do espaço e tente novamente.",
      403: "Você não tem permissão para cadastrar espaços condominiais.",
      409: "Já existe um espaço com esse nome.",
      413: "A foto é muito grande. Escolha um arquivo menor.",
      415: "Formato de imagem não suportado.",
    },
  });
}