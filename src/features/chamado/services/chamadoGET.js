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

		if (!response.ok) {
			throw new Error("Não foi possível carregar os chamados.");
		}

		const data = await response.json();
		if (!Array.isArray(data)) {
			throw new Error("A resposta de chamados está em um formato inválido.");
		}

		return data;
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
		throw new Error("Não foi possível carregar os chamados.");
	}
}

export default chamadoGET;
