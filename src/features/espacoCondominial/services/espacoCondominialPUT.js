export async function updateEspacoCondominial(id, { nome, descricao, capacidade }) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const formData = new FormData();

    formData.append("nome", nome);
    formData.append("descricao", descricao);
    formData.append("capacidade", String(Number(capacidade)));

    if (foto instanceof Blob) {
        formData.append("foto", foto, foto.name || `foto-${Date.now()}.jpg`);
    }

    try {
        const response = await fetch(`${API_URL}/espacos-condominiais/${id}`, {
            method: "PUT",
            credentials: "include",
            body: formData,
        });

        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            const errorData = contentType?.includes("application/json")
                ? await response.json()
                : { message: `Erro ${response.status}: ${response.statusText}` };

            throw new Error(errorData.message || "Erro ao atualizar espaço condominial");
        }

        return true;
    } catch (error) {
        console.error("Erro ao atualizar espaço condominial:", error);
        throw error;
    }
}