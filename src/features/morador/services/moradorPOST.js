import { api } from "@/services/http/apiClient";
import { ApiError } from "@/services/http/ApiError";

const texto = (v) => String(v ?? "").trim();
const apenasDigitos = (v) => String(v ?? "").replace(/\D/g, "");

const erroValidacao = (mensagem) =>
    new ApiError(mensagem, { status: 400, code: "VALIDATION" });

export function validarMorador({ nomeCompleto, cpf, email, idMoradia }) {
    const nome = texto(nomeCompleto);
    const cpfLimpo = apenasDigitos(cpf);
    const emailLimpo = texto(email).toLowerCase();
    const idMor = Number(idMoradia);

    if (!nome) throw erroValidacao("Informe o nome completo.");
    if (cpfLimpo.length !== 11) throw erroValidacao("O CPF deve ter 11 dígitos.");
    if (!/^\S+@\S+\.\S+$/.test(emailLimpo)) throw erroValidacao("Informe um e-mail válido.");
    if (!Number.isInteger(idMor) || idMor <= 0) throw erroValidacao("Selecione a moradia.");
}

export async function createMorador({
    // pessoa
    nomeCompleto,
    cpf,
    email,
    telefone,
    dataNascimento,
    // morador
    idMoradia,
    dataChegada,
    foto,
}) {
    validarMorador({ nomeCompleto, cpf, email, idMoradia });

    const nome = texto(nomeCompleto);
    const cpfLimpo = apenasDigitos(cpf);
    const emailLimpo = texto(email).toLowerCase();
    const telefoneLimpo = apenasDigitos(telefone);
    const idMor = Number(idMoradia);

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

    // Morador
    append("idMoradia", idMor);
    append("dataChegada", dataChegada);

    if (foto instanceof Blob) {
        formData.append("foto", foto, foto.name || `foto-${Date.now()}.jpg`);
    }

    return api.postForm("/moradores", formData, {
        messages: {
            400: "Revise os dados do morador e tente novamente.",
            403: "Você não tem permissão para cadastrar moradores.",
            404: "Moradia não encontrada. Verifique a seleção.",
            409: "Já existe um morador ou usuário com este CPF ou e-mail.",
            413: "A foto é muito grande. Escolha um arquivo menor.",
            415: "Formato de imagem não suportado.",
            422: "Alguns dados são inválidos. Confira CPF, e-mail e datas.",
        },
    });
}