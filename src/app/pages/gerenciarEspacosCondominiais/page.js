"use client";

import styles from "./page.module.css";
import Sidebar from "@/components/ui/Sidebar/Sidebar";
import Header from "@/components/ui/Header/Header";
import ModalForm from "@/components/ui/Modal/ModalForm/ModalForm";

import FormEspacoCondominial from "@/features/espacoCondominial/components/FormEspacoCondominial/Form";
import CardEspacoCondominial from "@/features/espacoCondominial/components/CardEspacoCondominial/card";
import CardGroup from 'react-bootstrap/Card';

import { useState } from "react";
import { useAuth } from "@/app/auth.js";

import { createEspacoCondominial } from "@/features/espacoCondominial/services/espacoCondominialPOST.js";
import { updateEspacoCondominial } from "@/features/espacoCondominial/services/espacoCondominialPUT.js";
import { useEspacoCondominial } from "@/features/espacoCondominial/hooks/useEspacoCondomiail.js";

import { extractFilterUsers } from "@/filters";

import { useEntityModal } from "@/hooks/useEntityModal";

import dados from "@/data/espacos.json";


export default function GerenciarEspacosCondominiais() {
    const { user } = useAuth();
    const canManage = user?.role.includes("ROLE_SINDICO");

    const espacos = dados["Espaços Condominiais"] ?? [];

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [filters, setFilters] = useState({ startDate: "", endDate: "" });

    const {data, fetchEspacosCondominiais, isLoading} = useEspacoCondominial();

    const modal = useEntityModal({
        onCreate: createEspacoCondominial,
        onUpdate: (id, data) => updateEspacoCondominial(id, { nome: data.nome, descricao: data.descricao, capacidade: data.capacidade }),
        getId: (item) => item.idEspacoCondominial,
        onRefresh: fetchEspacosCondominiais,
    });

    return (
        <div className={styles.body}>
            <Sidebar />

            <div className={styles.main}>
                <Header
                    titulo="Espaços Condominiais"

                    search={search}
                    setSearch={setSearch}
                    setDebouncedSearch={setDebouncedSearch}
                    canAdd={canManage}
                    onAddbuttonClick={modal.openAdd}
                    users={extractFilterUsers(data)}
                    filters={filters}
                    onFiltersChange={setFilters}
                />

                <div className={styles.content}>
                    <CardGroup className={styles.containerCardsEspacosDisponiveis}>
                        {espacos.map((item, index) => (
                            <CardEspacoCondominial
                                key={item.id ?? index}
                                espacoCondominialData={item}
                                onButtonOpenModal={modal.openEdit}
                            />
                        ))}
                    </CardGroup>
                </div>


            </div>

            <ModalForm show={modal.open} onHide={modal.close} centered>
                {modal.tipo === "add" && (
                    <FormEspacoCondominial
                        title="Registrar Espaço Condominial"
                        modo="add"
                        onSaveChanges={modal.save}
                    />
                )}

                {modal.tipo === "edit" && modal.itemData && (
                    <FormEspacoCondominial
                        title="Alterar Espaço Condominial"
                        modo="edit"
                        espacoCondominialData={modal.itemData}
                        onClose={modal.close}
                        onSaveChanges={modal.save}
                    />
                )}
            </ModalForm>
        </div>
    );
}
