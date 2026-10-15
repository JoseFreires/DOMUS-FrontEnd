"use client";

import { Modal } from "react-bootstrap";
import Button from "@/components/ui/Button/Button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/app/auth.js";

import { FaTriangleExclamation } from "react-icons/fa6";

import styles from "./ModalAlert.module.css";

export default function ModalExcluirUsuario({
    nomeUsuario,
    onConfirm,
    ...props
}) {
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState("");
    const { signOut } = useAuth();

    const router = useRouter();

    const handleHide = () => {
        if (loading) return;
        setErro("");
        props.onHide?.();
    };

    const handleConfirm = async () => {
        if (loading) return;

        setLoading(true);
        setErro("");

        try {
            await onConfirm?.();
        } catch (err) {
            console.error(err);
            setErro(err?.message || "Não foi possível excluir o usuário. Tente novamente.");
            setLoading(false);
            return; // exclusão falhou: não faz logout
        }

        // Exclusão concluída: encerra a sessão e redireciona
        try {
            await signOut();
            router.push("/pages/login");
        } catch (err) {
            console.error("Erro ao fazer logout após exclusão:", err);
        } finally {
            props.onHide?.();
            router.push("/pages/login"); // ajuste para a sua rota de login
        }
    };



    return (
        <Modal
            {...props}
            onHide={handleHide}
            centered
            backdrop={loading ? "static" : true}
            keyboard={!loading}
            dialogClassName={styles.modalDialog}
            aria-labelledby="modal-excluir-usuario-titulo"
        >
            <Modal.Body className={styles.modalBody}>
                <div className={styles.header}>
                    <div className={styles.iconWrapper} aria-hidden="true">
                        <FaTriangleExclamation size={22} />
                    </div>

                    <div>
                        <h3 id="modal-excluir-usuario-titulo" className={styles.title}>
                            Confirmar exclusão do usuário?
                        </h3>

                        <p className={styles.description}>
                            {nomeUsuario ? (
                                <>
                                    Você está prestes a excluir <strong>{nomeUsuario}</strong>.{" "}
                                </>
                            ) : (
                                "Você está prestes a excluir este usuário. "
                            )}
                            Esta ação não pode ser desfeita e todos os dados associados
                            poderão ser removidos permanentemente.
                        </p>

                        {erro && (
                            <p className={styles.error} role="alert">
                                {erro}
                            </p>
                        )}
                    </div>
                </div>

                <div className={styles.actions}>
                    <Button variant="primary" onClick={handleHide} disabled={loading}>
                        Cancelar
                    </Button>

                    <Button
                        variant="critical"
                        onClick={handleConfirm}
                        disabled={loading}
                    >
                        {loading ? "Excluindo..." : "Excluir"}
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    );
}