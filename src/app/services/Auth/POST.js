const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function login(username, senha) {
    try {
        const response = await fetch(`${API_URL}/auth/entrar`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ senha, username }),
        });

        if (!response.ok) {
            // Alguns endpoints retornam corpo vazio (204/empty). Evitar chamar response.json() diretamente.
            const text = await response.text();
            let errorData = null;
            try {
                errorData = text ? JSON.parse(text) : null;
            } catch (e) {
                errorData = null;
            }
            throw new Error(errorData?.message || "Erro ao fazer login");
        }

        return true;
    } catch (error) {
        console.error("Erro ao fazer login:", error);
        throw error;
    }
}

export async function solicitarRedefinicaoSenha(email) {
    try {
        const response = await fetch(`${API_URL}/auth/esqueci-minha-senha`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: String(email).trim() }),
        });

        let data = null;
        try {
            data = await response.json();
        } catch (error) {
            data = null;
        }

        if (!response.ok) {
            throw new Error(data?.message || "Não foi possível solicitar a redefinição de senha.");
        }

        return data;
    } catch (error) {
        console.error('Erro ao solicitar redefinição de senha:', error);
        throw error;
    }
}

export async function redefinirSenha({ token, novaSenha, confirmarSenha } = {}) {
    try {
        const baseUrl = `${API_URL}/auth/redefinir-senha`;
        const url = token ? `${baseUrl}?token=${encodeURIComponent(token)}` : baseUrl;

        const payload = { novaSenha };
        if (typeof confirmarSenha !== 'undefined') payload.confirmarSenha = confirmarSenha;

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (response.status === 204 || response.ok) {
            return true;
        }

        let data = null;
        try {
            data = await response.json();
        } catch (err) {
            data = null;
        }

        const defaultByStatus = {
            400: 'O link de recuperação é inválido. Solicite uma nova redefinição de senha.',
            410: 'O link de recuperação expirou. Solicite uma nova redefinição de senha.',
            409: 'Este link de recuperação já foi utilizado. Solicite uma nova redefinição de senha.',
            422: 'A nova senha não atende aos requisitos de segurança.',
        };

        const message = data?.message || defaultByStatus[response.status] || 'Não foi possível redefinir a senha.';
        const err = new Error(message);
        err.status = response.status;
        throw err;
    } catch (error) {
        console.error('Erro ao redefinir senha:', error);
        throw error;
    }
}

