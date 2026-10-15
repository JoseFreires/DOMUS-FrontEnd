export async function deleteProfile() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
 
    try {
        const response = await fetch(`${API_URL}/auth/eu/perfil`, {
            method: "DELETE",
            credentials: "include",
            headers: { "Content-Type": "application/json" }
        });
 
        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            const errorData = contentType?.includes("application/json")
                ? await response.json()
                : { message: `Erro ${response.status}: ${response.statusText}` };
 
            throw new Error(errorData.message || "Erro ao excluir cadastro");
        }
 
        return true;
    } catch (error) {
        console.error("Erro ao excluir cadastro:", error);
        throw error;
    }
}