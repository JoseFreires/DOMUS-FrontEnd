// Abas das telas de Funcionários (porteiros) e Síndicos
export const NAV_ITENS_FUNCIONARIOS = [
    { texto: "Todos" },
    { texto: "Ativos" },
    { texto: "Inativos" },
];

export const NAV_ITENS_SINDICOS = NAV_ITENS_FUNCIONARIOS;

export function extractFilterFuncionarios(data) {
    return Array.from(new Set((data ?? []).map((item) => item.nomeCompleto))).sort();
}

const TAB_FILTERS = {
    Todos:    () => true,
    Ativos:   (item) => item.ativo == 1,
    Inativos: (item) => item.ativo == 0,
};

// serve para porteiros e síndicos: filtra pela aba e pelos nomes selecionados
export function filterFuncionarios(data, activeTab, filters = {}) {
    const tabFilter = TAB_FILTERS[activeTab] ?? TAB_FILTERS.Todos;
    const { selectedUsers = [] } = filters;

    return (data ?? [])
        .filter(tabFilter)
        .filter((item) => !selectedUsers.length || selectedUsers.includes(item.nomeCompleto));
}