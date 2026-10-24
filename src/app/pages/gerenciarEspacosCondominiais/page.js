"use client";

import styles from "./page.module.css";
import Sidebar from "@/components/ui/Sidebar/Sidebar";
import Header from "@/components/ui/Header/Header";
import ModalForm from "@/components/ui/Modal/ModalForm/ModalForm";

import FormEspacoCondominial from "@/features/espacoCondominial/components/FormEspacoCondominial/Form";
import CardEspacoCondominial from "@/features/espacoCondominial/components/CardEspacoCondominial/card";
import CardGroup from 'react-bootstrap/Card';

import { useState, useEffect } from "react";
import { useAuth } from "@/app/auth.js";

import { NAV_ITENS_ESPACOSCONDOMINIAIS, filterEspacosCondominiais } from "@/filters"

import { createEspacoCondominial } from "@/features/espacoCondominial/services/espacoCondominialPOST.js";
import { updateEspacoCondominial } from "@/features/espacoCondominial/services/espacoCondominialPUT.js";
import { useEspacoCondominial } from "@/features/espacoCondominial/hooks/useEspacoCondomiail.js";

import { useEntityModal } from "@/hooks/useEntityModal";


export default function GerenciarEspacosCondominiais() {
    const { user } = useAuth();
    const canManage = user?.role.includes("ROLE_SINDICO");

    const [activeTab, setActiveTab] = useState("Ativos");
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const {
        ativos,
        inativos,
        activeEspacoCondominial,
        inactiveEspacoCondominial,
        isLoading,
        fetchEspacosCondominiais
    } = useEspacoCondominial();

    const modal = useEntityModal({
        onCreate: createEspacoCondominial,
        onUpdate: (id, data) => updateEspacoCondominial(id, data),
        getId: (item) => item.idEspacoCondominial,
        onRefresh: fetchEspacosCondominiais,
    });



    return (
        <div className={styles.body}>
            <Sidebar />

            <div className={styles.main}>
                <Header
                    titulo="Espaços Condominiais"
                    navItens={NAV_ITENS_ESPACOSCONDOMINIAIS}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    search={search}
                    setSearch={setSearch}
                    setDebouncedSearch={setDebouncedSearch}
                    canAdd={canManage}
                    onAddbuttonClick={modal.openAdd}
                />

                <div className={styles.content}>
                    {isLoading ? (
                        <p>Carregando espaços...</p>
                    ) : (
                        <div className={styles.containerCardsEspacosDisponiveis}>
                            {(filterEspacosCondominiais(ativos, inativos, activeTab) ?? []).map((item, index) => (
                                <CardEspacoCondominial
                                    key={item.idEspacoCondominial ?? index}
                                    espacoCondominialData={item}
                                    onButtonOpenModal={modal.openEdit}
                                />
                            ))}
                        </div>
                    )}
                </div>


            </div>

            <ModalForm show={modal.open} onHide={modal.close} centered>
                {modal.tipo === "add" && (
                    <FormEspacoCondominial
                        modo="add"
                        onSaveChanges={modal.save}
                    />
                )}

                {modal.tipo === "edit" && (
                    <FormEspacoCondominial
                        modo="edit"
                        espacoCondominialData={modal.itemData}
                        onClose={modal.close}
                        onSaveChanges={modal.save}
                        onDelete={inactiveEspacoCondominial}
                        onActive={activeEspacoCondominial}
                    />
                )}
            </ModalForm>
        </div>
    );
}
