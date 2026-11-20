import { api } from "@/services/http/apiClient";
import { ApiError } from "@/services/http/ApiError";

export function validarPessoaAutorizada({ nome, cpf, moradorIdMorador }) {
  const nomeLimpo = String(nome ?? "").trim();
  const cpfLimpo = String(cpf ?? "").replace(/\D/g, "");
  const idMorador = Number(moradorIdMorador);

  if (!nomeLimpo) {
    throw new ApiError("Informe o nome completo.", {
      status: 400,
      code: "VALIDATION",
    });
  }
  if (cpfLimpo.length !== 11) {
    throw new ApiError("O CPF deve ter 11 dígitos.", {
      status: 400,
      code: "VALIDATION",
    });
  }
  if (!Number.isInteger(idMorador) || idMorador <= 0) {
    throw new ApiError("Não foi possível identificar o morador logado.", {
      status: 400,
      code: "VALIDATION",
    });
  }
}

export async function createPessoaAutorizada({
  nome,
  cpf,
  moradorIdMorador,
}) {
  validarPessoaAutorizada({ nome, cpf, moradorIdMorador });

  const nomeLimpo = String(nome ?? "").trim();
  const cpfLimpo = String(cpf ?? "").replace(/\D/g, "");
  const idMorador = Number(moradorIdMorador);

  return api.post(
    "/pessoasAutorizadas",
    {
      nome: nomeLimpo,
      cpf: cpfLimpo,
      moradorIdMorador: idMorador,
    },
    {
      messages: {
        400: "Revise os dados da pessoa autorizada.",
        403: "Você não tem permissão para cadastrar pessoas autorizadas.",
        409: "Já existe uma pessoa autorizada com este CPF.",
        422: "Confira o nome e o CPF informados.",
      },
    },
  );
}
