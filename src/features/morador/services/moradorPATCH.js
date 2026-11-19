export async function reativarMorador(idPessoa) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    
    try {
        const response = await fetch(`${API_URL}/moradores/inativos/reativar/${idPessoa}`, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            return null;
        }

        return true;
    } catch (error) {
        console.error("Erro ao reativar morador:", error);
        return null;
    }
}