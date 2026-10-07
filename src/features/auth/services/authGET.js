const API_URL = process.env.NEXT_PUBLIC_API_URL;


export async function getCurrentUser() {
    try {
        const response = await fetch(`${API_URL}/auth/eu`, {
            method: 'GET',
            credentials: 'include', // autenticação pelo cookie
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            return null;  // não autenticado ou erro
        }

        const user = await response.json();
        return user;
    } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        throw error;
    }
}
