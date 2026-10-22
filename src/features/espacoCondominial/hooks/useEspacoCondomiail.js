import { useState, useEffect, useCallback, useRef } from "react";
import {
  listEspacosCondominiaisAtivos,
  listEspacosCondominiaisInativos,
} from "@/features/espacoCondominial/services/espacoCondominialGET.js";

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

  return {
    ativos,
    inativos,
    error,
    isLoading,
    fetchEspacosCondominiais,
  };
}