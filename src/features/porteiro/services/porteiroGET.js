export async function listPorteiros() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    try {
        const response = await fetch(`${API_URL}/porteiros`, {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) return null;

        return await response.json();
    } catch (error) {
        console.error("Erro ao buscar porteiros:", error);
        return null;
    }
}

export async function listPorteirosInativos() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    try {
        const response = await fetch(`${API_URL}/porteiros/inativos`, {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
        });

        if (response.status === 403) {
            const error = new Error("Acesso negado ao buscar porteiros inativos.");
            error.status = response.status;
            throw error;
        }

        if (!response.ok) return null;

        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        if (error?.status === 403) throw error;

        console.error("Erro ao buscar porteiros inativos:", error);
        return null;
    }
}