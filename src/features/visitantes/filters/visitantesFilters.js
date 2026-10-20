import { parseItemDate, isWithinDateRange } from "@/utils/dateUtils.js";

export function extractFilterVisitantes(data) {
    return Array.from(new Set((data ?? []).map((item) => item.bloco))).sort();
}

export function filterVisitantes(data, filters = {}) {

    const {
        selectedBloco = [],
        startDate,
        endDate,
    } = filters;

    return (data ?? [])
        .filter((item) => {
            if (selectedBloco.length && !selectedBloco.includes(item.bloco)) {
                return false;
            }

            if (!startDate && !endDate) {
                return true;
            }

            const itemDate = parseItemDate(item.dataHoraChegada);
            return isWithinDateRange(itemDate, filters);
        });
}