const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function updateEspacoCondominial(id, {
  nomeEspaco,
  descricao,
  capacidadeMaxima,
  valorReserva,
  restricao,
  fotoEspaco,
}) {
  if (id === undefined || id === null) {
    throw new Error("ID do espaço condominial não informado.");
  }

  const formData = new FormData();
  const append = (key, value) => {
    if (value !== undefined && value !== null) formData.append(key, value);
  };

  append("nomeEspaco", nomeEspaco);
  append("descricao", descricao);
  append("capacidadeMaxima", capacidadeMaxima);
  append("valorReserva", valorReserva);
  append("restricao", restricao);

  if (fotoEspaco instanceof Blob) {
    formData.append(
      "foto",
      fotoEspaco,
      fotoEspaco.name || `foto-${Date.now()}.jpg`
    );
  }

  try {
    const response = await fetch(`${API_URL}/espacos/${encodeURIComponent(id)}`, {
      method: "PUT",
      credentials: "include",
      body: formData, // não definir Content-Type: o navegador coloca o boundary
    });

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      const errorData = contentType?.includes("application/json")
        ? await response.json().catch(() => ({}))
        : {};

      const err = new Error(
        errorData.message ||
          `Erro ${response.status}: ${response.statusText || "falha ao atualizar"}`
      );
      err.status = response.status;
      throw err;
    }

    return true;
  } catch (error) {
    console.error("Erro ao atualizar espaço condominial:", error);
    if (error instanceof TypeError) {
      throw new Error("Não foi possível conectar ao servidor. Verifique sua conexão.");
    }
    throw error;
  }
}