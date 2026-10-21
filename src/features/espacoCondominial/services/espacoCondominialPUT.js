export async function updateEspacoCondominial(id, { nomeEspaco, descricao, capacidadeMaxima, valorReserva, foto }) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const formData = new FormData();

    formData.append("nomeEspaco", nomeEspaco);
    formData.append("descricao", descricao);
    formData.append("capacidadeMaxima", capacidadeMaxima);
    formData.append("valorReserva", String(Number(valorReserva)));
    formData.append("foto", foto);

    if (foto instanceof Blob) {
        formData.append("foto", foto, foto.name || `foto-${Date.now()}.jpg`);
    }

    console.log(formData)
    try {
        const response = await fetch(`${API_URL}/espacos/${id}`, {
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