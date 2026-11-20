"use client";

import styles from './page.module.css';

import Sidebar from '@/components/ui/Sidebar/Sidebar';
import Header from '@/components/ui/Header/Header';
import CustomTable from '@/components/ui/Table/Table';
import CadastroModal from "@/components/ui/Modal/FormCad/CadastroModal";

import { useState } from 'react';
import { useAuth } from '@/app/auth.js';
import { useMoradores } from '@/features/morador/hooks/useMorador';
import { useEntityModal } from '@/hooks/useEntityModal';

import { createMorador, validarMorador } from '@/features/morador/services/moradorPOST';
import { updateMorador } from '@/features/morador/services/moradorPUT';
import { reativarMorador } from "@/features/morador/services/moradorPATCH";
import { moradorFields } from '@/components/ui/Modal/FormCad/formConfigs';
import { extractFilterMoradores, filterMoradores } from "@/filters";
import { InjectMoradoresTable } from '@/utils/dataInject';
import { NAV_ITENS_MORADORES } from '@/filters';
import { useBlocoOptions } from "@/features/bloco/hooks/useBlocoOptions";
import { useMoradiaOptions } from "@/features/moradia/hooks/useMoradiaOptions";
import { useUndoableAction } from "@/hooks/useUndoableAction";
import UndoToast from "@/components/ui/UndoToast/UndoToast";


  export default function Moradores() {
      const { user } = useAuth();
      const canManage = user?.role?.includes("ROLE_ADMIN") || user?.role?.includes("ROLE_SINDICO");
      const isPorteiro = user?.role?.includes("ROLE_PORTEIRO") ?? false;


      const [search, setSearch] = useState("");
      const [debouncedSearch, setDebouncedSearch] = useState("");
      const [filters, setFilters] = useState({ selectedUsers: [], startDate: "", endDate: "" });
      const { options: blocoOptions } = useBlocoOptions();
      const { options: moradiaOptions } = useMoradiaOptions();

    const [activeTab, setActiveTab] = useState("Todos");
    const {
        data,
        fetchMoradores,
        fetchMoradoresInativos,
        fetchTodosMoradores,
        removeMoradores,
        isLoading,
        accessDenied,
    } = useMoradores(activeTab, isPorteiro);
      
    const tabConfig = {
        Todos: {
            fetchFunction: fetchTodosMoradores,
        },
        Ativos: {
            fetchFunction: fetchMoradores,
        },
        Inativos: {
            fetchFunction: fetchMoradoresInativos,
            canRemove: false, // Desabilita a exclusão na aba "Inativos"
        },
    };

    const tab = tabConfig[activeTab] ?? tabConfig.Todos;


      const modal = useEntityModal({
          onCreate:  createMorador,
          onUpdate:  (id, formData) => updateMorador(id, formData),
          getId:     (item) => item.idMorador,
          onRefresh: tab.fetchFunction,
          onReactivate: reativarMorador,
        });

    const undoCreate = useUndoableAction({
        delayMs: 4000,
        commit: createMorador,
        onCommitted: tab.fetchFunction,
        onUndo: (dados) => modal.openAddWithDraft(dados),
        onFailed: (dados, error, { unmounted }) => {
            const msg = error?.message || "Não foi possível cadastrar o morador.";
            if (unmounted) {
                alert(`${msg}\nO morador "${dados?.nomeCompleto ?? ""}" NÃO foi cadastrado.`);
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
        validarMorador(dados);
        undoCreate.schedule(dados);
        modal.close();
    };
        


const fieldsComLocalizacao = [
    ...moradorFields,
    {
      name: "idBloco",
      label: "Bloco",
      placeholder: "Selecione o bloco",
      type: "select",
      options: blocoOptions,
    },
    {
      name: "idMoradia",
      label: "Moradia",
      placeholder: "Selecione a moradia",
      type: "select",
      options: moradiaOptions,     
      dependsOn: "idBloco",        
      filterField: "idBloco",      
    },
  ];

    return (    
        <div className={styles.body}>
            <Sidebar />
            <div className={styles.main}>
                <Header
                    titulo="Moradores registrados"
                    search={search}
                    setSearch={setSearch}
                    setDebouncedSearch={setDebouncedSearch}
                    canAdd={canManage}
                    onAddbuttonClick={modal.openAdd}
                    users={extractFilterMoradores(data)}
                    filters={filters}
                    onFiltersChange={setFilters}
                    navItens={NAV_ITENS_MORADORES}
                    setActiveTab={setActiveTab}
                    activeTab={activeTab}
                />
 
                <CustomTable
                    headerAs="span"
                    rowsPerPage={10}
                    columns={InjectMoradoresTable()}
                    data={filterMoradores(data, activeTab, filters)}
                    searchValue={debouncedSearch}
                    onRowClick={modal.openEdit}
                    onDeleteConfirm={removeMoradores}
                    canRemove={tab.canRemove ?? canManage}
                    isLoading={isLoading}
                    notice={
                        undoCreate.status !== "idle" ? (
                            <UndoToast
                                status={undoCreate.status}
                                token={undoCreate.token}
                                delayMs={undoCreate.delayMs}
                                paused={undoCreate.paused}
                                messagePending="Morador será cadastrado em instantes"
                                messageCommitting="Cadastrando morador…"
                                messageSuccess="Morador cadastrado com sucesso"
                                onUndo={undoCreate.undo}
                                onPause={undoCreate.pause}
                                onResume={undoCreate.resume}
                            />
                        ) : null
                    }
                    emptyMessage={
                        accessDenied
                            ? "Você não tem permissão para acessar esses dados"
                            : undefined
                    }
                />
            </div>
 

                <CadastroModal
                    show={modal.open}
                    onHide={modal.close}
                    title={modal.tipo === "edit" ? "Editar Morador" : "Adicionar Morador"}
                    fields={fieldsComLocalizacao}
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
 