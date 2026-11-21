import { comResumoDeMoradias } from "@/features/morador/services/moradorGET";

export async function listEncomendas() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    try {
        const response = await fetch(`${API_URL}/encomendas`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        return Array.isArray(data) ? data.map(comResumoDeMoradias) : data;
    } catch (error) {
        console.error("Erro ao buscar encomendas:", error);
        return null;
    }
}
