import { FiPackage } from "react-icons/fi"; 
import styles from "./Listitems.module.css";

const STATUS_COLOR={
    RECEBIDA: "#f5a623",
  ENTREGUE: "#2e7d32",
};

export default function EncomendaListItem({
  foto,
  titulo,
  dataRecebimento,
  status,
  apartamento,
}) { 
    
    const statusLabel = status === "ENTREGUE" ? "Retirado" : "Recebido";

    const statusColor = STATUS_COLOR[status] ?? "#757575";

    return (
<div className={styles.encomendaCard}>
      <div className={styles.encomendaBox}>
        {foto? (<Image
          src={foto}
          alt={titulo}
          width={40}
          height={40}
          unoptimized
        />) : (
            <FiPackage size={40} color="var(--darkColor)" />
        )}
      </div>
 
      <div className={styles.encomendaContent}>
        <p className={styles.itemTitulo}>{titulo}</p>
        <p className={styles.mutedText}>{dataRecebimento}</p>
        <p className={styles.boldSmall}>Apto. {apartamento}</p>
 
        <div className={styles.statusRow}>
          <span className={styles.statusLabel}>STATUS:</span>
          <span className={styles.statusBadge} style={{ color: statusColor }}>
            <span className={styles.statusDot} style={{ backgroundColor: statusColor }} />
            {statusLabel}
          </span>
        </div>
      </div>
    </div>

    );

}