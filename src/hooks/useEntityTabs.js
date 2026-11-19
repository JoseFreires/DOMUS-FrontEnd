import { useState, useEffect, useCallback, useRef } from "react";

const POLL_INTERVAL_MS = 30000;

/**
 * Carrega uma lista com abas "Todos" | "Ativos" | "Inativos" 
 *
 * @param {object}   params
 * @param {string}   params.activeTab      — aba atual
 * @param {function} params.listAtivos()   — GET da lista de ativos
 * @param {function} params.listInativos() — GET da lista de inativos (pode lançar erro com .status 403)
 * @param {function} params.softDelete(id, reason) — DELETE lógico de um registro
 * @param {function} params.getId(item)    — id usado para remover duplicados na aba "Todos"
 * @param {string}   params.entityLabel    — texto do alerta de erro (ex: "os porteiros")
 *
 * @returns {{ data, isLoading, accessDenied, refetch, remove }}
 */
export function useEntityTabs({
    activeTab = "Todos",
    listAtivos,
    listInativos,
    softDelete,
    getId,
    entityLabel = "os registros",
}) {
    const [state, setState] = useState({
        tab: null,
        data: null,
        isLoading: true,
        accessDenied: false,
    });
    const requestId = useRef(0);

    // funções do chamador ficam num ref: o polling não reinicia a cada render
    const fns = useRef({});
    fns.current = { listAtivos, listInativos, softDelete, getId };

    const load = useCallback(async () => {
        const currentRequestId = ++requestId.current;
        const { listAtivos, listInativos, getId } = fns.current;

        // só mostra o "carregando" ao trocar de aba; no polling mantém os dados
        setState((prev) =>
            prev.tab === activeTab
                ? prev
                : { tab: activeTab, data: null, isLoading: true, accessDenied: false }
        );

        try {
            let data;

            if (activeTab === "Ativos") {
                data = await listAtivos();
            } else if (activeTab === "Inativos") {
                data = await listInativos();
            } else {
                const [ativos, inativos] = await Promise.all([listAtivos(), listInativos()]);
                if (ativos === null || inativos === null) {
                    data = null;
                } else {
                    const vistos = new Set();
                    data = [...ativos, ...inativos].filter((item) => {
                        const id = getId(item);
                        if (id == null) return true;
                        if (vistos.has(id)) return false;
                        vistos.add(id);
                        return true;
                    });
                }
            }

            if (currentRequestId === requestId.current) {
                setState({ tab: activeTab, data, isLoading: false, accessDenied: false });
            }
            return data;
        } catch (error) {
            if (currentRequestId === requestId.current) {
                if (error?.status !== 403) console.error("Erro ao buscar registros:", error);
                setState({
                    tab: activeTab,
                    data: [],
                    isLoading: false,
                    accessDenied: error?.status === 403,
                });
            }
            return null;
        }
    }, [activeTab]);

    useEffect(() => {
        load();
        const intervalId = setInterval(load, POLL_INTERVAL_MS);
        return () => clearInterval(intervalId);
    }, [load]);

    const remove = useCallback(
        async (ids, reason) => {
            try {
                await Promise.all(ids.map((id) => fns.current.softDelete(id, reason)));
                await load(); // recarrega a aba atual (na "Todos" o item passa a aparecer como inativo)
            } catch (error) {
                console.error(`Erro ao excluir ${entityLabel}:`, error);
                alert(`Erro ao excluir ${entityLabel}. Tente novamente.`);
            }
        },
        [load, entityLabel]
    );

    // se o resultado ainda é de outra aba, mostra "carregando" até chegar o da aba atual
    const view =
        state.tab === activeTab
            ? state
            : { data: null, isLoading: true, accessDenied: false };

    return {
        data: view.data,
        isLoading: view.isLoading,
        accessDenied: view.accessDenied,
        refetch: load,
        remove,
    };
}
