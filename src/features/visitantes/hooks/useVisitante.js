import { useState, useEffect, useCallback, useRef } from "react";
import { listVisitante } from "@/features/visitantes/services/visitanteGET.js";

const POLL_INTERVAL_MS = 30000;

export function useVisitante() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const requestIdRef = useRef(0);

    const fetchVisitante = useCallback(async () => {
        const requestId = ++requestIdRef.current;
        try {
            const result = await listVisitante();
            if (requestId !== requestIdRef.current) return; 
            setData(result);
            setError(null);
        } catch (err) {
            if (requestId !== requestIdRef.current) return;
            setError(err);
        } finally {
            if (requestId === requestIdRef.current) setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchVisitante();
        const intervalId = setInterval(fetchVisitante, POLL_INTERVAL_MS);
        return () => {
            clearInterval(intervalId);
            requestIdRef.current++; 
        };
    }, [fetchVisitante]);

    return { data, error, isLoading, fetchVisitante };
}