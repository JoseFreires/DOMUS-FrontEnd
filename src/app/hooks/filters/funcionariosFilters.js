export const NAV_ITENS_FUNCIONARIOS = [
    { texto: "Porteiros" },
    { texto: "Síndicos" },
];
 
export function extractFilterFuncionarios(data) {
    return Array.from(new Set((data ?? []).map((item) => item.nomeCompleto))).sort();
}

export function filterPorteiros(data) {
    return data ?? [];
}
 
export function filterSindicos(data) {
    return data ?? [];
}