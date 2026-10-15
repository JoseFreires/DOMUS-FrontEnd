import { useState, useEffect, useCallback, useRef } from "react";
import { getUserProfile } from "@/features/auth/services/authGET";

const POLL_INTERVAL_MS = 30000;

export function useProfile({ poll = false } = {}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const requestId = useRef(0);

  const fetchProfile = useCallback(async () => {
    const id = ++requestId.current;
    try {
      const result = await getUserProfile();
      if (id !== requestId.current) return; // resposta antiga: descarta
      setData(result);
      setError(null);
    } catch (err) {
      if (id !== requestId.current) return;
      setError(err);
    } finally {
      if (id === requestId.current) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();

    if (!poll) return () => { requestId.current++; };

    const intervalId = setInterval(() => {
      if (!document.hidden) fetchProfile();
    }, POLL_INTERVAL_MS);

    return () => {
      clearInterval(intervalId);
      requestId.current++; // invalida requisições pendentes
    };
  }, [fetchProfile, poll]);

  return { data, error, isLoading, fetchProfile };
}