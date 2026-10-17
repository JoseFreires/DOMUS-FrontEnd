import { useState, useEffect, useCallback } from "react";
import { listAvisos } from "@/features/aviso/services/avisosGET.js";
import { deleteAviso } from "@/features/aviso/services/avisosDEL.js";

const POLL_INTERVAL_MS = 30000;

export function useAvisos() {
    const [data, setData] = useState(null);

    const fetchAvisos = useCallback(async () => {
        setData(await listAvisos());
    }, []);

    useEffect(() => {
        fetchAvisos();
        const intervalId = setInterval(fetchAvisos, POLL_INTERVAL_MS);
        return () => clearInterval(intervalId);
    }, [fetchAvisos]);

    const removeAvisos = useCallback(async (ids) => {
        try {
            await Promise.all(ids.map((id) => deleteAviso(id)));
            setData((prev) =>
                prev ? prev.filter((item) => !ids.includes(item.id)) : prev
            );
        } catch (error) {
            console.error("Erro ao excluir avisos:", error);
            alert("Erro ao excluir os avisos. Tente novamente.");
        }
    }, []);

    return { data, fetchAvisos, removeAvisos, isLoading: data === null };
}