"use client";

import { useEffect, useRef, useState } from "react";
import { FaBell } from "react-icons/fa";

import { useNotifications } from "@/features/notifications/hooks/useNotifications";
import styles from "./NotificationBell.module.css";

function tempoRelativo(data) {
    const diff = Math.floor((Date.now() - data.getTime()) / 1000);
    if (diff < 60) return "agora há pouco";
    if (diff < 3600) return `há ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `há ${Math.floor(diff / 3600)} h`;
    return `há ${Math.floor(diff / 86400)} dia(s)`;
}

export default function NotificationBell() {
    const [aberto, setAberto] = useState(false);
    const wrapperRef = useRef(null);
    const { notificacoes, total, carregando, erro, recarregar } = useNotifications();

    // Fecha ao clicar fora ou apertar Esc
    useEffect(() => {
        if (!aberto) return;

        const handleClickFora = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setAberto(false);
            }
        };
        const handleEsc = (e) => {
            if (e.key === "Escape") setAberto(false);
        };

        document.addEventListener("mousedown", handleClickFora);
        document.addEventListener("keydown", handleEsc);
        return () => {
            document.removeEventListener("mousedown", handleClickFora);
            document.removeEventListener("keydown", handleEsc);
        };
    }, [aberto]);

    return (
        <div className={styles.wrapper} ref={wrapperRef}>
            <button
                type="button"
                className={styles.bellButton}
                onClick={() => setAberto((prev) => !prev)}
                aria-label={`Notificações, ${total} itens`}
                aria-haspopup="true"
                aria-expanded={aberto}
            >
                <FaBell size={22} aria-hidden="true" />
                {total > 0 && (
                    <span className={styles.badge}>{total > 9 ? "9+" : total}</span>
                )}
            </button>

            {aberto && (
                <div className={styles.dropdown} role="region" aria-label="Lista de notificações">
                    <div className={styles.dropdownHeader}>
                        <h4 className={styles.dropdownTitle}>Notificações</h4>
                        {total > 0 && <span className={styles.counter}>{total}</span>}
                    </div>

                    <ul className={styles.list}>
                        {carregando && <li className={styles.state}>Carregando...</li>}

                        {erro && (
                            <li className={`${styles.state} ${styles.stateError}`}>
                                Não foi possível carregar.
                                <button type="button" className={styles.retry} onClick={recarregar}>
                                    Tentar novamente
                                </button>
                            </li>
                        )}

                        {!carregando && !erro && total === 0 && (
                            <li className={styles.state}>Você não tem notificações</li>
                        )}

                        {!carregando &&
                            !erro &&
                            notificacoes.map((n) => (
                                <li key={n.id} className={styles.item}>
                                    <p className={styles.itemText}>{n.texto}</p>
                                    <small className={styles.itemTime}>{tempoRelativo(n.data)}</small>
                                </li>
                            ))}
                    </ul>
                </div>
            )}
        </div>
    );
}