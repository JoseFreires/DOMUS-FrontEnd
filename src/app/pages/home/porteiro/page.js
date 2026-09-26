"use client";

import React from "react";
import Sidebar from "@/app/components/Sidebar/sidebar";
import Header from "@/app/components/Header/header";
import styles from "./page.module.css";
import { useAuth } from "@/app/auth.js";

import { LuBuilding2 } from "react-icons/lu";

import { useEncomendas } from "@/app/hooks/useEncomendas";
// sessão de import para os cards de estatísticas
import { Row, Col } from "react-bootstrap";
import StatCard from "@/app/components/Card/StatCard/StatCard";
import { useDashboardStats } from "@/app/hooks/UseDashboardStats";

// sessão de import para a tabela de registros por role
import HomeList from "@/app/components/HomeList/HomeList";
import EncomendaListItem from "@/app/components/ListItems/EncomendaListItem";
import AvisoListItem from "@/app/components/ListItems/AvisoListItem";
import { MdOutlineAnnouncement } from "react-icons/md";
import { FiClock, FiTool } from "react-icons/fi";

export default function Home() {
  const { user } = useAuth();
  const { cards, isLoading } = useDashboardStats(user?.role);

  const { data, fetchEncomendas } = useEncomendas();

  function AvisoIcon({ tipo }) {
    if (tipo === "MANUTENCAO") return <FiTool size={16} color="#ffffff" />;
    return <MdOutlineAnnouncement size={16} color="#ffffff" />;
  }
  const MOCK_AVISOS = [
    {
      id: 1,
      tipo: "AVISO",
      titulo: "Limpeza da piscina",
      nomeSindico: "Sidney Souza",
      data: "Mar 20 at 4:15 pm",
    },
    {
      id: 2,
      tipo: "MANUTENCAO",
      titulo: "Elevador serviço indisponível",
      nomeSindico: "Sidney Souza",
      data: "Mar 20 at 4:15 pm",
    },
    {
      id: 3,
      tipo: "AVISO",
      titulo: "Limpeza da piscina",
      nomeSindico: "Sidney Souza",
      data: "Mar 20 at 4:15 pm",
    },
    {
      id: 4,
      tipo: "MANUTENCAO",
      titulo: "Manutenção da piscina",
      nomeSindico: "Sidney Souza",
      data: "Mar 20 at 4:15 pm",
    },
    {
      id: 5,
      tipo: "AVISO",
      titulo: "Limpeza da piscina",
      nomeSindico: "Sidney Souza",
      data: "Mar 20 at 4:15 pm",
    },
    {
      id: 6,
      tipo: "MANUTENCAO",
      titulo: "Elevador serviço indisponível",
      nomeSindico: "Sidney Souza",
      data: "Mar 20 at 4:15 pm",
    },
    {
      id: 7,
      tipo: "AVISO",
      titulo: "Limpeza da piscina",
      nomeSindico: "Sidney Souza",
      data: "Mar 20 at 4:15 pm",
    },
    {
      id: 8,
      tipo: "MANUTENCAO",
      titulo: "Manutenção da piscina",
      nomeSindico: "Sidney Souza",
      data: "Mar 20 at 4:15 pm",
    },
    {
      id: 9,
      tipo: "MANUTENCAO",
      titulo: "Elevador serviço indisponível",
      nomeSindico: "Sidney Souza",
      data: "Mar 20 at 4:15 pm",
    },
    {
      id: 10,
      tipo: "AVISO",
      titulo: "Limpeza da piscina",
      nomeSindico: "Sidney Souza",
      data: "Mar 20 at 4:15 pm",
    },
  ];

  if (isLoading) return <p>Carregando indicadores...</p>;

  return (
    <div className={`container-fluid ${styles.body}`}>
      <Sidebar />
      <div className={styles.main}>
        <Header />

        {/* Cards de Estatísticas */}
        <Row className="g-3 mb-4">
          {(cards ?? []).map((card, i) => (
            <Col key={i} md={4}>
              <StatCard
                icon={<BuildingIcon />}
                title={card.titulo}
                value={card.valor}
                percentage={card.percentual}
                comparisonLabel={card.comparacao}
              />
            </Col>
          ))}
        </Row>

        <div className={`row g-5 ${styles.listConteiner}`}>
          <HomeList
            title={"Últimos Encomendas"}
            data={data}
            renderItem={(item) => (
              <EncomendaListItem
                foto={item.foto}
                titulo={item.nomePacote}
                dataRecebimento={item.dataHoraRecebido}
                status={item.status}
                apartamento={item.numeroApartamento}
              />
            )}
            viewAllHref={"/pages/encomendas"}
            className="col-md-8"
          />

          <HomeList
            title={"Últimos Avisos"}
            data={MOCK_AVISOS}
            renderItem={(item) => (
              <AvisoListItem
                icon={<AvisoIcon tipo={item.tipo} />}
                titulo={item.titulo}
                nomeSindico={item.nomeSindico}
                data={item.data}
              />
            )}
            className="col-md-4"
          />
        </div>
      </div>
    </div>
  );
}

function BuildingIcon() {
  return <LuBuilding2 size={28} color="#f1f1f1" />;
}
