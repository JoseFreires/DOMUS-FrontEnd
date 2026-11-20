"use client";

import styles from "./page.module.css";
import Sidebar from "@/components/ui/Sidebar/Sidebar";
import Header from "@/components/ui/Header/Header";
import CustomTable from "@/components/ui/Table/Table";
import CadastroModal from "@/components/ui/Modal/FormCad/CadastroModal";

import { useState } from "react";
import { useAuth } from "@/app/auth.js";
import { usePorteiros } from "@/features/porteiro/hooks/usePorteiro";
import { useEntityModal } from "@/hooks/useEntityModal";

import { createPorteiro, validarPorteiro } from "@/features/porteiro/services/porteiroPOST";
import { updatePorteiro } from "@/features/porteiro/services/porteiroPUT";
import { reativarPorteiro } from "@/features/porteiro/services/porteiroPATCH";
import { porteiroFields } from "@/components/ui/Modal/FormCad/formConfigs";
import { InjectPorteirosTable } from "@/utils/dataInject";
import {
  NAV_ITENS_FUNCIONARIOS,
  extractFilterFuncionarios,
  filterFuncionarios,
} from "@/features/funcionarios/filters/funcionariosFilters";
import { useUndoableAction } from "@/hooks/useUndoableAction";
import UndoToast from "@/components/ui/UndoToast/UndoToast";

// Tela de Funcionários (porteiros). Os síndicos têm a própria tela: /pages/sindicos
export default function Funcionarios() {
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

  const { data, fetchPorteiros, removePorteiros, isLoading, accessDenied } =
    usePorteiros(activeTab);

  const modal = useEntityModal({
    onCreate: createPorteiro,
    onUpdate: (id, formData) => updatePorteiro(id, formData),
    onReactivate: reativarPorteiro,
    getId: (item) => item.idPorteiro,
    getReactivateId: (item) => item.idPorteiro,
    onRefresh: fetchPorteiros,
  });

  const undoCreate = useUndoableAction({
    delayMs: 4000,
    commit: createPorteiro,
    onCommitted: fetchPorteiros,
    onUndo: (dados) => modal.openAddWithDraft(dados),
    onFailed: (dados, error, { unmounted }) => {
      const msg = error?.message || "Não foi possível cadastrar o porteiro.";
      if (unmounted) {
        alert(`${msg}\nO porteiro "${dados?.nomeCompleto ?? ""}" NÃO foi cadastrado.`);
        return;
      }
      modal.openAddWithDraft(dados, msg);
    },
  });

  const handleSave = async (dados) => {
    if (modal.tipo !== "add") {
      await modal.save(dados);
      return;
    }
    validarPorteiro(dados);
    undoCreate.schedule(dados);
    modal.close();
  };

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
          users={extractFilterFuncionarios(data)}
          filters={filters}
          onFiltersChange={setFilters}
        />

        <CustomTable
          headerAs="span"
          rowsPerPage={10}
          columns={InjectPorteirosTable()}
          data={filterFuncionarios(data, activeTab, filters)}
          searchValue={debouncedSearch}
          onRowClick={modal.openEdit}
          onDeleteConfirm={removePorteiros}
          canRemove={activeTab !== "Inativos" && canManage} // inativo não se exclui de novo
          isLoading={isLoading}
          notice={
            undoCreate.status !== "idle" ? (
              <UndoToast
                status={undoCreate.status}
                token={undoCreate.token}
                delayMs={undoCreate.delayMs}
                paused={undoCreate.paused}
                messagePending="Porteiro será cadastrado em instantes"
                messageCommitting="Cadastrando porteiro…"
                messageSuccess="Porteiro cadastrado com sucesso"
                onUndo={undoCreate.undo}
                onPause={undoCreate.pause}
                onResume={undoCreate.resume}
              />
            ) : null
          }
          emptyMessage={
            accessDenied ? "Você não tem permissão para acessar esses dados" : undefined
          }
        />
      </div>

      <CadastroModal
        show={modal.open}
        onHide={modal.close}
        title={modal.tipo === "edit" ? "Editar Porteiro" : "Adicionar Porteiro"}
        fields={porteiroFields}
        initialData={modal.itemData?.draft ?? modal.itemData ?? {}}
        initialError={modal.itemData?.erro}
        onSaveChanges={handleSave}
        showPhoto={true}
        canManage={canManage}
        onReactivate={modal.reactivate}
      />
    </div>
  );
}
