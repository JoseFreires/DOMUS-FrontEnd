"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Form from "react-bootstrap/Form";
import { FiImage, FiX } from "react-icons/fi";

import Input from "@/components/ui/Input/Input";
import Dropdown from "@/components/ui/Dropdown/Dropdown";
import Button from "@/components/ui/Button/Button";
import Title from "@/components/ui/Title/Title";
import styles from "./ChamadoForm.module.css";

import { formatDateTime } from "@/utils/formatar";

const TIPOS_CHAMADO = [
  { value: "RECLAMACAO", label: "Reclamação" },
  { value: "DUVIDAS", label: "Dúvidas" },
  { value: "SUGESTAO", label: "Sugestão" },
  { value: "INCIDENTE", label: "Incidente" },
  { value: "OUTROS", label: "Outros" },
];

// texto do status na mensagem exibida ao morador (enum StatusChamado do back)
const STATUS_TEXTO = {
  ABERTO: "aberto",
  TRATANDO: "tratando",
  CONCLUIDO: "concluído",
  CANCELADO: "cancelado",
};

// limites iguais aos do back-end
const MAX_TITULO = 45;
const MAX_DESCRICAO = 300;
const MAX_RESOLUCAO = 1000;

/**
 * Modal de chamado — um componente, três modos (igual ao AvisoForm):
 *
 *  modo="add"     → morador registra um chamado (POST).
 *  modo="morador" → morador abre o próprio chamado (PUT).
 *                   ABERTO: campos editáveis + botão "Atualizar chamado".
 *                   Outros status: somente leitura + mensagem no lugar do botão.
 *  modo="sindico" → síndico acompanha o chamado (PATCH de status).
 *                   ABERTO → "Tratar"; TRATANDO → "Concluir".
 *                   Ao clicar em "Concluir" aparece o campo "Atualização"; o
 *                   segundo clique envia o texto e conclui o chamado.
 *
 * Campos do back: titulo, descricaoInicial, tipoChamado, statusChamado,
 * imagem, resolucaoChamado, dataHoraAbertura, nomeMorador.
 */
