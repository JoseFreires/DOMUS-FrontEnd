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