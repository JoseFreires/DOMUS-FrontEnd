"use client";

import { useEffect, useState } from "react";
import { Offcanvas, Form, Image } from "react-bootstrap";

import styles from "./CadastroModal.module.css";

import Button from "@/components/ui/Button/Button";
import Input from "@/components/ui/Input/Input";
import Dropdown from "@/components/ui/Dropdown/Dropdown";
import { useCascade } from "@/hooks/useCascade";

import { FaUser } from "react-icons/fa";

const EMPTY = {};
const MAX_FOTO_MB = 5;

export default function CadastroModal({
  show,
  onHide,
  title,
  fields = [],
  initialData = EMPTY,
  showPhoto = true,
  usaFoto = true,
  onSaveChanges,
  submitLabel = "Cadastrar",
}) {
  const { formData, setFormData, handleChange, getFieldOptions, isFieldLocked } =
    useCascade(fields, initialData, show);

  const [photoPreview, setPhotoPreview] = useState(null);
  const [foto, setFoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  // Reseta ao abrir
  useEffect(() => {
    if (!show) return;
    setFormData(initialData || EMPTY);
    setPhotoPreview(initialData?.fotoPerfil ?? null);
    setFoto(null);
    setErro("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, initialData]);

  // Libera blob anterior ao trocar o preview ou desmontar
  useEffect(() => {
    return () => {
      if (photoPreview?.startsWith("blob:")) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErro("Selecione um arquivo de imagem.");
      return;
    }
    if (file.size > MAX_FOTO_MB * 1024 * 1024) {
      setErro(`A imagem deve ter no máximo ${MAX_FOTO_MB} MB.`);
      return;
    }

    setErro("");
    setPhotoPreview(URL.createObjectURL(file));
    setFoto(file);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    if (loading) return;

    setErro("");
    setLoading(true);
    try {
      await onSaveChanges?.({
        ...formData,
        ...(usaFoto && foto && { foto }), // só envia se o usuário trocou
      });
    } catch (err) {
      setErro(err?.message || "Erro ao salvar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const submitButton = (extraProps = {}) => (
    <Button
      type="submit"
      variant="critical"
      className={styles.submitButton}
      disabled={loading}
      {...extraProps}
    >
      {loading ? "Salvando..." : submitLabel}
    </Button>
  );

  return (
    <Offcanvas
      show={show}
      onHide={onHide}
      placement="end"
      scroll={false}
      backdrop={false}
      className={styles.offcanvas}
    >
      <Offcanvas.Header closeButton className={styles.header}>
        <div style={{ width: "100%" }}>
          <Offcanvas.Title className={styles.title}>{title}</Offcanvas.Title>
          <div className={styles.titleUnderline} />
        </div>
      </Offcanvas.Header>

      <Offcanvas.Body className={styles.body}>
        <Form id="cadastro-form" onSubmit={handleSubmit} className={styles.content}>
          {/* ── Coluna esquerda: inputs ── */}
          <div className={styles.form}>
            {fields.map((field) => (
              <Form.Group key={field.name} className="mb-3">
                {field.type === "select" ? (
                  <Dropdown
                    name={field.name}
                    value={formData[field.name] ?? ""}
                    onChange={handleChange(field.name)}
                    className={styles.input}
                    options={getFieldOptions(field)}
                    isDisabled={isFieldLocked(field)}
                    placeholder={
                      isFieldLocked(field)
                        ? "Selecione o campo anterior primeiro"
                        : field.placeholder
                    }
                    Label={field.label}
                  />
                ) : (
                  <Input
                    type={field.type || "text"}
                    name={field.name}
                    Label={field.label}
                    placeholder={field.placeholder}
                    value={formData[field.name] ?? ""}
                    onChange={handleChange(field.name, field.mask)}
                    className={styles.input}
                  />
                )}
              </Form.Group>
            ))}

            {erro && (
              <p className="text-danger small mt-1" role="alert">
                {erro}
              </p>
            )}

            {/* Botão no rodapé dos inputs quando não há coluna de foto */}
            {!showPhoto &&
              submitButton({ style: { width: "100%", marginTop: "16px" } })}
          </div>

          {showPhoto && <div className={styles.dividerVertical} />}

          {/* ── Coluna direita: foto/ícone + botão ── */}
          {showPhoto && (
            <div className={styles.photoSection}>
              <span className={styles.label}>{usaFoto ? "Foto" : "Perfil"}</span>

              {usaFoto ? (
                <>
                  <label
                    htmlFor="cadastro-foto"
                    className={styles.photoCircle}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        document.getElementById("cadastro-foto")?.click();
                      }
                    }}
                  >
                    {photoPreview ? (
                      <Image
                        src={photoPreview}
                        alt="Foto de perfil"
                        roundedCircle
                        className={styles.photoPreview}
                      />
                    ) : (
                      <FaUser size={150} />
                    )}
                  </label>
                  <input
                    id="cadastro-foto"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    hidden
                  />
                </>
              ) : (
                <div className={`${styles.photoCircle} ${styles.photoCircleStatic}`}>
                  {photoPreview ? (
                    <Image
                      src={photoPreview}
                      alt="Foto de perfil"
                      roundedCircle
                      className={styles.photoPreview}
                    />
                  ) : (
                    <FaUser size={150} />
                  )}
                </div>
              )}

              <hr className={styles.divider} />

              {submitButton()}
            </div>
          )}
        </Form>
      </Offcanvas.Body>
    </Offcanvas>
  );
}
