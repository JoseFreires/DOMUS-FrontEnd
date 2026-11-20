import { useState, useEffect, useCallback, useRef } from "react";
import { listReservasDisponiveis } from "@/features/reservas/services/reservaGET.js";

export function useReservas({ data, poll = true } = {}) {
  const [reservasDisponiveis, setReservasDisponiveis] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const requestId = useRef(0);

  const fetchReservas = useCallback(async () => {
    if (!data) {
      setReservasDisponiveis([]);
      setIsLoading(false);
      return;
    }

    const id = ++requestId.current;
    setIsLoading(true);               
    try {
      const lista = await listReservasDisponiveis(data);
      if (id !== requestId.current) return;
      setReservasDisponiveis(Array.isArray(lista) ? lista : []);
      setError(null);
    } catch (err) {
      if (id !== requestId.current) return;
      console.error("Erro ao buscar reservas:", err);
      setError(err);
    } finally {
      if (id === requestId.current) setIsLoading(false);
    }
  }, [data]);

  useEffect(() => {
    fetchReservas();
    let intervalId;
    if (poll && data) {
      intervalId = setInterval(() => {
        if (!document.hidden) fetchReservas();
      }, 30000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
      requestId.current++;
    };
  }, [fetchReservas, poll, data]);

  return { reservasDisponiveis, error, isLoading, fetchReservas };
}