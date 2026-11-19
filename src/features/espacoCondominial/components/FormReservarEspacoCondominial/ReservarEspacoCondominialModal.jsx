"use client";

import { useEffect, useState } from "react";
import { Offcanvas, Form, Image, Row, Col } from "react-bootstrap";
import { FaRegImage } from "react-icons/fa6";

import styles from "./ReservarEspacoCondominialModal.module.css";
import Button from "@/components/ui/Button/Button";

// "2026-11-22" -> "22/11/2026" sem passar por Date (evita erro de fuso)
const formatarDataISO = (iso) => {
  const [a, m, d] = String(iso ?? "").split("-");
  return a && m && d ? `${d}/${m}/${a}` : "";
};

const formatBRL = (v) =>
  v == null || v === "" || Number.isNaN(Number(v))
    ? ""
    : new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(v));

export default function ReservarEspacoCondominialModal({
  show,
  onHide,
  title = "Reservar Espaço Condominial",
  dataReserva,          // "AAAA-MM-DD"
  espaco,               // item do endpoint /reservas/disponiveis
  onConfirm,            // async ({ idEspacoCondominial, dataReserva })
  showPhoto = true,
  submitLabel = "Reservar",
}) {
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [quantidadeConvidados, setQuantidadeConvidados] = useState("");

  useEffect(() => {
    if (show) {
      setErro("");
      setQuantidadeConvidados("");
    }
  }, [show, espaco]);

  const capacidade = Number(espaco?.capacidadeMaxima);

  const handleConfirm = async () => {
    if (loading || !espaco) return;

    const qtd = Number(quantidadeConvidados);
    if (quantidadeConvidados === "" || !Number.isInteger(qtd) || qtd < 0) {
      setErro("Informe a quantidade de convidados (use 0 se não houver).");
      return;
    }
    if (Number.isFinite(capacidade) && capacidade > 0 && qtd > capacidade) {
      setErro(`A quantidade de convidados não pode ultrapassar a capacidade do espaço (${capacidade}).`);
      return;
    }

    setLoading(true);
    setErro("");
    try {
      await onConfirm?.({
        idEspacoCondominial: espaco.idEspacoCondominial,
        dataReserva,
        quantidadeConvidados: qtd,
      });
      onHide?.();
    } catch (err) {
      console.error(err);
      setErro(
        err?.name === "ApiError"
          ? err.message
          : "Ocorreu um erro inesperado. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Offcanvas
      show={show}
      onHide={loading ? undefined : onHide}
      placement="end"
      scroll={false}
      backdrop={false}
      className={styles.offcanvas}
    >
      <Offcanvas.Header closeButton className={styles.header}>
        <div style={{ width: "100%" }}>
          <Offcanvas.Title className={styles.title}>
            {title} - {formatarDataISO(dataReserva)}
          </Offcanvas.Title>
          <div className={styles.titleUnderline} />
        </div>
      </Offcanvas.Header>

      <Offcanvas.Body className={styles.body}>
        <div className={styles.content}>
          <Form className={styles.form} onSubmit={(e) => { e.preventDefault(); handleConfirm(); }}>
            <Form.Group className="mb-3">
              <Form.Label className={styles.label}>Nome do espaço</Form.Label>
              <Form.Control type="text" value={espaco?.nomeEspaco ?? ""} readOnly disabled />

            </Form.Group>

            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label className={styles.label}>Capacidade Máx.</Form.Label>
                  <Form.Control type="text" value={espaco?.capacidadeMaxima ?? ""} readOnly disabled />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label className={styles.label}>Valor do Espaço</Form.Label>
                  <Form.Control type="text" value={formatBRL(espaco?.valorReserva)} readOnly disabled />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className={styles.label}>Descrição do espaço</Form.Label>
              <Form.Control as="textarea" rows={7} value={espaco?.descricao ?? ""} readOnly disabled />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className={styles.label}>Restrição</Form.Label>
              <Form.Control type="text" value={espaco?.restricao || "Nenhuma"} readOnly disabled />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className={styles.label} htmlFor="reserva-convidados">
                Quantidade de convidados
              </Form.Label>
              <Form.Control
                id="reserva-convidados"
                type="number"
                min={0}
                max={Number.isFinite(capacidade) && capacidade > 0 ? capacidade : undefined}
                step={1}
                inputMode="numeric"
                placeholder="Ex.: 10"
                value={quantidadeConvidados}
                onChange={(e) => {
                  setQuantidadeConvidados(e.target.value);
                  setErro("");
                }}
                disabled={loading}
                required
              />
              {Number.isFinite(capacidade) && capacidade > 0 && (
                <Form.Text muted>Máximo de {capacidade} pessoas neste espaço.</Form.Text>
              )}
            </Form.Group>

            {erro && <p className="text-danger small" role="alert">{erro}</p>}
          </Form>

          <div className={styles.dividerVertical} />


          {showPhoto && (
            <div className={styles.photoSection}>
              <div className={styles.photoCircle}>
                {espaco?.fotoEspaco ? (
                  <Image src={espaco.fotoEspaco} alt={`Foto de ${espaco.nomeEspaco}`} className={styles.photoPreview} />
                ) : (
                  <FaRegImage size={100} className={styles.icon} aria-hidden="true" />
                )}
              </div>

              <hr className={styles.divider} />


              <Button className={styles.submitButton} onClick={handleConfirm} disabled={loading || !espaco}>
                {loading ? "Reservando..." : submitLabel}
              </Button>


            </div>
          )}
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
}