import { useCallback, useEffect, useState } from "react";
import { listPessoasAutorizadas } from "@/features/pessoasAutorizadas/services/pessoasAutorizadasGET";

async function loadPeople(moradorId) {
  const response = await listPessoasAutorizadas(moradorId);
  if (response === null) {
    throw new Error("Não foi possível carregar as pessoas autorizadas.");
  }

  const pessoas = Array.isArray(response)
    ? response
    : response.pessoasAutorizadas ?? response.content ?? response.data ?? [];
  if (!Array.isArray(pessoas)) {
    throw new Error("A resposta de pessoas autorizadas está em formato inválido.");
  }

  return pessoas;
}

export function usePessoasAutorizadas(moradorId) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPessoasAutorizadas = useCallback(async () => {
    if (!moradorId) {
      setData([]);
      return [];
    }

    setLoading(true);
    setError("");

    try {
      const pessoas = await loadPeople(moradorId);
      setData(pessoas);
      return pessoas;
    } catch (fetchError) {
      setError(fetchError?.message || "Não foi possível carregar as pessoas autorizadas.");
      setData([]);
      console.error("Erro ao buscar pessoas autorizadas:", fetchError);
      return [];
    } finally {
      setLoading(false);
    }
  }, [moradorId]);

  useEffect(() => {
    if (!moradorId) return;

    let active = true;
    loadPeople(moradorId)
      .then((pessoas) => {
        if (active) {
          setData(pessoas);
          setError("");
        }
      })
      .catch((fetchError) => {
        if (active) {
          setData([]);
          setError(fetchError?.message || "Não foi possível carregar as pessoas autorizadas.");
          console.error("Erro ao buscar pessoas autorizadas:", fetchError);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [moradorId]);

  return { data, isLoading: Boolean(moradorId) && loading, error, fetchPessoasAutorizadas };
}
