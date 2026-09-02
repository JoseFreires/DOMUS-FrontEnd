"use client";

import styles from "./page.module.css";
import Sidebar from "@/app/components/Sidebar/sidebar";
import Header from "@/app/components/Header/header";
import CustomTable from "@/app/components/Table/table";
import FormEncomenda from "@/app/components/Modal/FormEncomenda/Form";
import ModalForm from "@/app/components/Modal/ModalForm/ModalForm";
import FormEntrega from "@/app/components/Modal/FormEntrega/FormEntrega";
import { useState } from "react";
import { useAuth } from "@/app/auth.js";
import { InjectEncomendasTable } from "@/app/hooks/dataInject";
import { useEncomendas } from "@/app/hooks/useEncomendas";
import { useEntityModal } from "@/app/hooks/useEntityModal";
import { filterEncomendas, extractFilterUsers, NAV_ITENS } from "@/app/hooks/filterEncomendas";
import { createEncomenda } from "@/app/services/Encomendas/POST";
import { updateEncomenda } from "@/app/services/Encomendas/PUT";


export default function Encomendas() {
    const { user } = useAuth();
    const canManage = user?.role.includes("ROLE_MORADOR");

    const { data, fetchEncomendas, removeEncomendas, isLoading } = useEncomendas();
    const modal = useEntityModal({
        onCreate:  createEncomenda,
        onUpdate:  (id, data) => updateEncomenda(id, { nomePacote: data.nomePacote, observacao: data.observacao, idDestinatario: data.idDestinatario, emailDestinatario:data.emailDestinatario}),
        getId:     (item) => item.idEncomenda,
        onRefresh: fetchEncomendas,
    });
    

    const [filters, setFilters] = useState({ selectedUsers: [], startDate: "", endDate: "" });
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    return (
        <div className={styles.body}>
            <Sidebar />

            <div className={styles.main}>
                {/* <Header
                    titulo="Reservar Espaço Condominial"
                    navItens={NAV_ITENS}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    search={search}
                    setSearch={setSearch}
                    setDebouncedSearch={setDebouncedSearch}
                    canAdd={canManage}
                    onAddbuttonClick={modal.openAdd}
                    users={extractFilterUsers(data)}
                    filters={filters}
                    onFiltersChange={setFilters}
                /> */}
            </div>

           
        </div>
    );
}
