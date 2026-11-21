import { api } from "@/services/http/apiClient";
import { ApiError } from "@/services/http/ApiError";

export async function listConvidados() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    try {
        const response = await fetch(`${API_URL}/convidados`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });

        console.log("Response from API:", response);

        if (!response.ok) {
            return null;
        }

        return await response.json();

    } catch (error) {
        console.error("Error ao buscar Convidados:", error);
        throw error;
    }
}

export async function getConvidadoById(id) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    try {
        const response = await fetch(`${API_URL}/convidados/${id}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            return null;
        }

        return await response.json();

    } catch (error) {
        console.error("Error ao buscar Convidado por ID:", error);
        throw error;
    }
}


export function listConvidadosDoMorador(idMorador) {
    const id = Number(idMorador);
    if (!Number.isInteger(id) || id <= 0) {
        throw new ApiError("Não foi possível identificar o morador.", { status: 400, code: "VALIDATION" });
    }
    return api.get(`/log-convidado/morador/${id}/convidados`, {
        messages: {
            403: "Você não tem permissão para ver os convidados deste morador.",
            404: "Morador não encontrado.",
        },
    });
}
