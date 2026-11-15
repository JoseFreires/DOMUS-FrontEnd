import { useState, useEffect, useCallback } from "react";
import {getLogs} from "@/features/logs/Services/logGET.js";

const POLL_INTERVAL_MS = 30000;

export function useLogs() {
    const [data, setData] = useState(null);

    const fetchLogs = useCallback(async () => {
        setData(await getLogs());
    }, []);

    useEffect(() => {
        fetchLogs();
        const intervalId = setInterval(fetchLogs, POLL_INTERVAL_MS);
        return () => clearInterval(intervalId);
    }, [fetchLogs]);

    return { data, fetchLogs, isLoading: data === null };
}