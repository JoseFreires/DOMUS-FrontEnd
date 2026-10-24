import Card from 'react-bootstrap/Card';
import { formatDateTime } from "@/utils/formatar";
import styles from "./card.module.css";
import { CiImageOff } from "react-icons/ci";

export default function CardEspacoCondominial({
    espacoCondominialData = {},
    onButtonOpenModal = null
}) {

    return (
        <Card
            style={{ cursor: "pointer" }}
            className={`${styles.card} h-100`}
            onClick={() => onButtonOpenModal?.(espacoCondominialData)}
        >
            {espacoCondominialData.fotoEspaco ? (
                <Card.Img
                    variant="top"
                    src={espacoCondominialData.fotoEspaco}
                    alt={espacoCondominialData.nomeEspaco}
                    className={styles.imagem}
                />
            ) : (
                <div className={styles.placeholder} role="img" aria-label="Sem imagem">
                    <CiImageOff size={100} aria-hidden="true" />
                </div>
            )}

            <Card.Body>
                <Card.Title style={{ textAlign: "center", fontWeight: "bold", color: "#003366" }}>
                    {espacoCondominialData.nomeEspaco}
                </Card.Title>
                <Card.Text style={{ textAlign: "center" }}>
                    {espacoCondominialData.descricao}
                </Card.Text>

                <div className={styles.containerCardInfos}>
                    <div className={styles.information}>
                        <Card.Text className={styles.caption}>
                            Valor reserva:
                        </Card.Text>
                        <Card.Text>
                            R${espacoCondominialData.valorReserva}
                        </Card.Text>
                    </div>
                    <div className={styles.information}>
                        <Card.Text className={styles.caption}>
                            Capacidade Máxima:
                        </Card.Text>
                        <Card.Text>
                            {espacoCondominialData.capacidadeMaxima}
                        </Card.Text>
                    </div>


                </div>
            </Card.Body>
        </Card>
    );
}
