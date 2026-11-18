"use client";

import { useState } from "react";
import Image from "next/image";
import { IoTicketSharp } from "react-icons/io5";

import ChamadoIcon, { getChamadoTipo } from "@/features/chamado/components/ChamadoIcon/ChamadoIcon";
import styles from "./ChamadoListItem.module.css";

/**
 * { imagem, nome, titulo, tipo }
 * imagem: URL da imagem anexada ao chamado (opcional). Sem imagem — ou se ela
 *         falhar ao carregar — aparece o ícone de chamado (o mesmo da Sidebar).
 * tipo:   valor do enum TipoChamado (RECLAMACAO, SUGESTAO...). O ícone e o
 *         rótulo do selo à direita são resolvidos aqui.
 */
export default function ChamadoListItem({ imagem, nome, titulo, tipo }) {
  const [imagemFalhou, setImagemFalhou] = useState(false);
  const { label } = getChamadoTipo(tipo);

  return (
    <div className={styles.chamadoRow}>
      {imagem && !imagemFalhou ? (
        <Image
          src={imagem}
          alt={`Imagem do chamado: ${titulo}`}
          width={48}
          height={48}
          className={styles.avatar}
          onError={() => setImagemFalhou(true)}
          unoptimized
        />
      ) : (
        <div className={styles.iconCircle} aria-hidden="true">
          <IoTicketSharp size={22} color="#ffffff" />
        </div>
      )}

      <div className={styles.chamadoContent}>
        <span className={styles.linkText}>{nome}</span>
        <p className={styles.mutedText}>{titulo}</p>
      </div>

      <div className={styles.tipoBadge}>
        <ChamadoIcon tipo={tipo} />
        <span>{label}</span>
      </div>
    </div>
  );
}