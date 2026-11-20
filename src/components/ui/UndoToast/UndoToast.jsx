"use client";

import { FiCheck } from "react-icons/fi";
import styles from "./UndoToast.module.css";

/**
 * Barra de confirmação com "Desfazer" e contagem regressiva.
 * Renderizada no mesmo slot da barra de exclusão da Table (prop `notice`).
 */
export default function UndoToast({
  status,                     // "pending" | "committing" | "success"
  token,                      // muda a cada novo registro → reinicia a animação
  delayMs = 6000,
  paused = false,
  messagePending = "Encomenda será registrada em instantes",
  messageCommitting = "Registrando encomenda…",
  messageSuccess = "Encomenda registrada com sucesso",
  onUndo,
  onPause,
  onResume,
}) {
  if (!status || status === "idle") return null;

  const message =
    status === "pending" ? messagePending
    : status === "committing" ? messageCommitting
    : messageSuccess;

  const mostrarDesfazer = status === "pending";

  return (
    <div
      className={styles.toast}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      onMouseEnter={onPause}
      onMouseLeave={onResume}
      onFocusCapture={onPause}
      onBlurCapture={onResume}
    >
      <div className={styles.content}>
        <span className={styles.check} aria-hidden="true">
          <FiCheck size={20} />
        </span>
        <span className={styles.message}>{message}</span>
      </div>

      {mostrarDesfazer && (
        <button type="button" className={styles.undo} onClick={onUndo}>
          Desfazer
        </button>
      )}

      {mostrarDesfazer && (
        <div className={styles.track} aria-hidden="true">
          <div
            key={token}
            className={styles.bar}
            style={{
              animationDuration: `${delayMs}ms`,
              animationPlayState: paused ? "paused" : "running",
            }}
          />
        </div>
      )}
    </div>
  );
}