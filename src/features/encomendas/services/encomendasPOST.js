import { api } from "@/services/http/apiClient";
import { ApiError } from "@/services/http/ApiError";

const texto = (v) => String(v ?? "").trim();

export function validarEncomenda({ nomePacote, idDestinatario, emailDestinatario }) {
  const idDest = Number(idDestinatario);
  const email = texto(emailDestinatario).toLowerCase();

  if (!texto(nomePacote)) {
    throw new ApiError("Informe o nome do pacote.", { status: 400, code: "VALIDATION" });
  }
  if (!Number.isInteger(idDest) || idDest <= 0) {
    throw new ApiError("Selecione o destinatário da encomenda.", { status: 400, code: "VALIDATION" });
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    throw new ApiError("Informe um e-mail válido para o destinatário.", { status: 400, code: "VALIDATION" });
  }
  return { idDest, email };
}

export async function createEncomenda({
  nomePacote,
  observacao,
  idDestinatario,
  emailDestinatario,
  foto,
}) {
  const { idDest, email } = validarEncomenda({ nomePacote, idDestinatario, emailDestinatario });

  const formData = new FormData();
  const append = (key, value) => {
    if (value !== undefined && value !== null && value !== "") {
      formData.append(key, value);
    }
  };

  append("nomePacote", texto(nomePacote));
  append("status", "RECEBIDA"); 
  append("emailDestinatario", email);
  append("idDestinatario", idDest);
  append("observacao", texto(observacao));

  if (foto instanceof Blob) {
    formData.append("foto", foto, foto.name || `foto-${Date.now()}.jpg`);
  }

  return api.postForm("/encomendas", formData, {
    messages: {
      400: "Revise os dados da encomenda e tente novamente.",
      403: "Você não tem permissão para registrar encomendas.",
      404: "Destinatário não encontrado. Verifique a seleção.",
      413: "A foto é muito grande. Escolha um arquivo menor.",
      415: "Formato de imagem não suportado.",
    },
  });
}