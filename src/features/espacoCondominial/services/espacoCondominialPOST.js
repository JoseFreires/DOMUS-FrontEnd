export async function createEspacoCondominial({
    nome,
    descricao,
    capacidadeMax,
    foto,
    valorDiaria,
}) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const formData = new FormData();
    
    formData.append("nomeEspaco", nome);
    formData.append("descricao", descricao);
    formData.append("capacidadeMaxima", capacidadeMax);
    formData.append("valorReserva", String(Number(valorDiaria)));

    if (foto instanceof Blob) {
        formData.append("foto", foto, foto.name || `foto-${Date.now()}.jpg`);
    }

    try {
        const response = await fetch(`${API_URL}/espacos`, {
            method: "POST",
            credentials: "include",
            body: formData,
        });



        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Erro ao registrar espaço condominial");
        }
        return await response.json();
    } catch (error) {
        console.error("Erro ao registrar espaço condominial:", error);
        throw error;
    }
}