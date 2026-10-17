import { parseItemDate, isWithinDateRange } from "@/utils/dateUtils.js";

export const NAV_ITENS_AVISOS = [
    { texto: "Ativos" },
    { texto: "Inativos" },
];

export function extractFilterAvisos(data) {
    return Array.from(new Set((data ?? []).map((item) => item.nomeSindico).filter(Boolean))).sort();
}

export function extractFilterTiposAviso(data) {
    return Array.from(new Set((data ?? []).map((item) => item.tipoAviso).filter(Boolean))).sort();
}

const TAB_FILTERS = {
    Ativos: () => true,
    Inativos: () => false,
};

export function filterAvisos(data, activeTab, filters = {}) {
    const tabFilter = TAB_FILTERS[activeTab] ?? TAB_FILTERS.Ativos;
    const { selectedUsers = [], selectedTypes = [] } = filters;

    return (data ?? [])
        .filter(tabFilter)
        .filter((item) => {
            if (selectedUsers.length && !selectedUsers.includes(item.nomeSindico)) {
                return false;
            }

            if (selectedTypes.length && !selectedTypes.includes(item.tipoAviso)) {
                return false;
            }

            const itemDate = parseItemDate(item.dataHoraAviso);
            return isWithinDateRange(itemDate, filters);
        });
}