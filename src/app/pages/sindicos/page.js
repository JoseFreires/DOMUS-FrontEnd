"use client";

import styles from "./page.module.css";
import Sidebar from "@/components/ui/Sidebar/Sidebar";
import Header from "@/components/ui/Header/Header";
import CustomTable from "@/components/ui/Table/Table";
import CadastroModal from "@/components/ui/Modal/FormCad/CadastroModal";

import { useState } from "react";
import { useAuth } from "@/app/auth.js";
import { useSindicos } from "@/features/sindico/hooks/useSindico";
import { useEntityModal } from "@/hooks/useEntityModal";

import { createSindico } from "@/features/sindico/services/sindicoPOST";
import { updateSindico } from "@/features/sindico/services/sindicoPUT";
import { reativarSindico } from "@/features/sindico/services/sindicoPATCH";
import { sindicoFields } from "@/components/ui/Modal/FormCad/formConfigs";
import { InjectSindicosTable } from "@/utils/dataInject";
import {
  NAV_ITENS_SINDICOS,
  extractFilterFuncionarios,
  filterFuncionarios,
} from "@/features/funcionarios/filters/funcionariosFilters";

export default function Sindicos() {
  const { user } = useAuth();
  const canManage =
    user?.role?.includes("ROLE_SINDICO") || user?.role?.includes("ROLE_ADMIN");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeTab, setActiveTab] = useState("Todos");
  const [filters, setFilters] = useState({
    selectedUsers: [],
    startDate: "",
    endDate: "",
  });

  const { data, fetchSindicos, removeSindicos, isLoading, accessDenied } =
    useSindicos(activeTab);

  const modal = useEntityModal({
    onCreate: createSindico,
    onUpdate: (id, formData) => updateSindico(id, formData),
    onReactivate: reativarSindico,
    getId: (item) => item.idUsuario,
    getReactivateId: (item) => item.idUsuario, // o PATCH recebe o idUsuario
    onRefresh: fetchSindicos,
  });

  return (
    <div className={styles.body}>
      <Sidebar />
      <div className={styles.main}>
        <Header
          titulo="Síndicos registrados"
          navItens={NAV_ITENS_SINDICOS}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          search={search}
          setSearch={setSearch}
          setDebouncedSearch={setDebouncedSearch}
          canAdd={canManage}
          onAddbuttonClick={modal.openAdd}
          users={extractFilterFuncionarios(data)}
          filters={filters}
          onFiltersChange={setFilters}
        />

        <CustomTable
          headerAs="span"
          rowsPerPage={10}
          columns={InjectSindicosTable()}
          data={filterFuncionarios(data, activeTab, filters)}
          searchValue={debouncedSearch}
          onRowClick={modal.openEdit}
          onDeleteConfirm={removeSindicos}
          canRemove={activeTab !== "Inativos" && canManage} // inativo não se exclui de novo
          isLoading={isLoading}
          emptyMessage={
            accessDenied ? "Você não tem permissão para acessar esses dados" : undefined
          }
        />
      </div>

      <CadastroModal
        show={modal.open}
        onHide={modal.close}
        title={modal.tipo === "edit" ? "Editar Síndico" : "Adicionar Síndico"}
        fields={sindicoFields}
        initialData={modal.itemData ?? {}}
        onSaveChanges={modal.save}
        showPhoto={true}
        canManage={canManage}
        onReactivate={modal.reactivate}
      />
    </div>
  );
}