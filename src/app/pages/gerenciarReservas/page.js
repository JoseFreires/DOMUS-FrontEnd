"use client";

import styles from "./page.module.css";
import Sidebar from "@/components/ui/Sidebar/Sidebar";
import Header from "@/components/ui/Header/Header";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/auth.js";
import { NAV_ITENS_ESPACOSCONDOMINIAIS_SINDICO } from "@/filters";

import Calendar from "@/components/ui/Calendar/Calendar";
import CustomTable from '@/components/ui/Table/Table';
import CardEspacoCondominialLaydown from "@/features/espacoCondominial/components/CardEspacoCondominialLaydown/card";
import CardGroup from 'react-bootstrap/Card';
import AprovarEspacoCondominialModal from "@/features/espacoCondominial/components/FormAprovarEspacoCondominial/AprovarEspacoCondominialModal"

import { BiCalendarX } from "react-icons/bi";

import dados from "../../../../data/espacos.json"

import { useMoradores } from '@/features/morador/hooks/useMorador';
import { moradorFields } from '@/features/espacoCondominial/components/FormAprovarEspacoCondominial/formConfigs';
import { reservasFields } from '@/features/espacoCondominial/components/FormAprovarEspacoCondominial/formConfigs';

import { useEntityModal } from '@/hooks/useEntityModal';
import { extractFilterMoradores, filterMoradores } from "@/filters";
import { InjectSolicitacoesReservasEspacosCondominiaisTable } from '@/utils/dataInject';




export default function GerenciarReservas() {
    const { user } = useAuth();
    const canManage = user?.role.includes("ROLE_SINDICO");

    const [activeTab, setActiveTab] = useState("Reservas");
    const [search, setSearch] = useState();
    const [selectedDate, setSelectedDate] = useState(undefined);
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const { data, fetchMoradores, removeMoradores, isLoading } = useMoradores();

    const espacos = dados["Espaços Condominiais"] ?? [];

    const modal = useEntityModal({
        onUpdate: (id, formData) => AprovarEspacoCondominialModal(id, formData),
        getId: (item) => item.idReservaEspacoCondominial,
        onRefresh: fetchMoradores,
    });

    const [filters, setFilters] = useState({ selectedUsers: [], startDate: "", endDate: "" });

    const filteredData = filterMoradores(data, activeTab, filters);


    return (
        <div className={styles.body}>
            <Sidebar />

            <div className={styles.main}>
                <Header
                    titulo="Gerenciar Espaços Condominiais"
                    navItens={NAV_ITENS_ESPACOSCONDOMINIAIS_SINDICO}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    search={search}
                    setSearch={setSearch}
                    setDebouncedSearch={setDebouncedSearch}
                    filters={filters}
                    onFiltersChange={setFilters}
                />

                <div className={styles.content}>
                    {activeTab === "Reservas" ? (
                        <>
                            <Calendar
                                onDateSelect={setSelectedDate}
                            />


                            <div className={styles.containerEspacos}>

                                {selectedDate && (
                                    <p className={styles.tituloCardsReservas}>
                                        Reservas do dia: {selectedDate.toLocaleDateString("pt-BR")}
                                    </p>
                                )}

                                {espacos.length > 0 ? (
                                    <CardGroup className={styles.containerCardsEspacosReservados}>
                                        {dados["Espaços Condominiais Disponíveis"].map((item, index) => (
                                            <CardEspacoCondominialLaydown
                                                key={item.id ?? index}
                                                espacoCondominialData={item}
                                                onButtonOpenModal={modal.openAdd}

                                            />
                                        ))}
                                    </CardGroup>
                                ) : (
                                    <div className={styles.containerSemCardsEspacosDisponiveis}>
                                        <BiCalendarX size={50} />
                                        <p>Nenhum espaço condominial disponível no momento.</p>
                                    </div>
                                )}
                            </div>


                        </>
                    ) : (
                        <>
                            
                            <CustomTable
                                headerAs="span"
                                rowsPerPage={10}
                                columns={InjectSolicitacoesReservasEspacosCondominiaisTable()}
                                data={filteredData}
                                searchValue={debouncedSearch}
                                onRowClick={modal.openEdit}
                                onDeleteConfirm={removeMoradores}
                                canRemove={canManage}
                                isLoading={isLoading}
                            />
                            <AprovarEspacoCondominialModal
                                show={modal.open}
                                onHide={modal.close}
                                initialData={modal.itemData ?? {}}
                                onSaveChanges={modal.save}
                                showPhoto={true}
                                moradorFields={moradorFields}
                                reservasFields={reservasFields}

                            />
                        </>
                    )}


                </div>

            </div>

        </div>
    );
}
