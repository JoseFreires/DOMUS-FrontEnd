export async function createConvidado({
    nome, email, telefone, cpf, dataNascimento, dataVisita, horaEntrada, horaSaida
}) {
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
        const response = await fetch(`${API_URL}/convidados`, {
            method: "POST",
            credentials: "include",
            body: formData,
        });



        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Erro ao registrar convidado");
        }
        return await response.json();
    } catch (error) {
        console.error("Erro ao registrar convidado:", error);
        throw error;
    }
}