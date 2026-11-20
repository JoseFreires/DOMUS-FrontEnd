import { useState, useEffect, useCallback } from "react";
import { getMoradorById } from "@/features/morador/services/moradorGET.js";
import { getEspacoById } from "@/features/espacoCondominial/services/espacoCondominialGET.js";

export function useDetalheSolicitacao(reserva, enabled) {
  const [morador, setMorador] = useState(null);
  const [espaco, setEspaco] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tentativa, setTentativa] = useState(0);

  const idMorador = reserva?.idMorador;
  const idEspaco = reserva?.idEspaco;

  useEffect(() => {
    if (!enabled || !idMorador || !idEspaco) return;

    let cancelado = false;
    setMorador(null);
    setEspaco(null);
    setError(null);
    setIsLoading(true);

    Promise.allSettled([getMoradorById(idMorador), getEspacoById(idEspaco)]).then(
      ([m, e]) => {
        if (cancelado) return;
        if (m.status === "fulfilled") setMorador(m.value);
        if (e.status === "fulfilled") setEspaco(e.value);
        const falha = [m, e].find((r) => r.status === "rejected");
        if (falha) setError(falha.reason);
        setIsLoading(false);
      }
    );

    return () => { cancelado = true; };
  }, [enabled, idMorador, idEspaco, tentativa]);

  const recarregar = useCallback(() => setTentativa((n) => n + 1), []);

  return { morador, espaco, isLoading, error, recarregar };
}