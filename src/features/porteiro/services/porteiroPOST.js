import { api } from "@/services/http/apiClient";
import { ApiError } from "@/services/http/ApiError";

const texto = (v) => String(v ?? "").trim();
const apenasDigitos = (v) => String(v ?? "").replace(/\D/g, "");

const erroValidacao = (mensagem) =>
    new ApiError(mensagem, { status: 400, code: "VALIDATION" });

export function validarPorteiro({ nomeCompleto, cpf, email, turno }) {
    const nome = texto(nomeCompleto);
    const cpfLimpo = apenasDigitos(cpf);
    const emailLimpo = texto(email).toLowerCase();

    if (!nome) throw erroValidacao("Informe o nome completo.");
    if (cpfLimpo.length !== 11) throw erroValidacao("O CPF deve ter 11 dígitos.");
    if (!/^\S+@\S+\.\S+$/.test(emailLimpo)) throw erroValidacao("Informe um e-mail válido.");
    if (!texto(turno)) throw erroValidacao("Selecione o turno do porteiro.");
}

export async function createPorteiro({
    // pessoa
    nomeCompleto,
    cpf,
    email,
    telefone,
    dataNascimento,
    // porteiro
    turno,
    empresaResponsavel,
    foto,
}) {
    validarPorteiro({ nomeCompleto, cpf, email, turno });

    const nome = texto(nomeCompleto);
    const cpfLimpo = apenasDigitos(cpf);
    const emailLimpo = texto(email).toLowerCase();
    const telefoneLimpo = apenasDigitos(telefone);

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

    // Porteiro
    append("turno", texto(turno));
    append("empresaResponsavel", texto(empresaResponsavel));

    if (foto instanceof Blob) {
        formData.append("foto", foto, foto.name || `foto-${Date.now()}.jpg`);
    }

    return api.postForm("/porteiros", formData, {
        messages: {
            400: "Revise os dados do porteiro e tente novamente.",
            403: "Você não tem permissão para cadastrar porteiros.",
            409: "Já existe um porteiro ou usuário com este CPF ou e-mail.",
            413: "A foto é muito grande. Escolha um arquivo menor.",
            415: "Formato de imagem não suportado.",
            422: "Alguns dados são inválidos. Confira CPF, e-mail e datas.",
        },
    });
}