export default function ChamadoForm({
  modo = "add",
  chamadoData,
  onClose,
  onSaveChanges,
}) {
  const isAdd = modo === "add";
  const isMorador = modo === "morador";
  const isSindico = modo === "sindico";

  const {
    idChamado,
    titulo: tituloAtual,
    descricaoInicial: descricaoAtual,
    tipoChamado: tipoAtual,
    statusChamado,
    imagem,
    resolucaoChamado,
    dataHoraAbertura,
    nomeMorador,
  } = chamadoData ?? {};

  // campos editáveis: add, ou morador enquanto o chamado está ABERTO
  const editavel = isAdd || (isMorador && statusChamado === "ABERTO");

  // no modo morador os campos já nascem preenchidos com o chamado
  const [titulo, setTitulo] = useState(tituloAtual ?? "");
  const [descricao, setDescricao] = useState(descricaoAtual ?? "");
  const [tipoChamado, setTipoChamado] = useState(
    tipoAtual ?? TIPOS_CHAMADO[0].value,
  );
  const [foto, setFoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(imagem ?? null);

  // ── síndico ──
  const [concluindo, setConcluindo] = useState(false);
  const [resolucao, setResolucao] = useState("");

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const resolucaoRef = useRef(null);

  const podeTratar = isSindico && statusChamado === "ABERTO";
  const podeConcluir = isSindico && statusChamado === "TRATANDO";
  const temAcoes = podeTratar || podeConcluir;

  // morador: só habilita "Atualizar" quando algo mudou
  const alterado =
    isAdd ||
    titulo.trim() !== (tituloAtual ?? "") ||
    descricao.trim() !== (descricaoAtual ?? "") ||
    tipoChamado !== tipoAtual ||
    foto !== null;

  // libera a URL temporária da foto escolhida quando ela muda ou o modal fecha
  useEffect(() => {
    return () => {
      if (photoPreview?.startsWith("blob:")) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  // leva o foco para o campo de atualização assim que ele aparece
  useEffect(() => {
    if (concluindo) resolucaoRef.current?.focus();
  }, [concluindo]);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoPreview(URL.createObjectURL(file));
    setFoto(file);
  };

  const enviar = async (payload) => {
    setErro("");
    setLoading(true);
    try {
      await onSaveChanges?.(payload);
    } catch (err) {
      setErro(err?.message || "Erro ao salvar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // ── add / morador: registrar ou atualizar ──
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!titulo.trim() || !descricao.trim() || !tipoChamado) {
      setErro("Preencha assunto, tipo e descrição.");
      return;
    }

    enviar({
      titulo: titulo.trim(),
      descricaoInicial: descricao.trim(),
      tipoChamado,
      foto,
    });
  };

  // ── síndico: tratar / concluir ──
  const handleTratar = () => enviar({ statusChamado: "TRATANDO" });

  const handleConcluir = () => {
    // 1º clique: só exibe o campo de atualização final
    if (!concluindo) {
      setConcluindo(true);
      return;
    }

    // 2º clique: valida e conclui
    if (!resolucao.trim()) {
      setErro("Informe a atualização final para concluir o chamado.");
      resolucaoRef.current?.focus();
      return;
    }
    enviar({ statusChamado: "CONCLUIDO", resolucaoChamado: resolucao.trim() });
  };

  const tipoLabel =
    TIPOS_CHAMADO.find((t) => t.value === tipoAtual)?.label ?? tipoAtual ?? "";

  const mensagemStatus =
    statusChamado === "CANCELADO"
      ? "Chamado cancelado. Abra outro chamado caso precise."
      : `Chamado ${STATUS_TEXTO[statusChamado] ?? statusChamado?.toLowerCase()}, aguarde atualizações ou abra outro chamado caso o problema não tenha sido resolvido.`;

  return (
    <div className={styles.wrapper}>
      {onClose && (
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label="Fechar"
        >
          <FiX size={16} aria-hidden="true" />
        </button>
      )}

      {/* ── Cabeçalho fixo ── */}
      <div className={styles.header}>
        {isAdd ? (
          <Title Text="Registrar Chamado" />
        ) : (
          <>
            <Title
              Text={
                <>
                  Acompanhar Chamado
                  <span className={styles.idChamado}>(id {idChamado})</span>
                </>
              }
            />
            <p className={styles.aberto}>
              Aberto em: {formatDateTime(dataHoraAbertura) || "—"}
            </p>
            {isSindico && (
              <p className={styles.morador}>
                Morador: <strong>{nomeMorador ?? "—"}</strong>
              </p>
            )}
          </>
        )}
      </div>

      {editavel ? (
        /* ── add / morador com chamado ABERTO ── */
        <Form onSubmit={handleSubmit} noValidate className={styles.formAdd}>
          {/* ── Área rolável ── */}
          <div className={styles.scrollArea}>
            <div className={styles.fields}>
              <Input
                type="text"
                name="chamado-novo-assunto"
                Label="Assunto"
                placeholder=" "
                value={titulo}
                maxLength={MAX_TITULO}
                onChange={(e) => setTitulo(e.target.value)}
                inputClassName={styles.inputAtivo}
                fieldClassName={styles.projectInput}
                disabled={loading}
              />

              <div>
                <Dropdown
                  name="tipoChamado"
                  Label="Tipo"
                  options={TIPOS_CHAMADO}
                  value={tipoChamado}
                  onChange={(e) => setTipoChamado(e.target.value)}
                  isDisabled={loading}
                  inputClassName={styles.projectDropdown}
                />
              </div>

              <Input
                multiline
                rows={4}
                name="chamado-novo-descricao"
                Label="Descrição"
                placeholder=" "
                value={descricao}
                maxLength={MAX_DESCRICAO}
                onChange={(e) => setDescricao(e.target.value)}
                inputClassName={`${styles.inputAtivo} ${styles.textarea}`}
                fieldClassName={styles.projectInput}
                disabled={loading}
              />

              <div>
                <span className={styles.labelAtivo}>Anexar foto (opcional)</span>
                <label
                  htmlFor="chamado-foto"
                  className={styles.photo}
                  aria-label="Escolher foto do chamado"
                >
                  {photoPreview ? (
                    <Image
                      src={photoPreview}
                      alt="Imagem do chamado"
                      fill
                      sizes="(max-width: 576px) 90vw, 420px"
                      unoptimized
                      className={styles.photoImg}
                    />
                  ) : (
                    <FiImage size={48} strokeWidth={1.5} aria-hidden="true" />
                  )}
                </label>
                <input
                  id="chamado-foto"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  hidden
                />
              </div>
            </div>
          </div>

          {/* ── Rodapé fixo ── */}
          <div className={styles.footer}>
            <hr className={styles.divider} />
            {erro && (
              <p className={styles.error} role="alert">
                {erro}
              </p>
            )}
            <Button
              type="submit"
              variant="primary"
              className={`w-100 ${styles.action}`}
              disabled={loading || !alterado}
            >
              {isAdd
                ? loading
                  ? "Registrando..."
                  : "Registrar chamado"
                : loading
                  ? "Atualizando..."
                  : "Atualizar chamado"}
            </Button>
          </div>
        </Form>
      ) : (
        <>
          {/* ── somente leitura (síndico, ou morador fora do status ABERTO) ── */}
          <div className={styles.scrollArea}>
            <Form className={styles.fields} onSubmit={(e) => e.preventDefault()}>
              <Input
                type="text"
                name="chamado-assunto"
                Label="Assunto"
                placeholder=" "
                value={tituloAtual ?? ""}
                inputClassName={styles.control}
                fieldClassName={styles.projectInput}
                disabled
                readOnly
              />
              <Input
                type="text"
                name="chamado-tipo"
                Label="Tipo"
                placeholder=" "
                value={tipoLabel}
                inputClassName={styles.control}
                fieldClassName={styles.projectInput}
                disabled
                readOnly
              />
              <Input
                multiline
                rows={4}
                name="chamado-descricao"
                Label="Descrição"
                placeholder=" "
                value={descricaoAtual ?? ""}
                inputClassName={`${styles.control} ${styles.textarea}`}
                fieldClassName={styles.projectInput}
                disabled
                readOnly
              />
              {statusChamado === "CONCLUIDO" && resolucaoChamado && (
                <Input
                  multiline
                  rows={4}
                  name="chamado-resolucao"
                  Label="Atualização final"
                  placeholder=" "
                  value={resolucaoChamado}
                  inputClassName={`${styles.control} ${styles.textarea}`}
                  fieldClassName={styles.projectInput}
                  disabled
                  readOnly
                />
              )}
            </Form>
          </div>

          {/* ── Rodapé: mensagem (morador) ou ações (síndico) ── */}
          {isMorador && (
            <div className={styles.footer}>
              <hr className={styles.divider} />
              <p className={styles.statusMessage} role="status">
                {mensagemStatus}
              </p>
            </div>
          )}

          {isSindico && (temAcoes || erro) && (
            <div className={styles.footer}>
              <hr className={styles.divider} />

              {concluindo && (
                <Input
                  multiline
                  rows={4}
                  name="chamado-atualizacao"
                  Label="Atualização"
                  placeholder=" "
                  inputRef={resolucaoRef}
                  value={resolucao}
                  maxLength={MAX_RESOLUCAO}
                  onChange={(e) => setResolucao(e.target.value)}
                  inputClassName={`${styles.updateInput} ${styles.textarea}`}
                  fieldClassName={`${styles.projectInput} ${styles.update}`}
                  disabled={loading}
                />
              )}

              {erro && (
                <p className={styles.error} role="alert">
                  {erro}
                </p>
              )}

              {podeTratar && (
                <Button
                  variant="primary"
                  className={`w-100 ${styles.action}`}
                  onClick={handleTratar}
                  disabled={loading}
                >
                  {loading ? "Salvando..." : "Tratar"}
                </Button>
              )}

              {podeConcluir && (
                <Button
                  variant="secondary"
                  className={`w-100 ${styles.action}`}
                  onClick={handleConcluir}
                  disabled={loading}
                >
                  {loading && concluindo ? "Concluindo..." : "Concluir"}
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}