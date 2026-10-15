"use client";

import { useState, useEffect } from "react";

import styles from "./page.module.css";

import Sidebar from "@/components/ui/Sidebar/Sidebar";
import Header from "@/components/ui/Header/Header";

import { useAuth } from "@/app/auth.js";
import { NAV_ITENS_CONVIDADOS } from "@/filters";

import CardGroup from 'react-bootstrap/Card';
import CardConvidado from "@/features/convidados/components/CardConvidado/card";
import CadastroModal from "@/components/ui/Modal/FormCad/CadastroModal";

import { createConvidado } from "@/features/convidados/services/convidadoPOST.js";
import { updateConvidado } from "@/features/convidados/services/convidadoPUT.js";
import { useConvidado } from "@/features/convidados/hooks/useConvidado.js";

import { convidadoFields } from '@/components/ui/Modal/FormCad/formConfigs';

import dadosConvidados from "@/data/convidados.json";

import { useEntityModal } from '@/hooks/useEntityModal';



export default function MeusConvidados() {
    const { user } = useAuth();
    const canManage = user?.role.includes("ROLE_MORADOR");

    const [activeTab, setActiveTab] = useState("Ativos");
    const [search, setSearch] = useState();
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const convidados = dadosConvidados["Convidados"] ?? [];

    const { data, fetchConvidados, isLoading } = useConvidado();

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
                    titulo="Meus Convidados"
                    navItens={NAV_ITENS_CONVIDADOS}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    search={search}
                    setSearch={setSearch}
                    setDebouncedSearch={setDebouncedSearch}
                    canAdd={canManage}
                    onAddbuttonClick={modal.openAdd}

                />

                <div className={styles.content}>
                    {activeTab === "Ativos" ? (
                        <>


                            <div className={styles.containerConvidados}>

                                {convidados.length > 0 ? (
                                    <CardGroup className={styles.containerCardsConvidados}>
                                        {convidados.map((item, index) => (

                                            <CardConvidado
                                                key={item.id ?? index}
                                                convidadoData={item}
                                                onButtonOpenModal={modal.openEdit}
                                            />

                                        ))}
                                    </CardGroup>


                                ) : (
                                    <div className={styles.containerSemCardsEspacosDisponiveis}>
                                        <p>Nenhum convidado encontrado.</p>
                                    </div>
                                )}
                            </div>


                        </>

                    ) : (
                        <>
                            <div className={styles.containerConvidados}>
                                {convidados.length > 0 ? (
                                    <CardGroup className={styles.containerCardsConvidados}>
                                        {convidados.map((item, index) => (

                                            <CardConvidado
                                                key={item.id ?? index}
                                                convidadoData={item}
                                                onButtonOpenModal={modal.openEdit}

                                            />

                                        ))}
                                    </CardGroup>



                                ) : (
                                    <div className={styles.containerSemCardsEspacosDisponiveis}>
                                        <p>Nenhum convidado encontrado.</p>
                                    </div>
                                )}
                            </div>

                        </>
                    )}
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

        </div>
    );
}
