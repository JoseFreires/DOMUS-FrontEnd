export async function updateStatusChamado(id, { statusChamado, resolucaoChamado }) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const body = { statusChamado };
  if (resolucaoChamado?.trim()) body.resolucaoChamado = resolucaoChamado.trim();

  const response = await fetch(`${API_URL}/chamados/${id}/status`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const rawText = await response.text();
  let data = null;
  if (rawText) {
    try {
      data = JSON.parse(rawText);
    } catch {
      data = { message: rawText };
    }
  }

  if (!response.ok) {
    const err = new Error(
      data?.message || `Erro ${response.status}: ${response.statusText}`,
    );
    err.status = response.status;
    throw err;
  }

  return data;
}

export function cancelarChamado(id) {
  return updateStatusChamado(id, { statusChamado: "CANCELADO" });
}

export default updateStatusChamado;