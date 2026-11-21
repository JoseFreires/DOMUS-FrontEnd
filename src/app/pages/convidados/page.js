"use client";

import { useMemo, useState } from "react";

import styles from "./page.module.css";

import Sidebar from "@/components/ui/Sidebar/Sidebar";
import Header from "@/components/ui/Header/Header";
import CustomTable from "@/components/ui/Table/Table";

import { useMoradores } from "@/features/morador/hooks/useMorador";
import { useLogConvidados } from "@/features/convidados/hooks/useLogConvidados";
import {
    logConvidadosColumns,
    prepararLogs,
    filtrarLogsPorPeriodo,
} from "@/features/convidados/components/logConvidadosColumns";

import { filterMoradores, NAV_ITENS_CONVIDADOS_VIEW_PORTEIRO } from "@/filters";
import { InjectMoradoresTable } from "@/utils/dataInject";

import ModalConvidadosMorador from "@/components/ui/Modal/ModalConvidadosMorador/ModalConvidadosMorador";

const FILTROS_INICIAIS = { selectedUsers: [], startDate: "", endDate: "" };

// Devem ser iguais aos textos de NAV_ITENS_CONVIDADOS_VIEW_PORTEIRO
const TAB_MORADORES = "Registrar convidado";
const TAB_REGISTRADOS = "Registrados";

import { useAuth } from "@/app/auth.js";
import { registrarChegadaConvidado } from "@/features/convidados/services/logConvidadoPOST.js";



export default function ConvidadosDosMoradores() {
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [filters, setFilters] = useState(FILTROS_INICIAIS);
    const [moradorSelecionado, setMoradorSelecionado] = useState(null);
    const [activeTab, setActiveTab] = useState(TAB_MORADORES);
    const { user } = useAuth();
    const isPorteiro = user?.role?.includes("ROLE_PORTEIRO");

    const emMoradores = activeTab === TAB_MORADORES;
    const emRegistrados = activeTab === TAB_REGISTRADOS;

    // ── Aba "Registrar convidado": moradores ──
    const { data: moradores, isLoading: carregandoMoradores } = useMoradores();

    const linhasMoradores = useMemo(
        () => filterMoradores(moradores ?? [], "Todos", filters),
        [moradores, filters]
    );
    const colunasMoradores = useMemo(() => InjectMoradoresTable(), []);

    // ── Aba "Registrados": log de convidados (só busca quando a aba está aberta) ──
    const {
        logs,
        error: erroLogs,
        isLoading: carregandoLogs,
        fetchLogs,
    } = useLogConvidados({ enabled: emRegistrados });

    const linhasLogs = useMemo(
        () => filtrarLogsPorPeriodo(prepararLogs(logs), filters),
        [logs, filters]
    );



    return (
        <div className={styles.body}>
            <Sidebar />

            <div className={styles.main}>
                <Header
                    titulo="Convidados dos Moradores"
                    search={search}
                    setSearch={setSearch}
                    setDebouncedSearch={setDebouncedSearch}
                    filters={filters}
                    onFiltersChange={setFilters}
                    navItens={NAV_ITENS_CONVIDADOS_VIEW_PORTEIRO}
                    setActiveTab={setActiveTab}
                    activeTab={activeTab}
                />

                <div className={styles.content}>
                    {emMoradores ? (
                        <CustomTable
                            headerAs="span"
                            rowsPerPage={10}
                            data={linhasMoradores}
                            columns={colunasMoradores}
                            searchValue={debouncedSearch}
                            rowKey="idMorador"
                            onRowClick={setMoradorSelecionado}
                            isLoading={carregandoMoradores}
                            emptyMessage="Nenhum morador encontrado."
                        />
                    ) : (
                        <>
                            {erroLogs && logs.length === 0 && (
                                <p role="alert">
                                    {erroLogs.message || "Não foi possível carregar os registros."}{" "}
                                    <button type="button" onClick={fetchLogs}>Tentar novamente</button>
                                </p>
                            )}

                            <CustomTable
                                headerAs="span"
                                rowsPerPage={10}
                                data={linhasLogs}
                                columns={logConvidadosColumns}
                                searchValue={debouncedSearch}
                                rowKey="idLogConvidado"
                                isLoading={carregandoLogs && logs.length === 0}
                                emptyMessage="Nenhum convidado registrado."
                            />
                        </>
                    )}
                </div>

                <ModalConvidadosMorador
                    show={!!moradorSelecionado}
                    onHide={() => setMoradorSelecionado(null)}
                    idMorador={moradorSelecionado?.idMorador}
                    nomeMorador={moradorSelecionado?.nomeCompleto}
                    onRegistrarChegada={
                        isPorteiro
                            ? async (convidado) => {
                                await registrarChegadaConvidado({
                                    idMorador: moradorSelecionado?.idMorador,
                                    idConvidado: convidado.idConvidado,
                                });
                                await fetchLogs().catch(() => { });
                            }
                            : undefined
                    }
                />
            </div>
        </div>
    );
}