"use client";

import React from "react";
import Sidebar from "@/components/ui/Sidebar/Sidebar";
import Header from "@/components/ui/Header/Header";
import styles from "./page.module.css";
import { useAuth } from "@/app/auth.js";

import { LuBuilding2 } from "react-icons/lu";
import { useEncomendas } from "@/features/encomendas/hooks/useEncomendas";

// sessão de import para os cards de estatísticas
import { Row, Col } from "react-bootstrap";
import StatCard from "@/components/ui/StatCard/StatCard";
import { useDashboardStats } from "@/hooks/useDashboardStats";

// sessão de import para a tabela de registros por role
import HomeList from "@/components/ui/HomeList/HomeList";
import EncomendaListItem from "@/features/encomendas/components/EncomendaListItem/EncomendaListItem";
import AvisoListItem from "@/features/aviso/components/AvisoListItem/AvisoListItem";
import ReservaListItem from "@/features/espacoCondominial/components/ReservaListItem/ReservaListItem";
import ChamadoListItem from "@/features/chamado/components/ChamadoListItem/ChamadoListItem";
import { MdOutlineAnnouncement } from "react-icons/md";
import { FiClock, FiTool } from "react-icons/fi";

export default function Home() {
  const { user } = useAuth();
  const { data, fetchEncomendas } = useEncomendas();
  const { cards, isLoading } = useDashboardStats(user?.role);

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
]

const MOCK_CHAMADOS = [
  { id: 1, fotoMorador: null, nomeMorador: "Elizabeth Webber", titulo: "novo segurança", tipo: "SUGESTÃO"   },
  { id: 2, fotoMorador: null, nomeMorador: "Joui Jouki",       titulo: "Som Alto",       tipo: "RECLAMAÇÃO" },
];

const MOCK_RESERVAS = [
  { id: 1, local: "Churrasqueira Oeste", dataSolicitacao: "25/06/2026", fotoMorador: null, nome: "Elizabeth Webber", email: "liz.webber@email.com" },
  { id: 2, local: "Churrasqueira Sul",   dataSolicitacao: "22/07/2026", fotoMorador: null, nome: "Rubens Naluti",    email: "rubens@email.com"      },
]

  if (isLoading) return <p>Carregando indicadores...</p>;

  return (
    <div className={`container-fluid ${styles.body}`}>
      <Sidebar />
      <div className={styles.main}>
        <Header />

        {/* Cards de Estatísticas */}
        <Row className="g-2 mb-2">
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

        {/* Tabelas de exibição */}
        <div className={`row g-4 ${styles.listConteiner}`}>
          {/* Coluna esquerda — Chamados + Reservas empilhados */}
          <div className="col-md-8 d-flex flex-column gap-4">
            <HomeList
              title="Últimos chamados"
              data={MOCK_CHAMADOS}
              renderItem={(item) => (
                <ChamadoListItem
                  fotoMorador={item.fotoMorador}
                  nome={item.nomeMorador}
                  titulo={item.titulo}
                  tipo={item.tipo}
                  icone={item.tipo}
                />
              )}
              viewAllHref="/pages/chamados"
            />

            <HomeList
              title="Ultimas Requisições de Reservas"
              data={MOCK_RESERVAS}
              renderItem={(item) => (
                <ReservaListItem
                  local={item.local}
                  dataSolicitacao={item.dataSolicitacao}
                  fotoMorador={item.fotoMorador}
                  nome={item.nome}
                  email={item.email}
                />
              )}
              viewAllHref="/pages/reservas"
            />
          </div>

          {/* Coluna direita — Avisos ocupa toda a altura */}
          <div className="col-md-4">
            <HomeList
              title="Últimos avisos"
              data={MOCK_AVISOS}
              renderItem={(item) => (
                <AvisoListItem
                   icon={<AvisoIcon tipo={item.tipo} />}
                  titulo={item.titulo}
                  nomeSindico={item.nomeSindico}
                  data={item.data}
                />
              )}
              viewAllHref="/pages/avisos"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function BuildingIcon() {
  return <LuBuilding2 size={28} color="#f1f1f1" />;
}
