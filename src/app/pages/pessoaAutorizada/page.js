"use client";

import { useMemo, useState } from "react";
import styles from "./page.module.css";
import Sidebar from "@/components/ui/Sidebar/Sidebar";
import Header from "@/components/ui/Header/Header";
import CadastroModal from "@/components/ui/Modal/FormCad/CadastroModal";
import { pessoaAutorizadaFields } from "@/components/ui/Modal/FormCad/formConfigs";
import { useAuth } from "@/app/auth";
import { usePessoasAutorizadas } from "@/features/pessoasAutorizadas/hooks/usePessoasAutorizadas";
import {
  createPessoaAutorizada,
  validarPessoaAutorizada,
} from "@/features/pessoasAutorizadas/services/pessoasAutorizadasPOST";
import { useEntityModal } from "@/hooks/useEntityModal";
import { useUndoableAction } from "@/hooks/useUndoableAction";
import UndoToast from "@/components/ui/UndoToast/UndoToast";
import { FaUserShield } from "react-icons/fa";

const NAV_ITENS = [
  { texto: "Todos" },
  { texto: "Ativos" },
  { texto: "Inativos" },
];

function getMoradorId(user, profile) {
  return (
    profile?.idMorador ??
    profile?.moradorIdMorador ??
    profile?.morador?.idMorador ??
    user?.idMorador ??
    user?.moradorIdMorador ??
    user?.morador?.idMorador ??
    null
  );
}

function normalizeText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export default function PessoasAutorizadas() {
  const { user, profile, loading: authLoading } = useAuth();
  const moradorId = getMoradorId(user, profile);
  const { data, isLoading, error, fetchPessoasAutorizadas } =
    usePessoasAutorizadas(moradorId);
  const modal = useEntityModal({
    onCreate: (dados) =>
      createPessoaAutorizada({ ...dados, moradorIdMorador: moradorId }),
    onRefresh: fetchPessoasAutorizadas,
  });
  const undoCreate = useUndoableAction({
    delayMs: 6000,
    commit: (dados) =>
      createPessoaAutorizada({ ...dados, moradorIdMorador: moradorId }),
    onCommitted: fetchPessoasAutorizadas,
    onUndo: (dados) => modal.openAddWithDraft(dados),
    onFailed: (dados, submitError, { unmounted }) => {
      const message =
        submitError?.message || "Não foi possível cadastrar a pessoa autorizada.";
      if (unmounted) {
        alert(`${message}\n"${dados?.nome ?? ""}" NÃO foi cadastrada.`);
        return;
      }
      modal.openAddWithDraft(dados, message);
    },
  });

  const [activeTab, setActiveTab] = useState("Todos");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const filteredPeople = useMemo(() => {
    const query = normalizeText(debouncedSearch);

    return data.filter((person) => {
      const active =
        person.ativo !== false &&
        person.ativo !== 0 &&
        person.ativo !== "false";
      const matchesTab =
        activeTab === "Todos" ||
        (activeTab === "Ativos" && active) ||
        (activeTab === "Inativos" && !active);
      const matchesSearch =
        !query ||
        normalizeText(person.nome).includes(query) ||
        String(person.cpf ?? "").includes(query);

      return matchesTab && matchesSearch;
    });
  }, [data, activeTab, debouncedSearch]);

  const handleCreate = (dados) => {
    const payload = { ...dados, moradorIdMorador: moradorId };
    validarPessoaAutorizada(payload);
    undoCreate.schedule(payload);
    modal.close();
  };

  return (
    <div className={styles.body}>
      <Sidebar />
      <main className={styles.main}>
        <Header
          titulo="Pessoas autorizadas"
          navItens={NAV_ITENS}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          search={search}
          setSearch={setSearch}
          setDebouncedSearch={setDebouncedSearch}
          canAdd={user?.role?.includes("ROLE_MORADOR") ?? false}
          onAddbuttonClick={modal.openAdd}
        />

        {undoCreate.status !== "idle" && (
          <UndoToast
            status={undoCreate.status}
            token={undoCreate.token}
            delayMs={undoCreate.delayMs}
            paused={undoCreate.paused}
            messagePending="Pessoa autorizada será cadastrada em instantes"
            messageCommitting="Cadastrando pessoa autorizada…"
            messageSuccess="Pessoa autorizada cadastrada com sucesso"
            onUndo={undoCreate.undo}
            onPause={undoCreate.pause}
            onResume={undoCreate.resume}
          />
        )}

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        {authLoading || isLoading ? (
          <p className={styles.message}>Carregando pessoas autorizadas...</p>
        ) : !moradorId ? (
          <p className={styles.message} role="alert">
            Não foi possível identificar o morador logado.
          </p>
        ) : filteredPeople.length === 0 ? (
          <div className={styles.emptyState}>
            <FaUserShield size={76} aria-hidden="true" />
            <p>
              {data.length === 0
                ? "Nenhuma pessoa autorizada cadastrada."
                : "Nenhuma pessoa autorizada encontrada."}
            </p>
          </div>
        ) : (
          <div className={styles.cardWrapper}>
            {filteredPeople.map((person) => (
              <article
                className={styles.personCard}
                key={person.idPessoaAutorizada ?? person.id}
              >
                <div className={styles.cardIcon}>
                  <FaUserShield size={28} aria-hidden="true" />
                </div>
                <div className={styles.cardInfo}>
                  <h2>{person.nome}</h2>
                  <p>CPF: {person.cpf || "—"}</p>
                </div>
                <span
                  className={
                    person.ativo === false ||
                    person.ativo === 0 ||
                    person.ativo === "false"
                      ? styles.inactive
                      : styles.active
                  }
                >
                  {person.ativo === false ||
                  person.ativo === 0 ||
                  person.ativo === "false"
                    ? "Inativa"
                    : "Ativa"}
                </span>
              </article>
            ))}
          </div>
        )}
      </main>

      <CadastroModal
        key={modal.itemData?.draft ? `draft-${undoCreate.token}` : "novo"}
        show={modal.open}
        onHide={modal.close}
        title="Adicionar pessoa autorizada"
        fields={pessoaAutorizadaFields}
        initialData={modal.itemData?.draft ?? {}}
        initialError={modal.itemData?.erro}
        showPhoto={false}
        onSaveChanges={handleCreate}
        submitLabel="Cadastrar"
      />
    </div>
  );
}
