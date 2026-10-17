"use client";
 
import { memo, useId, useState } from "react";
import Image from "next/image";
import Dropdown from "react-bootstrap/Dropdown";
import { FiImage, FiMoreVertical } from "react-icons/fi";
import AvisoIcon from "../AvisoIcon/AvisoIcon";
import { formatDateTime } from "@/utils/formatar";
import styles from "./AvisoCard.module.css";
 
/**
 * O MESMO componente serve para:
 *  - desktop: prévia ao lado da lista            → variant="panel"
 *  - mobile : feed com todos os avisos empilhados → variant="feed" (padrão)
 *
 * As props têm os MESMOS nomes dos campos do backend (como já fazem as colunas
 * da tabela), então basta fazer <AvisoCard {...aviso} />.
 *
 * actions: [{ label, onClick }] → se houver, aparece o menu ⋮ (ex: Editar/Excluir).
 */
function AvisoCard({
  tipoAviso,
  nomeSindico,
  cargo = "Síndico",
  titulo,
  descricao,
  fotoAviso,
  dataHoraAviso,
  variant = "feed",
}) {
  const titleId = useId();
  const [imgFailed, setImgFailed] = useState(false);
 
  return (
    <article
      className={`${styles.card} ${variant === "panel" ? styles.panel : styles.feed}`}
      aria-labelledby={titleId}
    >
      <header className={styles.header}>
        <div className={styles.avatar}>
          <AvisoIcon tipo={tipoAviso} size={22} />
        </div>
 
        <div className={styles.author}>
          <span className={styles.name}>{nomeSindico}</span>
          <span className={styles.role}>{cargo}</span>
        </div>
      </header>
 
      <h3 id={titleId} className={styles.title}>
        {titulo}
      </h3>
 
      {descricao && <p className={styles.text}>{descricao}</p>}
 
      {fotoAviso && (
        <div className={styles.media}>
          {imgFailed ? (
            <FiImage size={48} aria-hidden="true" />
          ) : (
            <Image
              src={fotoAviso}
              alt={`Imagem do aviso: ${titulo}`}
              fill
              sizes="(max-width: 992px) 100vw, 60vw"
              unoptimized
              className={styles.mediaImg}
              onError={() => setImgFailed(true)}
            />
          )}
        </div>
      )}
 
      {dataHoraAviso && (
        <footer className={styles.sentAt}>Enviado em {formatDateTime(dataHoraAviso)}</footer>
      )}
    </article>
  );
}
 
export default memo(AvisoCard);