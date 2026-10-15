export async function updateConvidado(id, { nome, email, telefone, cpf, dataNascimento, dataVisita, horaEntrada, horaSaida }) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const formData = new FormData();

    formData.append("nome", nome);
    formData.append("email", email);
    formData.append("telefone", telefone);
    formData.append("cpf", cpf);
    formData.append("dataNascimento", dataNascimento);
    formData.append("dataVisita", dataVisita);
    formData.append("horaEntrada", horaEntrada);
    formData.append("horaSaida", horaSaida);

    try {
        const response = await fetch(`${API_URL}/convidados/${id}`, {
            method: "PUT",
            credentials: "include",
            body: formData,
        });

        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            const errorData = contentType?.includes("application/json")
                ? await response.json()
                : { message: `Erro ${response.status}: ${response.statusText}` };

            throw new Error(errorData.message || "Erro ao atualizar convidado");
        }

        return true;
    } catch (error) {
        console.error("Erro ao atualizar convidado:", error);
        throw error;
    }
}