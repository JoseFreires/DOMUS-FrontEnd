"use client";

import styles from "./page.module.css";
import Sidebar from "@/components/ui/Sidebar/Sidebar";
import Header from "@/components/ui/Header/Header";
import { useMemo, useState } from "react";
import { NAV_ITENS_RESERVAS_MORADOR } from "@/filters";

import Calendar from "@/components/ui/Calendar/Calendar";
import CardEspacoCondominial from "@/features/espacoCondominial/components/CardEspacoCondominial/card";
import CardEspacoCondominialLaydown from "@/features/espacoCondominial/components/CardEspacoCondominialLaydown/card";
import ReservarEspacoCondominialModal from "@/features/espacoCondominial/components/FormReservarEspacoCondominial/ReservarEspacoCondominialModal";

import { Row, Col } from "react-bootstrap";
import { BiCalendarX } from "react-icons/bi";

import { useReservas } from "@/features/reservas/hooks/useReservas.js";
import { createReserva } from "@/features/reservas/services/reservaPOST.js";

import { primeiraDataPermitida } from "@/utils/datasReserva";

import CustomTable from "@/components/ui/Table/Table";
import {
    minhasReservasColumns,
    prepararMinhasReservas,
} from "@/features/reservas/components/minhasReservasColumns";
import { useMinhasReservas } from "@/features/reservas/hooks/useMinhasReservas.js";

export default function ReservarEspacosCondominiais() {
    const [activeTab, setActiveTab] = useState("Solicitar");
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const MIN_HORAS_ANTECEDENCIA = 48;

    const [selectedDate, setSelectedDate] = useState(() =>
        primeiraDataPermitida(MIN_HORAS_ANTECEDENCIA)
    );

    const [espacoSelecionado, setEspacoSelecionado] = useState(null);

    const dataISO = selectedDate?.toLocaleDateString("sv-SE");
    const hojeISO = new Date().toLocaleDateString("sv-SE");
    const dataNoPassado = dataISO < hojeISO;

    const { reservasDisponiveis, error, isLoading, fetchReservas } = useReservas({
        data: dataISO,
        poll: activeTab === "Solicitar",
    });

    const espacosFiltrados = useMemo(() => {
        const termo = debouncedSearch.trim().toLowerCase();
        if (!termo) return reservasDisponiveis;
        return reservasDisponiveis.filter((e) =>
            `${e.nomeEspaco} ${e.descricao ?? ""}`.toLowerCase().includes(termo)
        );
    }, [reservasDisponiveis, debouncedSearch]);

    const handleReservar = async (dadosReserva) => {
        await createReserva(dadosReserva);
        await fetchReservas().catch(() => { });
    };

    const semDados = reservasDisponiveis.length === 0;

    const {
        reservas: minhasReservas,
        error: erroMinhas,
        isLoading: carregandoMinhas,
        fetchMinhasReservas,
    } = useMinhasReservas({ enabled: activeTab === "Solicitações" });

    const linhasReservas = useMemo(
        () => prepararMinhasReservas(minhasReservas),
        [minhasReservas]
    );

    return (
        <div className={styles.body}>
            <Sidebar />

            <div className={styles.main}>
                <Header
                    titulo="Reservar Espaço Condominial"
                    navItens={NAV_ITENS_RESERVAS_MORADOR}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    search={search}
                    setSearch={setSearch}
                    setDebouncedSearch={setDebouncedSearch}
                />

                <div className={styles.content}>
                    {activeTab === "Solicitar" ? (
                        <>
                            <Calendar
                                minHorasAntecedencia={MIN_HORAS_ANTECEDENCIA}
                                onDateSelect={setSelectedDate}
                            />

                            <div className={styles.containerEspacosDisponiveis}>

                                {dataNoPassado ? (
                                    <div className={styles.containerSemCardsEspacosDisponiveis}>
                                        <BiCalendarX size={50} />
                                        <p>Não é possível reservar em datas passadas.</p>
                                    </div>
                                ) : isLoading && semDados ? (
                                    <p>Carregando espaços...</p>
                                ) : error && semDados ? (
                                    <div className={styles.containerSemCardsEspacosDisponiveis}>
                                        <p role="alert">{error.message || "Não foi possível carregar os espaços."}</p>
                                        <button type="button" onClick={fetchReservas}>Tentar novamente</button>
                                    </div>
                                ) : espacosFiltrados.length > 0 ? (
                                    <div className={styles.containerCardsEspacosDisponiveis}>
                                        {espacosFiltrados.map((item) => (
                                            <CardEspacoCondominial
                                                key={item.idEspacoCondominial}
                                                espacoCondominialData={item}
                                                onButtonOpenModal={setEspacoSelecionado}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className={styles.containerSemCardsEspacosDisponiveis}>
                                        <BiCalendarX size={50} />
                                        <p>Nenhum espaço condominial disponível nesta data.</p>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className={styles.containerEspacosDisponiveis}>
                            {erroMinhas && minhasReservas.length === 0 && (
                                <p role="alert">
                                    {erroMinhas.message || "Não foi possível carregar suas reservas."}{" "}
                                    <button type="button" onClick={fetchMinhasReservas}>Tentar novamente</button>
                                </p>
                            )}

                            <CustomTable
                                headerAs="span"
                                columns={minhasReservasColumns}
                                data={linhasReservas}
                                isLoading={carregandoMinhas && minhasReservas.length === 0}
                                searchValue={debouncedSearch}
                                rowKey="idReserva"
                                sortKey="dataReserva"
                                rowsPerPage={10}
                                canRemove={false}
                                emptyMessage="Você ainda não fez nenhuma reserva."
                            />
                        </div>
                    )}
                </div>
            </div>

            <ReservarEspacoCondominialModal
                show={!!espacoSelecionado}
                onHide={() => setEspacoSelecionado(null)}
                dataReserva={dataISO}
                espaco={espacoSelecionado}
                onConfirm={handleReservar}
            />
        </div>
    );
}