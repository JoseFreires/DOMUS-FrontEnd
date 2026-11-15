"use client";

import { Modal, Form } from "react-bootstrap";
import Button from "@/components/ui/Button/Button";
import { useState } from "react";
import styles from "./DeleteModal.module.css";

export default function DeleteConfirmationModal({
    show,
    onClose,
    onConfirm,
    title = "Confirmar exclusão?",
    message = "Esta alteração é permanente e não poderá ser desfeita.\nPara prosseguir, é necessário informar o motivo da exclusão no campo abaixo.",
    confirmLabel = "Excluir",
}) {
    const [reason, setReason] = useState("");
    const [customReason, setCustomReason] = useState("");

    const handleClose = () => {
        setReason("");
        setCustomReason("");
        onClose?.();
    };

    const handleConfirm = () => {
        const finalReason =
            reason === "other" ? customReason : reason;

        if (onConfirm) {
            onConfirm(finalReason);
        }

        handleClose();
    };

    return (
        <Modal
            show={show}
            onHide={handleClose}
            centered
            dialogClassName={styles.modalDialog}
        >
            <Modal.Body className={styles.modalBody}>
                <button
                    className={styles.closeButton}
                    onClick={handleClose}
                >
                    ×
                </button>

                <div className={styles.header}>
                    <div className={styles.iconContainer}>
                        ⚠
                    </div>

                    <div>
                        <h3 className={styles.title}>{title}</h3>

                        <p className={styles.description}>{message}</p>
                    </div>
                </div>

                <div className={styles.actions}>
                    <Button variant="primary" onClick={handleClose} >
                        Cancelar
                    </Button>

                    <Button variant="secondary" onClick={handleConfirm}>
                        {confirmLabel}
                    </Button>

                </div>
            </Modal.Body>
        </Modal>
    );
}