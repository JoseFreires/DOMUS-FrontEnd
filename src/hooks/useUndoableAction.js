"use client";

import { useState, useRef, useCallback, useEffect } from "react";

/**
 * Padrão "desfazer antes de enviar" (undo send).
 *
 * Fluxo:  idle ──schedule──▶ pending ──(delayMs)──▶ committing ──▶ success
 *                              │                         └──erro──▶ idle + onFailed(draft)
 *                              └──undo──▶ idle + onUndo(draft)
 *
 * Garantias para não perder dados:
 *  - o payload só sai da memória depois que `commit` conclui com sucesso;
 *  - Desfazer e envio nunca acontecem juntos (máquina de estados em ref, sem corrida);
 *  - novo `schedule` durante a espera envia imediatamente o anterior (nada é descartado);
 *  - ao desmontar a tela (navegação interna) o pendente é enviado na hora;
 *  - ao fechar/recarregar a aba durante a espera o navegador pede confirmação;
 *  - falha no envio devolve o payload em `onFailed` para reabrir o formulário.
 *
 * @param {object}   p
 * @param {number}   p.delayMs               tempo para desfazer (padrão 6000)
 * @param {function} p.commit(payload)       envio real (ex.: createEncomenda)
 * @param {function} p.onCommitted(payload)  após sucesso (ex.: recarregar a lista)
 * @param {function} p.onUndo(payload)       usuário clicou em Desfazer
 * @param {function} p.onFailed(payload, error, { unmounted })  envio falhou
 * @param {number}   p.successDurationMs     quanto tempo mostrar "registrada" (padrão 3000)
 */
export function useUndoableAction({
  delayMs = 6000,
  commit,
  onCommitted,
  onUndo,
  onFailed,
  successDurationMs = 3000,
}) {
  const [view, setView] = useState({ status: "idle", token: 0, paused: false });

  // fonte da verdade (evita corrida entre clique e timer)
  const slot = useRef({ status: "idle", payload: null, token: 0 });
  const timerRef = useRef(null);
  const successTimerRef = useRef(null);
  const remainingRef = useRef(delayMs);
  const startedAtRef = useRef(0);
  const mountedRef = useRef(true);

  // callbacks sempre atualizados sem recriar funções
  const cb = useRef({});
  cb.current = { commit, onCommitted, onUndo, onFailed };

  const publish = useCallback((status, paused = false) => {
    slot.current.status = status;
    if (mountedRef.current) {
      setView({ status, token: slot.current.token, paused });
    }
  }, []);

  /** Envia um payload. `token` liga o resultado ao toast atual (null = sem UI). */
  const commitPayload = useCallback(async (payload, token) => {
    const ownsUi = () => token !== null && slot.current.token === token;

    try {
      await cb.current.commit?.(payload);
    } catch (error) {
      if (ownsUi()) {
        slot.current.payload = null;
        publish("idle");
      }
      cb.current.onFailed?.(payload, error, { unmounted: !mountedRef.current });
      return;
    }

    if (ownsUi()) {
      slot.current.payload = null;
      publish("success");
      clearTimeout(successTimerRef.current);
      successTimerRef.current = setTimeout(() => {
        if (slot.current.token === token && slot.current.status === "success") {
          publish("idle");
        }
      }, successDurationMs);
    }

    // erro ao atualizar a lista NÃO significa que o envio falhou
    try {
      await cb.current.onCommitted?.(payload);
    } catch (error) {
      console.error("Registro enviado, mas falhou ao atualizar a lista:", error);
    }
  }, [publish, successDurationMs]);

  const startTimer = useCallback((ms) => {
    clearTimeout(timerRef.current);
    startedAtRef.current = Date.now();
    remainingRef.current = ms;
    timerRef.current = setTimeout(() => {
      const s = slot.current;
      if (s.status !== "pending") return;       // já desfeito
      const { payload, token } = s;
      publish("committing");                    // a partir daqui Desfazer não existe mais
      commitPayload(payload, token);
    }, ms);
  }, [publish, commitPayload]);

  /** Agenda o envio. Se já havia um pendente, envia o anterior agora. */
  const schedule = useCallback((payload) => {
    const prev = slot.current;
    if (prev.status === "pending" && prev.payload) {
      clearTimeout(timerRef.current);
      commitPayload(prev.payload, null);        // sem UI, mas com onFailed
    }
    clearTimeout(successTimerRef.current);

    slot.current = { status: "pending", payload, token: prev.token + 1 };
    publish("pending");
    startTimer(delayMs);
  }, [commitPayload, publish, startTimer, delayMs]);

  /** Desfazer: só vale enquanto estiver `pending`. */
  const undo = useCallback(() => {
    const s = slot.current;
    if (s.status !== "pending") return;
    clearTimeout(timerRef.current);
    const payload = s.payload;
    slot.current = { ...s, status: "idle", payload: null };
    publish("idle");
    cb.current.onUndo?.(payload);
  }, [publish]);

  /** Pausa a contagem (hover/foco) — WCAG 2.2.1 Timing Adjustable. */
  const pause = useCallback(() => {
    if (slot.current.status !== "pending" || view.paused) return;
    clearTimeout(timerRef.current);
    remainingRef.current = Math.max(
      0,
      remainingRef.current - (Date.now() - startedAtRef.current),
    );
    publish("pending", true);
  }, [publish, view.paused]);

  const resume = useCallback(() => {
    if (slot.current.status !== "pending" || !view.paused) return;
    publish("pending", false);
    startTimer(remainingRef.current);
  }, [publish, startTimer, view.paused]);

  const dismiss = useCallback(() => {
    if (slot.current.status === "success") publish("idle");
  }, [publish]);

  // Tela saindo do ar com envio pendente → envia imediatamente
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      clearTimeout(timerRef.current);
      clearTimeout(successTimerRef.current);
      const s = slot.current;
      if (s.status === "pending" && s.payload) {
        commitPayload(s.payload, null);
      }
    };
  }, [commitPayload]);

  // Fechar/recarregar a aba enquanto há envio pendente → confirmação do navegador
  const busy = view.status === "pending" || view.status === "committing";
  useEffect(() => {
    if (!busy) return;
    const handler = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [busy]);

  return {
    schedule, undo, pause, resume, dismiss,
    status: view.status,
    paused: view.paused,
    token: view.token,
    delayMs,
  };
}