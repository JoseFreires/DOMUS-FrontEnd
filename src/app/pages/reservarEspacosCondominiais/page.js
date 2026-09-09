"use client";

import styles from "./page.module.css";
import Sidebar from "@/app/components/Sidebar/sidebar";
import Header from "@/app/components/Header/header";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/auth.js";
import {NAV_ITENS_ESPACOSCONDOMINIAIS } from "@/app/hooks/filters";

import  Calendar from "@/app/components/Calendar/calendar";
import CardEspacoCondominial from "@/app/components/Cards/CardEspacoCondominial/card";
import CardEspacoCondominialLaydown from "@/app/components/Cards/CardEspacoCondominialLaydown/card";
import CardGroup from 'react-bootstrap/Card';

import { InputGroup, Form, Row, Col } from "react-bootstrap";
import { Search } from "react-bootstrap-icons";
import { BiCalendarX } from "react-icons/bi";

import dados from "../../../../data/espacos.json"

export default function ReservarEspacosCondominiais() {
    const { user } = useAuth();
    const canManage = user?.role.includes("ROLE_MORADOR");
    
    const [activeTab, setActiveTab] = useState("Solicitar");
    const [search, setSearch] = useState();
    const [data, setData] = useState([]);

    // useEffect(() => {
    //     async function carregarEspacosDisponiveis() {
            
    //         const response = await listEncomendas();
            
    //         console.log("Encomendas recebidas:", response);

    //         if (response) {
    //             setData(response);
    //         }
            
    //     }

    //     carregarEspacosDisponiveis();
    // }, []);


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
                    {activeTab === "Solicitar" ? ( 
                        <>
                            <Calendar />
                            <div className={styles.containerEspacosDisponiveis}>
                                <div className={styles.searchGroup}>
                                    <InputGroup>
                                        <InputGroup.Text className={styles.searchIcon}>
                                            <Search />
                                        </InputGroup.Text>

                                        <Form.Control
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder="Pesquisar..."
                                            className={styles.searchInput}
                                        />
                                    </InputGroup>
                                </div>
                                <CardGroup className={styles.containerCardsEspacosDisponiveis}>
                                    {dados["Espaços Condominiais"]?.length > 0 ? (
                                        dados["Espaços Condominiais"].map((item, index) => (
                                            <CardEspacoCondominial
                                                key={item.id ?? index}
                                                espacoCondominialData={item}
                                            />
                                        ))
                                    ) : (
                                        <div className="containerSemEspacosDisponiveis">
                                            <BiCalendarX size={50}/>
                                            <p>Nenhum espaço condominial disponível no momento.</p>
                                        </div>
                                        
                                    )}
                                </CardGroup>
                            </div>
                        </>
                     ) : (
                         <div className={styles.containerEspacosDisponiveis}>
                                <Row xs={1} md={2} className="g-4">
                                    {dados["Espaços Condominiais Disponíveis"].map((item, index) => (
                                        <Col>
                                            <CardEspacoCondominialLaydown
                                                key={item.id ?? index}
                                                espacoCondominialData={item}
                                            />
                                        </Col>
                                    ))}
                                </Row>
                                
                        </div>
                     )}

                    
                </div>
                
            </div>
 
        </div>
    );
}
