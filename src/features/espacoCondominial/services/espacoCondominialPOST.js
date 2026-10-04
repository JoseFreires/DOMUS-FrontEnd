export async function createEspacoCondominial({
    nome,
    descricao,
    capacidadeMax,
    foto,
    valorDiaria,
}) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const formData = new FormData();
    
    formData.append("nome", nome);
    formData.append("descricao", descricao);
    formData.append("capacidadeMax", String(Number(capacidadeMax)));
    formData.append("valorDiaria", String(Number(valorDiaria)));

    if (foto instanceof Blob) {
        formData.append("foto", foto, foto.name || `foto-${Date.now()}.jpg`);
    }

    try {
        const response = await fetch(`${API_URL}/espacos-condominiais`, {
            method: "POST",
            credentials: "include",
            body: formData,
        });



        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Erro ao registrar espaço condominonial");
        }
        return await response.json();
    } catch (error) {
        console.error("Erro ao registrar espaço condominonial:", error);
        throw error;
    }
}