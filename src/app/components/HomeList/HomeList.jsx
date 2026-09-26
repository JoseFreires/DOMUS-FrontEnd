"use client";

import Link from "next/link";
import Title from "@/app/components/Title/Title";
import styles from "./HomeList.module.css";

export default function HomeList({
  title,
  data = [],
  renderItem,
  viewAllHref,
  limit = 10,
  isLoading = false,
  emptyMessage = "Nenhum item encontrado.",
  className
}) {
  const items = (data ?? []).slice(0, limit);

  return (
    <div className={`${className ?? ""} ${styles.container}`}>
      <Title Text={title || "Titulo"} />

      <div className={styles.card}>

        {/* ── Área com scroll interno ── */}
        <div className={styles.list}>
          {isLoading ? (
            <p className={styles.emptyState}>Carregando...</p>
          ) : items.length === 0 ? (
            <p className={styles.emptyState}>{emptyMessage}</p>
          ) : (
            items.map((item, index) => (
              <div key={item.id ?? index} className={styles.row}>
                {renderItem(item, index)}
              </div>
            ))
          )}
        </div>

        {/* ── Rodapé fixo fora do scroll ── */}
        {viewAllHref && (
          <div className={styles.footer}>
            <Link href={viewAllHref} className={styles.viewAllLink}>
              Ver Todos
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}