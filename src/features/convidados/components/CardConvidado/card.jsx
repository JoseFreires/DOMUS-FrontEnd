import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Badge from 'react-bootstrap/Badge'

import { FaCircleUser } from "react-icons/fa6";

export default function CardConvidado({
    convidadoData = {},
    onButtonOpenModal,
    type
}) {


    return (
        <Card
            className="mb-5 shadow-sm"
            onClick={() => onButtonOpenModal()}
            style={{ cursor: 'pointer' }}
        >
            <Row className="g-0 align-items-center p-3">
                <Col xs={5} md={6} className="d-flex justify-content-center align-items-center">
                    <FaCircleUser size={100} />
                </Col>
                <Col xs={8} md={5}>
                    <Card.Body className="text-center">

                        <Card.Title className="fw-bold" style={{ color: "#003366", fontSize: 18 }}>
                            {convidadoData.nome}
                        </Card.Title>


                        <div className="fw-semibold" >
                            {convidadoData.frequencia}
                        </div>
                        <div className="fw-semibold" >
                            {convidadoData.tipo}
                        </div>
                        <div className="fw-semibold">
                            <Badge bg={convidadoData.status === "inativo" ? "danger" : "success"}>
                                {convidadoData.status}
                            </Badge>
                        </div>

                        
                    
                
                    </Card.Body>
                </Col>
            </Row>
        </Card>
    );
}
