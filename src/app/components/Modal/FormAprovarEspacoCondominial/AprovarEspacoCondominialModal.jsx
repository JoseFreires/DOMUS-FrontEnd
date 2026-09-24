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
  initialData = {},
  showPhoto = true,
  onSaveChanges,
  submitLabel = "Reservar",
  moradorFields = [],
  reservasFields = []
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
          <Offcanvas.Title className={styles.title}>INFORMAÇÕES DA RESERVA</Offcanvas.Title>
          <div className={styles.titleUnderline} />

        </div>
      </Offcanvas.Header>

      <Offcanvas.Body className={styles.body}>
        <Row>
          <Col>
            {/* ── Coluna esquerda: MORADOR ── */}

            <Form className={styles.form}>
              <h2 className={styles.subtitle}>Morador</h2>
              {showPhoto && (
                <div className={styles.photoSection}>

                  <label className={styles.photoCircle}>
                    {photoPreview ? (
                      <Image
                        src={photoPreview}
                        alt="Foto"
                        roundedCircle
                        className={styles.photoPreview}
                      />
                    ) : (
                      <IoPersonCircleOutline size={200} />
                    )}
                  </label>

                  <hr className={styles.divider} />
                </div>
              )}
              {moradorFields.map((field) => (
                <Form.Group key={field.name} className="mb-3">


                  {field.type === "select" ? (
                    <>
                      <Dropdown
                        name={field.name}
                        value={formData[field.name] ?? ""}
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
            {/* ── Coluna direita: Espaço Condominial ── */}
            <Form className={styles.form}>
              <h2 className={styles.subtitle}>Espaço Condominial</h2>
              {showPhoto && (
                <div className={styles.photoSection}>

                  <label className={styles.photoSquare}>
                    {photoPreview ? (
                      <Image
                        src={photoPreview}
                        alt="Foto"
                        className={styles.photoPreview}
                      />
                    ) : (
                      <FaRegImage size={100} className={styles.icon} />
                    )}
                  </label>

                  <hr className={styles.divider} />


                </div>
              )}

              {reservasFields.map((field) => (
                <Form.Group key={field.name} className="mb-3">


                  {field.type === "select" ? (
                    <>
                      <Dropdown
                        name={field.name}
                        value={formData[field.name] ?? ""}
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
                      className={styles.input}
                      disabled={true}
                    />
                  )}
                </Form.Group>
              ))}

            </Form>
          </Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col>
            <Button className="w-100 mb-4" >
              Aprovar
            </Button>
            <Button className="w-100 mb-4" variant="critical" >
              Reprovar
            </Button>
          </Col>

        </Row>

      </Offcanvas.Body>
    </Offcanvas>
  );
}

