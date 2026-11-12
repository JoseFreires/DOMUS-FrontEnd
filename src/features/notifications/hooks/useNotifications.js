import { useCallback, useEffect, useRef, useState } from "react";
import { getNotifications } from "../services/notificationsGET.js";

function mapNotificacao(n) {
    const data = new Date(n.dataHoraChegada);
    return {
        id: n.idNotificacao,
        texto: n.descricao,
        data: Number.isNaN(data.getTime()) ? new Date() : data,
    };
}

function notificarNoSistema(n) {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (Notification.permission !== "granted") return;

    try {
        const notif = new Notification("Nova notificação", {
            body: n.texto,
            tag: String(n.id),
        });
        notif.onclick = () => {
            window.focus();
            notif.close();
        };
    } catch (e) {
        console.error("Não foi possível exibir a notificação do sistema:", e);
    }
}

export function useNotifications({ intervalo = 30000 } = {}) {
    const [itens, setItens] = useState([]);
    const [status, setStatus] = useState("loading");
    const [permissao, setPermissao] = useState("default");
    const idsConhecidos = useRef(null);
    const requestId = useRef(0);

    useEffect(() => {
        setPermissao(
            "Notification" in window ? Notification.permission : "unsupported"
        );
    }, []);

    const ativarNotificacoesDoSistema = useCallback(async () => {
        if (!("Notification" in window)) return;
        const resultado = await Notification.requestPermission();
        setPermissao(resultado);
    }, []);

    const buscar = useCallback(async () => {
        const id = ++requestId.current;
        setStatus((prev) => (prev === "error" ? "loading" : prev));

        try {
            const json = await getNotifications(); // ajuste se o serviço devolver Response
            if (id !== requestId.current) return;

            const bruto = Array.isArray(json) ? json : json?.content ?? [];
            const lista = bruto.map(mapNotificacao).sort((a, b) => b.data - a.data);

            if (idsConhecidos.current !== null) {
                lista
                    .filter((n) => !idsConhecidos.current.has(n.id))
                    .forEach(notificarNoSistema);
            }
            idsConhecidos.current = new Set(lista.map((n) => n.id));

            setItens(lista);
            setStatus("success");
        } catch (err) {
            if (id !== requestId.current) return;
            console.error("Erro ao buscar notificações:", err);
            // mantém a lista já carregada em falhas de polling
            setStatus((prev) => (prev === "success" ? "success" : "error"));
        }
    }, []);

    useEffect(() => {
        buscar();
        const timer = setInterval(() => {
            if (!document.hidden) buscar();
        }, intervalo);

        return () => {
            clearInterval(timer);
            requestId.current++; // invalida requisições pendentes
        };
    }, [buscar, intervalo]);

    return {
        notificacoes: itens,
        total: itens.length,
        status,
        carregando: status === "loading",
        erro: status === "error",
        recarregar: buscar,
        permissao,
        ativarNotificacoesDoSistema,
    };
}