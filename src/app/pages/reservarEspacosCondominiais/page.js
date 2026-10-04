"use client";

import styles from "./page.module.css";
import Sidebar from "@/components/ui/Sidebar/Sidebar";
import Header from "@/components/ui/Header/Header";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/auth.js";
import { NAV_ITENS_ESPACOSCONDOMINIAIS_MORADOR } from "@/filters";

import Calendar from "@/components/ui/Calendar/Calendar";
import CardEspacoCondominial from "@/features/espacoCondominial/components/CardEspacoCondominial/card";
import CardEspacoCondominialLaydown from "@/features/espacoCondominial/components/CardEspacoCondominialLaydown/card";
import CardGroup from 'react-bootstrap/Card';
import ReservarEspacoCondominialModal from "@/features/espacoCondominial/components/FormReservarEspacoCondominial/ReservarEspacoCondominialModal"

import { updateReservaEspacoCondominial } from '@/features/espacoCondominial/services/espacoCondominialReservarPUT';

import { InputGroup, Form, Row, Col } from "react-bootstrap";
import { Search } from "react-bootstrap-icons";
import { BiCalendarX } from "react-icons/bi";

import dados from "@/data/espacos.json";

import { useMoradores } from '@/features/morador/hooks/useMorador';
import { useEntityModal } from '@/hooks/useEntityModal';


export default function ReservarEspacosCondominiais() {
    const { user } = useAuth();
    const canManage = user?.role.includes("ROLE_MORADOR");

    const [activeTab, setActiveTab] = useState("Solicitar");
    const [search, setSearch] = useState();

    const { data, fetchMoradores, removeMoradores, isLoading } = useMoradores();

    const espacos = dados["Espaços Condominiais"] ?? [];

    const modal = useEntityModal({
        onUpdate: (id, formData) => updateReservaEspacoCondominial(id, formData),
        getId: (item) => item.idReservaEspacoCondominial,
        onRefresh: fetchMoradores,
    });


    return (
        <div className={styles.body}>
            <Sidebar />

            <div className={styles.main}>
                <Header
                    titulo="Reservar Espaço Condominial"
                    navItens={NAV_ITENS_ESPACOSCONDOMINIAIS_MORADOR}
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

                                {espacos.length > 0 ? (
                                    <CardGroup className={styles.containerCardsEspacosDisponiveis}>
                                        {espacos.map((item, index) => (
                                            <CardEspacoCondominial
                                                key={item.id ?? index}
                                                espacoCondominialData={item}
                                                onButtonOpenModal={modal.openAdd}
                                            />
                                        ))}
                                    </CardGroup>
                                ) : (
                                    <div className={styles.containerSemCardsEspacosDisponiveis}>
                                        <BiCalendarX size={50} />
                                        <p>Nenhum espaço condominial disponível no momento.</p>
                                    </div>
                                )}
                            </div>

                            <ReservarEspacoCondominialModal
                                show={modal.open}
                                onHide={modal.close}
                                title={"Reservar Espaço Condominial"}
                                dataReserva={"15/09/2026"}
                                initialData={modal.itemData ?? {}}
                                onSaveChanges={modal.save}
                                showPhoto={true}

                            />

                        </>
                    ) : (
                        <>
                            <div className={styles.containerEspacosDisponiveis}>
                                <Row xs={1} md={2} className="g-4">
                                    {dados["Espaços Condominiais Disponíveis"].map((item, index) => (
                                        <Col>
                                            <CardEspacoCondominialLaydown
                                                key={item.id ?? index}
                                                espacoCondominialData={item}
                                                onButtonOpenModal={modal.openAdd}
                                            />
                                        </Col>
                                    ))}
                                </Row>

                            </div>
                            <ReservarEspacoCondominialModal
                                show={modal.open}
                                onHide={modal.close}
                                title={"Reserva de Espaço Condominial"}
                                dataReserva={"15/09/2026"}
                                initialData={modal.itemData ?? {}}
                                onSaveChanges={modal.save}
                                showPhoto={true}

                            />
                        </>
                    )}


                </div>

            </div>

        </div>
    );
}
