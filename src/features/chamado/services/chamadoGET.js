export async function chamadoGET() {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
	try {
		const response = await fetch(`${API_URL}/chamados`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });

		return await response.data;

	} catch (error) {
		const message =
			error.response?.data?.message ||
			error.response?.data?.error ||
			error.message ||
			"Não foi possível carregar os chamados.";

		throw new Error(message);
	}
}

export default chamadoGET;
