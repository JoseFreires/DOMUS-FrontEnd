export async function listSindicos() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    try {
        const response = await fetch(`${API_URL}/sindicos`, {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) return null;

        return await response.json();
    } catch (error) {
        console.error("Erro ao buscar sindicos:", error);
        return null;
    }
}

export async function listSindicosInativos() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    try {
        const response = await fetch(`${API_URL}/sindicos/inativos`, {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
        });

        if (response.status === 403) {
            const error = new Error("Acesso negado ao buscar síndicos inativos.");
            error.status = response.status;
            throw error;
        }

        if (!response.ok) return null;

        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        if (error?.status === 403) throw error;

        console.error("Erro ao buscar síndicos inativos:", error);
        return null;
    }
}