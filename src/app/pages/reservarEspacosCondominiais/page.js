"use client";

import styles from "./page.module.css";
import Sidebar from "@/app/components/Sidebar/sidebar";
import Header from "@/app/components/Header/header";
import { useState } from "react";
import { useAuth } from "@/app/auth.js";
import {NAV_ITENS_ESPACOSCONDOMINIAIS } from "@/app/hooks/filters";
import  Calendar from "@/app/components/Calendar/calendar";


export default function ReservarEspacosCondominiais() {
    const { user } = useAuth();
    const canManage = user?.role.includes("ROLE_MORADOR");
    
    const [activeTab, setActiveTab] = useState("Solicitar");


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

                <Calendar />
            </div>

            
           
        </div>
    );
}
