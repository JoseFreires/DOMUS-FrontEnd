import { useState, useEffect, useCallback } from "react";
import { listConvidadosDoMorador } from "@/features/convidados/services/convidadoGET.js";

export function useConvidadosDoMorador(idMorador, enabled) {
    const [convidados, setConvidados] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [tentativa, setTentativa] = useState(0);

    useEffect(() => {
        if (!enabled || !idMorador) return;

        let cancelado = false;
        setConvidados([]);
        setError(null);
        setIsLoading(true);

        listConvidadosDoMorador(idMorador)
            .then((lista) => {
                if (cancelado) return;
                if (!Array.isArray(lista)) throw new Error("Resposta inválida do servidor.");
                setConvidados(lista);
            })
            .catch((err) => {
                if (cancelado) return;
                console.error(err);
                setError(err);
            })
            .finally(() => {
                if (!cancelado) setIsLoading(false);
            });

        // fechar o modal ou trocar de morador descarta a resposta pendente
        return () => { cancelado = true; };
    }, [idMorador, enabled, tentativa]);

    const recarregar = useCallback(() => setTentativa((n) => n + 1), []);

    return { convidados, isLoading, error, recarregar };
}