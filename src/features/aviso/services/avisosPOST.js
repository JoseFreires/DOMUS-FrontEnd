import { api } from "@/services/http/apiClient";

export function createAvisos({
  titulo,
  descricao,
  prioridade,
  tipoAviso,
  foto,
  dataValidadeAviso,
}) {
  const formData = new FormData();

  const append = (key, value) => {
    if (value !== undefined && value !== null && value !== "") {
      formData.append(key, value);
    }
  };

  append("titulo", String(titulo ?? "").trim());
  append("descricao", String(descricao ?? "").trim());
  append("prioridade", prioridade);
  append("tipoAviso", tipoAviso);
  append("dataValidadeAviso", dataValidadeAviso);

  if (foto instanceof Blob) {
    formData.append("foto", foto, foto.name || `aviso-${Date.now()}`);
  }

  return api.postForm("/avisos", formData, {
    messages: {
      400: "Revise os dados do aviso e tente novamente.",
      413: "A imagem enviada é muito grande. Escolha um arquivo menor.",
      415: "Formato de imagem não suportado.",
    },
  });
}