"use client";

import { useEffect, useRef, useState } from "react";
import { filterRows, paginateRows } from "@/utils/tableUtils";

/**
 * Busca + paginação, independentes de COMO os dados são desenhados.
 * É isso que permite trocar o visual (tabela, lista...) sem mexer na lógica.
 *
 * pageSize:
 *   "auto"  → mede quantas linhas cabem no wrapper (comportamento antigo da tabela;
 *             exige que o wrapper tenha altura própria, ex: min-height).
 *   número  → tamanho fixo; o usuário pode trocar via setPageSize (select do footer).
 */
export function useTablePagination({
  data = [],
  searchKeys = [],
  searchValue = "",
  pageSize = "auto",
}) {
  const auto = pageSize === "auto";

  const [rowsPerPage, setRowsPerPage] = useState(auto ? 1 : pageSize);
  const [currentPage, setCurrentPage] = useState(1);

  const wrapperRef = useRef(null); // área que contém as linhas
  const rowRef = useRef(null);     // primeira linha (para medir a altura)

  // pageSize numérico acompanha a prop quando o pai mudar
  useEffect(() => {
    if (!auto) setRowsPerPage(pageSize);
  }, [auto, pageSize]);

  // modo "auto": quantas linhas cabem na altura disponível
  useEffect(() => {
    if (!auto || !wrapperRef.current || !rowRef.current) return;
    const rowHeight = rowRef.current.clientHeight;
    if (!rowHeight) return;
    setRowsPerPage(Math.max(1, Math.floor(wrapperRef.current.clientHeight / rowHeight)));
  }, [auto, data]);

  // nova busca → volta para a primeira página
  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue]);

  const filtered = filterRows(data, searchKeys, searchValue);
  const { pageData, perPage, page, totalPages, from, to } = paginateRows(
    filtered,
    currentPage,
    rowsPerPage
  );

  return {
    pageData,
    filteredCount: filtered.length,
    rowsPerPage: perPage,
    from,
    to,
    canPrev: page > 1,
    canNext: page < totalPages,
    goPrev: () => setCurrentPage(page - 1),
    goNext: () => setCurrentPage(page + 1),
    setPageSize: (n) => {
      setRowsPerPage(n);
      setCurrentPage(1);
    },
    wrapperRef,
    rowRef,
  };
}
