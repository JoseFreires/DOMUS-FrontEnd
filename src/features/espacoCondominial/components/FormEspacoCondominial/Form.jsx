"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Form from "react-bootstrap/Form";
import { CiImageOff } from "react-icons/ci";

import Input from "@/components/ui/Input/Input";
import Button from "@/components/ui/Button/Button";
import styles from "./Form.module.css";

const EMPTY = {
  nomeEspaco: "",
  descricao: "",
  capacidadeMaxima: "",
  valorReserva: "",
};

const formatBRL = (value) =>
  value === "" || value == null
    ? ""
    : new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(value));

export default function FormEspacoCondominial({
  modo = "add",
  espacoCondominialData = null,
  onSaveChanges,
  onDelete,
  onClose,
}) {
  const isEdit = modo === "edit";
  const title = isEdit
    ? "Alterar Espaço Condominial"
    : "Adicionar Espaço Condominial";

  console.log(espacoCondominialData)

  const [values, setValues] = useState(EMPTY);
  const [novaFoto, setNovaFoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const busy = saving || deleting;

  // Preenche (edit) ou limpa (add)
  useEffect(() => {
    const data = isEdit ? espacoCondominialData : null;
    setValues({
      nomeEspaco: data?.nomeEspaco ?? "",
      descricao: data?.descricao ?? "",
      capacidadeMaxima: data?.capacidadeMaxima ?? "",
      valorReserva:
        data?.valorReserva != null ? Number(data.valorReserva).toFixed(2) : "",
      restricao : data?.restricao ?? "",
    });
    setPhotoPreview(data?.fotoEspaco ?? null);
    setNovaFoto(null);
    setError("");
  }, [isEdit, espacoCondominialData]);

  // Libera blob anterior
  useEffect(() => {
    return () => {
      if (photoPreview?.startsWith("blob:")) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  const handleChange = (field) => (e) =>
    setValues((prev) => ({ ...prev, [field]: e.target.value }));

  const handleValorChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
    setValues((prev) => ({
      ...prev,
      valorReserva: digits ? (Number(digits) / 100).toFixed(2) : "",
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Selecione um arquivo de imagem.");
      return;
    }
    setError("");
    setNovaFoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!onSaveChanges || busy) return;

    const capacidade = Number(values.capacidadeMaxima);
    const valor = Number(values.valorReserva);

    if (!values.nomeEspaco.trim()) return setError("Informe o nome do espaço.");
    if (!Number.isInteger(capacidade) || capacidade < 1)
      return setError("A capacidade deve ser um número maior que zero.");
    if (!(valor > 0)) return setError("Informe um valor maior que zero.");

    setSaving(true);
    setError("");
    try {
      await onSaveChanges({
        ...(isEdit && {
          idEspacoCondominial: espacoCondominialData?.idEspacoCondominial,
        }),
        nomeEspaco: values.nomeEspaco.trim(),
        descricao: values.descricao.trim(),
        capacidadeMaxima: String(capacidade),
        valorReserva: valor,
        restricao: values.restricao.trim(),
        ...(novaFoto && { fotoEspaco: novaFoto }),
      });
      onClose?.();
    } catch (err) {
      console.error(err);
      setError(err?.message || "Não foi possível salvar. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete || busy) return;

    if (!window.confirm("Tem certeza que deseja excluir este espaço condominial?"))
      return;

    setDeleting(true);
    setError("");
    try {
      await onDelete(espacoCondominialData?.idEspacoCondominial);
      onClose?.();
    } catch (err) {
      console.error(err);
      setError(err?.message || "Não foi possível excluir. Tente novamente.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Form
      onSubmit={handleSubmit}
      className="d-flex flex-column"
      style={{ maxHeight: "90vh" }}
    >
      <div className="px-4 pt-4 pb-3 flex-shrink-0">
        <h1 className="h4 text-primary-custom mb-0">{title}</h1>
      </div>

      <div
        className={`px-4 py-3 flex-grow-1 overflow-auto d-flex flex-column gap-4 ${styles.contentScrollable}`}
        style={{ minHeight: 0 }}
      >
        <Form.Group>
          <p>Foto do espaço</p>
          <label htmlFor="espaco-foto" className={styles.photo}>
            {photoPreview ? (
              <Image
                className={styles.image}
                src={photoPreview}
                alt="Foto do espaço condominial"
                width={50}
                height={50}
                unoptimized
              />
            ) : (
              <CiImageOff size={50} aria-hidden="true" />
            )}
          </label>
          <input
            id="espaco-foto"
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            hidden
          />
        </Form.Group>

        <Input
          Label="Nome do espaço"
          type="text"
          placeholder="Nome do espaço condominial"
          variant="Default"
          value={values.nomeEspaco}
          onChange={handleChange("nomeEspaco")}
          required
        />

        <div className="d-flex flex-row gap-3">
          <div className="flex-fill">
            <Input
              Label="Capacidade máxima"
              type="number"
              min="1"
              step="1"
              placeholder="Capacidade máxima"
              variant="Default"
              value={values.capacidadeMaxima}
              onChange={handleChange("capacidadeMaxima")}
              required
            />
          </div>
          <div className="flex-fill">
            <Input
              Label="Valor da diária"
              type="text"
              inputMode="numeric"
              placeholder="R$ 0,00"
              variant="Default"
              value={formatBRL(values.valorReserva)}
              onChange={handleValorChange}
              required
            />
          </div>
        </div>

        <Input
          Label="Descrição do espaço"
          type="text-area"
          placeholder="Descrição do espaço condominial"
          variant="Default"
          value={values.descricao}
          onChange={handleChange("descricao")}
        />

        <Input
          Label="Restrição do espaço"
          type="text-area"
          placeholder="Restrição do espaço condominial"
          variant="Default"
          value={values.restricao}
          onChange={handleChange("restricao")}
        />

        {error && (
          <p className="text-danger mb-0" role="alert">
            {error}
          </p>
        )}
      </div>

      <div className="px-4 pb-4 pt-2 flex-shrink-0">
        <hr className="mt-0 pb-2" />

        <div className="d-flex flex-column gap-2">
          <Button 
          type="submit" 
          variant="primary" 
          className="w-100" 
          disabled={busy}
          >
            {saving ? "Salvando..." : isEdit ? "Salvar alterações" : "Adicionar"}
          </Button>

          {isEdit && (
            <Button
              type="button"
              variant="critical"
              className="w-100"
              onClick={handleDelete}
              disabled={busy}
            >
              {deleting ? "Excluindo..." : "Inativar"}
            </Button>
          )}
        </div>
      </div>
    </Form>
  );
}