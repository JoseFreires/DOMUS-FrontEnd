"use client";

import styles from "./page.module.css";
import Sidebar from "@/components/ui/Sidebar/Sidebar";
import Header from "@/components/ui/Header/Header";
import CustomTable from "@/components/ui/Table/Table";
import ModalForm from "@/components/ui/Modal/ModalForm/ModalForm";
import CadastroModal from "@/components/ui/Modal/FormCad/CadastroModal";
import { useState } from "react";
import { useAuth } from "@/app/auth.js";
import { usePorteiros } from "@/features/porteiro/hooks/usePorteiro";
import { useSindicos } from "@/features/sindico/hooks/useSindico";
import { useEntityModal } from "@/hooks/useEntityModal";
import { createPorteiro } from "@/features/porteiro/services/porteiroPOST";
import { updatePorteiro } from "@/features/porteiro/services/porteiroPUT";
import { createSindico } from "@/features/sindico/services/sindicoPOST";
import { updateSindico } from "@/features/sindico/services/sindicoPUT";
import {
  porteiroFields,
  sindicoFields,
} from "@/components/ui/Modal/FormCad/formConfigs";
import {
  InjectPorteirosTable,
  InjectSindicosTable,
} from "@/utils/dataInject";
import {
  NAV_ITENS_FUNCIONARIOS,
  extractFilterFuncionarios,
  filterPorteiros,
  filterSindicos,
} from "@/features/funcionarios/filters/funcionariosFilters";

export default function Funcionarios() {
  const { user } = useAuth();
  const canManage =
    user?.role.includes("ROLE_SINDICO") || user?.role.includes("ROLE_ADMIN");

  const {
    data: porteiros,
    fetchPorteiros,
    removePorteiros,
    isLoading: loadingPorteiros,
  } = usePorteiros();
  const {
    data: sindicos,
    fetchSindicos,
    removeSindicos,
    isLoading: loadingSindicos,
  } = useSindicos();
  const [activeTab, setActiveTab] = useState("Porteiros");

  const [filters, setFilters] = useState({
    selectedUsers: [],
    startDate: "",
    endDate: "",
  });

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const tabConfig = {
    Porteiros: {
      data: porteiros,
      columns: InjectPorteirosTable(),
      fields: porteiroFields,
      onCreate: createPorteiro,
      onUpdate: (id, formData) => updatePorteiro(id, formData),
      getId: (item) => item.idPorteiro,
      onRefresh: fetchPorteiros,
      onDelete: removePorteiros,
      isLoading: loadingPorteiros,
      filterUsers: extractFilterFuncionarios(porteiros),
      filterData: (item) =>
        !filters.selectedUsers.length ||
        filters.selectedUsers.includes(item.nomeCompleto),
      titleAdd: "Adicionar Porteiro",
      titleEdit: "Editar Porteiro",
    },
    Sindicos: {
      data: sindicos,
      columns: InjectSindicosTable(),
      fields: sindicoFields,
      onCreate: createSindico,
      onUpdate: (id, formData) => updateSindico(id, formData),
      getId: (item) => item.idUsuario,
      onRefresh: fetchSindicos,
      onDelete: removeSindicos,
      isLoading: loadingSindicos,
      filterUsers: extractFilterFuncionarios(sindicos),
      filterData: (item) =>
        !filters.selectedUsers.length ||
        filters.selectedUsers.includes(item.nomeCompleto),
      titleAdd: "Adicionar Síndico",
      titleEdit: "Editar Síndico",
    },
  };

  const tab = tabConfig[activeTab] ?? tabConfig.Porteiros;
  const filteredData = (tab.data ?? []).filter(tab.filterData);
  const modal = useEntityModal({
    onCreate: tab.onCreate,
    onUpdate: tab.onUpdate,
    getId: tab.getId,
    onRefresh: tab.onRefresh,
  });

  return (
    <div className={styles.body}>
      <Sidebar />
      <div className={styles.main}>
        <Header
          titulo="Funcionários registrados"
          navItens={NAV_ITENS_FUNCIONARIOS}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          search={search}
          setSearch={setSearch}
          setDebouncedSearch={setDebouncedSearch}
          canAdd={canManage}
          onAddbuttonClick={modal.openAdd}
          users={tab.filterUsers}
          filters={filters}
          onFiltersChange={setFilters}
        />

        <CustomTable
          headerAs="span"
          rowsPerPage={10}
          columns={tab.columns}
          data={filteredData}
          searchValue={debouncedSearch}
          onRowClick={modal.openEdit}
          onDeleteConfirm={tab.onDelete}
          canRemove={canManage}
          isLoading={tab.isLoading}
        />
      </div>

        <CadastroModal
          show={modal.open}
          onHide={modal.close}
          title={modal.tipo === "edit" ? tab.titleEdit : tab.titleAdd}
          fields={tab.fields}
          initialData={modal.itemData ?? {}}
          onSaveChanges={modal.save}
          showPhoto={true}
        />
    </div>
  );
}
