export const NAV_ITENS_MORADORES = [
    { texto: "Todos" },
];
 
export function extractFilterMoradores(data) {
    return Array.from(new Set((data ?? []).map((item) => item.nome))).sort();
}
 

export function filterMoradores(data) {
    return data ?? [];
}