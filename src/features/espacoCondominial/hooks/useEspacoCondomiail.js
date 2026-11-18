import { useState, useEffect, useCallback, useRef } from "react";
import {
  listEspacosCondominiaisAtivos,
  listEspacosCondominiaisInativos
} from "@/features/espacoCondominial/services/espacoCondominialGET.js";

import {softDeleteEspacoCondominial} from "@/features/espacoCondominial/services/espacoCondominialDELETE.js"
import {patchEspacoCondominial} from "@/features/espacoCondominial/services/espacoCondominialPATCH.js"

const POLL_INTERVAL_MS = 30000;

export function useEspacoCondominial({ poll = true } = {}) {
  const [ativos, setAtivos] = useState(null);
  const [inativos, setInativos] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const requestId = useRef(0);

  // Busca as duas listas juntas, mantendo-as consistentes
  const fetchEspacosCondominiais = useCallback(async () => {
    const id = ++requestId.current;
    try {
      const [listaAtivos, listaInativos] = await Promise.all([
        listEspacosCondominiaisAtivos(),
        listEspacosCondominiaisInativos(),
      ]);
      if (id !== requestId.current) return; // resposta antiga: descarta
      setAtivos(listaAtivos ?? []);
      setInativos(listaInativos ?? []);
      setError(null);
    } catch (err) {
      if (id !== requestId.current) return;
      console.error("Erro ao buscar espaços condominiais:", err);
      setError(err);
    } finally {
      if (id === requestId.current) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEspacosCondominiais();

    let intervalId;
    if (poll) {
      intervalId = setInterval(() => {
        if (!document.hidden) fetchEspacosCondominiais();
      }, POLL_INTERVAL_MS);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      requestId.current++; // invalida requisições pendentes
    };
  }, [fetchEspacosCondominiais, poll]);

  // Os erros sobem (ApiError) para o formulário exibir a mensagem; sem alert.
  // O refresh é separado: falha ao recarregar não deve virar "erro ao desativar".
  const refreshSilencioso = useCallback(async () => {
    try {
      await fetchEspacosCondominiais();
    } catch (err) {
      console.error("Operação concluída, mas não foi possível atualizar a lista:", err);
    }
  }, [fetchEspacosCondominiais]);

  const inactiveEspacoCondominial = useCallback(async (id) => {
    await softDeleteEspacoCondominial(id);
    await refreshSilencioso();
  }, [refreshSilencioso]);

  const activeEspacoCondominial = useCallback(async (id) => {
    await patchEspacoCondominial(id);
    await refreshSilencioso();
  }, [refreshSilencioso]);

  return {
    ativos,
    inativos,
    activeEspacoCondominial,
    inactiveEspacoCondominial,
    error,
    isLoading,
    fetchEspacosCondominiais,
  };
}