"use client";

import styles from "./page.module.css";
import Sidebar from "@/components/ui/Sidebar/Sidebar";
import Header from "@/components/ui/Header/Header";
import { useMemo, useState } from "react";
import { NAV_ITENS_RESERVAS_SINDICO } from "@/filters";

import Calendar from "@/components/ui/Calendar/Calendar";
import CustomTable from "@/components/ui/Table/Table";
import CardEspacoCondominialLaydown from "@/features/espacoCondominial/components/CardEspacoCondominialLaydown/card";

import {
    solicitacoesReservasColumns,
    prepararSolicitacoes,
} from "@/features/reservas/components/solicitacoesReservasColumns";

import { BiCalendarX } from "react-icons/bi";

import { useReservasDoDia } from "@/features/reservas/hooks/useReservasDoDia.js";
import { useSolicitacoesReservas } from "@/features/reservas/hooks/useSolicitacoesReservas.js";
import { useUndoableAction } from "@/hooks/useUndoableAction";
import UndoToast from "@/components/ui/UndoToast/UndoToast";
import { confirmarReserva, cancelarReserva, validarIdReserva } from "@/features/reservas/services/reservaPATCH.js";
import SolicitacaoReservaModal from "@/components/ui/Modal/ModalSolicitacaoReserva/SolicitacaoReservaModal";

