"use client";

import styles from './page.module.css';

import Sidebar from '@/components/ui/Sidebar/Sidebar';
import Header from '@/components/ui/Header/Header';
import CustomTable from '@/components/ui/Table/Table';
import CadastroModal from "@/components/ui/Modal/FormCad/CadastroModal";

import { useState, useMemo } from 'react';
import { useAuth } from '@/app/auth.js';
import { InjectConvidadosTable } from '@/utils/dataInject';

import { useVisitante } from "@/features/visitantes/hooks/useVisitante";
import { createVisitante } from "@/features/visitantes/services/visitantePOST";

import { visitanteFields } from '@/components/ui/Modal/FormCad/formConfigs';
import { extractFilterMoradores, filterMoradores } from "@/filters";
import { useEntityModal } from '@/hooks/useEntityModal';

export default function Visitantes() {
    const { user } = useAuth();
    const canManage = user?.role?.includes("ROLE_SINDICO") ?? false;

    const { data, fetchVisitante, isLoading } = useVisitante();

    const modal = useEntityModal({
        onCreate: createVisitante,
        getId: (item) => item.idVisitante,
        onRefresh: fetchVisitante,
    });

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [filters, setFilters] = useState({ selectedUsers: [], startDate: "", endDate: "" });

    const users = useMemo(() => extractFilterMoradores(data ?? []), [data]);
    const filteredData = useMemo(
        () => filterMoradores(data ?? [], filters),
        [data, filters]
    );

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
                    users={users}
                    filters={filters}
                    onFiltersChange={setFilters}
                />

                <CustomTable
                    headerAs="span"
                    rowsPerPage={10}
                    columns={InjectConvidadosTable()}
                    data={filteredData}
                    searchValue={debouncedSearch}
                    onRowClick={modal.openEdit}
                    canRemove={canManage}
                    isLoading={isLoading}
                />
            </div>

            <CadastroModal
                show={modal.open}
                onHide={modal.close}
                title={modal.tipo === "edit" ? "Editar Visitante" : "Adicionar Visitante"}
                fields={visitanteFields}
                initialData={modal.itemData ?? {}}
                onSaveChanges={modal.save}
                showPhoto={true}
            />
        </div>
    );
}