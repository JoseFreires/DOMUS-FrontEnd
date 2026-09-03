import { parseItemDate, isWithinDateRange } from "../dateUtils.js";

export const NAV_ITENS_ENCOMENDAS = [
    { texto: "Recebidas" },
    { texto: "Entregues" },
];
 

function normalizeStatus(status) {
    if (!status) return "";
    return status.toUpperCase().replace(/S$/, ""); // "RECEBIDAS" -> "RECEBIDA"
}
 
const TAB_FILTERS = {
    Recebidas: (item) => normalizeStatus(item.status) === "RECEBIDA",
    Entregues: (item) => normalizeStatus(item.status) === "ENTREGUE",
};
 
export function extractFilterUsers(data) {
    return Array.from(new Set((data || []).map((item) => item.nomeMorador))).sort();
}
 
export function filterEncomendas(data, activeTab, filters) {
    const tabFilter = TAB_FILTERS[activeTab] ?? TAB_FILTERS.Recebidas;
 
    return (data || [])
        .filter(tabFilter)
        .filter((item) => {
            if (filters.selectedUsers.length && !filters.selectedUsers.includes(item.nomeMorador)) {
                return false;
            }
            const itemDate = parseItemDate(item.dataHoraRecebido);
            return isWithinDateRange(itemDate, filters);
        });
}