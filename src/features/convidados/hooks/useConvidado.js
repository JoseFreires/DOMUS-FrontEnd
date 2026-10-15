import { useState, useEffect, useCallback } from "react";
import { listConvidados } from "@/features/convidados/services/convidadoGET.js";

const POLL_INTERVAL_MS = 30000;

export function useConvidado() {
    const [data, setData] = useState(null);

    const fetchConvidados = useCallback(async () => {
        setData(await listConvidados());
    }, []);

    useEffect(() => {
        fetchConvidados();
        const intervalId = setInterval(fetchConvidados, POLL_INTERVAL_MS);
        return () => clearInterval(intervalId);
    }, [fetchConvidados]);

    return { data, fetchConvidados, isLoading: data === null };

}