export async function getNotifications() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    try {
        const response = await fetch(`${API_URL}/notificacoes`, {
            method: 'GET',
            credentials: 'include', // autenticação pelo cookie
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            return null;
        }

        const notifications = await response.json();
        return notifications;
        
    } catch (error) {
        console.error("Erro ao buscar notificações:", error);
        throw error;
    }
}