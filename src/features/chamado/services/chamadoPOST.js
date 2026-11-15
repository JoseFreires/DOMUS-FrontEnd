export async function createChamado({
  titulo,
  descricaoInicial,
  tipoChamado,
  foto,
}) {
  const formData = new FormData();

  formData.append("titulo", titulo);
  formData.append("descricaoInicial", descricaoInicial);
  formData.append("tipoChamado", tipoChamado);

  if (foto instanceof Blob) {
    formData.append("foto", foto, foto.name || `chamado-${Date.now()}`);
  }

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const response = await fetch(`${API_URL}/chamados`, {
    method: "POST",
    credentials: "include",
    body: formData,
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

export default createChamado;