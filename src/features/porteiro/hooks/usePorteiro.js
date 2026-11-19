import { useEntityTabs } from "@/hooks/useEntityTabs";
import { listPorteiros, listPorteirosInativos } from "@/features/porteiro/services/porteiroGET.js";
import { softDeletePorteiro } from "@/features/porteiro/services/porteiroDELETE.js";

export function usePorteiros(activeTab = "Todos") {
    const { data, isLoading, accessDenied, refetch, remove } = useEntityTabs({
        activeTab,
        listAtivos: listPorteiros,
        listInativos: listPorteirosInativos,
        softDelete: softDeletePorteiro,
        getId: (item) => item.idPorteiro,
        entityLabel: "os porteiros",
    });

    return {
        data,
        isLoading,
        accessDenied,
        fetchPorteiros: refetch,
        removePorteiros: remove,
    };
}
