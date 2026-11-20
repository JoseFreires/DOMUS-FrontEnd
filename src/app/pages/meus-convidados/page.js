"use client";

import { useMemo, useState } from "react";

import styles from "./page.module.css";

import Sidebar from "@/components/ui/Sidebar/Sidebar";
import Header from "@/components/ui/Header/Header";

import { useAuth } from "@/app/auth.js";
import { inativarConvidado, ativarConvidado } from "@/features/convidados/services/convidadoPATCH.js";
import { NAV_ITENS_CONVIDADOS } from "@/filters";

import CardConvidado, { isConvidadoInativo } from "@/features/convidados/components/CardConvidado/card";
import CadastroModal from "@/components/ui/Modal/FormCad/CadastroModal";


import { createConvidado } from "@/features/convidados/services/convidadoPOST.js";
import { updateConvidado } from "@/features/convidados/services/convidadoPUT.js";
import { useConvidado } from "@/features/convidados/hooks/useConvidado.js";

import { convidadoFields } from "@/components/ui/Modal/FormCad/formConfigs";
import { useEntityModal } from "@/hooks/useEntityModal";

const FILTROS_ABA = {
    Ativos: (item) => item.ativo !== false && item.ativo !== 0,
    Inativos: (item) => item.ativo === false || item.ativo === 0,
};

// Busca por nome, e-mail, CPF e telefone (só dígitos para CPF/telefone)
const buscaConvidado = (item, termo) => {
    const t = termo.toLowerCase();
    const digitos = termo.replace(/\D/g, "");
    return (
        String(item.nome ?? "").toLowerCase().includes(t) ||
        String(item.email ?? "").toLowerCase().includes(t) ||
        (digitos &&
            (String(item.cpf ?? "").replace(/\D/g, "").includes(digitos) ||
                String(item.telefone ?? "").replace(/\D/g, "").includes(digitos)))
    );
};

const refrescar = async () => {
    try { await fetchConvidados(); } catch (e) { console.error(e); }
};

export default function MeusConvidados() {
    const { user } = useAuth();
    const canManage = user?.role?.includes("ROLE_MORADOR");

    const [activeTab, setActiveTab] = useState("Ativos");
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    // Uma única fonte de dados: o hook (com polling)
    const { data, fetchConvidados, isLoading } = useConvidado();

    const modal = useEntityModal({
        onCreate: createConvidado,
        onUpdate: (id, formData) => updateConvidado(id, formData),
        getId: (item) => item.idConvidado,
        onRefresh: fetchConvidados,
    });

    const convidadosFiltrados = useMemo(() => {
        const termo = debouncedSearch.trim();
        return (data ?? [])
            .filter(FILTROS_ABA[activeTab] ?? FILTROS_ABA.Ativos)
            .filter((item) => !termo || buscaConvidado(item, termo));
    }, [data, activeTab, debouncedSearch]);

    const carregando = isLoading;
    const falhou = data === null && !isLoading;

    const [idAlterando, setIdAlterando] = useState(null);
    const [erroStatus, setErroStatus] = useState("");

    const handleToggleStatus = async (convidado) => {
        if (idAlterando !== null) return;

        const inativo = isConvidadoInativo(convidado);
        const acao = inativo ? "ativar" : "inativar";
        if (!window.confirm(`Tem certeza que deseja ${acao} o convidado ${convidado.nome ?? ""}?`)) return;

        setIdAlterando(convidado.idConvidado);
        setErroStatus("");
        try {
            await (inativo ? ativarConvidado : inativarConvidado)(convidado.idConvidado);
        } catch (err) {
            console.error(err);
            setErroStatus(
                err?.name === "ApiError" ? err.message : `Não foi possível ${acao} o convidado. Tente novamente.`
            );
            setIdAlterando(null);
            return;
        }

        try { await fetchConvidados(); } catch (e) { console.error(e); }
        setIdAlterando(null);
    };

    return (
        <div className={styles.body}>
            <Sidebar />

            <div className={styles.main}>
                <Header
                    titulo="Meus Convidados"
                    navItens={NAV_ITENS_CONVIDADOS}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    search={search}
                    setSearch={setSearch}
                    setDebouncedSearch={setDebouncedSearch}
                    canAdd={canManage}
                    onAddbuttonClick={modal.openAdd}
                />

                <div className={styles.content}>
                    <div className={styles.containerConvidados}>
                        {carregando ? (
                            <p>Carregando convidados...</p>
                        ) : convidadosFiltrados.length > 0 ? (
                            <div className={styles.containerCardsConvidados}>
                                {convidadosFiltrados.map((item) => (


                                    <CardConvidado
                                        key={item.idConvidado}
                                        convidadoData={item}
                                        onButtonOpenModal={modal.openEdit}
                                        onToggleStatus={canManage ? handleToggleStatus : undefined}
                                        changingStatus={idAlterando === item.idConvidado}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className={styles.containerSemCardsEspacosDisponiveis}>
                                <p>
                                    {debouncedSearch
                                        ? "Nenhum convidado corresponde à pesquisa."
                                        : activeTab === "Inativos"
                                            ? "Nenhum convidado inativo."
                                            : "Nenhum convidado cadastrado."}
                                </p>
                            </div>
                        )}
                    </div>

                    <CadastroModal
                        show={modal.open}
                        onHide={modal.close}
                        title={modal.tipo === "edit" ? "Editar Convidado" : "Adicionar Convidado"}
                        initialData={modal.itemData ?? {}}
                        onSaveChanges={modal.save}
                        showPhoto={true}
                        usaFoto={false}
                        fields={convidadoFields}
                        submitLabel={modal.tipo === "edit" ? "Salvar Alterações" : "Cadastrar"}
                    />
                </div>
            </div>
        </div>
    );
}