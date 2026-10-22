export async function listEspacosCondominiaisAtivos() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    try {
        const response = await fetch(`${API_URL}/espacos`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });


        if (!response.ok) return null;
        return await response.json();
        
    } catch (error) {
        console.error("Error ao buscar Espaços Condominiais:", error);
        throw error;
    }
}

export async function listEspacosCondominiaisInativos() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    try {
        const response = await fetch(`${API_URL}/espacos/inativos`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });


        if (!response.ok) return null;
        return await response.json();
        
    } catch (error) {
        console.error("Error ao buscar Espaços Condominiais:", error);
        throw error;
    }
}