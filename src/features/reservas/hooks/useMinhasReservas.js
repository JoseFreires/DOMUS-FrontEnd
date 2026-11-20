import { useState, useEffect, useCallback, useRef } from "react";
import { listMinhasReservas } from "@/features/reservas/services/reservaGET.js";

const POLL_INTERVAL_MS = 30000;

export function useMinhasReservas({ poll = true, enabled = true } = {}) {
    const [reservas, setReservas] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const requestId = useRef(0);

    const fetchMinhasReservas = useCallback(async () => {
        const id = ++requestId.current;
        try {
            const lista = await listMinhasReservas();
            if (id !== requestId.current) return;
            if (!Array.isArray(lista)) throw new Error("Não foi possível carregar suas reservas.");

            // mais recentes primeiro
            setReservas([...lista].sort((a, b) => String(b.dataReserva).localeCompare(String(a.dataReserva))));
            setError(null);
        } catch (err) {
            if (id !== requestId.current) return;
            console.error("Erro ao buscar minhas reservas:", err);
            setError(err); 
        } finally {
            if (id === requestId.current) setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!enabled) return;
        fetchMinhasReservas();

        let intervalId;
        if (poll) {
            intervalId = setInterval(() => {
                if (!document.hidden) fetchMinhasReservas();
            }, POLL_INTERVAL_MS);
        }
        return () => {
            if (intervalId) clearInterval(intervalId);
            requestId.current++;
        };
    }, [fetchMinhasReservas, poll, enabled]);

    return { reservas, error, isLoading, fetchMinhasReservas };
}