import Card from 'react-bootstrap/Card';
import { formatDateTime } from "@/app/hooks/formatar";
import styles from "./card.module.css";

export default function CardEspacoCondominial({ espacoCondominialData = {} }) {


    return (
        <Card style={{ width: '21rem' }} className={styles.card}>
            <Card.Img variant="top" src="/img/exemploEspaco.png" />
            <Card.Body>
                <Card.Title style={{textAlign: "center", fontWeight: "bold", color: "#003366"}}>
                    {espacoCondominialData.nome}
                </Card.Title>
                <Card.Text style={{textAlign: "center"}}>
                    {espacoCondominialData.descricao}
                </Card.Text>

                <div className={styles.containerCardInfos}>
                    <div className={styles.information}>
                        <Card.Text className={styles.caption}>
                            Valor reserva: 
                        </Card.Text>
                        <Card.Text> 
                            R${espacoCondominialData.valor}
                        </Card.Text>
                    </div>
                    <div className={styles.information}>
                        <Card.Text className={styles.caption}>
                            Capacidade Máxima:
                        </Card.Text>
                        <Card.Text> 
                             {espacoCondominialData.capacidadeMax}
                        </Card.Text>
                    </div>

                    
                </div>
            </Card.Body>
        </Card>
    );
}