export default function GerenciarReservas() {
    const [activeTab, setActiveTab] = useState("Reservas");
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [selectedDate, setSelectedDate] = useState(() => new Date());
    const [solicitacaoSelecionada, setSolicitacaoSelecionada] = useState(null);

    const [acaoAtual, setAcaoAtual] = useState(null);
    const [erroAcao, setErroAcao] = useState("");

    const dataISO = selectedDate?.toLocaleDateString("sv-SE");

    const {
        reservasDoDia, error, isLoading, fetchReservasDoDia,
    } = useReservasDoDia({ data: dataISO, enabled: activeTab === "Reservas" });

    const {
        solicitacoes, error: erroSolicitacoes, isLoading: carregandoSolicitacoes, fetchSolicitacoes,
    } = useSolicitacoesReservas({ enabled: activeTab === "Solicitações" });

    const linhasSolicitacoes = useMemo(
        () => prepararSolicitacoes(solicitacoes),
        [solicitacoes]
    );

    const semDados = reservasDoDia.length === 0;

    const undoDecisao = useUndoableAction({
        delayMs: 4000,
        commit: ({ tipo, reserva, justificativa }) =>
            tipo === "aprovar"
                ? confirmarReserva(reserva.idReserva)
                : cancelarReserva(reserva.idReserva, justificativa),
        onCommitted: fetchSolicitacoes,
        // desfazer: reabre a solicitação para o síndico decidir de novo
        onUndo: ({ reserva }) => setSolicitacaoSelecionada(reserva),
        onFailed: ({ tipo, reserva }, error, { unmounted }) => {
            const verbo = tipo === "aprovar" ? "aprovar" : "reprovar";
            const msg = error?.message || `Não foi possível ${verbo} a reserva.`;
            if (unmounted) {
                alert(`${msg}\nA reserva de "${reserva?.nomeEspaco ?? ""}" NÃO foi alterada.`);
                return;
            }
            setErroAcao(msg);
            setSolicitacaoSelecionada(reserva); // reabre para tentar de novo
        },
    });

    const agendarDecisao = (tipo, reserva, justificativa) => {
        validarIdReserva(reserva?.idReserva);   // lança antes de agendar: o modal mostra o erro
        setErroAcao("");
        setAcaoAtual({ tipo, reserva });
        undoDecisao.schedule({ tipo, reserva, justificativa });
    };

    const aprovando = acaoAtual?.tipo === "aprovar";

    // não deixa reabrir a reserva cuja decisão está pendente
    const handleRowClick = (reserva) => {
        const decisaoEmAndamento = undoDecisao.status !== "idle";
        if (decisaoEmAndamento && acaoAtual?.reserva?.idReserva === reserva.idReserva) return;
        setErroAcao("");
        setSolicitacaoSelecionada(reserva);
    };

    return (
        <div className={styles.body}>
            <Sidebar />

            <div className={styles.main}>
                <Header
                    titulo="Gerenciar Espaços Condominiais"
                    navItens={NAV_ITENS_RESERVAS_SINDICO}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    search={search}
                    setSearch={setSearch}
                    setDebouncedSearch={setDebouncedSearch}
                />

                <div className={styles.content}>
                    {activeTab === "Reservas" ? (
                        <>
                            <Calendar onDateSelect={setSelectedDate} />

                            <div className={styles.containerEspacos}>
                                {selectedDate && (
                                    <p className={styles.tituloCardsReservas}>
                                        Reservas do dia {selectedDate.toLocaleDateString("pt-BR")}
                                    </p>
                                )}

                                {isLoading && semDados ? (
                                    <p>Carregando reservas...</p>
                                ) : error && semDados ? (
                                    <div className={styles.containerSemCardsEspacosDisponiveis}>
                                        <p role="alert">{error.message || "Não foi possível carregar as reservas."}</p>
                                        <button type="button" onClick={fetchReservasDoDia}>Tentar novamente</button>
                                    </div>
                                ) : !semDados ? (
                                    <div className={styles.containerCardsEspacosReservados}>
                                        {reservasDoDia.map((reserva) => (
                                            <CardEspacoCondominialLaydown
                                                key={reserva.idReserva}
                                                espacoCondominialData={reserva}
                                                type="reserva"
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className={styles.containerSemCardsEspacosDisponiveis}>
                                        <BiCalendarX size={50} />
                                        <p>Nenhuma reserva nesta data.</p>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className={styles.containerEspacos}>
                            {erroSolicitacoes && solicitacoes.length === 0 && (
                                <p role="alert">
                                    {erroSolicitacoes.message || "Não foi possível carregar as solicitações."}{" "}
                                    <button type="button" onClick={fetchSolicitacoes}>Tentar novamente</button>
                                </p>
                            )}

                            <div className={styles.containerEspacos}>
                                {erroAcao && <p className="text-danger" role="alert">{erroAcao}</p>}

                                {erroSolicitacoes && solicitacoes.length === 0 && (
                                    <p role="alert">
                                        {erroSolicitacoes.message || "Não foi possível carregar as solicitações."}{" "}
                                        <button type="button" onClick={fetchSolicitacoes}>Tentar novamente</button>
                                    </p>
                                )}

                                <CustomTable
                                    headerAs="span"
                                    onRowClick={handleRowClick}
                                    columns={solicitacoesReservasColumns}
                                    data={linhasSolicitacoes}
                                    isLoading={carregandoSolicitacoes && solicitacoes.length === 0}
                                    searchValue={debouncedSearch}
                                    rowKey="idReserva"
                                    canRemove={false}
                                    emptyMessage="Nenhuma solicitação de reserva."
                                    notice={
                                        undoDecisao.status !== "idle" ? (
                                            <UndoToast
                                                status={undoDecisao.status}
                                                token={undoDecisao.token}
                                                delayMs={undoDecisao.delayMs}
                                                paused={undoDecisao.paused}
                                                messagePending={aprovando ? "Reserva será aprovada em instantes" : "Reserva será reprovada em instantes"}
                                                messageCommitting={aprovando ? "Aprovando reserva…" : "Reprovando reserva…"}
                                                messageSuccess={aprovando ? "Reserva aprovada com sucesso" : "Reserva reprovada com sucesso"}
                                                onUndo={undoDecisao.undo}
                                                onPause={undoDecisao.pause}
                                                onResume={undoDecisao.resume}
                                            />
                                        ) : null
                                    }
                                />

                                <SolicitacaoReservaModal
                                    show={!!solicitacaoSelecionada}
                                    onHide={() => setSolicitacaoSelecionada(null)}
                                    reserva={solicitacaoSelecionada}
                                    onAprovar={(r) => agendarDecisao("aprovar", r)}
                                    onNegar={(r, justificativa) => agendarDecisao("negar", r, justificativa)}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}