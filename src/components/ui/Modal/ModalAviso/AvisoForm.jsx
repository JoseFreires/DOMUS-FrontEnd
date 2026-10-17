"use client";
 
import { useEffect,  useRef, useState } from "react";
import Image from "next/image";
import Form from "react-bootstrap/Form";
import { FiImage, FiX } from "react-icons/fi";

import Input from "@/components/ui/Input/Input";
import Dropdown from "@/components/ui/Dropdown/Dropdown";
import Button from "@/components/ui/Button/Button";
import Title from "@/components/ui/Title/Title";
import styles from "./AvisoForm.module.css";

import { formatDateTime } from "@/utils/formatar";
const TIPOS_AVISO = [
  { value: "AVISO", label: "Aviso" },
  { value: "MANUTENCAO", label: "Manutenção"},
  { value: "EVENTO", label: "Evento" },
  { value: "NOVIDADE", label: "Novidade" },
];


function splitDate(value) {
  const [ano = "", mes = "", dia = ""] = String(value ?? "")
    .slice(0, 10)
    .split("-");
  return { dia, mes, ano };
}
 
// DD / MM / AAAA -> "AAAA-MM-DD", ou null se a data não existir
function joinDate({ dia, mes, ano }) {
  if (dia.length !== 2 || mes.length !== 2 || ano.length !== 4) return null;
  const d = Number(dia);
  const m = Number(mes);
  const y = Number(ano);
  const date = new Date(y, m - 1, d);
  const valid =
    date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
  return valid ? `${ano}-${mes}-${dia}` : null;
}

const onlyDigits = (value, max) => value.replace(/\D/g, "").slice(0, max);

export default function AvisoForm({ modo = "add", avisoData, onClose, onSaveChanges }) {


  const isEdit = modo === "edit";
  const title = isEdit ? "Alterar aviso" : "Criar avisos";
 
  const [titulo, setTitulo] = useState(avisoData?.titulo ?? "");
  const [descricao, setDescricao] = useState(avisoData?.descricao ?? "");
  const [tipoAviso, setTipoAviso] = useState(
    avisoData?.tipoAviso ?? TIPOS_AVISO[0].value,
  );
  const [data, setData] = useState(splitDate(avisoData?.dataValidadeAviso));
  const [prioridade, setPrioridade] = useState(Boolean(avisoData?.prioridade));
  const [foto, setFoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(avisoData?.fotoAviso ?? null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  
  const mesRef = useRef(null);
  const anoRef = useRef(null);
  // libera a URL temporária da foto escolhida quando ela muda ou o modal fecha
  useEffect(() => {
    return () => {
      if (photoPreview?.startsWith("blob:")) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);
 
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoPreview(URL.createObjectURL(file));
    setFoto(file);
  };

    // digita só números e pula para o próximo campo quando o atual enche
  const handleDate = (campo, max, nextRef) => (e) => {
    const valor = onlyDigits(e.target.value, max);
    setData((prev) => ({ ...prev, [campo]: valor }));
    if (valor.length === max) nextRef?.current?.focus();
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
 
    if (!titulo.trim() || !descricao.trim() || !tipoAviso) {
      setErro("Preencha título, descrição e tipo de aviso.");
      return;
    }
 
    const dataValidadeAviso = joinDate(data);
    if (!dataValidadeAviso) {
      setErro("Informe uma data de validade válida (DD/MM/AAAA).");
      return;
    }
 
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const [y, m, d] = dataValidadeAviso.split("-").map(Number);
    if (new Date(y, m - 1, d) < hoje) {
      setErro("A data de validade não pode estar no passado.");
      return;
    }
 
    setLoading(true);
    try {
      await onSaveChanges?.({
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        tipoAviso,
        prioridade,
        foto: foto,
        dataValidadeAviso,
        
      });
    } catch (err) {
      setErro(err?.message || "Erro ao salvar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <Form onSubmit={handleSubmit} className={styles.wrapper} noValidate>
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
        <Title Text={title} />
        {isEdit && (
                <div>
                    <p>Criado em {formatDateTime(avisoData?.dataHoraAviso)} por {avisoData?.nomeSindico} </p>
                </div>
            )}
      </div>
 
      {/* ── Área rolável ── */}
      <div className={styles.scrollArea}>
        <div className={styles.fields}>
          <Input
            type="text"
            name="aviso-titulo"
            Label="Título"
            placeholder=" "
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />

          <Input
            multiline
            rows={4}
            name="aviso-descricao"
            Label="Descrição"
            placeholder=" "
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />

          {/* <Input
            type="date"
            name="aviso-validade"
            Label="Data de validade"
            placeholder=" "
            value={dataValidadeAviso}
            onChange={(e) => setDataValidadeAviso(e.target.value)}
          /> */}

        <div className={styles.field}>
            <span id="aviso-validade-label" className={styles.label}>
              Data de validade
            </span>
            <div
              className={styles.dateRow}
              role="group"
              aria-labelledby="aviso-validade-label"
            >
              <input
                type="text"
                inputMode="numeric"
                placeholder="DD"
                aria-label="Dia"
                className={`${styles.dateBox} ${styles.dateShort}`}
                value={data.dia}
                onChange={handleDate("dia", 2, mesRef)}
              />
              <input
                ref={mesRef}
                type="text"
                inputMode="numeric"
                placeholder="MM"
                aria-label="Mês"
                className={`${styles.dateBox} ${styles.dateShort}`}
                value={data.mes}
                onChange={handleDate("mes", 2, anoRef)}
              />
              <input
                ref={anoRef}
                type="text"
                inputMode="numeric"
                placeholder="YYYY"
                aria-label="Ano"
                className={`${styles.dateBox} ${styles.dateLong}`}
                value={data.ano}
                onChange={handleDate("ano", 4)}
              />
            </div>
          </div>
 
          <Dropdown
            name="tipoAviso"
            Label="Tipo de aviso"
            options={TIPOS_AVISO}
            value={tipoAviso}
            onChange={(e) => setTipoAviso(e.target.value)}
          />
 
          <div className={styles.switchRow}>
            <label htmlFor="aviso-prioridade" className={styles.switchLabel}>
              Prioridade
            </label>
            <Form.Check
              type="switch"
              id="aviso-prioridade"
              checked={prioridade}
              onChange={(e) => setPrioridade(e.target.checked)}
              className={styles.switch}
            />
          </div>
 
          <div>
            <label htmlFor="aviso-prioridade" className={styles.switchLabel}>
              Anexar foto do aviso
            </label>
            <label
              htmlFor="foto"
              className={styles.photo}
              aria-label="Escolher foto do aviso"
            >
              {photoPreview ? (
                <Image
                  src={photoPreview}
                  alt="Imagem do aviso"
                  fill
                  sizes="(max-width: 576px) 90vw, 420px"
                  unoptimized
                  className={styles.photoImg}
                />
              ) : (
                <FiImage size={64} strokeWidth={1.5} aria-hidden="true" />
              )}
            </label>
            <input
              id="foto"
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
        {erro && (
          <p className={styles.error} role="alert">
            {erro}
          </p>
        )}
        <hr className={styles.divider} />
        <Button
          type="submit"
          variant="primary"
          className={`w-100 ${styles.submit}`}
          disabled={loading}
        >
          {loading ? "Salvando..." : isEdit ? "Salvar alterações" : "Criar aviso"}
        </Button>
      </div>
    </Form>
  );
}