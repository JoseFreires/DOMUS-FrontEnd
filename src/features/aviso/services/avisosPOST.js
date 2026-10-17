export async function listAvisos({
    titulo,
    descricao,
    prioridade,
    tipoAviso,
    fotoAviso,
    dataValidadeAviso,
}) {
    const formData = new FormData();

    formData.append("titulo", titulo);
    formData.append("descricao", descricao);
    formData.append("prioridade", prioridade);
    formData.append("tipoAviso", tipoAviso);
    formData.append("dataValidadeAviso", dataValidadeAviso);

    if (fotoAviso instanceof Blob) {
        formData.append("fotoAviso", fotoAviso, fotoAviso.name || `aviso-${Date.now()}`);
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    try {
        const response = await fetch(`${API_URL}/avisos`, {
            method: "POST",
            credentials: "include",
            body: formData,
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching bloco data:", error);
        return null;
    }
}