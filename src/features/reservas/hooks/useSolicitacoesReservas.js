import { listSolicitacoesReservas } from "@/features/reservas/services/reservaGET.js";
import { usePollingList } from "@/hooks/usePollingList";

const maisRecentes = (a, b) => String(b.dataReserva).localeCompare(String(a.dataReserva));

export function useSolicitacoesReservas({ enabled = true } = {}) {
  const { items, error, isLoading, refetch } = usePollingList({
    fetcher: listSolicitacoesReservas,
    enabled,
    sorter: maisRecentes,
    mensagemErro: "Não foi possível carregar as solicitações.",
  });
  return { solicitacoes: items, error, isLoading, fetchSolicitacoes: refetch };
}