export async function createVisitante({ nome, idTipoVisita, idMoradia }) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const payload = {
    nome: String(nome ?? "").trim(),
    idTipoVisita: Number(idTipoVisita),
    idMoradia: Number(idMoradia),
  };

  try {
    const response = await fetch(`${API_URL}/visitantes`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const err = new Error(errorData.message || "Erro ao cadastrar visitante");
      err.status = response.status;
      throw err;
    }

    // Se o back-end responder 201/204 sem corpo, evita erro de parse
    return await response.json().catch(() => null);
  } catch (error) {
    console.error("Erro ao cadastrar visitante:", error);
    throw error;
  }
}