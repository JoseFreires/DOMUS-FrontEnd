import { useEntityTabs } from "@/hooks/useEntityTabs";
import { listSindicos, listSindicosInativos } from "@/features/sindico/services/sindicoGET.js";
import { softDeleteSindico } from "@/features/sindico/services/sindicoDELETE.js";

export function useSindicos(activeTab = "Todos") {
    const { data, isLoading, accessDenied, refetch, remove } = useEntityTabs({
        activeTab,
        listAtivos: listSindicos,
        listInativos: listSindicosInativos,
        softDelete: softDeleteSindico,
        getId: (item) => item.idUsuario,
        entityLabel: "os síndicos",
    });

    return {
        data,
        isLoading,
        accessDenied,
        fetchSindicos: refetch,
        removeSindicos: remove,
    };
}