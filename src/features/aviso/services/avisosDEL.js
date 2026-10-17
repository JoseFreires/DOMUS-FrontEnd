export async function deleteAviso(id ) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL; 

    try {
        const response = await fetch(`${API_URL}/avisos/${id}`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Erro ao deletar aviso");
        }
        return true;
    } catch (error) {
        console.error("Erro ao deletar aviso:", error);
        throw error;
    }
}