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
import { confirmarReserva, cancelarReserva } from "@/features/reservas/services/reservaPATCH.js";
import SolicitacaoReservaModal from "@/components/ui/Modal/ModalSolicitacaoReserva/SolicitacaoReservaModal";

export default function GerenciarReservas() {
    const [activeTab, setActiveTab] = useState("Reservas");
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [selectedDate, setSelectedDate] = useState(() => new Date());
    const [solicitacaoSelecionada, setSolicitacaoSelecionada] = useState(null);

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

                            <CustomTable
                                headerAs="span"
                                onRowClick={setSolicitacaoSelecionada}
                                columns={solicitacoesReservasColumns}
                                data={linhasSolicitacoes}
                                isLoading={carregandoSolicitacoes && solicitacoes.length === 0}
                                searchValue={debouncedSearch}
                                rowKey="idReserva"
                                canRemove={false}
                                emptyMessage="Nenhuma solicitação de reserva."
                            />
                            <SolicitacaoReservaModal
                                show={!!solicitacaoSelecionada}
                                onHide={() => setSolicitacaoSelecionada(null)}
                                reserva={solicitacaoSelecionada}
                                onAprovar={async (r) => {
                                    await confirmarReserva(r.idReserva);
                                    await fetchSolicitacoes().catch(() => { }); 
                                }}
                                onNegar={async (r, justificativa) => {
                                    await cancelarReserva(r.idReserva, justificativa);
                                    await fetchSolicitacoes().catch(() => { });
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}