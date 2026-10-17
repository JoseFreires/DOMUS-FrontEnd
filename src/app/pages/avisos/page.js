"use client";

import { useMemo, useState } from "react";
import Sidebar from "@/components/ui/Sidebar/Sidebar";
import Header from "@/components/ui/Header/Header";
import styles from "./page.module.css";
import ModalForm from "@/components/ui/Modal/ModalForm/ModalForm";
import AvisoForm from "@/components/ui/Modal/ModalAviso/AvisoForm";

//import configuração da tabela
import {
  extractFilterAvisos,
  extractFilterTiposAviso,
  filterAvisos,
  NAV_ITENS_AVISOS,
} from "@/filters";

import CustomTable from "@/components/ui/Table/Table";

//import hooks
import { useAvisos } from "@/features/aviso/hooks/useAvisos.js";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useAuth } from "@/app/auth.js";
import { useEntityModal } from "@/hooks/useEntityModal";

//import aviso componentes
import AvisoListItem from "@/features/aviso/components/AvisoListItem/AvisoListItem";
import AvisoIcon from "@/features/aviso/components/AvisoIcon/AvisoIcon";
import AvisoCard from "@/features/aviso/components/AvisoCard/AvisoCard";
import { createAvisos } from "@/features/aviso/services/avisosPOST";
import { updateAvisos } from "@/features/aviso/services/avisosPUT";
import { InjectAvisosTable } from "@/utils/dataInject";
import { filterRows } from "@/utils/tableUtils";
import { formatDateTime } from "@/utils/formatar";

//campos de busca por moradores
const SEARCH_KEYS = ["titulo", "nomeSindico", "descricao"];

export default function Avisos() {
  const { user } = useAuth();
  const canManage =
    user?.role.includes("ROLE_SINDICO") || user?.role.includes("ROLE_ADMIN");

  const { data: avisos, fetchAvisos, removeAvisos, isLoading } = useAvisos();

  const isDesktop = useMediaQuery("(min-width: 993px)");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filters, setFilters] = useState({
    selectedUsers: [],
    selectedTypes: [],
    startDate: "",
    endDate: "",
  });
  const [activeTab, setActiveTab] = useState("Ativos");
  const [selectedId, setSelectedId] = useState(null);

  const filtrados = useMemo(
    () => filterAvisos(avisos, activeTab, filters),
    [avisos, activeTab, filters],
  );

  const visiveis = useMemo(
    () => filterRows(filtrados, SEARCH_KEYS, debouncedSearch),
    [filtrados, debouncedSearch],
  );

  const selecionado =
    visiveis.find((a) => a.idAviso === selectedId) ?? visiveis[0] ?? null;

  // Header só vai exibir os filtros que só vão ser enviados se for admin ou sindico
  const managerHeaderProps = canManage
    ? {
        filters,
        onFiltersChange: setFilters,
        users: extractFilterAvisos(avisos),
        filterUserLabel: "Selecionar criador",
        filterTypes: extractFilterTiposAviso(avisos),
        navItens: NAV_ITENS_AVISOS,
        activeTab,
        setActiveTab,
      }
    : {};

  const modal = useEntityModal({
    onCreate: createAvisos,
    onUpdate: (id, formData) => updateAvisos(id, formData),
    getId: (item) => item.idAviso,
    onRefresh: fetchAvisos,
  });

  return (
    <div className={`container-fluid ${styles.body}`}>
      <Sidebar />
      <div className={styles.main}>
        <Header
          titulo="Avisos Condominiais"
          search={search}
          setSearch={setSearch}
          setDebouncedSearch={setDebouncedSearch}
          canAdd={canManage}
          onAddbuttonClick={modal.openAdd}
          {...managerHeaderProps}
        />
        {canManage ? (
          <CustomTable
            headerAs="span"
            rowsPerPage={10}
            columns={InjectAvisosTable()}
            data={filtrados}
            searchValue={debouncedSearch}
            canRemove={canManage}
            isLoading={isLoading}
            onRowClick={modal.openEdit}
            onDeleteConfirm={removeAvisos}
          />
        ) : isDesktop /* ── Leitura (desktop): lista à esquerda, prévia à direita ── */ ? (
          // <div className={`row g-4 ${styles.listConteiner}`}>
          //     <div className={`col-md-3 ${styles.listColNarrow}`}>
          <div className={styles.split}>
            <div className={styles.listCol}>
              <CustomTable
                variant="list"
                data={visiveis}
                isLoading={isLoading}
                rowKey="id"
                pageSize={10}
                pageSizeOptions={[5, 10, 20]}
                activeRowKey={selecionado?.id}
                onRowClick={(aviso) => setSelectedId(aviso.idAviso)}
                emptyMessage="Nenhum aviso encontrado."
                renderItem={(aviso) => (
                  <AvisoListItem
                    icon={<AvisoIcon tipo={aviso.tipoAviso} />}
                    titulo={aviso.titulo}
                    nomeSindico={aviso.nomeSindico}
                    data={formatDateTime(aviso.dataHoraAviso)}
                    // unread={!aviso.lido}
                  />
                )}
              />
            </div>

            <div className={styles.previewCol} aria-live="polite">
              {selecionado ? (
                // key: ao trocar de aviso o card remonta (volta ao topo e reseta a imagem)
                <AvisoCard
                  key={selecionado.id}
                  {...selecionado}
                  variant="panel"
                />
              ) : (
                <p className={styles.empty}>Nenhum aviso para exibir.</p>
              )}
            </div>
          </div>
        ) : (
          /* ── Leitura (mobile): sem tabela, só os cards ── */
          <div className={styles.feed}>
            {isLoading ? (
              <p className={styles.empty}>Carregando avisos...</p>
            ) : visiveis.length === 0 ? (
              <p className={styles.empty}>Nenhum aviso encontrado.</p>
            ) : (
              visiveis.map((aviso) => <AvisoCard key={aviso.id} {...aviso} />)
            )}
          </div>
        )}
      </div>

      <ModalForm show={modal.open} onHide={modal.close} centered>
        {(modal.tipo === "add" ||
          (modal.tipo === "edit" && modal.itemData)) && (
          <AvisoForm
            key={modal.itemData?.idAviso ?? "add"}
            modo={modal.tipo}
            avisoData={modal.itemData}
            onSaveChanges={modal.save}
            onClose={modal.close}
          />
        )}
      </ModalForm>
    </div>
  );
}
