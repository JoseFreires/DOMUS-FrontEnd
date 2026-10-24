export const NAV_ITENS_ESPACOSCONDOMINIAIS = [
    { texto: "Ativos" },
    { texto: "Inativos" },                    
];

export function filterEspacosCondominiais(ativos, inativos, activeTab) {
  return (activeTab === "Inativos" ? inativos : ativos) ?? [];
}