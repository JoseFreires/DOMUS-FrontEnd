export async function updateProfile(
    {
        nomeCompleto,
        email,
        telefone,
        foto
    }

) {
    console.log("Updating profile with data:", { nomeCompleto, email, telefone, foto });
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const formData = new FormData();

    formData.append("nomeCompleto", nomeCompleto);
    formData.append("email", email);
    formData.append("telefone", telefone.replace(/\D/g, ""));

    if (foto instanceof Blob) {
        formData.append("foto", foto, foto.name || `foto-${Date.now()}.jpg`);
    }

    try {
        const response = await fetch(`${API_URL}/auth/eu/perfil`, {
            method: "PUT",
            credentials: "include",
            body: formData,
        });
        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            const errorData = contentType?.includes("application/json")
                ? await response.json()
                : { message: `Erro ${response.status}: ${response.statusText}` };

            throw new Error(errorData.message || "Erro ao atualizar perfil");
        }

        return true;

    } catch (error) {
        console.error("Erro ao atualizar perfil:", error);
        throw error;
    }

}