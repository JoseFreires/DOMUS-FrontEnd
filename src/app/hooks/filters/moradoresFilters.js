import { parseItemDate, isWithinDateRange } from "../dateUtils.js";

export const NAV_ITENS_MORADORES = [
    { texto: "Todos" },
    { texto: "Ativos" },
    { texto: "Inativos" },
];
 
export function extractFilterMoradores(data) {
    return Array.from(new Set((data ?? []).map((item) => item.nome))).sort();
}

const TAB_FILTERS = {
    Todos:    () => true,
    Ativos:   (item) => item.ativo === 1,
    Inativos: (item) => item.ativo === 0,
};
 
export function filterMoradores(data, activeTab, filters) {
    const tabFilter = TAB_FILTERS[activeTab] ?? TAB_FILTERS.Todos;
 
    return (data ?? [])
        .filter(tabFilter)
        .filter((item) => {
            // campo correto do morador é "nome", não "nomeMorador"
            if (filters.selectedUsers.length && !filters.selectedUsers.includes(item.nome)) {
                return false;
            }
 
            // campo de data do morador é "dataChegada", não "dataHoraRecebido"
            if (!filters.startDate && !filters.endDate) {
                return true;
            }
 
            const itemDate = parseItemDate(item.dataChegada);
            return isWithinDateRange(itemDate, filters);
        });
}