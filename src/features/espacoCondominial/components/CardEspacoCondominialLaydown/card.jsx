"use client";

import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Badge from "react-bootstrap/Badge";
import { CiImageOff } from "react-icons/ci";
import styles from "./card.module.css";

const formatBRL = (value) =>
    value === "" || value == null || Number.isNaN(Number(value))
        ? "—"
        : new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(value));

export default function CardEspacoCondominialLaydown({
    espacoCondominialData = {},
    onButtonOpenModal,
    type,
}) {
    const isDisponivel = type === "disponivel";
    const clicavel = typeof onButtonOpenModal === "function";

    const abrir = () => onButtonOpenModal?.(espacoCondominialData);

    const handleKeyDown = (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            abrir();
        }
    };

    // Título/imagem dependem da variante
    const titulo = isDisponivel
        ? espacoCondominialData.nomeEspaco
        : espacoCondominialData.titulo;

    const foto = isDisponivel ? espacoCondominialData.fotoEspaco : "/img/exemploEspaco.png";

    return (
        <Card
            className={`${isDisponivel ? "h-100" : "mb-5"} shadow-sm`}
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
                        {isDisponivel ? (
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