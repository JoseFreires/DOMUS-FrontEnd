"use client";

import { useState } from "react";

import styles from "./page.module.css";
import Sidebar from "@/components/ui/Sidebar/Sidebar";
import Header from "@/components/ui/Header/Header";
import CustomTable from "@/components/ui/Table/Table";
import { InjectChamadosTable } from "@/utils/dataInject";
import {
  extractFilterChamadosStatuses,
  extractFilterChamadosTypes,
  extractFilterChamadosUsers,
  filterChamados,
  NAV_ITENS_CHAMADOS,
} from "@/filters";
import { useChamados } from "@/features/chamado/hooks/useChamados";
import { useAuth } from "@/app/auth.js";


export default function Chamados() {

  const { user } = useAuth();
  const canManage =
    user?.role.includes("ROLE_PORTEIRO") || user?.role.includes("ROLE_MORADOR");

  const { data, error, isLoading } = useChamados();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeTab, setActiveTab] = useState("Todos");
  const [filters, setFilters] = useState({
    selectedUsers: [],
    selectedTypes: [],
    selectedStatuses: [],
    startDate: "",
    endDate: "",
  });
  const chamadosFiltrados = filterChamados(data, activeTab, filters);

  return (
    <div className={styles.body}>
      <Sidebar />

      <main className={styles.main}>
        <Header
          titulo="Chamados registrados"
          search={search}
          setSearch={setSearch}
          setDebouncedSearch={setDebouncedSearch}
          users={extractFilterChamadosUsers(data)}
          filterTypes={extractFilterChamadosTypes(data)}
          filterStatuses={extractFilterChamadosStatuses(data)}
          filterUserLabel="Selecionar morador"
          filterTypeLabel="Selecionar tipos de chamado"
          filterStatusLabel="Selecionar status do chamado"
          filters={filters}
          onFiltersChange={setFilters}
          canAdd={canManage}
          navItens={NAV_ITENS_CHAMADOS}
          setActiveTab={setActiveTab}
          activeTab={activeTab}
        />

        {error && (
          <p className={styles.error} role="alert">
            {error.message || "Não foi possível carregar os chamados."}
          </p>
        )}

        <CustomTable
          headerAs="span"
          rowsPerPage={10}
          columns={InjectChamadosTable()}
          data={chamadosFiltrados}
          searchValue={debouncedSearch}
          isLoading={isLoading}
          emptyMessage="Nenhum chamado encontrado."
        />
      </main>
    </div>
  );
}