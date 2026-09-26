import Image from "next/image";
import styles from "@/components/ui/ListItems.module.css";

export default function ReservaListItem({
  local,
  dataSolicitacao,
  fotoMorador,
  nome,
  email,
}) {
  return (
    <div className={styles.reservaRow}>
      <div className={styles.reservaInfo}>
        <p className={styles.itemTituloBold}>{local}</p>
        <p className={styles.dataText}>{dataSolicitacao}</p>
      </div>

      <div className={styles.reservaMorador}>
        <Image
          src={fotoMorador || "/img/avatar-placeholder.svg"}
          alt={nome}
          width={40}
          height={40}
          className={styles.avatar}
          unoptimized
        />
        <div>
          <p className={styles.linkText}>{nome}</p>
          <p className={styles.mutedText}>{email}</p>
        </div>
      </div>
    </div>
  );
}
