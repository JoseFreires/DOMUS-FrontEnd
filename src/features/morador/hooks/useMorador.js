import { useState, useEffect, useCallback, useRef } from "react";
import { listMorador, listMoradorInativos } from "@/features/morador/services/moradorGET.js";
import { softDeleteMorador } from "@/features/morador/services/moradorDELETE.js";

const POLL_INTERVAL_MS = 30000;

export function useMoradores(activeTab = "Ativos", isPorteiro = false) {
    const [loadResult, setLoadResult] = useState({
        tab: null,
        data: null,
        isLoading: true,
        accessDenied: false,
    });
    const requestId = useRef(0);

    const loadData = useCallback(async (loader, tab) => {
        const currentRequestId = ++requestId.current;
        setLoadResult({ tab, data: null, isLoading: true, accessDenied: false });

        try {
            const result = await loader();

            if (currentRequestId === requestId.current) {
                setLoadResult({
                    tab,
                    data: result,
                    isLoading: false,
                    accessDenied: false,
                });
            }

            return result;
        } catch (error) {
            if (currentRequestId === requestId.current) {
                if (error?.status !== 403) {
                    console.error("Erro ao buscar moradores:", error);
                }

                setLoadResult({
                    tab,
                    data: [],
                    isLoading: false,
                    accessDenied: error?.status === 403,
                });
            }

            return null;
        }
    }, []);

    const fetchMoradores = useCallback(
        () => loadData(listMorador, activeTab),
        [activeTab, loadData]
    );

    const fetchMoradoresInativos = useCallback(
        () => loadData(listMoradorInativos, activeTab),
        [activeTab, loadData]
    );

    const fetchTodosMoradores = useCallback(
        () => loadData(isPorteiro ? listMorador : async () => {
            const [moradoresAtivos, moradoresInativos] = await Promise.all([
                listMorador(),
                listMoradorInativos(),
            ]);

            if (moradoresAtivos === null || moradoresInativos === null) {
                return null;
            }

            const moradores = [...moradoresAtivos, ...moradoresInativos];
            const idsIncluidos = new Set();

            return moradores.filter((morador) => {
                if (morador.idMorador == null) {
                    return true;
                }

                if (idsIncluidos.has(morador.idMorador)) {
                    return false;
                }

                idsIncluidos.add(morador.idMorador);
                return true;
            });
        }, activeTab),
        [activeTab, isPorteiro, loadData]
    );

    useEffect(() => {
        const fetchFunction = activeTab === "Inativos"
            ? fetchMoradoresInativos
            : activeTab === "Todos"
                ? fetchTodosMoradores
                : fetchMoradores;

        fetchFunction();
        const intervalId = setInterval(fetchFunction, POLL_INTERVAL_MS);
        return () => clearInterval(intervalId);
    }, [activeTab, fetchMoradores, fetchMoradoresInativos, fetchTodosMoradores]);

    const removeMoradores = useCallback(async (ids, reason) => {
        try {
            await Promise.all(ids.map((id) => softDeleteMorador(id, reason)));
            setLoadResult((prev) => ({
                ...prev,
                data: prev.data
                    ? prev.data.filter((item) => !ids.includes(item.idMorador))
                    : prev.data,
            })
            );
        } catch (error) {
            console.error("Erro ao excluir moradores:", error);
            alert("Erro ao excluir os moradores. Tente novamente.");
        }
    }, []);

    const currentResult = loadResult.tab === activeTab
        ? loadResult
        : { data: null, isLoading: true, accessDenied: false };

    return {
        data: currentResult.data,
        accessDenied: currentResult.accessDenied,
        fetchMoradores,
        fetchMoradoresInativos,
        fetchTodosMoradores,
        removeMoradores,
        isLoading: currentResult.isLoading,
    };
}