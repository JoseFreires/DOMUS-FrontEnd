import { useState, useEffect, useCallback, useRef } from "react";

const POLL_INTERVAL_MS = 30000;

export function usePollingList({ fetcher, enabled = true, poll = true, resetKey, sorter, mensagemErro }) {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const requestId = useRef(0);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher; 

  const refetch = useCallback(async () => {
    const id = ++requestId.current;
    try {
      const lista = await fetcherRef.current();
      if (id !== requestId.current) return; 
      if (!Array.isArray(lista)) throw new Error(mensagemErro ?? "Não foi possível carregar os dados.");
      setItems(sorter ? [...lista].sort(sorter) : lista);
      setError(null);
    } catch (err) {
      if (id !== requestId.current) return;
      console.error(err);
      setError(err); 
    } finally {
      if (id === requestId.current) setIsLoading(false);
    }
  }, [sorter, mensagemErro]);

  useEffect(() => {
    if (!enabled) return;
    setItems([]);
    setIsLoading(true);
    refetch();

    let intervalId;
    if (poll) {
      intervalId = setInterval(() => {
        if (!document.hidden) refetch();
      }, POLL_INTERVAL_MS);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
      requestId.current++; 
    };
  }, [refetch, enabled, poll, resetKey]);

  return { items, error, isLoading, refetch };
}