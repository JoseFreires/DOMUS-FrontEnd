export async function listMyEncomendas() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    try {
        const response = await fetch(`${API_URL}/moradores/minhas-encomendas`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            console.error(`Erro ao buscar encomendas: HTTP ${response.status}`);
            return null;
        }

        const data = await response.json();
        const encomendas = Array.isArray(data)
            ? data
            : [data?.encomendas, data?.content, data?.data].find(Array.isArray);

        if (!Array.isArray(encomendas)) {
            console.error("Erro ao buscar encomendas: formato de resposta inválido.", data);
            return null;
        }

        return encomendas;
    } catch (error) {
        console.error("Erro ao buscar encomendas:", error);
        return null;
    }
}
