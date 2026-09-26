export function mascaraCPF(valor) {
    return valor
        .replace(/\D/g, "")
        .slice(0, 11)                        
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})/, "$1-$2");
}

export function mascaraTelefone(valor) {
    return valor
        .replace(/\D/g, "")
        .slice(0, 11)                          
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d{4})$/, "$1-$2");
}

// Mapa central
export const MASKS = {
    cpf: mascaraCPF,
    telefone: mascaraTelefone,
};

export function applyMask(maskName, value) {
    const fn = MASKS[maskName];
    return fn ? fn(value) : value;
}