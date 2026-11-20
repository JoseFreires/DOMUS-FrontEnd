"use client";

import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Badge from "react-bootstrap/Badge";
import { CiImageOff } from "react-icons/ci";
import { BiCalendarCheck, BiGroup } from "react-icons/bi";
import styles from "./card.module.css";
import { STATUS_RESERVA } from "@/features/reservas/components/minhasReservasColumns";

const formatBRL = (value) =>
    value === "" || value == null || Number.isNaN(Number(value))
        ? "—"
        : new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(value));

const formatarDataISO = (iso) => {
    const [a, m, d] = String(iso ?? "").split("-");
    return a && m && d ? `${d}/${m}/${a}` : "";
};

export default function CardEspacoCondominialLaydown({
    espacoCondominialData = {},
    onButtonOpenModal,
    type,
}) {
    const isDisponivel = type === "disponivel";
    const isReserva = type === "reserva";
    const clicavel = typeof onButtonOpenModal === "function";

    const abrir = () => onButtonOpenModal?.(espacoCondominialData);

    const handleKeyDown = (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            abrir();
        }
    };

    const titulo = isDisponivel || isReserva
        ? espacoCondominialData.nomeEspaco
        : espacoCondominialData.titulo;

    const foto = isDisponivel || isReserva
        ? espacoCondominialData.fotoEspaco
        : "/img/exemploEspaco.png";

    const status = STATUS_RESERVA[espacoCondominialData.statusReserva] ?? {
        bg: "secondary",
        label: espacoCondominialData.statusReserva ?? "—",
    };
    const morador = espacoCondominialData.nomeMorador ?? espacoCondominialData.nomeCompleto;

    return (
        <Card
            className={`${isDisponivel || isReserva ? "h-100" : "mb-5"} shadow-sm`}
            onClick={clicavel ? abrir : undefined}
            onKeyDown={clicavel ? handleKeyDown : undefined}
            role={clicavel ? "button" : undefined}
            tabIndex={clicavel ? 0 : undefined}
            style={{ cursor: clicavel ? "pointer" : "default" }}
        >
            <Row className="g-0 align-items-center h-100">
                <Col xs={5} md={6} className="h-100">
                    {foto ? (
                        <Card.Img
                            src={foto}
                            alt={titulo ? `Foto de ${titulo}` : "Foto do espaço"}
                            className="rounded-start"
                            style={{ height: "100%", objectFit: "cover" }}
                        />
                    ) : (
                        <div className={styles.placeholder} role="img" aria-label="Sem imagem">
                            <CiImageOff size={48} aria-hidden="true" />
                        </div>
                    )}
                </Col>

                <Col xs={7} md={6}>
                    <Card.Body>
                        {isReserva ? (
                            <>
                                <Card.Title className="fw-bold" style={{ color: "#003366" }}>
                                    {titulo}
                                </Card.Title>

                                {morador && (
                                    <div className="fw-semibold" style={{ color: "#003366" }}>
                                        Reservado por {morador}
                                    </div>
                                )}

                                <div className="d-flex align-items-center gap-2 mt-1">
                                    <BiCalendarCheck aria-hidden="true" />
                                    {formatarDataISO(espacoCondominialData.dataReserva)}
                                </div>

                                <div className="d-flex align-items-center gap-2">
                                    <BiGroup aria-hidden="true" />
                                    {espacoCondominialData.quantidadeConvidados ?? 0} convidado(s)
                                </div>

                                <Badge bg={status.bg} className="mt-2">{status.label}</Badge>
                            </>
                        ) : isDisponivel ? (
                            <>
                                <Card.Title className="fw-bold" style={{ color: "#003366" }}>
                                    {titulo}
                                </Card.Title>

                                {espacoCondominialData.descricao && (
                                    <Card.Text className={styles.descricao}>
                                        {espacoCondominialData.descricao}
                                    </Card.Text>
                                )}

                                <div className="fw-semibold" style={{ color: "#003366" }}>
                                    Valor: {formatBRL(espacoCondominialData.valorReserva)}
                                </div>
                                <div className="fw-semibold" style={{ color: "#003366" }}>
                                    Capacidade: {espacoCondominialData.capacidadeMaxima || "—"}
                                </div>
                                <Badge bg="success" className="mt-2">Disponível</Badge>
                            </>
                        ) : type === "morador" ? (
                            <>
                                <Card.Title className="fw-bold" style={{ color: "#003366" }}>
                                    {titulo}
                                </Card.Title>
                                <div className="fw-semibold" style={{ color: "#003366" }}>
                                    Data: {espacoCondominialData.data}
                                </div>
                                <div className="fw-semibold" style={{ color: "#003366" }}>
                                    Status:{" "}
                                    <Badge bg={espacoCondominialData.status === "pendente" ? "warning" : "success"}>
                                        {espacoCondominialData.status}
                                    </Badge>
                                </div>
                            </>
                        ) : (
                            <>
                                <Card.Title className="fw-bold" style={{ color: "#003366", textAlign: "center" }}>
                                    {titulo}
                                </Card.Title>
                                <div className="fw-semibold" style={{ color: "#003366", textAlign: "center" }}>
                                    Reservado por {espacoCondominialData.morador}
                                </div>
                            </>
                        )}
                    </Card.Body>
                </Col>
            </Row>
        </Card>
    );
}