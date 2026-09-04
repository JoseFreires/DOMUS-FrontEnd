"use client";

import styles from "./page.module.css";
import Sidebar from "@/app/components/Sidebar/sidebar";
import Header from "@/app/components/Header/header";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/auth.js";
import {NAV_ITENS_ESPACOSCONDOMINIAIS } from "@/app/hooks/filters";

import  Calendar from "@/app/components/Calendar/calendar";
import CardEspacoCondominial from "@/app/components/Cards/CardEspacoCondominial/card";
import CardGroup from 'react-bootstrap/Card';

import dados from "../../../../data/espacos.json"

export default function ReservarEspacosCondominiais() {
    const { user } = useAuth();
    const canManage = user?.role.includes("ROLE_MORADOR");
    
    const [activeTab, setActiveTab] = useState("Solicitar");
    const [data, setData] = useState([]);

    useEffect(() => {
        async function carregarEspacosDisponiveis() {
            
            const response = await listEncomendas();
            
            console.log("Encomendas recebidas:", response);

            if (response) {
                setData(response);
            }
            
        }

        carregarEspacosDisponiveis();
    }, []);


    return (
        <div className={styles.body}>
            <Sidebar />

            <div className={styles.main}>
                <Header
                    titulo="Reservar Espaço Condominial"
                    navItens={NAV_ITENS_ESPACOSCONDOMINIAIS}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />

                <div className={styles.content}>
                    <Calendar />
                     <CardGroup className={styles.containerEspacosDisponiveis}>
                        {dados["Espaços Condominiais"].map((item) => (
                            <CardEspacoCondominial
                                espacoCondominialData={item}
                            />
                        ))}
                     </CardGroup>
                    
                </div>
                
                
            </div>

            
           
        </div>
    );
}
