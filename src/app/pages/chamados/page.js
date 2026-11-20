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
import { useEntityModal } from "@/hooks/useEntityModal";
import ModalForm from "@/components/ui/Modal/ModalForm/ModalForm";
import ChamadoForm from "@/components/ui/Modal/ModalChamado/ChamadoForm";
import { updateStatusChamado } from "@/features/chamado/services/chamadoPATCH";
import { createChamado } from "@/features/chamado/services/chamadoPOST";
import { updateChamado } from "@/features/chamado/services/chamadoPUT";
import { useUndoableAction } from "@/hooks/useUndoableAction";
import UndoToast from "@/components/ui/UndoToast/UndoToast";

export default function Chamados() {
  const { user } = useAuth();
  // só o morador registra chamados (o back-end recusa os demais papéis)
  const canCreate = user?.role.includes("ROLE_MORADOR");

  // só o síndico trata/conclui chamados (o back-end recusa os demais papéis)
  const canTreat = user?.role.includes("ROLE_SINDICO");

  // síndico e morador abrem o chamado ao clicar na linha (admin não acessa /chamados)
  const canOpen = canTreat || canCreate;

  const { data, error, fetchChamados, cancelarChamados, isLoading } = useChamados();

  const modal = useEntityModal({
    onCreate: createChamado,
    // síndico muda o status (PATCH); morador edita o próprio chamado (PUT)
    onUpdate: (id, formData) =>
      canTreat ? updateStatusChamado(id, formData) : updateChamado(id, formData),
    getId: (item) => item.idChamado,
    onRefresh: fetchChamados,
  });

  const undoCreate = useUndoableAction({
    delayMs: 4000,
    commit: createChamado,
    onCommitted: fetchChamados,
    onUndo: (dados) => modal.openAddWithDraft(dados),
    onFailed: (dados, error, { unmounted }) => {
      const msg = error?.message || "Não foi possível registrar o chamado.";
      if (unmounted) {
        alert(`${msg}\nO chamado "${dados?.titulo ?? ""}" NÃO foi registrado.`);
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
    undoCreate.schedule(dados);
    modal.close();
  };

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
          canAdd={canCreate}
          onAddbuttonClick={modal.openAdd}
          navItens={NAV_ITENS_CHAMADOS}
          setActiveTab={setActiveTab}
          activeTab={activeTab}
        />

        {error && (
          <p className={styles.error} role="alert">
            {error.message || "Não foi possível concluir a operação."}
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
          onRowClick={canOpen ? modal.openEdit : null}
          canRemove={canCreate}
          rowKey="idChamado"
          onDeleteConfirm={cancelarChamados}
          removeLabel="Cancelar chamados"
          removeVerb="cancelar"
          confirmationTitle="Confirmar cancelamento?"
          confirmationMessage="Os chamados selecionados serão marcados como cancelados. Eles não serão excluídos."
          confirmationConfirmLabel="Confirmar cancelamento"
          notice={
            undoCreate.status !== "idle" ? (
              <UndoToast
                status={undoCreate.status}
                token={undoCreate.token}
                delayMs={undoCreate.delayMs}
                paused={undoCreate.paused}
                messagePending="Chamado será registrado em instantes"
                messageCommitting="Registrando chamado…"
                messageSuccess="Chamado registrado com sucesso"
                onUndo={undoCreate.undo}
                onPause={undoCreate.pause}
                onResume={undoCreate.resume}
              />
            ) : null
          }
        />
      </main>

      <ModalForm show={modal.open} onHide={modal.close} size="md" centered>
        {(modal.tipo === "add" ||
          (modal.tipo === "edit" && modal.itemData)) && (
          <ChamadoForm
            key={modal.itemData?.idChamado ?? "add"}
            modo={modal.tipo === "add" ? "add" : canTreat ? "sindico" : "morador"}
            chamadoData={modal.itemData?.draft ?? modal.itemData}
            initialError={modal.itemData?.erro}
            onSaveChanges={handleSave}
            onClose={modal.close}
          />
        )}
      </ModalForm>
    </div>
  );
}
