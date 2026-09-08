export async function listMoradia() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL; 

    try {
        const response = await fetch(`${API_URL}/consultacondominial/moradias`, {
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
        return Array.isArray(data) ? data : [];

    } catch (error) {
        console.error("Erro ao buscar moradores:", error);
        return null;
    }
};