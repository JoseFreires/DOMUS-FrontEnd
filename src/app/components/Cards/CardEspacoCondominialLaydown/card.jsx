import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Badge from 'react-bootstrap/Badge'
import { formatDateTime } from "@/app/hooks/formatar";
import styles from "./card.module.css";

export default function CardEspacoCondominialLaydown({
    espacoCondominialData = {},
    onButtonOpenModal,
    type
}) {


    return (
        <Card
            className="mb-5 shadow-sm"
            onClick={() => onButtonOpenModal()}
            style={{ cursor: 'pointer' }}
        >
            <Row className="g-0 align-items-center">
                <Col xs={5} md={6}>
                    <Card.Img
                        src="/img/exemploEspaco.png"
                        alt={espacoCondominialData.titulo}
                        className="rounded-start"
                        style={{ height: "100%", objectFit: "cover" }}
                    />
                </Col>
                <Col xs={8} md={5}>
                    <Card.Body>

                        {type === "morador" ? (
                            <>
                                <Card.Title className="fw-bold" style={{ color: "#003366" }}>{
                                    espacoCondominialData.titulo}
                                </Card.Title>


                                <div className="fw-semibold" style={{ color: "#003366" }}>
                                    Data: {espacoCondominialData.data}
                                </div>
                                <div className="fw-semibold" style={{ color: "#003366" }}>
                                    Status:
                                    <Badge bg={espacoCondominialData.status === "pendente" ? "warning" : "success"}>
                                        {espacoCondominialData.status}
                                    </Badge>
                                </div>
                            </>
                        ) : (
                            <>
                                <Card.Title className="fw-bold" style={{ color: "#003366", textAlign: "center" }}>{
                                        espacoCondominialData.titulo}
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
