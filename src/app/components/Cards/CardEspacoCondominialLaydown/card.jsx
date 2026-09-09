import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Badge from 'react-bootstrap/Badge'
import { formatDateTime } from "@/app/hooks/formatar";
import styles from "./card.module.css";

export default function CardEspacoCondominialLaydown({ espacoCondominialData = {} }) {


    return (
        <Card className="mb-5 shadow-sm">
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
                    </Card.Body>
                </Col>
            </Row>
        </Card>
    );
}
