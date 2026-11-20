"use client";

import { useEffect } from "react";

/**
 * Descobre o `left` de cada coluna fixa (position: sticky) da tabela.
 *
 * Por que precisa de JS: as colunas têm largura do CONTEÚDO (não é um valor
 * fixo). A 2ª coluna fixa precisa "grudar" exatamente onde a 1ª termina, e
 * esse valor só o navegador sabe depois de desenhar a tabela.
 *
 * Como funciona:
 *  1. As células fixas são marcadas com `data-sticky` (feito no Table.jsx).
 *  2. Medimos a largura de cada uma na PRIMEIRA linha da tabela
 *     (todas as células de uma coluna têm a mesma largura).
 *  3. Somamos as larguras em sequência e gravamos em CSS variables no
 *     wrapper: --sticky-left-0 = 0, --sticky-left-1 = largura da 1ª, ...
 *  4. O CSS/inline style de cada célula lê `left: var(--sticky-left-N)`.
 *  5. Um ResizeObserver refaz a medida sempre que a tabela ou uma célula
 *     muda de tamanho (troca de página, dados novos, rotação do celular...).
 *
 * O hook não causa re-render do React: só escreve CSS variables.
 */
export function useStickyColumns(containerRef, deps = []) {
  useEffect(() => {
    const container = containerRef.current;
    const table = container?.querySelector("table");
    if (!container || !table) return undefined;

    const getStickyCells = () => {
      const firstRow = table.rows[0];
      return firstRow ? Array.from(firstRow.querySelectorAll("[data-sticky]")) : [];
    };

    const measure = () => {
      let left = 0;
      getStickyCells().forEach((cell, slot) => {
        container.style.setProperty(`--sticky-left-${slot}`, `${left}px`);
        left += cell.getBoundingClientRect().width;
      });
    };

    let frame = 0;
    const scheduleMeasure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };

    measure();

    const observer = new ResizeObserver(scheduleMeasure);
    observer.observe(table);
    getStickyCells().forEach((cell) => observer.observe(cell));

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
