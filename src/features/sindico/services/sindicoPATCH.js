export async function reativarSindico(idUsuario) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const response = await fetch(`${API_URL}/sindicos/inativos/reativar/${idUsuario}`, {
        method: "PATCH",
        credentials: "include",
    });

    if (!response.ok) {
        const contentType = response.headers.get("content-type");
        const errorData = contentType?.includes("application/json")
            ? await response.json()
            : { message: `Erro ${response.status}: ${response.statusText}` };

        const error = new Error(errorData.message || "Erro ao reativar síndico");
        error.status = response.status;
        throw error;
    }

    return true;
}