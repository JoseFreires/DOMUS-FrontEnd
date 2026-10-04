import { useState, useEffect, useCallback } from "react";
import { listEspacosCondominiais } from "@/features/espacoCondominial/services/espacoCondominialGET.js";

const POLL_INTERVAL_MS = 30000;

export function useEspacoCondominial() {
    const [data, setData] = useState(null);

    const fetchEspacosCondominiais = useCallback(async () => {
        setData(await listEspacosCondominiais());
    }, []);

    useEffect(() => {
        fetchEspacosCondominiais();
        const intervalId = setInterval(fetchEspacosCondominiais, POLL_INTERVAL_MS);
        return () => clearInterval(intervalId);
    }, [fetchEspacosCondominiais]);

    return { data, fetchEspacosCondominiais, isLoading: data === null };

}