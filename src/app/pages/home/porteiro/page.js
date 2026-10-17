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
import { useAvisos } from "@/features/aviso/hooks/useAvisos.js";
import { MdOutlineAnnouncement } from "react-icons/md";
import { FiClock, FiTool } from "react-icons/fi";
import AvisoIcon from "@/features/aviso/components/AvisoIcon/AvisoIcon";

export default function Home() {
  const { user } = useAuth();
  const { cards, isLoading } = useDashboardStats(user?.role);

  const { data, fetchEncomendas } = useEncomendas();
  const { data: avisos } = useAvisos();

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

        <div className={`row g-4 ${styles.listConteiner}`}>
          <div className={`col-md-8 ${styles.listColWide}`}>
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
            />
          </div>

          <div className={`col-md-4 ${styles.listColNarrow}`}>
            <HomeList
              title={"Últimos Avisos"}
              data={avisos}
              limit={10}
              renderItem={(item) => (
                <AvisoListItem
                  icon={<AvisoIcon tipo={item.tipo} />}
                  titulo={item.titulo}
                  nomeSindico={item.nomeSindico}
                  data={item.data}
                />
              )}
              emptyMessage="Nenhum aviso disponível."
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
