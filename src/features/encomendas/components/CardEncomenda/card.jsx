import styles from "./card.module.css";
import Image from "next/image";
import { GoPackage } from "react-icons/go";
import { formatDateTime } from "@/utils/formatar";

export default function CardEncomenda({ encomendaData = {}, searchValue = "" }) {
    const getStatusClass = (status) => {
        switch (String(status || "").toLowerCase()) {
            case "pendente":
            case "a retirar":
            case "recebida":
                return styles.statusPending;
            case "entregue":
            case "retirado":
                return styles.statusDelivered;
            default:
                return styles.statusDefault;
        }
    };

    const normalizeText = (text) =>
        String(text || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

    const search = normalizeText(searchValue);

    const matchesSearch =
        !search ||
        normalizeText(encomendaData.nomePacote).includes(search) ||
        normalizeText(encomendaData.numeroApartamento).includes(search) ||
        normalizeText(encomendaData.nomePorteiro).includes(search) ||
        normalizeText(encomendaData.status).includes(search) ||
        normalizeText(encomendaData.tokenEncomenda).includes(search);

    if (!matchesSearch) {
        return null;
    }

    const statusKey = String(encomendaData.status || "").toUpperCase();
    const foiRetirada = (statusKey === "ENTREGUE" || statusKey === "RETIRADO") && !!encomendaData.dataHoraRetirado;

    // Enquanto não foi retirada mostra "Recebida em:"; depois passa a "Retirada em:"
    const dataLabel = foiRetirada ? "Retirada em:" : "Recebida em:";
    const dataValor = foiRetirada
        ? encomendaData.dataHoraRetirado
        : encomendaData.dataHoraRecebido;


    const blocoApto = [
        encomendaData.numeroApartamento ? `Apto. ${encomendaData.numeroApartamento}` : null,
    ]
        .filter(Boolean)
        .join(" / ");
    const tokenEncomenda = encomendaData.tokenEncomenda;
    const tipoRetirada = encomendaData.tipoRetirada;
    return (
        <div className={styles.card}>
            {/* 3 e 4: título + data */}
            <div className={styles.header}>
                <h3 className={styles.titulo}>{encomendaData.nomePacote}</h3>
                <span className={styles.date}>
                    {dataLabel} {formatDateTime(dataValor)}
                </span>
            </div>

            {/* 5: foto ou ícone */}
            <div className={styles.media}>
                {encomendaData.fotoPacote ? (
                    <Image
                        src={encomendaData.fotoPacote}
                        alt={encomendaData.nomePacote || "Foto do pacote"}
                        fill
                        sizes="(max-width: 480px) 100vw, 400px"
                        className={styles.mediaImage}
                        unoptimized
                    />
                ) : (
                    <GoPackage size={72} color="var(--auxiliarColor)" />
                )}
            </div>

            {/* 6: observação + porteiro + bloco/apto (mesmo estilo) */}
            <div className={styles.body}>
                {encomendaData.observacao && (
                    <p className={styles.infoText}>{encomendaData.observacao}</p>
                )}
                <p className={styles.infoText}>
                    <span className={styles.infoLabel}>Porteiro:</span>{" "}
                    {encomendaData.nomePorteiro || "—"}
                </p>
                <p className={styles.infoText}>
                    <span className={styles.infoLabel}>Informação:</span>{" "}
                    {blocoApto || "—"}
                </p>
                <p className={styles.infoText}>
                    <span className={styles.infoLabel}>Token Retirada:</span>{" "}
                    {tokenEncomenda || "—"}
                </p>
                <p className={styles.infoText}>
                    <span className={styles.infoLabel}>Tipo Retirada:</span>{" "}
                    {encomendaData.tipoRetirada || "—"}
                </p>
            </div>

            {/* rodapé: status */}
            <div className={styles.footer}>
                <span className={styles.statusLabel}>STATUS:</span>
                <span className={`${styles.statusBadge} ${getStatusClass(encomendaData.status)}`}>
                    <span className={styles.statusDot}></span>
                    {encomendaData.status}
                </span>
            </div>
        </div>
    );
}