"use client";

import Sidebar from "@/components/ui/Sidebar/Sidebar";
import Header from "@/components/ui/Header/Header";
import styles from "./page.module.css";
import { useAuth } from "@/app/auth.js";
import { useState } from "react";

import {
  extractFilterAvisos,
  extractFilterTiposAviso,
  filterAvisos,
  NAV_ITENS_AVISOS,
} from "@/filters";
import { InjectAvisosTable } from "@/utils/dataInject";

import { useAvisos } from "@/features/aviso/hooks/useAvisos.js";
import { FiTool } from "react-icons/fi";
import CustomTable from "@/components/ui/Table/Table";
import AvisoListItem from "@/features/aviso/components/AvisoListItem/AvisoListItem";
import { MdOutlineAnnouncement } from "react-icons/md";

export default function Avisos() {
  const { user } = useAuth();
  const canManage =
    user?.role.includes("ROLE_SINDICO") || user?.role.includes("ROLE_ADMIN");
  const canFilter = canManage;
  
  const { data: avisos, isLoading } = useAvisos();
  function AvisoIcon({ tipo }) {
    if (tipo === "MANUTENCAO") return <FiTool size={16} color="#ffffff" />;
    return <MdOutlineAnnouncement size={16} color="#ffffff" />;
  }
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filters, setFilters] = useState({
    selectedUsers: [],
    selectedTypes: [],
    startDate: "",
    endDate: "",
  });
  const [activeTab, setActiveTab] = useState("Ativos");
  const [avisoSelecionado, setAvisoSelecionado] = useState(null);

  return (
    <div className={`container-fluid ${styles.body}`}>
      <Sidebar />
      <div className={styles.main}>
        {canFilter ? (
          <>
            <Header
              titulo="Avisos Condominiais"
              search={search}
              setSearch={setSearch}
              setDebouncedSearch={setDebouncedSearch}
              canAdd={canManage}
              // onAddbuttonClick={modal.openAdd}
              filters={filters}
              onFiltersChange={setFilters}
              users={extractFilterAvisos(avisos)}
              filterUserLabel="Selecionar criador"
              filterTypes={extractFilterTiposAviso(avisos)}
              navItens={NAV_ITENS_AVISOS}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />

            <CustomTable
              headerAs="span"
              rowsPerPage={10}
              columns={InjectAvisosTable()}
              data={filterAvisos(avisos, activeTab, filters)}
              searchValue={debouncedSearch}
              canRemove={canManage}
              isLoading={isLoading}
            />
          </>
        ) : (
          <>
            <Header
              titulo="Avisos Condominiais"
              search={search}
              setSearch={setSearch}
              setDebouncedSearch={setDebouncedSearch}
              canAdd={canManage}
              // onAddbuttonClick={modal.openAdd}
            />

            <div className={`row g-4 ${styles.listConteiner}`}>
              <div className={`col-md-3 ${styles.listColNarrow}`}>
                <CustomTable
                  variant="list"
                  data={avisos}
                  rowKey="id"
                  pageSize={10}
                  pageSizeOptions={[5, 10, 20]}
                  activeRowKey={avisoSelecionado?.id}
                  onRowClick={setAvisoSelecionado}
                  renderItem={(aviso) => (
                    <AvisoListItem
                      icon={<AvisoIcon tipo={aviso.tipoAviso} />}
                      titulo={aviso.titulo}
                      nomeSindico={aviso.nomeSindico}
                      data={aviso.dataHoraAviso}
                      // unread={!aviso.lido}
                    />
                  )}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
