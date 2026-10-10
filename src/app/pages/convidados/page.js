"use client";

import { useState, useEffect } from "react";

import styles from "./page.module.css";

import Sidebar from "@/components/ui/Sidebar/Sidebar";
import Header from "@/components/ui/Header/Header";

import { useAuth } from "@/app/auth.js";

import CustomTable from '@/components/ui/Table/Table';
import CadastroModal from "@/components/ui/Modal/FormCad/CadastroModal";

import { createConvidado } from "@/features/convidados/services/convidadoPOST.js";
import { updateConvidado } from "@/features/convidados/services/convidadoPUT.js";
import { useConvidado } from "@/features/convidados/hooks/useConvidado.js";
import { filterConvidados } from "@/filters";

import { convidadoFields } from '@/components/ui/Modal/FormCad/formConfigs';
import { InjectConvidadosTable } from '@/utils/dataInject';

import dadosConvidados from "@/data/convidados.json";

import { useEntityModal } from '@/hooks/useEntityModal';



export default function Convidados() {
    const { user } = useAuth();
    const canManage = user?.role.includes("ROLE_PORTEIRO")

    const [search, setSearch] = useState();
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const convidados = dadosConvidados["Convidados"] ?? [];

    const { data, fetchConvidados, isLoading } = useConvidado();

    function getTodayDate() {
        return new Date().toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    }

    useEffect(() => {
        async function carregarConvidados() {
            const response = await listConvidados();

            console.log("Convidados recebidos:", response);

            if (response) {
                setData(response);
            }
        }

        carregarConvidados();
    }, []);

    const modal = useEntityModal({
        onCreate: createConvidado,
        onUpdate: (id, formData) => updateConvidado(id, formData),
        getId: (item) => item.idConvidado,
        onRefresh: fetchConvidados,
    });


    return (
        <div className={styles.body}>
            <Sidebar />

            <div className={styles.main}>
                <Header
                    titulo={`Convidados ${getTodayDate()}`}
                    search={search}
                    setSearch={setSearch}
                    setDebouncedSearch={setDebouncedSearch}

                />

                <div className={styles.content}>

                    <CustomTable
                        headerAs="span"
                        rowsPerPage={10}
                        columns={InjectConvidadosTable()}
                        searchValue={debouncedSearch}
                        onRowClick={modal.openEdit}
                        isLoading={isLoading}
                    />

                </div>
                
                <CadastroModal
                    show={modal.open}
                    onHide={modal.close}
                    title={modal.tipo === "edit" ? "Editar Convidado" : "Adicionar Convidado"}
                    initialData={modal.itemData ?? {}}
                    onSaveChanges={modal.save}
                    showPhoto={true}
                    usaFoto={false}
                    fields={convidadoFields}
                    submitLabel={modal.tipo === "edit" ? "Salvar Alterações" : "Cadastrar"}
                />

            </div>

        </div>
    );
}
