"use client";

import { useEffect, useState } from "react";
import { Offcanvas, Form, Image, Row, Col } from "react-bootstrap";
import { IoPersonCircleOutline } from "react-icons/io5";

import styles from "./AprovarEspacoCondominialModal.module.css";
import Button from "@/app/components/Button/button";
import Input from "@/app/components/Input/Input";

import { FaRegImage } from "react-icons/fa6";

export default function AprovarEspacoCondominialModal({
  show,
  onHide,
  dataReserva,
  initialData = {},
  showPhoto = true,
  onSaveChanges,
  submitLabel = "Reservar",
  fields = [],
}) {
  const [formData, setFormData] = useState({});
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const handleChange = (fieldName) => (e) => {
    const value = e.target.value;              // só usa o value, ignora e.target.name
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoPreview(URL.createObjectURL(file));
    setFormData((prev) => ({ ...prev, foto: file }));
  };

  const handleSubmit = async () => {
    setErro("");
    setLoading(true);
    try {
      await onSaveChanges?.(formData);
    } catch (err) {
      setErro(err.message || "Erro ao salvar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

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
          <Offcanvas.Title className={styles.title}>INFORMAÇÕES DA RESERVA</Offcanvas.Title>
          <div className={styles.titleUnderline} />

        </div>
      </Offcanvas.Header>

      <Offcanvas.Body className={styles.body}>
          <Row>
            <Col>
              {/* ── Coluna esquerda: MORADOR ── */}
              {showPhoto && (
                <div className={styles.photoSection}>

                  <label htmlFor="cadastro-foto" className={styles.photoCircle}>
                    {photoPreview ? (
                      <Image
                        src={photoPreview}
                        alt="Foto"
                        roundedCircle
                        className={styles.photoPreview}
                      />
                    ) : (
                      <IoPersonCircleOutline size={100} />
                    )}
                  </label>

                </div>
              )}
              <Form className={styles.form}>
                {fields.map((field) => (
                  <Form.Group key={field.name} className="mb-3">


                    {field.type === "select" ? (
                      <>
                        {/* <Form.Label className={styles.label}>{field.label}</Form.Label> */}
                        <Dropdown
                          name={field.name}
                          value={formData[field.name] ?? ""}
                          onChange={handleChange(field.name)}
                          className={styles.input}
                          options={field.options || []}
                          Label={field.label}
                        >

                        </Dropdown>
                      </>
                    ) : (
                      <Input
                        type={field.type || "text"}
                        name={field.name}
                        Label={field.label}
                        placeholder={field.placeholder}
                        value={formData[field.name] ?? ""}
                        defaultValue={initialData[field.name] ?? ""}
                        onChange={handleChange(field.name)}
                        className={styles.input}
                        disabled={true}
                      />
                    )}
                  </Form.Group>
                ))}
                {erro && <p className="text-danger small mt-1">{erro}</p>}
              </Form>

            </Col>

            <Col>
              {/* ── Coluna esquerda: MORADOR ── */}
              <Form className={styles.form}>

                <Form.Group className="mb-3">
                  <Form.Label className={styles.label}>Nome do espaço</Form.Label>
                  <Form.Control type="email" placeholder="Torre Sul" disabled />
                </Form.Group>

                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label className={styles.label}>Capacidade Máx.</Form.Label>
                      <Form.Control type="number" placeholder="20" disabled />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label className={styles.label}>Valor do Espaço</Form.Label>
                      <Form.Control type="" placeholder="R$150,00" disabled />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label className={styles.label}>Descrição do espaço</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={7}
                    placeholder="Localizado ao lado do Prédio Norte, este é o ambiente ideal para suas comemorações. Um espaço moderno e acolhedor que une praticidade e conforto para os seus eventos."
                    disabled
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className={styles.label}>Restrição</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nenhuma"
                    disabled
                  />
                </Form.Group>

              </Form>
            </Col>
          </Row>

      </Offcanvas.Body>
    </Offcanvas>
  );
}

