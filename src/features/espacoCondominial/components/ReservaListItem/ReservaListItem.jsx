import Image from "next/image";
import Badge from "react-bootstrap/Badge";
import {
  STATUS_RESERVA,
  formatarDataHora,
  formatarDataISO,
} from "@/features/reservas/components/minhasReservasColumns";
import styles from "./ReservaListItem.module.css";

export default function ReservaListItem({
  reserva,
  perfil,
}) {
  const espaco = reserva?.nomeEspaco ?? "Espaço condominial";
  const imagem = reserva?.fotoEspaco || "/img/exemploEspaco.png";

  if (perfil === "morador") {
    const status = STATUS_RESERVA[reserva?.statusReserva] ?? {
      bg: "secondary",
      label: reserva?.statusReserva ?? "—",
    };

    return (
      <div className={styles.reservaRow}>
        <Image
          src={imagem}
          alt={`Foto de ${espaco}`}
          width={64}
          height={48}
          className={styles.imagemEspaco}
          unoptimized
        />
        <div className={styles.reservaInfo}>
          <p className={styles.itemTituloBold}>{espaco}</p>
          <Badge bg={status.bg} className={styles.status}>{status.label}</Badge>
          {reserva?.justificativaReservaNegada && (
            <p className={styles.justificativa}>
              Justificativa: {reserva.justificativaReservaNegada}
            </p>
          )}
        </div>
      </div>
    );
  }

  const nomeMorador = reserva?.nomeMorador ?? reserva?.nomeCompleto ?? "Morador";
  const data = reserva?.canceladaEm
    ? `Cancelada em ${formatarDataHora(reserva.canceladaEm)}`
    : `Reserva em ${formatarDataISO(reserva?.dataReserva) || "—"}`;

  return (
    <div className={styles.reservaRow}>
      <Image
        src={imagem}
        alt={`Foto de ${espaco}`}
        width={64}
        height={48}
        className={styles.imagemEspaco}
        unoptimized
      />
      <div className={styles.reservaInfo}>
        <p className={styles.itemTituloBold}>{espaco}</p>
        <p className={styles.dataText}>{nomeMorador}</p>
        <p className={styles.dataText}>{data}</p>
        <p className={styles.dataText}>
          {reserva?.quantidadeConvidados ?? "—"} convidado(s)
        </p>
      </div>
    </div>
  );
}
