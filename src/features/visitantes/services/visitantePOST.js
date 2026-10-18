export async function createVisitante({
    nome,
    tipoVisita,
    moradia
}) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const formData = new FormData();


    formData.append("nome", nome);
    formData.append("idTipoVisita", String(Number(tipoVisita)));
    formData.append("idMoradia", String(Number(moradia)));

    try {
        const response = await fetch(`${API_URL}/visitantes`, {
            method: "POST",
            credentials: "include",
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Erro ao cadastrar visitante");
        }

        return await response.json();
    } catch (error) {
        console.error("Erro ao cadastrar visitante:", error);
        throw error;
    }
}