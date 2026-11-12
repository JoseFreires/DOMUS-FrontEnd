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