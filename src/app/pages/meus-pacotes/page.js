"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import Sidebar from "@/components/ui/Sidebar/Sidebar";
import Header from "@/components/ui/Header/Header";
import Card from "@/features/encomendas/components/CardEncomenda/card";
import { listMyEncomendas } from "@/features/encomendas/services/myEncomendasGET";
import { useAuth } from "@/app/auth";

export default function MeusPacotes() {
    const navItens = [
        { texto: "Todos" },
        { texto: "A retirar" },
        { texto: "Retirados" },
    ];

    const [data, setData] = useState([]);
    const [activeTab, setActiveTab] = useState("Todos");
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const { user } = useAuth();


    useEffect(() => {
        async function carregarEncomendas() {
            const response = await listMyEncomendas();

            console.log("Encomendas recebidas:", response);

            if (response) {
                setData(response);
            }
        }

        carregarEncomendas();
    }, []);

    const filtros = {
        Todos: () => true,
        "A retirar": (item) => item.status === "RECEBIDA",
        Retirados: (item) => item.status === "ENTREGUE",
    };

    const filteredData = data.filter(filtros[activeTab]).filter((item) => item.emailDestinatario === user.username);

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
                    {filteredData.map((item) => (
                        <Card
                            key={item.idEncomenda}
                            encomendaData={item}
                            searchValue={debouncedSearch}
                        />
                    ))}
                </div>
            </div>
        </div>
        
    );

    
}
