"use client";

import { useState } from "react";
import styles from "./page.module.css";
import Sidebar from "@/components/ui/Sidebar/Sidebar";
import Header from "@/components/ui/Header/Header";
import Card from "@/features/encomendas/components/CardEncomenda/card";
import { useMyEncomendas } from "@/features/encomendas/hooks/useMyEncomendas";
import { useAuth } from "@/app/auth";
import { PiPackageThin } from "react-icons/pi";

export default function MeusPacotes() {
    const navItens = [
        { texto: "Todos" },
        { texto: "A retirar" },
        { texto: "Retirados" },
    ];

    const [activeTab, setActiveTab] = useState("Todos");
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const { data } = useMyEncomendas();
    const { user } = useAuth();

    const filtros = {
        Todos: () => true,
        "A retirar": (item) => item.status === "RECEBIDA",
        Retirados: (item) => item.status === "ENTREGUE",
    };

    const filteredData = (Array.isArray(data) ? data : [])
        .filter(filtros[activeTab]);

    return (
        <div className={styles.body}>
            <Sidebar />

            <div className={styles.main}>
                <Header
                    titulo="Meus Pacotes"
                    navItens={navItens}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    search={search}
                    setSearch={setSearch}
                    setDebouncedSearch={setDebouncedSearch}
                    canAdd={null}
                />

                <div className={styles.cardWrapper}>
                {filteredData.length === 0 ? (
                    <div className={styles.noDataWrapper}>
                        <PiPackageThin  size={148} color={"var(--auxiliarColor)"} />
                        <h4 className={styles.noDataMessage}>Nenhum pacote encontrado.</h4>
                    </div>
                ) : (   
                    filteredData.map((item) => (
                        <Card
                            key={item.idEncomenda}
                            encomendaData={item}
                            searchValue={debouncedSearch}
                        />
                    ))
                )
                }
                </div>
            </div>
        </div>
        
    );

    
}
