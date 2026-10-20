export async function createAvisos({
    titulo,
    descricao,
    prioridade,
    tipoAviso,
    foto,
    dataValidadeAviso,
}) {
    const formData = new FormData();

    formData.append("titulo", titulo);
    formData.append("descricao", descricao);
    formData.append("prioridade", prioridade);
    formData.append("tipoAviso", tipoAviso);
    formData.append("dataValidadeAviso", dataValidadeAviso);

    if (foto instanceof Blob) {
        formData.append("foto", foto, foto.name || `aviso-${Date.now()}`);
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    try {
        const response = await fetch(`${API_URL}/avisos`, {
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
            data?.message || `Erro ${response.status}: ${response.statusText}`
        );
        err.status = response.status;
        throw err;
        }

        return data;
    } catch (error) {
        console.error("Error ao cadastrar aviso:", error);
        return null;
    }
}