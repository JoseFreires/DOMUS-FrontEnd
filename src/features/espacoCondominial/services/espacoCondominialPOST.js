export async function createEspacoCondominial({
    nomeEspaco,
    descricao,
    capacidadeMaxima,
    fotoEspaco,
    valorReserva,
    restricao
}) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const formData = new FormData();
    
    formData.append("nomeEspaco", nomeEspaco);
    formData.append("descricao", descricao);
    formData.append("capacidadeMaxima", capacidadeMaxima);
    formData.append("valorReserva", String(Number(valorReserva)));
    formData.append("restricao", restricao);

    if (fotoEspaco instanceof Blob) {
        formData.append("foto", fotoEspaco, fotoEspaco.name || `fotoEspacoCondominial-${Date.now()}.jpg`);
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