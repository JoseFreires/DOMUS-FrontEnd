"use client";

import { Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button/Button";
import styles from "./TermosModal.module.css";
import { termosDeUso } from "./termosDeUso";
import { IoDocumentText } from "react-icons/io5";
/**
 * Modal de termo de aceite (2 etapas, mesmo visual do DeleteModal).
 *
 *  Etapa "termo":  [Recusar] [Aceitar]
 *  Etapa "recusa": [Voltar]  [Ciente]   (Voltar retorna ao termo)
 *
 * Não fecha por X, ESC nem clique fora: o usuário precisa escolher uma opção.
 *
 * @param {boolean}  show
 * @param {function} onAccept  async — chamado ao clicar em "Aceitar" (faz o PUT e navega)
 * @param {function} onDecline chamado ao clicar em "Ciente" na etapa de recusa
 * @param {boolean}  loading   desabilita os botões enquanto o aceite está em andamento
 * @param {string}   error     mensagem de erro do aceite (exibida abaixo do termo)
 */
export default function TermosModal({
    show,
    onAccept,
    onDecline,
    loading = false,
    error = "",
}) {
    const [recusando, setRecusando] = useState(false);

    // sempre que o modal é aberto/fechado, volta para a etapa do termo
    useEffect(() => {
        if (!show) setRecusando(false);
    }, [show]);

    return (
        <Modal
            show={show}
            centered
            backdrop="static"
            keyboard={false}
            dialogClassName={styles.modalDialog}
        >
            <Modal.Body className={styles.modalBody}>
                {!recusando ? (
                    <>
                        <div className={styles.header}>
                            <div className={`${styles.iconContainer} ${styles.iconInfo}`}>
                                <IoDocumentText size={36} />
                            </div>


                            <div>
                                <h3 className={styles.title}>Termos de uso</h3>
                                <p className={styles.description}>
                                    Para acessar a plataforma, leia e aceite os
                                    termos abaixo.
                                </p>
                            </div>
                        </div>

                        <div className={styles.termsBox} tabIndex={0}>
                            {termosDeUso.map((secao) => (
                                <section key={secao.titulo} className={styles.termsSection}>
                                    <h4 className={styles.termsSectionTitle}>{secao.titulo}</h4>
                                    <p className={styles.termsSectionText}>{secao.texto}</p>
                                </section>
                            ))}
                        </div>

                        {error && <p className={styles.error}>{error}</p>}

                        <div className={styles.actions}>
                            <Button
                                variant="secondary"
                                onClick={() => setRecusando(true)}
                                disabled={loading}
                            >
                                Recusar
                            </Button>
                            <Button
                                variant="primary"
                                onClick={onAccept}
                                disabled={loading}
                            >
                                {loading ? "Salvando..." : "Aceitar"}
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className={styles.header}>
                            <div className={`${styles.iconContainer} ${styles.iconAlert}`}>
                                ⚠
                            </div>
                            <div>
                                <h3 className={styles.title}>Termos não aceitos</h3>
                                <p className={styles.description}>
                                    Caso não aceite os termos de uso, você não
                                    poderá acessar a plataforma.
                                </p>
                            </div>
                        </div>

                        <div className={styles.actions}>
                            <Button
                                variant="primary"
                                onClick={() => setRecusando(false)}
                            >
                                Voltar
                            </Button>
                            <Button variant="secondary" onClick={onDecline}>
                                Ciente
                            </Button>
                        </div>
                    </>
                )}
            </Modal.Body>
        </Modal>
    );
}