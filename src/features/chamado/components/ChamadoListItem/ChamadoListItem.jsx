import Image from "next/image";
import styles from "@/components/ui/ListItems.module.css";

/**
 * { fotoMorador, nome, titulo, tipo, icone }
 * icone: ReactNode (svg) já resolvido pelo pai a partir do tipo (SUGESTÃO/RECLAMAÇÃO)
 */
export default function ChamadoListItem({ fotoMorador, nome, titulo, tipo, icone }) {
  return (
    <div className={styles.chamadoRow}>
      <Image
        src={fotoMorador || "/img/avatar-placeholder.svg"}
        alt={nome}
        width={48}
        height={48}
        className={styles.avatar}
        unoptimized
      />

      <div className={styles.chamadoContent}>
        <span className={styles.linkText}>{nome}</span>
        <p className={styles.mutedText}>{titulo}</p>
      </div>

      <div className={styles.tipoBadge}>
        {icone}
        <span>{tipo}</span>
      </div>
    </div>
  );
}