"use client";

import React from "react";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Button from "../Button/Button";
import DeleteConfirmationModal from "../Modal/DeleteModal/DeleteModal";
import TableFooter from "./TableFooter";
import { useTablePagination } from "@/hooks/useTablePagination";
import { useStickyColumns } from "@/hooks/useStickyColumns";
import { resolveRowKey } from "@/utils/tableUtils";
import styles from "./Table.module.css";
import { RiDeleteBin6Line } from "react-icons/ri";
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
    sortKey = "id",                        
    searchKeys = null,                        
    pageSize = variant === "list" ? 10 : "auto", 
    pageSizeOptions = null,                   
    activeRowKey = null,                       // variant "list": destaca o item selecionado
    emptyMessage = null,
    notice = null,
    className = "",
    stickyColumns = 1,                         // variant "table", só no mobile: quantas colunas de dados ficam fixas à esquerda
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
        sortKey,
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

    // ── colunas fixas (mobile) ──
    // "slot" = posição entre as colunas fixas. Se a coluna de checkbox existe
    // (canRemove), ela é o slot 0 e as colunas de dados vêm depois dela.

    const fixedCount = Math.min(Math.max(canRemove ? stickyColumns : 1, 0), columns.length);
    const slotOffset = canRemove ? 1 : 0;
    const lastStickySlot = slotOffset + fixedCount - 1;
    const cx = (...names) => names.filter(Boolean).join(" ");

    // atributos que uma célula (th/td) recebe quando é fixa:
    //  - data-sticky: o hook useStickyColumns acha as células por esse atributo
    //  - className: position: sticky (+ sombra na última coluna fixa)
    //  - left: lido de uma CSS variable que o hook preenche com a largura real
    const stickyProps = (slot) =>
        slot < 0 || slot > lastStickySlot
            ? {}
            : {
                "data-sticky": "",
                className: slot === lastStickySlot
                    ? cx(styles.sticky, styles.stickyEdge)
                    : styles.sticky,
                style: { left: `var(--sticky-left-${slot}, 0px)` },
            };

    // mede a largura real das colunas fixas e publica o `left` de cada uma
    useStickyColumns(wrapperRef, [pageData, isLoading, columns.length, canRemove, fixedCount]);

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
                {notice ?? (canRemove && selectedRows.length > 0 && (
                    <div className={styles.deleteContainer}>
                        <div className={styles.deleteWrapper}>

                            <div className={styles.deleteIconWrapper}>
                                <RiDeleteBin6Line size={24}/>
                            </div>
                            <span> Deseja deletar {selectedRows.length} {selectedRows.length === 1 ? "item" : "itens"}?</span>
                        </div>

                        <Button variant="critical" onClick={openDeleteModal}> Excluir</Button>
                    </div>
                ))}
            </div>

            <DeleteConfirmationModal
                show={showDeleteModal}
                onClose={closeDeleteModal}
                onConfirm={handleDeleteConfirm}
            />

            <div className={styles.container}>
                {/* UMA única <table> (thead + tbody) dentro do wrapper que rola:
                    assim cabeçalho e linhas compartilham as mesmas larguras de coluna
                    e rolam juntos na horizontal. */}
                <div ref={wrapperRef} className={styles.tableWrapper}>
                    <Table hover className={styles.table} style={{ "--cols": columns.length }}>
                        {showHeader && (
                            <thead>
                                <tr>
                                    {(() => {
                                        const sticky = canRemove ? stickyProps(0) : {};
                                        return (
                                            <th
                                                {...sticky}
                                                className={cx(styles.checkbox, !canRemove && styles.checkboxEmpty, sticky.className)}
                                            >
                                                {/* indica que esta coluna serve para selecionar o que será excluído */}
                                                {canRemove && (
                                                    <RiDeleteBin6Line
                                                        size={18}
                                                        className={styles.deleteHeaderIcon}
                                                        role="img"
                                                        aria-label="Selecione os itens que deseja excluir"
                                                        title="Selecione os itens que deseja excluir"
                                                    />
                                                )}
                                            </th>
                                        );
                                    })()}
                                    {columns.map((column, index) => {
                                        const sticky = index < fixedCount ? stickyProps(slotOffset + index) : {};
                                        return (
                                            <th key={index} {...sticky}>
                                                <HeaderTag className={styles.headerItem}>
                                                    {column.label}
                                                </HeaderTag>
                                            </th>
                                        );
                                    })}
                                </tr>
                            </thead>
                        )}
                        <tbody>
                            {isLoading ? (
                                SKELETON_ROWS.map((rowIndex) => (
                                    <tr key={rowIndex}>
                                        {/* mesma quantidade de células do cabeçalho, senão as colunas desalinham */}
                                        {(() => {
                                            const sticky = canRemove ? stickyProps(0) : {};
                                            return (
                                                <td
                                                    {...sticky}
                                                    className={cx(styles.checkbox, !canRemove && styles.checkboxEmpty, sticky.className)}
                                                />
                                            );
                                        })()}
                                        {columns.map((col, colIndex) => {
                                            const sticky = colIndex < fixedCount ? stickyProps(slotOffset + colIndex) : {};
                                            return (
                                                <td key={colIndex} {...sticky}>
                                                    <div className={styles.skeleton}></div>
                                                </td>
                                            );
                                        })}
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
                                            {(() => {
                                                const sticky = canRemove ? stickyProps(0) : {};
                                                return (
                                                    <td
                                                        {...sticky}
                                                        className={cx(styles.checkbox, !canRemove && styles.checkboxEmpty, sticky.className)}
                                                    >
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
                                                );
                                            })()}

                                            {/* `render` na definição da coluna customiza a célula:
                                                recebe o valor da célula e a linha inteira. */}
                                            {columns.map((column, columnIndex) => {
                                                const sticky = columnIndex < fixedCount ? stickyProps(slotOffset + columnIndex) : {};
                                                return (
                                                    <td key={columnIndex} {...sticky}>
                                                        {column.render ? column.render(row[column.key], row) : row[column.key]}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    );
                                })
                            )}

                            {!isLoading && pageData.length === 0 && emptyMessage && (
                                <tr>
                                    <td colSpan={columns.length + 1} className={styles.emptyCell}>
                                        {/* sticky: a mensagem fica visível mesmo com a tabela rolada */}
                                        <span className={styles.emptyContent}>{emptyMessage}</span>
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