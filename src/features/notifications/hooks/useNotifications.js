import { useCallback, useEffect, useState } from "react";
import { getNotifications } from "@/features/notifications/services/notificationsGET"


// Adapter: isola o formato do Back do resto do Front
function mapNotificacao(n) {
    return {
        id: n.idNotificacao,
        texto: n.descricao,
        data: new Date(n.dataHoraChegada),
    };
}

export function useNotifications({ intervalo = 30000 } = {}) {
    const [itens, setItens] = useState([]);
    const [status, setStatus] = useState("loading"); // loading | success | error

    const buscar = useCallback(async () => {
        try {
            const res = await getNotifications();

            const lista = res
                .map(mapNotificacao)
                .sort((a, b) => b.data - a.data); // mais recentes primeiro

            setItens(lista);
            setStatus("success");
        } catch {
            setStatus("error");
        }
    }, []);

    useEffect(() => {
        buscar();

        const id = setInterval(() => {
            // Pausa o polling se a aba estiver em segundo plano
            if (document.visibilityState === "visible") buscar();
        }, intervalo);

        return () => clearInterval(id); // limpa ao desmontar
    }, [buscar, intervalo]);

    return {
        notificacoes: itens,
        total: itens.length,
        status,
        carregando: status === "loading",
        erro: status === "error",
        recarregar: buscar,
    };
}