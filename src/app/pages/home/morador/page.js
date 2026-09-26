"use client";

import React from "react";
import Sidebar from "@/components/ui/Sidebar/Sidebar";
import Header from "@/components/ui/Header/Header";
import HomeList from "@/components/ui/HomeList/HomeList";
import AvisoListItem from "@/features/aviso/components/AvisoListItem/AvisoListItem";
import ChamadoListItem from "@/features/chamado/components/ChamadoListItem/ChamadoListItem";
import ReservaListItem from "@/features/espacoCondominial/components/ReservaListItem/ReservaListItem";
import EncomendaCarousel from "@/features/encomendas/components/EncomendaCarousel/EncomendaCarousel";
import { useAuth } from "@/app/auth.js";
import { useEncomendas } from "@/features/encomendas/hooks/useEncomendas";
import styles from "./page.module.css";

import { FiClock, FiTool } from "react-icons/fi";
import { MdOutlineAnnouncement } from "react-icons/md";

function AvisoIcon({ tipo }) {
  if (tipo === "MANUTENCAO") return <FiTool size={16} color="#ffffff" />;
  return <MdOutlineAnnouncement size={16} color="#ffffff" />;
}

const MOCK_AVISOS = [
  { id: 1, tipo: "AVISO",      titulo: "Limpeza da piscina",          nomeSindico: "Sidney Souza", data: "Mar 20 at 4:15 pm" },
  { id: 2, tipo: "MANUTENCAO", titulo: "Elevador serviço indisponível", nomeSindico: "Sidney Souza", data: "Mar 20 at 4:15 pm" },
  { id: 3, tipo: "AVISO",      titulo: "Limpeza da piscina",          nomeSindico: "Sidney Souza", data: "Mar 20 at 4:15 pm" },
  { id: 4, tipo: "MANUTENCAO", titulo: "Manutenção da piscina",       nomeSindico: "Sidney Souza", data: "Mar 20 at 4:15 pm" },
];

const MOCK_CHAMADOS = [
  { id: 1, fotoMorador: null, nomeMorador: "Elizabeth Webber", titulo: "novo segurança", tipo: "SUGESTÃO"   },
  { id: 2, fotoMorador: null, nomeMorador: "Joui Jouki",       titulo: "Som Alto",       tipo: "RECLAMAÇÃO" },
];

const MOCK_RESERVAS = [
  { id: 1, local: "Churrasqueira Oeste", dataSolicitacao: "25/06/2026", fotoMorador: null, nome: "Elizabeth Webber", email: "liz.webber@email.com" },
  { id: 2, local: "Churrasqueira Sul",   dataSolicitacao: "22/07/2026", fotoMorador: null, nome: "Rubens Naluti",    email: "rubens@email.com"      },
];

export default function HomeMorador() {
  const { user } = useAuth();
  const { data: encomendas, isLoading: loadingEncomendas } = useEncomendas();

  return (
    <div className={`container-fluid ${styles.body}`}>
      <Sidebar />

      <div className={styles.main}>
        <Header />

        {/* Carousel de encomendas — altura reduzida e fixa (não cresce/encolhe) */}
        <div className={styles.carouselWrap}>
          <EncomendaCarousel
            data={encomendas ?? []}
            isLoading={loadingEncomendas}
            title="Minhas Encomendas"
            viewAllHref="/pages/meus-pacotes"
          />
        </div>

        {/* Listas — ocupam TODO o espaço restante da tela, sem estourar */}
        <div className={`row g-4 ${styles.listConteiner}`}>

          {/* Coluna esquerda: Chamados + Reservas empilhados (8/12) */}
          <div className={`col-md-8 ${styles.listColWide}`}>
            <HomeList
              title="Meus Chamados"
              data={MOCK_CHAMADOS}
              limit={10}
              renderItem={(item) => (
                <ChamadoListItem
                  fotoMorador={item.fotoMorador}
                  nome={item.nomeMorador}
                  titulo={item.titulo}
                  tipo={item.tipo}
                  icone={<FiClock size={16} color="#003366" />}
                />
              )}
              viewAllHref="/pages/chamados"
              emptyMessage="Nenhum chamado registrado."
            />

            <HomeList
              title="Minhas Reservas"
              data={MOCK_RESERVAS}
              limit={10}
              renderItem={(item) => (
                <ReservaListItem
                  local={item.local}
                  dataSolicitacao={item.dataSolicitacao}
                  fotoMorador={item.fotoMorador}
                  nome={item.nome}
                  email={item.email}
                />
              )}
              viewAllHref="/pages/reservarEspacosCondominiais"
              emptyMessage="Nenhuma reserva encontrada." 
            />
           
          </div>

          {/* Coluna direita: Avisos (4/12) */}
          <div className={`col-md-4 ${styles.listColNarrow}`}>
            <HomeList
              title="Últimos Avisos"
              data={MOCK_AVISOS}
              limit={10}
              renderItem={(item) => (
                <AvisoListItem
                  icon={<AvisoIcon tipo={item.tipo} />}
                  titulo={item.titulo}
                  nomeSindico={item.nomeSindico}
                  data={item.data}
                />
              )}
              viewAllHref="/pages/avisos"
              emptyMessage="Nenhum aviso disponível."
            />
          </div>

        </div>
      </div>
    </div>
  );
}