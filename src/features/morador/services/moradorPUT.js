import { api } from "@/services/http/apiClient";
import { ApiError } from "@/services/http/ApiError";
import { normalizarIdMoradias } from "@/features/morador/services/moradorPOST";

const texto = (v) => String(v ?? "").trim();
const apenasDigitos = (v) => String(v ?? "").replace(/\D/g, "");

const erroValidacao = (mensagem) =>
  new ApiError(mensagem, { status: 400, code: "VALIDATION" });

const idsDasMoradias = (moradias) =>
  normalizarIdMoradias(
    (Array.isArray(moradias) ? moradias : []).map((m) => m?.idMoradia ?? m?.id ?? m),
  );

/**
 * O PUT /moradores/{id} do backend aceita UMA moradia para adicionar
 * (adicionarMoradiaIdMoradia) e UMA para remover (removerMoradiaIdMoradia) por requisição.
 * Para várias alterações comparamos a lista original (`moradias`, vinda da linha da tabela)
 * com a nova (`idMoradias`, vinda do formulário) e enviamos uma requisição por par
 * adicionar/remover. A 1ª também leva os dados do perfil e a foto.
 */
export async function updateMorador(id, {
  nomeCompleto,
  telefone,
  dataNascimento,
  dataChegada,
  dataSaida,
  foto,
  idMoradias,   // lista nova
  moradias,     // lista original
}) {
  if (id === undefined || id === null || id === "") {
    throw erroValidacao("Não foi possível identificar o morador a ser atualizado.");
  }
  if (!texto(nomeCompleto)) throw erroValidacao("Informe o nome completo.");

  const originais = idsDasMoradias(moradias);
  const novos = Array.isArray(idMoradias) ? normalizarIdMoradias(idMoradias) : null;

  if (novos && novos.length === 0) {
    throw erroValidacao("O morador precisa ter ao menos uma moradia.");
  }

  const adicionar = novos ? novos.filter((m) => !originais.includes(m)) : [];
  const remover = novos ? originais.filter((m) => !novos.includes(m)) : [];
  const requisicoes = Math.max(adicionar.length, remover.length, 1);

  const messages = {
    400: "Revise os dados do morador e tente novamente.",
    403: "Você não tem permissão para editar moradores.",
    404: "Morador ou moradia não encontrado.",
    409: "Já existe um morador com estes dados.",
    413: "A foto é muito grande. Escolha um arquivo menor.",
    415: "Formato de imagem não suportado.",
    422: "Alguns dados são inválidos. Confira telefone e datas.",
  };

  for (let i = 0; i < requisicoes; i++) {
    const formData = new FormData();
    // No PUT só ignoramos undefined/null: string vazia limpa o campo
    const append = (key, value) => {
      if (value !== undefined && value !== null) formData.append(key, value);
    };

    if (i === 0) {
      append("nomeCompleto", texto(nomeCompleto));
      append("telefone", apenasDigitos(telefone));
      append("dataNascimento", dataNascimento);
      append("dataChegada", dataChegada);
      if (dataSaida) append("dataSaida", dataSaida);
      if (foto instanceof Blob) {
        formData.append("foto", foto, foto.name || `morador-${Date.now()}.jpg`);
      }
    }

    if (adicionar[i] !== undefined) append("adicionarMoradiaIdMoradia", adicionar[i]);
    if (remover[i] !== undefined) append("removerMoradiaIdMoradia", remover[i]);

    try {
      await api.putForm(`/moradores/${encodeURIComponent(id)}`, formData, { messages });
    } catch (err) {
      if (i === 0) throw err;   // nada foi salvo ainda
      throw new ApiError(
        `Os dados do perfil e parte das moradias foram salvos, mas não foi possível concluir todas as alterações de moradia. Reabra o cadastro e confira a lista. (${err?.message ?? "erro desconhecido"})`,
        { status: err?.status ?? 500, code: "PARTIAL_UPDATE" },
      );
    }
  }
  return true;
}