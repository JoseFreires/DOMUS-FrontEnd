import Card from 'react-bootstrap/Card';
import { formatDateTime } from "@/app/hooks/formatar";
import styles from "./card.module.css";

export default function CardEspacoCondominial({ espacoCondominialData = {} }) {


    return (
        <Card style={{ width: '18rem' }} className={styles.card}>
            <Card.Img variant="top" src="/img/exemploEspaco.png" />
            <Card.Body>
                <Card.Title style={{textAlign: "center", fontWeight: "bold", color: "#003366"}}>
                    {espacoCondominialData.nome}
                </Card.Title>
                <Card.Text style={{textAlign: "center"}}>
                    {espacoCondominialData.descricao}
                </Card.Text>
                <div>
                    <Card.Text>
                        Valor reserva: 
                        R${espacoCondominialData.valor}
                    </Card.Text>
                    <Card.Text>
                        Capacidade Máxima:  
                        {espacoCondominialData.capacidadeMax}
                    </Card.Text>
                </div>
            </Card.Body>
        </Card>
    );
}
