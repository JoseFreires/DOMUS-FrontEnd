"use client";
 
import { useCallback, useSyncExternalStore } from "react";
 /**
 * true/false conforme a media query, sem erro de hidratação.
 * No servidor devolve `serverDefault`; no navegador passa a refletir a tela
 * de verdade e acompanha redimensionamento/rotação.
 *
 *   const isDesktop = useMediaQuery("(min-width: 768px)");
 */
export function useMediaQuery(query, serverDefault = false) {
  const subscribe = useCallback(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query]
  );
 
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverDefault
  );
}