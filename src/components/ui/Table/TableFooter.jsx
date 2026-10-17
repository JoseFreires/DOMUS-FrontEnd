"use client";

import styles from "./Table.module.css";

// Rodapé de paginação — o mesmo para qualquer variante.
export default function TableFooter({
  rowsPerPage,
  pageSizeOptions = null, // ex: [5, 10, 20] → vira um <select>; sem isso, só mostra o número
  onPageSizeChange,
  from,
  to,
  total,
  canPrev,
  canNext,
  onPrev,
  onNext,
  flush = false, // true quando o footer fica dentro de um card (sem borda própria)
}) {
  // garante que o valor atual sempre exista entre as opções do <select>
  const options = pageSizeOptions?.length
    ? [...new Set([...pageSizeOptions, rowsPerPage])].sort((a, b) => a - b)
    : null;

  return (
    <div className={`${styles.footer} ${flush ? styles.footerFlush : ""}`}>
      <span>
        Linhas por página:{" "}
        {options ? (
          <select
            className={styles.pageSizeSelect}
            value={rowsPerPage}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            aria-label="Linhas por página"
          >
            {options.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        ) : (
          rowsPerPage
        )}
      </span>

      <div className={styles.pagination}>
        <span>
          {from}-{to} de {total}
        </span>

        <button type="button" onClick={onPrev} disabled={!canPrev} aria-label="Página anterior">
          {"<"}
        </button>
        <button type="button" onClick={onNext} disabled={!canNext} aria-label="Próxima página">
          {">"}
        </button>
      </div>
    </div>
  );
}
