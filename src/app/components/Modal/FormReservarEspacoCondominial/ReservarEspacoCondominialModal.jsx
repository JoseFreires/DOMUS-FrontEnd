"use client";

import { useEffect, useState } from "react";
import { Offcanvas, Form, Image, Row, Col } from "react-bootstrap";
import styles from "./ReservarEspacoCondominialModal.module.css";
import Button from "@/app/components/Button/button";
import { FaRegImage } from "react-icons/fa6";

export default function ReservarEspacoCondominialModal({
  show,
  onHide,
  title,
  dataReserva,
  initialData = {},
  showPhoto = true,
  onSaveChanges,
  submitLabel = "Reservar",
}) {
  const [formData, setFormData] = useState({});
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");


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
          <Offcanvas.Title className={styles.title}>{title} - {dataReserva}</Offcanvas.Title>
          <div className={styles.titleUnderline} />

        </div>
      </Offcanvas.Header>

      <Offcanvas.Body className={styles.body}>
        <div className={styles.content}>

          {/* ── Coluna esquerda: inputs ── */}
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

          {/* ── Divisor vertical ── */}
          <div className={styles.dividerVertical} />

          {/* ── Coluna direita: foto + botão ── */}
          {showPhoto && (
            <div className={styles.photoSection}>

              <label htmlFor="cadastro-foto" className={styles.photoCircle}>
                {photoPreview ? (
                  <Image
                    src={photoPreview}
                    alt="Foto"
                    className={styles.photoPreview}
                  />
                ) : (
                  <FaRegImage size={100} className={styles.icon}/>
                )}
              </label>

              <hr className={styles.divider} />

              <Button
                className={styles.submitButton}
                
              >
                {loading ? "Salvando..." : submitLabel}
              </Button>
            </div>
          )}


        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
}

