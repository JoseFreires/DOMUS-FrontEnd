"use client";

import styles from './page.module.css';

import Sidebar from '@/components/ui/Sidebar/Sidebar';
import Header from '@/components/ui/Header/Header';
import CustomTable from '@/components/ui/Table/Table';
import CadastroModal from "@/components/ui/Modal/FormCad/CadastroModal";

import { useState, useMemo } from 'react';
import { useAuth } from '@/app/auth.js';
import { InjectVisitantesTable } from '@/utils/dataInject';

import { useVisitante } from "@/features/visitantes/hooks/useVisitante";
import { createVisitante } from "@/features/visitantes/services/visitantePOST";

import { visitanteFields } from '@/components/ui/Modal/FormCad/formConfigs';
import { extractFilterVisitantes, filterVisitantes } from "@/filters";
import { useEntityModal } from '@/hooks/useEntityModal';
import { useBlocoOptions } from "@/features/bloco/hooks/useBlocoOptions";
import { useMoradiaOptions } from "@/features/moradia/hooks/useMoradiaOptions";


export default function Visitantes() {
    const { user } = useAuth();
    const canManage = user?.role?.includes("ROLE_PORTEIRO");

    const { data, fetchVisitante, isLoading } = useVisitante();

    const modal = useEntityModal({
        onCreate: createVisitante,
        getId: (item) => item.idVisitante,
        onRefresh: fetchVisitante,
    });

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [filters, setFilters] = useState({ selectedBloco: [], startDate: "", endDate: "" });

    const { options: blocoOptions } = useBlocoOptions();
    const { options: moradiaOptions } = useMoradiaOptions();

    const fieldsComLocalizacao = [
        ...visitanteFields,
        {
            name: "idBloco",
            label: "Bloco",
            placeholder: "Selecione o bloco",
            type: "select",
            options: blocoOptions,
        },
        {
            name: "idMoradia",
            label: "Moradia",
            placeholder: "Selecione a moradia",
            type: "select",
            options: moradiaOptions,
            dependsOn: "idBloco",
            filterField: "idBloco",
        },
    ];


    return (
        <div className={styles.body}>
            <Sidebar />
            <div className={styles.main}>
                <Header
                    titulo="Registro de Visitantes"
                    search={search}
                    setSearch={setSearch}
                    setDebouncedSearch={setDebouncedSearch}
                    canAdd={canManage}
                    onAddbuttonClick={modal.openAdd}
                    users={extractFilterVisitantes(data)}
                    filterUserLabel={"Selecionar bloco: "}
                    filters={filters}
                    onFiltersChange={setFilters}
                />

                <CustomTable
                    headerAs="span"
                    rowsPerPage={10}
                    columns={InjectVisitantesTable()}
                    data={filterVisitantes(data, filters)}
                    searchValue={debouncedSearch}
                    canRemove={canManage}
                    isLoading={isLoading}
                />
            </div>

            <CadastroModal
                show={modal.open}
                onHide={modal.close}
                title={"Adicionar Visitante"}
                fields={fieldsComLocalizacao}
                initialData={modal.itemData ?? {}}
                onSaveChanges={modal.save}
                showPhoto={true}
                usaFoto={false}
                submitLabel={"Adicionar Visitante"}
            />
        </div>
    );
}