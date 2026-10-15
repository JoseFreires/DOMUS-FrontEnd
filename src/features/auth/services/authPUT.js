const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function aceitarTermosDeUso() {
    try {
        const response = await fetch(`${API_URL}/auth/aceitar-termos`, {
            method: 'PUT',
            credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        });
        if (!response.ok) {
            const contentType = response.headers.get('content-type');
            const errorData = contentType && contentType.includes('application/json')
                ? await response.json()
                : { message: `Erro ${response.status}: ${response.statusText}` };

            throw new Error(errorData.message || "Erro ao aceitar os termos");
        }
        return true;
    } catch (error) {
        console.error("Erro ao aceitar os termos:", error);
        throw error;
    }
}