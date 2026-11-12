import { useCallback, useEffect, useRef, useState } from "react";
import chamadoGET from "@/features/chamado/services/chamadoGET";

const POLL_INTERVAL_MS = 30000;

export function useChamados() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const requestIdRef = useRef(0);

  const fetchChamados = useCallback(async () => {
    const requestId = ++requestIdRef.current;

    try {
      const result = await chamadoGET();
      if (requestId !== requestIdRef.current) return;
      setData(result);
      setError(null);
    } catch (requestError) {
      if (requestId !== requestIdRef.current) return;
      setError(requestError);
    } finally {
      if (requestId === requestIdRef.current) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const initialFetchId = setTimeout(fetchChamados, 0);
    const intervalId = setInterval(fetchChamados, POLL_INTERVAL_MS);

    return () => {
      clearTimeout(initialFetchId);
      clearInterval(intervalId);
      requestIdRef.current += 1;
    };
  }, [fetchChamados]);

  return { data, error, fetchChamados, isLoading };
}
