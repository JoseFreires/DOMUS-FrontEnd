export async function listMorador() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    
    try {
        const response = await fetch(`${API_URL}/moradores`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Erro ao buscar moradores:", error);
        return null;
    }
}

export async function listMoradorInativos() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    try {
        const response = await fetch(`${API_URL}/moradores/inativos`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.status === 403) {
            const error = new Error("Acesso negado ao buscar moradores inativos.");
            error.status = response.status;
            throw error;
        }

        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        if (error?.status === 403) {
            throw error;
        }

        console.error("Erro ao buscar moradores inativos:", error);
        return null;
    }
}

export function getPessoaId(morador) {
  return (
    morador?.idPessoa ??
    morador?.pessoa?.idPessoa ??
    morador?.pessoa?.id ??
    morador?.usuario?.pessoa?.idPessoa ??
    morador?.usuario?.pessoa?.id ??
    morador?.usuario?.idPessoa ??
    null
  );
}

// IDs das moradias vinculadas ao morador (como strings).
// Aceita os formatos usados pela API: idMoradia, moradiaIdMoradia, moradia.idMoradia ou lista moradias[].
export function getMoradiaIds(morador) {
  if (!morador) return [];
 
  const lista = Array.isArray(morador.moradias)
    ? morador.moradias.map((m) => m?.idMoradia ?? m?.id ?? m)
    : [];
 
  const ids = [
    morador.idMoradia,
    morador.moradiaIdMoradia,
    morador.moradia?.idMoradia,
    ...lista,
  ].filter((v) => v !== null && v !== undefined && v !== "");
 
  return [...new Set(ids.map(String))];
}

// A API devolve `moradias: [{ idMoradia, idBloco, numeroApartamento, bloco }]`.
// As colunas da tabela (e a busca) trabalham com texto, então derivamos:
//  - numeroApartamento: "101, 202"
//  - blocom: "Bloco A" se todas fore do mesmo bloco; senão na mesma ordem dos apartamentos ("Bloco A, Bloco B")
export function comResumoDeMoradias(morador) {
  const moradias = morador?.moradias;
  if (!Array.isArray(moradias) || moradias.length === 0) return morador;

  const blocos = moradias.map((m) => m?.bloco).filter(Boolean);
  const blocosUnicos = [...new Set(blocos)];

  return {
    ...morador,
    numeroApartamento: moradias.map((m) => m?.numeroApartamento).filter(Boolean).join(", "),
    bloco: blocosUnicos.length === 1 ? blocosUnicos[0] : blocos.join(", "),
  };
}