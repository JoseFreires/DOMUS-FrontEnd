const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const PUBLIC_AUTH_ROUTES = [
    
    "/login",
    "/pages/login",
    "/esqueci-minha-senha",
    "/pages/esqueci-minha-senha",
    "/redefinir-senha",
    "/pages/redefinir-senha",
];

export function shouldSkipAuthCheck(pathname) {
    if (!pathname) return false;

    return PUBLIC_AUTH_ROUTES.some((route) => 
        pathname === route || pathname.startsWith(`${route}/`)
    );
}

// Busca o usuário autenticado atual através de chamada à API de autenticação.
// Retorna os dados do usuário se autenticado, ou null se não autenticado ou em caso de erro.
// Usa credentials 'include' para enviar cookies de autenticação automaticamente.
export async function getCurrentUser() {
    try {
        const response = await fetch(`${API_URL}/auth/eu`, {
            method: 'GET',
            credentials: 'include', // autenticação pelo cookie
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            return null;  // não autenticado ou erro
        }

        const user = await response.json();
        return user;
    } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        return null;
    }
}
