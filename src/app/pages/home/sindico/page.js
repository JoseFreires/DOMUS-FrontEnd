"use client";

import React from "react";
import Sidebar from "@/components/ui/Sidebar/Sidebar";
import Header from "@/components/ui/Header/Header";
import styles from "./page.module.css";
import { useAuth } from "@/app/auth.js";

import { LuBuilding2 } from "react-icons/lu";

// sessão de import para os cards de estatísticas
import { Row, Col } from "react-bootstrap";
import StatCard from "@/components/ui/StatCard/StatCard";
import { useDashboardStats } from "@/hooks/useDashboardStats";

// sessão de import para a tabela de registros por role
import HomeList from "@/components/ui/HomeList/HomeList";

import AvisoListItem from "@/features/aviso/components/AvisoListItem/AvisoListItem";
import { useAvisos } from "@/features/aviso/hooks/useAvisos.js";
import ReservaListItem from "@/features/espacoCondominial/components/ReservaListItem/ReservaListItem";
import { useSolicitacoesReservas } from "@/features/reservas/hooks/useSolicitacoesReservas.js";
import { useChamados } from "@/features/chamado/hooks/useChamados";
import ChamadoListItem from "@/features/chamado/components/ChamadoListItem/ChamadoListItem";
import { MdOutlineAnnouncement } from "react-icons/md";
import { FiClock, FiTool } from "react-icons/fi";
import AvisoIcon from "@/features/aviso/components/AvisoIcon/AvisoIcon";

export default function Home() {
  const { user } = useAuth();
  const { cards, isLoading } = useDashboardStats(user?.role);
  const { data: avisos } = useAvisos();
  const { data: chamados, isLoading: loadingChamados } = useChamados();
  const {
    solicitacoes,
    error: erroSolicitacoes,
    isLoading: carregandoSolicitacoes,
  } = useSolicitacoesReservas();

  // mais recentes primeiro; HomeList usa `id` como chave da linha
  const ultimosChamados = React.useMemo(
    () =>
      [...(chamados ?? [])]
        .sort((a, b) => b.idChamado - a.idChamado)
        .map((c) => ({ ...c, id: c.idChamado })),
    [chamados],
  );

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
              data={ultimosChamados}
              isLoading={loadingChamados}
              renderItem={(item) => (
                <ChamadoListItem
                  imagem={item.imagem}
                  nome={item.nomeMorador}
                  titulo={item.titulo}
                  tipo={item.tipoChamado}
                />
              )}
              viewAllHref="/pages/chamados"
              className={styles.listChamados}
            />

            <HomeList
              title="Ultimas Requisições de Reservas"
              data={solicitacoes.map((reserva) => ({ ...reserva, id: reserva.idReserva }))}
              isLoading={carregandoSolicitacoes}
              emptyMessage={erroSolicitacoes?.message || "Nenhuma solicitação de reserva."}
              renderItem={(reserva) => (
                <ReservaListItem
                  reserva={reserva}
                  perfil="sindico"
                />
              )}
              viewAllHref="/pages/gerenciarReservas"
            />
          </div>

          {/* Coluna direita — Avisos ocupa toda a altura */}
          <div className="col-md-4">
            <HomeList
              title="Últimos avisos"
              data={avisos}
              limit={10}
              renderItem={(item) => (
                <AvisoListItem
                   icon={<AvisoIcon tipo={item.tipoAviso} />}
                  titulo={item.titulo}
                  nomeSindico={item.nomeSindico}
                  data={item.data}
                />
              )}
              emptyMessage="Nenhum aviso disponível."
              viewAllHref="/pages/avisos"

              className={styles.listAvisos}
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
