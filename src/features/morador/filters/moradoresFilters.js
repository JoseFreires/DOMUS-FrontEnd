import { parseItemDate, isWithinDateRange } from "@/utils/dateUtils.js";

export const NAV_ITENS_MORADORES = [
    { texto: "Todos" },
    { texto: "Ativos" },
    { texto: "Inativos" },
];
 
export function extractFilterMoradores(data) {
    return Array.from(new Set((data ?? []).map((item) => item.nomeCompleto))).sort();
}

const TAB_FILTERS = {
    Todos:    () => true,
    Ativos:   (item) => item.ativo ==    1,
    Inativos: (item) => item.ativo == 0,
};
 
export function filterMoradores(data, activeTab, filters = {}) {
    const tabFilter = TAB_FILTERS[activeTab] ?? TAB_FILTERS.Todos;

    const {
        selectedUsers = [],
        startDate,
        endDate,
    } = filters;

    return (data ?? [])
        .filter(tabFilter)
        .filter((item) => {
            if (selectedUsers.length && !selectedUsers.includes(item.nomeCompleto)) {
                return false;
            }

            if (!startDate && !endDate) {
                return true;
            }

            const itemDate = parseItemDate(item.dataChegada);
            return isWithinDateRange(itemDate, filters);
        });
}