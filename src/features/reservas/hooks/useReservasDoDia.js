import { listReservasDoDia } from "@/features/reservas/services/reservaGET.js";
import { usePollingList } from "@/hooks/usePollingList";

export function useReservasDoDia({ data, enabled = true } = {}) {
  const { items, error, isLoading, refetch } = usePollingList({
    fetcher: () => listReservasDoDia(data),
    enabled: enabled && !!data,
    resetKey: data,
    mensagemErro: "Não foi possível carregar as reservas do dia.",
  });
  return { reservasDoDia: items, error, isLoading, fetchReservasDoDia: refetch };
}