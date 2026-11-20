import { api } from "@/services/http/apiClient";
import { ApiError } from "@/services/http/ApiError";

const texto = (v) => String(v ?? "").trim();
const apenasDigitos = (v) => String(v ?? "").replace(/\D/g, "");

const erroValidacao = (mensagem) =>
    new ApiError(mensagem, { status: 400, code: "VALIDATION" });

/**
 * Lista de moradias → ids numéricos, sem vazios e SEM duplicados.
 * (o backend não remove duplicados: repetir um id quebraria a chave
 *  composta de morador_moradia)
 */
export function normalizarIdMoradias(idMoradias) {
    const lista = Array.isArray(idMoradias) ? idMoradias : [];
    const ids = lista
        .map(Number)
        .filter((n) => Number.isInteger(n) && n > 0);
    return [...new Set(ids)];
}

// Espelha as validações de DadosRegistrarMoradorDTO / DadosRegistrarPessoaDTO do backend
export function validarMorador({
    nomeCompleto,
    cpf,
    email,
    telefone,
    dataNascimento,
    dataChegada,
    idMoradias,
    foto,
}) {
    const nome = texto(nomeCompleto);
    const cpfLimpo = apenasDigitos(cpf);
    const emailLimpo = texto(email).toLowerCase();

    if (!nome) throw erroValidacao("Informe o nome completo.");
    if (cpfLimpo.length !== 11) throw erroValidacao("O CPF deve ter 11 dígitos.");
    if (!/^\S+@\S+\.\S+$/.test(emailLimpo)) throw erroValidacao("Informe um e-mail válido.");
    if (!apenasDigitos(telefone)) throw erroValidacao("Informe o telefone.");
    if (!dataNascimento) throw erroValidacao("Informe a data de nascimento.");
    if (!dataChegada) throw erroValidacao("Informe a data de chegada.");
    if (normalizarIdMoradias(idMoradias).length === 0) {
        throw erroValidacao("Adicione ao menos uma moradia.");
    }
    if (!(foto instanceof Blob)) throw erroValidacao("Selecione a foto do morador.");
}

export async function createMorador({
    // pessoa
    nomeCompleto,
    cpf,
    email,
    telefone,
    dataNascimento,
    // morador
    idMoradias,          // array de ids de moradia
    dataChegada,
    foto,
}) {
    validarMorador({ nomeCompleto, cpf, email, telefone, dataNascimento, dataChegada, idMoradias, foto });

    const nome = texto(nomeCompleto);
    const cpfLimpo = apenasDigitos(cpf);
    const emailLimpo = texto(email).toLowerCase();
    const telefoneLimpo = apenasDigitos(telefone);
    const ids = normalizarIdMoradias(idMoradias);

    const formData = new FormData();
    const append = (key, value) => {
        if (value !== undefined && value !== null && value !== "") {
            formData.append(key, value);
        }
    };

    // Pessoa
    append("pessoa.nomeCompleto", nome);
    append("pessoa.cpf", cpfLimpo);
    append("pessoa.email", emailLimpo);
    append("pessoa.telefone", telefoneLimpo);
    append("pessoa.dataNascimento", dataNascimento);

    // Usuário
    append("usuario.username", emailLimpo);
    append("usuario.senha", "123456");

    // Morador — a mesma chave repetida vira List<Long> idMoradias no Spring
    ids.forEach((id) => formData.append("idMoradias", id));
    append("dataChegada", dataChegada);

    formData.append("foto", foto, foto.name || `foto-${Date.now()}.jpg`);

    return api.postForm("/moradores", formData, {
        messages: {
            400: "Revise os dados do morador e tente novamente.",
            403: "Você não tem permissão para cadastrar moradores.",
            404: "Alguma das moradias não foi encontrada. Verifique a seleção.",
            409: "Já existe um morador ou usuário com este CPF ou e-mail.",
            413: "A foto é muito grande. Escolha um arquivo menor.",
            415: "Formato de imagem não suportado.",
            422: "Alguns dados são inválidos. Confira CPF, e-mail e datas.",
        },
    });
}