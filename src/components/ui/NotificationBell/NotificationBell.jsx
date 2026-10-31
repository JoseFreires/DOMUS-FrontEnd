"use client";

import { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";

import { useNotifications } from "@/features/notifications/hooks/useNotifications";


function tempoRelativo(data) {
    const diff = Math.floor((Date.now() - data.getTime()) / 1000);
    if (diff < 60) return "agora há pouco";
    if (diff < 3600) return `há ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `há ${Math.floor(diff / 3600)} h`;
    return `há ${Math.floor(diff / 86400)} dia(s)`;
}

export default function NotificationBell() {
    const [aberto, setAberto] = useState(false);
    const { notificacoes, total, carregando, erro, recarregar } = useNotifications();



    return (
        <div>
            <button
                onClick={() => setAberto(!aberto)}
                aria-label={`Notificações, ${total} itens`}
            >
                <FaBell size={50}/> {total > 0 && <span>{total > 9 ? "9+" : total}</span>}
            </button>

            {aberto && (
                <ul>
                    {carregando && <li>Carregando...</li>}

                    {erro && (
                        <li>
                            Não foi possível carregar.{" "}
                            <button onClick={recarregar}>Tentar novamente</button>
                        </li>
                    )}

                    {!carregando && !erro && total === 0 && (
                        <li>Você não tem notificações</li>
                    )}

                    {!carregando && !erro &&
                        notificacoes.map((n) => (
                            <li key={n.id}>
                                <p>{n.texto}</p>
                                <small>{tempoRelativo(n.data)}</small>
                            </li>
                        ))}
                </ul>
            )}
        </div>
    );
}