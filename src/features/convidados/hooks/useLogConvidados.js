import { listLogConvidados } from "@/features/convidados/services/logConvidadoGET.js";
import { usePollingList } from "@/hooks/usePollingList";

// mais recentes primeiro; fica fora do hook para manter a referência estável
const maisRecentes = (a, b) =>
  new Date(b.dataHoraChegada).getTime() - new Date(a.dataHoraChegada).getTime();

export function useLogConvidados({ enabled = true } = {}) {
  const { items, error, isLoading, refetch } = usePollingList({
    fetcher: listLogConvidados,
    enabled,
    sorter: maisRecentes,
    mensagemErro: "Não foi possível carregar os registros de convidados.",
  });
  return { logs: items, error, isLoading, fetchLogs: refetch };
}