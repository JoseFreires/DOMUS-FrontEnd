export async function softDeleteEspacoCondominial(id) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
 
    try {
        const response = await fetch(`${API_URL}/espacos/${id}`, {
            method: "DELETE",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                deleted: true,
            }),
        });
 
        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            const errorData = contentType?.includes("application/json")
                ? await response.json()
                : { message: `Erro ${response.status}: ${response.statusText}` };
 
            throw new Error(errorData.message || "Erro ao desativar espaço");
        }
 
        return true;
    } catch (error) {
        console.error("Erro ao desativar Espaço Condominial:", error);
        throw error;
    }
}
 