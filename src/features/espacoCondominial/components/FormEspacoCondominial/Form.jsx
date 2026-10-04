"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Form from "react-bootstrap/Form";
import { CiImageOff } from "react-icons/ci";

import Input from "@/components/ui/Input/Input";
import Button from "@/components/ui/Button/Button";
import styles from "./Form.module.css";

const EMPTY = {
  nome: "",
  descricao: "",
  capacidadeMax: "",
  valorDiaria: "",
  foto: null,
};

export default function FormEspacoCondominial({
  modo = "add",
  espacoCondominialData,
  onSaveChanges,
  onClose,
}) {
  console.log("FormEspacoCondominial render", { modo, espacoCondominialData });
  const isEdit = modo === "edit";
  const title = isEdit ? "Alterar Espaço Condominial" : "Adicionar Espaço Condominial";

  const [values, setValues] = useState(EMPTY);
  const [novaFoto, setNovaFoto] = useState(null); // File escolhido pelo usuário
  const [photoPreview, setPhotoPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const data = isEdit ? espacoCondominialData : null;
    setValues({
      nome: data?.nome ?? "",
      descricao: data?.descricao ?? "",
      capacidadeMax: data?.capacidadeMax ?? "",
      valorDiaria: data?.valorDiaria ?? "",
    });
    setPhotoPreview(data?.foto ?? null);
    setNovaFoto(null);
    setError("");
  }, [isEdit, espacoCondominialData]);

  // Libera o blob anterior quando o preview muda ou o componente desmonta
  useEffect(() => {
    return () => {
      if (photoPreview?.startsWith("blob:")) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  const handleChange = (field) => (e) =>
    setValues((prev) => ({ ...prev, [field]: e.target.value }));

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNovaFoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!onSaveChanges || saving) return;

    setSaving(true);
    setError("");
    try {
      await onSaveChanges({
        ...(isEdit && { idEspacoCondominial: espacoCondominialData?.idEspacoCondominial }),
        nome: values.nome.trim(),
        descricao: values.descricao.trim(),
        capacidadeMax: Number(values.capacidadeMax),
        valorDiaria: Number(values.valorDiaria),
        ...(novaFoto && { foto: novaFoto }), // só envia se o usuário trocou
      });
      onClose?.();
    } catch (err) {
      console.error(err);
      setError("Não foi possível salvar. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!onDelete || deleting || saving) return;

    const confirmado = window.confirm(
      "Tem certeza que deseja excluir este espaço condominial?"
    );
    if (!confirmado) return;

    setDeleting(true);
    setError("");
    try {
      await onDelete(espacoCondominialData?.idEspacoCondominial);
      onClose?.();
    } catch (err) {
      console.error(err);
      setError("Não foi possível excluir. Tente novamente.");
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
        <div className="d-flex align-items-center gap-2">
          <h1 className="h4 text-primary-custom mb-0">{title}</h1>
        </div>
      </div>

      <div
        className="px-4 py-3 flex-grow-1 overflow-auto d-flex flex-column gap-4"
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
              <CiImageOff size={50} />
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
          value={values.nome}
          onChange={handleChange("nome")}
          required
        />

        <div className="d-flex flex-row gap-3">
          <div className="flex-fill">
            <Input
              Label="Capacidade máxima"
              type="number"
              min="1"
              placeholder="Capacidade máxima"
              variant="Default"
              value={values.capacidadeMax}
              onChange={handleChange("capacidadeMax")}
              required
            />
          </div>
          <div className="flex-fill">
            <Input
              Label="Valor da diária"
              type="number"
              min="0"
              step="0.01"
              placeholder="Valor da diária"
              variant="Default"
              value={values.valorDiaria}
              onChange={handleChange("valorDiaria")}
              required
            />
          </div>
        </div>

        <Input
          Label="Descrição do espaço"
          placeholder="Descrição do espaço condominial"
          variant="Default"
          value={values.descricao}
          onChange={handleChange("descricao")}
        />

        {error && <p className="text-danger mb-0">{error}</p>}
      </div>

      <div className="px-4 pb-4 pt-2 flex-shrink-0">
        <hr className="mt-0 pb-2" />

        <div className="d-flex flex-column gap-2">
          <Button
            type="submit"
            variant="primary"
            className="w-100"
            disabled={saving || deleting}
          >
            {saving ? "Salvando..." : isEdit ? "Salvar alterações" : "Adicionar"}
          </Button>

          {isEdit && (
            <Button
              type="button"
              variant="critical"
              className="w-100"
              onClick={handleDelete}
              disabled={saving || deleting}
            >
              {deleting ? "Excluindo..." : "Excluir"}
            </Button>
          )}
        </div>
      </div>
    </Form>
  );
}