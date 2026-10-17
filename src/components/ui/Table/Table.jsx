"use client";

import React from "react";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Button from "../Button/Button";
import DeleteConfirmationModal from "../Modal/DeleteModal/DeleteModal";
import TableFooter from "./TableFooter";
import { useTablePagination } from "@/hooks/useTablePagination";
import { resolveRowKey } from "@/utils/tableUtils";
import styles from "./Table.module.css";

const SKELETON_ROWS = [1, 2, 3, 4, 5]; // linhas de skeleton enquanto os dados carregam

/**
 * Um único componente, dois visuais:
 *
 *  variant="table" (padrão) → exatamente o comportamento de antes.
 *  variant="list"           → cada registro é desenhado por `renderItem`
 *                             (ex: AvisoListItem), em um card com scroll interno.
 *
 * Busca e paginação vêm do hook useTablePagination e são iguais nas duas.
 */
export default function CustomTable({

    columns = [],
    data = [],
    isLoading,
    footer = true,
    totalRows = 0,
    headerAs = "div",
    searchValue = "",
    canRemove = false,
    onDeleteConfirm = null,
    onRowClick = null,
    variant = "table",                         // "table" | "list"
    showHeader = true,                         // cabeçalho das colunas (variant "table")
    renderItem = null,                         // variant "list": (row, index) => JSX
    rowKey = null,                            
    searchKeys = null,                        
    pageSize = variant === "list" ? 10 : "auto", 
    pageSizeOptions = null,                   
    activeRowKey = null,                       // variant "list": destaca o item selecionado
    emptyMessage = null,                       
    className = "",                          
}) {
    const isList = variant === "list";

    // busca + paginação
    const {
        pageData, filteredCount, rowsPerPage, from, to,
        canPrev, canNext, goPrev, goNext, setPageSize,
        wrapperRef, rowRef,
    } = useTablePagination({
        data,
        searchKeys: searchKeys ?? columns.map((column) => column.key),
        searchValue,
        pageSize,
    });

    // seleção + exclusão em lote (só para variant "table") ──
    const [selectedRows, setSelectedRows] = React.useState([]);
    const [showDeleteModal, setShowDeleteModal] = React.useState(false);

    const openDeleteModal = () => setShowDeleteModal(true);
    const closeDeleteModal = () => setShowDeleteModal(false);
    const handleDeleteConfirm = async (reason) => {
        if (typeof onDeleteConfirm === "function") {
            await onDeleteConfirm(selectedRows, reason);
        }

        setSelectedRows([]);
        closeDeleteModal();
    };

    // mantém a seleção pelo ID mesmo se mudar de página
    const toggleRow = (id) => {
        setSelectedRows((prev) =>
            prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
        );
    };

    const getRowKey = (row, index) => resolveRowKey(row, index, rowKey);
    const clickable = typeof onRowClick === "function";

    const footerElement = footer && (
        <TableFooter
            rowsPerPage={rowsPerPage}
            pageSizeOptions={pageSize === "auto" ? null : pageSizeOptions}
            onPageSizeChange={setPageSize}
            from={from}
            to={to}
            total={totalRows || filteredCount}
            canPrev={canPrev}
            canNext={canNext}
            onPrev={goPrev}
            onNext={goNext}
            flush={isList}
        />
    );

    //  VARIANTE: LISTA  - talvez isso vire um componente separado
    //aqui essa variante é pra exibir os dados com o componente renderItem, que é passado como prop. ou seja personlizavel.

    if (isList) {
        return (
            <div className={`${styles.listContainer} ${className}`}>
                <div ref={wrapperRef} className={styles.listBody}>
                    {isLoading ? (
                        SKELETON_ROWS.map((n) => (
                            <div key={n} className={styles.listItem}>
                                <div className={styles.skeleton} />
                            </div>
                        ))
                    ) : pageData.length === 0 ? (
                        <p className={styles.empty}>{emptyMessage ?? "Nenhum item encontrado."}</p>
                    ) : (
                        pageData.map((row, index) => {
                            const key = getRowKey(row, index);
                            const active = activeRowKey != null && String(key) === String(activeRowKey);

                            return (
                                <div
                                    key={key}
                                    ref={index === 0 ? rowRef : null}
                                    className={[
                                        styles.listItem,
                                        clickable && styles.listItemClickable,
                                        active && styles.listItemActive,
                                    ].filter(Boolean).join(" ")}
                                    role={clickable ? "button" : undefined}
                                    tabIndex={clickable ? 0 : undefined}
                                    aria-current={active || undefined}
                                    onClick={clickable ? () => onRowClick(row) : undefined}
                                    onKeyDown={clickable ? (e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            e.preventDefault();
                                            onRowClick(row);
                                        }
                                    } : undefined}
                                >
                                    {renderItem ? renderItem(row, index) : String(row[columns[0]?.key] ?? "")}
                                </div>
                            );
                        })
                    )}
                </div>

                {footerElement}
            </div>
        );
    }

    //  VARIANTE: TABELA (padrão) 
    const HeaderTag = headerAs;

    return (
        <div className={`${styles.componentWrapper} ${className}`}>
            <div style={{ minHeight: "70px" }}>
                {canRemove && selectedRows.length > 0 && (
                    <div className={styles.deleteContainer}>
                        <div className={styles.deleteWrapper}>
                            <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="0.399805" y="0.399805" width="32.8" height="32.8" rx="6.11429" stroke="#F1F1F1" strokeWidth="0.8" />
                                <path d="M12.4158 24.7998C11.9678 24.7998 11.5865 24.6425 11.2718 24.3278C10.9571 24.0131 10.7998 23.6321 10.7998 23.1848V10.7998H9.7998V9.79979H13.7998V9.02979H19.7998V9.79979H23.7998V10.7998H22.7998V23.1848C22.7998 23.6448 22.6458 24.0291 22.3378 24.3378C22.0298 24.6465 21.6451 24.8005 21.1838 24.7998H12.4158ZM21.7998 10.7998H11.7998V23.1848C11.7998 23.3641 11.8575 23.5115 11.9728 23.6268C12.0881 23.7421 12.2358 23.7998 12.4158 23.7998H21.1848C21.3381 23.7998 21.4791 23.7358 21.6078 23.6078C21.7365 23.4798 21.8005 23.3385 21.7998 23.1838V10.7998ZM14.6078 21.7998H15.6078V12.7998H14.6078V21.7998ZM17.9918 21.7998H18.9918V12.7998H17.9918V21.7998Z" fill="#F1F1F1" />
                            </svg>

                            <span> Deseja deletar {selectedRows.length} {selectedRows.length === 1 ? "item" : "itens"}?</span>
                        </div>

                        <Button variant="critical" onClick={openDeleteModal}> Excluir</Button>
                    </div>
                )}
            </div>

            <DeleteConfirmationModal
                show={showDeleteModal}
                onClose={closeDeleteModal}
                onConfirm={handleDeleteConfirm}
            />

            <div className={styles.container}>
                {showHeader && (
                    <div className={styles.header}>
                        <table className={styles.headerTable}>
                            <thead>
                                <tr>
                                    <th className={styles.checkbox}></th>
                                    {columns.map((column, index) => (
                                        <th key={index} style={{ width: `${100 / columns.length}%` }}>
                                            <HeaderTag className={styles.headerItem}>
                                                {column.label}
                                            </HeaderTag>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                        </table>
                    </div>
                )}

                <div ref={wrapperRef} className={styles.tableWrapper}>
                    <Table hover className={styles.table}>
                        <tbody>
                            {isLoading ? (
                                SKELETON_ROWS.map((rowIndex) => (
                                    <tr key={rowIndex}>
                                        {columns.map((col, colIndex) => (
                                            <td key={colIndex}>
                                                <div className={styles.skeleton}></div>
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                pageData.map((row, rowIndex) => {
                                    const handleRowClick = (e) => {
                                        if (!clickable) return;
                                        if (e.target.closest('input[type="checkbox"]')) return;
                                        onRowClick(row);
                                    };

                                    return (
                                        <tr
                                            key={getRowKey(row, rowIndex)}
                                            ref={rowIndex === 0 ? rowRef : null}
                                            onClick={handleRowClick}
                                            style={clickable ? { cursor: "pointer" } : {}}
                                        >
                                            <td className={styles.checkbox}>
                                                {canRemove ? (
                                                    <Form.Check
                                                        type="checkbox"
                                                        checked={selectedRows.includes(getRowKey(row, -1))}
                                                        onChange={() => toggleRow(getRowKey(row, -1))}
                                                    />
                                                ) : (
                                                    <div style={{ width: "16px", height: "16px" }} />
                                                )}
                                            </td>

                                            {/* `render` na definição da coluna customiza a célula:
                                                recebe o valor da célula e a linha inteira. */}
                                            {columns.map((column, columnIndex) => (
                                                <td key={columnIndex} style={{ width: `${100 / columns.length}%` }}>
                                                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                                                </td>
                                            ))}
                                        </tr>
                                    );
                                })
                            )}

                            {!isLoading && pageData.length === 0 && emptyMessage && (
                                <tr>
                                    <td colSpan={columns.length + 1} className={styles.emptyCell}>
                                        {emptyMessage}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>

                {footerElement}
            </div>
        </div>
    );
}
