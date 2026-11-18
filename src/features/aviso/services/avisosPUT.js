import { api } from "@/services/http/apiClient";
import { ApiError } from "@/services/http/ApiError";

const texto = (v) => String(v ?? "").trim();

export async function updateAvisos(id, {
  titulo,
  descricao,
  prioridade,
  tipoAviso,
  foto,
  dataValidadeAviso,
}) {
  if (id === undefined || id === null || id === "") {
    throw new ApiError("Não foi possível identificar o aviso a ser atualizado.", {
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

  append("titulo", texto(titulo));
  append("descricao", texto(descricao));
  append("prioridade", prioridade);
  append("tipoAviso", tipoAviso);
  append("dataValidadeAviso", dataValidadeAviso);


  if (foto instanceof Blob) {
    formData.append("foto", foto, foto.name || `aviso-${Date.now()}`);
  }

  return api.putForm(`/avisos/${encodeURIComponent(id)}`, formData, {
    messages: {
      400: "Revise os dados do aviso e tente novamente.",
      403: "Você não tem permissão para editar avisos.",
      404: "Aviso não encontrado. Ele pode ter sido removido.",
      413: "A imagem enviada é muito grande. Escolha um arquivo menor.",
      415: "Formato de imagem não suportado.",
    },
  });
}